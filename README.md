# Jose Larry Cecilia — 3D Developer Portfolio

A cinematic, Awwwards-style developer portfolio built with Next.js 15, React 19, Three.js / React Three Fiber, GSAP, Framer Motion, and Lenis smooth scrolling.

## Overview

This is a production-ready, fully responsive developer portfolio featuring immersive 3D graphics, smooth scroll animations, and a polished design system. Built with modern web technologies and optimized for performance, accessibility, and production deployment.

## Key Features

- **Immersive 3D Background** — Interactive particle field with floating geometric shapes, mouse parallax, and scroll-driven depth
- **Hero Scene** — Interactive WebGL hero with glass sphere, wireframe knot, neon rings, floating cubes, and code panel
- **Skills Section** — Interactive circular progress indicators with category filtering and a 3D tech sphere
- **Projects Showcase** — Animated project cards with 3D tilt effect, hover states, and live demo links
- **Experience Timeline** — Animated timeline with scroll-triggered progress line and animated cards
- **Services Section** — Animated service cards with hover effects and icon system
- **GitHub Integration** — Live GitHub stats, contribution graph, language breakdown, and featured repositories
- **Contact Form** — Validated form with EmailJS integration, world map visualization, and toast notifications
- **Smooth Scrolling** — Lenis-powered smooth scrolling with GSAP ScrollTrigger synchronization
- **Custom Cursor** — Magnetic cursor with hover states, click ripple animation, and touch support
- **Responsive Design** — Mobile-first approach with breakpoints at 320px, 768px, 1024px, 1440px, 1920px+
- **Accessibility** — WCAG 2.1 AA compliant, reduced motion support, focus-visible outlines, semantic HTML

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 3.4, CSS Variables, PostCSS, Autoprefixer |
| **3D Graphics** | Three.js 0.170, React Three Fiber 9, @react-three/drei 10, @react-three/postprocessing 3 |
| **Animation** | Framer Motion 11, GSAP 3.12 + ScrollTrigger, Lenis 1.1 |
| **State Management** | Zustand 5 |
| **Forms & Validation** | React Hook Form 7, Zod 3, @hookform/resolvers |
| **UI Components** | shadcn/ui-style primitives, lucide-react icons, clsx, tailwind-merge, class-variance-authority |
| **Forms & Email** | React Hook Form, Zod, EmailJS |
| **Utilities** | clsx, tailwind-merge, class-variance-authority |

## Project Architecture

```
src/
├── app/
│   ├── layout.tsx           # Root layout: fonts, metadata, global providers
│   ├── page.tsx             # Home page: composes all sections
│   ├── globals.css          # Tailwind layers, Lenis/reduced-motion base rules
│   └── api/
│       └── github/
│           └── route.ts     # GitHub API proxy (repos, languages, contributions)
├── components/
│   ├── providers/
│   │   ├── Preloader.tsx           # Loading screen with progress bar
│   │   └── SmoothScrollProvider.tsx # Lenis + GSAP ScrollTrigger sync
│   ├── layout/
│   │   ├── Navbar.tsx              # Fixed nav, mobile menu, scroll progress bar
│   │   ├── Footer.tsx              # Social links, copyright, back-to-top
│   │   ├── CustomCursor.tsx        # Magnetic cursor, ripple, hover states
│   │   ├── BackgroundWrapper.tsx   # Dynamic import wrapper for backgrounds
│   │   ├── AnimatedBackground.tsx  # Canvas particles + aurora blobs + grid + noise
│   │   ├── SectionDivider.tsx      # Animated gradient line between sections
│   │   └── GlobalBackground3D.tsx  # Three.js particle field + floating shapes
│   ├── motion/
│   │   ├── SectionHeading.tsx      # Word-level blur/reveal + parallax
19:   │   ├── FloatingOrbs.tsx        # Ambient glass orbs for non-3D sections
20:   │   └── SectionHeading.tsx      # Word-level blur/reveal + parallax
21:   ├── three/
22:   │   ├── HeroScene.tsx           # Interactive WebGL hero scene
22:   │   ├── SkillCube.tsx           # Rotating skill cube with face labels
23:   │   └── TechSphere.tsx          # Fibonacci-distributed tech labels on sphere
24:   ├── sections/
24:   │   ├── Hero.tsx                # Landing section with 3D hero
25:   │   ├── About.tsx               # Portrait, bio, stats, tech marquee
26:   │   ├── Skills.tsx              # Category filter + progress rings + TechSphere
27:   │   ├── Projects.tsx            # 3D tilt cards with live/code links
28:   │   ├── Experience.tsx          # Animated timeline with progress line
29:   │   ├── Services.tsx            # Hover-animated service cards
29:   │   ├── GithubSection.tsx       # Stats, contributions, languages, repos
30:   │   └── Contact.tsx             # World map, form, social links
30:   └── ui/
31:       ├── button.tsx              # CVA variants (primary, glass, ghost, outline)
31:       ├── input.tsx               # Floating label input
31:       ├── textarea.tsx            # Floating label textarea
31:       ├── badge.tsx               # Tech tag badges
31:       └── Image.tsx               # Themed Image with loading/fallback
31:   ├── hooks/
32:       ├── useInteractions.ts      # Magnetic cursor, mouse tracking
32:       ├── usePerf.ts              # Performance tier + reduced motion
32:       ├── useScrollFx.ts          # useParallax, useSectionProgress (GSAP)
32:       └── useMousePosition.ts     # Normalized mouse position for 3D
32:   ├── lib/
33:       ├── utils.ts                # cn, lerp, mapRange, class utilities
33:       ├── validations.ts          # Zod schemas (contact form)
33:       ├── email.ts                # EmailJS wrapper
33:       └── data.ts                 # Content: SITE, STATS, SKILLS, PROJECTS, EXPERIENCE, SERVICES
33:   ├── store/
33:       └── useAppStore.ts          # Zustand: scrollProgress, cursor, menu, loading
33:   └── types/
33:       └── index.ts                # Shared TypeScript types
33: ```

