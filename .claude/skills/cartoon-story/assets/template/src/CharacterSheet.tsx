import React from "react";
import { AbsoluteFill } from "remotion";
import { Critter, Species, Look } from "./cast/Critter";
import { blink, breathe } from "./lib/motion";
import { useTime } from "./lib/time";

const CAST: { species: Species; look: Look; name: string }[] = [
  { species: "fox", name: "renard", look: { fur: "#e8743b", belly: "#fff3e2", accent: "#3d7dd8" } },
  { species: "bunny", name: "lapin", look: { fur: "#d9cfc4", belly: "#ffffff", accent: "#e85a8a" } },
  { species: "bear", name: "ours", look: { fur: "#8a5a3b", belly: "#e8c9a0" } },
  { species: "cat", name: "chat", look: { fur: "#6c6f86", belly: "#eceaf2", accent: "#f2b134", eye: "#2f6b3a" } },
];

/** Lineup of the default cast: render one still of it to show the user the character designs. */
export const CharacterSheet: React.FC = () => {
  const { t } = useTime();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffe9c9,#f6c99a)" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <rect x={0} y={820} width={1920} height={260} fill="#d9a66f" />
        {CAST.map((c, i) => (
          <Critter key={c.name} id={`sheet-${c.name}`} species={c.species} look={c.look} x={300 + i * 440} y={850} scale={1.25}
            pose={{ blink: blink(t, i), sy: breathe(t, i), smile: 0.8, lookX: 0.2 }} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
