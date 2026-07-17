"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { site } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

export function Footer() {
  const lenis = useLenis();

  function scrollToTop() {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const socialLinks = [
    { label: "GitHub", href: site.social.github, icon: Github },
    { label: "LinkedIn", href: site.social.linkedin, icon: Linkedin },
  ];

  return (
    <footer id="contact" className="relative px-4 pb-10 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <GlassPanel className="overflow-hidden px-6 py-14 text-center sm:px-14 sm:py-20">
          <div className="relative">
            <SectionHeading
              eyebrow="Get in touch"
              title="Let's build something great together"
              description="Have a project in mind, or just want to talk shop? My inbox is always open."
              align="center"
              className="mx-auto"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col items-center gap-6"
            >
              <MagneticButton
                href={`mailto:${site.email}`}
                variant="primary"
                ariaLabel={`Email ${site.name} at ${site.email}`}
              >
                <Mail size={17} />
                {site.email}
              </MagneticButton>

              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted transition-all hover:-translate-y-0.5 hover:border-white/20 hover:text-white hover:shadow-glow-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </GlassPanel>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 px-2 text-sm text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="hidden sm:inline">
              Built with Next.js, Three.js &amp; Framer Motion
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
