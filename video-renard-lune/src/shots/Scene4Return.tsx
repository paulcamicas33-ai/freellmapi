import React from "react";
import { Camera, Layer } from "../world/Camera";
import { Hill } from "../world/Hills";
import { Star } from "../world/Props";
import { Critter } from "../cast/Critter";
import { LOU, NIGHT } from "../cast/cast";
import { blink, breathe, hop, sway } from "../lib/motion";
import { cam, keys, pop, prog } from "../lib/ease";
import { NightLand } from "./NightLand";

/** s4: on the hilltop Lou lifts the star, jumps and throws it home; the sky lights up. */
export const Scene4Return: React.FC<{ t: number; W: number; H: number }> = ({ t, W, H }) => {
  const ground = H * 0.78;
  const louX = W * 0.42;
  const crouch = t > 18.4 && t < 18.7 ? Math.sin(prog(t, 18.4, 18.7) * Math.PI) : 0;
  const jump = hop(t, 18.7, 19.3, 70);
  const held = t < 18.9;
  const handY = ground - 330 * 1.15 + jump.y - 30;
  const fly = cam(prog(t, 18.9, 20.6));
  const home = { x: W * 0.72, y: H * 0.16 };
  const sx = held ? louX : louX + (home.x - louX) * fly;
  const sy = held ? handY : handY + (home.y - handY) * fly - Math.sin(fly * Math.PI) * 220;
  const arrived = prog(t, 20.6, 21.2);
  const burst = prog(t, 20.6, 21.4);
  const wave = t > 21.0 ? Math.sin((t - 21) * 9) * 25 : 0;
  const boost = 1 + pop(arrived) * 0.9;
  const camY = keys(t, [[16.5, 0], [18.9, 0], [20.8, -170], [24, -150]]);
  return (
    <Camera cam={{ x: keys(t, [[16.5, -20], [24, 30]]), y: camY, zoom: 1.03 }}>
      <NightLand id="s4" t={t} W={W} H={H} ground={ground} starBoost={boost} trees={[0.1, 0.92]} />
      <Layer depth={1} width={W} height={H}>
        <Hill id="s4-near" width={W} height={H} base={ground} amp={70} freq={0.0032} seed={11} color={NIGHT.near} rim="#8fb0c4" />
        <Critter id="s4-lou" species={LOU.species} look={LOU.look} x={louX} y={ground - 60 + jump.y} scale={1.15}
          pose={{
            armL: held ? -165 : t > 21 ? 10 : -120, armR: held ? 165 : t > 21 ? 150 + wave : 120,
            lookY: -0.9, lookX: t > 19 ? 0.6 : 0, headTilt: -8, smile: 1, brow: 0.5,
            mouth: t > 19.0 && t < 19.8 ? 0.6 : 0, blink: t > 22.3 ? 1 : blink(t, 4),
            sx: jump.sx, sy: jump.sy * (1 - crouch * 0.12) * breathe(t), tail: sway(t, 4, 10, 1.2),
          }} />
      </Layer>
      <Layer depth={0.15} width={W} height={H}>
        {burst > 0 && burst < 1 ? (
          <circle cx={home.x} cy={home.y} r={40 + pop(burst) * 260} fill="none" stroke="#fff3c4" strokeWidth={10 * (1 - burst)} opacity={1 - burst} />
        ) : null}
      </Layer>
      <Layer depth={held ? 1 : 1 - fly * 0.85} width={W} height={H}>
        {!held && fly < 1 ? (
          <line x1={sx} y1={sy} x2={sx - (home.x - louX) * 0.12} y2={sy + 160} stroke="#fff3c4" strokeWidth={10} strokeLinecap="round" opacity={0.45} />
        ) : null}
        <Star x={sx} y={sy} r={held ? 52 : 52 - fly * 22} color={NIGHT.star} glow={1} rot={held ? Math.sin(t * 3) * 6 : fly * 360}
          face={{ blink: blink(t, 9), mouth: t > 18.9 && t < 19.8 ? 0.6 : 0 }} />
      </Layer>
    </Camera>
  );
};
