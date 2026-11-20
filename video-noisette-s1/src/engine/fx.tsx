import React from "react";
import { AbsoluteFill } from "remotion";
import { rand } from "../lib/noise";
import { pop, prog, arrive, exit } from "../lib/ease";
import { FONT } from "../fonts";
import { W, H } from "./types";

export const Snowfall: React.FC<{ t: number; n?: number }> = ({ t, n = 90 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const sp = 60 + rand(41, i) * 90;
      const y = ((rand(42, i) * (H + 100) + t * sp) % (H + 100)) - 50;
      const x = rand(43, i) * W + Math.sin(t * 1.2 + i) * 20;
      return <circle key={i} cx={x} cy={y} r={3 + rand(44, i) * 6} fill="#ffffff" opacity={0.85} />;
    })}
  </g>
);

export const Rain: React.FC<{ t: number; n?: number; k?: number }> = ({ t, n = 110, k = 1 }) => (
  <g opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const y = ((rand(51, i) * (H + 200) + t * 1400) % (H + 200)) - 100;
      const x = rand(52, i) * (W + 200) - 100 - y * 0.08;
      return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 46} stroke="#e4f2ff" strokeWidth={4} strokeLinecap="round" opacity={0.6} />;
    })}
  </g>
);

export const Fireflies: React.FC<{ t: number; n?: number; cx?: number; cy?: number; spread?: number; k?: number }> = ({ t, n = 26, cx = W / 2, cy = H * 0.45, spread = 450, k = 1 }) => (
  <g opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const x = cx + Math.sin(t * (0.4 + rand(61, i) * 0.5) + i * 2) * spread * rand(62, i) + (rand(63, i) - 0.5) * spread;
      const y = cy + Math.cos(t * (0.5 + rand(64, i) * 0.4) + i) * spread * 0.5 * rand(65, i);
      const b = 0.4 + 0.6 * Math.max(0, Math.sin(t * 3 + i * 1.7));
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={20} fill="#fff3a0" opacity={0.18 * b} />
          <circle cx={x} cy={y} r={6} fill="#fff7c4" opacity={b} />
        </g>
      );
    })}
  </g>
);

/** Burst of little stars at (x, y) starting at `at`. */
export const Sparkles: React.FC<{ t: number; at: number; x: number; y: number; n?: number; color?: string; spread?: number }> = ({ t, at, x, y, n = 12, color = "#ffd166", spread = 220 }) => {
  const k = prog(t, at, at + 1.1);
  if (k <= 0 || k >= 1) return null;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + at;
        const d = arrive(k) * spread * (0.6 + rand(71, i) * 0.4);
        const r = 14 * (1 - k);
        const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
        return <path key={i} d={`M ${px} ${py - r} L ${px + r * 0.3} ${py - r * 0.3} L ${px + r} ${py} L ${px + r * 0.3} ${py + r * 0.3} L ${px} ${py + r} L ${px - r * 0.3} ${py + r * 0.3} L ${px - r} ${py} L ${px - r * 0.3} ${py - r * 0.3} Z`} fill={color} />;
      })}
    </g>
  );
};

/** A rainbow arc drawing itself (k 0..1), centred on (cx, cy). */
export const Rainbow: React.FC<{ k: number; cx: number; cy: number; r: number }> = ({ k, cx, cy, r }) => {
  const cols = ["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4dabf7", "#9775fa"];
  const L = Math.PI * r;
  return (
    <g opacity={0.9}>
      {cols.map((c, i) => {
        const rr = r - i * 26;
        return <path key={c} d={`M ${cx - rr} ${cy} A ${rr} ${rr} 0 0 1 ${cx + rr} ${cy}`} fill="none" stroke={c} strokeWidth={26}
          strokeDasharray={`${L} ${L}`} strokeDashoffset={(1 - k) * Math.PI * rr} />;
      })}
    </g>
  );
};

export const Zzz: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const k = (t * 0.45 + i / 3) % 1;
      return (
        <text key={i} x={x + k * 80 + i * 10} y={y - k * 160} fontFamily={FONT.title} fontWeight={900} fontSize={40 + k * 40}
          fill="#cfd8ff" stroke="#2b3466" strokeWidth={6} paintOrder="stroke" opacity={1 - k}>z</text>
      );
    })}
  </g>
);

/** Big counting numbers for interactive moments ("1", "2", "3"...), DOM overlay, each pops at its time. */
export const CountUp: React.FC<{ t: number; items: { at: number; text: string; color?: string; size?: number }[]; y?: number }> = ({ t, items, y = 380 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {items.map((it, i) => {
      const k = pop(prog(t, it.at, it.at + 0.35));
      const out = exit(prog(t, it.at + 0.75, it.at + 1.0));
      if (k <= 0 || out >= 1) return null;
      return (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT.title, fontWeight: 900,
          fontSize: it.size ?? 260, color: it.color ?? "#ffd166", WebkitTextStroke: "10px #4a2a17", paintOrder: "stroke",
          transform: `scale(${k * (1 - out * 0.3)})`, opacity: 1 - out, textShadow: "0 10px 0 #4a2a17" }}>{it.text}</div>
      );
    })}
  </AbsoluteFill>
);

/** Iris transition: the frame closes into a circle on (cx, cy) before the cut and opens after it. */
export const Iris: React.FC<{ t: number; cuts: number[]; cx?: number; cy?: number }> = ({ t, cuts, cx = W / 2, cy = H * 0.42 }) => {
  const near = cuts.find((c) => Math.abs(t - c) < 0.45);
  if (near === undefined) return null;
  const d = Math.abs(t - near) / 0.45; // 0 at the cut, 1 at the edges
  const maxR = Math.hypot(W, H);
  const r = d < 0.08 ? 0 : arrive(d) * maxR;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(0,0,0,0) ${r}px, #2a1a12 ${r + 2}px)` }} />
  );
};
