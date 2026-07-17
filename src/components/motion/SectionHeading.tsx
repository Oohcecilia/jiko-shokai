"use client";

import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useScrollFx";
import { cn } from "@/lib/utils";

const ACCENTS = {
  electric: "text-electric/80",
  cyan: "text-cyan/80",
  violet: "text-violet/80",
} as const;

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: keyof typeof ACCENTS;
  align?: "center" | "left";
  /** Adds a subtle scroll-linked depth drift to the whole block. */
  parallax?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  accent = "electric",
  align = "center",
  parallax = true,
  className,
}: SectionHeadingProps) {
  const parallaxRef = useParallax<HTMLDivElement>({ distance: 26, scrub: 0.8 });

  return (
    <div
      ref={parallax ? parallaxRef : undefined}
      className={cn(
        "mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className={cn("font-body text-xs uppercase tracking-[0.35em]", ACCENTS[accent])}
      >
        {eyebrow}
      </motion.span>

      <h2 className="mt-4 flex flex-wrap gap-x-[0.28em] font-display text-3xl font-semibold text-white sm:text-5xl">
        {title.split(" ").map((word, i) => (
          <span key={i} className="overflow-hidden py-1">
            <motion.span
              className="inline-block"
              initial={{ y: "115%", opacity: 0, filter: "blur(6px)" }}
              whileInView={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className={cn(
            "mt-4 font-body text-sm text-white/45",
            align === "center" && "mx-auto max-w-xl"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
