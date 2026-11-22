import React from "react";
import { Critter, Pose, Species, Look, handPosition } from "../cast/Critter";
import { NOISETTE, PISTACHE } from "../cast/mascot";
import { Lantern } from "../world/Props";
import { arrive, prog, lerp } from "../lib/ease";
import { blink, breathe, squashAt, talk, walk } from "../lib/motion";
import type { Line } from "../lib/time";
import { GROUND } from "./types";

export type Act =
  | "idle" | "walk" | "wave" | "think" | "joy" | "sad" | "surprise" | "curious" | "point" | "holdUp"
  | "open" | "hug" | "sleep" | "yawn" | "brush" | "dig" | "laugh" | "scared" | "push" | "proud" | "lookUp" | "blow"
  | "dance" | "clap" | "crouch" | "pull" | "hideEyes" | "shy" | "water" | "lieDown";
export type Beat = { at: number; to: number; act: Act; speed?: number; look?: [number, number] };

export type Who = { name: string; species: Species; look: Look; scale: number };
export const NOI: Who = { name: "Noisette", species: NOISETTE.species, look: NOISETTE.look, scale: 1.35 };
export const PISTA: Who = { name: "Pistache", species: PISTACHE.species, look: PISTACHE.look, scale: 1.12 };
export const POMPON: Who = { name: "Pompon", species: "bunny", look: { fur: "#e8ded4", belly: "#ffffff", accent: "#ff8fb1" }, scale: 1.05 };
export const PIPO: Who = { name: "Pipo", species: "bear", look: { fur: "#9a6a48", belly: "#ecd0a8", accent: "#f2b134" }, scale: 1.15 };
export const LOU: Who = { name: "Lou", species: "fox", look: { fur: "#f08a4b", belly: "#fff3e2", accent: "#4f8ff0" }, scale: 1.15 };
export const MISTI: Who = { name: "Mistigri", species: "cat", look: { fur: "#6c6f86", belly: "#eceaf2", accent: "#e85a8a", eye: "#2f6b3a" }, scale: 1.05 };

/** Pose for one act at local time lt (seconds into the beat). */
const actPose = (act: Act, lt: number, t: number, speed = 2.2): Pose => {
  switch (act) {
    case "walk": return { ...walk(t, speed), smile: 0.8 };
    case "wave": return { armL: 136 + Math.sin(lt * 10) * 13, reachL: 0.55, smile: 0.95, headTilt: 4, brow: 0.3 };
    case "think": return { armL: -132, headTilt: -10, lookY: -0.6, brow: 0.5, smile: 0.5 };
    case "joy": return { armL: 150, armR: -150, reachL: 0.5, reachR: 0.5, smile: 1, brow: 0.3, bob: -Math.abs(Math.sin(lt * 6)) * 28 };
    case "sad": return { brow: -0.8, smile: 0, headTilt: 10, lookY: 0.6, armL: 4, armR: -4 };
    case "surprise": return { brow: 1, mouth: 0.6, armL: 120, armR: -120, reachL: 0.2, reachR: 0.2 };
    case "curious": return { headTilt: -12, brow: 0.5, smile: 0.6 };
    case "point": return { armR: -95, reachR: 0.55, brow: 0.4, smile: 0.8 };
    case "holdUp": return { armL: 172, armR: -172, reachL: 1, reachR: 1, lookY: -0.9, smile: 1, brow: 0.4 };
    case "open": return { armL: 70, armR: -70, reachL: 0.35, reachR: 0.35, smile: 0.9, brow: 0.45 };
    case "hug": return { armL: -40, armR: 40, reachL: 0.3, reachR: 0.3, blink: 1, smile: 1, headTilt: 6 };
    case "sleep": return { blink: 1, headTilt: 12, smile: 0.4, armL: -20, armR: 20, sy: 1 + Math.sin(t * 1.6) * 0.02 };
    case "yawn": return { armL: 160, armR: -160, reachL: 0.6, reachR: 0.6, blink: 0.9, mouth: 0.9 };
    case "brush": return { armR: 124 + Math.sin(lt * 14) * 8, smile: 0.6, mouth: 0.2, brow: 0.2 };
    case "dig": return { armL: -28 + Math.sin(lt * 12) * 20, armR: 28 - Math.sin(lt * 12) * 20, tilt: 10, lookY: 0.8, smile: 0.7 };
    case "laugh": return { blink: 1, mouth: 0.7, sy: 1 + Math.sin(lt * 18) * 0.03, armL: 40, armR: -40, headTilt: 6 };
    case "scared": return { brow: -0.6, mouth: 0.25, armL: -50, armR: 50, reachL: 0.2, reachR: 0.2, sx: 1 + Math.sin(t * 40) * 0.01, headTilt: -4 };
    case "push": return { armL: 80, armR: -80, reachL: 0.6, reachR: 0.6, tilt: 8, brow: -0.2, smile: 0.4 };
    case "proud": return { blink: 1, smile: 1, headTilt: -6, armL: -30, armR: 30 };
    case "lookUp": return { lookY: -0.9, headTilt: -8, smile: 0.7, brow: 0.4 };
    case "blow": return { mouth: 0.35, brow: 0.2, headTilt: -4 };
    case "dance": { const b = Math.sin(lt * 7); return { armL: 90 + b * 60, armR: -90 + b * 60, reachL: 0.4, reachR: 0.4, tilt: b * 8, bob: -Math.abs(Math.sin(lt * 7)) * 30, smile: 1, legL: b * 14, legR: b * 14 }; }
    case "clap": { const c = Math.abs(Math.sin(lt * 9)); return { armL: -50 - c * 30, armR: 50 + c * 30, reachL: 0.2, reachR: 0.2, smile: 1, mouth: 0.3 }; }
    case "crouch": return { sy: 0.82, sx: 1.12, armL: -30, armR: 30, brow: 0.3, smile: 0.7, lookY: 0.2 };
    case "pull": return { armL: 75, armR: -75, reachL: 0.55, reachR: 0.55, tilt: -12, brow: -0.3, smile: 0.3, mouth: 0.25 };
    case "hideEyes": return { armL: -150, armR: 150, reachL: 0.05, reachR: 0.05, blink: 1, smile: 0.8, headTilt: 4 };
    case "shy": return { armL: -40, armR: 40, headTilt: 12, lookX: -0.6, lookY: 0.5, brow: 0.2, smile: 0.4, sy: 0.96 };
    case "water": return { armR: -70, reachR: 0.35, tilt: 6, lookY: 0.7, smile: 0.8 };
    case "lieDown": return { tilt: -80, lookY: -0.9, smile: 0.9, armL: 20, armR: -20 };
    default: return {};
  }
};

