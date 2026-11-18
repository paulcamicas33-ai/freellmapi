import React from "react";
import { L } from "../lib/time";
import { TypeLine } from "../type/TypeLine";
import { rand } from "../lib/noise";
import { C } from "../world/common";

/** Act 6: the quiet contrast beat. Type out of the bloom, warm haze, sheen on the accent. */
export const Act6Line: React.FC<{ t: number }> = ({ t }) => {
  const line = L("line");
  const d = t - 22.6;
  return (
    <>
      <div style={{ position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${48 + d * 1.5}% ${56 - d}%, #4a2414 0%, #24120a 38%, ${C.black} 78%)` }} />
      {Array.from({ length: 36 }, (_, i) => {
        const x = ((rand(31, i) + d * 0.012 * (0.5 + rand(32, i))) % 1) * 1920;
        const y = ((rand(33, i) - d * 0.02 * (0.5 + rand(34, i)) + 1) % 1) * 1080;
        const s = 2 + rand(35, i) * 4;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s,
          background: C.amber, opacity: 0.25 + rand(36, i) * 0.35, boxShadow: `0 0 ${s * 3}px ${C.glow}` }} />;
      })}
      <TypeLine t={t} start={line.start} end={line.end} accentT={line.accent} size={150} x={160} y={330} maxWidth={1600}
        align="center" sheen
        words={[{ text: "Tout" }, { text: "le" }, { text: "cinéma,", accent: true }, { text: "sans", at: line.start + 0.45 },
          { text: "le", at: line.start + 0.52 }, { text: "plateau.", at: line.start + 0.59 }]} />
    </>
  );
};
