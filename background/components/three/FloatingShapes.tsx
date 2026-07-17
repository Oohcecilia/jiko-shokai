"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

interface FloatingShapesProps {
  mouse: MutableRefObject<{ x: number; y: number }>;
  reduced?: boolean;
}

export function FloatingShapes({ mouse, reduced = false }: FloatingShapesProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Gentle parallax: the whole cluster tilts slightly toward the cursor.
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
  });

  return (
    <group ref={group}>
      <Environment preset="city" />

      {/* Organic distorted blob — the "signature" glow shape */}
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4}>
        <mesh position={[2.4, 0.6, -2]} scale={1.15}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#7C3AED"
            distort={reduced ? 0 : 0.35}
            speed={reduced ? 0 : 1.6}
            roughness={0.15}
            metalness={0.6}
          />
        </mesh>
      </Float>

      {/* Glass-like sphere */}
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
          />
        </mesh>
      </Float>

      {/* Metallic torus */}
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[0.6, -1.6, -4]} rotation={[0.6, 0.3, 0]} scale={0.85}>
          <torusGeometry args={[0.9, 0.28, 32, 128]} />
          <meshStandardMaterial
            color="#3B82F6"
            metalness={0.9}
            roughness={0.2}
            emissive="#1E3A8A"
            emissiveIntensity={0.15}
          />
        </mesh>
      </Float>

      {/* Small accent octahedron */}
      <Float speed={2.2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-1, 1.8, -2.5]} scale={0.4}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#38D9EF"
            metalness={0.5}
            roughness={0.3}
            emissive="#06B6D4"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}
