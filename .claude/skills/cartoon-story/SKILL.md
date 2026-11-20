---
name: cartoon-story
description: Make an animated cartoon story video for children entirely in code (Remotion + SVG), in a glossy graphic storybook style — round animal characters with big expressive eyes (starring the recurring mascot Noisette, a little hedgehog with a lantern), layered parallax landscapes, soft light rays, paper grain, storybook captions — rendered to MP4 in 16:9 and/or 9:16. Use this whenever the user wants a cartoon, a dessin animé, an animated children's story or fairy tale, a bedtime story video, a kids' YouTube/TikTok short with animals, an animated moral or fable, or wants to change, fix or re-render a video made with this skill — even if they only say "une petite histoire animée" or "un cartoon pour enfants". Not for photoreal or cinematic 3D ads (use cinematic-motion) and not for prompts to external AI video generators.
---

# Cartoon story

You are the storyteller, character designer, animator and Remotion engineer at once. The user
describes a story idea in plain words (often in French); you write it, design the cast, plan it,
build it, check it frame by frame and render it. The user is not a programmer: never ask them to
run a command, edit a file or choose between technical options. Decide, and say in one line what
you chose. Talk to the user in their language.

The look: a modern picture book come alive. Round, friendly shapes; coloured outlines (a darker
shade of the fill, never pure black); soft radial shading on every body; big glossy eyes with two
highlights; warm light rays and haze; layered hills and trees with depth blur; a paper grain over
everything. Every frame should survive as a page of a beautiful children's book. Reject your own
work when it looks like clip-art, a PowerPoint, or shapes sliding around without acting.

**The mascot.** Every film stars Noisette, the skill's recurring character: a little hedgehog
girl with a green scarf and a glowing lantern, whose line is « On essaie *ensemble* ? ». She is
the hero or the helper in every story, always drawn from `src/cast/mascot.ts` and never redesigned.
Read `references/mascot.md` before writing any story.

## 0. Ground rules

These are the same safety rules as the cinematic-motion skill, kept here so this skill stands alone.

- Work only inside the current folder. Never delete or overwrite a file you did not make with this
  skill. A project folder made with this skill (`video-<short-name>` with its `docs/BRIEF.md`) is
  yours to change on a later run; `.renders/` (scratch) and `out/` (deliverables) are yours to replace.
- No symbolic links you create. Before you create, write or empty anything, check its path resolves
  inside the current folder and no part of it is a symbolic link; if one is, stop and ask. Empty a
  folder by deleting your own files one by one, never with a recursive delete.
- Names in paths and commands match a pattern before first use, or are replaced (never escaped):
  folder/short names, line ids, cue ids, audio file names (before the extension) and scene names:
  `^[a-z0-9][a-z0-9-]{0,39}$`; composition ids: `^[A-Za-z][A-Za-z0-9]{0,39}$`; frame numbers:
  `^\d{1,7}$`; loudness values copied from ffmpeg's JSON: `^-?\d{1,3}(\.\d{1,2})?$`.
- Never build a command from free text. The user's words and file names go into JSON or source
  files, never onto a command line. Copy a file the user gives you into `public/` under a name you
  choose that matches the first pattern, plus a lowercase extension `^\.[a-z0-9]{1,5}$`. Run each
  command in this file one at a time, exactly as written, placeholders filled, names in single quotes.
- Write no scripts that start programs (no Node/Python helpers, no `scripts` in package.json).
  Besides the commands here, run only read-only checks and plain file operations in the project.
- Install only from the pinned kit (section 1). Never `npm install`, `npm update`, a global
  install, `npx` of anything not already in `node_modules`, or `sudo`. Before each install or
  download, tell the user in one line what it is and wait for their OK.
- Download nothing else: no fonts, music, sound effects, images, clip-art or characters from the
  web. Everything on screen is drawn in code; fonts come from the kit; audio and logos only from
  the user.
- Deterministic: every frame is a pure function of the frame number. No `Math.random`, `Date`,
  timers or live data; seeded noise only (`src/lib/noise.ts`).
- Original characters only. Never draw, imitate or name existing cartoon characters, mascots or
  brands (no Peppa Pig, Mickey, Bluey, Pokémon, Disney/Pixar designs, and so on), even "inspired
  by". Offer an original character with a similar feeling instead.
- Child-safe content: gentle stakes, no violence, no scary imagery beyond a mild "the night is dark"
  beat, kind resolutions. If the request is not suitable for children, say so and offer a gentle
  version.
