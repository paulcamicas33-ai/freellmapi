import React from "react";
import { Camera, Layer } from "../world/Camera";
import { Hill } from "../world/Hills";
import { Bush, Flower, Star } from "../world/Props";
import { Critter } from "../cast/Critter";
import { LOU, NIGHT } from "../cast/cast";
import { blink, breathe, squashAt, sway, walk } from "../lib/motion";
import { keys, pop, prog } from "../lib/ease";
import { NightLand } from "./NightLand";

/** s2: the star falls into a bush; Lou jumps with surprise and walks over. */
export const Scene2Fall: React.FC<{ t: number; W: number; H: number }> = ({ t, W, H }) => {
  const ground = H * 0.73;
  const bushX = W * 0.72;
  // fall 4.0 -> 5.0 along an arc into the bush
  const f = prog(t, 4.0, 5.0);
  const starX = W * 0.55 + f * (bushX - W * 0.55), starY = -80 + f * f * (ground - 40 + 80);
  const impact = squashAt(t, 5.0, 0.25, 0.4);
  const ring = prog(t, 5.0, 5.6);
  // Lou: surprise at 5.1, walk 6.0 -> 8.4
  const sur = squashAt(t, 5.1, 0.18, 0.35);
  const walking = t > 6.0 && t < 8.4;
  const w = walk(t, 1.8);
  const louX = keys(t, [[6.0, W * 0.24], [8.4, W * 0.24 + 1.8 * 55 * LOU.scale * 2.4]], (x) => x);
  const surprised = t > 5.05 && t < 6.0;
  const glow = 0.6 + 0.4 * Math.sin(t * 5);
  return (
    <Camera cam={{ x: keys(t, [[4, 0], [10, 140]]), y: 0, zoom: 1.02 }}>
      <NightLand id="s2" t={t} W={W} H={H} ground={ground} trees={[0.08, 0.5]} />
      <Layer depth={1} width={W} height={H}>
        <Hill id="s2-near" width={W} height={H} base={ground} amp={12} freq={0.006} seed={3} color={NIGHT.near} rim="#8fb0c4" />
        {t >= 5.0 ? <circle cx={bushX} cy={ground - 50} r={90 + glow * 20} fill={NIGHT.star} opacity={0.18 * glow} /> : null}
        {t < 5.0 ? (
          <g>
            <line x1={starX - 120} y1={starY - 200} x2={starX} y2={starY} stroke="#fff3c4" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
            <Star x={starX} y={starY} r={30} color={NIGHT.star} glow={1} rot={t * 300} />
          </g>
        ) : null}
        <g transform={`translate(${bushX},${ground}) scale(${impact.sx},${impact.sy}) translate(${-bushX},${-ground})`}>
          <Bush x={bushX} y={ground} scale={1.3} color="#3b7a5c" />
        </g>
        {ring > 0 && ring < 1 ? (
          <circle cx={bushX} cy={ground - 60} r={40 + pop(ring) * 140} fill="none" stroke="#fff3c4" strokeWidth={8 * (1 - ring)} opacity={1 - ring} />
        ) : null}
        <Flower t={t} x={W * 0.4} y={ground + 20} color="#f27ba0" seed={2} />
        <Flower t={t} x={W * 0.47} y={ground + 30} color="#ffd166" seed={5} scale={0.8} />
        <Critter id="s2-lou" species={LOU.species} look={LOU.look} x={louX} y={ground + 6} scale={LOU.scale}
          pose={{
            ...(walking ? w : { armL: surprised ? -140 : 10, armR: surprised ? 140 : -10 }),
            sx: sur.sx, sy: sur.sy * breathe(t), blink: blink(t, 2),
            brow: surprised ? 1 : 0.2, mouth: surprised ? 0.6 : 0, lookX: 1, lookY: t < 5.0 ? -0.6 : 0.2,
            tail: sway(t, 2, walking ? 12 : 5, walking ? 1.8 : 0.8), headTilt: walking ? 0 : -6,
          }} />
      </Layer>
    </Camera>
  );
};
