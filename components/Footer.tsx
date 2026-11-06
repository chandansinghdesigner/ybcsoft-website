import { Facebook, Globe, Mail, Phone } from "lucide-react";
import { NAV, SERVICE_GROUPS, SITE } from "@/lib/data";
import { WhatsAppIcon } from "./Icons";

export default function Footer() {
  const year = new Date().getFullYear();
  const social = "grid h-11 w-11 place-items-center rounded-full bg-char text-white transition-colors hover:bg-brand-red";
  return (
    <footer className="on-dark relative bg-ink pt-16 text-white/70">
      <div className="container-x grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.1fr_1.2fr]">
        <div>
          <a href="#home" className="inline-flex items-center gap-3 text-[1.3rem] font-extrabold text-white" aria-label="YBCSOFT home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo/ybcsoft-logo.jpg" alt="YBCSOFT logo" width={48} height={48} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
            <span>YBC<b className="text-brand-yellow">SOFT</b></span>
          </a>
          <p className="mt-5 max-w-[42ch] leading-relaxed">YBCSOFT is a technology and creative services company building secure, scalable software, web and mobile products, delivering IT services and producing professional video for clients worldwide.</p>
          <div className="mt-6 flex gap-3">
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="YBCSOFT on Facebook" className={social}><Facebook size={18} /></a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="YBCSOFT on WhatsApp" className={social}><WhatsAppIcon size={18} /></a>
            <a href={`mailto:${SITE.email}`} aria-label="Email YBCSOFT" className={social}><Mail size={18} /></a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h2 className="text-base font-extrabold !text-brand-yellow">Quick Links</h2>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((n) => (<li key={n.id}><a href={`#${n.id}`} className="transition-colors hover:text-brand-yellow">{n.label}</a></li>))}
            <li><a href="#contact" className="font-bold text-white transition-colors hover:text-brand-yellow">Get a Free Quote</a></li>
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className="text-base font-extrabold !text-brand-yellow">Services</h2>
          <ul className="mt-4 space-y-2.5">
            {SERVICE_GROUPS.map((g) => (<li key={g.id}><a href="#services" className="transition-colors hover:text-brand-yellow">{g.title}</a></li>))}
            <li><a href="#portfolio" className="transition-colors hover:text-brand-yellow">Portfolio</a></li>
            <li><a href="#technologies" className="transition-colors hover:text-brand-yellow">Technology Stack</a></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-base font-extrabold !text-brand-yellow">Contact</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3"><Mail size={16} className="shrink-0 text-brand-red" aria-hidden /><a href={`mailto:${SITE.email}`} className="break-all transition-colors hover:text-brand-yellow">{SITE.email}</a></li>
            {SITE.phones.map((p) => (<li key={p.href} className="flex items-center gap-3"><Phone size={16} className="shrink-0 text-brand-red" aria-hidden /><a href={p.href} className="transition-colors hover:text-brand-yellow">{p.label}</a></li>))}
            <li className="flex items-center gap-3"><WhatsAppIcon size={16} className="shrink-0 text-brand-red" /><a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-yellow">Chat on WhatsApp</a></li>
            <li className="flex items-center gap-3"><Facebook size={16} className="shrink-0 text-brand-red" aria-hidden /><a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-yellow">facebook.com/ybcsoft</a></li>
            <li className="flex items-center gap-3"><Globe size={16} className="shrink-0 text-brand-red" aria-hidden /><a href={SITE.url} className="transition-colors hover:text-brand-yellow">ybcsoft.vercel.app</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-14 border-t border-white/10 py-6 text-center text-sm">&copy; {year} YBCSOFT. All rights reserved.</div>
    </footer>
  );
}
