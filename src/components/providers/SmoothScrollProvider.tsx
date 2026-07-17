"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAppStore } from "@/store/useAppStore";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.4 : 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    setLenisInstance(lenis);

    lenis.on(
      "scroll",
      ({ scroll, limit }: { scroll: number; limit: number }) => {
        setScrollProgress(limit > 0 ? scroll / limit : 0);
        ScrollTrigger.update();
      }
    );

    // Keep GSAP's ticker and Lenis's RAF loop in lockstep for buttery sync.
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Lenis (in its default, non-virtual mode) drives the real window
    // scroll position, so every ScrollTrigger in the app can simply use
    // the default `window` scroller — no scrollerProxy required. We just
    // need ScrollTrigger's internal state nudged in step with Lenis
    // (done above) and refreshed once layout has settled (fonts/images).
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    const settleTimer = setTimeout(refresh, 300);

    return () => {
      window.removeEventListener("resize", refresh);
      clearTimeout(settleTimer);
      lenis.destroy();
      gsap.ticker.remove(update);
      setLenisInstance(null);
    };
  }, [setScrollProgress]);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
