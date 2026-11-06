"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS } from "@/lib/data";
import SectionTitle from "./SectionTitle";

/** Timeline that draws itself as you scroll; each step lights up when the line reaches it. */
export default function Process() {
  const root = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !fill.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(root.current.querySelectorAll<HTMLElement>("[data-step]"));

    if (reduce) {
      gsap.set(fill.current, { scaleY: 1 });
      items.forEach((el) => el.setAttribute("data-on", "true"));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 62%", end: "bottom 62%", scrub: 0.6 } });

      items.forEach((el, i) => {
        const card = el.querySelector("[data-card]");
        const side = i % 2 === 0 ? -1 : 1;
        gsap.from(card, {
          opacity: 0,
          x: side * 70,
          rotateY: side * -38,
          transformPerspective: 900,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        });
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          onEnter: () => el.setAttribute("data-on", "true"),
          onLeaveBack: () => el.setAttribute("data-on", "false"),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" aria-labelledby="process-title" className="slab relative bg-paper pb-24 sm:pb-32 [--slab:64px]">
      <div className="container-x">
        <SectionTitle id="process-title" lines={["Our work process."]} text="A clear, predictable path from the first conversation to launch and beyond." center />

        <ol ref={root} className="relative mx-auto mt-16 max-w-4xl">
          {/* track + animated fill */}
          <div aria-hidden className="absolute bottom-2 left-[22px] top-2 w-[3px] rounded bg-char/12 md:left-1/2 md:-translate-x-1/2" />
          <div ref={fill} aria-hidden className="absolute bottom-2 left-[22px] top-2 w-[3px] origin-top rounded md:left-1/2 md:-translate-x-1/2" style={{ background: "linear-gradient(180deg,#FFF000,#ED3038)", transform: "scaleY(0)" }} />

          {PROCESS.map((s, i) => (
            <li key={s.title} data-step data-on="false" className="group relative grid grid-cols-[48px_1fr] gap-5 pb-12 last:pb-0 md:grid-cols-[1fr_48px_1fr] md:gap-8">
              <span className={`relative z-10 grid h-12 w-12 place-items-center rounded-full bg-char text-lg font-extrabold text-brand-yellow ring-4 ring-paper transition-all duration-500 group-data-[on=true]:scale-110 group-data-[on=true]:bg-brand-red group-data-[on=true]:text-white md:col-start-2 md:row-start-1`}>
                {i + 1}
              </span>
              <div data-card className={`rounded-2xl bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,0,0,.35)] ring-1 ring-char/8 transition-shadow duration-500 group-data-[on=true]:shadow-[0_24px_50px_-20px_rgba(237,48,56,.4)] md:row-start-1 ${i % 2 === 0 ? "md:col-start-1 md:text-right" : "md:col-start-3"}`}>
                <h3 className="text-xl font-extrabold text-char">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-[#555]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
