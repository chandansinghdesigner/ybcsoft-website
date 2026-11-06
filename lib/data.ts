// All site content lives here so copy, links and contact details are edited in ONE place.
// Contact details + social links are carried over unchanged from the original YBCSOFT site.

export const SITE = {
  name: "YBCSOFT",
  url: "https://ybcsoft.vercel.app",
  email: "ybcsoft7677@gmail.com",
  phones: [
    { label: "+91 7992497677", href: "tel:+917992497677" },
    { label: "+91 8287968224", href: "tel:+918287968224" },
  ],
  whatsapp: "https://wa.me/917992497677",
  facebook: "https://www.facebook.com/ybcsoft/",
  // Web3Forms public access key (same as the original site). Override with NEXT_PUBLIC_WEB3FORMS_KEY if you rotate it.
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "dfa987e3-7a21-475f-9a6d-f624651666e4",
};

export const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "technologies", label: "Technologies" },
  { id: "contact", label: "Contact Us" },
] as const;

/* ---------------------------------- HERO ---------------------------------- */
export const HERO_HEADLINE = "We build digital experiences that move businesses forward.";

export interface HeroWord {
  /** Lines used on wide screens */
  lines: string[];
  /** Lines used on narrow/portrait screens so the 3D letters stay large */
  compact: string[];
  caption: string;
  color: string; // front-face colour (brand palette)
}

export const HERO_WORDS: HeroWord[] = [
  { lines: ["SOFTWARE", "DEVELOPMENT"], compact: ["SOFTWARE", "DEVELOP-", "MENT"], caption: "Custom software, SaaS platforms, CRM & ERP systems and APIs built around how your business works.", color: "#FFF000" },
  { lines: ["WEB & MOBILE", "APPLICATIONS"], compact: ["WEB &", "MOBILE", "APPS"], caption: "Fast websites, web apps and Android & iOS applications with polished, modern interfaces.", color: "#FFFFFF" },
  { lines: ["FREELANCING", "SERVICES"], compact: ["FREE-", "LANCING", "SERVICES"], caption: "Frontend, backend and full-stack developers and designers, on demand and fully remote.", color: "#ED3038" },
  { lines: ["IT", "SOLUTIONS"], compact: ["IT", "SOLU-", "TIONS"], caption: "Consulting, maintenance, troubleshooting and IT support that keeps your technology running.", color: "#FFFFFF" },
  { lines: ["VIDEO EDITING &", "CREATIVE PRODUCTION"], compact: ["VIDEO", "EDITING &", "CREATIVE", "PRODUCTION"], caption: "Promos, reels, motion graphics and brand films that tell your story with impact.", color: "#FFF000" },
];

/* -------------------------------- SERVICES -------------------------------- */
export interface ServiceGroup {
  id: "software" | "web" | "freelance" | "creative";
  title: string;
  blurb: string;
  accent: string;
  items: string[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "software",
    title: "Software Development",
    blurb: "Tailor-made software, fully owned by you, built to scale with your business.",
    accent: "#FFF000",
    items: ["Custom Software Development", "Enterprise Software Solutions", "SaaS Application Development", "CRM & ERP Development", "API Development & Integration"],
  },
  {
    id: "web",
    title: "Website & Application Development",
    blurb: "From a first business website to complex web and mobile products.",
    accent: "#ED3038",
    items: ["Business Website Development", "Portfolio Website Development", "E-commerce Development", "Web Application Development", "React.js & Next.js Development", "Angular Development", "Android & iOS Application Development"],
  },
  {
    id: "freelance",
    title: "Freelancing & IT Services",
    blurb: "Skilled engineers and designers on demand, from a quick fix to a dedicated team.",
    accent: "#FFFFFF",
    items: ["Frontend Development", "Backend Development", "Full-Stack Development", "UI/UX Design", "Website Maintenance", "Bug Fixing & Troubleshooting", "Technical Consultation", "IT Support & Solutions", "Dedicated Developer Services", "Remote Development Services"],
  },
  {
    id: "creative",
    title: "Video Editing & Creative Services",
    blurb: "Scroll-stopping video and motion work that makes your brand memorable.",
    accent: "#FFF000",
    items: ["Professional Video Editing", "YouTube Video Editing", "Corporate & Promotional Videos", "Social Media Reels & Shorts", "Motion Graphics", "Logo Animation", "Explainer Videos", "Brand Promotional Content"],
  },
];

