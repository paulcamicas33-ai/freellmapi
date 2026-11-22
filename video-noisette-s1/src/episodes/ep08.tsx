import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, POMPON } from "../engine/actor";
import { Pond, PopWord } from "../engine/props";
import { CountUp, Rain, Rainbow, Sparkles } from "../engine/fx";
import { prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Il pleut… Noisette ne peut pas *jouer* dehors.", start: 3.4, end: 7.0 },
  { id: "l2", text: "Et si on sautait dans les *flaques* ?", start: 7.4, end: 10.8, speaker: "Noisette" },
  { id: "l3", text: "Plouf ! Plouf ! Que c'est *rigolo* !", start: 11.2, end: 15.0 },
  { id: "l4", text: "La pluie s'arrête… regarde *là-haut* !", start: 16.4, end: 19.6, speaker: "Noisette" },
  { id: "l5", text: "Rouge, orange, jaune, vert, bleu, *violet* !", start: 20.0, end: 25.2, speaker: "Noisette" },
  { id: "l6", text: "Après la pluie… vient l'*arc-en-ciel* !", start: 26.4, end: 29.2 },
  { id: "l7", text: "À très *vite* !", start: 33.6, end: 35.9, speaker: "Noisette" },
];
const SPLASH = [11.6, 12.6, 13.6, 14.4];
const COLORS: [string, string][] = [["ROUGE", "#ff6b6b"], ["ORANGE", "#ffa94d"], ["JAUNE", "#ffd43b"], ["VERT", "#69db7c"], ["BLEU", "#4dabf7"], ["VIOLET", "#9775fa"]];

const cast = (t: number) => (
  <>
    <Actor id="pompon" who={POMPON} t={t} lines={lines} x={[[0, 1250], [10.8, 1250], [12.2, 860]]} facing={[[0, -1]]}
      beats={[
        { at: 10.8, to: 12.2, act: "walk", speed: 2.8 }, { at: 12.2, to: 15.6, act: "joy" },
        { at: 15.6, to: 20.0, act: "lookUp", look: [0, -0.9] }, { at: 20.0, to: 36, act: "joy" },
      ]} />
    <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 420]]} facing={[[0, 1]]}
      beats={[
        { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "sad", look: [0, -0.4] }, { at: 7.4, to: 9.2, act: "think" },
        { at: 9.2, to: 11.2, act: "curious", look: [1, 0.5] }, { at: 11.2, to: 15.6, act: "joy" },
        { at: 15.6, to: 20.0, act: "lookUp", look: [0.4, -0.9] }, { at: 20.0, to: 25.6, act: "point" },
        { at: 25.6, to: 29.6, act: "proud" }, { at: 29.6, to: 36, act: "wave" },
      ]} />
  </>
);

export const ep08: Episode = {
  id: "ep08", number: 8, title: "Le jour de pluie", duration: 36, endAt: 29.6, lines,
  scenes: [
    {
      id: "rain", start: 0, end: 16.0, place: "rain", zoom: [[0, 1], [16, 1.04]],
      world: (t) => (
        <g>
          <Pond x={430} y={GROUND + 120} rx={170} t={t} />
          <Pond x={860} y={GROUND + 200} rx={110} t={t} />
          {SPLASH.map((s) => <Sparkles key={s} t={t} at={s} x={430} y={GROUND + 60} n={12} color="#bfe8ff" spread={180} />)}
          {SPLASH.map((s, i) => <PopWord key={s} t={t} at={s} x={430 + (i % 2 ? 140 : -140)} y={GROUND - 420} text="PLOUF !" size={74} color="#3fa0d0" />)}
          {cast(t)}
          <Rain t={t} />
        </g>
      ),
    },
    {
      id: "sun", start: 16.0, end: 36, place: "meadow", zoom: [[16, 1.04], [36, 1.02]],
      world: (t) => (
        <g>
          <Rainbow k={prog(t, 16.6, 19.0)} cx={540} cy={GROUND - 160} r={480} />
          <Pond x={430} y={GROUND + 120} rx={170} t={t} />
          {cast(t)}
        </g>
      ),
      overlay: (t) => <CountUp t={t} items={COLORS.map(([w, c], i) => ({ at: 20.3 + i * 1.0, text: w, color: c, size: 150 }))} y={330} />,
    },
  ],
};
