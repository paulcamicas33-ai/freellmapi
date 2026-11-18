import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Vector3 } from "three";
import type { Pose } from "../lib/camera";
import { rand } from "../lib/noise";
import { glowTexture } from "./textures";
import { W, H } from "../lib/format";

export const C = {
  black: "#070504",
  brown: "#1a0f0a",
  haze: "#3a1d12",
  terracotta: "#c2562f",
  amber: "#ffb347",
  glow: "#ff9a3c",
  cream: "#f3e6d6",
  key: "#ffd9b0",
};

/** Sets the default camera from a pose each frame. FOV is fixed (34 deg) and never animated. */
export const Rig: React.FC<{ pose: Pose }> = ({ pose }) => {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.position.set(...pose.pos);
    camera.up.set(Math.sin(pose.roll), Math.cos(pose.roll), 0);
    camera.lookAt(new Vector3(...pose.target));
    camera.updateMatrixWorld();
  }, [camera, pose]);
  return null;
};

/** The one key light (upper left front) plus a soft fill, shared by every 3D act. */
export const KeyLights: React.FC<{ power?: number; fill?: number }> = ({ power: k = 2.6, fill = 0.35 }) => (
  <>
    <directionalLight position={[-4, 6, 5]} intensity={k} color={C.key} />
    <hemisphereLight args={[C.haze, C.black, fill]} />
  </>
);

/** A 3D canvas for one act. */
export const Stage: React.FC<{ children: React.ReactNode; fog?: [number, number] }> = ({ children, fog }) => (
  <ThreeCanvas width={W} height={H} camera={{ fov: 34, near: 0.05, far: 400 }} gl={{ antialias: true, alpha: true }}>
    {fog ? <fog attach="fog" args={[C.brown, fog[0], fog[1]]} /> : null}
    {children}
  </ThreeCanvas>
);

/** Additive glow billboard. */
export const Glow: React.FC<{ position: [number, number, number]; size: number; color?: string; opacity?: number }> = ({
  position, size, color = C.glow, opacity = 1,
}) => (
  <sprite position={position} scale={[size, size, 1]}>
    <spriteMaterial map={glowTexture()} color={color} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} />
  </sprite>
);

/** Dust in the air: seeded points drifting as a pure function of t. Subtle, never a particle show. */
export const Dust: React.FC<{ t: number; center: [number, number, number]; size: [number, number, number]; count?: number; seed?: number; opacity?: number }> = ({
  t, center, size, count = 420, seed = 3, opacity = 0.55,
}) => {
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  const arr = geo.getAttribute("position") as BufferAttribute;
  for (let i = 0; i < count; i++) {
    const sx = rand(seed, i * 3), sy = rand(seed, i * 3 + 1), sz = rand(seed, i * 3 + 2);
    const sp = 0.04 + rand(seed + 1, i) * 0.08;
    const x = ((sx + t * sp * 0.25) % 1) - 0.5;
    const y = ((sy + t * sp * 0.4) % 1) - 0.5;
    const wob = Math.sin(t * 0.7 + i) * 0.01;
    arr.setXYZ(i, center[0] + (x + wob) * size[0], center[1] + y * size[1], center[2] + (sz - 0.5) * size[2]);
  }
  arr.needsUpdate = true;
  return (
    <points geometry={geo}>
      <pointsMaterial map={glowTexture()} color={C.amber} size={0.05} sizeAttenuation transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} />
    </points>
  );
};
