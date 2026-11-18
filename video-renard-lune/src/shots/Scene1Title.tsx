import React from "react";
import { Camera, Layer } from "../world/Camera";
import { Hill } from "../world/Hills";
import { Star } from "../world/Props";
import { Critter } from "../cast/Critter";
import { LOU, NIGHT } from "../cast/cast";
import { blink, breathe, sway } from "../lib/motion";
import { keys, prog } from "../lib/ease";
import { Title } from "../ui/Caption";
import { NightLand } from "./NightLand";

/** s1: Lou on the hill under the stars; title; a shooting star crosses at the end. */
export const Scene1Title: React.FC<{ t: number; W: number; H: number }> = ({ t, W, H }) => {
  const ground = H * 0.84;
  const k = prog(t, 2.9, 4.0);
  const sx = W * 0.15 + k * W * 0.9, sy = H * 0.12 + k * k * H * 0.7;
  return (
    <Camera cam={{ x: keys(t, [[0, -30], [4, 30]]), y: keys(t, [[0, 10], [4, 0]]), zoom: 1.04 }}>
      <NightLand id="s1" t={t} W={W} H={H} ground={ground} />
      <Layer depth={1} width={W} height={H}>
        <Hill id="s1-near" width={W} height={H} base={ground} amp={50} freq={0.004} seed={8} color={NIGHT.near} rim="#8fb0c4" />
        <Critter id="s1-lou" species={LOU.species} look={LOU.look} x={W * 0.3} y={ground - 46} scale={LOU.scale} facing={1}
          pose={{ sy: breathe(t), blink: blink(t, 1), lookY: -0.9, lookX: 0.5, headTilt: -10, smile: 0.7, tail: sway(t, 1, 6), armL: 10, armR: -10 }} />
        {k > 0 && k < 1 ? (
          <g>
            <line x1={sx - 260} y1={sy - 120 - k * 60} x2={sx} y2={sy} stroke="#fff3c4" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
            <Star x={sx} y={sy} r={22} color={NIGHT.star} glow={1} rot={t * 400} />
          </g>
        ) : null}
      </Layer>
      <Title t={t} text="Lou et l'étoile" start={0.4} end={3.6} x={W / 2} y={H * 0.16} size={150} accent="#4f8ff0" />
    </Camera>
  );
};
