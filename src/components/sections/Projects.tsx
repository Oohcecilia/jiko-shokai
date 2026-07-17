"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { type MouseEvent, useRef } from "react";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { useParallax } from "@/hooks/useScrollFx";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/types";

const GRADIENTS = [
  "from-electric/30 via-navy to-charcoal",
  "from-violet/30 via-navy to-charcoal",
  "from-cyan/25 via-navy to-charcoal",
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  // Alternates parallax distance by column so the grid drifts at slightly
  // different depths per lane — a subtle masonry-style depth cue on scroll.
  const parallaxRef = useParallax<HTMLDivElement>({
    distance: 24 + (index % 3) * 14,
    scrub: 0.9,
  });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={parallaxRef} className="will-change-transform">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1200 }}
      >
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative overflow-hidden rounded-3xl border border-glass-border bg-white/[0.02] shadow-glass"
        >
          <div
            className={`relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}
          >
            <motion.span
              style={{ transformStyle: "preserve-3d" }}
              className="absolute inset-0 flex items-center justify-center font-display text-5xl sm:text-6xl font-bold text-white/10 transition-transform duration-700 ease-premium group-hover:scale-110"
            >
              {project.title.split(" ")[0]}
            </motion.span>
            <div className="absolute inset-0 bg-grid-glow bg-[length:32px_32px] opacity-10" />

            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-navy/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-body text-xs font-medium text-matte transition-transform hover:scale-105"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 font-body text-xs font-medium text-white transition-transform hover:scale-105"
                >
                  <Github className="h-3.5 w-3.5" /> Code
                </a>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6" style={{ transform: "translateZ(30px)" }}>
            <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-white/50">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <SectionHeading
        eyebrow="Selected Work"
        title="Projects built to last"
        subtitle="A handful of products I've designed, built and shipped end to end."
        accent="violet"
      />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
