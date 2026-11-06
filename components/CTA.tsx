"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/data";

const LINES = ["LET’S BUILD", "SOMETHING", "AMAZING", "TOGETHER."];
// Stacked shadows turn flat CSS text into a solid, extruded 3D slab
const EXTRUDE = Array.from({ length: 16 }, (_, i) => `${(i + 1) * 0.35}px ${(i + 1) * 1}px 0 #8d1219`).join(",") + ",0 34px 44px rgba(0,0,0,.38)";

export default function CTA() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!section.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      // Scroll-linked: every line tumbles in from depth, one after another
      const tl = gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top 78%", end: "center 52%", scrub: 0.8 } });
      lines.forEach((l, i) => {
        tl.fromTo(l, { rotateX: -78, z: -260, y: 60, opacity: 0, transformOrigin: "50% 100%" }, { rotateX: 0, z: 0, y: 0, opacity: 1, ease: "power2.out", duration: 1 }, i * 0.28);
      });
      // ...and the whole block keeps drifting in depth while the section is on screen
      gsap.to(stage.current, { rotateX: 7, y: -30, ease: "none", scrollTrigger: { trigger: section.current, start: "center 50%", end: "bottom top", scrub: true } });
      gsap.to("[data-orb]", { y: -120, ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, section);
    return () => ctx.revert();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !stage.current) return;
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    gsap.to(stage.current, { "--ty": `${px * 12}deg`, "--tx": `${-py * 8}deg`, duration: 0.6, ease: "power2.out", overwrite: "auto" });
  };

  return (
    <section ref={section} id="start" aria-labelledby="cta-title" onPointerMove={onMove} className="on-dark slab relative overflow-hidden pb-28 text-center sm:pb-36 [--slab:64px]" style={{ background: "linear-gradient(125deg,#ED3038 0%,#b81d25 55%,#8d1219 100%)" }}>
      <div data-orb aria-hidden className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-yellow/25 blur-[90px]" />
      <div data-orb aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-black/25 blur-[100px]" />

      <div className="container-x relative">
        <div className="[perspective:1100px]">
          <div ref={stage} style={{ transformStyle: "preserve-3d", transform: "rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg))" }}>
            <h2 id="cta-title" aria-label="Let’s build something amazing together." className="text-[clamp(2.5rem,10.5vw,8.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]">
              {LINES.map((l, i) => (
                <span key={l} data-line aria-hidden className="block will-change-transform" style={{ color: i % 2 ? "#FFF000" : "#fff", textShadow: EXTRUDE, transformStyle: "preserve-3d" }}>
                  {l}
                </span>
              ))}
            </h2>
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-[58ch] text-base leading-relaxed text-white/90 sm:text-lg">
          Have an idea, business requirement, or creative project? Let’s turn it into reality with innovative technology and professional digital solutions.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn btn-yellow">
            Start Your Project <ArrowRight size={18} aria-hidden />
          </a>
          <a href="#contact" className="btn !bg-white !text-char hover:!bg-char hover:!text-white">
            Get a Free Quote
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
