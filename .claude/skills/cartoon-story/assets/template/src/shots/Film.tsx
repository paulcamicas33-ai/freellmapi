import React from "react";
import { AbsoluteFill } from "remotion";
import { useTime, L, inScene } from "../lib/time";
import { keys } from "../lib/ease";
import { blink, breathe, talk, walk } from "../lib/motion";
import { Camera, Layer } from "../world/Camera";
import { Sky } from "../world/Sky";
import { Hill } from "../world/Hills";
import { Tree, Flower } from "../world/Props";
import { Grain } from "../world/Grain";
import { Critter } from "../cast/Critter";
import { Caption } from "../ui/Caption";
import { Sound } from "../sound/Sound";

/** Template demo: one scene. Replace with the project's scenes, one file per scene in src/shots/. */
export const Film: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const { frame, t } = useTime();
  const W = portrait ? 1080 : 1920, H = portrait ? 1920 : 1080;
  const ground = portrait ? 1350 : 900;
  const x = keys(t, [[0, W * 0.2], [4.5, W * 0.6]]);
  const w = walk(t);
  return (
    <AbsoluteFill style={{ background: "#ffd9a8" }}>
      {inScene(frame, "demo") ? (
        <Camera cam={{ x: (x - W / 2) * 0.5, y: 0, zoom: 1.05 }}>
          <Layer depth={0} width={W} height={H}>
            <Sky id="demo" t={t} width={W} height={H} top="#ffb877" bottom="#ffe7c2" light={{ x: W * 0.75, y: H * 0.25, r: 70, color: "#fff2c4" }} clouds={4} />
          </Layer>
          <Layer depth={0.3} width={W} height={H} blur={1.5}>
            <Hill id="far" width={W} height={H} base={ground - 180} amp={60} freq={0.004} seed={1} color="#c98b6b" />
          </Layer>
          <Layer depth={0.6} width={W} height={H}>
            <Hill id="mid" width={W} height={H} base={ground - 60} amp={40} freq={0.006} seed={4} color="#8fb36a" />
            <Tree id="t1" t={t} x={W * 0.15} y={ground - 40} leaf="#5f9e4f" />
          </Layer>
          <Layer depth={1} width={W} height={H}>
            <Hill id="near" width={W} height={H} base={ground + 20} amp={14} freq={0.008} seed={7} color="#6fa35a" />
            <Flower t={t} x={W * 0.45} y={ground + 30} color="#f27ba0" />
            <Critter id="hero" species="fox" look={{ fur: "#e8743b", belly: "#fff3e2", accent: "#3d7dd8" }} x={x} y={ground + 10}
              pose={{ ...w, sy: breathe(t), blink: blink(t, 1), mouth: talk(t, L("l1").start, L("l1").end, 1) }} />
          </Layer>
          <Caption t={t} line={L("l1")} width={W} height={H} portrait={portrait} />
        </Camera>
      ) : null}
      <Grain frame={frame} width={W} height={H} />
      <Sound />
    </AbsoluteFill>
  );
};
