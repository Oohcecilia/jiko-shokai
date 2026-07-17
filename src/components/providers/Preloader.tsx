"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const isLoading = useAppStore((s) => s.isLoading);
  const setIsLoading = useAppStore((s) => s.setIsLoading);

  useEffect(() => {
    const start = performance.now();
    const minDuration = 1400;
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsLoading(false), 250);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [setIsLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-matte"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.span
              className="font-display text-sm uppercase tracking-[0.4em] text-white/50"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Jose Larry Cecilia
            </motion.span>

            <div className="relative h-px w-64 overflow-hidden bg-white/10 sm:w-80">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-electric via-cyan to-violet"
                style={{ width: `${progress}%` }}
              />
            </div>

            <motion.span
              className="font-mono text-xs tabular-nums text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {String(progress).padStart(3, "0")}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
