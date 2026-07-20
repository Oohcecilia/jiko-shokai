"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import dynamic from "next/dynamic";
import { type ComponentProps, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useMagnetic } from "@/hooks/useInteractions";
import { useSectionProgress } from "@/hooks/useScrollFx";
import { mapRange } from "@/lib/utils";
import { SITE } from "@/lib/data";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { useAppStore } from "@/store/useAppStore";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

const HEADLINE = "Building Digital Experiences That Feel Alive.";

const SOCIALS = [
  { icon: Github, href: SITE.github, label: "GitHub" },
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Twitter, href: SITE.twitter, label: "Twitter" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
];

function MagneticButton({ children, ...props }: ComponentProps<typeof Button>) {
  const ref = useMagnetic<HTMLButtonElement>(0.25);
  return (
    <Button ref={ref} {...props}>
      {children}
    </Button>
  );
}

export function Hero() {
  const lenis = useLenis();
  const setHeroExitProgress = useAppStore((s) => s.setHeroExitProgress);
  const [heroRef, exitProgress] = useSectionProgress<HTMLElement>({
    start: "top top",
    end: "bottom top",
    onProgress: (p) => setHeroExitProgress(p),
  });
  const sceneWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLButtonElement>(null);

  // Cinematic dissolve: as the hero scrolls out from under the next
  // section, the 3D scene dims and the copy fades/lifts away — driven
  // imperatively off one rAF loop so it never trips a React re-render.
  // The loop must run continuously because exitProgress can reverse
  // when the user scrolls back up, and we need to restore the styles.
  useEffect(() => {
    let frame: number;
    const tick = () => {
      const p = exitProgress.current;
      if (sceneWrapRef.current) {
        sceneWrapRef.current.style.opacity = String(mapRange(p, 0, 1, 1, 0.15));
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(mapRange(p, 0, 0.6, 1, 0));
        contentRef.current.style.transform = `translate3d(0, ${mapRange(p, 0, 1, 0, -50)}px, 0)`;
      }
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(mapRange(p, 0, 0.35, 1, 0));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [exitProgress]);

  const scrollToProjects = () => {
    const el = document.querySelector("#projects");
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
  };
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden overflow-x-hidden px-4 sm:px-6"
    >
      <div ref={sceneWrapRef} className="absolute inset-0 will-change-[opacity]">
        <HeroScene />
      </div>

      {/* Readability gradient beneath the text */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-matte via-matte/10 to-transparent" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center pt-16 sm:pt-24 text-center will-change-[opacity,transform]"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/5 px-4 py-1.5 backdrop-blur-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-body text-xs text-white/70 sm:text-sm">Available for select projects</span>
        </motion.div>

        <h1 className="font-display text-[2.2rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[3.8rem] lg:text-[4.2rem]">
          {HEADLINE.split(" ").map((word, wi) => (
            <span key={wi} className="mr-[0.28em] inline-block overflow-hidden align-top last:mr-0">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.35 + wi * 0.07,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-6 max-w-xl font-body text-base text-white/60 sm:text-lg"
        >
          {SITE.role} crafting modern web applications, immersive interfaces, and
          scalable digital products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
        >
          <MagneticButton onClick={scrollToProjects}>View Projects</MagneticButton>
          <MagneticButton variant="glass" onClick={scrollToContact}>
            Contact Me
          </MagneticButton>
          <MagneticButton
            variant="outline"
            onClick={() => window.open(SITE.resumeUrl, "_blank")}
          >
            <Download className="h-4 w-4" /> Download Resume
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.6 }}
          className="mt-8 flex items-center gap-2 sm:mt-10 sm:gap-3"
        >
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              data-cursor="hover"
              className="grid h-10 w-10 place-items-center rounded-full border border-glass-border bg-white/[0.03] text-white/60 transition-all duration-300 hover:-translate-y-1 hover:text-electric hover:shadow-glow sm:h-12 sm:w-12"
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.button
        ref={scrollHintRef}
        onClick={() => {
          const el = document.querySelector("#about");
          if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -60 });
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/80"
        aria-label="Scroll to about section"
      >
        <span className="font-body text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}