import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { Sunflower, WateringCan } from "../engine/props2";
import { Sparkles } from "../engine/fx";
import { arrive, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Pistache a trouvé une toute petite *graine*.", start: 3.4, end: 7.0 },
  { id: "l2", text: "On va la *planter* ensemble !", start: 7.4, end: 11.0, speaker: "Noisette" },
  { id: "l3", text: "Un peu d'eau, un peu de *soleil*…", start: 11.4, end: 15.0 },
  { id: "l4", text: "Dis avec nous : pousse, pousse, *pousse* !", start: 15.4, end: 19.8 },
  { id: "l5", text: "Waouh ! Un grand *tournesol* !", start: 20.4, end: 24.0, speaker: "Noisette" },
  { id: "l6", text: "Moi *aussi*, je vais grandir comme lui !", start: 24.4, end: 28.2, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];
const PUSH = [16.6, 17.6, 18.6];

export const ep04: Episode = {
  id: "ep04", season: 2, number: 4, title: "La petite graine", duration: 36, endAt: 29.0, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "meadow", zoom: [[0, 1], [15, 1.03], [36, 1.03]],
    world: (t) => {
      const sx = 540;
      const g = t < 16.4 ? (t > 12 ? 0.08 : t > 9 ? 0.0001 : 0) : Math.min(1, 0.08 + (arrive(prog(t, 16.4, 20.2)) * 0.92));
      const pour = t > 11.4 && t < 13.4;
      return (
        <g>
          <Sunflower x={sx} y={GROUND + 40} g={t < 9 ? 0 : g} t={t} />
          {t > 2.8 && t < 9.0 ? <circle cx={760} cy={GROUND - 300} r={12} fill="#6b4a2e" stroke="#3b2416" strokeWidth={3} /> : null}
          {pour ? (
            <g>
              <WateringCan x={sx + 150} y={GROUND - 200} rot={-30} s={1.2} />
              {Array.from({ length: 8 }, (_, i) => {
                const k = (t * 2.2 + i / 8) % 1;
                return <ellipse key={i} cx={sx + 70 - k * 50 + (i % 3) * 8} cy={GROUND - 270 + k * 240} rx={5} ry={9} fill="#5ab0e6" opacity={1 - k * 0.6} />;
              })}
            </g>
          ) : null}
          {PUSH.map((p) => <PopWord key={p} t={t} at={p} x={sx + (p === 17.6 ? 220 : -220)} y={GROUND - 520} text="POUSSE !" size={78} color="#4fb36c" />)}
          <Sparkles t={t} at={20.2} x={sx} y={GROUND - 420} n={20} spread={320} />
          <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[0, 1200], [1.0, 1200], [2.8, 790]]} facing={[[0, -1]]}
            beats={[
              { at: 1.0, to: 2.8, act: "walk", speed: 2.8 }, { at: 3.4, to: 7.4, act: "holdUp" }, { at: 7.4, to: 11.4, act: "curious", look: [-1, 0.5] },
              { at: 11.4, to: 15.4, act: "water" }, { at: 15.4, to: 20.2, act: "clap" }, { at: 20.2, to: 24.4, act: "surprise", look: [-0.6, -0.9] },
              { at: 24.4, to: 29.0, act: "joy" }, { at: 29.0, to: 36, act: "wave" },
            ]} />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 290]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 3.4, act: "wave" }, { at: 3.4, to: 7.4, act: "curious", look: [1, -0.4] }, { at: 7.4, to: 9.4, act: "open" },
              { at: 9.4, to: 11.4, act: "dig" }, { at: 11.4, to: 15.4, act: "lookUp", look: [0.6, -0.9] }, { at: 15.4, to: 20.2, act: "clap" },
              { at: 20.2, to: 24.4, act: "joy", look: [0.6, -0.9] }, { at: 24.4, to: 29.0, act: "proud" }, { at: 29.0, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
  }],
};
