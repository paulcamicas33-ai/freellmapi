import { CatmullRomCurve3, Vector3 } from "three";
import { cam, prog } from "./ease";

export type Pose = { pos: [number, number, number]; target: [number, number, number]; roll: number };

/** One continuous spline per act: positions and targets as Catmull-Rom curves, eased once. */
export const makePath = (
  pos: [number, number, number][],
  target: [number, number, number][],
  roll: [number, number] = [0, 0],
) => {
  const pc = new CatmullRomCurve3(pos.map((p) => new Vector3(...p)), false, "centripetal");
  const tc = new CatmullRomCurve3(target.map((p) => new Vector3(...p)), false, "centripetal");
  return (t: number, a: number, b: number): Pose => {
    const k = cam(prog(t, a, b));
    const p = pc.getPointAt(k);
    const q = tc.getPointAt(k);
    return { pos: [p.x, p.y, p.z], target: [q.x, q.y, q.z], roll: roll[0] + (roll[1] - roll[0]) * k };
  };
};
