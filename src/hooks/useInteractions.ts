"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { lerp } from "@/lib/utils";

/** Tracks raw viewport mouse position. */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}

/**
 * Magnetic hover effect: the element pulls slightly toward the cursor
 * within `strength`, and springs back to rest on mouse leave.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.15);
      current.current.y = lerp(current.current.y, target.current.y, 0.15);
      el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      frame.current = requestAnimationFrame(animate);
    };
    frame.current = requestAnimationFrame(animate);

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      target.current = { x: relX * strength, y: relY * strength };
    };
    const handleLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [strength]);

  return ref as RefObject<T>;
}
