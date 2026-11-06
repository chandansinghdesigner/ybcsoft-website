# YBCSOFT – Premium 3D Website (Next.js)

Redesign of https://ybcsoft.vercel.app/ — same brand (charcoal `#303030`, yellow `#FFF000`, red `#ED3038`, Plus Jakarta Sans, logo),
same contact details and the same working Web3Forms contact integration.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Three.js + React Three Fiber (+ drei `Text3D`) · GSAP + ScrollTrigger · Framer Motion · Lucide.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```
Deploy to Vercel: import the repo (framework auto-detected). No environment variables are required.
Optional: `NEXT_PUBLIC_WEB3FORMS_KEY` overrides the Web3Forms key in `lib/data.ts`.

## How the 3D hero works
- `components/HeroScene.tsx` – real extruded 3D words (`Text3D`, bundled `public/fonts/helvetiker_bold.typeface.json`) placed along the Z axis; camera flies through them; floating geometry, tunnel rings, particles; mouse parallax.
- `components/HeroSection.tsx` – pins the stage (CSS sticky inside a ~700svh container) and uses **GSAP ScrollTrigger** (`scrub`) to drive progress; overlay headline, caption, jump-rail, dissolve into the next section.
- `lib/heroTimeline.ts` – the single scroll → camera mapping shared by 3D and HTML.
- Performance: Three.js is code-split (`dynamic`, `ssr:false`), rendering pauses when the hero is off-screen/tab hidden, DPR capped, fewer objects on mobile.
- Accessibility: `prefers-reduced-motion` or no WebGL → static hero (same content, no pinning); sr-only list of the five services; keyboard-focusable rail; skip link; visible focus rings.

## Where to edit things
All copy, services, tech stack, portfolio items, contact details: **`lib/data.ts`**.
Portfolio items are clearly labelled *Concept project*. Replace with real case studies (add images under `public/assets/images/`).

## Notes vs. the old site
- Old URLs (`/about.html`, `/services.html`, …) 301-redirect to the matching section (see `next.config.js`).
- The unused `api/send-email.js` (Nodemailer) and `backend/` (PHP) mailers were dropped: the live form already used Web3Forms, as your old README states.
- Tech tiles use compact monograms to stay light; swap in official SVG logos in `components/Technologies.tsx` if desired.
