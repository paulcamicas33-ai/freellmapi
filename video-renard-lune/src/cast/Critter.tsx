import React from "react";
import { shade } from "../lib/color";

export type Species = "fox" | "bunny" | "bear" | "cat" | "hedgehog";
export type Look = { fur: string; belly: string; accent?: string; eye?: string; blush?: string };
/** Every field is optional; angles in degrees, look in -1..1, blink/mouth/smile 0..1. */
export type Pose = {
  armL?: number; armR?: number; legL?: number; legR?: number;
  tilt?: number; headTilt?: number; lookX?: number; lookY?: number;
  blink?: number; mouth?: number; smile?: number; brow?: number;
  sx?: number; sy?: number; bob?: number; tail?: number; earL?: number; earR?: number;
  /** 0..1: stretch an arm to hold something high or wave; a raised arm (|angle| > 110) is drawn in front of the head. */
  reachL?: number; reachR?: number;
};

const Limb: React.FC<{ x: number; y: number; angle: number; len: number; w: number; fill: string; line: string; end: "hand" | "foot" }> = ({
  x, y, angle, len, w, fill, line, end,
}) => (
  <g transform={`translate(${x},${y}) rotate(${angle})`}>
    <rect x={-w / 2} y={-w / 3} width={w} height={len} rx={w / 2} fill={fill} stroke={line} strokeWidth={5} />
    {end === "foot" ? (
      <ellipse cx={4} cy={len - 4} rx={w * 0.8} ry={w * 0.42} fill={fill} stroke={line} strokeWidth={5} />
    ) : (
      <circle cx={0} cy={len - 4} r={w * 0.58} fill={fill} stroke={line} strokeWidth={5} />
    )}
  </g>
);

/** Soft rounded spikes on an elliptical arc (angles in degrees, 0 = right, -90 = up), two rows for depth. */
const Spikes: React.FC<{ cx: number; cy: number; rx: number; ry: number; from: number; to: number; n: number; len: number; fill: string; line: string; tipFill?: string }> = ({
  cx, cy, rx, ry, from, to, n, len, fill, line, tipFill,
}) => {
  const row = (shift: number, l: number) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const a0 = ((from + ((to - from) * (i + shift)) / n) * Math.PI) / 180;
      const a1 = ((from + ((to - from) * (i + shift + 1)) / n) * Math.PI) / 180;
      const am = (a0 + a1) / 2;
      const p = (a: number, out: number) => `${(cx + Math.cos(a) * (rx + out)).toFixed(1)} ${(cy + Math.sin(a) * (ry + out)).toFixed(1)}`;
      // base -> curved side -> rounded tip -> curved side -> base (tip leans a little clockwise)
      d += `${i === 0 ? "M" : "L"} ${p(a0, 0)} Q ${p(am - 0.05, l * 0.55)} ${p(am + 0.02, l)} Q ${p(am + 0.12, l * 0.5)} ${p(a1, 0)} `;
    }
    return `M ${cx} ${cy} ${d.replace(/^M/, "L")} Z`;
  };
  return (
    <g>
      <path d={row(0.5, len * 0.8)} fill={line} stroke={line} strokeWidth={5} strokeLinejoin="round" opacity={0.9} />
      <path d={row(0, len)} fill={fill} stroke={line} strokeWidth={5} strokeLinejoin="round" />
      {tipFill ? <path d={row(0, len * 0.55)} fill={tipFill} opacity={0.35} /> : null}
    </g>
  );
};

