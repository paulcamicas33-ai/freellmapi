# Design bible — Ocrea

## Format
16:9 only, 1920x1080, 60 fps. Text safe zone x 110–1810, y 80–1000. `pick()` kept in
`src/lib/format.ts` so a 9:16 version can be added later from the same scenes.

## Type (kit fonts only)
- Hero: Inter Tight 900, tracking -0.04em, 120–170 px (lines), 150 px (act 6).
- Accent word (one per line): Instrument Serif Italic 400, amber #ffb347, ~1.08x hero size.
- UI: JetBrains Mono 500. Nothing read under 28 px.
- Wordmark OCREA: custom geometric letters extruded in 3D (no font file needed).

## Colour
World: #070504 (black) → #1a0f0a (deep brown) → #3a1d12 (brown haze). Terracotta #c2562f for
objects. Cream type #f3e6d6. ONE saturated accent: amber #ffb347 (glow #ff9a3c) on key beats only.
No flat backgrounds: radial gradients, haze, dust, grain, vignette.

## Light
Key light: warm white #ffd9b0 from upper left front (direction (-4, 6, 5)) on every 3D act.
Fill: hemisphere #3a1d12 / #070504, low. Amber rim/practicals per act (behind right).

## Camera
FOV 34 degrees, never animated. Always drifting; one continuous eased path per act.

## Motion
Arrivals cubic-bezier(0.16,1,0.3,1); camera (0.65,0,0.35,1); exits (0.7,0,0.84,0). Linear only
for drift. Overshoot <= 2 %. Group stagger 2–6 frames.

## Entrances
E1 out of depth/haze (10+ frames, blur clearing), E2 emitted by another object, E3 mask/path
reveal, E5 camera arrives. No opacity-only entrances, nothing appears in under 6 frames except
flashes.

## Glass
Only the CTA slab (act 7): backdrop blur 30 px, saturate 180 %, rgba(255,255,255,0.12), 1 px inner
highlight, soft shadow, specular sweep on the accent. Flat unfiltered parent.

## Post
Seeded SVG grain per frame (opacity ~0.07) + soft vignette, once over everything.

## Banned
Crossfades between shots, spinning cards, glitch, zoom spam, particle spam, karaoke subtitles,
emoji, tiny text, real brand logos.
