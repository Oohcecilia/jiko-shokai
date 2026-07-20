"use client";

import { useRef, useState, useEffect, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Project } from "@/types/project";
import { TechBadge } from "./TechBadge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

const MAX_TAGS_VISIBLE = 4;

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [spotlight, setSpotlight] = useState({ x: "50%", y: "50%" });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const enableTilt =
    !isMobile &&
    !prefersReducedMotion &&
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    cardRef.current.style.setProperty("--rotate-y", `${(px - 0.5) * 10}deg`);
    cardRef.current.style.setProperty("--rotate-x", `${(0.5 - py) * 10}deg`);
    setSpotlight({ x: `${px * 100}%`, y: `${py * 100}%` });
  }

  function handleMouseEnter() {
    if (enableTilt) setIsHovered(true);
  }

  function handleMouseLeave() {
    if (enableTilt) {
      cardRef.current?.style.setProperty("--rotate-y", "0deg");
      cardRef.current?.style.setProperty("--rotate-x", "0deg");
      setIsHovered(false);
    }
  }

  const featured = Boolean(project.featured);

  const baseClassName = cn(
    "group gradient-border glass-card relative flex flex-col overflow-hidden rounded-card-lg shadow-premium-sm transition-shadow duration-300 hover:shadow-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
    featured && "sm:col-span-2",
  );

  const featuredBadge = featured
    ? (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-xs font-medium text-accent backdrop-blur-md">
          <Sparkles size={12} />
          Featured
        </div>
      )
    : null;

  const imageSection = (
    <>
      <Image
        src={project.image}
        alt=""
        fill
        priority={priority}
        sizes={
          featured
            ? "(min-width: 640px) 66vw, 100vw"
            : "(min-width: 640px) 33vw, 100vw"
        }
        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
    </>
  );

  const contentSection = (
    <div className="relative z-10 flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-start gap-3">
        <div className="relative -mt-10 h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-background shadow-premium-sm">
          <Image src={project.icon} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="truncate text-lg font-semibold tracking-tight text-white">
            {project.name}
          </h3>
        </div>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tags.slice(0, MAX_TAGS_VISIBLE).map((tag) => (
          <TechBadge key={tag}>{tag}</TechBadge>
        ))}
        {project.tags.length > MAX_TAGS_VISIBLE && (
          <TechBadge>+{project.tags.length - MAX_TAGS_VISIBLE}</TechBadge>
        )}
      </div>

      <div className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-white">
        Visit project
        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </div>
  );

  const mobileCard = (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${project.name} \u2014 opens in a new tab`}
      className={baseClassName}
    >
      {featuredBadge}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-white/5",
          featured ? "aspect-[21/9]" : "aspect-video",
        )}
      >
        {imageSection}
      </div>
      {contentSection}
    </a>
  );

  const desktopCard = (
    <motion.a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${project.name} \u2014 opens in a new tab`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: enableTilt
          ? `perspective(900px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(${isHovered ? 1.015 : 1})`
          : undefined,
      }}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      layout
      className={baseClassName}
    >
      {enableTilt && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(500px circle at ${spotlight.x} ${spotlight.y}, rgba(255,255,255,0.08), transparent 40%)`,
          }}
        />
      )}

      {featuredBadge}

      <div
        className={cn(
          "relative w-full overflow-hidden bg-white/5",
          featured ? "aspect-[21/9]" : "aspect-video",
        )}
      >
        {imageSection}
      </div>
      {contentSection}
    </motion.a>
  );

  return isMobile || prefersReducedMotion ? mobileCard : desktopCard;
}