"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Globe,
  PenTool,
  Server,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { SERVICES } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  PenTool,
  Server,
  Sparkles,
  CloudCog: Cloud,
};

export function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <FloatingOrbs seed={5} count={3} />

      <SectionHeading eyebrow="Services" title="How I can help" accent="cyan" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => {
          const Icon = ICONS[service.icon] ?? Globe;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              whileHover={{ rotate: i % 2 === 0 ? -1.5 : 1.5, y: -6 }}
              className="group relative rounded-2xl border border-glass-border bg-white/[0.02] p-7 backdrop-blur-xl transition-shadow duration-300 hover:shadow-glow"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-electric/0 via-transparent to-violet/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-electric/20 group-hover:to-violet/20" />
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-glass-border bg-gradient-to-br from-electric/20 to-violet/20 text-electric">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-white/50">
                {service.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
