# Storyboard — Ocrea (16:9, 1920x1080, 60 fps, 28.0 s = 1680 frames)

Canonical shot plan. Scenes read times from `src/data/timeline.json` via `L(id)`; frames below are
`toFrame(seconds)` at 60 fps, for reference only.

## Act table

| act | line id | time (s) | frames | place | hero | colour | music |
|---|---|---|---|---|---|---|---|
| 1 | mark | 0.0–4.0 | 0–240 | black void, dust | amber swoosh + 3D wordmark OCREA | black, amber | silent |
| 2 | rise | 4.0–8.0 | 240–480 | warm haze, floor glow | phone with amber rim, 5 orbiting video slabs | brown, terracotta, amber rim | silent |
| 3 | prompt | 8.0–14.0 | 480–840 | phone screen, close | prompt UI: card, typing, send, shot grid | dark UI, amber | silent |
| 4 | route | 14.0–18.6 | 840–1116 | dark 3D city of blocks | amber route + rising shot tiles | black, amber line | silent |
| 5 | box | 18.6–22.6 | 1116–1356 | varnished dark wood table | product box, light trail, lid | brown wood, amber spill | silent |
| 6 | line | 22.6–25.4 | 1356–1524 | warm bloom haze | big type, accent "cinéma" | cream type, amber accent | silent (contrast beat) |
| 7 | cta | 25.4–28.0 | 1524–1680 | dark, dust | swoosh logo + glass CTA slab | black, amber | silent |

## Object chain (transitions are light and objects, never crossfades)

1. The swoosh's bright head keeps travelling after the logo is done and becomes a **light streak
   across black** (3.6–4.2 s); the streak's glow becomes the phone's amber rim light.
2. Camera **travels into the phone screen** (7.5–8.2 s): the screen fills the frame and becomes act 3.
3. The finished shot grid goes into an **amber defocus** (13.4–14.2 s): bokeh discs settle into the
   city's street lights seen from above.
4. The route's end point flares; the camera follows the flare down; it becomes the **light trail**
   that draws the logo on the box (18.4–19.0 s).
5. The lid opens and **warm light blooms out of the box** (21.0–22.8 s), filling the frame; the type
   of act 6 is revealed out of that bloom.
6. The accent sheen of act 6 sweeps off-screen and the **swoosh redraws** for act 7.

## Per line

### 1. `mark` — "Ocrea" — 0.4–3.6 s, accent 2.2 s (frame 132)
- Camera: slow dolly-in from z 9 to z 7, slight rise, roll 0 → -1°, moving from frame 0.
- Swoosh (3D tube mesh, emissive amber, thickness 0.06): draws itself 0.3–1.6 s along its curve (E3
  path reveal), bright head with a short motion-blur window.
- Wordmark OCREA (5 extruded 3D letters, depth 0.25, terracotta-bronze material lit by the key
  light): each letter rises out of the haze below the swoosh, stagger 4 frames, 1.2–2.2 s (E1),
  last letter lands on the accent at 132.
- Accent: rim light flash along the letters at 132.
- Exit: swoosh head leaves right as a streak 3.6–4.2 s; letters sink into darkness (exit ease).
- Done when: letters thick and lit from upper left; swoosh continuous; motion from frame 0.

### 2. `rise` — "Votre prochain film tient dans la *main*." — 4.2–7.8 s, accent 6.4 s
- Camera: low orbit around the phone, 15° arc, slight push.
- Phone (rounded box, depth 0.18, dark glass front, amber rim light from behind right): rises from
  below frame 4.1–5.0 s (E1).
- 5 video slabs (boxes 1.6x0.9x0.08 with gradient "frames" on the front): emitted from behind the
  phone (E2) 4.6–5.4 s, stagger 5 frames, orbit on a tilted ellipse, passing in front and behind.
- Type, left third: "Votre prochain film tient dans la" + italic "main", mask reveal per line (E3).
- Accent at "main": rim light swells.
- Transition: camera travels into the screen 7.5–8.2 s (E5).

### 3. `prompt` — "Une image. Une phrase. *Envoyer*." — 8.2–12.6 s, accent 11.2 s (send press)
- Screen UI (DOM, rendered flat in a perspective container that follows the act camera; 1:1 when read).
- 8.4–9.0 s: reference card (warm landscape thumbnail) drops into the prompt box from above (E1,
  slight 2 % overshoot).
- 9.0–10.6 s: the sentence "Un road trip au coucher du soleil, en 35 mm." types in, mono font, caret.
- 10.7–11.2 s: camera whips to an extreme tilted close-up of the send button (roll 12°); press
  at 11.2 s (button depresses 6 px, amber flash ring).
