"use client";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";

/** Animated number that counts up when scrolled into view. Server HTML contains the final value (SEO / no-JS safe). */
export default function CountUp({ to, prefix = "", suffix = "", duration = 1.8, restartKey }: { to: number; prefix?: string; suffix?: string; duration?: number; restartKey?: string | number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const fmt = (v: number) => `${prefix}${Math.round(v)}${suffix}`;

  useLayoutEffect(() => {
    if (ref.current && !reduce && !inView) ref.current.textContent = fmt(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) { ref.current.textContent = fmt(to); return; }
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { if (ref.current) ref.current.textContent = fmt(v); } });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, restartKey, reduce]);

  return <span ref={ref}>{fmt(to)}</span>;
}
