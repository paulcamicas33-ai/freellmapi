import React from "react";
import { prog } from "../lib/ease";
import { rand } from "../lib/noise";
import { C } from "../world/common";

const bell = (t: number, c: number, w: number) => Math.exp(-Math.pow((t - c) / w, 2));

/** Light transitions laid over the cuts: streak, screen glow, amber defocus bokeh, flare, bloom, sweep. */
export const Transitions: React.FC<{ t: number }> = ({ t }) => {
  // T1 streak across black, 3.6 to 4.4, peak at the 4.0 cut
  const sx = prog(t, 3.55, 4.15);
  const streak = bell(t, 4.0, 0.16);
  // T2 screen glow, peak at the 8.0 cut
  const glow = bell(t, 8.0, 0.16);
  // T3 amber defocus bokeh, peak at the 13.9 cut
  const bokeh = bell(t, 13.9, 0.28);
  // T4 route flare into the box, peak at 18.6
  const flare = bell(t, 18.6, 0.14);
  // T5 bloom out of the box, peak at 22.6
  const bloom = bell(t, 22.6, 0.22);
  // T6 sweep into the CTA, peak at 25.4
  const sweep = prog(t, 25.15, 25.65);
  const sweepA = bell(t, 25.4, 0.12);
  return (
    <>
      {t > 3.5 && t < 4.5 ? (
        <>
          <div style={{ position: "absolute", left: `${-40 + sx * 120}%`, top: 470, width: "60%", height: 26, borderRadius: 13,
            background: `linear-gradient(90deg, rgba(255,154,60,0) 0%, ${C.glow} 60%, #fff3dd 100%)`, filter: "blur(6px)",
            opacity: 0.35 + streak * 0.65 }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 22% at 50% 45%, rgba(255,200,140,${streak * 0.95}) 0%, rgba(255,154,60,${streak * 0.6}) 40%, rgba(0,0,0,0) 100%)` }} />
        </>
      ) : null}
      {glow > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 60% 50%, rgba(255,214,160,${glow}) 0%, rgba(255,154,60,${glow * 0.9}) 45%, rgba(40,20,10,${glow * 0.8}) 100%)` }} />
      ) : null}
      {bokeh > 0.01 ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(120,55,20,${bokeh * 0.45})` }} />
          {Array.from({ length: 22 }, (_, i) => {
            const r = 40 + rand(51, i) * 120;
            const x = rand(52, i) * 1920, y = rand(53, i) * 1080 + (t - 13.9) * 60 * (rand(54, i) - 0.5);
            return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r,
              background: `radial-gradient(circle, rgba(255,190,110,0.55) 0%, rgba(255,154,60,0.35) 60%, rgba(255,154,60,0) 72%)`,
              opacity: bokeh * (0.4 + rand(55, i) * 0.6) }} />;
          })}
        </>
      ) : null}
      {flare > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 58% 48%, rgba(255,246,228,${flare}) 0%, rgba(255,179,71,${flare * 0.9}) 22%, rgba(60,25,10,${flare * 0.7}) 70%)` }} />
      ) : null}
      {bloom > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 56% 42%, rgba(255,236,205,${bloom}) 0%, rgba(255,170,90,${bloom * 0.95}) 40%, rgba(120,50,20,${bloom * 0.9}) 100%)` }} />
      ) : null}
      {sweepA > 0.01 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 700, left: -700 + sweep * 2620,
          background: `linear-gradient(100deg, rgba(255,179,71,0) 0%, rgba(255,214,160,${sweepA * 0.95}) 50%, rgba(255,179,71,0) 100%)` }} />
      ) : null}
    </>
  );
};
