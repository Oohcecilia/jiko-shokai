"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { site } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GradientText } from "@/components/ui/GradientText";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

const Scene = dynamic(
  () => import("@/components/three/LazyScene").then((m) => m.LazyScene),
  { ssr: false }
);

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    let rafId: number;
    const section = sectionRef.current;

    function updateScroll() {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - viewportHeight)));
      setScrollProgress(progress);
      rafId = requestAnimationFrame(updateScroll);
    }

    rafId = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion]);

  const y = scrollProgress * 120;
  const opacity = Math.max(0, 1 - scrollProgress / 0.8);

  function scrollToSection(id: string) {
    const target = document.querySelector(id);
    if (!target) return;
    if (lenis && !isMobile) {
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Scroll indicator - plain button on mobile to avoid touch interception
  const ScrollIndicator = isMobile ? (
    <button
      type="button"
      onClick={() => scrollToSection("#projects")}
      aria-label="Scroll to projects"
      className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
      <span className="animate-bounce" style={{ animationDuration: "1.6s" }}>
        <ChevronDown size={18} />
      </span>
    </button>
  ) : (
    <motion.button
      type="button"
      onClick={() => scrollToSection("#projects")}
      aria-label="Scroll to projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
      <span className="animate-bounce" style={{ animationDuration: "1.6s" }}>
        <ChevronDown size={18} />
      </span>
    </motion.button>
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6"
    >
      {!prefersReducedMotion && <Scene />}

      {/* Static fallback / underlay gradient — visible immediately, and
          the only background shown when reduced-motion is requested. */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-radial-fade" />

      {/* Animated ambient gradient blobs (CSS-only, cheap, always present) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[100px] animate-blob" />
        <div
          className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-[100px] animate-blob"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-secondary/20 blur-[100px] animate-blob"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div
        style={{ transform: `translateY(${y}px)`, opacity }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <motion.span
          variants={item}
          initial="hidden"
          animate="show"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {site.availability}
        </motion.span>

        <motion.p
          variants={item}
          initial="hidden"
          animate="show"
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted"
        >
          {site.name} · {site.role}
        </motion.p>

        <motion.h1
          variants={item}
          initial="hidden"
          animate="show"
          className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Building Beautiful
          <br />
          <GradientText>Digital Experiences</GradientText>
        </motion.h1>

        <motion.p
          variants={item}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted"
        >
          {site.bio}
        </motion.p>

        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton
            onClick={() => scrollToSection("#projects")}
            variant="primary"
          >
            View Projects
            <ArrowRight size={17} />
          </MagneticButton>
          <MagneticButton
            onClick={() => scrollToSection("#contact")}
            variant="outline"
          >
            <Sparkles size={16} />
            Contact
          </MagneticButton>
        </motion.div>
      </div>

      {ScrollIndicator}
    </section>
  );
}
