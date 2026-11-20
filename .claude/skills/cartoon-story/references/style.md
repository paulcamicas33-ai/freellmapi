# Style guide — glossy storybook cartoon

Read this before writing `docs/BIBLE.md`.

## Contents
1. The look in one paragraph
2. Light and palettes
3. Shapes, outlines, shading
4. Places (backgrounds)
5. Camera and staging
6. Type and captions
7. Story craft for small children
8. Banned

## 1. The look
A modern picture book come alive, the polished "AI storybook" finish people expect today: soft
volumes rather than flat fills, glowing light sources, gentle depth blur, rich warm colour, paper
grain. Characters are round, big-headed (head about 45 % of the height) and big-eyed. Nothing is
pure black or pure white: outlines are dark shades of their fill, highlights are warm cream.

## 2. Light and palettes
One light per scene, always from the same side for every object (default upper left), and it
matches a visible source (sun, moon, lamp, the glowing motif). `Atmosphere` puts rays and haze at
that source. Pick one palette per light; the motif's accent colour appears nowhere else.

| light | sky top → bottom | far → mid → near hills | atmosphere colour | accent ideas |
|---|---|---|---|---|
| dawn | #9fb8e8 → #ffd6c0 | #b9a7c9 → #9cc48a → #7db36a | #fff0d9 | #ff8a5c |
| day | #7cc4f2 → #dff3ff | #a8d0b8 → #8fc26a → #6fae55 | #fffbe6 | #ff5d73 |
| sunset | #ff9e6b → #ffe2b3 | #c98b6b → #a9a85f → #6f9a4f | #fff1c9 | #3d7dd8 |
| night | #10183a → #3a3f78 | #2b3466 → #24485a → #1d3b45 | #cfd8ff | #ffd166 |

At night, keep characters readable: raise their fill a notch, add a rim of moon colour (a light
stroke on the moon side) and a warm glow around the motif that lights faces near it.

## 3. Shapes, outlines, shading
- Outline: `shade(fill, -0.45 to -0.5)`, 4–6 px at scale 1, round joins.
- Fill: radial gradient lit from upper left (`shade(fill, +0.28)` → fill → `shade(fill, -0.22)`).
- Highlight: one white stroke at 35–40 % opacity along the lit top edge.
- Contact shadow: a soft dark ellipse under every grounded thing (22 % opacity).
- Squash and stretch on every landing, jump and surprise, volume preserved (`sx = 1 / sy`).

## 4. Places
A place, not a background: sky (gradient + light + clouds or stars), 2–3 hill bands at different
depths (far ones blurred 1–3 px), trees and bushes on the mid layer, the ground the characters
stand on at depth 1, and one foreground element (grass, flowers, a branch) at depth 1.3+ that
passes the camera. Clouds and stars drift; trees sway; grass bends. Reuse `Sky`, `Hill`, `Tree`,
`Bush`, `Flower`, `Star`; draw new things (a house, a pond, a moon with a face) in the same manner.

## 5. Camera and staging
- Fixed zoom per shot; move the camera instead of zooming fast. Gentle push-ins (zoom 1 → 1.1) on
  emotional beats, pans to follow a walk, a tilt up to the sky for wonder.
- Stage for silhouettes: characters in three-quarter view, never overlapping faces, eye-lines
  toward each other or toward the motif.
- 16:9: the ground line the characters stand on sits at about 72–78 % of the height, so their feet
  stay above the caption card (which covers roughly y 880–1010). Caption card at the bottom. 9:16 (ground line at about 55–58 % of the height): characters larger
  in the middle band, caption card above the platform UI zone (bottom 470 px stays clear).

## 6. Type and captions
- Captions: Inter Tight 800, 50 px (16:9) / 58 px (9:16) on a cream paper card; one accent word in
  Instrument Serif Italic in the accent colour. At most two lines.
- Title card: Inter Tight 900, 140–180 px, letters popping in one by one with a coloured drop.
- Nothing read under 34 px (9:16) or 28 px (16:9).

## 7. Story craft for small children
- One hero, one want, one small problem, one helper or idea, one warm ending.
- Repetition is a gift: a phrase or action that comes back three times.
- Show feelings on faces: surprise = eyebrows up, eyes wide (lookY -0.3), mouth "o"; sad = brows
  down at the outside, head tilt, look down; joy = squash-bounce, eyes closed in a smile (blink 1 +
  smile 1), arms up.
- End on a calm, beautiful picture held 1.5–2 s (bedtime-friendly).

## 8. Banned
Existing characters or brands; scary, violent or mocking content; crossfades between scenes;
spinning text; glitch; emoji; karaoke-style word highlighting; tiny text; pure-black outlines;
frozen characters; real logos (unless the user's own, for their own brand).
