import React from "react";
import { Layer } from "../world/Camera";
import { Sky } from "../world/Sky";
import { Hill } from "../world/Hills";
import { Tree, Bush } from "../world/Props";
import { NIGHT } from "../cast/cast";

/** Shared night backdrop: sky with moon and stars, far and mid hills with trees. */
export const NightLand: React.FC<{ id: string; t: number; W: number; H: number; ground: number; starBoost?: number; trees?: number[] }> = ({
  id, t, W, H, ground, starBoost = 1, trees = [0.12, 0.86],
}) => (
  <>
    <Layer depth={0} width={W} height={H}>
      <Sky id={`${id}-sky`} t={t} width={W} height={H} top={NIGHT.top} bottom={NIGHT.bottom}
        light={{ x: W * 0.8, y: H * 0.2, r: 58, color: NIGHT.moon, moon: true }} stars={70} starBoost={starBoost} clouds={3} cloudColor="#4a5390" />
    </Layer>
    <Layer depth={0.25} width={W} height={H} blur={2}>
      <Hill id={`${id}-far`} width={W} height={H} base={ground - 200} amp={70} freq={0.0035} seed={2} color={NIGHT.far} rim="#6c78b8" />
    </Layer>
    <Layer depth={0.6} width={W} height={H} blur={0.6}>
      <Hill id={`${id}-mid`} width={W} height={H} base={ground - 70} amp={45} freq={0.005} seed={5} color={NIGHT.mid} rim="#7fa3b8" />
      {trees.map((f, i) => (
        <Tree key={i} id={`${id}-tree${i}`} t={t} x={W * f} y={ground - 60} scale={0.85} leaf="#2f6b5e" seed={i * 3} />
      ))}
      <Bush x={W * 0.3} y={ground - 50} scale={0.8} color="#2a5a52" />
    </Layer>
  </>
);