- 11.6–13.4 s: screen fills with a 3x3 grid of shot tiles unfolding from the button (E2), progress
  bar 0 → 100 %.
- Overlay text: "Une image. Une phrase." top-left, "Envoyer" accent italic amber at 11.2 (E3).
- Transition: amber defocus 13.4–14.2 s.

### 4. `route` — "Chaque plan trouve sa *place*." — 14.2–18.4 s, accent 16.8 s
- Camera: starts overhead (top-down), descends on a spline to a low three-quarter view by 17.4 s.
- City: ~140 dark blocks (instanced boxes, varied heights, seeded), lit by the key light from upper
  left, amber window dots.
- Route: amber emissive tube drawing from start to finish 14.6–16.8 s (E3), end flare at 16.8.
- Shot tiles (thick slabs) rise out of the street along the route as the head passes (E2), stagger 6.
- Type, left: mask reveal.
- Transition: end flare becomes the box's light trail (18.2–18.8 s).

### 5. `box` — "Prêt à *ouvrir*." — 18.8–22.2 s, accent 21.0 s
- Camera: slow push-in at table height, slight lateral drift.
- Wood table (plane, varnished brown with specular streak), box (dark terracotta, lid separate mesh).
- Light trail draws the swoosh logo on the lid 18.8–20.2 s (E3).
- Lid hinges open 20.4–21.0 s, warm light spills out at 21.0 (accent), lights the camera haze.
- Transition: bloom out of the box 21.4–22.8 s fills frame.

### 6. `line` — "Tout le *cinéma*, sans le plateau." — 22.8–25.2 s, accent 23.4 s
- Contrast beat: slower, quiet, just type in warm haze.
- Hero type 150 px Inter Tight 900, "cinéma" Instrument Serif Italic amber; mask reveal word by
  word (E3), sheen sweep across "cinéma" at 23.4.
- Exit: the sheen continues off right as the act ends.

### 7. `cta` — "Créez votre premier film — gratuit" — 25.6–28.0 s, accent 26.4 s
- Swoosh redraws (E3) 25.4–26.2 s with wordmark "Ocrea" text beside it.
- Thick glass slab (DOM glass with 3D-looking edge highlight) rises under it (E1) 26.0–26.6 s,
  CTA text inside; specular sweep at 26.4.
- Last 0.5 s: hold, poster-quality frame, dust still drifting.

## Camera key lists (one continuous path per act, eased (0.65,0,0.35,1), drift always on)
- A1: pos (0,0.2,9) → (0.3,0.4,7.0); target (0,0.3,0).
- A2: orbit angle -10° → +8°, radius 6.5 → 5.6, height 0.4 → 0.8; target phone centre. 7.5–8.0 s
  push to radius 1.6 into the screen.
- A3: flat UI, perspective camera on the UI plane: tilt 8° → 4° drift; 10.7–11.2 s to the
  send-button close-up (scale 3.2, roll 12°), 11.4–11.8 s back out to full screen.
- A4: pos (0,26,0.1) → (-6,4,10) via (−2,16,6); target route centre.
- A5: pos (2.4,1.5,5.5) → (1.2,1.2,3.6); target lid.
- A7: pos (0,0,8) → (0,0.1,7.2).

## Motion-blur windows
- A1 swoosh head 0.3–1.6 s and streak 3.6–4.2 s.
- A3 whip to the send button 10.7–11.2 s.
- A4 route head 14.6–16.8 s (head only).

## Pop-in audit
| element | entrance |
|---|---|
| swoosh (A1, A7) | E3 path reveal |
| OCREA letters | E1 out of haze |
| phone | E1 rises into frame |
| video slabs | E2 emitted from behind phone |
| A2 type | E3 mask |
| reference card | E1 drop |
| typed text | E2 emitted by caret |
| send flash ring | E2 from button |
| shot grid | E2 unfolds from button |
| progress bar | E2 from grid |
| city | E5 camera arrives (out of defocus) |
| route | E3 path reveal |
| route tiles | E2 rise from street |
| box / table | E5 camera arrives (out of the flare) |
| logo trail on box | E3 |
| A6 type | E3 mask out of the bloom |
| CTA slab | E1 rises from depth |

## Verification frames (stills)
Line starts: 24, 252, 492, 852, 1128, 1368, 1536. Accents: 132, 384, 672, 1008, 1260, 1404, 1584.
Transitions: 228, 468, 816, 1104, 1320, 1530. Mid-act: 60, 330, 600, 760, 940, 1200, 1460, 1650,
last 1679.
