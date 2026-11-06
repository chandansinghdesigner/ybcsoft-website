"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Clapperboard, Cloud, Code2, Database, Palette, Smartphone } from "lucide-react";
import { ABOUT_STATS } from "@/lib/data";
import CountUp from "./CountUp";
import SectionTitle from "./SectionTitle";
import Tilt from "./Tilt";

// Each cube face is a discipline; `rot` is the rotation that brings that face to the front.
const FACES = [
  { id: "software", label: "Software", Icon: Code2, face: "translateZ(var(--h))", rot: "rotateX(-14deg) rotateY(0deg)", color: "#FFF000" },
  { id: "mobile", label: "Mobile", Icon: Smartphone, face: "rotateY(90deg) translateZ(var(--h))", rot: "rotateX(-14deg) rotateY(-90deg)", color: "#ED3038" },
  { id: "cloud", label: "Cloud", Icon: Cloud, face: "rotateY(180deg) translateZ(var(--h))", rot: "rotateX(-14deg) rotateY(-180deg)", color: "#FFFFFF" },
  { id: "design", label: "Design", Icon: Palette, face: "rotateY(-90deg) translateZ(var(--h))", rot: "rotateX(-14deg) rotateY(-270deg)", color: "#FFF000" },
  { id: "video", label: "Video", Icon: Clapperboard, face: "rotateX(90deg) translateZ(var(--h))", rot: "rotateX(-90deg) rotateY(0deg)", color: "#ED3038" },
  { id: "data", label: "Data", Icon: Database, face: "rotateX(-90deg) translateZ(var(--h))", rot: "rotateX(90deg) rotateY(0deg)", color: "#FFFFFF" },
] as const;

function TechCube() {
  const [face, setFace] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });
  const sweep = useTransform(scrollYProgress, [0, 1], [-28, 28]); // scroll-linked yaw of the whole stage
  const lift = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div ref={stage} className="relative mx-auto w-full max-w-[460px]">
      <Tilt max={7} glare={false} className="mx-auto aspect-square w-full">
        <motion.div style={{ rotateY: reduce ? 0 : sweep, y: reduce ? 0 : lift, transformStyle: "preserve-3d" }} className="absolute inset-0 grid place-items-center [perspective:900px]">
          {/* glow */}
          <div aria-hidden className="absolute h-[60%] w-[60%] rounded-full bg-brand-red/30 blur-[70px]" />
          <div aria-hidden className="absolute -right-2 bottom-8 h-[34%] w-[34%] rounded-full bg-brand-yellow/20 blur-[60px]" />

          {/* orbit rings */}
          {[
            { size: "96%", tilt: "rotateX(72deg) rotateY(-8deg)", dur: "18s", dot: "#FFF000" },
            { size: "74%", tilt: "rotateX(72deg) rotateY(22deg)", dur: "13s", dot: "#ED3038" },
          ].map((o) => (
            <div key={o.size} aria-hidden className="absolute" style={{ width: o.size, height: o.size, transform: o.tilt, transformStyle: "preserve-3d" }}>
              <div className="relative h-full w-full rounded-full border border-dashed border-white/25" style={{ animation: `orbit-ring ${o.dur} linear infinite` }}>
                <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: o.dot, boxShadow: `0 0 18px ${o.dot}` }} />
              </div>
            </div>
          ))}

          {/* the cube */}
          <div className="relative [--h:76px] sm:[--h:84px]" style={{ width: "calc(var(--h) * 2)", height: "calc(var(--h) * 2)", transformStyle: "preserve-3d" }}>
            <div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                transform: face === null ? undefined : FACES[face].rot,
                transition: face === null ? undefined : "transform 0.9s cubic-bezier(.2,.8,.2,1)",
                animation: face === null && !reduce ? "orbit-spin 20s linear infinite" : undefined,
              }}
            >
              {FACES.map(({ id, label, Icon, face: t, color }) => (
                <div key={id} className="glass absolute inset-0 grid place-items-center rounded-2xl" style={{ transform: t, backfaceVisibility: "visible", boxShadow: "inset 0 0 30px rgba(255,255,255,.06), 0 0 0 1px rgba(255,255,255,.08)" }}>
                  <div className="flex flex-col items-center gap-2">
                    <Icon size={42} color={color} strokeWidth={1.8} />
                    <span className="text-[0.72rem] font-bold tracking-wide text-white/85">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Tilt>

      {/* Interactive legend: hover / focus / tap a discipline to turn the cube */}
      <div className="mt-2 flex flex-wrap justify-center gap-2" onMouseLeave={() => setFace(null)}>
        {FACES.map(({ id, label, Icon, color }, i) => (
          <button
            key={id}
            onMouseEnter={() => setFace(i)}
            onFocus={() => setFace(i)}
            onBlur={() => setFace(null)}
            onClick={() => setFace((f) => (f === i ? null : i))}
            aria-pressed={face === i}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${face === i ? "border-brand-yellow bg-brand-yellow text-char" : "border-white/20 text-white/80 hover:border-white/50"}`}
          >
            <Icon size={15} color={face === i ? "#303030" : color} aria-hidden /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="on-dark relative overflow-hidden bg-deep py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-brand-red/10 blur-[110px]" />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionTitle id="about-title" lines={["Technology Meets Creativity.", "Ideas Become Reality."]} dark />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-7 max-w-[60ch] space-y-4 text-base leading-relaxed text-white/75 sm:text-lg">
            <p>
              YBCSOFT is a technology and creative services company delivering innovative digital solutions. Our engineers, designers and video editors work as one team, so the software we build is as well designed as it is dependable.
            </p>
            <p>We partner with businesses, startups, entrepreneurs and individual clients around the world, turning raw ideas into secure, scalable products and into stories people remember.</p>
          </motion.div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 border-t border-white/15 pt-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {ABOUT_STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-2 text-sm leading-snug text-white/65">{s.label}</dt>
                <dd className="text-[clamp(2.2rem,4vw,3.1rem)] font-extrabold leading-none text-brand-yellow">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <TechCube />
      </div>
    </section>
  );
}
