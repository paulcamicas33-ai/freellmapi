import React, { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, CurvePath, InstancedMesh, LineCurve3, Matrix4, Object3D, Vector3 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { L } from "../lib/time";
import { arrive, prog } from "../lib/ease";
import { makePath } from "../lib/camera";
import { rand } from "../lib/noise";
import { Stage, Rig, KeyLights, Dust, Glow, C } from "../world/common";
import { Tube } from "../world/brand";
import { shotTexture } from "../world/textures";

const N = 10; // blocks from -N..N
const ROUTE_PTS: [number, number][] = [[-5.5, 5.5], [-5.5, 1.5], [-1.5, 1.5], [-1.5, -2.5], [3.5, -2.5], [3.5, -5.5]];
const route = (() => {
  const cp = new CurvePath<Vector3>();
  for (let i = 0; i < ROUTE_PTS.length - 1; i++) {
    const a = ROUTE_PTS[i], b = ROUTE_PTS[i + 1];
    cp.add(new LineCurve3(new Vector3(a[0], 0.06, a[1]), new Vector3(b[0], 0.06, b[1])));
  }
  return cp;
})();

const blocks = (() => {
  const out: { x: number; z: number; h: number; s: number }[] = [];
  for (let i = -N; i <= N; i++) {
    for (let j = -N; j <= N; j++) {
      const id = (i + N) * 31 + (j + N);
      const h = 0.15 + Math.pow(rand(11, id), 2.6) * 1.6;
      out.push({ x: i, z: j, h, s: 0.62 + rand(12, id) * 0.16 });
    }
  }
  return out;
})();

const windows = (() => {
  const out: { x: number; y: number; z: number }[] = [];
  blocks.forEach((b, i) => {
    if (b.h > 0.5 && rand(13, i) > 0.55) {
      const n = 1 + Math.floor(rand(14, i) * 3);
      for (let k = 0; k < n; k++) {
        const side = rand(15, i * 5 + k) > 0.5 ? 1 : -1;
        out.push({ x: b.x + (rand(16, i * 5 + k) - 0.5) * b.s * 0.7, y: 0.3 + rand(17, i * 5 + k) * (b.h - 0.4), z: b.z + side * (b.s / 2 + 0.005) });
        if (rand(20, i * 5 + k) > 0.6) out.push({ x: b.x + (rand(18, i * 5 + k) - 0.5) * b.s * 0.6, y: b.h + 0.03, z: b.z + (rand(19, i * 5 + k) - 0.5) * b.s * 0.6 });
      }
    }
  });
  return out;
})();

const path = makePath(
  [[0.2, 25, 1.2], [-2.5, 15, 8.5], [-8.5, 3.6, 9.5]],
  [[0, 0, 0], [-0.5, 0, 0.5], [0.4, 0.6, -1.0]],
  [0, 0.02],
);

/** Lives inside the R3F tree so its refs exist when the layout effect runs. */
const City: React.FC<{ box: BoxGeometry; win: BoxGeometry }> = ({ box, win }) => {
  const ref = useRef<InstancedMesh>(null);
  const wref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const o = new Object3D();
    blocks.forEach((b, i) => {
      o.position.set(b.x, b.h / 2, b.z);
      o.scale.set(b.s, b.h, b.s);
      o.updateMatrix();
      ref.current?.setMatrixAt(i, o.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    const m = new Matrix4();
    windows.forEach((w, i) => {
      m.makeTranslation(w.x, w.y, w.z);
      wref.current?.setMatrixAt(i, m);
    });
    if (wref.current) wref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <>
      <instancedMesh ref={ref} args={[box, undefined, blocks.length]} frustumCulled={false}>
        <meshStandardMaterial color={"#3e2617"} roughness={0.6} metalness={0.1} />
      </instancedMesh>
      <instancedMesh ref={wref} args={[win, undefined, windows.length]} frustumCulled={false}>
        <meshBasicMaterial color={[1.6, 0.8, 0.25]} toneMapped={false} />
      </instancedMesh>
    </>
  );
};

const TILE_AT = [0.12, 0.3, 0.46, 0.62, 0.78, 0.93];

export const Act4Route: React.FC<{ t: number }> = ({ t }) => {
  const line = L("route");
  const drawStart = 14.5, drawEnd = line.accent;
  const routeK = arrive(prog(t, drawStart, drawEnd));
  const flare = Math.exp(-Math.pow((t - line.accent) / 0.2, 2)) + prog(t, 18.2, 18.6) * 1.5;
  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const win = useMemo(() => new BoxGeometry(0.06, 0.06, 0.06), []);
  const tileGeo = useMemo(() => new RoundedBoxGeometry(1.1, 0.62, 0.06, 3, 0.025), []);
  const end = route.getPointAt(1);
  return (
    <Stage fog={[22, 60]}>
      <Rig pose={path(t, 13.9, 18.6)} />
      <KeyLights power={3.0} fill={0.6} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={"#1a0f0a"} roughness={0.85} />
      </mesh>
      <City box={box} win={win} />
      <Tube curve={route} progress={routeK} radius={0.08} headSize={1.6} bloom={0.7} />
      {routeK > 0 ? <pointLight position={[route.getPointAt(Math.max(0.001, routeK)).x, 0.8, route.getPointAt(Math.max(0.001, routeK)).z]} intensity={18} color={C.glow} distance={5} decay={2} /> : null}
      {TILE_AT.map((f, i) => {
        const ts = drawStart + (drawEnd - drawStart) * f;
        const k = arrive(prog(t, ts, ts + 0.7));
        const p = route.getPointAt(f);
        const side = i % 2 ? 0.75 : -0.75;
        return k > 0 ? (
          <group key={i} position={[p.x + side * 0.4, -0.4 + k * 1.3, p.z + side * 0.4]} rotation={[0, -0.75, 0]}>
            <mesh geometry={tileGeo}>
              <meshStandardMaterial color={"#2b1a12"} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.031]}>
              <planeGeometry args={[1.04, 0.56]} />
              <meshStandardMaterial map={shotTexture(i + 1)} emissive={"#ffffff"} emissiveMap={shotTexture(i + 1)} emissiveIntensity={0.55} />
            </mesh>
          </group>
        ) : null;
      })}
      <Glow position={[end.x, 0.3, end.z]} size={1.5 + flare * 4} color={C.amber} opacity={Math.min(1, flare)} />
      <Dust t={t} center={[-2, 2, 2]} size={[16, 6, 14]} seed={9} opacity={0.4} />
    </Stage>
  );
};
