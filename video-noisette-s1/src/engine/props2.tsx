import React from "react";
import { shade } from "../lib/color";
import { Face } from "./props";

const ol = (c: string) => shade(c, -0.45);

/** Diamond kite with a bow tail; the string goes to (sx, sy). */
export const Kite: React.FC<{ x: number; y: number; t: number; sx: number; sy: number; s?: number; rot?: number }> = ({ x, y, t, sx, sy, s = 1, rot = 0 }) => (
  <g>
    <path d={`M ${sx} ${sy} Q ${(sx + x) / 2 - 60} ${(sy + y) / 2 + 80} ${x} ${y + 70 * s}`} fill="none" stroke="#fff8ec" strokeWidth={3} opacity={0.9} />
    <g transform={`translate(${x},${y}) rotate(${rot + Math.sin(t * 2.4) * 6}) scale(${s})`}>
      <path d="M 0 -90 L 62 0 L 0 70 L -62 0 Z" fill="#ff6b6b" stroke={ol("#ff6b6b")} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 0 -90 L 62 0 L 0 0 Z" fill="#ffd166" stroke={ol("#ff6b6b")} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 0 0 L -62 0 L 0 70 Z" fill="#4dabf7" stroke={ol("#ff6b6b")} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M 0 70 Q ${20 + Math.sin(t * 5) * 20} 120 0 160 Q ${-20 + Math.sin(t * 5 + 1) * 20} 200 0 240`} fill="none" stroke="#5a3420" strokeWidth={3} />
      {[120, 180, 235].map((by, i) => (
        <g key={i} transform={`translate(${Math.sin(t * 5 + i) * 14},${by})`}>
          <path d="M 0 0 L -16 -10 L -16 10 Z M 0 0 L 16 -10 L 16 10 Z" fill={["#69db7c", "#9775fa", "#ffa94d"][i]} />
        </g>
      ))}
    </g>
  </g>
);

export const WateringCan: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-50} width={80} height={60} rx={14} fill="#5ab0e6" stroke={ol("#5ab0e6")} strokeWidth={5} />
    <path d="M 38 -36 L 86 -66 L 92 -56 L 40 -20 Z" fill="#5ab0e6" stroke={ol("#5ab0e6")} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -40 -40 Q -76 -40 -70 -6 Q -66 10 -40 4" fill="none" stroke={ol("#5ab0e6")} strokeWidth={8} />
  </g>
);

/** Seed → sprout → sunflower. g 0..1 = growth. Base at (x, y). */
export const Sunflower: React.FC<{ x: number; y: number; g: number; t: number; face?: boolean }> = ({ x, y, g, t, face = true }) => {
  if (g <= 0) return <ellipse cx={x} cy={y - 6} rx={14} ry={9} fill="#6b4a2e" />;
  const h = 40 + g * 420;
  const head = Math.max(0, (g - 0.55) / 0.45);
  const sw = Math.sin(t * 1.2) * 4 * g;
  return (
    <g transform={`translate(${x},${y}) rotate(${sw})`}>
      <ellipse cx={0} cy={0} rx={60} ry={14} fill="#6b4a2e" />
      <path d={`M 0 0 Q 10 ${-h / 2} 0 ${-h}`} fill="none" stroke="#3f8a3a" strokeWidth={10 + g * 6} strokeLinecap="round" />
      {g > 0.2 ? <path d={`M 0 ${-h * 0.35} Q 60 ${-h * 0.45} 80 ${-h * 0.32} Q 40 ${-h * 0.28} 0 ${-h * 0.35} Z`} fill="#5fb04a" stroke="#2f6b2a" strokeWidth={3} /> : null}
      {g > 0.35 ? <path d={`M 0 ${-h * 0.55} Q -60 ${-h * 0.65} -80 ${-h * 0.52} Q -40 ${-h * 0.48} 0 ${-h * 0.55} Z`} fill="#5fb04a" stroke="#2f6b2a" strokeWidth={3} /> : null}
      {head > 0 ? (
        <g transform={`translate(0,${-h}) scale(${head})`}>
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse key={i} cx={0} cy={-78} rx={20} ry={42} fill="#ffd43b" stroke="#c99a1a" strokeWidth={3} transform={`rotate(${i * (360 / 14)})`} />
          ))}
          <circle r={62} fill="#8a5a2e" stroke="#5e3a1c" strokeWidth={5} />
          {face ? <g transform="translate(0,-6)"><Face s={110} smile={1} /></g> : null}
        </g>
      ) : (
        <ellipse cx={0} cy={-h - 6} rx={14} ry={20} fill="#6fbf5a" stroke="#2f6b2a" strokeWidth={3} />
      )}
    </g>
  );
};

