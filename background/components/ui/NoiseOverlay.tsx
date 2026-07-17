const NOISE_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

/**
 * A fixed, full-viewport film-grain layer. Purely decorative — it adds the
 * subtle "premium" texture you see on sites like Linear/Stripe without
 * affecting layout or interaction.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE_DATA_URI}")` }}
    />
  );
}
