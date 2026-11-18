import React, { useMemo } from "react";
import { CatmullRomCurve3, Curve, ExtrudeGeometry, Path, Shape, TubeGeometry, Vector3 } from "three";
import { C, Glow } from "./common";

/** The Ocrea swoosh: one rising stroke, in a unit frame about 4.6 wide. */
export const swooshCurve = new CatmullRomCurve3(
  [
    new Vector3(-2.3, -0.55, 0.0),
    new Vector3(-1.4, -0.98, 0.12),
    new Vector3(-0.1, -0.95, 0.18),
    new Vector3(1.2, -0.62, 0.08),
    new Vector3(2.1, -0.05, -0.05),
    new Vector3(2.45, 0.35, -0.1),
  ],
  false,
  "centripetal",
);

const TUBULAR = 360;
const RADIAL = 12;

/** A thick emissive tube that draws itself from 0 to `progress` (E3 path reveal). */
export const Tube: React.FC<{
  curve: Curve<Vector3>;
  progress: number;
  radius: number;
  color?: string;
  intensity?: number;
  head?: boolean;
  headSize?: number;
}> = ({ curve, progress, radius, color = C.amber, intensity = 2.2, head = true, headSize = 1.1 }) => {
  const geo = useMemo(() => new TubeGeometry(curve, TUBULAR, radius, RADIAL, false), [curve, radius]);
  const p = Math.max(0, Math.min(1, progress));
  geo.setDrawRange(0, Math.floor(p * TUBULAR) * RADIAL * 6);
  const hp = curve.getPointAt(Math.max(0.0001, Math.min(0.9999, p)));
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} roughness={0.35} metalness={0.1} toneMapped={false} />
      </mesh>
      {head && p > 0 && p < 1 ? (
        <>
          <Glow position={[hp.x, hp.y, hp.z]} size={headSize} color={C.amber} opacity={0.95} />
          <Glow position={[hp.x, hp.y, hp.z]} size={headSize * 0.35} color={"#fff4e0"} opacity={1} />
        </>
      ) : null}
    </group>
  );
};

// ---- Wordmark OCREA: custom geometric letters, cap height 1 ----
const ring = (cx: number, cy: number, r: number, hole: boolean) => {
  const p = hole ? new Path() : new Shape();
  p.absarc(cx, cy, r, 0, Math.PI * 2, hole);
  return p;
};

const letterO = () => {
  const s = ring(0.5, 0.5, 0.5, false) as Shape;
  s.holes.push(ring(0.5, 0.5, 0.31, true) as Path);
  return { shape: s, w: 1.0 };
};
const letterC = () => {
  const a = 0.72;
  const s = new Shape();
  s.absarc(0.5, 0.5, 0.5, a, Math.PI * 2 - a, false);
  s.lineTo(0.5 + Math.cos(-a) * 0.31, 0.5 + Math.sin(-a) * 0.31);
  s.absarc(0.5, 0.5, 0.31, Math.PI * 2 - a, a, true);
  s.closePath();
  return { shape: s, w: 0.92 };
};
const letterR = () => {
  const s = new Shape();
  s.moveTo(0, 0);
  s.lineTo(0, 1);
  s.lineTo(0.36, 1);
  s.absarc(0.36, 0.73, 0.27, Math.PI / 2, -Math.PI / 2, true);
  s.lineTo(0.68, 0);
  s.lineTo(0.47, 0);
  s.lineTo(0.22, 0.46);
  s.lineTo(0.19, 0.46);
  s.lineTo(0.19, 0);
  s.closePath();
  const h = new Path();
  h.moveTo(0.19, 0.62);
  h.lineTo(0.36, 0.62);
  h.absarc(0.36, 0.73, 0.11, -Math.PI / 2, Math.PI / 2, false);
  h.lineTo(0.19, 0.84);
  h.closePath();
  s.holes.push(h);
  return { shape: s, w: 0.68 };
};
const letterE = () => {
  const s = new Shape();
  const pts: [number, number][] = [
    [0, 0], [0.6, 0], [0.6, 0.17], [0.19, 0.17], [0.19, 0.42], [0.53, 0.42], [0.53, 0.58],
    [0.19, 0.58], [0.19, 0.83], [0.6, 0.83], [0.6, 1], [0, 1],
  ];
  pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return { shape: s, w: 0.6 };
};
const letterA = () => {
  const s = new Shape();
  const pts: [number, number][] = [
    [0, 0], [0.2, 0], [0.27, 0.22], [0.59, 0.22], [0.66, 0], [0.86, 0], [0.52, 1], [0.34, 1],
  ];
  pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  const h = new Path();
  h.moveTo(0.32, 0.37);
  h.lineTo(0.54, 0.37);
  h.lineTo(0.43, 0.72);
  h.closePath();
  s.holes.push(h);
  return { shape: s, w: 0.86 };
};

const GAP = 0.13;
export const DEPTH = 0.28;

/** Letter geometries laid out and centred; x offsets in the same units (cap height 1). */
export const useWordmark = () =>
  useMemo(() => {
    const letters = [letterO(), letterC(), letterR(), letterE(), letterA()];
    const total = letters.reduce((a, l) => a + l.w, 0) + GAP * (letters.length - 1);
    let x = -total / 2;
    return letters.map((l) => {
      const geo = new ExtrudeGeometry(l.shape, {
        depth: DEPTH, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 48,
      });
      geo.translate(0, -0.5, -DEPTH / 2);
      const item = { geo, x, w: l.w };
      x += l.w + GAP;
      return item;
    });
  }, []);

export const LetterMaterial: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <meshStandardMaterial color={"#c9794a"} roughness={0.38} metalness={0.35} emissive={C.glow} emissiveIntensity={glow} />
);
