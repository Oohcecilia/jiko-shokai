"use client";

import { motion } from "framer-motion";

/**
 * A thin, low-height seam between major sections. On its own it's just a
 * gradient line, but the traveling glow (triggered once, in view) gives a
 * small sense of momentum carrying the eye from one section into the next
 * — cheap connective tissue instead of a hard cut between blocks.
 */
export function SectionDivider() {
  return (
    <div className="relative mx-auto h-16 max-w-4xl px-6" aria-hidden>
      <div className="absolute left-1/2 top-1/2 h-px w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <motion.div
        initial={{ left: "10%", opacity: 0 }}
        whileInView={{ left: "90%", opacity: [0, 1, 1, 0] }}
        viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric shadow-glow"
      />
    </div>
  );
}
