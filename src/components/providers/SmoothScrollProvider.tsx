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

    // On mobile/touch devices, skip Lenis entirely so native scrolling
    // works untouched. Lenis's RAF loop and scroll interception can
    // interfere with momentum scrolling and touch gestures on iOS/Android.
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice || prefersReducedMotion) {
      // Still set scroll progress from native scroll for GSAP triggers
      const onScroll = () => {
        const scrollY = window.scrollY;
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(limit > 0 ? scrollY / limit : 0);
        ScrollTrigger.update();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    // syncTouch defaults to false in Lenis — we explicitly confirm it
    // here to ensure touch/pinch gestures on mobile are never intercepted.
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
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
