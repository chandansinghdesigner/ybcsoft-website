"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Facebook, Globe, Loader2, Mail, Phone } from "lucide-react";
import { BUDGETS, SERVICE_GROUPS, SITE } from "@/lib/data";
import { SERVICE_EVENT } from "@/lib/bus";
import { WhatsAppIcon } from "./Icons";
import SectionTitle from "./SectionTitle";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const input =
  "mt-1.5 block w-full min-h-[48px] rounded-lg border-[1.5px] border-white/20 bg-white/[0.06] px-3.5 py-3 text-base text-white placeholder:text-white/35 transition-colors focus:border-brand-yellow focus:outline-none aria-[invalid=true]:border-brand-red [color-scheme:dark]";

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState("");

  // Other sections ("Get a quote for this", portfolio previews) pre-select the service here
  useEffect(() => {
    const on = (e: Event) => {
      setService((e as CustomEvent<string>).detail);
      setDone(false);
    };
    window.addEventListener(SERVICE_EVENT, on);
    return () => window.removeEventListener(SERVICE_EVENT, on);
  }, []);

  const clear = (k: keyof Errors) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = e.currentTarget;
    const data = new FormData(f);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "Please share a few details (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      (f.querySelector("[aria-invalid='true']") as HTMLElement | null)?.focus();
      return;
    }

    // honeypot: bots fill this, people never see it
    if (data.get("website")) {
      setDone(true);
      return;
    }
    data.delete("website");
    data.append("access_key", SITE.web3formsKey);
    data.append("subject", `New Project Inquiry from ${name}`);
    data.append("from_name", "YBCSOFT Website");

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: data });
      const json = await res.json();
      if (json.success) {
        f.reset();
        setService("");
        setDone(true);
      } else {
        setError(json.message || "Could not send your inquiry. Please try again.");
      }
    } catch {
      setError(`Network error. Please try again or email ${SITE.email}.`);
    } finally {
      setSending(false);
    }
  }

  const channels = [
    { href: SITE.whatsapp, label: "Chat on WhatsApp", sub: "Fastest way to reach us", icon: <WhatsAppIcon size={22} />, ext: true, tone: "bg-[#25D366] text-white" },
    { href: `mailto:${SITE.email}`, label: SITE.email, sub: "Email us anytime", icon: <Mail size={22} />, tone: "bg-brand-yellow text-char" },
    ...SITE.phones.map((p) => ({ href: p.href, label: p.label, sub: "Call us", icon: <Phone size={22} />, tone: "bg-brand-red text-white" })),
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark slab relative overflow-hidden bg-deep pb-24 sm:pb-32 [--slab:64px]">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-brand-red/15 blur-[120px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionTitle id="contact-title" lines={["Let’s talk about", "your project."]} text="Share a few details and we will come back with a clear plan, timeline and estimate, usually within one business day. Prefer to talk? Call or message us directly." dark />
          <ul className="mt-10 space-y-3">
            {channels.map((c) => (
              <li key={c.label}>
                <a href={c.href} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-white/30">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.tone}`}>{c.icon}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-white">{c.label}</span>
                    <span className="block text-sm text-white/60">{c.sub}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-white/60">Follow us</span>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="YBCSOFT on Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red"><Facebook size={18} /></a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="YBCSOFT on WhatsApp" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red"><WhatsAppIcon size={18} /></a>
            <a href={`mailto:${SITE.email}`} aria-label="Email YBCSOFT" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red"><Mail size={18} /></a>
            <a href={SITE.url} aria-label="YBCSOFT website" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-red"><Globe size={18} /></a>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-9">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-10 text-center" role="status">
                <CheckCircle2 size={56} className="mx-auto text-brand-yellow" aria-hidden />
                <h3 className="mt-5 text-2xl font-extrabold !text-white">Thank you. We have your inquiry.</h3>
                <p className="mx-auto mt-3 max-w-[40ch] text-white/70">Our team will review your requirements and reply within one business day.</p>
                <button onClick={() => setDone(false)} className="btn btn-ghost mt-7">Send another inquiry</button>
              </motion.div>
            ) : (
              <motion.form key="form" ref={form} onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-describedby="fmsg">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-white/90">
                    Full Name *
                    <input name="name" required autoComplete="name" className={input} aria-invalid={!!errors.name} aria-describedby="e-name" onChange={() => clear("name")} />
                    <small id="e-name" className="mt-1 block min-h-[1.2em] font-medium text-[#ff7a80]">{errors.name}</small>
                  </label>
                  <label className="block text-sm font-semibold text-white/90">
                    Email Address *
                    <input name="email" type="email" required autoComplete="email" className={input} aria-invalid={!!errors.email} aria-describedby="e-email" onChange={() => clear("email")} />
                    <small id="e-email" className="mt-1 block min-h-[1.2em] font-medium text-[#ff7a80]">{errors.email}</small>
                  </label>
                  <label className="block text-sm font-semibold text-white/90">
                    Phone Number
                    <input name="phone" type="tel" autoComplete="tel" className={input} />
                  </label>
                  <label className="block text-sm font-semibold text-white/90">
                    Company Name
                    <input name="company" autoComplete="organization" className={input} />
                  </label>
                  <label className="block text-sm font-semibold text-white/90">
                    Service Required
                    <select name="service" value={service} onChange={(e) => setService(e.target.value)} className={input}>
                      <option value="">Select a service</option>
                      {SERVICE_GROUPS.map((g) => (
                        <optgroup key={g.id} label={g.title}>
                          <option>{`${g.title}: not sure yet`}</option>
                          {g.items.map((it) => (
                            <option key={it}>{it}</option>
                          ))}
                        </optgroup>
                      ))}
                      <option>Something else / need advice</option>
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-white/90">
                    Project Budget (optional)
                    <select name="budget" defaultValue="" className={input}>
                      <option value="">Prefer not to say</option>
                      {BUDGETS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mt-5 block text-sm font-semibold text-white/90">
                  Project Description *
                  <textarea name="message" rows={5} required className={`${input} resize-y`} placeholder="What would you like to build, and what should it achieve?" aria-invalid={!!errors.message} aria-describedby="e-message" onChange={() => clear("message")} />
                  <small id="e-message" className="mt-1 block min-h-[1.2em] font-medium text-[#ff7a80]">{errors.message}</small>
                </label>

                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                <button type="submit" disabled={sending} className="btn btn-red mt-4 w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
                  {sending ? (<><Loader2 size={18} className="animate-spin" aria-hidden /> Sending...</>) : "Send Your Inquiry"}
                </button>
                <div id="fmsg" role="status" aria-live="polite" className="mt-4 min-h-[1.5em] font-semibold text-[#ff7a80]">{error}</div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
