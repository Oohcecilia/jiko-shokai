import { create } from "zustand";

export type CursorVariant = "default" | "hover" | "text" | "drag";

interface AppState {
  /** 0 -> 1 progress through the entire page, driven by Lenis */
  scrollProgress: number;
  setScrollProgress: (v: number) => void;

  /** 0 -> 1 progress as Hero section exits viewport */
  heroExitProgress: number;
  setHeroExitProgress: (v: number) => void;

  isLoading: boolean;
  setIsLoading: (v: boolean) => void;

  cursorVariant: CursorVariant;
  setCursorVariant: (v: CursorVariant) => void;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),

  heroExitProgress: 0,
  setHeroExitProgress: (v) => set({ heroExitProgress: v }),

  isLoading: true,
  setIsLoading: (v) => set({ isLoading: v }),

  cursorVariant: "default",
  setCursorVariant: (v) => set({ cursorVariant: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));
