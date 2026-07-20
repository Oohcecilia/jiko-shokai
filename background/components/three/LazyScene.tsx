"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(
  () => import("./Scene").then((m) => m.Scene),
  { ssr: false }
);

/**
 * Lazy-loads the 3D Scene only when it enters the viewport.
 * This defers the heavy Three.js bundle until the user can actually see it.
 */
export function LazyScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" >
      {isVisible && <Scene />}
    </div>
  );
}