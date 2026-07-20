"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

/** Access the shared Lenis instance, e.g. to programmatically scroll to an anchor. */
export function useLenis() {
  return useContext(LenisContext).lenis;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // On mobile/touch devices, skip Lenis entirely so native scrolling
    // works without interference. Lenis's RAF loop and scroll interception
    // can conflict with momentum scrolling on iOS/Android.
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isTouchDevice) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });
    lenisRef.current = instance;

    // Add class to HTML to disable native smooth scrolling
    document.documentElement.classList.add("lenis");

    let frameId: number;
    function raf(time: number) {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    // Sync state for useLenis hook consumers
    setLenis(instance);

    return () => {
      cancelAnimationFrame(frameId);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>
  );
}