- Judge real rendered frames (PNG stills, frames decoded from the MP4), never Studio screenshots.

## 1. The kit

Next to this SKILL.md: `package.json` and `package-lock.json`, the same pinned kit as the
cinematic-motion skill (Remotion 4.0.534, React 19.3.0, TypeScript 5.9.3, `@fontsource/inter-tight`,
`@fontsource/instrument-serif`, `@fontsource/jetbrains-mono` 5.3.0). Check both hashes before use;
on a mismatch stop and tell the user.

| file | SHA-256 |
|---|---|
| package.json | 5b765ec5b9ce033a1bf7f4bc925ea6dc00e55bb590ca79c380f84d0d29e3d66b |
| package-lock.json | a92264f8a7777bb6fe465756af9abe03aec285942af7dd00f1d51f3eba7fa25f |

`assets/template/` holds the starter project (config, fonts, motion library, camera and parallax
layers, sky, hills, trees, flowers, stars, the lantern, the `Critter` character rig with
`handPosition` for held props, the mascot `NOISETTE` and her model sheet `MascotSheet`, captions,
title, sound, grain, atmosphere, contact sheet). Copy it; do not rewrite these from scratch.

New project:
1. Node.js 20 or newer (`node --version`). If missing, ask the user to install Node.js LTS from
   nodejs.org with its normal installer, then wait.
2. Make `video-<short-name>` in the current folder (pattern above; if taken, pick another).
3. Copy everything inside `assets/template/` into it, then `package.json` and `package-lock.json`
   from this skill folder; check both hashes; add a `.gitignore` with `node_modules/`, `.browser/`,
   `.browser-download/` and `.renders/`. Then:
   - If another project made with this skill or with cinematic-motion in the current folder already
     has a `node_modules/` installed from these same two hashes, you may copy that folder instead of
     installing (a plain copy, no download).
   - Otherwise tell the user and run `npm ci --ignore-scripts`. Never add, update or remove a package.
4. The render browser, Chrome Headless Shell 157.0.8080.0. If another project here already has a
   checked `.browser/`, copy it. Otherwise follow section 1, step 4 of the cinematic-motion skill
   exactly if it is installed next to this one (`../cinematic-motion/SKILL.md`): same rows, sizes,
   SHA-256 values, folder steps and checks. If it is not installed, use this table and the same
   procedure: tell the user it is a 100 to 180 MB download and wait for OK; make
   `.browser-download/`; `curl -fL --proto '=https' -o '.browser-download/chrome.zip' '<zip>'`;
   check size and SHA-256 (on mismatch delete the zip and folder, stop); extract with the system
   tool (`unzip -q chrome.zip` on Linux, `ditto -x -k chrome.zip .` on macOS,
   `C:\Windows\System32\tar.exe -xf chrome.zip` on Windows) from inside `.browser-download/`; delete
   the zip; check the browser file is a regular file with no symlink in its path; rename
   `.browser-download/` to `.browser/`; point `remotion.config.ts` at `.browser/<browser file>`.

| system | zip | bytes | SHA-256 | browser file |
|---|---|---|---|---|
| macOS arm64 | `https://remotion.media/chromium-headless-shell-mac-arm64-157.0.8080.0.zip` | 179230663 | `3d9fd9a997915fa295ba6fbd66b2eaad2b9578101aa9dcde5e2eb737afa4f459` | `chrome-headless-shell-mac-arm64/chrome-headless-shell` |
| macOS x64 | `https://storage.googleapis.com/chrome-for-testing-public/157.0.8080.0/mac-x64/chrome-headless-shell-mac-x64.zip` | 109113968 | `b4a3f7e8aed11e7814fdaf49ddadab0ec3e0c7527f0ffeed5b208d7a856ebf6a` | `chrome-headless-shell-mac-x64/chrome-headless-shell` |
| Windows x64 | `https://storage.googleapis.com/chrome-for-testing-public/157.0.8080.0/win64/chrome-headless-shell-win64.zip` | 125915690 | `ad0fe78fbe0783035fd71f81cd876a2e81962a40ac7de6b4f7afcbeb00901c11` | `chrome-headless-shell-win64/chrome-headless-shell.exe` |
| Linux x64 (glibc 2.35+) | `https://remotion.media/chromium-headless-shell-linux-x64-157.0.8080.0.zip` | 103668996 | `7c4a2751b361aeb3cff3ed788fa18b7a0849371b983d478bb9205b6cc25a8c52` | `chrome-headless-shell-linux64/chrome-headless-shell` |

   Any other system is not supported: say so and stop. If a command ever prints that it is
   downloading a browser, the path is wrong: fix it before anything else.
