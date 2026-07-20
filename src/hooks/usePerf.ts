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

/**
 * Detects whether the user is on a mobile phone using responsive
 * breakpoints and device capabilities — no user-agent sniffing.
 *
 * A device is considered a "mobile phone" when:
 * 1. Viewport width is < 768px (Tailwind's `md` breakpoint)
 * 2. The primary pointer is coarse (touch screen, not mouse/trackpad)
 *
 * This correctly excludes:
 * - Desktop browsers with narrow windows (fine pointer)
 * - Large tablets like iPad Pro (viewport >= 768px)
 * - Devices with a mouse/trackpad connected (fine pointer)
 *
 * Also listens for device rotation (landscape/portrait changes that
 * cross the 768px threshold) to stay reactive.
 */
export function useIsMobilePhone() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const check = () => {
      const isNarrow = window.innerWidth < 768;
      const isTouch =
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(isNarrow && isTouch);
    };

    check();

    // React to viewport changes (e.g., device rotation)
    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  // Return false during SSR / first render to avoid hydration mismatch
  return mounted ? isMobile : false;
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
