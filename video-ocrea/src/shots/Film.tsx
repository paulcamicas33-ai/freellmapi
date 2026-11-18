import React from "react";
import { AbsoluteFill } from "remotion";
import { useTime, actFrames, L } from "../lib/time";
import { C } from "../world/common";
import { Act1Mark } from "./Act1Mark";
import { Act2Rise } from "./Act2Rise";
import { Act3Prompt } from "./Act3Prompt";
import { Act4Route } from "./Act4Route";
import { Act5Box } from "./Act5Box";
import { Act6Line } from "./Act6Line";
import { Act7Cta } from "./Act7Cta";
import { Transitions } from "./Transitions";
import { Post } from "./Post";
import { TypeLine } from "../type/TypeLine";
import { Sound } from "../sound/Sound";
import { prog } from "../lib/ease";

const inAct = (frame: number, id: string) => {
  const a = actFrames(id);
  return frame >= a.from && frame < a.to;
};

/** The whole film. One act (one WebGL canvas at most) is mounted at a time; cuts hide under light. */
export const Film: React.FC = () => {
  const { frame, t } = useTime();
  const rise = L("rise"), route = L("route"), box = L("box");
  const defocusIn = 1 - prog(t, 13.9, 14.5);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.brown} 0%, ${C.black} 75%)`, overflow: "hidden" }}>
      {inAct(frame, "a1") ? <Act1Mark t={t} /> : null}
      {inAct(frame, "a2") ? (
        <>
          <Act2Rise t={t} />
          <TypeLine t={t} start={rise.start} end={rise.end} accentT={rise.accent} size={118} x={110} y={250} maxWidth={860}
            words={[{ text: "Votre" }, { text: "prochain" }, { text: "film" }, { text: "tient" }, { text: "dans" }, { text: "la" }, { text: "main.", accent: true }]} />
        </>
      ) : null}
      {inAct(frame, "a3") ? <Act3Prompt t={t} /> : null}
      {inAct(frame, "a4") ? (
        <>
          <AbsoluteFill style={{ filter: defocusIn > 0.01 ? `blur(${defocusIn * 26}px)` : undefined }}>
            <Act4Route t={t} />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: "linear-gradient(100deg, rgba(7,5,4,0.85) 0%, rgba(7,5,4,0.55) 30%, rgba(7,5,4,0) 52%)" }} />
          <TypeLine t={t} start={route.start} end={route.end} accentT={route.accent} size={124} x={110} y={150} maxWidth={900}
            words={[{ text: "Chaque" }, { text: "plan" }, { text: "trouve" }, { text: "sa" }, { text: "place.", accent: true }]} />
        </>
      ) : null}
      {inAct(frame, "a5") ? (
        <>
          <Act5Box t={t} />
          <TypeLine t={t} start={box.start} end={box.end} accentT={box.accent} size={150} x={110} y={170} maxWidth={760}
            words={[{ text: "Prêt" }, { text: "à" }, { text: "ouvrir.", accent: true }]} />
        </>
      ) : null}
      {inAct(frame, "a6") ? <Act6Line t={t} /> : null}
      {inAct(frame, "a7") ? <Act7Cta t={t} /> : null}
      <Transitions t={t} />
      <Post frame={frame} />
      <Sound />
    </AbsoluteFill>
  );
};
