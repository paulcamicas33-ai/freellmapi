import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { MusicNote } from "../engine/props2";
import { Sparkles } from "../engine/fx";
import { rand } from "../lib/noise";

const lines = [
  { id: "l1", text: "La musique commence ! On *danse* ?", start: 3.4, end: 6.8, speaker: "Noisette" },
  { id: "l2", text: "On saute ! Saute avec *nous* !", start: 7.2, end: 10.8 },
  { id: "l3", text: "On tape des *mains* : clap, clap, clap !", start: 11.2, end: 14.8 },
  { id: "l4", text: "Je ne sais pas danser, moi… *Oups* !", start: 15.2, end: 18.8, speaker: "Pistache" },
  { id: "l5", text: "On danse *ensemble* ? Je te tiens la main !", start: 19.2, end: 23.0, speaker: "Noisette" },
  { id: "l6", text: "Moi *aussi* je danse ! C'est trop bien !", start: 23.4, end: 28.0, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];

export const ep07: Episode = {
  id: "ep07", season: 2, number: 7, title: "La grande danse", duration: 36, endAt: 28.6, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "sunset", zoom: [[0, 1], [7, 1.03], [36, 1.03]],
    world: (t) => {
      const fall = t >= 16.6 && t < 18.8;
      return (
        <g>
          {Array.from({ length: 10 }, (_, i) => {
            const k = (t * 0.25 + i / 10) % 1;
            const x = 120 + rand(91, i) * 840 + Math.sin(t * 2 + i) * 30;
            const y = 900 - k * 600;
            return t > 3 ? <g key={i} opacity={Math.sin(k * Math.PI)}><MusicNote x={x} y={y} s={0.9} color={["#9775fa", "#ff6b6b", "#4dabf7", "#ffa94d"][i % 4]} double={i % 3 === 0} /></g> : null;
          })}
          <PopWord t={t} at={7.4} x={540} y={GROUND - 760} text="SAUTE !" size={100} color="#ff6b6b" />
          {[11.6, 12.4, 13.2].map((c) => <PopWord key={c} t={t} at={c} x={c === 12.4 ? 760 : 320} y={GROUND - 640} text="CLAP !" size={80} color="#9775fa" />)}
          <PopWord t={t} at={16.6} x={820} y={GROUND - 520} text="OUPS !" size={90} color="#ff9f43" />
          <Sparkles t={t} at={23.5} x={540} y={GROUND - 400} n={20} spread={340} color="#ffd166" />
          <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 760], [19.2, 760], [20.4, 660]]} facing={[[0, -1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.2, act: "curious", look: [-1, 0] }, { at: 7.2, to: 11.2, act: "joy" },
              { at: 11.2, to: 15.2, act: "clap" }, { at: 15.2, to: 16.6, act: "dance" }, { at: 16.6, to: 19.2, act: "sad" },
              { at: 19.2, to: 23.4, act: "shy" }, { at: 23.4, to: 28.6, act: "dance" }, { at: 28.6, to: 36, act: "wave" },
            ]}
            extra={(tt) => (fall ? { tilt: -18 * Math.min(1, (tt - 16.6) / 0.3), sy: 0.9 } : {})} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 320], [19.2, 320], [20.4, 420]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.2, act: "dance" }, { at: 7.2, to: 11.2, act: "joy" },
              { at: 11.2, to: 15.2, act: "clap" }, { at: 15.2, to: 16.6, act: "dance" }, { at: 16.6, to: 19.2, act: "surprise" },
              { at: 19.2, to: 23.4, act: "open" }, { at: 23.4, to: 28.6, act: "dance" }, { at: 28.6, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
  }],
};
