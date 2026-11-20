import React from "react";
import { rand } from "../lib/noise";

/** Gradient sky, optional sun or moon glow, seeded stars and soft clouds that drift. */
export const Sky: React.FC<{
  id: string; t: number; width: number; height: number; top: string; bottom: string;
  light?: { x: number; y: number; r: number; color: string; moon?: boolean };
  stars?: number; clouds?: number; cloudColor?: string; starBoost?: number;
}> = ({ id, t, width, height, top, bottom, light, stars = 0, clouds = 0, cloudColor = "#ffffff", starBoost = 1 }) => (
  <>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      {light ? (
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={light.color} stopOpacity="0.85" />
          <stop offset="0.35" stopColor={light.color} stopOpacity="0.25" />
          <stop offset="1" stopColor={light.color} stopOpacity="0" />
        </radialGradient>
      ) : null}
    </defs>
    <rect x={-width} y={-height} width={width * 3} height={height * 3} fill={`url(#${id}-sky)`} />
    {Array.from({ length: stars }, (_, i) => {
      const tw = 0.55 + 0.45 * Math.sin(t * (1.5 + rand(id.length, i) * 2) + i);
      return <circle key={i} cx={rand(5, i) * width} cy={rand(6, i) * height * 0.6} r={(1.5 + rand(7, i) * 2.5) * starBoost} fill="#fff8e0" opacity={Math.min(1, tw * starBoost)} />;
    })}
    {light ? (
      <>
        <circle cx={light.x} cy={light.y} r={light.r * 4} fill={`url(#${id}-glow)`} />
        {light.moon ? (
          <>
            <mask id={`${id}-crescent`}>
              <circle cx={light.x} cy={light.y} r={light.r} fill="#fff" />
              <circle cx={light.x + light.r * 0.38} cy={light.y - light.r * 0.22} r={light.r * 0.86} fill="#000" />
            </mask>
            <circle cx={light.x} cy={light.y} r={light.r} fill={light.color} mask={`url(#${id}-crescent)`} />
          </>
        ) : (
          <circle cx={light.x} cy={light.y} r={light.r} fill={light.color} />
        )}
      </>
    ) : null}
    {Array.from({ length: clouds }, (_, i) => {
      const w = 160 + rand(9, i) * 180;
      const x = ((rand(10, i) * (width + 400) + t * (8 + rand(11, i) * 10)) % (width + 400)) - 200;
      const y = 80 + rand(12, i) * height * 0.3;
      return (
        <g key={i} opacity={0.85} transform={`translate(${x},${y})`}>
          <ellipse cx={0} cy={0} rx={w * 0.5} ry={w * 0.16} fill={cloudColor} />
          <circle cx={-w * 0.18} cy={-w * 0.1} r={w * 0.18} fill={cloudColor} />
          <circle cx={w * 0.1} cy={-w * 0.16} r={w * 0.22} fill={cloudColor} />
        </g>
      );
    })}
  </>
);
