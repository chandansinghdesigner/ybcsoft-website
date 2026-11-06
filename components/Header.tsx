"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active nav state: whichever section crosses the middle of the viewport
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className={`on-dark fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${scrolled || open ? "border-b border-white/10 bg-deep/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-md bg-brand-yellow px-4 py-2 font-bold text-char">
        Skip to content
      </a>
      <div className="container-x flex h-[var(--header-h)] items-center justify-between">
        <a href="#home" className="flex items-center gap-3 text-[1.3rem] font-extrabold tracking-tight text-white" aria-label="YBCSOFT home" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo/ybcsoft-logo.jpg" alt="YBCSOFT logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10" />
          <span>
            YBC<b className="text-brand-yellow">SOFT</b>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? "page" : undefined} className={`relative rounded-md px-3.5 py-2 text-[0.92rem] font-semibold transition-colors ${active === n.id ? "text-brand-yellow" : "text-white/80 hover:text-white"}`}>
              {n.label}
              {active === n.id && <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded bg-brand-yellow" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            </a>
          ))}
          <a href="#contact" className="btn btn-red ml-3 !min-h-[44px] !px-5 !py-2">
            Get a Free Quote
          </a>
        </nav>

        <button className="grid h-11 w-11 place-items-center rounded-lg text-brand-yellow lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-nav" aria-label="Mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-deep/95 px-5 pb-10 pt-6 backdrop-blur-xl lg:hidden">
            <ul className="space-y-1">
              {NAV.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} aria-current={active === n.id ? "page" : undefined} className={`block rounded-lg px-3 py-3.5 text-2xl font-extrabold ${active === n.id ? "text-brand-yellow" : "text-white"}`}>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-red mt-6 w-full">
              Get a Free Quote
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
