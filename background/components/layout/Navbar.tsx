"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/config/site";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function scrollToSection(id: string) {
    setMenuOpen(false);
    const target = document.querySelector(id);
    if (!target) return;
    if (lenis && !isMobile) {
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  // On mobile, let native anchor behavior handle navigation
  const handleLinkClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return; // Allow native anchor behavior
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled
              ? "border-white/10 bg-background/70 shadow-premium-sm backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        >
          <a
            href="#hero"
            onClick={(e) => handleLinkClick("#hero", e)}
            className="rounded-full text-sm font-semibold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {site.name}
          </a>

          <div className="hidden items-center gap-1 sm:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(link.href, e)}
                className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {link.label}
              </a>
            ))}
            <MagneticButton
              size="sm"
              variant="outline"
              onClick={() => scrollToSection("#contact")}
              className="ml-2"
            >
              Let&apos;s talk
            </MagneticButton>
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 overflow-hidden rounded-3xl border border-white/10 bg-background/90 backdrop-blur-xl sm:hidden"
            >
              <div className="flex flex-col p-3">
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    className="rounded-2xl px-4 py-3 text-base text-white/90 hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
