"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { SITE } from "@/lib/data";

const SOCIALS = [
  { icon: Github, href: SITE.github, label: "GitHub" },
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Twitter, href: SITE.twitter, label: "Twitter" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
];

export function Footer() {
  const lenis = useLenis();
  const [year, setYear] = useState(2024);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const backToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-glass-border px-4 sm:px-6 py-12 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:gap-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white"
        >
          {SITE.name.split(" ")[0]}
          <span className="text-electric">.</span>
        </motion.span>

        <div className="flex items-center gap-2 sm:gap-3">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              data-cursor="hover"
              className="grid h-10 w-10 place-items-center rounded-full border border-glass-border bg-white/[0.03] text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:text-electric hover:shadow-glow"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-4 border-t border-glass-border pt-6 sm:flex-row sm:justify-between">
          <p className="font-body text-xs text-white/40">
            © {year} Oohcecilia. Built with passion and code.
          </p>

          <button
            onClick={backToTop}
            data-cursor="hover"
            className="group flex items-center gap-2 rounded-full border border-glass-border px-4 py-2 font-body text-xs text-white/60 transition-colors hover:text-white min-h-[44px]"
          >
            Back to top
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/5 transition-transform duration-300 group-hover:-translate-y-0.5">
              <ArrowUp className="h-3 w-3" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}