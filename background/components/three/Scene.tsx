"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useMousePosition } from "@/hooks/useMousePosition";
import { FloatingShapes } from "./FloatingShapes";
import { ParticleField } from "./ParticleField";

/**
 * Fixed, full-viewport interactive 3D background.
 *
 * - Purely decorative (aria-hidden) and non-interactive for pointer/touch
 *   events (`pointer-events-none`), so it never gets in the way of content.
 * - Reads the cursor position via `useMousePosition` and uses it to drive a
 *   subtle parallax across the floating shapes and particle field.
 * - Automatically scales down particle count and disables distort
 *   animation on small screens to keep frame rate high everywhere.
 */
export function Scene() {
  const mouse = useMousePosition();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsCompact(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsCompact(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <Canvas
        dpr={[1, isCompact ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 7.5], fov: 45 }}
      >
        <color attach="background" args={["#050816"]} />
        <fog attach="fog" args={["#050816", 6, 16]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[5, 4, 5]} intensity={60} color="#7C3AED" />
        <pointLight position={[-5, -3, 2]} intensity={40} color="#06B6D4" />
        <pointLight position={[0, 5, -5]} intensity={25} color="#3B82F6" />

        <Suspense fallback={null}>
          <FloatingShapes mouse={mouse} reduced={isCompact} />
          <ParticleField count={isCompact ? 500 : 1200} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;