/* ---------------------------------- ABOUT --------------------------------- */
// Every figure below is derived from the real content on this site (no invented client counts).
const countServices = SERVICE_GROUPS.reduce((n, g) => n + g.items.length, 0);

export const TECH_GROUPS = [
  { title: "Frontend", items: ["React.js", "Next.js", "Angular", "JavaScript", "TypeScript", "HTML5", "CSS3"] },
  { title: "Backend", items: ["Node.js", "Express.js", "Python", "PHP", "ASP.NET Core"] },
  { title: "Mobile", items: ["React Native", "Flutter", "Android", "iOS"] },
  { title: "Database", items: ["MongoDB", "PostgreSQL", "MySQL", "SQL Server"] },
  { title: "Cloud & DevOps", items: ["AWS", "Azure", "Docker", "GitHub"] },
  { title: "Creative Tools", items: ["Figma", "Adobe Premiere Pro", "After Effects", "Photoshop"] },
];
const countTech = TECH_GROUPS.reduce((n, g) => n + g.items.length, 0);

export const ABOUT_STATS = [
  { value: countServices, suffix: "", label: "Services under one roof" },
  { value: countTech, suffix: "", label: "Technologies & tools" },
  { value: 24, suffix: "h", label: "Reply to every inquiry" },
  { value: 100, suffix: "%", label: "Commitment to quality" },
];

/* ------------------------------ WHY CHOOSE US ----------------------------- */
export const WHY = [
  { title: "Experienced Development Team", text: "Engineers and designers who have shipped real products across web, mobile and enterprise software.", metric: { value: countTech, suffix: "", label: "technologies in daily use" }, icon: "users" },
  { title: "Quality-Focused Delivery", text: "Functional, performance, device and security checks at every milestone, before anything goes live.", metric: { value: 4, suffix: "", label: "checks before every release" }, icon: "badge" },
  { title: "Creative Thinking", text: "Design and video specialists work next to engineers, so the product looks as good as it performs.", metric: { value: 8, suffix: "", label: "creative services offered" }, icon: "sparkles" },
  { title: "Custom-Built Solutions", text: "No templates. Every product is designed around your goals, your workflow and your users.", metric: { value: 100, suffix: "%", label: "built around your needs" }, icon: "puzzle" },
  { title: "Affordable & Transparent Pricing", text: "Honest estimates with a clearly defined scope before we start. No surprises later.", metric: { value: 0, prefix: "₹", suffix: "", label: "for your first consultation" }, icon: "wallet" },
  { title: "On-Time Project Delivery", text: "Clear timelines, milestone demos and visible progress, so you always know where the project stands.", metric: { value: 6, suffix: "", label: "tracked stages, start to launch" }, icon: "clock" },
  { title: "Client-Focused Approach", text: "We listen first. You get a reply to every inquiry and a clear plan, usually within one business day.", metric: { value: 24, suffix: "h", label: "reply to every inquiry" }, icon: "heart" },
  { title: "Long-Term Technical Support", text: "We stay with you after launch with updates, fixes and improvements whenever you need them.", metric: { value: 1, suffix: "", label: "point of contact, always" }, icon: "life-buoy" },
] as const;

/* -------------------------------- PORTFOLIO ------------------------------- */
export const PORTFOLIO_CATEGORIES = [
  { id: "all", label: "All Work" },
  { id: "software", label: "Software Development" },
  { id: "web", label: "Websites & Web Apps" },
  { id: "mobile", label: "Mobile Applications" },
  { id: "uiux", label: "UI/UX Design" },
  { id: "freelance", label: "Freelancing Projects" },
  { id: "video", label: "Video & Creative" },
] as const;

export interface Project {
  id: string;
  title: string;
  category: Exclude<(typeof PORTFOLIO_CATEGORIES)[number]["id"], "all">;
  summary: string;
  detail: string;
  stack: string[];
  image: string;
  service: string; // pre-selects the contact form
}

