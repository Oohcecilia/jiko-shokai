import type { Project } from "@/types/project";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PROJECTS CONFIG
 * ─────────────────────────────────────────────────────────────────────────
 *  This is the ONLY file you need to edit to add, remove, or update
 *  projects. The Projects section, search, tag filters, sort, and the
 *  featured/bento layout are all generated automatically from this array.
 *
 *  Fields:
 *  - name        Project title
 *  - url         Live link (card + "Visit" both open this)
 *  - icon        Path to a small square logo, e.g. "/icons/your-logo.svg"
 *  - image       Path to a preview image, ideally ~16:10, e.g. "/images/your-preview.jpg"
 *  - description Short 1–2 sentence summary
 *  - tags        Technology badges — also power the filter chips
 *  - featured    Optional. `true` renders a larger, bento-style card.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    name: "Nova Analytics",
    url: "https://example.com/nova-analytics",
    icon: "/icons/nova-analytics.svg",
    image: "/images/nova-analytics.svg",
    description:
      "A real-time analytics platform for SaaS teams — customizable dashboards, cohort analysis, and sub-second query performance over billions of events.",
    tags: ["React", "Next.js", "TypeScript", "D3.js"],
    featured: true,
  },
  {
    name: "Aurora Commerce",
    url: "https://example.com/aurora-commerce",
    icon: "/icons/aurora-commerce.svg",
    image: "/images/aurora-commerce.svg",
    description:
      "Headless commerce engine powering storefronts for fast-growing DTC brands, with composable checkout and native Stripe integration.",
    tags: ["Next.js", "GraphQL", "Stripe", "PostgreSQL"],
    featured: true,
  },
  {
    name: "Pulse Chat",
    url: "https://example.com/pulse-chat",
    icon: "/icons/pulse-chat.svg",
    image: "/images/pulse-chat.svg",
    description:
      "Low-latency messaging app with presence, typing indicators, and end-to-end encrypted threads at scale.",
    tags: ["React", "Node.js", "WebSockets", "Redis"],
  },
  {
    name: "Orbit CMS",
    url: "https://example.com/orbit-cms",
    icon: "/icons/orbit-cms.svg",
    image: "/images/orbit-cms.svg",
    description:
      "A visual, type-safe content system for product teams — structured content modeling with instant preview.",
    tags: ["TypeScript", "Next.js", "Prisma", "tRPC"],
  },
  {
    name: "Vertex Configurator",
    url: "https://example.com/vertex-configurator",
    icon: "/icons/vertex-configurator.svg",
    image: "/images/vertex-configurator.svg",
    description:
      "Interactive 3D product configurator for e-commerce — real-time materials, lighting, and camera choreography in the browser.",
    tags: ["React Three Fiber", "WebGL", "TypeScript"],
  },
  {
    name: "Flux CLI",
    url: "https://example.com/flux-cli",
    icon: "/icons/flux-cli.svg",
    image: "/images/flux-cli.svg",
    description:
      "A blazing-fast developer productivity CLI for scaffolding, running, and deploying full-stack projects with a single command.",
    tags: ["Rust", "Go", "Docker"],
  },
];
