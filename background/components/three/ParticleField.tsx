"use client";

import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  mouse: MutableRefObject<{ x: number; y: number }>;
}

/** Generates `count` points scattered through a soft sphere volume. */
function useParticlePositions(count: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 6 * Math.cbrt(Math.random()) + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = radius * Math.cos(phi) - 4;
    }
    return positions;
  }, [count]);
}

export function ParticleField({ count = 1200, mouse }: ParticleFieldProps) {
  const positions = useParticlePositions(count);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y +=
      delta * 0.025 + mouse.current.x * delta * 0.15;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      mouse.current.y * 0.15,
      0.03
    );
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9F67F5"
        size={0.028}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
