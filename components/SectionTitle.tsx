"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Section heading: each line rises out of a mask when scrolled into view. */
export default function SectionTitle({ lines, text, dark = false, center = false, id }: { lines: string[]; text?: string; dark?: boolean; center?: boolean; id?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      <h2 id={id} className={`text-[clamp(1.9rem,4.6vw,3.4rem)] font-extrabold ${dark ? "text-white" : "text-char"} rule-brand ${center ? "rule-brand-center" : ""}`}>
        {lines.map((l, i) => (
          <span key={l} className="mask-line">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "105%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {l}
            </motion.span>
          </span>
        ))}
      </h2>
      {text && (
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? "text-white/70" : "text-[#555]"}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
