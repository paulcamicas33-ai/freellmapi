import React from "react";
import { AbsoluteFill } from "remotion";

/** Paper grain seeded by the frame, plus a soft warm vignette. Applied once over everything. */
export const Grain: React.FC<{ frame: number; width: number; height: number; strength?: number }> = ({ frame, width, height, strength = 0.07 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(40,20,10,0.35) 100%)" }} />
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: strength, mixBlendMode: "multiply" }}>
      <filter id="paper-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 997} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={width} height={height} filter="url(#paper-grain)" />
    </svg>
  </AbsoluteFill>
);
