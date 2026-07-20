"use client";

import { useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

export function LoadingScreen() {
  const prefersReducedMotion = useReducedMotion();
  const letters = site.name.split("");

  if (prefersReducedMotion) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background animate-fade-out pointer-events-none"
      style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
    >
      <div className="flex overflow-hidden text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {letters.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className="inline-block animate-slide-up"
            style={{ animationDelay: `${0.15 + i * 0.035}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>

      <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full w-full bg-gradient-to-r from-primary via-secondary to-accent animate-scale-x"
          style={{ transformOrigin: "left", animationDuration: "0.8s" }}
        />
      </div>

      <span className="sr-only">Loading portfolio</span>
    </div>
  );
}
