import React from "react";

/** Seeded grain and a soft vignette, applied once over everything. */
export const Post: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 997} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="1920" height="1080" filter="url(#grain)" />
    </svg>
  </>
);
