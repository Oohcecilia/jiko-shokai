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
  { label: "Years Experience", value: getYearsExperience() },
  { label: "Happy Clients", value: 38 },
  { label: "GitHub Contributions", value: 4200, suffix: "+" },
];

function getYearsExperience(): number {
  const startYear = parseInt(getEnv("EXPERIENCE_START_YEAR", "2022"), 10);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed, May = 4
  let years = currentYear - startYear;
  if (currentMonth < 4) years -= 1;
  return Math.max(0, years);
}

const defaultSkills: Skill[] = [
  { name: "React / Next.js", level: 96, category: "Frontend" },
  { name: "TypeScript", level: 93, category: "Frontend" },
  { name: "Three.js / WebGL", level: 82, category: "Frontend" },
  { name: "Tailwind CSS", level: 95, category: "Frontend" },
  { name: "Node.js", level: 90, category: "Backend" },
  { name: "GraphQL", level: 78, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Databases" },
  { name: "Redis", level: 74, category: "Databases" },
  { name: "React Native", level: 60, category: "Mobile" },
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
    id: "synchaura",
    title: "Synchaura — Built for collaboration",
    description:
      "Collaborative task management for high-performing teams, keeping your organization aligned and projects on schedule.",
    image: "/projects/synchaura.png",
    tags: ["React.js", "WebSockets", "D3.js", "Couchdb"],
    liveUrl: "https://synchaura.dpdns.org",
    githubUrl: "https://github.com/Oohcecilia/synchaura",
    featured: true,
  },
  {
    id: "vibeoke",
    title: "Vibeoke - Karaoke System",
    description:
      "The ultimate real-time karaoke party experience for homes and social events, featuring a synchronized player and mobile-remote controller.",
    image: "/projects/vibeoke.png",
    tags: ["React", "Websocket", "Yjs", "Node.js"],
    liveUrl: "https://vibeoke.dpdns.org",
    githubUrl: "https://github.com/Oohcecilia/vibeoke",
    featured: true,
  },
  {
    id: "vaultline",
    title: "Vaultline — Fintech Onboarding",
    description:
      "A compliance-heavy KYC onboarding flow re-imagined as a guided, animated experience — cut drop-off by 34% in the first quarter.",
    image: "",
    tags: ["TypeScript", "Framer Motion", "Node.js", "AWS"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "philman",
    title: "PhilManPower Digital Bridge",
    description:
      "A premium B2B recruitment gateway connecting qualified Filipino professionals with European employers through a seamless, compliant, and transparent digital process.",
    image: "/projects/philman.png",
    tags: ["Next.js", "Node.js"],
    liveUrl: "https://oohcecilia.github.io/philmanpower/",
    githubUrl: "https://github.com/Oohcecilia/philmanpower",
  },
  {
    id: "Stadium",
    title: "Stadium Sanctum",
    description:
      "A high-end, immersive sports bar experience, premium table reservations, and an electric atmosphere designed for the modern sports enthusiast.",
    image: "/projects/stadium.png",
    tags: ["React.js", "Vercel Edge"],
    liveUrl: "https://oohcecilia.github.io/mb_lp/",
    githubUrl: "https://github.com/Oohcecilia/mb_lp",
  },
  {
    id: "serenite",
    title: "Serenité Café & Restaurant",
    description:
      "An elegant digital home for an upscale café and restaurant, featuring seasonal menus, reservation management, and our brand story.",
    image: "/projects/verdant.png",
    tags: ["React.js", "ClickHouse"],
    liveUrl: "https://oohcecilia.github.io/verdant-distro/",
    githubUrl: "https://github.com/Oohcecilia/verdant-distro",
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
  name: getEnv("SITE_NAME", "Ooh Cecilia"),
  role: getEnv("SITE_ROLE", "Full Stack Developer"),
  location: getEnv("SITE_LOCATION", "Remote · GMT+8"),
  email: getEnv("SITE_EMAIL", "oohcecilia@proton.me"),
  resumeUrl: getEnv("SITE_RESUME_URL", "/resume.pdf"),
  github: getEnv("SITE_GITHUB_URL", "https://github.com/Oohcecilia"),
  linkedin: getEnv("SITE_LINKEDIN_URL", "https://www.linkedin.com/in/jose-larry-jr-cecilia-277b54422/"),
  twitter: getEnv("SITE_TWITTER_URL", "https://twitter.com"),
  facebook: getEnv("SITE_FACEBOOK_URL", "https://www.facebook.com/profile.php?id=61591193207614"),
  instagram: getEnv("SITE_INSTAGRAM_URL", "https://www.instagram.com/ooh_cecilia24/"),
  experience: getEnv("SITE_EXPERIENCE", "5")
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