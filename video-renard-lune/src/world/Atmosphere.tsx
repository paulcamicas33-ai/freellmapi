import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * The "glossy storybook" finish: light shafts from a source, a warm bloom haze, and a colour grade.
 * Put it above the world layers and below captions. All values are pure functions of t.
 */
export const Atmosphere: React.FC<{ t: number; width: number; height: number; source: { x: number; y: number }; color?: string; rays?: number; haze?: number }> = ({
  t, width, height, source, color = "#fff1c9", rays = 0.35, haze = 0.3,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
      <defs>
        <radialGradient id="atmo-ray" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
          gradientTransform={`translate(${source.x} ${source.y}) scale(${Math.max(width, height) * 1.1})`}>
          <stop offset="0" stopColor={color} stopOpacity={rays} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2 + t * 0.04 + Math.sin(t * 0.3 + i) * 0.03;
        const w = 0.07 + (i % 3) * 0.03;
        const L = Math.max(width, height) * 1.6;
        const p1 = `${source.x + Math.cos(a - w) * L},${source.y + Math.sin(a - w) * L}`;
        const p2 = `${source.x + Math.cos(a + w) * L},${source.y + Math.sin(a + w) * L}`;
        return <polygon key={i} points={`${source.x},${source.y} ${p1} ${p2}`} fill="url(#atmo-ray)" />;
      })}
    </svg>
    <AbsoluteFill style={{ background: `radial-gradient(circle at ${source.x}px ${source.y}px, ${color} 0%, rgba(255,255,255,0) 45%)`, opacity: haze, mixBlendMode: "screen" }} />
  </AbsoluteFill>
);