/** A cloud drawn in a recognisable shape: "round" | "heart" | "fish" | "star". k 0..1 = how formed (puffs gather). */
export const ShapeCloud: React.FC<{ shape: string; x: number; y: number; s?: number; k: number; t: number }> = ({ shape, x, y, s = 1, k, t }) => {
  const paths: Record<string, string> = {
    round: "M 0 -110 A 110 110 0 1 1 -0.1 -110 Z",
    heart: "M 0 90 C -170 -20 -120 -150 0 -70 C 120 -150 170 -20 0 90 Z",
    fish: "M -150 0 C -100 -90 60 -90 110 0 C 60 90 -100 90 -150 0 Z M 100 0 L 180 -70 L 180 70 Z",
    star: "M 0 -130 L 36 -42 L 128 -40 L 56 18 L 82 110 L 0 56 L -82 110 L -56 18 L -128 -40 L -36 -42 Z",
  };
  const d = paths[shape] ?? paths.round;
  return (
    <g transform={`translate(${x + Math.sin(t * 0.4) * 10},${y}) scale(${s})`} opacity={0.35 + 0.65 * k}>
      <path d={d} fill="#ffffff" stroke="#d8e8f8" strokeWidth={10} strokeLinejoin="round" transform={`scale(${0.7 + 0.3 * k})`} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 110 * (1.3 - 0.3 * k)} cy={Math.sin(a) * 70 * (1.3 - 0.3 * k)} r={36} fill="#ffffff" opacity={1 - k} />;
      })}
    </g>
  );
};

