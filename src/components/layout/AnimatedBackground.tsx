"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceTier, usePrefersReducedMotion } from "@/hooks/usePerf";
import { useAppStore } from "@/store/useAppStore";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  o: number;
}

const DEPTH = [0.06, 0.1, 0.08];
const GRID_DEPTH = 0.03;

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const reducedMotion = usePrefersReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const count = tier === "low" ? 40 : 110;
    const newParticles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      o: Math.random() * 0.6 + 0.2,
    }));
    setParticles(newParticles);

    let frame: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${p.o})`;
        ctx.fill();
      }

      if (!reducedMotion) {
        const progress = useAppStore.getState().scrollProgress;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledPx = progress * docHeight;

        layerRefs.current.forEach((el, i) => {
          if (!el) return;
          const depth = DEPTH[i] ?? 0.08;
          el.style.transform = `translate3d(0, ${-(scrolledPx * depth)}px, 0)`;
        });
        if (gridRef.current) {
          gridRef.current.style.transform = `translate3d(0, ${-(scrolledPx * GRID_DEPTH)}px, 0)`;
        }
      }

      frame = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      resizeCanvas();
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        }))
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [tier, reducedMotion, particles]);

  if (!mounted) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-matte" aria-hidden="true" />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-matte" aria-hidden="true" style={{ width: "100vw", height: "100vh" }}>
      <div
        ref={(el) => { layerRefs.current[0] = el; }}
        className="absolute -left-1/4 top-[-10%] h-[60vw] max-w-[200vw] w-[60vw] will-change-transform"
      >
        <div className="h-full w-full rounded-full bg-aurora-1 blur-3xl animate-blob" />
      </div>
      <div
        ref={(el) => { layerRefs.current[1] = el; }}
        className="absolute right-[-15%] top-[10%] h-[50vw] max-w-[200vw] w-[50vw] will-change-transform"
      >
        <div className="h-full w-full rounded-full bg-aurora-2 blur-3xl animate-blob [animation-delay:-4s]" />
      </div>
      <div
        ref={(el) => { layerRefs.current[2] = el; }}
        className="absolute bottom-[-20%] left-[20%] h-[55vw] max-w-[200vw] w-[55vw] will-change-transform"
      >
        <div className="h-full w-full rounded-full bg-aurora-3 blur-3xl animate-blob [animation-delay:-8s]" />
      </div>

      <div
        ref={gridRef}
        className="absolute inset-0 bg-grid-glow bg-[length:64px_64px] opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_75%)] will-change-transform"
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" style={{ width: "100%", height: "100%" }} />

      <svg className="absolute inset-0 h-full w-full opacity-[0.035]" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}