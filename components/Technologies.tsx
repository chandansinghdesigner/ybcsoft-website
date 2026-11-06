"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TECH_GROUPS } from "@/lib/data";
import SectionTitle from "./SectionTitle";
import Tilt from "./Tilt";

// Compact monograms keep the page light (no 28 logo downloads). Swap any entry for an official SVG if you prefer.
const MONO: Record<string, string> = {
  "React.js": "Re", "Next.js": "Nx", Angular: "Ng", JavaScript: "JS", TypeScript: "TS", HTML5: "H5", CSS3: "C3",
  "Node.js": "No", "Express.js": "Ex", Python: "Py", PHP: "php", "ASP.NET Core": ".NET",
  "React Native": "RN", Flutter: "Fl", Android: "An", iOS: "iOS",
  MongoDB: "Mg", PostgreSQL: "Pg", MySQL: "My", "SQL Server": "SQL",
  AWS: "AWS", Azure: "Az", Docker: "Dk", GitHub: "Gh",
  Figma: "Fg", "Adobe Premiere Pro": "Pr", "After Effects": "Ae", Photoshop: "Ps",
};
const TONES = ["#FFF000", "#ED3038", "#FFFFFF"];

export default function Technologies() {
  const reduce = useReducedMotion();
  let n = 0;
  return (
    <section id="technologies" aria-labelledby="tech-title" className="slab relative bg-paper pb-24 sm:pb-32 [--slab:64px]">
      <div className="container-x">
        <SectionTitle id="tech-title" lines={["Technologies we", "work with."]} text="Modern, proven tools matched to your project, never chosen just because they are trending." />

        <div className="mt-14 divide-y divide-char/10 border-y border-char/10">
          {TECH_GROUPS.map((g) => (
            <div key={g.title} className="grid gap-5 py-8 md:grid-cols-[200px_1fr] md:gap-10">
              <h3 className="text-xl font-extrabold text-char">{g.title}</h3>
              <ul className="flex flex-wrap gap-3 sm:gap-4">
                {g.items.map((t) => {
                  const k = n++;
                  const tone = TONES[k % 3];
                  return (
                    <motion.li key={t} initial={reduce ? false : { opacity: 0, scale: 0.7, rotateY: -50 }} whileInView={{ opacity: 1, scale: 1, rotateY: 0 }} viewport={{ once: true, margin: "-5% 0px" }} transition={{ duration: 0.6, delay: (k % 7) * 0.05, ease: [0.2, 0.8, 0.2, 1] }} style={{ transformPerspective: 700 }}>
                      <div className="animate-float" style={{ animationDelay: `${(k % 6) * -0.9}s`, animationDuration: `${5 + (k % 4)}s` }}>
                        <Tilt max={16} className="on-dark flex items-center gap-3 rounded-2xl bg-char py-2.5 pl-2.5 pr-4 shadow-[0_14px_28px_-16px_rgba(0,0,0,.6)]">
                          <span className="grid h-11 w-11 place-items-center rounded-xl text-[0.95rem] font-extrabold tracking-tight" style={{ background: tone, color: tone === "#ED3038" ? "#fff" : "#303030", transform: "translateZ(22px)" }} aria-hidden>
                            {MONO[t] ?? t.slice(0, 2)}
                          </span>
                          <span className="text-[0.92rem] font-bold text-white">{t}</span>
                        </Tilt>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
