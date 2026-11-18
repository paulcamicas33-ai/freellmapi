import React from "react";
import { L, F } from "../lib/time";
import { arrive, exit, prog } from "../lib/ease";
import { makePath } from "../lib/camera";
import { Stage, Rig, KeyLights, Dust, Glow, C } from "../world/common";
import { Tube, swooshCurve, useWordmark, LetterMaterial } from "../world/brand";

const path = makePath(
  [[0, 0.15, 9.2], [0.15, 0.3, 8.1], [0.35, 0.45, 7.1]],
  [[0, 0.1, 0], [0, 0.15, 0], [0.05, 0.2, 0]],
  [0, -0.018],
);

const SCALE = 0.78;

export const Act1Mark: React.FC<{ t: number }> = ({ t }) => {
  const line = L("mark");
  const letters = useWordmark();
  const pose = path(t, 0, 4.4);
  const drawK = arrive(prog(t, 0.3, 1.6));
  const sinkK = exit(prog(t, 3.55, 4.2));
  const flash = Math.exp(-Math.pow((t - line.accent) / 0.12, 2));
  return (
    <Stage fog={[6, 16]}>
      <Rig pose={pose} />
      <KeyLights power={2.4 + flash * 1.6} />
      <pointLight position={[2.6, -0.4, -1.4]} intensity={14 + flash * 30} color={C.glow} distance={9} decay={2} />
      <group scale={SCALE} position={[0, -sinkK * 1.4, 0]}>
        <Tube curve={swooshCurve} progress={drawK} radius={0.055} intensity={2.4 + flash * 2} headSize={1.0} />
        {letters.map((l, i) => {
          const land = line.accent - F((letters.length - 1 - i) * 4);
          const k = arrive(prog(t, land - F(40), land));
          const y = 0.62 + (1 - k) * -1.5;
          const z = (1 - k) * -1.6;
          const rx = (1 - k) * 0.5;
          return (
            <mesh key={i} geometry={l.geo} position={[l.x * 1.0, y, z]} rotation={[rx, 0, 0]}>
              <LetterMaterial glow={flash * 0.35 + 0.02} />
            </mesh>
          );
        })}
      </group>
      <Glow position={[0, 0.1, -3]} size={9} color={C.terracotta} opacity={0.22 + flash * 0.2} />
      <Dust t={t} center={[0, 0.3, 2]} size={[9, 5, 6]} />
    </Stage>
  );
};
