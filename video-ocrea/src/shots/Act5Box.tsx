import React, { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { L } from "../lib/time";
import { arrive, cam, prog } from "../lib/ease";
import { makePath } from "../lib/camera";
import { Stage, Rig, KeyLights, Dust, Glow, C } from "../world/common";
import { Tube, swooshCurve } from "../world/brand";
import { woodTexture } from "../world/textures";

const BOX_X = 0.9;
const BW = 2.0, BH = 0.9, BD = 1.4, LH = 0.18;

// The swoosh laid flat on the lid top (lid-local coordinates, hinge at the back edge).
const lidCurve = new CatmullRomCurve3(
  swooshCurve.points.map((p) => new Vector3(p.x * 0.34, LH + 0.012, BD / 2 - p.y * 0.34 - 0.12)),
  false,
  "centripetal",
);

const path = makePath(
  [[3.4, 1.9, 5.6], [2.6, 1.55, 4.6], [2.0, 1.35, 3.9]],
  [[0.35, 0.55, 0], [0.3, 0.6, 0], [0.25, 0.7, 0]],
  [0.01, -0.01],
);

export const Act5Box: React.FC<{ t: number }> = ({ t }) => {
  const line = L("box");
  const bodyGeo = useMemo(() => new RoundedBoxGeometry(BW, BH, BD, 5, 0.05), []);
  const lidGeo = useMemo(() => new RoundedBoxGeometry(BW + 0.06, LH, BD + 0.06, 5, 0.05), []);
  const trailK = arrive(prog(t, 18.75, 20.2));
  const open = cam(prog(t, line.accent - 0.6, line.accent + 0.15));
  const spill = prog(t, line.accent - 0.25, line.accent + 0.4) + prog(t, 21.6, 22.6) * 2.5;
  const arriveK = 1 - arrive(prog(t, 18.6, 19.1)); // flare clearing into the shot
  return (
    <Stage fog={[5, 16]}>
      <Rig pose={path(t, 18.6, 22.6)} />
      <KeyLights power={2.2} fill={0.3} />
      <pointLight position={[BOX_X, 0.75, 0]} intensity={spill * 30} color={C.glow} distance={7} decay={2} />
      <pointLight position={[-2.5, 1.2, -2.5]} intensity={6} color={C.terracotta} distance={8} decay={2} />
      {/* varnished wood table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshPhysicalMaterial map={woodTexture()} roughness={0.32} clearcoat={1} clearcoatRoughness={0.12} metalness={0.05} />
      </mesh>
      <group position={[BOX_X, 0, 0]} rotation={[0, -0.32, 0]}>
        <mesh geometry={bodyGeo} position={[0, BH / 2, 0]}>
          <meshStandardMaterial color={"#5a2614"} roughness={0.5} metalness={0.15} />
        </mesh>
        {/* glowing interior, seen once the lid opens */}
        <mesh position={[0, BH - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[BW - 0.12, BD - 0.12]} />
          <meshBasicMaterial color={[1.0 + spill, 0.62 + spill * 0.5, 0.25 + spill * 0.2]} toneMapped={false} />
        </mesh>
        <group position={[0, BH, -BD / 2]} rotation={[-open * 1.75, 0, 0]}>
          <mesh geometry={lidGeo} position={[0, LH / 2, BD / 2]}>
            <meshStandardMaterial color={"#6a2e18"} roughness={0.45} metalness={0.15} />
          </mesh>
          <Tube curve={lidCurve} progress={trailK} radius={0.022} intensity={2.4} headSize={0.5} />
        </group>
        {spill > 0 ? (
          <>
            <Glow position={[0, BH + 0.4, 0]} size={2.4 + spill * 2.2} color={C.amber} opacity={Math.min(1, spill)} />
            <Glow position={[0, BH + 1.2, -0.2]} size={1.6 + spill * 3} color={C.glow} opacity={Math.min(0.8, spill * 0.6)} />
          </>
        ) : null}
      </group>
      {arriveK > 0 ? <Glow position={[BOX_X, 1.2, 0.4]} size={3 + arriveK * 5} color={C.amber} opacity={arriveK} /> : null}
      <Dust t={t} center={[0.8, 1.2, 1]} size={[7, 3.5, 6]} seed={21} />
    </Stage>
  );
};
