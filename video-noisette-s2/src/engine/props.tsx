import React from "react";
import { shade } from "../lib/color";
import { pop, prog } from "../lib/ease";
import { FONT } from "../fonts";

const ol = (c: string) => shade(c, -0.45);

/** A cartoon face (eyes, cheeks, mouth) for any object, centred at (0, 0), size s (~ face width). */
export const Face: React.FC<{ s: number; blink?: number; mouth?: number; smile?: number; puff?: number; sad?: number }> = ({ s, blink = 0, mouth = 0, smile = 1, puff = 0, sad = 0 }) => (
  <g>
    {[-1, 1].map((d) => (
      <g key={d}>
        {blink > 0.85 ? (
          <path d={`M ${d * s * 0.22 - s * 0.08} 0 Q ${d * s * 0.22} ${-s * 0.09} ${d * s * 0.22 + s * 0.08} 0`} fill="none" stroke="#3b2416" strokeWidth={s * 0.035} strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx={d * s * 0.22} cy={0} rx={s * 0.07} ry={s * 0.095 * (1 - blink)} fill="#3b2416" />
            <circle cx={d * s * 0.22 + s * 0.025} cy={-s * 0.035} r={s * 0.025} fill="#fff" />
          </>
        )}
        <circle cx={d * s * (0.36 + puff * 0.05)} cy={s * 0.14} r={s * (0.07 + puff * 0.08)} fill="#f08a7a" opacity={0.55} />
      </g>
    ))}
    {mouth > 0.05 ? (
      <ellipse cx={0} cy={s * 0.2} rx={s * 0.06 + mouth * s * 0.03} ry={s * 0.03 + mouth * s * 0.08} fill="#5a1e24" />
    ) : puff > 0.3 ? (
      <ellipse cx={0} cy={s * 0.2} rx={s * 0.05} ry={s * 0.02} fill="#5a1e24" />
    ) : (
      <path d={`M ${-s * 0.11} ${s * 0.18} Q 0 ${s * 0.18 + s * 0.12 * (smile - 2 * sad)} ${s * 0.11} ${s * 0.18}`} fill="none" stroke="#3b2416" strokeWidth={s * 0.035} strokeLinecap="round" />
    )}
  </g>
);

