import React from "react";
import { AbsoluteFill } from "remotion";
import timeline from "../data/timeline.json";
import { useTime, L, inScene } from "../lib/time";
import { keys, prog, arrive, pop } from "../lib/ease";
import { blink, breathe, squashAt, sway, talk, walk } from "../lib/motion";
import { Camera, Layer } from "../world/Camera";
import { Sky } from "../world/Sky";
import { Hill } from "../world/Hills";
import { Tree, Bush, Flower, Lantern } from "../world/Props";
import { Atmosphere } from "../world/Atmosphere";
import { Grain } from "../world/Grain";
import { ThoughtBubble, IdeaIcon } from "../world/ThoughtBubble";
import { Critter, Pose, handPosition } from "../cast/Critter";
import { NOISETTE } from "../cast/mascot";
import { Caption } from "../ui/Caption";
import { Sound } from "../sound/Sound";
import { FONT } from "../fonts";

type Idea = { id: string; label: string; at: number };
const IDEAS = (timeline as unknown as { ideas: Idea[] }).ideas;
const LINES = ["l1", "l2", "l3", "l4", "l5", "l6"];

/** Channel episode 0 (9:16): Noisette arrives, says hello, imagines adventures, asks for ideas in the comments. */
export const Film: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const { frame, t } = useTime();
  const W = portrait ? 1080 : 1920, H = portrait ? 1920 : 1080;
  const ground = portrait ? H * 0.57 : H * 0.76;
  const scale = portrait ? 1.35 : 1.1;
  const speed = 2.4, walkEnd = 3.0;
  const xEnd = portrait ? W * 0.5 : W * 0.42;
  const x = xEnd - speed * 55 * scale * Math.max(0, walkEnd - t);
  const walking = t < walkEnd;
  const w = walk(t, speed);
  const stop = squashAt(t, walkEnd, 0.08);
  const mouth = Math.max(...LINES.map((id, i) => talk(t, L(id).start, L(id).end, i + 1)));
  const headY = ground - 380 * scale; // about the middle of her head

  // reactions: a small happy bounce when each idea pops
  const bounce = IDEAS.reduce((acc, idea) => {
    const s = squashAt(t, idea.at + 0.1, 0.1);
    return { sx: acc.sx * s.sx, sy: acc.sy * s.sy };
  }, { sx: 1, sy: 1 });

  let pose: Pose;
  if (walking) {
    pose = { ...w, armR: -18 + w.armR * 0.3, blink: blink(t, 1), smile: 0.8, lookX: 0.4 };
  } else if (t < 8.1) {
    // hello wave
    const waveK = arrive(prog(t, 3.2, 3.5)) * (1 - prog(t, 7.6, 8.0));
    const wave = Math.sin((t - 3.2) * 10) * 22 * waveK;
    pose = { armL: 8 + waveK * 128 + wave * 0.6, reachL: waveK * 0.55, armR: -22, headTilt: 4 * waveK, lookX: 0.2, brow: 0.3, smile: 0.9 };
  } else if (t < 16.2) {
    // thinking: paw on the chin, eyes on the bubbles
    const th = arrive(prog(t, 8.1, 8.6));
    const look = keys(t, [[8.3, 0.4], [12.6, 0.4], [12.9, -0.9], [13.5, -0.9], [13.7, 0.9], [14.4, 0.9], [14.6, -0.9], [15.4, -0.9], [15.8, 0]]);
    const lookUp = keys(t, [[8.3, -0.7], [14.4, -0.7], [14.6, 0.1], [15.4, 0.1], [15.8, 0]]);
    pose = { armL: 8 - th * 140, reachL: 0, armR: -22, headTilt: -10 * th + look * 3, lookX: look, lookY: lookUp,
      brow: 0.5, smile: 0.7 + (t > 12.9 ? 0.3 : 0) };
  } else if (t < 20.8) {
    // the ask: open paw toward the viewer, lantern raised
    const k = arrive(prog(t, 16.2, 16.7));
    pose = { armL: 8 + k * 62, reachL: k * 0.35, armR: -22 - k * 88, reachR: k * 0.25, headTilt: -6 * k, lookX: 0, lookY: 0, brow: 0.45, smile: 0.9 };
  } else {
    // goodbye wave, then happy eyes
    const waveK = arrive(prog(t, 20.8, 21.2));
    const wave = Math.sin((t - 20.8) * 10) * 22 * waveK;
    pose = { armL: 8 + waveK * 128 + wave * 0.6, reachL: waveK * 0.55, armR: -22, headTilt: 4, lookX: 0, smile: 1 };
  }
  pose = {
    ...pose,
    blink: t > 24.8 ? 1 : blink(t, 1), mouth: walking ? 0 : mouth,
    sx: (pose.sx ?? 1) * stop.sx * bounce.sx, sy: (pose.sy ?? 1) * stop.sy * bounce.sy * (walking ? 1 : breathe(t)),
  };
  const hero = { x, y: ground + 8, scale, pose };
  const hand = handPosition(hero, "R");
  const swing = walking ? Math.sin(t * speed * Math.PI) * 10 : Math.sin(t * 2.5) * 3 * Math.exp(-(t - walkEnd) * 1.2);
  const sun = { x: W * 0.78, y: H * (portrait ? 0.24 : 0.3) };
  const spots = portrait
    ? [{ x: 250, y: 330 }, { x: 830, y: 330 }, { x: 225, y: 690 }, { x: 855, y: 690 }]
    : [{ x: 1150, y: 230 }, { x: 1550, y: 260 }, { x: 1250, y: 560 }, { x: 1650, y: 590 }];
  const endK = pop(prog(t, 20.7, 21.2));
  const endOut = 0; // the end card stays: the last frame is the poster
  return (
    <AbsoluteFill style={{ background: "#ffb877" }}>
      {inScene(frame, "hello") ? (
        <Camera cam={{ x: 0, y: keys(t, [[0, 0], [8, 0], [12, -30], [20.6, -30], [26, -10]]), zoom: keys(t, [[0, 1.0], [3.2, 1.0], [12, 1.06], [20.6, 1.06], [26, 1.03]]) }}>
          <Layer depth={0} width={W} height={H}>
            <Sky id="ep" t={t} width={W} height={H} top="#ff9e6b" bottom="#ffe2b3" light={{ x: sun.x, y: sun.y, r: 80, color: "#fff4cf" }} clouds={4} cloudColor="#ffe9d2" />
          </Layer>
          <Layer depth={0.25} width={W} height={H} blur={2}>
            <Hill id="ep-far" width={W} height={H} base={ground - 210} amp={60} freq={0.0035} seed={2} color="#c98b6b" />
          </Layer>
          <Layer depth={0.6} width={W} height={H} blur={0.6}>
            <Hill id="ep-mid" width={W} height={H} base={ground - 80} amp={40} freq={0.005} seed={6} color="#a9a85f" />
            <Tree id="ep-t1" t={t} x={W * 0.06} y={ground - 70} leaf="#7aa34f" scale={0.9} />
            <Tree id="ep-t2" t={t} x={W * 0.94} y={ground - 60} leaf="#6f9a4f" scale={0.8} seed={3} />
            <Bush x={W * 0.75} y={ground - 60} scale={0.8} color="#6f9a4f" />
          </Layer>
          <Layer depth={1} width={W} height={H}>
            <Hill id="ep-near" width={W} height={H} base={ground + 10} amp={10} freq={0.006} seed={9} color="#6f9a4f" rim="#c9e08a" />
            <Flower t={t} x={W * 0.12} y={ground + 40} color="#f27ba0" seed={1} />
            <Flower t={t} x={W * 0.8} y={ground + 50} color="#ffd166" seed={4} />
            <Flower t={t} x={W * 0.88} y={ground + 36} color="#a98bf2" seed={7} scale={0.85} />
            <Critter id="noisette" species={NOISETTE.species} look={NOISETTE.look} {...hero} />
            <Lantern id="ep-lantern" t={t} x={hand.x} y={hand.y - 6} scale={scale * 0.85} swing={swing} />
            {IDEAS.map((idea, i) => (
              <ThoughtBubble key={idea.id} t={t} x={spots[i].x} y={spots[i].y} r={portrait ? 128 : 120}
                from={{ x: x + (spots[i].x < x ? -60 : 60), y: headY - 60 }} at={idea.at} out={20.3 + i * 0.06} label={idea.label}
                color={idea.id === "yours" ? "#effbe9" : "#fffaf0"}>
                <IdeaIcon kind={idea.id} t={t} />
              </ThoughtBubble>
            ))}
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
        </Camera>
      ) : null}
      {endK > 0 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: portrait ? 150 : 70, textAlign: "center",
            transform: `translateY(${(1 - endK) * -60}px) scale(${0.85 + endK * 0.15})`, opacity: Math.min(1, endK * 1.5) * (1 - endOut),
            fontFamily: FONT.title, fontWeight: 900, fontSize: portrait ? 96 : 80, lineHeight: 1.05, color: "#4a2a17", letterSpacing: "-0.03em",
            textShadow: "0 5px 0 #fff3df, 0 14px 30px rgba(255,240,215,0.9)" }}>
            Écris ton idée<br />en <span style={{ fontFamily: FONT.accent, fontStyle: "italic", fontWeight: 400, fontSize: "1.12em", color: "#2f8a4c" }}>commentaire</span> !
          </div>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(${W / 2 + (portrait ? 250 : 380)},${portrait ? 520 : 300}) scale(${endK * (1 - endOut)})`}>
              <rect x={-120} y={-70} width={240} height={130} rx={36} fill="#fffaf0" stroke="#3f9a5c" strokeWidth={8} />
              <path d="M -50 56 L -80 104 L -6 58 Z" fill="#fffaf0" stroke="#3f9a5c" strokeWidth={8} strokeLinejoin="round" />
              <rect x={-60} y={52} width={66} height={12} fill="#fffaf0" />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={-50 + i * 50} cy={-6 - Math.max(0, Math.sin(t * 6 - i * 0.9)) * 12} r={16} fill="#3f9a5c" />
              ))}
            </g>
          </svg>
        </AbsoluteFill>
      ) : null}
      {LINES.map((id) => (
        <Caption key={id} t={t} line={L(id)} width={W} height={H} portrait={portrait} accent="#3f9a5c" />
      ))}
      <Grain frame={frame} width={W} height={H} strength={0.07} />
      <Sound />
    </AbsoluteFill>
  );
};
