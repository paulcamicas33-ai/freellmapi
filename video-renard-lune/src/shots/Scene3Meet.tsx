import React from "react";
import { Camera, Layer } from "../world/Camera";
import { Hill } from "../world/Hills";
import { Flower, Star } from "../world/Props";
import { Critter } from "../cast/Critter";
import { LOU, NIGHT } from "../cast/cast";
import { blink, breathe, hop, squashAt, sway } from "../lib/motion";
import { arrive, keys, prog } from "../lib/ease";
import { NightLand } from "./NightLand";

/** s3: close on Lou and the sad star; Lou comforts it; the star smiles and hops. */
export const Scene3Meet: React.FC<{ t: number; W: number; H: number }> = ({ t, W, H }) => {
  const ground = H * 0.75;
  const happy = prog(t, 14.8, 15.2);
  const lean = arrive(prog(t, 10.6, 11.2));
  const reach = arrive(prog(t, 11.0, 12.0)) * (1 - prog(t, 14.6, 15.0));
  const starHop = hop(t, 15.0, 15.5, 60);
  const louHop = hop(t, 15.2, 15.75, 70);
  const joy = squashAt(t, 15.75, 0.12);
  const starGlow = 0.35 + happy * 0.65 + Math.sin(t * 4) * 0.08;
  const louX = W * 0.36, starX = W * 0.62;
  return (
    <Camera cam={{ x: keys(t, [[10, -20], [16.5, 40]]), y: 0, zoom: keys(t, [[10, 1.0], [16.5, 1.08]]) }}>
      <NightLand id="s3" t={t} W={W} H={H} ground={ground - 40} trees={[0.1, 0.9]} />
      <Layer depth={1} width={W} height={H}>
        <Hill id="s3-near" width={W} height={H} base={ground} amp={10} freq={0.006} seed={9} color={NIGHT.near} rim="#8fb0c4" />
        <circle cx={starX} cy={ground - 70 + starHop.y} r={160} fill={NIGHT.star} opacity={0.16 * starGlow} />
        <circle cx={starX} cy={ground - 70 + starHop.y} r={90} fill={NIGHT.star} opacity={0.2 * starGlow} />
        <g transform={`translate(${starX},${ground - 70 + starHop.y}) scale(${starHop.sx},${starHop.sy})`}>
          <Star x={0} y={0} r={84} color={NIGHT.star} glow={starGlow} rot={Math.sin(t * 2) * 4}
            face={{ blink: blink(t, 7), sad: 1 - happy, mouth: happy > 0.5 && t < 16 ? 0.5 : 0 }} />
        </g>
        <Critter id="s3-lou" species={LOU.species} look={LOU.look} x={louX} y={ground + 8 + louHop.y} scale={1.3}
          pose={{
            tilt: lean * 10 * (1 - happy), headTilt: 12 * (1 - happy) - happy * 4,
            armR: -10 - reach * 70 + happy * 160 * (t > 15.2 ? 1 : 0), armL: 10 - happy * 150 * (t > 15.2 ? 1 : 0),
            lookX: 1, lookY: 0.5 * (1 - happy), brow: -0.3 * (1 - happy) + happy * 0.6, smile: 0.3 + happy * 0.7,
            mouth: t > 15.2 && t < 16.2 ? 0.5 : 0, blink: blink(t, 3),
            sx: louHop.sx * joy.sx, sy: louHop.sy * joy.sy * breathe(t), tail: sway(t, 3, 6 + happy * 14, 0.8 + happy),
          }} />
        <Flower t={t} x={W * 0.12} y={ground + 40} color="#f27ba0" seed={1} scale={1.3} />
        <Flower t={t} x={W * 0.86} y={ground + 50} color="#a98bf2" seed={4} scale={1.2} />
      </Layer>
    </Camera>
  );
};
