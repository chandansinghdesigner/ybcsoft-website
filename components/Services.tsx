"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { SERVICE_GROUPS, type ServiceGroup } from "@/lib/data";
import { requestService } from "@/lib/bus";
import SectionTitle from "./SectionTitle";
import Tilt from "./Tilt";

/* Small animated illustrations. Pure SVG + CSS keyframes (see globals.css): no extra JS cost. */
function Illustration({ id, accent }: { id: ServiceGroup["id"]; accent: string }) {
  const common = "svg-anim h-full w-full";
  if (id === "software")
    return (
      <svg viewBox="0 0 240 150" className={common} aria-hidden>
        <rect x="20" y="14" width="200" height="122" rx="10" fill="#242424" stroke="#ffffff22" />
        <rect x="20" y="14" width="200" height="22" rx="10" fill="#3a3a3a" />
        <circle cx="36" cy="25" r="4" fill="#ED3038" /><circle cx="50" cy="25" r="4" fill="#FFF000" /><circle cx="64" cy="25" r="4" fill="#fff" />
        {[
          { y: 52, w: 80, x: 36, c: "#ED3038", d: "0s" },
          { y: 70, w: 120, x: 52, c: accent, d: ".5s" },
          { y: 88, w: 96, x: 52, c: "#bbb", d: "1s" },
          { y: 106, w: 60, x: 36, c: "#ED3038", d: "1.5s" },
        ].map((l) => (
          <rect key={l.y} x={l.x} y={l.y} width={l.w} height="8" rx="4" fill={l.c} style={{ transformOrigin: "left center", animation: `typing 4s ${l.d} ease-in-out infinite` }} />
        ))}
        <rect x="116" y="104" width="7" height="12" fill="#fff" style={{ animation: "blink 1s steps(1) infinite" }} />
      </svg>
    );
  if (id === "web")
    return (
      <svg viewBox="0 0 240 150" className={common} aria-hidden>
        <rect x="14" y="16" width="148" height="112" rx="10" fill="#242424" stroke="#ffffff22" />
        <rect x="14" y="16" width="148" height="20" rx="10" fill="#3a3a3a" />
        <circle cx="28" cy="26" r="3.5" fill="#ED3038" /><circle cx="40" cy="26" r="3.5" fill="#FFF000" /><circle cx="52" cy="26" r="3.5" fill="#fff" />
        <rect x="26" y="48" width="64" height="30" rx="6" fill={accent} opacity=".9" />
        <rect x="98" y="48" width="52" height="14" rx="5" fill="#555" /><rect x="98" y="66" width="38" height="12" rx="5" fill="#555" />
        <rect x="26" y="88" width="30" height="28" rx="6" fill="#4a4a4a" /><rect x="62" y="88" width="30" height="28" rx="6" fill="#4a4a4a" /><rect x="98" y="88" width="52" height="28" rx="6" fill="#ED3038" style={{ animation: "blink 2.4s ease-in-out infinite" }} />
        <rect x="176" y="30" width="52" height="100" rx="12" fill="#242424" stroke="#ffffff33" strokeWidth="2" />
        <rect x="186" y="44" width="32" height="18" rx="4" fill={accent} /><rect x="186" y="68" width="32" height="8" rx="4" fill="#666" /><rect x="186" y="82" width="22" height="8" rx="4" fill="#666" /><rect x="186" y="100" width="32" height="14" rx="7" fill="#ED3038" />
        <g style={{ animation: "cursor-move 5s ease-in-out infinite" }}>
          <path d="M52 56 L52 78 L58 72 L63 83 L68 81 L63 70 L71 70 Z" fill="#fff" stroke="#242424" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      </svg>
    );
  if (id === "freelance")
    return (
      <svg viewBox="0 0 240 150" className={common} aria-hidden>
        <circle cx="120" cy="75" r="58" fill="none" stroke="#ffffff30" strokeDasharray="4 6" style={{ transformOrigin: "120px 75px", animation: "orbit-ring 16s linear infinite" }} />
        <circle cx="120" cy="75" r="38" fill="none" stroke="#ffffff22" />
        <g style={{ transformOrigin: "120px 75px", animation: "orbit-ring 9s linear infinite reverse" }}>
          <circle cx="120" cy="37" r="7" fill={accent} /><circle cx="158" cy="75" r="5" fill="#ED3038" /><circle cx="82" cy="75" r="5" fill="#FFF000" />
        </g>
        <g style={{ transformOrigin: "120px 75px", animation: "gear 7s linear infinite" }}>
          <circle cx="120" cy="75" r="19" fill="#3a3a3a" stroke={accent} strokeWidth="3" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="116" y="48" width="8" height="10" rx="2" fill={accent} transform={`rotate(${i * 45} 120 75)`} />
          ))}
          <circle cx="120" cy="75" r="7" fill="#242424" />
        </g>
        {[[30, 28], [208, 34], [32, 118], [210, 118]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#ED3038" /><circle cx={x} cy={y} r="5" fill="none" stroke="#ED3038" style={{ transformOrigin: `${x}px ${y}px`, animation: `pulse-ring 2.4s ${i * 0.5}s ease-out infinite` }} />
            <line x1={x} y1={y} x2="120" y2="75" stroke="#ffffff1c" strokeDasharray="3 5" />
          </g>
        ))}
      </svg>
    );
  return (
    <svg viewBox="0 0 240 150" className={common} aria-hidden>
      <rect x="20" y="12" width="200" height="82" rx="8" fill="#242424" stroke="#ffffff22" />
      <rect x="28" y="20" width="124" height="66" rx="5" fill="url(#vg)" />
      <defs><linearGradient id="vg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ED3038" /><stop offset="1" stopColor="#FFF000" /></linearGradient></defs>
      <circle cx="90" cy="53" r="15" fill="#242424" opacity=".85" /><path d="M85 45 L99 53 L85 61 Z" fill="#FFF000" />
      <rect x="160" y="22" width="52" height="7" rx="3.5" fill="#FFF000" /><rect x="160" y="36" width="40" height="6" rx="3" fill="#666" /><rect x="160" y="48" width="46" height="6" rx="3" fill="#666" /><rect x="160" y="64" width="28" height="14" rx="7" fill="#ED3038" />
      <rect x="20" y="104" width="200" height="36" rx="6" fill="#303030" />
      <rect x="26" y="110" width="64" height="10" rx="3" fill={accent} /><rect x="94" y="110" width="40" height="10" rx="3" fill="#ED3038" /><rect x="138" y="110" width="76" height="10" rx="3" fill="#fff" />
      <rect x="26" y="124" width="48" height="10" rx="3" fill="#ED3038" /><rect x="78" y="124" width="84" height="10" rx="3" fill="#bbb" /><rect x="166" y="124" width="48" height="10" rx="3" fill={accent} />
      <g style={{ animation: "playhead 4s linear infinite alternate" }}>
        <rect x="64" y="100" width="2.5" height="44" fill="#fff" /><path d="M59 98 h12 l-6 8z" fill="#fff" />
      </g>
    </svg>
  );
}

