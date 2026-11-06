"use client";
import { useRef } from "react";

/**
 * 3D tilt surface. Pointer position drives CSS variables (--rx, --ry, --mx, --my) that globals.css turns into
 * perspective rotation + a moving glare. Touch input and reduced-motion users get no tilt.
 */
export default function Tilt({
  children,
  className = "",
  max = 9,
  glare = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty("--rx", `${-(py - 0.5) * 2 * max}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.classList.add("is-active");
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.classList.remove("is-active");
  };

  const Component = Tag as "div";
  return (
    <Component ref={ref} className={`tilt relative ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
      {glare && <span aria-hidden className="tilt-glare" />}
    </Component>
  );
}
