import React from "react";
import { L } from "../lib/time";
import { arrive, prog } from "../lib/ease";
import { makePath } from "../lib/camera";
import { Stage, Rig, KeyLights, Dust, Glow, C } from "../world/common";
import { Tube, swooshCurve, useWordmark, LetterMaterial } from "../world/brand";
import { FONT } from "../fonts";

const path = makePath([[0, 0.55, 8.4], [0.1, 0.6, 7.6], [0.15, 0.62, 7.2]], [[0, 0.5, 0], [0, 0.52, 0], [0, 0.55, 0]], [0, 0]);

const Logo3D: React.FC<{ t: number }> = ({ t }) => {
  const letters = useWordmark();
  const draw = arrive(prog(t, 25.4, 26.2));
  return (
    <Stage fog={[6, 16]}>
      <Rig pose={path(t, 25.4, 28.0)} />
      <KeyLights power={2.8} fill={0.7} />
      <directionalLight position={[0.5, 0.6, 6]} intensity={0.9} color={C.key} />
      <pointLight position={[-2.4, 2.4, -1.6]} intensity={18} color={C.glow} distance={8} decay={2} />
      <pointLight position={[2.4, 0.4, -1.4]} intensity={16} color={C.glow} distance={9} decay={2} />
      <group scale={0.62} position={[0, 1.25, 0]}>
        <Tube curve={swooshCurve} progress={draw} radius={0.055} />
        {letters.map((l, i) => {
          const land = 25.75 + i * 0.07;
          const k = arrive(prog(t, land - 0.55, land));
          return (
            <mesh key={i} geometry={l.geo} position={[l.x, 0.62 - (1 - k) * 1.2, -(1 - k) * 7]} rotation={[(1 - k) * 0.5, 0, 0]}>
              <LetterMaterial glow={0.03} />
            </mesh>
          );
        })}
      </group>
      <Glow position={[0, 0.6, -3]} size={10} color={C.terracotta} opacity={0.28} />
      <Glow position={[0, -1.2, -2]} size={6} color={C.glow} opacity={0.22} />
      <Dust t={t} center={[0, 0.3, 2]} size={[9, 5, 6]} seed={41} />
    </Stage>
  );
};

/** Act 7: the logo again, then a thick glass slab rises with the call to action (E1). */
export const Act7Cta: React.FC<{ t: number }> = ({ t }) => {
  const line = L("cta");
  const rise = arrive(prog(t, line.start, line.accent));
  const sweep = prog(t, line.accent, line.accent + 0.7);
  return (
    <>
      <Logo3D t={t} />
      <div style={{ position: "absolute", left: 960 - 620, top: 640, width: 1240, height: 200,
        transform: `translateY(${(1 - rise) * 560}px) scale(${0.94 + rise * 0.06})` }}>
        {/* slab thickness: an edge plate under the glass */}
        <div style={{ position: "absolute", left: 6, right: 6, top: 18, bottom: -16, borderRadius: 36,
          background: "linear-gradient(180deg, rgba(255,190,120,0.28), rgba(90,40,20,0.5))" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 36, overflow: "hidden",
          background: "rgba(255,255,255,0.13)", backdropFilter: "blur(30px) saturate(180%)", WebkitBackdropFilter: "blur(30px) saturate(180%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: `${-25 + sweep * 135}%`,
            background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,240,220,0.35) 50%, rgba(255,255,255,0) 100%)" }} />
          <div style={{ filter: `blur(${(1 - rise) * 10}px)`, fontFamily: FONT.hero, fontWeight: 800, fontSize: 72, letterSpacing: "-0.03em", color: C.cream }}>
            Créez votre premier film{" "}
            <span style={{ fontFamily: FONT.accent, fontStyle: "italic", fontWeight: 400, fontSize: 80, color: C.amber, letterSpacing: 0 }}>
              — gratuit
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
