import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera, Layer } from "../world/Camera";
import { Atmosphere } from "../world/Atmosphere";
import { Grain } from "../world/Grain";
import { Caption } from "../ui/Caption";
import { keys, pop, prog, exit } from "../lib/ease";
import { FONT } from "../fonts";
import { Backdrop, PALETTES } from "./places";
import { Iris } from "./fx";
import { W, H, Episode } from "./types";
import { EPISODES } from "../episodes";

const FPS = 30;

const ink = (dark: boolean) => dark
  ? { color: "#fff8ec", textShadow: "0 5px 0 #2b3466, 0 14px 30px rgba(10,15,40,0.8)", accent: "#9be3a8" }
  : { color: "#4a2a17", textShadow: "0 5px 0 #fff3df, 0 14px 30px rgba(255,240,215,0.9)", accent: "#2f8a4c" };

const TitleCard: React.FC<{ t: number; ep: Episode; dark: boolean }> = ({ t, ep, dark }) => {
  const k = pop(prog(t, 0.15, 0.6));
  const out = exit(prog(t, 3.0, 3.4));
  if (k <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", opacity: 1 - out,
      transform: `translateY(${(1 - k) * -50 - out * 40}px) scale(${0.85 + k * 0.15})` }}>
      <div style={{ display: "inline-block", padding: "8px 26px", borderRadius: 40, background: "#4fb36c", color: "#fff",
        fontFamily: FONT.title, fontWeight: 900, fontSize: 40, letterSpacing: "0.04em", boxShadow: "0 6px 0 #2f7d47" }}>
        {ep.season ? `SAISON ${ep.season} · ` : ""}ÉPISODE {ep.number}
      </div>
      <div style={{ marginTop: 18, fontFamily: FONT.title, fontWeight: 900, fontSize: 92, lineHeight: 1.04, color: ink(dark).color, letterSpacing: "-0.03em",
        textShadow: ink(dark).textShadow }}>{ep.title}</div>
    </div>
  );
};

/** The same end card as episode 0: ask for the next adventure in the comments. */
const EndCard: React.FC<{ t: number; at: number; dark: boolean }> = ({ t, at, dark }) => {
  const c = ink(dark);
  const k = pop(prog(t, at, at + 0.5));
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 130, textAlign: "center",
        transform: `translateY(${(1 - k) * -60}px) scale(${0.85 + k * 0.15})`, opacity: Math.min(1, k * 1.5) }}>
        <div style={{ fontFamily: FONT.story, fontWeight: 800, fontSize: 50, color: c.color, textShadow: c.textShadow }}>Quelle aventure ensuite ?</div>
        <div style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: c.color, letterSpacing: "-0.03em",
          textShadow: c.textShadow }}>
          Écris ton idée<br />en <span style={{ fontFamily: FONT.accent, fontStyle: "italic", fontWeight: 400, fontSize: "1.12em", color: c.accent }}>commentaire</span> !
        </div>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2 + 250},${560}) scale(${k})`}>
          <rect x={-120} y={-70} width={240} height={130} rx={36} fill="#fffaf0" stroke="#3f9a5c" strokeWidth={8} />
          <path d="M -50 56 L -80 104 L -6 58 Z" fill="#fffaf0" stroke="#3f9a5c" strokeWidth={8} strokeLinejoin="round" />
          <rect x={-60} y={52} width={66} height={12} fill="#fffaf0" />
          {[0, 1, 2].map((i) => <circle key={i} cx={-50 + i * 50} cy={-6 - Math.max(0, Math.sin(t * 6 - i * 0.9)) * 12} r={16} fill="#3f9a5c" />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const EpisodeFilm: React.FC<{ episode: string }> = ({ episode }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ep = EPISODES[episode];
  const scene = ep.scenes.find((s) => frame >= Math.round(s.start * FPS) && frame < Math.round(s.end * FPS)) ?? ep.scenes[ep.scenes.length - 1];
  const cuts = ep.scenes.slice(1).filter((s, i) => s.place !== ep.scenes[i].place || s.id.endsWith("!")).map((s) => s.start);
  const pal = PALETTES[scene.place];
  const isNight = scene.place === "night" || scene.place === "burrow-night";
  return (
    <AbsoluteFill style={{ background: pal.top }}>
      <Camera cam={{ x: scene.camX ? keys(t, scene.camX) : 0, y: scene.camY ? keys(t, scene.camY) : 0, zoom: scene.zoom ? keys(t, scene.zoom) : 1 }}>
        <Backdrop id={`${ep.id}-${scene.id}`} place={scene.place} t={t} />
        <Layer depth={1} width={W} height={H}>{scene.world(t)}</Layer>
        <Backdrop id={`${ep.id}-${scene.id}-f`} place={scene.place} t={t} front />
        {pal.light && !isNight && scene.place !== "rain" ? (
          <Atmosphere t={t} width={W} height={H} source={{ x: pal.light.x, y: pal.light.y }} color="#fff1c9" rays={scene.place === "sunset" ? 0.22 : 0.14} haze={0.2} />
        ) : null}
        {isNight ? <Atmosphere t={t} width={W} height={H} source={{ x: W * 0.78, y: H * 0.14 }} color="#cfd8ff" rays={0.06} haze={0.14} /> : null}
      </Camera>
      {scene.overlay ? scene.overlay(t) : null}
      <TitleCard t={t} ep={ep} dark={isNight} />
      <EndCard t={t} at={ep.endAt} dark={isNight} />
      {ep.lines.map((l) => <Caption key={l.id} t={t} line={l} width={W} height={H} portrait accent="#3f9a5c" />)}
      <Iris t={t} cuts={cuts} />
      <Grain frame={frame} width={W} height={H} strength={0.07} />
    </AbsoluteFill>
  );
};
