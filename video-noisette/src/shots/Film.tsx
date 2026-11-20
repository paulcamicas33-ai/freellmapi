import React from "react";
import { AbsoluteFill } from "remotion";
import { useTime, L, inScene } from "../lib/time";
import { keys, prog, arrive } from "../lib/ease";
import { blink, breathe, squashAt, sway, talk, walk } from "../lib/motion";
import { Camera, Layer } from "../world/Camera";
import { Sky } from "../world/Sky";
import { Hill } from "../world/Hills";
import { Tree, Bush, Flower, Lantern } from "../world/Props";
import { Atmosphere } from "../world/Atmosphere";
import { Grain } from "../world/Grain";
import { Critter, Pose, handPosition } from "../cast/Critter";
import { NOISETTE } from "../cast/mascot";
import { Caption } from "../ui/Caption";
import { Sound } from "../sound/Sound";

/** Noisette's introduction: she walks in with her lantern at sunset, stops, waves and says hello. */
export const Film: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const { frame, t } = useTime();
  const W = portrait ? 1080 : 1920, H = portrait ? 1920 : 1080;
  const ground = portrait ? H * 0.57 : H * 0.76;
  const scale = portrait ? 1.35 : 1.1;
  const speed = 2.4, walkEnd = 3.0;
  const x0 = portrait ? W * 0.05 : W * 0.2;
  const x = x0 + speed * 55 * scale * Math.min(t, walkEnd);
  const walking = t < walkEnd;
  const w = walk(t, speed);
  const stop = squashAt(t, walkEnd, 0.08);
  const l1 = L("l1"), l2 = L("l2");
  const waveK = arrive(prog(t, 3.2, 3.5)) * (1 - prog(t, 5.6, 5.9));
  const wave = Math.sin((t - 3.2) * 10) * 22 * waveK;
  const ask = arrive(prog(t, 5.9, 6.3));
  const pose: Pose = walking
    ? { ...w, armR: -18 + w.armR * 0.3, blink: blink(t, 1), smile: 0.8, lookX: 0.4 }
    : {
        armL: 8 + waveK * 128 + wave * 0.6, reachL: waveK * 0.55, armR: -22,
        headTilt: -8 * ask + 4 * waveK, lookX: 0.6 - ask * 0.6, brow: 0.3 + ask * 0.4,
        blink: blink(t, 1), smile: 0.9, mouth: Math.max(talk(t, l1.start, l1.end, 1), talk(t, l2.start, l2.end, 2)),
        sx: stop.sx, sy: stop.sy * breathe(t),
      };
  const hero = { x, y: ground + 8, scale, pose };
  const hand = handPosition(hero, "R");
  const swingAngle = walking ? Math.sin(t * speed * Math.PI) * 10 : Math.sin(t * 2.5) * 3 * Math.exp(-(t - walkEnd) * 1.2);
  const sun = { x: W * 0.78, y: H * (portrait ? 0.28 : 0.3) };
  return (
    <AbsoluteFill style={{ background: "#ffb877" }}>
      {inScene(frame, "hello") ? (
        <Camera cam={{ x: keys(t, [[0, -60], [3, 40], [8.5, 70]]), y: 0, zoom: keys(t, [[0, 1.0], [3.2, 1.0], [8.5, 1.08]]) }}>
          <Layer depth={0} width={W} height={H}>
            <Sky id="hi" t={t} width={W} height={H} top="#ff9e6b" bottom="#ffe2b3" light={{ x: sun.x, y: sun.y, r: 80, color: "#fff4cf" }} clouds={4} cloudColor="#ffe9d2" />
          </Layer>
          <Layer depth={0.25} width={W} height={H} blur={2}>
            <Hill id="hi-far" width={W} height={H} base={ground - 210} amp={60} freq={0.0035} seed={2} color="#c98b6b" />
          </Layer>
          <Layer depth={0.6} width={W} height={H} blur={0.6}>
            <Hill id="hi-mid" width={W} height={H} base={ground - 80} amp={40} freq={0.005} seed={6} color="#a9a85f" />
            <Tree id="hi-t1" t={t} x={W * 0.08} y={ground - 70} leaf="#7aa34f" scale={0.9} />
            <Tree id="hi-t2" t={t} x={W * 0.9} y={ground - 60} leaf="#6f9a4f" scale={0.8} seed={3} />
            <Bush x={W * 0.62} y={ground - 60} scale={0.8} color="#6f9a4f" />
          </Layer>
          <Layer depth={1} width={W} height={H}>
            <Hill id="hi-near" width={W} height={H} base={ground + 10} amp={10} freq={0.006} seed={9} color="#6f9a4f" rim="#c9e08a" />
            <Flower t={t} x={W * 0.12} y={ground + 40} color="#f27ba0" seed={1} />
            <Flower t={t} x={W * 0.7} y={ground + 50} color="#ffd166" seed={4} />
            <Flower t={t} x={W * 0.76} y={ground + 36} color="#a98bf2" seed={7} scale={0.85} />
            <Critter id="noisette" species={NOISETTE.species} look={NOISETTE.look} {...hero} />
            <Lantern id="hi-lantern" t={t} x={hand.x} y={hand.y - 6} scale={scale * 0.85} swing={swingAngle} />
          </Layer>
          <Layer depth={1.4} width={W} height={H}>
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} transform={`translate(${i * W * 0.14 - 60},${H + 30}) rotate(${sway(t, i, 6, 0.7)})`}>
                <path d="M 0 0 Q -10 -80 6 -150 Q 12 -80 18 0 Z" fill="#4f7d3c" />
                <path d="M 20 0 Q 30 -60 50 -110 Q 36 -50 38 0 Z" fill="#5d8f45" />
              </g>
            ))}
          </Layer>
          <Atmosphere t={t} width={W} height={H} source={sun} color="#fff1c9" rays={0.22} haze={0.25} />
          {[l1, l2].map((l) => (
            <Caption key={l.id} t={t} line={l} width={W} height={H} portrait={portrait} accent="#3f9a5c" />
          ))}
        </Camera>
      ) : null}
      <Grain frame={frame} width={W} height={H} strength={0.07} />
      <Sound />
    </AbsoluteFill>
  );
};
