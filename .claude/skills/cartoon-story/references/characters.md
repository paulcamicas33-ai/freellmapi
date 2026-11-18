# Characters — the Critter rig and how to make it act

Read this before animating anyone.

## The rig
`src/cast/Critter.tsx` draws a storybook animal from SVG shapes, about 330 px tall at scale 1,
origin between the feet on the ground. Props:

- `id` (unique; prefixes its gradient and clip ids), `species`: `fox` | `bunny` | `bear` | `cat`
- `look`: `fur`, `belly`, optional `accent` (scarf colour), `eye`, `blush`
- `x`, `y` (ground point in the layer's px), `scale`, `facing` (1 right, -1 left)
- `pose`: all optional — `armL`, `armR`, `legL`, `legR` (degrees; 0 = hanging down; a positive
  `armL` and a negative `armR` swing the arms outward and up — the opposite signs cross them in
  front of the face), `tilt` (body), `headTilt`,
  `lookX`, `lookY` (-1..1), `blink` (0..1), `mouth` (0..1 open), `smile` (0..1), `brow` (-1 sad/angry,
  +1 surprised), `sx`, `sy` (squash), `bob` (px, negative = up), `tail` (degrees), `earL`, `earR`,
  `reachL`, `reachR` (0..1: a longer arm to hold something above the head or wave high; an arm
  raised past 110 degrees is drawn in front of the head so the big head does not hide it).

Put each story character's species, look and scale in `src/cast/cast.ts` so every scene uses the
same design.

## Motion helpers (`src/lib/motion.ts`)
- `breathe(t, seed)` → sy for idle breathing; `blink(t, seed)` → eyelid; always both, every frame.
- `talk(t, start, end, seed)` → mouth while a caption line belongs to that character (`speaker`).
- `walk(t, speed)` → `{ bob, legL, legR, armL, armR, tilt }`; move x at about `speed * 55 * scale`
  px per second so feet do not slide.
- `hop(t, a, b, height)` → `{ y, sx, sy }` with anticipation squash and landing squash.
- `squashAt(t, at, amount)` → a one-shot squash for surprise or a bump.
- `sway(t, seed, amp, speed)` → degrees for tails, ears, plants.
- `keys(t, [[time, value], ...])` (in `ease.ts`) → eased key animation for x, y, angles, zoom.

## Acting recipe
Every beat is anticipation → action → follow-through:
1. Anticipation (0.15–0.3 s): the opposite small move first (crouch before a jump, lean back
   before running, eyes look before the head turns).
2. Action: the main move, on a strong ease (`pop` for arrivals, `cam` for travel).
3. Follow-through: tail, ears and arms settle a few frames later than the body (offset keys by
   2–5 frames), with a small overshoot.

Expressions (pose fragments):
- happy: `{ smile: 1, brow: 0.3, armL: 150, armR: -150, reachL: 0.5, reachR: 0.5 }` + bounce
- holding something up high: `{ armL: 172, armR: -172, reachL: 1, reachR: 1, lookY: -0.9 }`; the
  object sits about `(64 + 110) * scale` px above the shoulders (shoulders at y -166 * scale)
- surprised: `{ brow: 1, mouth: 0.6, lookY: -0.3 }` + `squashAt`
- sad: `{ brow: -0.8, smile: 0, headTilt: 10, lookY: 0.6, armL: 5, armR: -5 }`
- curious: `{ headTilt: -12, lookX: 0.8, brow: 0.5 }`
- proud / joy with eyes closed: `{ blink: 1, smile: 1, headTilt: 6 }`

Two characters in a scene: alternate who moves (the listener breathes, blinks and reacts small;
the speaker gestures). They look at each other (`lookX` toward the other) unless something else
calls their gaze.

## New creatures and objects
Build them in the same manner (gradient fill, coloured outline, highlight stroke, contact shadow,
ids prefixed). A face for any object (a star, the moon, a cloud): two dark oval eyes with a white
dot, pink cheeks, a small curved mouth; `Star` has an optional `face` prop as the pattern.
