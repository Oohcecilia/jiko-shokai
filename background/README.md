# Developer Portfolio

An award-worthy, single-page developer portfolio: dark, glassmorphic UI,
an interactive Three.js background, and Framer Motion animations throughout —
built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # run the production build
```

## The only two files you should need to edit

**`config/site.ts`** — your name, role, bio, availability, email, and social
links. Everything in the hero, nav, and footer reads from here.

**`config/projects.ts`** — one array of projects. The grid, search, tag
filters, sort, and the larger "featured" bento cards are all generated
automatically from this file. To add a project:

```ts
{
  name: "My Project",
  url: "https://myproject.com",
  icon: "/icons/my-project.svg",     // small square logo
  image: "/images/my-project.jpg",   // ~16:10 preview image
  description: "One or two sentences about it.",
  tags: ["React", "Next.js", "TypeScript"],
  featured: true,                     // optional — renders a larger card
}
```

Drop the matching image/icon files into `public/images` and `public/icons`.
No component code needs to change.

## What's included

- **3D background** (`components/three/`) — React Three Fiber scene with a
  distorted glowing icosahedron, a glass-like sphere (`meshPhysicalMaterial`
  transmission, chosen over drei's `MeshTransmissionMaterial` for lighter
  GPU cost), a metallic torus, floating particles, and cursor-driven
  parallax. Automatically reduces particle count and disables distortion on
  small screens, and is skipped entirely when the user prefers reduced
  motion.
- **Smooth scrolling** via `lenis`, wired through a small context provider
  (`components/providers/SmoothScrollProvider.tsx`) so nav links and buttons
  can scroll to sections programmatically. Falls back to native scrolling
  automatically when reduced motion is requested.
- **Search, tag filters, and sort** for projects (`lib/utils.ts` +
  `components/projects/ProjectFilters.tsx`), fully driven by
  `config/projects.ts` — no manual wiring per project.
- **Premium visual details**: glass cards with an animated gradient
  hairline border (`.gradient-border` in `app/globals.css`), a film-grain
  noise overlay, a cursor-trailing glow (additive, never hides the native
  cursor), an animated loading screen, and a scroll progress bar.
- **Accessibility**: semantic landmarks, skip-to-content link, visible
  focus rings, `aria-pressed`/`aria-expanded` on toggles, decorative
  elements marked `aria-hidden`, and `prefers-reduced-motion` respected by
  the 3D scene, Lenis, the loading screen, and the magnetic buttons.
- **SEO**: Next.js Metadata API (title template, Open Graph, Twitter card,
  robots) plus a JSON-LD `Person` schema in `app/layout.tsx`.

## Notes worth knowing about

- **Placeholder art**: the projects ship with generated SVG gradient
  artwork in `public/images` and `public/icons` so the page looks complete
  out of the box. Swap in real screenshots/logos (jpg/png/svg all work —
  `next.config.mjs` already allows optimizing local SVGs).
- **Font**: uses `Inter` via `next/font/google` for guaranteed-safe
  builds. If you'd prefer Geist, swap the import in `app/layout.tsx` for
  `import { Geist } from "next/font/google"` (available in current Next.js
  versions) — everything else (CSS variable name, Tailwind config) already
  expects a `--font-sans` variable, so no other change is needed.
- **`<Environment preset="city" />`** (in `components/three/FloatingShapes.tsx`)
  fetches a small HDRI lighting preset from drei's CDN at runtime in the
  user's browser for realistic reflections on the glass/metal shapes. This
  is a normal runtime network request made by visitors' browsers, not a
  build-time dependency.
- **Before deploying**: update `siteUrl` in `app/layout.tsx` to your real
  domain (used for canonical/OG URLs and the JSON-LD).
- **Optional extra polish**: for an even glowier 3D scene you can add
  `@react-three/postprocessing` and wrap the scene contents in an
  `<EffectComposer><Bloom .../></EffectComposer>`. It's left out by default
  to keep the dependency list and GPU cost minimal.

## Tech stack

Next.js · React · TypeScript · Tailwind CSS · Framer Motion ·
React Three Fiber · @react-three/drei · Lenis · Lucide Icons
