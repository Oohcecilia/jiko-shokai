"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Atom,
  Boxes,
  Cloud,
  Code2,
  Database,
  Figma,
  GitBranch,
  Layers,
} from "lucide-react";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { useCountUp } from "@/hooks/usePerf";
import { useParallax, useSectionProgress } from "@/hooks/useScrollFx";
import { ProfileImage } from "@/components/ui/Image";
import { STATS } from "@/lib/data";

const SkillCube = dynamic(
  () => import("@/components/three/SkillCube").then((m) => m.SkillCube),
  { ssr: false }
);

const TECH_ICONS = [Atom, Boxes, Cloud, Code2, Database, Figma, GitBranch, Layers];

function StatCounter({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  const { ref, display } = useCountUp(value, 1800);
  return (
    <div className="rounded-2xl border border-glass-border bg-white/[0.02] p-5 text-center backdrop-blur-xl">
      <span
        ref={ref}
        className="block bg-gradient-to-br from-white to-white/60 bg-clip-text font-display text-4xl font-semibold text-transparent"
      >
        {display}
        {suffix ?? "+"}
      </span>
      <span className="mt-1 block font-body text-xs text-white/50">{label}</span>
    </div>
  );
}

export function About() {
  const portraitParallax = useParallax<HTMLDivElement>({ distance: 34, scrub: 0.8 });
  const [cubeContainerRef, cubeProgressRef] = useSectionProgress<HTMLDivElement>();


  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <SectionHeading
        eyebrow="About"
        title="The developer behind the interface"
        accent="electric"
      />

      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div ref={portraitParallax} className="relative mx-auto w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-electric/20 via-transparent to-violet/20 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-glass-border bg-gradient-to-br from-charcoal to-navy shadow-glass">
              <ProfileImage src="/profile.png" alt="Profile portrait" className="absolute inset-0 object-cover" />
              <div className="absolute inset-0 bg-grid-glow bg-[length:28px_28px] opacity-10" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -right-6 -top-6 rounded-2xl border border-glass-border bg-charcoal/80 px-4 py-3 shadow-glass backdrop-blur-xl"
            >
              <p className="font-display text-2xl font-semibold text-white">7+</p>
              <p className="font-body text-[11px] text-white/50">Years crafting products</p>
            </motion.div>

            {/* Hand-drawn signature that draws itself into view */}
            <svg viewBox="0 0 220 60" className="mt-6 h-14 w-48 mx-auto lg:mx-0" aria-hidden>
              <motion.path
                d="M6 42C20 10 32 10 40 32C46 48 54 20 64 20C74 20 70 46 80 46C92 46 92 14 106 14C118 14 116 40 128 40C142 40 140 12 154 16C166 20 162 44 176 40C186 37 190 20 200 20C206 20 208 30 214 30"
                fill="none"
                stroke="url(#sig-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
              />
              <defs>
                <linearGradient id="sig-gradient" x1="0" y1="0" x2="220" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col gap-8 z-10"
        >
          <p className="font-body text-base leading-relaxed text-white/60 sm:text-lg">
            I&apos;m a full stack developer who treats interfaces like instruments —
            every transition, every hover, every millisecond of latency is tuned on
            purpose. Over the last seven years I&apos;ve shipped products across
            fintech, health, and AI, always starting from the same question:
            what should this feel like to use?
          </p>
          <p className="font-body text-sm leading-relaxed text-white/45">
            When I&apos;m not deep in a codebase, I&apos;m usually prototyping shaders,
            reading about type systems, or benchmarking the same feature three
            different ways to see which one actually feels faster.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>

          <div className="flex items-center gap-6 overflow-x-auto py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex shrink-0 animate-marquee items-center gap-6">
              {[...TECH_ICONS, ...TECH_ICONS].map((Icon, i) => (
                <span
                  key={i}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-glass-border bg-white/[0.02] text-white/40"
                >
                  <Icon className="h-5 w-5" />
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={cubeContainerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto mt-24 h-[340px] max-w-2xl sm:h-[420px]"
      >
        <div className="absolute inset-0 rounded-[2rem] border border-glass-border bg-white/[0.015] backdrop-blur-md" />
        <SkillCube progressRef={cubeProgressRef} />
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-xs text-white/35">
          Drag your cursor to tilt
        </p>
      </motion.div>
    </section>
  );
}
