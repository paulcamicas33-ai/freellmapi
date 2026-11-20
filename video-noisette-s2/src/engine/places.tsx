import React from "react";
import { Layer } from "../world/Camera";
import { Sky } from "../world/Sky";
import { Hill } from "../world/Hills";
import { Tree, Bush, Flower } from "../world/Props";
import { sway } from "../lib/motion";
import { rand } from "../lib/noise";
import { W, H, GROUND, Place } from "./types";

type Pal = { top: string; bottom: string; far: string; mid: string; near: string; rim: string; leaf: string; light?: { x: number; y: number; r: number; color: string; moon?: boolean }; stars?: number; clouds?: number; cloud?: string; grass: string };

export const PALETTES: Record<Place, Pal> = {
  meadow: { top: "#7cc4f2", bottom: "#dff3ff", far: "#a8d0b8", mid: "#8fc26a", near: "#6fae55", rim: "#d8f0a0", leaf: "#5fa84a", light: { x: W * 0.8, y: H * 0.16, r: 70, color: "#fff6c8" }, clouds: 5, cloud: "#ffffff", grass: "#4f8f3c" },
  sunset: { top: "#ff9e6b", bottom: "#ffe2b3", far: "#c98b6b", mid: "#a9a85f", near: "#6f9a4f", rim: "#c9e08a", leaf: "#7aa34f", light: { x: W * 0.78, y: H * 0.24, r: 80, color: "#fff4cf" }, clouds: 4, cloud: "#ffe9d2", grass: "#4f7d3c" },
  night: { top: "#10183a", bottom: "#3a3f78", far: "#2b3466", mid: "#24485a", near: "#1d3b45", rim: "#8fb0c4", leaf: "#2f6b5e", stars: 80, clouds: 2, cloud: "#4a5390", grass: "#173238" },
  forest: { top: "#8fd0e8", bottom: "#e6f6e0", far: "#7fae8c", mid: "#5f9a55", near: "#4f8a45", rim: "#c8e89a", leaf: "#3f8a45", light: { x: W * 0.2, y: H * 0.12, r: 60, color: "#fff6c8" }, clouds: 2, cloud: "#ffffff", grass: "#3a6f33" },
  snow: { top: "#9fc4ec", bottom: "#eaf4ff", far: "#c9dcf0", mid: "#e2eefa", near: "#f4f9ff", rim: "#ffffff", leaf: "#4f8a7a", light: { x: W * 0.75, y: H * 0.15, r: 60, color: "#fffbe6" }, clouds: 3, cloud: "#ffffff", grass: "#d7e6f5" },
  rain: { top: "#7f8fa8", bottom: "#c8d2de", far: "#8a9aa0", mid: "#6f9a6a", near: "#5a8a52", rim: "#b8d8a0", leaf: "#4f8a4a", clouds: 6, cloud: "#a8b4c4", grass: "#3f6f38" },
  beach: { top: "#6ec6f0", bottom: "#e4f7ff", far: "#7fc8e0", mid: "#3fa0d0", near: "#f2d7a0", rim: "#fff1c8", leaf: "#4fa04a", light: { x: W * 0.8, y: H * 0.15, r: 70, color: "#fff6c8" }, clouds: 4, cloud: "#ffffff", grass: "#e6c486" },
  "burrow-night": { top: "#141c44", bottom: "#46407e", far: "#2b3466", mid: "#2a4a5a", near: "#223f46", rim: "#8fb0c4", leaf: "#2f6b5e", light: { x: W * 0.78, y: H * 0.14, r: 56, color: "#fff6d8", moon: true }, stars: 90, clouds: 1, cloud: "#4a5390", grass: "#173238" },
};

