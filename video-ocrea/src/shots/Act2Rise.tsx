import React, { useMemo } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { L, F } from "../lib/time";
import { arrive, prog, cam } from "../lib/ease";
import { Stage, Rig, KeyLights, Dust, Glow, C } from "../world/common";
import { screenTexture, shotTexture } from "../world/textures";
import type { Pose } from "../lib/camera";

const PHONE: [number, number, number] = [1.15, 0, 0];

/** Low orbit around the phone, then a push into its screen (E5). */
const pose = (t: number): Pose => {
  const k = cam(prog(t, 4.0, 7.5));
  const ang = -0.2 + k * 0.32;
  const r = 6.8 - k * 1.0;
  const push = cam(prog(t, 7.45, 8.0));
  const base: [number, number, number] = [PHONE[0] + Math.sin(ang) * r - 1.0 * (1 - push), 0.2 + k * 0.45, Math.cos(ang) * r];
  const into: [number, number, number] = [PHONE[0], -0.12, 0.62];
  const pos = base.map((v, i) => v + (into[i] - v) * push) as [number, number, number];
  const tgt0: [number, number, number] = [PHONE[0] - 1.25, 0.15, 0];
  const tgt = tgt0.map((v, i) => v + ([PHONE[0], -0.12, 0][i] - v) * push) as [number, number, number];
  return { pos, target: tgt, roll: 0.012 * (1 - push) };
};

export const Act2Rise: React.FC<{ t: number }> = ({ t }) => {
  const line = L("rise");
  const phoneGeo = useMemo(() => new RoundedBoxGeometry(1.0, 2.05, 0.12, 6, 0.11), []);
  const cardGeo = useMemo(() => new RoundedBoxGeometry(1.6, 0.9, 0.08, 4, 0.04), []);
  const riseK = arrive(prog(t, 4.0, 5.0));
  const swell = Math.exp(-Math.pow((t - line.accent) / 0.25, 2));
  const screenGlow = prog(t, 7.4, 8.0);
  return (
    <Stage fog={[7, 18]}>
      <Rig pose={pose(t)} />
      <KeyLights power={2.2} />
      {/* amber rim light from behind right */}
      <pointLight position={[PHONE[0] + 1.3, 1.0, -1.1]} intensity={22 + swell * 40} color={C.glow} distance={8} decay={2} />
      <pointLight position={[PHONE[0] - 1.4, -0.6, -1.0]} intensity={8} color={C.terracotta} distance={6} decay={2} />
      <Glow position={[PHONE[0] + 0.35, 0.3, -1.6]} size={5.5 + swell * 1.5} color={C.glow} opacity={0.5 + swell * 0.3} />
      <group position={[PHONE[0], (1 - riseK) * -3.4, 0]} rotation={[0.05, -0.18 + riseK * 0.12, 0.02]}>
        <mesh geometry={phoneGeo}>
          <meshStandardMaterial color={"#1b1310"} roughness={0.28} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0, 0.062]}>
          <planeGeometry args={[0.9, 1.92]} />
          <meshBasicMaterial map={screenTexture()} color={[0.7 + screenGlow * 1.2, 0.62 + screenGlow * 0.9, 0.55 + screenGlow * 0.5]} toneMapped={false} />
        </mesh>
      </group>
      {Array.from({ length: 5 }, (_, i) => {
        const emit = arrive(prog(t, 4.55 + F(5 * i), 5.4 + F(5 * i)));
        const a = (i / 5) * Math.PI * 2 + t * 0.55 + 0.4;
        const rx = 2.15 * emit, rz = 1.5 * emit;
        const x = PHONE[0] + Math.sin(a) * rx;
        const z = Math.cos(a) * rz - (1 - emit) * 0.4;
        const y = Math.sin(a + 0.6) * 0.55 * emit + (i % 2 ? 0.25 : -0.2);
        return (
          <group key={i} position={[x, y, z]} rotation={[0.04, -Math.sin(a) * 0.35, 0]} scale={0.35 + emit * 0.65}>
            <mesh geometry={cardGeo}>
              <meshStandardMaterial color={"#2b1a12"} roughness={0.4} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.041]}>
              <planeGeometry args={[1.52, 0.82]} />
              <meshStandardMaterial map={shotTexture(i)} roughness={0.5} emissive={"#ffffff"} emissiveMap={shotTexture(i)} emissiveIntensity={0.35} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={"#140b07"} roughness={0.6} metalness={0.2} />
      </mesh>
      <Dust t={t} center={[0.8, 0.3, 1.5]} size={[9, 5, 6]} seed={5} />
    </Stage>
  );
};