/**
 * A story character driven by beats. Position x comes from keys [time, x] (linear between keys);
 * facing from keys [time, 1|-1] (a step). Mouth follows caption lines whose speaker is this character.
 */
export const Actor: React.FC<{
  id: string; who: Who; t: number; x: [number, number][]; y?: number; facing?: [number, 1 | -1][];
  beats: Beat[]; lines: Line[]; lantern?: [number, number][]; scale?: number; extra?: (t: number) => Pose;
}> = ({ id, who, t, x, y = GROUND + 8, facing = [[0, 1]], beats, lines, lantern = [], scale, extra }) => {
  let px = x[0][1];
  for (let i = 0; i < x.length; i++) {
    if (t >= x[i][0]) px = i + 1 < x.length && t < x[i + 1][0] ? lerp(x[i][1], x[i + 1][1], prog(t, x[i][0], x[i + 1][0])) : x[i][1];
  }
  let face: 1 | -1 = facing[0][1];
  for (const [ft, f] of facing) if (t >= ft) face = f;
  const cur = beats.filter((b) => t >= b.at && t < b.to).pop();
  const prev = cur ? beats.filter((b) => b.to <= cur.at).pop() : undefined;
  const blendIn = cur ? arrive(prog(t, cur.at, cur.at + 0.3)) : 0;
  const pCur = cur ? actPose(cur.act, t - cur.at, t, cur.speed) : {};
  const pPrev = prev && t - prev.to < 0.3 ? actPose(prev.act, prev.to - prev.at, t) : {};
  const mix: Pose = {};
  const keysAll = new Set([...Object.keys(pCur), ...Object.keys(pPrev)]) as Set<keyof Pose>;
  keysAll.forEach((k) => {
    const a = (pPrev[k] ?? (k === "sx" || k === "sy" ? 1 : 0)) as number;
    const b = (pCur[k] ?? (k === "sx" || k === "sy" ? 1 : 0)) as number;
    mix[k] = lerp(a, b, blendIn);
  });
  const startSquash = cur && (cur.act === "surprise" || cur.act === "joy") ? squashAt(t, cur.at, 0.12) : { sx: 1, sy: 1 };
  const mouth = Math.max(0, ...lines.filter((l) => l.speaker === who.name).map((l, i) => talk(t, l.start, l.end, i + id.length)));
  const lk = cur?.look ?? [0, 0];
  const s = scale ?? who.scale;
  const pose: Pose = {
    blink: blink(t, id.length), smile: 0.75, lookX: lk[0], lookY: lk[1], armL: 8, armR: -8,
    ...mix,
    ...(extra ? extra(t) : {}),
  };
  if (mouth > 0 && (pose.mouth ?? 0) < mouth) pose.mouth = mouth;
  pose.sx = (pose.sx ?? 1) * startSquash.sx;
  pose.sy = (pose.sy ?? 1) * startSquash.sy * (cur?.act === "walk" ? 1 : breathe(t, id.length));
  const hero = { x: px, y, scale: s, facing: face, pose };
  const holding = lantern.some(([a, b]) => t >= a && t < b);
  const hand = handPosition(hero, "R");
  const swing = cur?.act === "walk" ? Math.sin(t * (cur.speed ?? 2.2) * Math.PI) * 10 : Math.sin(t * 2.4) * 3;
  return (
    <g>
      <Critter id={id} species={who.species} look={who.look} {...hero} />
      {holding ? <Lantern id={`${id}-lantern`} t={t} x={hand.x} y={hand.y - 6} scale={s * 0.85} swing={swing} /> : null}
    </g>
  );
};

/** Head position (for thought bubbles, effects) of a character placed at x with a scale. */
export const headOf = (x: number, scale: number, y = GROUND + 8) => ({ x, y: y - 380 * scale });
