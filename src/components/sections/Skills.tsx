"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { useSectionProgress } from "@/hooks/useScrollFx";
import { SKILLS } from "@/lib/data";
import type { SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

const TechSphere = dynamic(
  () => import("@/components/three/TechSphere").then((m) => m.TechSphere),
  { ssr: false }
);

const CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Mobile",
  "UI/UX",
  "AI",
  "Cloud",
  "DevOps",
  "Databases",
];

function CircularProgress({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div ref={ref} className="relative grid h-20 w-20 shrink-0 place-items-center">
      <svg width="80" height="80" className="-rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={inView ? offset : circumference}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-display text-sm font-semibold text-white">{value}%</span>
    </div>
  );
}

export function Skills() {
  const [active, setActive] = useState<SkillCategory>("Frontend");
  const filtered = useMemo(() => SKILLS.filter((s) => s.category === active), [active]);
  const [sphereContainerRef, sphereProgressRef] = useSectionProgress<HTMLDivElement>();
  // Track whether the sphere container is in the viewport so TechSphere
  // can pause its R3F render loop when offscreen (saves GPU).
  // Use a generous margin to keep the loop running a bit before/after
  // entering view, preventing flicker during fast scrolling.
  const sphereInView = useInView(sphereContainerRef, {
    margin: "200px 0px 200px 0px",
  });

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <SectionHeading eyebrow="Skills" title="A toolkit built for shipping" accent="cyan" />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "rounded-full border px-4 py-2 font-body text-xs font-medium tracking-wide transition-all duration-300",
                  active === cat
                    ? "border-electric/50 bg-electric/10 text-electric shadow-glow"
                    : "border-glass-border text-white/50 hover:text-white/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {filtered.map((skill) => (
                <div
                  key={skill.name}
                  className="group flex items-center gap-4 rounded-2xl border border-glass-border bg-white/[0.02] p-4 backdrop-blur-xl transition-all duration-300 hover:border-electric/40 hover:bg-white/[0.04] hover:shadow-glow"
                >
                  <CircularProgress value={skill.level} />
                  <div>
                    <p className="font-display text-sm font-medium text-white">{skill.name}</p>
                    <p className="font-body text-xs text-white/40">{skill.category}</p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-2 font-body text-sm text-white/40">
                  Nothing tagged here yet.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          ref={sphereContainerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-[300px] sm:h-[360px] lg:h-[440px] rounded-[2rem] border border-glass-border bg-white/[0.015]"
        >
          <TechSphere progressRef={sphereProgressRef} inView={sphereInView} />
        </motion.div>
      </div>
    </section>
  );
}