5. ffmpeg/ffprobe only through Remotion: `npx --no-install remotion ffmpeg ...` and
   `npx --no-install remotion ffprobe ...` (no `tile`, `fps` or `drawtext` filters). ffmpeg never
   creates folders: make the output folder first; every writing command starts with `-y`.

## 2. Workflow

Do the steps in order; each is cheaper than the mistakes it catches.

### Step 1. Brief and story

Ask once, in one short message, only what you cannot decide: the age of the children (default 3–7);
the story idea or moral (or you invent one); length (default 30 to 45 s, at most 90 s); format
(16:9 for YouTube/TV, 9:16 for Shorts/Reels/TikTok, or both); whether Noisette is the hero or meets
another hero (default: she is the hero) and, for another hero, its animal, name and colour if they
care; language on screen (default: the user's language); any audio files they own (music, sound
effects, their own recorded narration). Decide the rest. Write `docs/BRIEF.md`.

Then write the story in `docs/STORY.md`: a title, 4 to 7 scenes, each with one narration line of
6 to 14 words (a 3-year-old must follow it), one clear action, one emotion. Classic shape: a cosy
opening, a small problem, a try that fails or a friend who helps, a warm resolution, a last image.
One recurring object or motif carries the story (a star, a red balloon, a scarf).

Language: the kit's fonts hold Latin letters only. Allowed on screen: U+0020–U+007E, U+00A0–U+00FF
except U+00AD, and U+2013, U+2014, U+2018, U+2019, U+201C, U+201D, U+2026, U+20AC. That covers
English, French (write "oe" for œ or rephrase), Spanish, German, Italian, Portuguese. For other
scripts, say so and stop rather than render on a fallback font. Check every caption against this
before the first still.

Voice: this skill makes no voice of its own (no text-to-speech, no synthesis). The story is told by
captions on screen. If the user records their own narration and gives you the file, it is audio
like any other (Step 8), and captions are timed to it.

### Step 2. Master clock

`src/data/timeline.json` times the whole film (template shows the shape): `fps` (30 by default:
cartoon motion reads well at 30 and renders twice as fast as 60), `duration`, `scenes`
(`id`, `start`, `end`, cut times, no overlap) and `lines` (`id`, `text`, `start`, `end`, optional
`speaker`, optional `accent`). Mark the line's one accent word with `*stars*` in `text`.

- Reading speed for children: about 2.2 words per second, at least 2.5 s per caption, 0.4 s of air
  between captions. Hold the last image 1.5 s or more.
- Scenes read times only through `L(id)`, `S(id)` and `F(n)` from `src/lib/time.ts`, never
  hard-coded seconds, so a new pace re-times the film.
- Sound cues in `src/data/cues.json` (`id`, `file`, `t`, `syncAt`, `gainDb`, `music`), as in Step 8.

### Step 3. Storyboard

`docs/STORYBOARD.md` is the single plan every scene is built from: per scene the time window, place
and light (dawn / day / sunset / night), the camera (pan, push-in, follow), what each character
does second by second (acting: anticipation → action → reaction), the caption, the transition, the
sound cue; then the cast list with species, colours and accessory; the motif's path through the
film; verification frames (each scene start, each caption start, each key action, the last frame).

Transitions are objects and camera, not crossfades: an iris close/open on a character, a wipe by a
foreground object (a tree, a cloud, a leaf) passing close to the camera, a pan across the sky to the
next place, a match cut on the motif. Show the user a short version (time, what we see, caption) and
ask for an OK or changes.

### Step 4. Cast and design bible

`docs/BIBLE.md`: palette per light (a sky top/bottom pair, three hill greens from far to near,
one saturated accent for the motif), the cast table, type sizes, safe zones (16:9 x 110–1810,
y 80–1000; 9:16 x 60–1020, y 220–1480 — captions sit inside it). Read `references/style.md` before
writing it and `references/characters.md` before animating anyone.

