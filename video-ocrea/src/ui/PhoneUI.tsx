import React from "react";
import { FONT } from "../fonts";
import { useTime, L } from "../lib/time";
import { arrive, arriveOver, cam, prog, lerp } from "../lib/ease";
import { C } from "../world/common";

const SW = 640, SH = 1300; // screen size
const BTN = { x: 560, y: 885 }; // send button centre, screen coords
const PROMPT = "Un road trip au coucher du soleil, en 35 mm.";
const TILE_GRADS = [
  ["#2a1209", "#c2562f", "#ffcf8a"], ["#120a12", "#6b3a52", "#ffb347"], ["#0b0d10", "#35506a", "#f3c48a"],
  ["#1a0f0a", "#8a4a22", "#ffe0b0"], ["#0d0806", "#a33f1f", "#ff9a3c"], ["#101010", "#4b3a2a", "#e8c79a"],
];

const tileBg = (i: number) => {
  const g = TILE_GRADS[i % TILE_GRADS.length];
  return `radial-gradient(circle at ${30 + (i * 23) % 50}% ${35 + (i * 11) % 20}%, ${g[2]} 0%, ${g[2]}00 32%), linear-gradient(180deg, ${g[0]} 0%, ${g[1]} 62%, ${g[0]} 100%)`;
};

