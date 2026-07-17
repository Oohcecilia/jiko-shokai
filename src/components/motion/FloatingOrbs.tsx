"use client";

import { motion, useInView } from "framer-motion";
import { useMemo } from "react";
import { usePerformanceTier, usePrefersReducedMotion } from "@/hooks/usePerf";
import { useParallax } from "@/hooks/useScrollFx";

const PALETTE = [
  "from-electric/25",
  "from-violet/25",
  "from-cyan/20",
] as const;

/** Deterministic 0..1 pseudo-random so server/client markup always matches. */
function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface FloatingOrbsProps {
  /** Distinguishes the pattern between sections without using real randomness. */
  seed?: number;
  count?: number;
  className?: string;
}

export function FloatingOrbs({ seed = 1, count = 3, className }: FloatingOrbsProps) {
  const tier = usePerformanceTier();
  const reducedMotion = usePrefersReducedMotion();
  const parallaxRef = useParallax<HTMLDivElement>({ distance: 60, scrub: 1.2 });
  const inView = useInView(parallaxRef, { margin: "200px 0px 200px 0px" });

  const orbs = useMemo(() => {
    const n = tier === "low" ? Math.min(count, 2) : count;
    return Array.from({ length: n }, (_, i) => {
      const h1 = hash(seed * 7.1 + i * 3.3);
      const h2 = hash(seed * 4.7 + i * 9.1);
      const h3 = hash(seed * 2.3 + i * 5.9);
      return {
        top: `${10 + h1 * 70}%`,
        left: `${10 + h2 * 75}%`,
        size: 220 + Math.round(h3 * 180),
        color: PALETTE[i % PALETTE.length],
        duration: 10 + h1 * 8,
        delay: h2 * 4,
      };
    });
  }, [seed, count, tier]);

  return (
    <div
      ref={parallaxRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-[1] overflow-hidden ${className ?? ""}`}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-radial ${orb.color} to-transparent blur-3xl`}
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
          }}
          animate={
            reducedMotion || !inView
              ? undefined
              : { y: [0, -26, 0], x: [0, 14, 0], opacity: [0.6, 0.9, 0.6] }
          }
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
