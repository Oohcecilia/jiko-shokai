"use client";

import { Environment, Float, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import type * as THREE from "three";
import { usePerformanceTier } from "@/hooks/usePerf";
import { lerp, mapRange } from "@/lib/utils";

const TECHS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Three.js",
  "GraphQL",
  "AWS",
  "Docker",
  "Postgres",
  "Tailwind",
  "Figma",
  "OpenAI",
];

/** Evenly distributes N points across a sphere surface (Fibonacci sphere). */
function useFibonacciSphere(count: number, radius: number) {
  return useMemo(() => {
    const points: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
    }
    return points;
  }, [count, radius]);
}

function CoreWireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.06;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.5, 2]} />
      <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function TechLabel({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  return (
    <Float speed={2} floatIntensity={0.6} rotationIntensity={0}>
      <group position={position}>
        <mesh>
          <circleGeometry args={[0.42, 32]} />
          <meshBasicMaterial color="#0B1220" transparent opacity={0.5} />
        </mesh>
        <Text
          font="https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff"
          fontSize={0.15}
          color="#e5edff"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.01]}
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Rotator({ children, progressRef }: { children: ReactNode; progressRef?: MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const progress = progressRef?.current ?? 0.5;
    ref.current.rotation.y += delta * 0.05 + delta * progress * 0.1;

    // Scales the whole cluster up slightly as the section scrolls through
    // view — an "approaching" depth cue that doesn't fight OrbitControls'
    // own per-frame camera management the way moving the camera would.
    const targetScale = mapRange(progress, 0, 1, 0.88, 1.06);
    const nextScale = lerp(ref.current.scale.x, targetScale, 0.05);
    ref.current.scale.setScalar(nextScale);
  });
  return <group ref={ref}>{children}</group>;
}

export function TechSphere({ progressRef, inView = true }: { progressRef?: MutableRefObject<number>; inView?: boolean }) {
  const tier = usePerformanceTier();
  const points = useFibonacciSphere(TECHS.length, 2.6);

  // Pause the R3F render loop when the Skills section is scrolled
  // out of view — saves GPU without affecting the visual experience.
  const frameloop = inView ? "always" : "never";

  return (
    <Canvas
      frameloop={frameloop}
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      dpr={[1, tier === "low" ? 1.2 : 1.8]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#06B6D4" />
      <pointLight position={[-4, -2, -3]} intensity={0.8} color="#8B5CF6" />
      {tier === "high" && <Environment preset="night" />}

      <Rotator progressRef={progressRef}>
        <CoreWireframe />
        {TECHS.map((label, i) => (
          <TechLabel key={label} label={label} position={points[i]!} />
        ))}
      </Rotator>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        rotateSpeed={0.4}
      />
    </Canvas>
  );
}