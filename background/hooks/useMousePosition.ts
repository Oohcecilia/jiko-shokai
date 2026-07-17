"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the mouse position in normalized device-like coordinates,
 * where x/y range roughly from -1 to 1 across the viewport.
 *
 * Returns a ref (not state) so consumers — typically R3F's useFrame loop —
 * can read the latest value every frame without triggering React re-renders.
 */
export function useMousePosition() {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      position.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      position.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return position;
}
