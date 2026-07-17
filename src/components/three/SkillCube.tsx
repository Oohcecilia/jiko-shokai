"use client";

import { Environment, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { usePerformanceTier } from "@/hooks/usePerf";
import { lerp, mapRange } from "@/lib/utils";

// const FONT_URL = "https://unpkg.com/three@0.170.0/examples/fonts/helvetiker_regular.typeface.json";
// Replace your FONT_URL with a standard .ttf or .woff URL
const FONT_URL = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

const FACES: { label: string; position: [number, number, number]; rotation: [number, number, number] }[] = [
  { label: "Frontend", position: [0, 0, 1.01], rotation: [0, 0, 0] },
  { label: "Backend", position: [0, 0, -1.01], rotation: [0, Math.PI, 0] },
  { label: "Cloud", position: [1.01, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { label: "Mobile", position: [-1.01, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { label: "AI / ML", position: [0, 1.01, 0], rotation: [-Math.PI / 2, 0, 0] },
  { label: "DevOps", position: [0, -1.01, 0], rotation: [Math.PI / 2, 0, 0] },
];

function Cube({ progressRef }: { progressRef?: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(2, 2, 2), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const progress = progressRef?.current ?? 0.5;

    // Continuous spin, plus a slow extra quarter-turn tied to how far the
    // section has scrolled through view — makes the cube feel driven by
    // the story rather than just idling.
    group.current.rotation.y += delta * 0.22 + delta * progress * 0.15;

    const targetTilt = state.pointer.y * 0.3;
    group.current.rotation.x = lerp(group.current.rotation.x, targetTilt, 0.05);

    // Assembles into full size as the section enters view.
    const targetScale = mapRange(progress, 0, 0.25, 0.72, 1);
    const scale = lerp(group.current.scale.x, targetScale, 0.06);
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <mesh geometry={boxGeometry}>
        <meshPhysicalMaterial
          color="#111827"
          transparent
          opacity={0.35}
          roughness={0.15}
          metalness={0.3}
          transmission={0.6}
          ior={1.2}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[boxGeometry]} />
        <lineBasicMaterial color="#3B82F6" transparent opacity={0.6} />
      </lineSegments>
      {FACES.map((face) => (
        <group key={face.label} position={face.position} rotation={face.rotation}>
          <Text font={FONT_URL} fontSize={0.22} color="#8FB4FF" anchorX="center" anchorY="middle">
            {face.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

export function SkillCube({ progressRef }: { progressRef?: MutableRefObject<number> }) {
  const tier = usePerformanceTier();
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [2.6, 1.6, 3.2], fov: 40 }}
        dpr={[1, tier === "low" ? 1.2 : 1.8]}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#3B82F6" />
        <pointLight position={[-3, -2, -2]} intensity={1.1} color="#8B5CF6" />
        {tier === "high" && <Environment preset="city" />}
        <Cube progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