## Prerequisites

- **Node.js** 18.17+ (LTS recommended)
- **npm** 9+ or **pnpm** 8+
- **Git**

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and configure the following:

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_NAME` | No | Your display name (default: "Jose Larry Cecilia") |
| `SITE_ROLE` | No | Your role/title (default: "Full Stack Developer") |
| `SITE_LOCATION` | No | Location string (default: "Remote · GMT+8") |
| `SITE_EMAIL` | No | Contact email |
| `SITE_RESUME_URL` | No | Path to resume PDF (default: `/resume.pdf`) |
| `SITE_GITHUB_URL` | No | GitHub profile URL |
| `SITE_LINKEDIN_URL` | No | LinkedIn profile URL |
| `SITE_TWITTER_URL` | No | Twitter/X profile URL |
| `SITE_FACEBOOK_URL` | No | Facebook profile URL |
| `SITE_INSTAGRAM_URL` | No | Instagram profile URL |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | No* | EmailJS service ID for contact form |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | No* | EmailJS template ID |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | No* | EmailJS public key |
| `NEXT_PUBLIC_GITHUB_USERNAME` | No | GitHub username for repo fetching |
| `GITHUB_USERNAME` | No | Server-side GitHub username (for contributions) |
| `GITHUB_TOKEN` | No | Fine-grained PAT (no special scopes) for contribution calendar |

*EmailJS variables are optional — the contact form will show a configuration notice if not set.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production (static export ready) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Configuration

### Tailwind CSS

Custom theme in `tailwind.config.ts`:
- Custom colors (`matte`, `charcoal`, `navy`, `electric`, `cyan`, `violet`)
- Custom fonts (Space Grotesk display, Inter body)
- Custom gradients (`aurora-1/2/3`, `grid-glow`)
- Custom shadows (`glow`, `glow-violet`, `glow-cyan`, `glass`)
- Custom animations (`float`, `blob`, `aurora`, `shimmer`, `marquee`, `pulse-ring`)
- Custom easing (`premium`: cubic-bezier(0.16, 1, 0.3, 1))

### Fonts

Configured in `src/app/layout.tsx` via `next/font/google`:
- **Display**: Space Grotesk (`--font-space-grotesk`)
- **Body**: Inter (`--font-inter`)

### Environment Variables

See `.env.example` for all available options. The application uses a config layer in `src/config/site.ts` that reads from `process.env` with sensible defaults.

## Development Setup

### IDE Recommendations

- **VS Code** with extensions: ESLint, Tailwind CSS IntelliSense, TypeScript Vue Language Features (Volar)

### Git Hooks (Optional)

```bash
# Install husky
npm install -D husky
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### Debugging

- **Next.js**: Attach to Node process in VS Code (`launch.json`)
- **React DevTools**: Browser extension for component inspection
- **Three.js**: Use `r3f-perf` or React Three Fiber DevTools

## Build & Production Deployment

### Static Export (Recommended for Vercel/Netlify/Cloudflare)

```bash
npm run build
```

The output is in `.next/` — deploy to any static host.

### Vercel (Recommended)

1. Connect GitHub/GitLab/Bitbucket repo
2. Add environment variables from `.env.example` in Vercel dashboard
3. Deploy — auto-detects Next.js, runs `npm run build`

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build
docker build -t portfolio .
# Run
docker run -p 3000:3000 --env-file .env.local portfolio
```

## API Overview

### `/api/github` (GET)

Proxies GitHub API to avoid CORS and rate limits.

**Response:**
```json
{
  "repos": [...],
  "totalStars": 42,
  "totalRepos": 12,
  "languages": { "TypeScript": 12000, "JavaScript": 8000 },
  "contributions": { "total": 1200, "days": [{ "date": "2024-01-15", "count": 5 }] }
}
```

**Environment:** Requires `NEXT_PUBLIC_GITHUB_USERNAME`, optionally `GITHUB_TOKEN` for contribution calendar.

## Database Setup

**Not applicable** — This is a static portfolio with no database. All content is managed via `src/lib/data.ts` or environment variables.

## Docker Setup

See [Build & Production Deployment](#docker) above.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` fails | Delete `node_modules` and `package-lock.json`, run `npm cache clean --force`, then `npm install` |
| 3D scenes not rendering | Check browser WebGL support; ensure hardware acceleration is enabled |
| Animations stutter | Enable `prefers-reduced-motion` in OS settings to test fallback; check `usePerformanceTier` hook |
| Contact form fails | Verify EmailJS credentials in `.env.local`; check browser console for errors |
| GitHub data not loading | Verify `NEXT_PUBLIC_GITHUB_USERNAME`; check `/api/github` in browser network tab |
| Fonts not loading | Check `next/font` config in `layout.tsx`; ensure Google Fonts accessible |
| Build fails on Vercel | Check build logs; ensure all env vars are set in Vercel dashboard |

## Security Notes

- **No secrets in code** — All secrets via environment variables
- **Server-only tokens** — `GITHUB_TOKEN` never exposed to client
- **EmailJS** — Public key only; service/template IDs public but scoped
- **CSP** — Next.js default CSP; extend in `next.config.ts` if needed
- **Dependencies** — Regular `npm audit` recommended; `package-lock.json` committed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- **ESLint** + **Prettier** (via Next.js config)
- **TypeScript** strict mode
- **Conventional Commits** recommended

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ using Next.js, Three.js, and a lot of coffee.