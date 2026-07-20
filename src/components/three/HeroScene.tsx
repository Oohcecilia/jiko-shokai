"use client";

import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useRef } from "react";
import type * as THREE from "three";
import { usePerformanceTier } from "@/hooks/usePerf";
import { lerp } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

function GlassSphere({
  position,
  scale = 1,
  reduced = false,
}: {
  position: [number, number, number];
  scale?: number;
  reduced?: boolean;
}) {
  const setCursor = useAppStore((s) => s.setCursorVariant);
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.4}>
      <mesh
        position={position}
        scale={scale}
        onPointerOver={() => setCursor("hover")}
        onPointerOut={() => setCursor("default")}
      >
        <sphereGeometry args={[1, reduced ? 24 : 64, reduced ? 24 : 64]} />
        {reduced ? (
          // Cheaper material for mobile — no transmission/refraction,
          // just a glossy sphere that still looks premium.
          <meshStandardMaterial
            color="#3B82F6"
            metalness={0.8}
            roughness={0.15}
            transparent
            opacity={0.7}
          />
        ) : (
          <MeshTransmissionMaterial
            thickness={0.6}
            roughness={0.05}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.04}
            backside
            color="#3B82F6"
          />
        )}
      </mesh>
    </Float>
  );
}

function WireframeKnot({ reduced = false }: { reduced?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.08;
    ref.current.rotation.y += delta * 0.12;
  });
  return (
    <mesh ref={ref} position={[2.6, 0.6, -1.5]} scale={0.9}>
      <torusKnotGeometry args={[1, 0.28, reduced ? 60 : 180, reduced ? 12 : 24]} />
      <meshBasicMaterial color="#06B6D4" wireframe transparent opacity={0.55} />
    </mesh>
  );
}

function NeonRing({
  position,
  color,
  scale = 1,
  reduced = false,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  reduced?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.15;
  });
  return (
    <Float speed={1} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1, 0.04, reduced ? 16 : 32, reduced ? 32 : 128]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={reduced ? 0.8 : 2.2}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function FloatingCube({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.25;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
  });
  return (
    <Float speed={1.8} floatIntensity={1.6} rotationIntensity={0}>
      <mesh ref={ref} position={position} scale={0.42}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.2} />
      </mesh>
    </Float>
  );
}

/** A floating "holographic" panel showing a short, hand-written code snippet. */
function CodePanel() {
  const lines = ["const build = () => {", "  return <Experience", "    alive />", "}"];
  return (
    <Float speed={1.1} floatIntensity={1} rotationIntensity={0.15}>
      <group position={[-2.8, -0.4, -1]} rotation={[0, 0.35, 0]}>
        <mesh>
          <planeGeometry args={[3.1, 1.7]} />
          <meshPhysicalMaterial
            color="#0B1220"
            transparent
            opacity={0.55}
            roughness={0.4}
            metalness={0.1}
            transmission={0.2}
          />
        </mesh>
        <Text
          position={[-1.35, 0.5, 0.02]}
          fontSize={0.16}
          color="#06B6D4"
          anchorX="left"
          anchorY="top"
          lineHeight={1.6}
          maxWidth={2.6}
        >
          {lines.join("\n")}
        </Text>
      </group>
    </Float>
  );
}

/** Blends mouse parallax with a subtle scroll-driven dolly into the scene. */
function Rig({ tier }: { tier: "high" | "low" }) {
  const scrollProgress = useAppStore((s) => s.scrollProgress);

  useFrame((state) => {
    const { pointer, camera } = state;
    const targetX = pointer.x * (tier === "low" ? 0.3 : 0.6);
    const targetY = pointer.y * (tier === "low" ? 0.2 : 0.4);
    const scrollDolly = Math.min(scrollProgress * 6, 1);

    camera.position.x = lerp(camera.position.x, targetX, 0.04);
    camera.position.y = lerp(camera.position.y, targetY + scrollDolly * 0.6, 0.04);
    camera.position.z = lerp(camera.position.z, 8 - scrollDolly * 1.6, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  const tier = usePerformanceTier();
  const heroExitProgress = useAppStore((s) => s.heroExitProgress);
  const reduced = tier === "low";

  // NOTE: frameloop is intentionally always 'always' — changing it to
  // 'never' conditionally prevents the scene from recovering when the
  // user scrolls back up (R3F doesn't reliably restart the loop).
  // GPU savings come from:
  //   - Fewer/scaled-down objects on low tier
  //   - Cheaper materials on low tier
  //   - The dissolve opacity reducing visibility at p >= 1

  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 0, 8], fov: reduced ? 50 : 45 }}
      dpr={[1, reduced ? 1.3 : 2]}
      gl={{
        antialias: !reduced,
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#3B82F6" />
        {!reduced && (
          <pointLight position={[-5, -3, 4]} intensity={1.1} color="#8B5CF6" />
        )}
        {reduced ? (
          // Simpler lighting for mobile — one ambient + one point light
          <ambientLight intensity={0.8} />
        ) : (
          <>
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
          </>
        )}

        {/* Core scene objects — kept on all devices */}
        <GlassSphere position={[1.4, 0.6, 0]} scale={1.15} reduced={reduced} />

        {/* Secondary objects — removed on mobile to save GPU */}
        {!reduced && (
          <GlassSphere position={[-1.6, -0.8, -0.6]} scale={0.75} reduced={false} />
        )}
        <WireframeKnot reduced={reduced} />
        <NeonRing position={[0, -1.4, -2]} color="#06B6D4" scale={1.6} reduced={reduced} />
        {!reduced && (
          <NeonRing position={[2.8, -1.8, -3]} color="#8B5CF6" scale={0.9} reduced={false} />
        )}
        {!reduced && (
          <FloatingCube position={[-2.4, 1.4, -1]} color="#3B82F6" />
        )}
        <FloatingCube position={[2.1, 1.8, -2]} color="#06B6D4" />
        {!reduced && <CodePanel />}

        {/* Sparkles — removed entirely on mobile (even 40 is costly) */}
        {!reduced && (
          <Sparkles
            count={140}
            scale={[10, 6, 6]}
            size={2}
            speed={0.3}
            color="#8FB4FF"
            opacity={0.6}
          />
        )}

        <Rig tier={tier} />

        {/* Post-processing — only on high-end devices */}
        {!reduced && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.9}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.6}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.9} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
