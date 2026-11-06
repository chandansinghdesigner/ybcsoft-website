"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Clock, Heart, LifeBuoy, Puzzle, Sparkles, Users, Wallet, type LucideIcon } from "lucide-react";
import { WHY } from "@/lib/data";
import CountUp from "./CountUp";
import SectionTitle from "./SectionTitle";

const ICONS: Record<string, LucideIcon> = { users: Users, badge: BadgeCheck, sparkles: Sparkles, puzzle: Puzzle, wallet: Wallet, clock: Clock, heart: Heart, "life-buoy": LifeBuoy };

export default function WhyChoose() {
  const [i, setI] = useState(0);
  const cur = WHY[i];
  const CurIcon = ICONS[cur.icon];

  return (
    <section id="why" aria-labelledby="why-title" className="on-dark slab relative overflow-hidden bg-deep pb-24 sm:pb-32 [--slab:64px]">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-brand-yellow/10 blur-[120px]" />
      <div className="container-x relative">
        <SectionTitle id="why-title" lines={["Why choose YBCSOFT?"]} text="What you can expect when you work with us. Point at a row to see the detail behind it." dark />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <ul className="divide-y divide-white/12 border-y border-white/12">
            {WHY.map((w, idx) => {
              const Icon = ICONS[w.icon];
              const on = idx === i;
              return (
                <li key={w.title}>
                  <button
                    onMouseEnter={() => setI(idx)}
                    onFocus={() => setI(idx)}
                    onClick={() => setI(idx)}
                    aria-expanded={on}
                    className={`group flex w-full items-center gap-4 py-5 text-left transition-all duration-300 sm:gap-5 ${on ? "pl-3 sm:pl-5" : "pl-0"}`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${on ? "bg-brand-yellow text-char" : "bg-white/8 text-brand-yellow"}`}>
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className={`flex-1 text-lg font-bold leading-snug transition-colors sm:text-xl ${on ? "text-white" : "text-white/70 group-hover:text-white"}`}>{w.title}</span>
                    <span className={`shrink-0 text-2xl font-extrabold tabular-nums transition-colors sm:text-3xl ${on ? "text-brand-yellow" : "text-white/35"}`}>
                      <CountUp to={w.metric.value} prefix={"prefix" in w.metric ? w.metric.prefix : ""} suffix={w.metric.suffix} />
                    </span>
                  </button>
                  {/* inline detail for small screens */}
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden lg:hidden">
                        <p className="pb-5 pl-[3.75rem] pr-2 text-white/70">{w.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* detail card for large screens */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotateX: -14, y: 20 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, rotateX: 10, y: -12 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformPerspective: 1000 }}
                  className="glass relative overflow-hidden rounded-3xl p-9"
                >
                  <span aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-red/25 blur-3xl" />
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow text-char">
                    <CurIcon size={28} aria-hidden />
                  </span>
                  <p className="mt-8 text-[clamp(3.4rem,6vw,5.2rem)] font-extrabold leading-none text-brand-yellow tabular-nums">
                    <CountUp to={cur.metric.value} prefix={"prefix" in cur.metric ? cur.metric.prefix : ""} suffix={cur.metric.suffix} duration={1.1} restartKey={i} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/60">{cur.metric.label}</p>
                  <h3 className="mt-8 text-2xl font-extrabold !text-white">{cur.title}</h3>
                  <p className="mt-3 max-w-[44ch] leading-relaxed text-white/75">{cur.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
