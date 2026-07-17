"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";

const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#hero");
  const lastY = useRef(0);
  const scrollProgress = useAppStore((s) => s.scrollProgress);
  const mobileMenuOpen = useAppStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 200);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const goTo = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target && lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
      >
        <nav
          className={`relative flex w-full max-w-5xl items-center justify-between rounded-2xl border border-glass-border px-5 py-3 backdrop-blur-2xl transition-colors duration-500 ${
            scrolled ? "bg-charcoal/70 shadow-glass" : "bg-white/[0.02]"
          }`}
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              goTo("#hero");
            }}
            className="font-display text-lg font-semibold tracking-tight text-white"
            data-cursor="hover"
          >
            JLC<span className="text-electric">.</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => goTo(link.href)}
                  className={`relative rounded-full px-4 py-2 font-body text-[13px] font-medium transition-colors duration-300 ${
                    active === link.href
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {link.label}
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              size="sm"
              variant="glass"
              onClick={() => window.open(SITE.resumeUrl, "_blank")}
            >
              <Download className="h-3.5 w-3.5" /> Resume
            </Button>
            <Button size="sm" onClick={() => goTo("#contact")}>
              Contact Me
            </Button>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-glass-border lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-4 w-4 text-white" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-4 w-4 text-white" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Scroll progress bar */}
          <div className="absolute inset-x-4 -bottom-px h-px overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-electric via-cyan to-violet transition-[width] duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 lg:hidden overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Background with glassmorphism */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-matte/95 backdrop-blur-2xl"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-electric/5 via-transparent to-violet/5" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,5,5,0.3)_100%)]" />
            </motion.div>

            {/* Menu content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-full flex-col items-center justify-center gap-8 px-6 py-8"
            >
              {/* Navigation links */}
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                }}
                className="flex flex-col items-center gap-2 w-full max-w-sm"
              >
                {LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <button
                      onClick={() => goTo(link.href)}
                      className={`relative group w-full px-6 py-4 rounded-2xl font-display text-xl font-medium text-left transition-all duration-300 ease-premium min-h-[56px] flex items-center ${
                        active === link.href
                          ? "text-electric bg-electric/10 border border-electric/30"
                          : "text-white/80 hover:text-white hover:bg-white/5 hover:border-glass-border border border-transparent"
                      }`}
                    >
                      <span className="relative z-10">{link.label}</span>
                      
                      {/* Active indicator */}
                      {active === link.href && (
                        <motion.div
                          layoutId="mobile-nav-active"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric/20 to-violet/20"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
                      {/* Chevron indicator */}
                      <motion.div
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-electric transition-colors duration-300"
                        animate={{ x: active === link.href ? 8 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-electric/30 to-transparent"
              />

              {/* Contact CTA */}
<motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm"
              >
                <Button
                  size="lg"
                  className="w-full min-h-[56px] justify-center gap-2"
                  onClick={() => goTo("#contact")}
                >
                  <span>Get in Touch</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Social links in mobile menu */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  {[
                    { icon: "Github", href: SITE.github, label: "GitHub" },
                    { icon: "Linkedin", href: SITE.linkedin, label: "LinkedIn" },
                    { icon: "Twitter", href: SITE.twitter, label: "Twitter" },
                    { icon: "Facebook", href: SITE.facebook, label: "Facebook" },
                    { icon: "Instagram", href: SITE.instagram, label: "Instagram" },
                  ].map(({ icon: IconName, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-glass-border bg-white/[0.02] text-white/60 transition-all duration-300 hover:-translate-y-1 hover:text-electric hover:border-electric/40 hover:shadow-glow"
                    >
                      {/* Using inline SVG icons for social links */}
                      {IconName === "Github" && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                      )}
                      {IconName === "Linkedin" && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      )}
                      {IconName === "Twitter" && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-1.926 1.734-10.32-11.19-10.32 11.19-1.926-1.734 8.502-9.24-7.227-8.26h3.308l5.965 6.822 6.464-7.51z"/></svg>
                      )}
                      {IconName === "Facebook" && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.046V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.058 24 12.073z"/></svg>
                      )}
                      {IconName === "Instagram" && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-.128-1.283-.14-1.692-.14-4.948 0-3.26.013-3.667-.072-4.947.196-4.354 2.618-6.78 6.98-6.98 1.281-.058 1.69-.072 4.947-.072zM12 6.865c-2.889 0-5.232 2.343-5.232 5.232s2.343 5.232 5.232 5.232c2.89 0 5.232-2.343 5.232-5.232s-2.342-5.232-5.232-5.232zm0 8.163c-1.601 0-2.9-1.299-2.9-2.9s1.299-2.9 2.9-2.9 2.9 1.299 2.9 2.9-1.299 2.9-2.9 2.9zM21 11.285c0-.558-.454-1.012-1.013-1.012H4.013C3.454 10.273 3 10.727 3 11.285c0 .558.454 1.013 1.013 1.012h16.974c.559-.001 1.012-.455 1.012-1.013z"/></svg>
                      )}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}