/** Act 3: the app on the phone screen, flat DOM, driven by its own frame (so motion blur can sample it). */
export const PhoneUI: React.FC = () => {
  const { t } = useTime();
  const line = L("prompt");
  const press = line.accent; // 11.2
  // camera: arrival out of the glow, drift, whip to the send button, back out, defocus
  const arriveK = arrive(prog(t, 8.0, 8.6));
  const whipIn = cam(prog(t, press - 0.5, press - 0.02));
  const whipOut = cam(prog(t, press + 0.25, press + 0.75));
  const whip = whipIn * (1 - whipOut);
  const drift = prog(t, 8.0, 13.9);
  const defocus = prog(t, 13.35, 13.9);
  const scale = lerp(1.32, 1, arriveK) * lerp(1, 3.1, whip) * (1 + defocus * 0.06);
  const rotY = lerp(-9, -4, drift) * (1 - whip);
  const rotX = lerp(5, 2, drift) + whip * 24;
  const rotZ = whip * 12;
  const blur = (1 - arriveK) * 14 + defocus * 26;

  // reference card drop, typing, press, grid
  const dropK = arriveOver(prog(t, 8.4, 9.0));
  const typed = Math.floor(prog(t, 9.05, 10.6) * PROMPT.length);
  const caretOn = Math.floor(t * 60 / 18) % 2 === 0 || (t > 9.05 && t < 10.6);
  const pressK = Math.exp(-Math.pow((t - press) / 0.06, 2));
  const ring = prog(t, press, press + 0.45);
  const fill = prog(t, 11.6, 13.4);

  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2400, perspectiveOrigin: "60% 50%" }}>
      <div style={{ position: "absolute", left: 900, top: -40, width: SW, height: SH,
        transformOrigin: `${BTN.x}px ${BTN.y}px`,
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale}) translateY(${(1 - drift) * 14}px)`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
        {/* phone body */}
        <div style={{ position: "absolute", inset: -18, borderRadius: 78, background: "linear-gradient(135deg,#2b1d16,#0c0806 60%,#3a2418)",
          boxShadow: `0 0 0 2px #3b2a20, 18px 0 60px ${C.glow}55, 0 60px 120px rgba(0,0,0,0.7)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 62, overflow: "hidden",
          background: "linear-gradient(180deg,#1c110b 0%,#0a0605 100%)" }}>
          <div style={{ position: "absolute", left: 40, top: 54, fontFamily: FONT.mono, fontWeight: 500, fontSize: 30, color: C.cream, letterSpacing: "0.08em" }}>
            OCREA
          </div>
          {/* result grid, unfolds from the send button (E2) */}
          {Array.from({ length: 9 }, (_, i) => {
            const r = Math.floor(i / 3), k = i % 3;
            const tx = 30 + k * 196, ty = 120 + r * 186;
            const e = arrive(prog(fill * 1.8 - i * 0.07, 0, 0.55));
            const dx = (BTN.x - 90 - tx) * (1 - e), dy = (BTN.y - 85 - ty) * (1 - e);
            return e > 0 ? (
              <div key={i} style={{ position: "absolute", left: tx, top: ty, width: 184, height: 172, borderRadius: 16,
                background: tileBg(i), transform: `translate(${dx}px, ${dy}px) scale(${0.12 + 0.88 * e})`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)" }} />
            ) : null;
          })}
          {/* progress bar, emitted with the grid */}
          <div style={{ position: "absolute", left: 30, top: 700, width: 580, height: 10, borderRadius: 5,
            background: "rgba(255,255,255,0.08)", transform: `scaleX(${arrive(prog(t, 11.55, 11.85))})`, transformOrigin: "100% 50%" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 5, background: `linear-gradient(90deg, ${C.terracotta}, ${C.amber})`,
              boxShadow: `0 0 18px ${C.glow}` }} />
          </div>
          <div style={{ position: "absolute", left: 30, top: 726, fontFamily: FONT.mono, fontWeight: 500, fontSize: 28,
            color: "rgba(243,230,214,0.75)", opacity: prog(t, 11.6, 11.8), transform: `translateY(${(1 - arrive(prog(t, 11.6, 11.9))) * 20}px)` }}>
            {`${String(Math.round(fill * 9))}/9 plans`}
          </div>
          {/* prompt box */}
          <div style={{ position: "absolute", left: 30, top: 790, width: 580, height: 190, borderRadius: 28,
            background: "rgba(255,255,255,0.06)", border: `2px solid ${C.amber}88`, boxShadow: `0 0 40px ${C.glow}22` }} />
          {/* reference card dropping in (E1) */}
          <div style={{ position: "absolute", left: 50, top: 812, width: 136, height: 146, borderRadius: 16, background: tileBg(3),
            transform: `translateY(${(1 - dropK) * -720}px) rotate(${(1 - dropK) * -10}deg)`,
            boxShadow: `0 ${10 + (1 - dropK) * 40}px ${30 + (1 - dropK) * 40}px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)` }} />
          {/* typed sentence */}
          <div style={{ position: "absolute", left: 206, top: 814, width: 270, fontFamily: FONT.mono, fontWeight: 500,
            fontSize: 28, lineHeight: 1.3, color: C.cream }}>
            {PROMPT.slice(0, typed)}
            <span style={{ display: "inline-block", width: 3, height: 30, marginLeft: 2, verticalAlign: "-4px",
              background: C.amber, opacity: caretOn && t < press ? 1 : 0 }} />
          </div>
          {/* send button */}
          <div style={{ position: "absolute", left: BTN.x - 42, top: BTN.y - 42, width: 84, height: 84, borderRadius: 42,
            background: `radial-gradient(circle at 35% 30%, #ffd59a, ${C.amber} 45%, ${C.terracotta})`,
            transform: `scale(${1 - pressK * 0.1}) translateY(${pressK * 4}px)`,
            boxShadow: `0 ${8 - pressK * 6}px 24px rgba(0,0,0,0.6), 0 0 ${30 + pressK * 60}px ${C.glow}` }}>
            <svg width="84" height="84" viewBox="0 0 84 84"><path d="M30 42 L54 42 M44 31 L55 42 L44 53" stroke="#1a0f0a" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          {ring > 0 && ring < 1 ? (
            <div style={{ position: "absolute", left: BTN.x - 42, top: BTN.y - 42, width: 84, height: 84, borderRadius: 42,
              border: `3px solid ${C.amber}`, transform: `scale(${1 + arrive(ring) * 2.4})`, opacity: 1 - ring }} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
