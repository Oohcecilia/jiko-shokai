"use client";

import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(
  () => import("@/components/layout/AnimatedBackground").then((m) => m.AnimatedBackground),
  { ssr: false }
);

const GlobalBackground3D = dynamic(
  () => import("@/components/layout/GlobalBackground3D").then((m) => m.GlobalBackground3D),
  { ssr: false }
);

export function BackgroundWrapper() {
  return (
    <>
      <AnimatedBackground />
      <GlobalBackground3D />
    </>
  );
}