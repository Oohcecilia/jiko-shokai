"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore, type CursorVariant } from "@/store/useAppStore";
import { lerp } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [touch, setTouch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rippleId = useRef(0);
  const cursorVariant = useAppStore((s) => s.cursorVariant);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(pointer: coarse)").matches) {
      setTouch(true);
      return;
    }

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    const glow = { x: mouse.x, y: mouse.y };
    let frame: number;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onDown = (e: MouseEvent) => {
      const id = ++rippleId.current;
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.filter((ripple) => ripple.id !== id)), 700);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);

    // Any element with data-cursor="hover" (nav links, socials, cards, etc.)
    // switches the cursor to its expanded hover state via event delegation.
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      if (target) setCursorVariant((target.getAttribute("data-cursor") as CursorVariant) ?? "hover");
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      if (target) setCursorVariant("default");
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const animate = () => {
      ring.x = lerp(ring.x, mouse.x, 0.2);
      ring.y = lerp(ring.y, mouse.y, 0.2);
      glow.x = lerp(glow.x, mouse.x, 0.09);
      glow.y = lerp(glow.y, mouse.y, 0.09);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(frame);
    };
  }, [setCursorVariant]);

  if (!mounted || touch) return null;

  const isHover = cursorVariant === "hover";
  const isText = cursorVariant === "text";

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference" aria-hidden>
      <div
        ref={glowRef}
        className="fixed left-0 top-0 h-24 w-24 rounded-full bg-electric/20 blur-2xl transition-[width,height,opacity] duration-300"
        style={{ opacity: isHover ? 0.9 : 0.4 }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border border-white/70 transition-[width,height] duration-300 ease-premium"
        style={{
          width: isHover ? 64 : isText ? 4 : 34,
          height: isHover ? 64 : isText ? 40 : 34,
          borderRadius: isText ? 4 : 9999,
        }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-200"
        style={{ opacity: isHover ? 0 : 1 }}
      />
      {ripples.map((r) => (
        <span
          key={r.id}
          className="fixed left-0 top-0 h-10 w-10 rounded-full border border-white/60 animate-pulse-ring"
          style={{
            transform: `translate3d(${r.x - 5}px, ${r.y - 5}px, 0)`,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}
