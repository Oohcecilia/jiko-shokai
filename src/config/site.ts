import type {
  ExperienceItem,
  Project,
  Service,
  Skill,
  Stat,
} from "@/types";

function getEnv(key: string, fallback?: string): string {
  const val = process.env[key];
  if (val !== undefined) return val;
  if (fallback !== undefined) return fallback;
  return "";
}

function tryParseJson<T>(json: string, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

function parseStats(json: string): Stat[] {
  if (!json) return defaultStats;
  try {
    return JSON.parse(json) as Stat[];
  } catch {
    return defaultStats;
  }
}

function parseSkills(json: string): Skill[] {
  if (!json) return defaultSkills;
  try {
    return JSON.parse(json) as Skill[];
  } catch {
    return defaultSkills;
  }
}

const defaultStats: Stat[] = [
  { label: "Projects Completed", value: 62 },
  { label: "Years Experience", value: 7 },
  { label: "Happy Clients", value: 38 },
  { label: "GitHub Contributions", value: 4200, suffix: "+" },
];

const defaultSkills: Skill[] = [
  { name: "React / Next.js", level: 96, category: "Frontend" },
  { name: "TypeScript", level: 93, category: "Frontend" },
  { name: "Three.js / WebGL", level: 82, category: "Frontend" },
  { name: "Tailwind CSS", level: 95, category: "Frontend" },
  { name: "Node.js", level: 90, category: "Backend" },
  { name: "GraphQL", level: 78, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Databases" },
  { name: "Redis", level: 74, category: "Databases" },
  { name: "React Native", level: 80, category: "Mobile" },
  { name: "Swift (iOS)", level: 58, category: "Mobile" },
  { name: "Figma", level: 88, category: "UI/UX" },
  { name: "Design Systems", level: 84, category: "UI/UX" },
  { name: "OpenAI / LLM APIs", level: 86, category: "AI" },
  { name: "Vector Search", level: 72, category: "AI" },
  { name: "AWS", level: 81, category: "Cloud" },
  { name: "Vercel / Edge", level: 90, category: "Cloud" },
  { name: "Docker", level: 83, category: "DevOps" },
  { name: "CI / CD", level: 79, category: "DevOps" },
];

const defaultProjects: Project[] = [
  {
    id: "orbital",
    title: "Orbital — Realtime Ops Dashboard",
    description:
      "A mission-control style dashboard for infrastructure teams, streaming millions of events a day through a WebSocket pipeline into a 60fps canvas renderer.",
    image: "/projects/orbital.jpg",
    tags: ["Next.js", "WebSockets", "D3.js", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "lumen",
    title: "Lumen — AI Writing Studio",
    description:
      "An LLM-powered writing environment with streaming completions, version history, and a real-time collaborative canvas built on CRDTs.",
    image: "/projects/lumen.jpg",
    tags: ["React", "OpenAI", "Yjs", "Node.js"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "vaultline",
    title: "Vaultline — Fintech Onboarding",
    description:
      "A compliance-heavy KYC onboarding flow re-imagined as a guided, animated experience — cut drop-off by 34% in the first quarter.",
    image: "/projects/vaultline.jpg",
    tags: ["TypeScript", "Framer Motion", "Node.js", "AWS"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "atlasfit",
    title: "AtlasFit — Cross-Platform Training App",
    description:
      "A React Native training companion with offline-first sync, wearable integration, and a native-feeling animation layer.",
    image: "/projects/atlasfit.jpg",
    tags: ["React Native", "GraphQL", "SQLite"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "northwind",
    title: "Northwind Commerce Platform",
    description:
      "A headless commerce storefront serving 8 regional brands from one Next.js codebase, with edge-rendered personalization.",
    image: "/projects/northwind.jpg",
    tags: ["Next.js", "Shopify", "Vercel Edge"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "signalboard",
    title: "Signalboard — Analytics SDK",
    description:
      "A lightweight, privacy-first analytics SDK with a Rust ingestion service and a dashboard for funnels, retention and replay.",
    image: "/projects/signalboard.jpg",
    tags: ["Rust", "Next.js", "ClickHouse"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

const defaultExperience: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Senior Full Stack Engineer",
    company: "Nimbus Labs",
    period: "2023 — Present",
    location: "Remote",
    points: [
      "Lead a team of 5 building the core product platform in Next.js and Node.js",
      "Cut median page load by 48% through streaming SSR and edge caching",
      "Introduced a shared design system now used across 6 product teams",
    ],
  },
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "Fieldwire Studio",
    period: "2021 — 2023",
    location: "Singapore",
    points: [
      "Shipped 12+ client products end-to-end, from architecture to deployment",
      "Built a real-time collaboration layer used by 40,000+ monthly users",
      "Mentored 3 junior engineers through a structured growth program",
    ],
  },
  {
    id: "exp-3",
    role: "Frontend Developer",
    company: "Kite & Co.",
    period: "2019 — 2021",
    location: "Manila",
    points: [
      "Rebuilt the flagship marketing site, improving Lighthouse score from 61 to 98",
      "Established component-driven development with Storybook and visual testing",
    ],
  },
  {
    id: "exp-4",
    role: "Junior Web Developer",
    company: "Studio Verve",
    period: "2018 — 2019",
    location: "Manila",
    points: [
      "Built and maintained 20+ WordPress and static marketing sites",
      "First production React project shipped for an internal tools team",
    ],
  },
];

const defaultServices: Service[] = [
  {
    id: "web",
    title: "Web Development",
    description:
      "Fast, accessible, production-grade web apps built on modern frameworks — from marketing sites to complex dashboards.",
    icon: "Globe",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description:
      "Cross-platform apps with React Native that feel native, ship faster, and share a codebase with the web.",
    icon: "Smartphone",
  },
  {
    id: "design",
    title: "UI/UX Design",
    description:
      "Interfaces designed from first principles — wireframes through high-fidelity prototypes and design systems.",
    icon: "PenTool",
  },
  {
    id: "backend",
    title: "Backend & APIs",
    description:
      "Reliable, well-documented APIs and services, built for the scale you have and the scale you're planning for.",
    icon: "Server",
  },
  {
    id: "ai",
    title: "AI Integration",
    description:
      "LLM-powered features, retrieval pipelines and agentic workflows, integrated thoughtfully into real products.",
    icon: "Sparkles",
  },
  {
    id: "cloud",
    title: "Cloud Deployment",
    description:
      "CI/CD, infrastructure-as-code, and monitoring so what you ship stays fast, safe and observable.",
    icon: "CloudCog",
  },
];

export const siteConfig = {
  name: getEnv("SITE_NAME", "Jose Larry Cecilia"),
  role: getEnv("SITE_ROLE", "Full Stack Developer"),
  location: getEnv("SITE_LOCATION", "Remote · GMT+8"),
  email: getEnv("SITE_EMAIL", "hello@world.dev"),
  resumeUrl: getEnv("SITE_RESUME_URL", "/resume.pdf"),
  github: getEnv("SITE_GITHUB_URL", "https://github.com"),
  linkedin: getEnv("SITE_LINKEDIN_URL", "https://linkedin.com"),
  twitter: getEnv("SITE_TWITTER_URL", "https://twitter.com"),
  facebook: getEnv("SITE_FACEBOOK_URL", "https://facebook.com"),
  instagram: getEnv("SITE_INSTAGRAM_URL", "https://instagram.com"),
};

export function getStats(): Stat[] {
  return tryParseJson(getEnv("SITE_STATS", ""), defaultStats);
}

export function getSkills(): Skill[] {
  return tryParseJson(getEnv("SITE_SKILLS", ""), defaultSkills);
}

export function getProjects(): Project[] {
  return tryParseJson(getEnv("PROJECTS", ""), defaultProjects);
}

export function getExperience(): ExperienceItem[] {
  return tryParseJson(getEnv("EXPERIENCE", ""), defaultExperience);
}

export function getServices(): Service[] {
  return tryParseJson(getEnv("SERVICES", ""), defaultServices);
}