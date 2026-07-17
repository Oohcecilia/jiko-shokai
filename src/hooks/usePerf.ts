"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Coarse device capability check used to gracefully degrade the 3D
 * scenes and heavy blur effects on lower-end / mobile hardware, per
 * the brief's "Performance" and "Responsive" requirements.
 */
export function usePerformanceTier() {
  const [tier, setTier] = useState<"high" | "low" | "pending">("pending");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isNarrow = window.innerWidth < 768;
    const lowCores =
      typeof navigator !== "undefined" &&
      "hardwareConcurrency" in navigator &&
      navigator.hardwareConcurrency <= 4;

    if (prefersReducedMotion || (isNarrow && lowCores)) {
      setTier("low");
    } else {
      setTier("high");
    }
  }, []);

  return tier === "low" ? "low" : "high";
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return mounted ? reduced : false;
}

/** Animates a number from 0 to `value` once the element scrolls into view. */
export function useCountUp(value: number, duration = 2000) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return { ref, display };
}
