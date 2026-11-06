"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { PORTFOLIO_CATEGORIES, PROJECTS, type Project } from "@/lib/data";
import { requestService } from "@/lib/bus";
import SectionTitle from "./SectionTitle";
import Tilt from "./Tilt";

const catLabel = (id: string) => PORTFOLIO_CATEGORIES.find((c) => c.id === id)?.label ?? id;

function ConceptBadge() {
  return <span className="rounded-full bg-white px-3 py-0.5 text-[0.7rem] font-extrabold text-char shadow">Concept project</span>;
}

/* ------------------------------- preview modal ------------------------------ */
function Preview({ list, index, onClose, onStep }: { list: Project[]; index: number; onClose: () => void; onStep: (d: number) => void }) {
  const p = list[index];
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return onStep(1);
      if (e.key === "ArrowLeft") return onStep(-1);
      if (e.key === "Tab" && dialog.current) {
        // keep focus inside the dialog
        const f = dialog.current.querySelectorAll<HTMLElement>("button,[href],[tabindex]:not([tabindex='-1'])");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [onClose, onStep]);

  return (
    <motion.div className="fixed inset-0 z-[150] grid place-items-center p-3 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <button aria-label="Close preview" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-default bg-ink/85 backdrop-blur-md" />
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="pv-title" className="on-dark relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-char shadow-2xl ring-1 ring-white/10 lg:grid-cols-[1.3fr_1fr] lg:overflow-hidden">
        <motion.div layoutId={`img-${p.id}`} className="relative aspect-[480/300] w-full self-center overflow-hidden bg-deep lg:aspect-auto lg:h-full lg:min-h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={`${p.title} concept preview`} className="absolute inset-0 h-full w-full object-contain" />
          <div className="absolute left-4 top-4"><ConceptBadge /></div>
        </motion.div>

        <div className="flex flex-col p-6 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold text-brand-yellow">{catLabel(p.category)}</span>
            <button ref={closeBtn} onClick={onClose} aria-label="Close preview" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red">
              <X size={20} />
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-5 flex flex-1 flex-col">
              <h3 id="pv-title" className="text-[1.8rem] font-extrabold !text-white sm:text-3xl">{p.title}</h3>
              <p className="mt-4 leading-relaxed text-white/75">{p.detail}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">{s}</li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-white/50">This is a concept project created to show the kind of work we deliver. It is not a real client engagement.</p>
              <a href="#contact" onClick={() => { requestService(p.service); onClose(); }} className="btn btn-yellow mt-7 self-start">
                Discuss a similar project
              </a>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
            <button onClick={() => onStep(-1)} aria-label="Previous project" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow"><ArrowLeft size={18} /></button>
            <span className="text-sm font-semibold tabular-nums text-white/60">{index + 1} of {list.length}</span>
            <button onClick={() => onStep(1)} aria-label="Next project" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------- section --------------------------------- */
export default function Portfolio() {
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const list = cat === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === cat);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  return (
    <section id="portfolio" aria-labelledby="work-title" className="on-dark slab relative overflow-hidden bg-deep pb-24 sm:pb-32 [--slab:64px]">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-40 h-[420px] w-[420px] rounded-full bg-brand-red/12 blur-[110px]" />
      <div className="container-x relative">
        <SectionTitle id="work-title" lines={["Our work."]} text="A look at the kind of products we design and build across software, web, mobile, design and video. These are clearly labelled concept projects. Real case studies will replace them as they are published." dark />

        {/* filters */}
        <div role="group" aria-label="Filter projects by category" className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {PORTFOLIO_CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={`relative shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${cat === c.id ? "border-transparent text-char" : "border-white/20 text-white/80 hover:border-white/50"}`}>
              {cat === c.id && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-brand-yellow" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>

        <LayoutGroup>
          <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.88, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-6% 0px" }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Tilt max={8} className="group overflow-hidden rounded-2xl bg-char ring-1 ring-white/10">
                    <button onClick={() => setOpen(i)} aria-label={`Open preview: ${p.title}`} className="block w-full text-left">
                      <motion.span layoutId={`img-${p.id}`} className="relative block aspect-[480/300] overflow-hidden bg-deep">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={`${p.title} concept preview`} loading="lazy" width={480} height={300} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12] group-hover:-rotate-1" />
                        <span className="absolute inset-0 grid place-items-center bg-ink/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                          <span className="flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-extrabold text-char"><Expand size={16} aria-hidden /> Preview project</span>
                        </span>
                        <span className="absolute left-3 top-3"><ConceptBadge /></span>
                      </motion.span>
                      <span className="block p-5" style={{ transform: "translateZ(20px)" }}>
                        <span className="block text-xs font-bold text-brand-yellow">{catLabel(p.category)}</span>
                        <span className="mt-1.5 block text-xl font-extrabold text-white">{p.title}</span>
                        <span className="mt-2 block text-[0.93rem] leading-relaxed text-white/65">{p.summary}</span>
                        <span className="mt-4 flex flex-wrap gap-1.5">
                          {p.stack.map((s) => (
                            <span key={s} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/85">{s}</span>
                          ))}
                        </span>
                      </span>
                    </button>
                  </Tilt>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          {/* Portalled to <body>: the angled section edges use clip-path, which would otherwise clip a fixed modal */}
          {typeof document !== "undefined" &&
            createPortal(<AnimatePresence>{open !== null && list[open] && <Preview list={list} index={open} onClose={close} onStep={step} />}</AnimatePresence>, document.body)}
        </LayoutGroup>

        <p className="mt-12 text-center text-white/70">
          Have something in mind?{" "}
          <a href="#contact" className="font-bold text-brand-yellow underline-offset-4 hover:underline">Tell us about your project</a>
        </p>
      </div>
    </section>
  );
}