const Ears: React.FC<{ species: Species; fill: string; inner: string; line: string; earL: number; earR: number }> = ({ species, fill, inner, line, earL, earR }) => {
  if (species === "bunny") {
    return (
      <>
        {[[-34, earL, -12], [34, earR, 12]].map(([x, rot, base], i) => (
          <g key={i} transform={`translate(${x},-56) rotate(${base + rot})`}>
            <ellipse cx={0} cy={-62} rx={22} ry={70} fill={fill} stroke={line} strokeWidth={5} />
            <ellipse cx={0} cy={-58} rx={11} ry={52} fill={inner} />
          </g>
        ))}
      </>
    );
  }
  if (species === "hedgehog") {
    return (
      <>
        {[[-62, earL], [62, earR]].map(([x, rot], i) => (
          <g key={i} transform={`translate(${x},-36) rotate(${rot})`}>
            <circle r={19} fill={fill} stroke={line} strokeWidth={5} />
            <circle r={9} fill={inner} />
          </g>
        ))}
      </>
    );
  }
  if (species === "bear") {
    return (
      <>
        {[[-58, earL], [58, earR]].map(([x, rot], i) => (
          <g key={i} transform={`translate(${x},-50) rotate(${rot})`}>
            <circle r={28} fill={fill} stroke={line} strokeWidth={5} />
            <circle r={14} fill={inner} />
          </g>
        ))}
      </>
    );
  }
  const big = species === "fox";
  const h = big ? 78 : 58, w = big ? 34 : 30;
  return (
    <>
      {[[-46, -1, earL], [46, 1, earR]].map(([x, side, rot], i) => (
        <g key={i} transform={`translate(${x},-44) rotate(${side * 14 + rot})`}>
          <path d={`M ${-w} 8 Q ${-w * 0.4} ${-h * 0.6} 0 ${-h} Q ${w * 0.4} ${-h * 0.6} ${w} 8 Z`} fill={fill} stroke={line} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M ${-w * 0.5} 0 Q ${-w * 0.2} ${-h * 0.5} 0 ${-h * 0.72} Q ${w * 0.2} ${-h * 0.5} ${w * 0.5} 0 Z`} fill={inner} />
        </g>
      ))}
    </>
  );
};

const Tail: React.FC<{ species: Species; fill: string; tip: string; line: string; wag: number }> = ({ species, fill, tip, line, wag }) => {
  if (species === "fox") {
    return (
      <g transform={`translate(-46,-96) rotate(${-10 + wag})`}>
        <path d="M 0 0 C -60 10 -120 -20 -130 -90 C -100 -70 -60 -70 -30 -40 C -20 -30 -6 -14 0 0 Z" fill={fill} stroke={line} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -130 -90 C -112 -76 -98 -72 -84 -70 C -96 -88 -112 -96 -130 -90 Z" fill={tip} />
      </g>
    );
  }
  if (species === "cat") {
    return <path d={`M -50 -90 C -110 -100 -${120 + wag} -170 -${80 + wag} -200`} fill="none" stroke={line} strokeWidth={22} strokeLinecap="round" />;
  }
  if (species === "hedgehog") return null;
  return <circle cx={-62 - wag * 0.2} cy={-96} r={species === "bunny" ? 24 : 16} fill={tip} stroke={line} strokeWidth={5} />;
};

/**
 * A storybook animal built from SVG shapes, about 330 px tall at scale 1 (bunny ears add ~90 px).
 * Origin = between the feet on the ground. Animate only through `pose`, computed from the frame.
 */
export const Critter: React.FC<{ id: string; species: Species; look: Look; x: number; y: number; scale?: number; facing?: 1 | -1; pose?: Pose }> = ({
  id, species, look, x, y, scale = 1, facing = 1, pose = {},
}) => {
  const {
    armL = 8, armR = -8, legL = 0, legR = 0, tilt = 0, headTilt = 0, lookX = 0, lookY = 0,
    blink = 0, mouth = 0, smile = 0.6, brow = 0, sx = 1, sy = 1, bob = 0, tail = 0, earL = 0, earR = 0, reachL = 0, reachR = 0,
  } = pose;
  const armLen = (r: number) => 64 + r * 110;
  const upL = Math.abs(armL) > 110, upR = Math.abs(armR) > 110;
  const line = shade(look.fur, -0.5);
  const furShade = shade(look.fur, -0.18);
  const inner = look.blush ?? "#f4a3a8";
  const eye = look.eye ?? "#2b1b14";
  const lift = Math.min(1, Math.max(0, -bob / 120));
  return (
    <g transform={`translate(${x},${y}) scale(${scale * facing},${scale})`}>
      <defs>
        <radialGradient id={`${id}-fur`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor={shade(look.fur, 0.28)} />
          <stop offset="0.55" stopColor={look.fur} />
          <stop offset="1" stopColor={shade(look.fur, -0.22)} />
        </radialGradient>
        <clipPath id={`${id}-eyeL`}><ellipse cx={-32} cy={-8} rx={22} ry={27} /></clipPath>
        <clipPath id={`${id}-eyeR`}><ellipse cx={32} cy={-8} rx={22} ry={27} /></clipPath>
      </defs>
      {/* contact shadow stays on the ground and shrinks as the body rises */}
      <ellipse cx={0} cy={2} rx={74 * (1 - lift * 0.4)} ry={13 * (1 - lift * 0.4)} fill="#000" opacity={0.22 * (1 - lift * 0.5)} />
      <g transform={`translate(0,${bob}) scale(${sx},${sy}) rotate(${tilt} 0 -120)`}>
        <Tail species={species} fill={`url(#${id}-fur)`} tip={look.belly} line={line} wag={tail} />
        <Limb x={-26} y={-62} angle={legL} len={60} w={30} fill={furShade} line={line} end="foot" />
        <Limb x={26} y={-62} angle={legR} len={60} w={30} fill={furShade} line={line} end="foot" />
        {species === "hedgehog" ? (
          <Spikes cx={0} cy={-128} rx={62} ry={70} from={-212} to={32} n={13} len={26} fill={shade(look.fur, -0.35)} line={line} tipFill={shade(look.fur, 0.2)} />
        ) : null}
        <ellipse cx={0} cy={-128} rx={66} ry={76} fill={`url(#${id}-fur)`} stroke={line} strokeWidth={5} />
        <ellipse cx={0} cy={-112} rx={40} ry={50} fill={look.belly} />
        {look.accent ? (
          <g>
            <rect x={-60} y={-176} width={120} height={24} rx={12} fill={look.accent} stroke={shade(look.accent, -0.45)} strokeWidth={4} />
            <path d="M 22 -158 L 42 -104 L 14 -110 Z" fill={look.accent} stroke={shade(look.accent, -0.45)} strokeWidth={4} strokeLinejoin="round" />
          </g>
        ) : null}
        {upL ? null : <Limb x={-58} y={-166} angle={armL} len={armLen(reachL)} w={26} fill={`url(#${id}-fur)`} line={line} end="hand" />}
        {upR ? null : <Limb x={58} y={-166} angle={armR} len={armLen(reachR)} w={26} fill={`url(#${id}-fur)`} line={line} end="hand" />}
        <g transform={`translate(0,-238) rotate(${headTilt})`}>
          {species === "hedgehog" ? (
            <Spikes cx={0} cy={-6} rx={80} ry={66} from={-198} to={18} n={14} len={30} fill={shade(look.fur, -0.35)} line={line} tipFill={shade(look.fur, 0.2)} />
          ) : null}
          <Ears species={species} fill={`url(#${id}-fur)`} inner={inner} line={line} earL={earL} earR={earR} />
          <ellipse cx={0} cy={0} rx={86} ry={74} fill={`url(#${id}-fur)`} stroke={line} strokeWidth={5} />
          {species === "hedgehog" ? (
            <path d="M -78 -10 Q -60 -52 -20 -44 Q 0 -30 20 -44 Q 60 -52 78 -10 Q 84 50 0 66 Q -84 50 -78 -10 Z" fill={look.belly} />
          ) : species === "fox" ? (
            <path d="M -84 6 Q -50 60 0 58 Q 50 60 84 6 Q 50 30 0 26 Q -50 30 -84 6 Z" fill={look.belly} />
          ) : (
            <ellipse cx={0} cy={30} rx={42} ry={28} fill={look.belly} />
          )}
          {[-1, 1].map((s) => (
            <g key={s}>
              <ellipse cx={s * 32} cy={-8} rx={22} ry={27} fill="#fff" stroke={line} strokeWidth={3} />
              <g clipPath={`url(#${id}-eye${s < 0 ? "L" : "R"})`}>
                <circle cx={s * 32 + lookX * 8} cy={-4 + lookY * 9} r={15} fill={eye} />
                <circle cx={s * 32 + lookX * 8} cy={-4 + lookY * 9} r={8} fill={shade(eye, -0.5)} />
                <circle cx={s * 32 + lookX * 8 + 6} cy={-11 + lookY * 9} r={5.5} fill="#fff" />
                <circle cx={s * 32 + lookX * 8 - 5} cy={3 + lookY * 9} r={2.5} fill="#fff" opacity={0.8} />
                <rect x={s * 32 - 26} y={-36} width={52} height={58 * blink} fill={species === "hedgehog" ? look.belly : look.fur} />
              </g>
              {blink > 0.85 ? (
                <g>
                  <ellipse cx={s * 32} cy={-8} rx={25} ry={30} fill={species === "hedgehog" ? look.belly : look.fur} />
                  <path d={`M ${s * 32 - 16} -4 Q ${s * 32} -20 ${s * 32 + 16} -4`} fill="none" stroke={line} strokeWidth={5.5} strokeLinecap="round" />
                </g>
              ) : null}
              <path d={`M ${s * 32 - 15} ${-44 - brow * 8} Q ${s * 32} ${-52 - brow * 10} ${s * 32 + 15} ${-44 - brow * 8}`}
                fill="none" stroke={line} strokeWidth={5} strokeLinecap="round" />
              <circle cx={s * 60} cy={22} r={13} fill={inner} opacity={0.5} />
            </g>
          ))}
          <ellipse cx={0} cy={18} rx={12} ry={8.5} fill={shade(eye, -0.2)} />
          <ellipse cx={-3} cy={15} rx={4} ry={2.5} fill="#fff" opacity={0.6} />
          {mouth > 0.04 ? (
            <g>
              <ellipse cx={0} cy={36 + mouth * 6} rx={11 + mouth * 6} ry={4 + mouth * 13} fill="#5a1e24" stroke={line} strokeWidth={3} />
              <ellipse cx={0} cy={40 + mouth * 12} rx={7 + mouth * 3} ry={2 + mouth * 5} fill="#e36b7a" />
            </g>
          ) : (
            <path d={`M -16 32 Q 0 ${32 + smile * 14} 16 32`} fill="none" stroke={line} strokeWidth={4.5} strokeLinecap="round" />
          )}
          <path d="M -62 -40 Q -40 -66 -8 -70" fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={7} strokeLinecap="round" />
        </g>
        {upL ? <Limb x={-58} y={-166} angle={armL} len={armLen(reachL)} w={26} fill={`url(#${id}-fur)`} line={line} end="hand" /> : null}
        {upR ? <Limb x={58} y={-166} angle={armR} len={armLen(reachR)} w={26} fill={`url(#${id}-fur)`} line={line} end="hand" /> : null}
      </g>
    </g>
  );
};

/**
 * Where a character's hand is, in the same coordinates as its x/y (to make it hold a prop).
 * Uses the same arm geometry as the rig: shoulder (±58, -166), length 64 + 110 * reach.
 */
export const handPosition = (
  c: { x: number; y: number; scale?: number; facing?: 1 | -1; pose?: Pose },
  side: "L" | "R",
) => {
  const { scale = 1, facing = 1, pose = {} } = c;
  const { armL = 8, armR = -8, reachL = 0, reachR = 0, sx = 1, sy = 1, bob = 0, tilt = 0 } = pose;
  const a = ((side === "L" ? armL : armR) * Math.PI) / 180;
  const len = 64 + (side === "L" ? reachL : reachR) * 110 - 4;
  let hx = (side === "L" ? -58 : 58) - Math.sin(a) * len;
  let hy = -166 + Math.cos(a) * len;
  // body tilt around (0, -120)
  const tr = (tilt * Math.PI) / 180;
  const dx = hx, dy = hy + 120;
  hx = dx * Math.cos(tr) - dy * Math.sin(tr);
  hy = dx * Math.sin(tr) + dy * Math.cos(tr) - 120;
  return { x: c.x + hx * sx * scale * facing, y: c.y + (bob + hy * sy) * scale };
};
