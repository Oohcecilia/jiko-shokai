"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useRef } from "react";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { EXPERIENCE } from "@/lib/data";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative mx-auto max-w-4xl px-4 sm:px-6 py-28 sm:py-36">
      <FloatingOrbs seed={3} count={2} />

      <SectionHeading eyebrow="Experience" title="Where the work happened" accent="electric" />

      <div ref={containerRef} className="relative pl-4 sm:pl-6 lg:pl-10">
        <div className="absolute left-2 top-0 h-full w-px bg-white/10 sm:left-3 lg:left-5" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-2 top-0 w-px bg-gradient-to-b from-electric via-cyan to-violet sm:left-3 lg:left-5"
        />

        <div className="flex flex-col gap-6 sm:gap-8">
          {EXPERIENCE.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <span className="absolute -left-6 top-1.5 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border border-glass-border bg-charcoal shadow-glow sm:-left-8 lg:-left-10">
                <motion.span
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  whileInView={{ scale: [0.9, 1.5, 0.9], opacity: [0.7, 0, 0.7] }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, delay: i * 0.15, repeat: Infinity, repeatDelay: 1.5 }}
                  className="absolute inset-0 rounded-full border border-electric/40"
                />
                <Briefcase className="h-3 w-3 text-electric" />
              </span>

              <div className="group rounded-2xl border border-glass-border bg-white/[0.02] p-4 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-glow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-white">
                    {item.role} <span className="text-white/40">· {item.company}</span>
                  </h3>
                  <span className="rounded-full border border-glass-border px-2 py-0.5 font-body text-[10px] sm:text-[11px] text-white/50 shrink-0">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-white/40">{item.location}</p>
                <ul className="mt-3 space-y-2">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2 font-body text-xs sm:text-sm text-white/55">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
