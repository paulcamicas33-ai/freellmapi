import React from "react";
import { Episode, GROUND } from "../engine/types";
import { Actor, NOI, PISTA } from "../engine/actor";
import { PopWord } from "../engine/props";
import { Fruit } from "../engine/props2";
import { Sparkles } from "../engine/fx";
import { Bush } from "../world/Props";
import { arrive, prog } from "../lib/ease";

const lines = [
  { id: "l1", text: "Derrière le buisson, quelqu'un se *cache*…", start: 3.4, end: 6.8 },
  { id: "l2", text: "Bonjour ! Je m'appelle Noisette. Et *toi* ?", start: 7.2, end: 10.8, speaker: "Noisette" },
  { id: "l3", text: "Je… je suis *Pistache*.", start: 11.2, end: 14.0, speaker: "Pistache" },
  { id: "l4", text: "Dis bonjour à Pistache avec la *main* !", start: 14.4, end: 18.0 },
  { id: "l5", text: "Veux-tu être mon *ami* ? On partage le goûter !", start: 18.4, end: 22.2, speaker: "Noisette" },
  { id: "l6", text: "Oui ! Moi *aussi* je veux être ton ami !", start: 22.6, end: 26.4, speaker: "Pistache" },
  { id: "l7", text: "À très *vite* !", start: 32.7, end: 35.6, speaker: "Noisette" },
];

export const ep01: Episode = {
  id: "ep01", season: 2, number: 1, title: "Un nouvel ami", duration: 36, endAt: 27.4, lines,
  scenes: [{
    id: "all", start: 0, end: 36, place: "meadow", zoom: [[0, 1], [11, 1.05], [36, 1.04]],
    world: (t) => {
      const peek = arrive(prog(t, 7.6, 8.4)) * (1 - arrive(prog(t, 10.8, 11.4)));
      const out = t >= 11.0;
      const share = arrive(prog(t, 19.4, 20.4));
      return (
        <g>
          {!out ? (
            <g>
              <g transform={`translate(${780 - peek * 70},0)`}>
                <Actor id="pis-hide" who={PISTA} t={t} lines={lines} x={[[0, 0]]} facing={[[0, -1]]} y={GROUND + 8 + (1 - peek) * 60}
                  beats={[{ at: 0, to: 11.2, act: "shy" }]} />
              </g>
              <Bush x={780} y={GROUND + 30} scale={2.1} color="#5fa84a" />
            </g>
          ) : null}
          {out ? (
            <Actor id="pis" who={PISTA} t={t} lines={lines} x={[[11.0, 710], [11.8, 740]]} facing={[[0, -1]]}
              beats={[
                { at: 11.0, to: 14.4, act: "shy" }, { at: 14.4, to: 18.4, act: "wave" }, { at: 18.4, to: 22.6, act: "curious", look: [-1, 0.3] },
                { at: 22.6, to: 27.4, act: "joy" }, { at: 27.4, to: 36, act: "wave" },
              ]} />
          ) : null}
          <Bush x={1000} y={GROUND + 40} scale={1.2} color="#4f9a42" />
          {share > 0 ? <Fruit kind="cheese" x={500 + share * 120} y={GROUND - 260 + share * 40} s={1.3} /> : null}
          {t > 18.6 && share < 1 ? <Fruit kind="apple" x={420} y={GROUND - 300} s={1.1} /> : null}
          <PopWord t={t} at={3.6} x={760} y={GROUND - 520} text="?" size={140} color="#ff9f43" />
          <PopWord t={t} at={16.9} dur={1.4} x={540} y={GROUND - 760} text="BONJOUR !" size={100} color="#4fb36c" />
          <Sparkles t={t} at={22.7} x={540} y={GROUND - 420} n={18} spread={300} color="#ff9f43" />
          <Actor id="noi" who={NOI} t={t} lines={lines} x={[[0, 100], [2.8, 330]]} facing={[[0, 1]]}
            beats={[
              { at: 0, to: 2.8, act: "walk", speed: 2.0 }, { at: 3.4, to: 7.2, act: "curious", look: [1, 0.2] },
              { at: 7.2, to: 11.2, act: "wave" }, { at: 11.2, to: 14.4, act: "joy" }, { at: 14.4, to: 18.4, act: "wave" },
              { at: 18.4, to: 22.6, act: "open" }, { at: 22.6, to: 27.4, act: "hug" }, { at: 27.4, to: 36, act: "wave" },
            ]} />
        </g>
      );
    },
  }],
};
