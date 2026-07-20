"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { usePerformanceTier, usePrefersReducedMotion, useIsMobilePhone } from "@/hooks/usePerf";
import { useAppStore } from "@/store/useAppStore";

/**
 * Global 3D background that runs across the entire site.
 * Renders behind all content (z-index -10) with R3F Canvas.
 * Includes floating organic shapes + particle field with mouse parallax.
 * Respects reduced-motion and performance tier.
 * Syncs with Hero section: hidden while hero is visible, fades in as hero exits.
 */
export function GlobalBackground3D() {
  const mouse = useMousePosition();
  const tier = usePerformanceTier();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobilePhone();
  const heroExitProgress = useAppStore((s) => s.heroExitProgress);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsCompact(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsCompact(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Mobile phones: skip the full 3D scene entirely ──
  // The R3F Canvas is expensive (GPU memory, shader compilation, RAF loop).
  // On phones, render a lightweight static gradient fallback instead.
  if (isMobile) {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-electric/[0.03] via-transparent to-transparent" />
      </div>
    );
  }

  const particleCount = tier === "low" ? (isCompact ? 300 : 500) : (isCompact ? 500 : 1200);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, isCompact ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 7.5], fov: 45 }}
      >
        <fog attach="fog" args={["#050505", 6, 16]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[5, 4, 5]} intensity={60} color="#7C3AED" />
        <pointLight position={[-5, -3, 2]} intensity={40} color="#06B6D4" />
        <pointLight position={[0, 5, -5]} intensity={25} color="#3B82F6" />

        <Suspense fallback={null}>
          <FloatingShapes
            mouse={mouse}
            reduced={reducedMotion || isCompact}
            heroExitProgress={heroExitProgress}
            reducedMotion={reducedMotion}
          />
          <ParticleField
            count={particleCount}
            mouse={mouse}
            heroExitProgress={heroExitProgress}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function FloatingShapes({
  mouse,
  reduced = false,
  heroExitProgress = 0,
  reducedMotion = false,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  reduced?: boolean;
  heroExitProgress: number;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);
  const opacityRef = useRef(0);
  const scaleRef = useRef(0.1);

  // Animate group opacity and scale based on hero exit progress
  useFrame((_, delta) => {
    if (!group.current) return;

    // Parallax rotation
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current.x * 0.25,
      0.03
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.15,
      0.03
    );
    group.current.rotation.z += delta * 0.01;

    // Fade in/out based on hero exit progress
    if (!reducedMotion) {
      const targetOpacity = THREE.MathUtils.clamp(heroExitProgress * 1.5, 0, 1);
      // Smoothstep for natural ease-in-out
      const smoothT = targetOpacity * targetOpacity * (3 - 2 * targetOpacity);
      const targetScale = THREE.MathUtils.lerp(0.1, 1, smoothT);

      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 8);
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, delta * 8);
    } else {
      // Respect reduced motion: instant show/hide
      opacityRef.current = heroExitProgress > 0.1 ? 1 : 0;
      scaleRef.current = heroExitProgress > 0.1 ? 1 : 0.1;
    }

    // Apply opacity and scale to group
    group.current.scale.setScalar(scaleRef.current);

    // Update material opacity for transparent materials
    materialsRef.current.forEach((material) => {
      const mat = material as THREE.MeshPhysicalMaterial & { transmission?: number };
      if (material.transparent || (mat.transmission ?? 0) > 0) {
        material.opacity = opacityRef.current;
        material.needsUpdate = true;
      }
    });
  });

  // Capture mesh references for material updates
  useEffect(() => {
    if (!group.current) return;
    const meshes: THREE.Mesh[] = [];
    const materials: THREE.Material[] = [];
    group.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        meshes.push(mesh);
        const material = mesh.material;
        if (material) {
          const mat = Array.isArray(material) ? material[0] : material;
          materials.push(mat as THREE.Material);
        }
      }
    });
    meshesRef.current = meshes;
    materialsRef.current = materials;
  }, []);

  return (
    <group ref={group}>
      <Environment preset="city" />

      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4}>
        <mesh position={[2.4, 0.6, -2]} scale={1.15}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#7C3AED"
            distort={reduced ? 0 : 0.35}
            speed={reduced ? 0 : 1.6}
            roughness={0.15}
            metalness={0.6}
            transparent
            opacity={0}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.8}>
        <mesh position={[-2.6, -0.4, -3]} scale={1}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial
            color="#06B6D4"
            transmission={0.9}
            thickness={1.4}
            roughness={0.08}
            ior={1.3}
            envMapIntensity={1.1}
            clearcoat={1}
            transparent
            opacity={0}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[0.6, -1.6, -4]} rotation={[0.6, 0.3, 0]} scale={0.85}>
          <torusGeometry args={[0.9, 0.28, 32, 128]} />
          <meshStandardMaterial
            color="#3B82F6"
            metalness={0.9}
            roughness={0.2}
            emissive="#1E3A8A"
            emissiveIntensity={0.15}
            transparent
            opacity={0}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-1, 1.8, -2.5]} scale={0.4}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#38D9EF"
            metalness={0.5}
            roughness={0.3}
            emissive="#06B6D4"
            emissiveIntensity={0.5}
            transparent
            opacity={0}
          />
        </mesh>
      </Float>
    </group>
  );
}

function ParticleField({
  count = 1200,
  mouse,
  heroExitProgress = 0,
  reducedMotion = false,
}: { count?: number; mouse: React.MutableRefObject<{ x: number; y: number }>; heroExitProgress: number; reducedMotion: boolean }) {
  const positions = useParticlePositions(count);
  const pointsRef = useRef<THREE.Points>(null);
  const baseOpacity = 0.55;

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    // Parallax rotation
    pointsRef.current.rotation.y +=
      delta * 0.025 + mouse.current.x * delta * 0.15;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      mouse.current.y * 0.15,
      0.03
    );

    // Fade in/out based on hero exit progress
    if (!reducedMotion) {
      const targetOpacity = THREE.MathUtils.clamp(heroExitProgress * 1.5, 0, 1) * baseOpacity;
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, delta * 8);
      material.needsUpdate = true;
    } else {
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = heroExitProgress > 0.1 ? baseOpacity : 0;
      material.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
          usage={THREE.StaticDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9F67F5"
        size={0.028}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function useParticlePositions(count: number) {
  const positionsRef = useRef<Float32Array | null>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    if (!positionsRef.current || positionsRef.current.length !== count * 3) {
      const newPositions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const radius = 6 * Math.cbrt(Math.random()) + 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        newPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        newPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
        newPositions[i * 3 + 2] = radius * Math.cos(phi) - 4;
      }
      positionsRef.current = newPositions;
      setPositions(newPositions);
    }
  }, [count]);

  // Return a default empty array if not yet initialized (SSR)
  return positions ?? new Float32Array(0);
}