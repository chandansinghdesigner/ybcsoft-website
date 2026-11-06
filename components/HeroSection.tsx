"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HERO_HEADLINE, HERO_WORDS } from "@/lib/data";
import { INTRO, OUT, activeWord, clamp, progressForWord, smoothstep } from "@/lib/heroTimeline";

// Three.js is heavy: load it only in the browser, after the first paint.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Mode = "pending" | "webgl" | "static";

const HEADLINE_A = ["WE", "BUILD", "DIGITAL", "EXPERIENCES"];
const HEADLINE_B = ["THAT", "MOVE", "BUSINESSES", "FORWARD."];

function Headline({ animate }: { animate: boolean }) {
  const word = (w: string, i: number, tone: string) => (
    <span key={w + i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className={`inline-block ${tone}`}
        initial={animate ? { y: "110%", rotateX: -50 } : false}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: "50% 100%" }}
      >
        {w}
      </motion.span>
    </span>
  );
  return (
    <h1
      aria-label={HERO_HEADLINE}
      className="max-w-[16ch] text-[clamp(2.1rem,6.4vw,5.6rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.035em] text-white sm:max-w-[18ch] lg:max-w-[20ch]"
    >
      <span aria-hidden="true" className="block">
        {HEADLINE_A.map((w, i) => word(w, i, ""))}
      </span>
      <span aria-hidden="true" className="block">
        {HEADLINE_B.map((w, i) => word(w, i + HEADLINE_A.length, "text-brand-yellow"))}
      </span>
    </h1>
  );
}

function IntroCopy({ delay }: { delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.8 }} className="mt-7 max-w-[56ch]">
      <p className="text-base leading-relaxed text-white/75 sm:text-lg">
        YBCSOFT is a complete digital partner for businesses, startups, entrepreneurs and individuals worldwide: software, web and mobile apps, IT services and video production, from one dependable team.
      </p>
      <div className="mt-7 flex flex-wrap gap-3 on-dark">
        <a href="#contact" className="btn btn-yellow">
          Get a Free Quote <ArrowRight size={18} aria-hidden />
        </a>
        <a href="#services" className="btn btn-ghost">
          Explore Our Services
        </a>
      </div>
    </motion.div>
  );
}