function Panel({ g, i }: { g: ServiceGroup; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 70, rotateX: 22 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay: (i % 2) * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
      className="flex"
    >
      <Tilt as="div" max={6} className="on-dark flex w-full flex-col overflow-hidden rounded-3xl bg-char p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)] sm:p-8">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: g.accent }} />
        <div className="pop-z mb-6 aspect-[240/150] w-full max-w-[300px] rounded-2xl bg-ink/60 p-3 ring-1 ring-white/10">
          <Illustration id={g.id} accent={g.accent === "#FFFFFF" ? "#FFF000" : g.accent} />
        </div>
        <div style={{ transform: "translateZ(24px)" }} className="flex flex-1 flex-col">
          <h3 className="text-[1.45rem] font-extrabold !text-white sm:text-[1.7rem]">{g.title}</h3>
          <p className="mt-2 max-w-[48ch] text-white/70">{g.blurb}</p>
          <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {g.items.map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-[0.95rem] font-medium leading-snug text-white/90">
                <Check size={16} className="mt-[3px] shrink-0" style={{ color: g.accent }} aria-hidden />
                {it}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <a
              href="#contact"
              onClick={() => requestService(`${g.title}: not sure yet`)}
              className="group inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-brand-yellow hover:bg-brand-yellow hover:text-char"
            >
              Get a quote for this
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </Tilt>
    </motion.li>
  );
}

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="slab relative bg-paper pb-24 sm:pb-32 [--slab:64px]">
      <div className="container-x">
        <SectionTitle id="services-title" lines={["One team for every", "digital need."]} text="Software, websites, apps, IT support and video production. Everything you need to plan, build, launch and grow, from a single dependable partner." />
        <ul className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {SERVICE_GROUPS.map((g, i) => (
            <Panel key={g.id} g={g} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