/** The full backdrop for a place: sky, far and mid hills with trees, the ground band, grass in front. */
export const Backdrop: React.FC<{ id: string; place: Place; t: number; front?: boolean }> = ({ id, place, t, front = false }) => {
  const p = PALETTES[place];
  const g = GROUND;
  if (front) {
    return (
      <Layer depth={1.4} width={W} height={H}>
        {place !== "beach" ? (
          <>
            <Bush x={-40} y={H + 60} scale={2.6} color={p.leaf} />
            <Bush x={W + 30} y={H + 90} scale={2.3} color={p.leaf} />
          </>
        ) : null}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} transform={`translate(${i * W * 0.14 - 60},${H + 30}) rotate(${sway(t, i, 6, 0.7)})`}>
            <path d="M 0 0 Q -10 -80 6 -150 Q 12 -80 18 0 Z" fill={p.grass} />
            <path d="M 20 0 Q 30 -60 50 -110 Q 36 -50 38 0 Z" fill={p.grass} opacity={0.85} />
          </g>
        ))}
      </Layer>
    );
  }
  const forest = place === "forest";
  const beach = place === "beach";
  return (
    <>
      <Layer depth={0} width={W} height={H}>
        <Sky id={`${id}-sky`} t={t} width={W} height={H} top={p.top} bottom={p.bottom} light={p.light} stars={p.stars ?? 0} clouds={p.clouds ?? 0} cloudColor={p.cloud} />
      </Layer>
      <Layer depth={0.25} width={W} height={H} blur={2}>
        {beach ? (
          <>
            <rect x={-W} y={g - 260} width={W * 3} height={H} fill={p.far} />
            <path d={`M ${-W} ${g - 260} ${Array.from({ length: 60 }, (_, i) => `L ${-W + i * 60} ${g - 262 + Math.sin(i * 1.3 + t * 2) * 4}`).join(" ")} L ${W * 2} ${g - 260}`} fill="none" stroke="#e8f8ff" strokeWidth={4} />
          </>
        ) : (
          <Hill id={`${id}-far`} width={W} height={H} base={g - 220} amp={60} freq={0.0035} seed={2} color={p.far} rim={p.rim} />
        )}
      </Layer>
      <Layer depth={0.6} width={W} height={H} blur={0.6}>
        {beach ? (
          <>
            <rect x={-W} y={g - 150} width={W * 3} height={H} fill={p.mid} />
            {Array.from({ length: 14 }, (_, i) => (
              <path key={i} d={`M ${-W + i * 230 + ((t * 30) % 230)} ${g - 90 + (i % 3) * 30} q 20 -14 40 0`} fill="none" stroke="#bfe8ff" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
            ))}
          </>
        ) : (
          <>
            <Hill id={`${id}-mid`} width={W} height={H} base={g - 80} amp={40} freq={0.005} seed={6} color={p.mid} rim={p.rim} />
            {(forest ? [0.02, 0.2, 0.42, 0.66, 0.84, 1.0] : [0.06, 0.94]).map((f, i) => (
              <Tree key={i} id={`${id}-tree${i}`} t={t} x={W * f} y={g - 70 - (forest ? (i % 2) * 30 : 0)} leaf={p.leaf} scale={forest ? 1.05 - (i % 2) * 0.15 : 0.85} seed={i * 3} />
            ))}
            {place !== "snow" ? <Bush x={W * 0.75} y={g - 60} scale={0.8} color={p.leaf} /> : null}
          </>
        )}
      </Layer>
      <Layer depth={1} width={W} height={H}>
        <Hill id={`${id}-near`} width={W} height={H} base={g + 10} amp={10} freq={0.006} seed={9} color={p.near} rim={p.rim} />
        {place === "meadow" || place === "sunset" || place === "forest" ? (
          <>
            <Flower t={t} x={W * 0.1} y={g + 46} color="#f27ba0" seed={1} />
            <Flower t={t} x={W * 0.86} y={g + 50} color="#ffd166" seed={4} />
            <Flower t={t} x={W * 0.93} y={g + 36} color="#a98bf2" seed={7} scale={0.85} />
          </>
        ) : null}
        {Array.from({ length: 14 }, (_, i) => {
          const px = rand(81, i) * W, py = g + 200 + rand(82, i) * 560;
          if (place === "beach") return <ellipse key={`s${i}`} cx={px} cy={py} rx={10 + rand(83, i) * 14} ry={6} fill="#d9b878" opacity={0.7} />;
          if (place === "snow") return null;
          return i % 3 === 0 && !(place === "night" || place === "burrow-night")
            ? <Flower key={`s${i}`} t={t} x={px} y={py} color={["#f27ba0", "#ffd166", "#a98bf2", "#ff9e6b"][i % 4]} seed={i} scale={0.7 + rand(84, i) * 0.4} />
            : <ellipse key={`s${i}`} cx={px} cy={py} rx={14 + rand(83, i) * 18} ry={7 + rand(85, i) * 5} fill={p.grass} opacity={0.55} />;
        })}
        {place === "snow" ? Array.from({ length: 10 }, (_, i) => (
          <ellipse key={i} cx={rand(31, i) * W} cy={g + 40 + rand(32, i) * 200} rx={30 + rand(33, i) * 40} ry={8} fill="#dbe8f6" />
        )) : null}
      </Layer>
    </>
  );
};
