import React from "react";
import { AbsoluteFill } from "remotion";
import { useTime, L, inScene } from "../lib/time";
import { cam, prog } from "../lib/ease";
import { Grain } from "../world/Grain";
import { Atmosphere } from "../world/Atmosphere";
import { Bush } from "../world/Props";
import { Caption } from "../ui/Caption";
import { Sound } from "../sound/Sound";
import { NIGHT } from "../cast/cast";
import { Scene1Title } from "./Scene1Title";
import { Scene2Fall } from "./Scene2Fall";
import { Scene3Meet } from "./Scene3Meet";
import { Scene4Return } from "./Scene4Return";

const bell = (t: number, c: number, w: number) => Math.exp(-Math.pow((t - c) / w, 2));

export const Film: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const { frame, t } = useTime();
  const W = portrait ? 1080 : 1920, H = portrait ? 1920 : 1080;
  const wipe = cam(prog(t, 9.4, 10.6)); // foreground bush passing the camera, centred at the 10.0 cut
  const flash = bell(t, 16.5, 0.22); // the star's glow fills the frame at the 16.5 cut
  return (
    <AbsoluteFill style={{ background: NIGHT.top }}>
      {inScene(frame, "s1") ? <Scene1Title t={t} W={W} H={H} /> : null}
      {inScene(frame, "s2") ? <Scene2Fall t={t} W={W} H={H} /> : null}
      {inScene(frame, "s3") ? <Scene3Meet t={t} W={W} H={H} /> : null}
      {inScene(frame, "s4") ? <Scene4Return t={t} W={W} H={H} /> : null}
      <Atmosphere t={t} width={W} height={H} source={{ x: W * 0.8, y: H * 0.2 }} color={NIGHT.atmo} rays={0.09} haze={0.16} />
      {wipe > 0 && wipe < 1 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <Bush x={W / 2 + (0.5 - wipe) * 2 * (W / 2 + 1300)} y={H + 100} scale={14} color="#13281f" />
        </svg>
      ) : null}
      {flash > 0.01 ? (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 60%, rgba(255,246,200,${flash}) 0%, rgba(255,209,102,${flash * 0.9}) 45%, rgba(60,63,120,${flash * 0.85}) 100%)` }} />
      ) : null}
      {["l1", "l2", "l3"].map((id) => (
        <Caption key={id} t={t} line={L(id)} width={W} height={H} portrait={portrait} accent="#e8743b" />
      ))}
      <Grain frame={frame} width={W} height={H} strength={0.08} />
      <Sound />
    </AbsoluteFill>
  );
};