// These are CONCEPT projects (clearly labelled in the UI). Swap in real case studies as they are completed.
export const PROJECTS: Project[] = [
  { id: "corporate-website", title: "Corporate Website", category: "web", summary: "Multi-page business website with a blog, SEO structure and enquiry form.", detail: "A fast, search-friendly company website with service pages, a blog, clear calls to action and a working enquiry form, designed to build trust and bring in leads.", stack: ["HTML5", "CSS3", "PHP"], image: "/assets/images/corporate-website.svg", service: "Business Website Development" },
  { id: "inventory-dashboard", title: "Inventory Dashboard", category: "web", summary: "Stock tracking with live charts, low-stock alerts and role-based access.", detail: "A web application for tracking stock across locations, with live charts, low-stock alerts, supplier records and role-based access for managers and staff.", stack: ["React.js", "Node.js", "MongoDB"], image: "/assets/images/inventory-dashboard.svg", service: "Web Application Development" },
  { id: "online-store", title: "Online Store Platform", category: "web", summary: "Catalogue, cart, secure payments and a full order admin panel.", detail: "A complete e-commerce platform: product catalogue, cart, secure checkout and an admin panel for managing products, orders and customers.", stack: ["Next.js", "PostgreSQL"], image: "/assets/images/online-store-platform.svg", service: "E-commerce Development" },
  { id: "delivery-app", title: "Delivery Tracking App", category: "mobile", summary: "Real-time order status, driver tracking and push notifications.", detail: "A cross-platform mobile app showing real-time order status and driver location, with push notifications at every delivery stage.", stack: ["Flutter", "Firebase"], image: "/assets/images/delivery-tracking-app.svg", service: "Android & iOS Application Development" },
  { id: "banking-redesign", title: "Banking App Redesign", category: "uiux", summary: "Simplified onboarding and payments flow with a clear visual system.", detail: "A UI/UX concept that simplifies onboarding and payments, built on a consistent design system and tested through clickable prototypes.", stack: ["Figma", "Prototyping"], image: "/assets/images/banking-app-redesign.svg", service: "UI/UX Design" },
  { id: "school-system", title: "School Management System", category: "software", summary: "Attendance, fee collection, timetables and report cards in one system.", detail: "Custom software that brings attendance, fee collection, timetables and report cards into a single secure system for schools.", stack: ["ASP.NET Core", "SQL Server"], image: "/assets/images/school-management-system.svg", service: "Custom Software Development" },
  { id: "dev-support", title: "Dedicated Developer Support", category: "freelance", summary: "A remote developer who owns your bug backlog, upgrades and small features.", detail: "A freelancing engagement concept: one dedicated remote developer handling maintenance, bug fixing, upgrades and new features on your existing website or app.", stack: ["Full-Stack", "Maintenance", "Support"], image: "/assets/images/dev-support.svg", service: "Dedicated Developer Services" },
  { id: "promo-reel", title: "Brand Promo Reel", category: "video", summary: "Short promotional video with motion graphics and a logo animation.", detail: "A creative production concept: a punchy brand promo with edited footage, motion graphics, logo animation and cuts for YouTube, Reels and Shorts.", stack: ["Premiere Pro", "After Effects", "Photoshop"], image: "/assets/images/promo-reel.svg", service: "Corporate & Promotional Videos" },
];

/* --------------------------------- PROCESS -------------------------------- */
export const PROCESS = [
  { title: "Discover", text: "We listen to your goals, users and constraints to understand exactly what you need." },
  { title: "Plan", text: "Scope, timeline, budget and technology are agreed before any code is written." },
  { title: "Design", text: "Modern UI/UX with wireframes and clickable prototypes you can review and approve." },
  { title: "Develop", text: "Clean, scalable code delivered in regular milestones, each with a demo." },
  { title: "Test", text: "Functional, performance, device and security checks to make sure it works everywhere." },
  { title: "Deliver", text: "A smooth launch, followed by monitoring, updates and ongoing support." },
];

export const BUDGETS = ["Under ₹50,000", "₹50,000 - ₹2,00,000", "₹2,00,000 - ₹10,00,000", "Above ₹10,00,000"];
