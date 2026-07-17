"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A soft glow that trails the pointer for extra "premium" ambience.
 *
 * Deliberately additive rather than a cursor replacement: the native OS
 * cursor stays visible at all times, which keeps the experience accessible
 * and predictable. Automatically disabled on touch devices and when the
 * user prefers reduced motion.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setEnabled(hasFinePointer && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function handleMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement;
      setHoveringInteractive(
        Boolean(target?.closest('a, button, [role="button"], input'))
      );
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[65] rounded-full mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: hoveringInteractive ? 260 : 180,
        height: hoveringInteractive ? 260 : 180,
        background:
          "radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(6,182,212,0.14) 45%, transparent 70%)",
        filter: "blur(4px)",
        transition: "width 0.4s ease, height 0.4s ease",
      }}
    />
  );
}