/** The big friendly Moon with a face. `hic` 0..1 = a hiccup jump, `puff` 0..1 = holding breath. */
export const MoonFace: React.FC<{ x: number; y: number; r: number; t: number; hic?: number; puff?: number; smile?: number; blink?: number; mouth?: number }> = ({
  x, y, r, t, hic = 0, puff = 0, smile = 1, blink = 0, mouth = 0,
}) => (
  <g transform={`translate(${x},${y - hic * 40}) scale(${1 + puff * 0.08 + hic * 0.05},${1 + puff * 0.06 - hic * 0.05})`}>
    <circle r={r * 2.3} fill="#fff6d8" opacity={0.12} />
    <circle r={r * 1.5} fill="#fff6d8" opacity={0.18} />
    <circle r={r} fill="#fff1c0" stroke="#c9a85a" strokeWidth={6} />
    {[[-0.35, -0.45, 0.13], [0.45, -0.3, 0.09], [-0.5, 0.35, 0.08], [0.5, 0.45, 0.11]].map(([cx, cy, cr], i) => (
      <circle key={i} cx={cx * r} cy={cy * r} r={cr * r} fill="#f2dc9a" />
    ))}
    <path d={`M ${-r * 0.7} ${-r * 0.5} Q ${-r * 0.4} ${-r * 0.85} 0 ${-r * 0.88}`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    <g transform={`translate(0,${r * 0.05})`}><Face s={r * 1.1} smile={smile} puff={puff} blink={blink} mouth={mouth} /></g>
  </g>
);

/** Floating word that pops (e.g. "HIC !", "BOUH !"), drawn in SVG. */
export const PopWord: React.FC<{ t: number; at: number; dur?: number; x: number; y: number; text: string; size?: number; color?: string }> = ({
  t, at, dur = 0.9, x, y, text, size = 80, color = "#ff7a59",
}) => {
  const k = prog(t, at, at + dur);
  if (k <= 0 || k >= 1) return null;
  const s = pop(prog(t, at, at + 0.3));
  return (
    <text x={x} y={y - k * 60} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={size} fill={color}
      stroke="#fff8ec" strokeWidth={10} paintOrder="stroke" opacity={1 - Math.max(0, k - 0.7) / 0.3}
      transform={`rotate(${Math.sin(at * 7) * 8} ${x} ${y}) translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{text}</text>
  );
};

export const Acorn: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <ellipse cx={0} cy={8} rx={22} ry={26} fill="#c98a4a" stroke={ol("#c98a4a")} strokeWidth={4} />
    <path d="M -26 -6 Q 0 -30 26 -6 Q 0 4 -26 -6 Z" fill="#7a4f2a" stroke={ol("#7a4f2a")} strokeWidth={4} />
    <path d="M 0 -20 Q 4 -30 10 -32" fill="none" stroke="#5e3a1c" strokeWidth={4} strokeLinecap="round" />
    <ellipse cx={-8} cy={6} rx={5} ry={10} fill="#fff" opacity={0.35} />
  </g>
);

export const Chest: React.FC<{ x: number; y: number; s?: number; open?: number; glow?: number }> = ({ x, y, s = 1, open = 0, glow = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {glow > 0 ? <circle cx={0} cy={-70} r={120 + glow * 40} fill="#ffe08a" opacity={0.35 * glow} /> : null}
    <rect x={-80} y={-70} width={160} height={70} rx={12} fill="#a8642f" stroke="#5e3416" strokeWidth={5} />
    <rect x={-80} y={-50} width={160} height={14} fill="#ffcf4a" stroke="#8a6414" strokeWidth={3} />
    <g transform={`translate(0,-70) rotate(${-open * 70} -80 0)`}>
      <path d="M -80 0 Q 0 -70 80 0 Z" fill="#c07a3c" stroke="#5e3416" strokeWidth={5} strokeLinejoin="round" />
    </g>
    <rect x={-14} y={-60} width={28} height={30} rx={5} fill="#ffcf4a" stroke="#8a6414" strokeWidth={3} />
  </g>
);

/** Treasure map scroll, unrolling with k 0..1. */
export const MapScroll: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g transform={`translate(${x},${y}) scale(${0.3 + k * 0.7})`} opacity={Math.min(1, k * 3)}>
    <rect x={-130} y={-90} width={260} height={180} rx={10} fill="#f3e2b8" stroke="#a8804a" strokeWidth={5} />
    <path d="M -90 50 Q -40 -10 0 30 T 80 -40" fill="none" stroke="#c0572e" strokeWidth={6} strokeDasharray="14 12" />
    <path d="M 66 -54 L 94 -26 M 94 -54 L 66 -26" stroke="#c0572e" strokeWidth={8} strokeLinecap="round" />
    <circle cx={-90} cy={50} r={10} fill="#4fb36c" />
  </g>
);

export const Fish: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; t: number; happy?: number }> = ({ x, y, s = 1, color = "#ff8a5c", flip = false, t, happy = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${Math.sin(t * 6) * 6})`}>
    <path d={`M 40 0 L 78 ${-26 + Math.sin(t * 12) * 6} L 78 ${26 + Math.sin(t * 12) * 6} Z`} fill={color} stroke={ol(color)} strokeWidth={4} strokeLinejoin="round" />
    <ellipse rx={52} ry={34} fill={color} stroke={ol(color)} strokeWidth={4} />
    <path d="M -10 -32 Q 6 -52 24 -30" fill={shade(color, 0.2)} stroke={ol(color)} strokeWidth={4} />
    <g transform="translate(-22,-4)"><Face s={60} smile={happy} sad={1 - happy} /></g>
  </g>
);

/** A pond (ellipse of water with ripples) at ground level. */
export const Pond: React.FC<{ x: number; y: number; rx: number; t: number }> = ({ x, y, rx, t }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse rx={rx + 14} ry={rx * 0.26 + 8} fill="#8a6a4a" opacity={0.5} />
    <ellipse rx={rx} ry={rx * 0.26} fill="#4fa6d8" stroke="#2f6f9e" strokeWidth={5} />
    {[0, 1, 2].map((i) => {
      const k = ((t * 0.5 + i / 3) % 1);
      return <ellipse key={i} rx={rx * 0.2 + k * rx * 0.6} ry={(rx * 0.2 + k * rx * 0.6) * 0.26} fill="none" stroke="#d8f2ff" strokeWidth={3} opacity={1 - k} />;
    })}
  </g>
);

export const Snowball: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#ffffff" stroke="#9fb8d8" strokeWidth={5} />
    <path d={`M ${-r * 0.6} ${-r * 0.4} Q ${-r * 0.3} ${-r * 0.75} ${r * 0.1} ${-r * 0.7}`} fill="none" stroke="#fff" strokeWidth={6} opacity={0.9} />
    <ellipse cx={r * 0.2} cy={r * 0.35} rx={r * 0.55} ry={r * 0.3} fill="#dfeaf7" opacity={0.7} />
  </g>
);

export const Snail: React.FC<{ x: number; y: number; s?: number; t: number; moving?: boolean; happy?: number }> = ({ x, y, s = 1, t, moving = false, happy = 1 }) => {
  const st = moving ? 1 + Math.sin(t * 8) * 0.06 : 1;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={90} ry={10} fill="#000" opacity={0.18} />
      <path d={`M -70 0 Q -80 -40 -46 -44 L 70 -30 Q ${92 * st} -20 ${86 * st} 0 Z`} fill="#b8e07a" stroke={ol("#b8e07a")} strokeWidth={5} strokeLinejoin="round" />
      <g transform="translate(70,-36)">
        <path d="M 0 0 Q -4 -40 -10 -56 M 14 0 Q 20 -40 26 -54" stroke={ol("#b8e07a")} strokeWidth={5} fill="none" strokeLinecap="round" />
        <circle cx={-10} cy={-58} r={8} fill="#b8e07a" stroke={ol("#b8e07a")} strokeWidth={4} />
        <circle cx={26} cy={-56} r={8} fill="#b8e07a" stroke={ol("#b8e07a")} strokeWidth={4} />
        <g transform="translate(6,10)"><Face s={56} smile={happy} sad={1 - happy} /></g>
      </g>
      <circle cx={-12} cy={-70} r={56} fill="#e88a5a" stroke={ol("#e88a5a")} strokeWidth={5} />
      <path d="M -12 -70 m -36 0 a 36 36 0 1 0 36 -36 a 24 24 0 1 0 -24 24 a 12 12 0 1 0 12 -12" fill="none" stroke={ol("#e88a5a")} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

export const Cake: React.FC<{ x: number; y: number; s?: number; t: number; candles?: number; lit?: number; fallen?: number; fruits?: number }> = ({
  x, y, s = 1, t, candles = 3, lit = 1, fallen = 0, fruits = 0,
}) => {
  if (fallen > 0.5) {
    return (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <path d="M -110 0 Q -90 -40 -40 -30 Q 0 -60 40 -34 Q 90 -44 110 0 Z" fill="#fbe0ea" stroke="#c97a92" strokeWidth={5} />
        <circle cx={-50} cy={-30} r={10} fill="#e84a5a" /><circle cx={30} cy={-36} r={10} fill="#e84a5a" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={130} ry={14} fill="#000" opacity={0.15} />
      <rect x={-110} y={-90} width={220} height={90} rx={18} fill="#f7c9d6" stroke="#c97a92" strokeWidth={5} />
      <rect x={-80} y={-150} width={160} height={64} rx={16} fill="#fbe0ea" stroke="#c97a92" strokeWidth={5} />
      <path d="M -110 -60 Q -90 -40 -70 -60 Q -50 -40 -30 -60 Q -10 -40 10 -60 Q 30 -40 50 -60 Q 70 -40 90 -60 Q 100 -48 110 -60" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
      {Array.from({ length: Math.round(fruits * 5) }, (_, i) => (
        <circle key={i} cx={-70 + i * 35} cy={-150} r={14} fill={["#e84a5a", "#ffb347", "#6fbf5a", "#a98bf2", "#e84a5a"][i]} stroke="#7a2a2a" strokeWidth={3} />
      ))}
      {Array.from({ length: candles }, (_, i) => {
        const cx = -40 + i * 40;
        return (
          <g key={i}>
            <rect x={cx - 7} y={-196} width={14} height={46} rx={4} fill={["#7fc8f0", "#ffd166", "#b8e07a"][i % 3]} stroke="#5a6a7a" strokeWidth={3} />
            {lit > 0 ? <ellipse cx={cx} cy={-208} rx={7} ry={12 + Math.sin(t * 15 + i) * 2} fill="#ffb347" opacity={lit} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** A tiny friendly dragon; `blow` 0..1 opens the mouth. */
export const Dragon: React.FC<{ x: number; y: number; s?: number; t: number; blow?: number; happy?: number; facing?: 1 | -1 }> = ({
  x, y, s = 1, t, blow = 0, happy = 1, facing = 1,
}) => {
  const c = "#7fcf8a";
  return (
    <g transform={`translate(${x},${y}) scale(${s * facing},${s})`}>
      <ellipse cx={0} cy={2} rx={80} ry={12} fill="#000" opacity={0.18} />
      <path d="M -60 -40 Q -130 -50 -120 -110 Q -100 -70 -50 -70 Z" fill={c} stroke={ol(c)} strokeWidth={5} />
      <g transform={`rotate(${Math.sin(t * 8) * 15} -20 -120)`}>
        <path d="M -20 -120 Q -90 -200 -40 -210 Q -30 -160 0 -130 Z" fill="#c8f0a8" stroke={ol(c)} strokeWidth={5} />
      </g>
      <ellipse cx={0} cy={-70} rx={70} ry={72} fill={c} stroke={ol(c)} strokeWidth={5} />
      <ellipse cx={8} cy={-56} rx={42} ry={46} fill="#e8f8c8" />
      <rect x={-40} y={-12} width={26} height={16} rx={8} fill={c} stroke={ol(c)} strokeWidth={4} />
      <rect x={14} y={-12} width={26} height={16} rx={8} fill={c} stroke={ol(c)} strokeWidth={4} />
      <g transform="translate(30,-160)">
        {[-30, 10].map((hx, i) => <path key={i} d={`M ${hx} -50 L ${hx + 8} -80 L ${hx + 18} -50 Z`} fill="#ffd166" stroke="#a8862a" strokeWidth={4} />)}
        <ellipse cx={0} cy={0} rx={66} ry={58} fill={c} stroke={ol(c)} strokeWidth={5} />
        <ellipse cx={40} cy={18} rx={34} ry={24} fill="#a8e8b0" stroke={ol(c)} strokeWidth={4} />
        <circle cx={52} cy={10} r={4} fill={ol(c)} /><circle cx={62} cy={14} r={4} fill={ol(c)} />
        <g transform="translate(-6,-8)"><Face s={90} smile={happy} sad={1 - happy} mouth={blow * 0.6} /></g>
      </g>
    </g>
  );
};

/** Soap bubble with a rainbow sheen. */
export const Bubble: React.FC<{ x: number; y: number; r: number; t: number }> = ({ x, y, r, t }) => (
  <g transform={`translate(${x + Math.sin(t * 2 + x) * 8},${y})`}>
    <circle r={r} fill="#e8f6ff" opacity={0.25} stroke="#bfe0ff" strokeWidth={3} />
    <path d={`M ${-r * 0.6} ${-r * 0.3} A ${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.2} ${-r * 0.65}`} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" />
    <path d={`M ${r * 0.5} ${r * 0.4} A ${r * 0.7} ${r * 0.7} 0 0 1 ${-r * 0.1} ${r * 0.7}`} fill="none" stroke="#f9a8d4" strokeWidth={3} opacity={0.7} />
  </g>
);

/** Noisette's home: a round door in a big tree stump, with a lit window. */
export const Burrow: React.FC<{ x: number; y: number; s?: number; light?: number }> = ({ x, y, s = 1, light = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -190 0 Q -200 -260 -150 -300 L 150 -300 Q 200 -260 190 0 Z" fill="#8a5a3a" stroke={ol("#8a5a3a")} strokeWidth={6} />
    <ellipse cx={0} cy={-300} rx={152} ry={36} fill="#c9935e" stroke={ol("#8a5a3a")} strokeWidth={6} />
    <ellipse cx={0} cy={-300} rx={110} ry={24} fill="none" stroke="#a87444" strokeWidth={4} />
    <path d="M -70 0 L -70 -110 A 70 70 0 0 1 70 -110 L 70 0 Z" fill="#5e8f4a" stroke="#2f4f24" strokeWidth={6} />
    <circle cx={44} cy={-60} r={8} fill="#ffd166" stroke="#8a6414" strokeWidth={3} />
    <circle cx={-120} cy={-190} r={40} fill={`rgba(255,${200 + 30 * light},120,${0.35 + 0.6 * light})`} stroke={ol("#8a5a3a")} strokeWidth={6} />
    <path d="M -160 -190 L -80 -190 M -120 -230 L -120 -150" stroke={ol("#8a5a3a")} strokeWidth={5} />
    {light > 0 ? <circle cx={-120} cy={-190} r={90} fill="#ffd98a" opacity={0.15 * light} /> : null}
  </g>
);

export const Toothbrush: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-6} y={-70} width={12} height={80} rx={6} fill="#5ab0e6" stroke="#2f6f9e" strokeWidth={3} />
    <rect x={-10} y={-96} width={20} height={30} rx={4} fill="#ffffff" stroke="#9fb8d8" strokeWidth={3} />
    <circle cx={0} cy={-104} r={9} fill="#ffffff" opacity={0.9} />
  </g>
);
