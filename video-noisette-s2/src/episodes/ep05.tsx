import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { ShapeCloud } from "../engine/props2";
import { Sparkles } from "../engine/fx";
import { arrive, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Allongés dans l'herbe, ils regardent les *nuages*.", start: 3.4, end: 7.0 },
  { id: "l2", text: "Ce nuage est tout *rond* !", start: 7.4, end: 10.6, speaker: "Noisette" },
  { id: "l3", text: "Et celui-là ? C'est un *coeur* !", start: 11.0, end: 14.4, speaker: "Pistache" },
  { id: "l4", text: "Un *poisson* ! Et là… une étoile !", start: 14.8, end: 19.4, speaker: "Noisette" },
  { id: "l5", text: "On en cherche d'autres *ensemble* ?", start: 19.8, end: 23.6, speaker: "Noisette" },
  { id: "l6", text: "Moi *aussi*, j'adore les nuages !", start: 24.0, end: 27.8, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];
const SHAPES: { shape: string; label: string; at: number; x: number; y: number }[] = [
  { shape: "round", label: "ROND", at: 7.6, x: 270, y: 300 },
  { shape: "heart", label: "COEUR", at: 11.2, x: 800, y: 300 },
  { shape: "fish", label: "POISSON", at: 15.0, x: 280, y: 560 },
  { shape: "star", label: "ÉTOILE", at: 17.4, x: 790, y: 570 },
];

export const ep05: Episode = {
  id: "ep05", season: 2, number: 5, title: "Les nuages rigolos", duration: 36, endAt: 28.6, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "meadow", zoom: [[0, 1], [36, 1.02]],
    world: (t) => (
      <g>
        {SHAPES.map((s) => {
          const k = arrive(prog(t, s.at - 0.6, s.at + 0.6));
          return t > 3 ? <ShapeCloud key={s.shape} shape={s.shape} x={s.x} y={s.y} s={0.95} k={k} t={t} /> : null;
        })}
        {SHAPES.map((s) => <PopWord key={s.label} t={t} at={s.at + 0.5} dur={1.6} x={s.x} y={s.y - 140} text={s.label} size={70} color="#4dabf7" />)}
        <Sparkles t={t} at={11.8} x={790} y={360} n={12} color="#ff8fb1" />
        <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 760]]} facing={[[0, -1]]}
          beats={[
            { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 11.0, act: "lookUp", look: [0, -0.9] }, { at: 11.0, to: 14.8, act: "point", look: [0, -0.9] },
            { at: 14.8, to: 24.0, act: "lookUp", look: [-0.4, -0.9] }, { at: 24.0, to: 28.6, act: "joy" }, { at: 28.6, to: 36, act: "wave" },
          ]} />
        <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 320]]} facing={[[0, 1]]}
          beats={[
            { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "lookUp", look: [0, -0.9] }, { at: 7.4, to: 11.0, act: "point", look: [-0.2, -0.9] },
            { at: 11.0, to: 14.8, act: "lookUp", look: [0.6, -0.9] }, { at: 14.8, to: 19.8, act: "point", look: [0.2, -0.6] },
            { at: 19.8, to: 24.0, act: "open" }, { at: 24.0, to: 28.6, act: "laugh" }, { at: 28.6, to: 36, act: "wave" },
          ]} />
      </g>
    ),
  }],
};
