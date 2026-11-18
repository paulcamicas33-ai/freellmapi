import React from "react";
import { shade } from "../lib/color";
import { sway } from "../lib/motion";

const outline = (c: string) => shade(c, -0.45);

/** A round storybook tree that sways from its trunk base. */
export const Tree: React.FC<{ id: string; t: number; x: number; y: number; scale?: number; leaf: string; seed?: number }> = ({
  id, t, x, y, scale = 1, leaf, seed = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${scale}) rotate(${sway(t, seed, 1.6)})`}>
    <defs>
      <radialGradient id={`${id}-leaf`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor={shade(leaf, 0.3)} />
        <stop offset="0.6" stopColor={leaf} />
        <stop offset="1" stopColor={shade(leaf, -0.3)} />
      </radialGradient>
    </defs>
    <path d="M -16 0 C -12 -60 -14 -120 -6 -170 L 8 -170 C 14 -120 12 -60 18 0 Z" fill="#6b4226" stroke={outline("#6b4226")} strokeWidth={5} />
    {[[-60, -200, 70], [55, -210, 66], [0, -260, 84], [-20, -175, 60], [35, -170, 56]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${id}-leaf)`} stroke={outline(leaf)} strokeWidth={5} />
    ))}
    <path d="M -40 -300 Q -10 -330 30 -305" fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={8} strokeLinecap="round" />
  </g>
);

export const Bush: React.FC<{ x: number; y: number; scale?: number; color: string }> = ({ x, y, scale = 1, color }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {[[-40, -30, 40], [10, -45, 50], [55, -28, 36]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={i === 1 ? shade(color, 0.1) : color} stroke={outline(color)} strokeWidth={4} />
    ))}
  </g>
);

export const Flower: React.FC<{ t: number; x: number; y: number; color: string; seed?: number; scale?: number }> = ({ t, x, y, color, seed = 0, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale}) rotate(${sway(t, seed, 5, 0.6)})`}>
    <path d="M 0 0 Q 4 -30 0 -60" stroke="#3f7d3a" strokeWidth={5} fill="none" />
    {Array.from({ length: 5 }, (_, i) => (
      <ellipse key={i} cx={0} cy={-74} rx={9} ry={15} fill={color} stroke={outline(color)} strokeWidth={2.5}
        transform={`rotate(${i * 72} 0 -60)`} />
    ))}
    <circle cx={0} cy={-60} r={8} fill="#ffd166" stroke={outline("#ffd166")} strokeWidth={2.5} />
  </g>
);

/** Five-point star; `glow` 0..1 adds a soft halo. */
export const Star: React.FC<{ x: number; y: number; r: number; color?: string; glow?: number; rot?: number; face?: { blink?: number; mouth?: number; sad?: number } }> = ({
  x, y, r, color = "#ffd166", glow = 0, rot = 0, face,
}) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {glow > 0 ? <circle r={r * 2.4} fill={color} opacity={0.18 * glow} /> : null}
      {glow > 0 ? <circle r={r * 1.5} fill={color} opacity={0.25 * glow} /> : null}
      <polygon points={pts} fill={color} stroke={outline(color)} strokeWidth={Math.max(2, r * 0.08)} strokeLinejoin="round" />
      <polygon points={pts} fill="#ffffff" opacity={0.25} transform={`scale(0.5) translate(${-r * 0.2},${-r * 0.25})`} />
      {face ? (
        <g>
          {[-1, 1].map((s) => (
            <g key={s}>
              <ellipse cx={s * r * 0.2} cy={-r * 0.02} rx={r * 0.075} ry={r * 0.1 * (1 - (face.blink ?? 0))} fill="#3b2416" />
              <circle cx={s * r * 0.2 + r * 0.025} cy={-r * 0.06} r={r * 0.025} fill="#fff" />
              <circle cx={s * r * 0.33} cy={r * 0.12} r={r * 0.06} fill="#f08a7a" opacity={0.6} />
            </g>
          ))}
          {(face.mouth ?? 0) > 0.05 ? (
            <ellipse cx={0} cy={r * 0.17} rx={r * 0.06} ry={r * 0.04 + r * 0.08 * (face.mouth ?? 0)} fill="#5a1e24" />
          ) : (
            <path d={`M ${-r * 0.1} ${r * 0.17} Q 0 ${r * 0.17 + r * 0.1 * (1 - 2 * (face.sad ?? 0))} ${r * 0.1} ${r * 0.17}`}
              fill="none" stroke="#3b2416" strokeWidth={r * 0.035} strokeLinecap="round" />
          )}
        </g>
      ) : null}
    </g>
  );
};