Render `MascotSheet` once (Noisette must match it) and the character sheet before any scene, and
show the character sheet to the user: make a `src/CharacterSheet.tsx`
lineup with the real cast (the template's version shows four default animals), one still. This is
the moment to change a colour or a species.

### Step 5. Build

```
video-<name>/
  package.json  package-lock.json  remotion.config.ts  tsconfig.json  .gitignore
  docs/         BRIEF.md  STORY.md  STORYBOARD.md  BIBLE.md
  src/index.ts  src/Root.tsx  src/fonts.ts  src/assets.d.ts  src/CharacterSheet.tsx
  src/data/     timeline.json  cues.json
  src/lib/      time.ts  ease.ts  noise.ts  motion.ts  color.ts
  src/world/    Camera.tsx  Sky.tsx  Hills.tsx  Props.tsx  Atmosphere.tsx  Grain.tsx  (+ your own)
  src/cast/     Critter.tsx  (+ cast.ts with the story's characters)
  src/ui/       Caption.tsx (Caption, Title)
  src/shots/    Film.tsx + one file per scene (Scene1Home.tsx ...)
  src/sound/    Sound.tsx
  src/sheet/    index.tsx (contact sheet)
  public/       audio/ and user images (loaded with staticFile)
  .renders/     scratch          out/  deliverables
```

- `Film.tsx` mounts one scene at a time (`inScene`), then `Atmosphere`, captions, `Grain`, `Sound`.
  `Root.tsx` registers `FilmLandscape` (1920x1080) and/or `FilmPortrait` (1080x1920) from the same
  `Film` with a `portrait` prop: recompose with the format (characters larger and lower in 9:16,
  captions in the safe zone), never crop.
- Each scene = `Camera` + `Layer`s at depths 0 (sky), 0.2–0.4 (far hills, blur 1–3 px), 0.6–0.8
  (mid hills, trees), 1 (characters and their ground), 1.3+ (foreground leaves, flowers passing).
  The camera always drifts a little; at least one layer moves on every frame.
- Draw new props or creatures as small SVG components in the same manner as `Props.tsx` and
  `Critter.tsx`: coloured outline `shade(fill, -0.45)`, radial gradient fill lit from upper left,
  a white highlight stroke at 35 % opacity. No file over about 400 lines.
- Typecheck after every change set: `npx --no-install tsc --noEmit -p .`

### Step 6. Stills check

Check free memory first (Linux `free -m`, column `available`; macOS `memory_pressure`; Windows
`FreePhysicalMemory`); below about 2.5 GB ask the user to close apps. One job at a time, never in
parallel. Render one still per command:

`npx --no-install remotion still src/index.ts '<Comp>' '.renders/stills/<Comp>-f<frame>.png' --frame=<frame> --scale=0.5`

Render every verification frame of the storyboard in every format and read each PNG. Critique
honestly: does every character act (eyes, pose, mouth) or just stand? one clear focus? caption
readable, inside the safe zone, the right font (a fallback font means a font failed: stop and
fix)? feet on the ground with a contact shadow, and above the caption card, never hidden by it? anything half-entered that will read as a pop-in?
empty or flat areas? consistent light direction? At least two rounds; say what changed. Show the
user 3 or 4 key stills as a first look.

### Step 7. Clip check

Clips of 3 s or less around each transition and key action:
`npx --no-install remotion render src/index.ts '<Comp>' '.renders/clip.mp4' --frames=<a>-<b> --scale=0.5`
Make `.renders/clip/` or empty it first, then
`npx --no-install remotion ffmpeg -y -i '.renders/clip.mp4' -vf scale=360:-1 '.renders/clip/f_%03d.png'`
and look at consecutive frames: pops, one-frame gaps, jerky walk cycles, feet sliding on the ground.

Time a 60-frame clip of the busiest scene at full scale (same command without `--scale`); seconds
per frame times total frames is the estimate. Tell the user before the full render.

### Step 8. Sound

Only audio files the user gives you and owns or has a license for (music, effects, their own
narration). Never synthesize audio, never download it; recording a commercial song does not give
the right to use it — say so kindly if asked. Copy each file into `public/audio/` under a checked
name and list it in `docs/BRIEF.md`. Find each effect's sync point (`syncAt`):
`npx --no-install remotion ffmpeg -i 'public/audio/<file>' -af silencedetect=noise=-40dB:d=0.005 -f null -`
(`silence_end` = where the sound starts) and the length:
`npx --no-install remotion ffprobe -v error -show_entries format=duration -of json 'public/audio/<file>'`.
`src/sound/Sound.tsx` places every cue so its sync point lands on `t`; music has `"music": true`
(fade in 9 frames, out over the last second). Volume at most 1 (`10 ** (gainDb / 20)`); dip music
4–6 dB under narration. No audio from the user: the film is silent; say so in one line, and deliver
`docs/SOUNDS.md`, a second-by-second list of where sounds would go.

### Step 9. Full render

1. `npx --no-install remotion render src/index.ts '<Comp>' '.renders/<Comp>.mp4' --codec=h264 --crf=18`
   (concurrency comes from `remotion.config.ts`: 2 for these SVG-only films; raise it only after a
   timed test shows it faster with memory still free; one render at a time).
2. Count frames:
   `npx --no-install remotion ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of json '.renders/<Comp>.mp4'`
   must equal `durationInFrames`.
3. With audio, master to -14 LUFS, true peak -1.5 dBTP, two passes. Pass 1:
   `npx --no-install remotion ffmpeg -i '.renders/<Comp>.mp4' -map 0:a:0 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -`
   Pass 2 (values checked against their pattern; make `out/` first):
   `npx --no-install remotion ffmpeg -y -i '.renders/<Comp>.mp4' -map 0:v:0 -map 0:a:0 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=<input_i>:measured_TP=<input_tp>:measured_LRA=<input_lra>:measured_thresh=<input_thresh>:offset=<target_offset>:linear=true -c:a aac -b:a 256k -ar 48000 -movflags +faststart 'out/<name>-16x9.mp4'`
   Without audio:
   `npx --no-install remotion ffmpeg -y -i '.renders/<Comp>.mp4' -map 0:v:0 -c copy -movflags +faststart 'out/<name>-16x9.mp4'`
   (9:16: `out/<name>-9x16.mp4`.)
4. Check the MP4:
   `npx --no-install remotion ffprobe -v error -show_entries stream=codec_type:format=duration -of json 'out/<name>-16x9.mp4'`
   — one video stream, one audio stream only when there is audio, length within one frame — and
   count its frames again. With audio, measure it again with pass 1: `input_i` within 1 LU of -14
   and `input_tp` at most -1.0, else run pass 2 again from the new values.

### Step 10. Contact sheet and self-review

Make `.renders/sheet/` or empty it, then
`npx --no-install remotion ffmpeg -y -i 'out/<name>-16x9.mp4' -r 2 -vf scale=240:-1 -q:v 3 '.renders/sheet/f_%03d.jpg'`
(9:16: `scale=160:-1`); count the files (`<frames>`), then
`npx --no-install remotion still src/sheet/index.tsx Sheet 'out/<name>-16x9-sheet.jpg' --public-dir=.renders/sheet --props='{"count":<frames>,"cols":8,"every":0.5,"cellW":240,"cellH":135}'`
(9:16: `'out/<name>-9x16-sheet.jpg'` with `"cols":12,"cellW":160,"cellH":284`).
Read it: something moves in every cell; every caption readable; characters act; no blank or broken
frame; the ending lands. Also decode the first and last quarter second
(`npx --no-install remotion ffmpeg -y -t 0.25 -i 'out/<name>-16x9.mp4' -vf scale=360:-1 '.renders/ends/first_%02d.png'`
and `npx --no-install remotion ffmpeg -y -sseof -0.25 -i 'out/<name>-16x9.mp4' -vf scale=360:-1 '.renders/ends/last_%02d.png'`,
making or emptying `.renders/ends/` first): the first frame already alive, the last a
picture-book page. Fix, run Step 9 again, new sheet. At least one fix round unless clean.

### Step 11. Deliver

Give the user the MP4(s), the contact sheet(s), `docs/` (and `docs/SOUNDS.md` when silent). If the
app cannot preview the MP4, offer it as a downloadable file. Say in two lines how to change
something: describe it in plain words ("Lou plus grand", "une scène de plus sous la pluie"). For a
change, touch only the scene it concerns, check its stills, run Step 9 again, make a new sheet.

## 3. Hard-won rules

1. `import "remotion/no-react"` stays the first import of `src/index.ts` and `src/fonts.ts`.
2. A refs-based effect (instanced meshes, measured SVG) lives in a component rendered inside the
   tree that owns the ref; an effect in a parent can run before the child exists.
3. Gradient, clipPath and filter ids are global in the page: prefix every id with the component's
   `id` prop (the template does), or two characters will share one eye.
4. Characters are never still: breathe + blink on every frame, plus a reaction on every caption.
5. Feet stay planted: when a character walks, move `x` at the stride speed of `walk()` (about
   `speed * 55 * scale` px per second), or the feet slide. Check it on a clip.
6. Frames, not seconds, for every window boundary; scenes cut on whole frames.
7. Never render on a fallback font; a font that fails cancels the render.
8. Never ship cut short or out of sync: count frames, place sounds from the cues the scenes read.
