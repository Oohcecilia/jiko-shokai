"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type MutableRefObject } from "react";
import { usePerformanceTier, usePrefersReducedMotion } from "@/hooks/usePerf";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxOptions {
  /** Vertical travel in px (or %-of-height via `unit: "%"`) across the element's scroll pass. Positive drifts down, negative drifts up. */
  distance?: number;
  unit?: "px" | "%";
  /** Optional subtle scale change across the scroll pass, e.g. 0.94 -> 1. */
  scaleFrom?: number;
  /** Optional subtle rotation (deg) across the scroll pass. */
  rotationTo?: number;
  /** How tightly the motion follows the scrollbar; higher = laggier/smoother. */
  scrub?: number | boolean;
  /** Shrinks the effect on low-tier devices instead of fully disabling it. */
  dampenOnLowTier?: boolean;
}

/**
 * Applies a continuous, scroll-scrubbed depth effect (translate/scale/rotate)
 * to the returned ref's element. Disabled entirely for prefers-reduced-motion,
 * and dampened (not removed) on low-performance devices by default.
 */
export function useParallax<T extends HTMLElement>(options: ParallaxOptions = {}) {
  const ref = useRef<T>(null);
  const tier = usePerformanceTier();
  const reducedMotion = usePrefersReducedMotion();

  const {
    distance = 40,
    unit = "px",
    scaleFrom,
    rotationTo,
    scrub = 1,
    dampenOnLowTier = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const dampen = tier === "low" && dampenOnLowTier ? 0.4 : 1;
    const travel = distance * dampen;

    const ctx = gsap.context(() => {
      const yProp = unit === "%" ? "yPercent" : "y";
      gsap.fromTo(
        el,
        {
          [yProp]: travel / 2,
          scale: scaleFrom ? 1 - (1 - scaleFrom) * dampen : 1,
          rotate: 0,
        },
        {
          [yProp]: -travel / 2,
          scale: 1,
          rotate: rotationTo ? rotationTo * dampen : 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [tier, reducedMotion, distance, unit, scaleFrom, rotationTo, scrub, dampenOnLowTier]);

  return ref;
}

/**
 * Tracks a container's 0→1 progress through the viewport in a ref (no
 * re-renders), for feeding imperative consumers like R3F `useFrame` loops.
 * Defaults to a "mid-viewport transit" range; pass `start`/`end` to track
 * something else, e.g. an element's own scroll-exit from the page top.
 */
export function useSectionProgress<T extends HTMLElement>(
  options: { start?: string; end?: string; onProgress?: (progress: number) => void } = {}
): [MutableRefObject<T | null>, MutableRefObject<number>] {
  const containerRef = useRef<T>(null);
  const progressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const { start = "top bottom", end = "bottom top", onProgress } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start,
        end,
        scrub: true,
        onUpdate: (self) => {
          const progress = reducedMotion ? 0.5 : self.progress;
          progressRef.current = progress;
          if (onProgress) onProgress(progress);
        },
      });
    });

    return () => ctx.revert();
  }, [reducedMotion, start, end, onProgress]);

  return [containerRef, progressRef];
}
