import React from "react";
import { pop, prog, exit } from "../lib/ease";
import { shade } from "../lib/color";
import { FONT } from "../fonts";

/**
 * A thought bubble that pops out of a character's head: a cloud with a small icon and a label,
 * plus three little circles trailing toward `from` (the head). Pops at `at`, leaves at `out`.
 */
export const ThoughtBubble: React.FC<{
  t: number; x: number; y: number; r: number; from: { x: number; y: number };
  at: number; out: number; label: string; color?: string; children?: React.ReactNode; bob?: number;
}> = ({ t, x, y, r, from, at, out, label, color = "#fffaf0", children, bob = 0 }) => {
  const k = pop(prog(t, at, at + 0.45));
  const o = exit(prog(t, out, out + 0.35));
  if (k <= 0 || o >= 1) return null;
  const s = k * (1 - o);
  const line = shade("#c9a27a", -0.3);
  const fy = y + Math.sin(t * 1.6 + x) * 6 + bob;
  const trail = [0.25, 0.48, 0.7].map((f, i) => ({
    cx: from.x + (x - from.x) * f, cy: from.y + (fy + r * 0.7 - from.y) * f, rr: r * (0.09 + i * 0.05),
    vis: prog(t, at - 0.25 + i * 0.08, at - 0.1 + i * 0.08),
  }));
  const puffs: [number, number, number][] = [[0, 0, 1], [-0.62, 0.1, 0.62], [0.62, 0.12, 0.64], [-0.3, -0.42, 0.62], [0.32, -0.44, 0.6], [0, 0.42, 0.66]];
  return (
    <g>
      {trail.map((c, i) => (c.vis > 0 ? <circle key={i} cx={c.cx} cy={c.cy} r={c.rr * c.vis * (1 - o)} fill={color} stroke={line} strokeWidth={4} /> : null))}
      <g transform={`translate(${x},${fy}) scale(${s})`}>
        {puffs.map(([px, py, pr], i) => <circle key={`o${i}`} cx={px * r} cy={py * r} r={pr * r} fill={line} />)}
        {puffs.map(([px, py, pr], i) => <circle key={`i${i}`} cx={px * r} cy={py * r} r={pr * r - 4} fill={color} />)}
        <path d={`M ${-r * 0.7} ${-r * 0.55} Q ${-r * 0.3} ${-r * 0.85} ${r * 0.15} ${-r * 0.78}`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
        <g transform={`translate(0,${-r * 0.12})`}>{children}</g>
        <text x={0} y={r * 0.62} textAnchor="middle" fontFamily={FONT.story} fontWeight={800} fontSize={r * 0.26} fill="#5a3420">{label}</text>
      </g>
    </g>
  );
};

/** Little icons for idea bubbles, drawn about 120 px wide around (0, 0). */
export const IdeaIcon: React.FC<{ kind: string; t: number }> = ({ kind, t }) => {
  if (kind === "moon") {
    return (
      <g>
        <mask id="idea-moon"><circle r={44} fill="#fff" /><circle cx={20} cy={-14} r={38} fill="#000" /></mask>
        <circle r={44} fill="#ffd166" stroke="#b8862a" strokeWidth={4} mask="url(#idea-moon)" />
        {[[38, -30, 9], [52, 18, 6], [-46, -40, 6]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * (0.8 + 0.2 * Math.sin(t * 4 + i))} fill="#ffd166" />
        ))}
      </g>
    );
  }
  if (kind === "sea") {
    return (
      <g>
        <ellipse cx={0} cy={6} rx={54} ry={40} fill="#5ab0e6" stroke="#2f6f9e" strokeWidth={4} />
        <path d={`M -50 ${-2 + Math.sin(t * 3) * 3} q 12 -12 25 0 t 25 0 t 25 0 t 25 0`} fill="none" stroke="#e8f6ff" strokeWidth={5} strokeLinecap="round" />
        <g transform={`translate(${Math.sin(t * 2) * 10},16)`}>
          <ellipse rx={18} ry={11} fill="#ff8a5c" stroke="#b5502a" strokeWidth={3} />
          <path d="M 16 0 L 30 -10 L 30 10 Z" fill="#ff8a5c" stroke="#b5502a" strokeWidth={3} strokeLinejoin="round" />
          <circle cx={-8} cy={-3} r={3} fill="#3b2416" />
        </g>
      </g>
    );
  }
  if (kind === "treasure") {
    return (
      <g>
        <circle cx={0} cy={-18} r={26 + Math.sin(t * 5) * 3} fill="#ffe08a" opacity={0.6} />
        <rect x={-46} y={-8} width={92} height={50} rx={10} fill="#a8642f" stroke="#5e3416" strokeWidth={4} />
        <path d="M -46 -8 Q 0 -52 46 -8 Z" fill="#c07a3c" stroke="#5e3416" strokeWidth={4} strokeLinejoin="round" />
        <rect x={-46} y={8} width={92} height={10} fill="#ffcf4a" stroke="#8a6414" strokeWidth={3} />
        <rect x={-9} y={2} width={18} height={22} rx={4} fill="#ffcf4a" stroke="#8a6414" strokeWidth={3} />
      </g>
    );
  }
  // "yours": a big friendly question mark
  return (
    <text x={0} y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={110} fill="#4fb36c" stroke="#2d6e40" strokeWidth={4}
      transform={`rotate(${Math.sin(t * 3) * 6})`}>?</text>
  );
};