export const Blanket: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 560 }) => (
  <g transform={`translate(${x},${y})`}>
    <path d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 + 60} 110 L ${-w / 2 - 60} 110 Z`} fill="#ff6b6b" stroke="#a83a3a" strokeWidth={5} />
    {Array.from({ length: 7 }, (_, i) => (
      <path key={i} d={`M ${-w / 2 + (i * w) / 6} 0 L ${-w / 2 - 60 + (i * (w + 120)) / 6} 110`} stroke="#ffffff" strokeWidth={12} opacity={0.75} />
    ))}
    <path d={`M ${-w / 2 - 20} 40 L ${w / 2 + 20} 40 M ${-w / 2 - 40} 76 L ${w / 2 + 40} 76`} stroke="#ffffff" strokeWidth={10} opacity={0.6} />
  </g>
);

export const Basket: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -80 -10 Q 0 -120 80 -10" fill="none" stroke="#8a5a2e" strokeWidth={10} />
    <path d="M -90 -20 L 90 -20 L 70 50 L -70 50 Z" fill="#d9a05b" stroke="#8a5a2e" strokeWidth={5} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => <path key={i} d={`M -84 ${-2 + i * 18} L 84 ${-2 + i * 18}`} stroke="#b07a3a" strokeWidth={4} />)}
    <g transform={`rotate(${-open * 40} -90 -20)`}><path d="M -96 -26 L 96 -26 L 90 -14 L -90 -14 Z" fill="#c98a4a" stroke="#8a5a2e" strokeWidth={4} /></g>
  </g>
);

export const Fruit: React.FC<{ kind: "apple" | "strawberry" | "banana" | "grapes" | "cheese"; x: number; y: number; s?: number }> = ({ kind, x, y, s = 1 }) => {
  const g = (children: React.ReactNode) => <g transform={`translate(${x},${y}) scale(${s})`}>{children}</g>;
  if (kind === "apple") return g(<><circle r={36} fill="#ff5a5a" stroke="#a82a2a" strokeWidth={4} /><path d="M 0 -34 Q 4 -50 12 -54" stroke="#5e3a1c" strokeWidth={5} fill="none" /><ellipse cx={18} cy={-44} rx={14} ry={7} fill="#5fb04a" /><ellipse cx={-12} cy={-10} rx={8} ry={14} fill="#fff" opacity={0.35} /></>);
  if (kind === "strawberry") return g(<><path d="M -32 -20 Q 0 -36 32 -20 Q 26 30 0 44 Q -26 30 -32 -20 Z" fill="#ff4d6d" stroke="#a8243a" strokeWidth={4} />{[[-12, -4], [10, -2], [-4, 16], [14, 18], [-16, 18]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3} fill="#ffe08a" />)}<path d="M -20 -26 L 0 -38 L 20 -26 L 0 -20 Z" fill="#5fb04a" /></>);
  if (kind === "banana") return g(<><path d="M -50 -20 Q -10 40 50 -10 Q 40 10 0 22 Q -40 20 -50 -20 Z" fill="#ffd43b" stroke="#b8901a" strokeWidth={4} /></>);
  if (kind === "grapes") return g(<>{[[0, -30], [-18, -12], [18, -12], [0, 6], [-18, 24], [18, 24], [0, 40]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={15} fill="#69c45a" stroke="#2f6b2a" strokeWidth={3} />)}</>);
  return g(<><path d="M -44 20 L 44 20 L 44 -10 L -44 -34 Z" fill="#ffd166" stroke="#b8901a" strokeWidth={4} strokeLinejoin="round" /><circle cx={-14} cy={0} r={7} fill="#e8b84a" /><circle cx={16} cy={6} r={5} fill="#e8b84a" /></>);
};

export const MusicNote: React.FC<{ x: number; y: number; s?: number; color?: string; double?: boolean }> = ({ x, y, s = 1, color = "#9775fa", double = false }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={18} ry={14} fill={color} transform="rotate(-20)" />
    <rect x={14} y={-70} width={6} height={70} fill={color} />
    {double ? <><ellipse cx={46} cy={-10} rx={18} ry={14} fill={color} transform="rotate(-20 46 -10)" /><rect x={60} y={-80} width={6} height={70} fill={color} /><rect x={14} y={-80} width={52} height={12} fill={color} /></>
      : <path d="M 20 -70 Q 46 -56 40 -30" fill="none" stroke={color} strokeWidth={6} />}
  </g>
);

/** Knitted bobble hat. */
export const Bonnet: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number }> = ({ x, y, s = 1, color = "#ff9f43", rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -70 10 Q -70 -80 0 -84 Q 70 -80 70 10 Z" fill={color} stroke={ol(color)} strokeWidth={5} />
    <rect x={-78} y={0} width={156} height={30} rx={12} fill={shade(color, -0.12)} stroke={ol(color)} strokeWidth={5} />
    {[-48, -24, 0, 24, 48].map((bx) => <path key={bx} d={`M ${bx} 4 L ${bx} 26`} stroke={ol(color)} strokeWidth={3} opacity={0.5} />)}
    <circle cx={0} cy={-90} r={24} fill="#ffffff" stroke="#c8c0b8" strokeWidth={4} />
  </g>
);

export const Sheep: React.FC<{ x: number; y: number; s?: number; t: number; sleepy?: number }> = ({ x, y, s = 1, t, sleepy = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-30, 30].map((lx, i) => <rect key={i} x={lx - 8} y={10} width={16} height={46} rx={7} fill="#4a3a3a" />)}
    {[[-50, -10], [-20, -40], [20, -42], [50, -12], [30, 20], [-30, 20], [0, -6]].map(([a, b], i) => (
      <circle key={i} cx={a} cy={b} r={36} fill="#ffffff" stroke="#c8c8d8" strokeWidth={4} />
    ))}
    <g transform={`translate(78,-26) rotate(${Math.sin(t * 3) * 4})`}>
      <ellipse rx={32} ry={38} fill="#5a4a4a" stroke="#2a1a1a" strokeWidth={4} />
      <ellipse cx={-30} cy={-14} rx={16} ry={8} fill="#5a4a4a" transform="rotate(-30 -30 -14)" />
      <g transform="translate(4,-2)"><Face s={60} smile={1} blink={sleepy} /></g>
    </g>
  </g>
);

export const Fence: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-70, 0, 70].map((px) => <path key={px} d={`M ${px - 14} 0 L ${px - 14} -110 L ${px} -128 L ${px + 14} -110 L ${px + 14} 0 Z`} fill="#c98a4a" stroke="#6b4a2e" strokeWidth={4} />)}
    <rect x={-100} y={-90} width={200} height={20} rx={5} fill="#d9a05b" stroke="#6b4a2e" strokeWidth={4} />
    <rect x={-100} y={-44} width={200} height={20} rx={5} fill="#d9a05b" stroke="#6b4a2e" strokeWidth={4} />
  </g>
);
