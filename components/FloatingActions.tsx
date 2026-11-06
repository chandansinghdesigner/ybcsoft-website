"use client";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { SITE } from "@/lib/data";
import { WhatsAppIcon } from "./Icons";

/** Floating WhatsApp button + back-to-top (both existed on the original site). */
export default function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`grid h-12 w-12 place-items-center rounded-full bg-brand-yellow text-char shadow-lg transition-all duration-300 hover:-translate-y-1 ${show ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <ChevronUp size={22} />
      </button>
      <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,.7)] transition-transform hover:-translate-y-1 hover:scale-105">
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
