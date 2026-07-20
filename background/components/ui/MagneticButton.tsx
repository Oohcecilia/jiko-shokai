"use client";

import {
  useRef,
  useState,
  useEffect,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "sm";
  className?: string;
  ariaLabel?: string;
  external?: boolean;
}

const STRENGTH = 0.35;
const MAX_OFFSET = 14;

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Only enable magnetic effect on desktop with fine pointer and no reduced motion
  const enableMagnetic = !isMobile && !prefersReducedMotion && typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (!enableMagnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    setOffset({
      x: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relX * STRENGTH)),
      y: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relY * STRENGTH)),
    });
  }

  function handleMouseLeave() {
    if (enableMagnetic) setOffset({ x: 0, y: 0 });
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent touch-manipulation";

  const sizes = {
    md: "px-7 py-3.5 text-[15px]",
    sm: "px-5 py-2.5 text-sm",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-white shadow-glow-primary hover:shadow-[0_0_80px_-10px_rgba(124,58,237,0.65)]",
    outline:
      "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25 backdrop-blur-sm",
    ghost: "text-muted hover:text-white",
  };

  const classes = cn(base, sizes[size], variants[variant], className);

  // On mobile: render plain element without Framer Motion wrapper to avoid touch interception
  if (isMobile || prefersReducedMotion) {
    if (href) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={ariaLabel}
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </button>
    );
  }

  // Desktop: full Framer Motion with magnetic effect
  const motionProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: { x: offset.x, y: offset.y },
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 200, damping: 15, mass: 0.5 } as const,
    className: classes,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