/** Shown to reduced-motion users and browsers without WebGL: same content, no pinning or camera flight. */
function StaticHero() {
  return (
    <div className="relative overflow-hidden bg-deep pb-20 pt-32 on-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 50% at 85% 5%, rgba(237,48,56,.28), transparent 60%), radial-gradient(50% 45% at 5% 95%, rgba(255,240,0,.14), transparent 60%)" }} />
      <div className="container-x relative">
        <Headline animate={false} />
        <IntroCopy delay={0} />
        <ul className="mt-16 divide-y divide-white/15 border-y border-white/15">
          {HERO_WORDS.map((w) => (
            <li key={w.lines.join(" ")} className="grid gap-2 py-6 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
              <span className="text-[clamp(1.6rem,4.4vw,3.2rem)] font-extrabold leading-none tracking-tight" style={{ color: w.color }}>
                {w.lines.join(" ")}
              </span>
              <span className="text-white/70">{w.caption}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [mode, setMode] = useState<Mode>("pending");
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(-1);

  const wrap = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const activeRef = useRef(-1);

  /* Decide: full WebGL experience vs accessible static fallback */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      let gl = false;
      try {
        const c = document.createElement("canvas");
        gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        gl = false;
      }
      setMode(mq.matches || !gl ? "static" : "webgl");
    };
    decide();
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  /* Pause rendering whenever the hero is off-screen or the tab is hidden */
  useEffect(() => {
    if (mode !== "webgl" || !wrap.current) return;
    let visible = true;
    const sync = () => setInView(visible && !document.hidden);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { rootMargin: "120px" });
    io.observe(wrap.current);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [mode]);

  /* GSAP ScrollTrigger: scrub scroll position → hero timeline */
  useEffect(() => {
    if (mode !== "webgl" || !wrap.current) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const proxy = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        v: 1,
        ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: 0.9 },
        onUpdate: () => {
          const p = proxy.v;
          progress.current = p;

          // headline dissolves in 3D as the first word flies in
          const t = smoothstep(0.012, INTRO * 0.9, p);
          if (intro.current) {
            intro.current.style.opacity = String(1 - t);
            intro.current.style.visibility = t > 0.98 ? "hidden" : "visible";
            intro.current.style.transform = `perspective(1100px) translate3d(0, ${-t * 9}vh, ${t * 180}px) rotateX(${t * 22}deg) scale(${1 + t * 0.06})`;
            intro.current.style.filter = t > 0.01 ? `blur(${t * 7}px)` : "none";
          }
          if (cue.current) cue.current.style.opacity = String(1 - smoothstep(0, 0.03, p));
          if (bar.current) bar.current.style.transform = `scaleY(${clamp((p - INTRO) / (OUT - INTRO))})`;

          // dissolve into the next section
          const o = clamp((p - OUT) / (1 - OUT));
          if (bloom.current) bloom.current.style.opacity = String(Math.sin(Math.PI * o) * 0.55);
          if (veil.current) veil.current.style.opacity = String(Math.pow(o, 1.4));

          const a = activeWord(p);
          if (a !== activeRef.current) {
            activeRef.current = a;
            setActive(a);
          }
        },
      });
    }, wrap);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [mode]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  const goToWord = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + progressForWord(i) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (mode === "static") {
    return (
      <section id="home" aria-label="YBCSOFT introduction">
        <StaticHero />
      </section>
    );
  }

  return (
    <section ref={wrap} id="home" aria-label="YBCSOFT introduction" className="hero-pin relative h-[640svh] bg-deep sm:h-[700svh]">
      <noscript>
        <style>{`.hero-pin{height:auto!important}.hero-stage{position:relative!important;height:auto!important;min-height:100svh}`}</style>
      </noscript>

      {/* Screen-reader/SEO list of what the 3D words say */}
      <ul className="sr-only">
        {HERO_WORDS.map((w) => (
          <li key={w.lines.join(" ")}>
            {w.lines.join(" ")}: {w.caption}
          </li>
        ))}
      </ul>

      <div className="hero-stage sticky top-0 h-[100svh] w-full overflow-hidden on-dark" onPointerMove={onPointerMove} onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}>
        {/* backdrop */}
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 85% 8%, rgba(237,48,56,.30), transparent 62%), radial-gradient(55% 48% at 6% 98%, rgba(255,240,0,.16), transparent 62%), linear-gradient(180deg,#2a2a2a 0%,#242424 55%,#1d1d1d 100%)" }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 72%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 72%)" }} />

        {/* WebGL canvas */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          {mode === "webgl" && <HeroScene progress={progress} pointer={pointer} active={inView} onReady={() => setReady(true)} />}
        </div>

        {/* Intro headline (real <h1> for SEO + readability) */}
        <div ref={intro} className="absolute inset-0 z-10 flex items-center will-change-transform" style={{ transformOrigin: "50% 60%" }}>
          <div className="container-x pt-16">
            <Headline animate />
            <IntroCopy delay={1.1} />
          </div>
        </div>

        {/* Caption for the word in focus */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center px-6 sm:bottom-12" aria-live="polite">
          <AnimatePresence mode="wait">
            {active >= 0 && (
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.45 }}
                className="max-w-[46ch] rounded-2xl bg-black/35 px-5 py-3 text-center text-sm leading-relaxed text-white/90 backdrop-blur-md sm:text-base"
              >
                {HERO_WORDS[active].caption}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Progress rail: also lets people jump straight to a service */}
        <nav aria-label="Jump to a service" className="absolute right-2 top-1/2 z-20 -translate-y-1/2 sm:right-6">
          <div className="relative flex flex-col items-end gap-1">
            <div aria-hidden className="absolute right-[15px] top-3 bottom-3 w-px bg-white/20 sm:right-[17px]" />
            <div aria-hidden ref={bar} className="absolute right-[15px] top-3 bottom-3 w-px origin-top scale-y-0 bg-brand-yellow sm:right-[17px]" />
            {HERO_WORDS.map((w, i) => (
              <button key={i} onClick={() => goToWord(i)} aria-label={`Go to ${w.lines.join(" ")}`} aria-current={active === i} className="group relative flex h-8 items-center gap-3 pl-4 pr-1 sm:h-9">
                <span className={`hidden whitespace-nowrap text-xs font-semibold tracking-wide transition-all md:block translate-x-2 text-white/80 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100`}>
                  {w.lines.join(" ")}
                </span>
                <span className={`relative z-10 block rounded-full transition-all duration-300 ${active === i ? "h-3.5 w-3.5 bg-brand-yellow shadow-[0_0_0_6px_rgba(255,240,0,.18)]" : "h-2.5 w-2.5 bg-white/45 group-hover:bg-white"}`} />
              </button>
            ))}
          </div>
        </nav>

        {/* Scroll cue */}
        <div ref={cue} className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold text-white/70 sm:flex" aria-hidden>
          Scroll to explore
          <span className="block h-10 w-px overflow-hidden bg-white/20">
            <span className="block h-full w-full bg-brand-yellow" style={{ animation: "scroll-cue 1.8s ease-in-out infinite" }} />
          </span>
          <ChevronDown size={14} className="-mt-1" />
        </div>

        {/* Dissolve into the next section */}
        <div ref={bloom} aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-0" style={{ background: "radial-gradient(circle at 50% 50%, #FFF000 0%, #ED3038 38%, transparent 70%)" }} />
        <div ref={veil} aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-deep opacity-0" />

        {/* WebGL loading hint */}
        {!ready && (
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2 text-xs font-semibold text-white/50">
            Loading 3D scene…
          </div>
        )}
      </div>
    </section>
  );
}
