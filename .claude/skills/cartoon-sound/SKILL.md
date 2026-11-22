---
name: cartoon-sound
description: Create original, royalty-free sound for videos entirely from code — cartoon sound effects (pop, boing, ding, chime, sparkle, whoosh, plouf, splat, squeak, hic, ta-da, riser, bubbles, footsteps, typing, xylophone notes) and gentle music beds (day, dance, night lullaby, snow) — with a Python standard-library synthesizer (nothing to install, nothing downloaded), then place, mix and master them in a Remotion video at -14 LUFS. Use this whenever a video made with cartoon-story or cinematic-motion needs sound or music and the user has no audio files, or the user asks to "add sound", "mettre du son", "bruitages", "une musique", "sound effects", even if they don't name this skill. Also gives the characters French voices with Piper (offline text-to-speech, installed once with the user's OK). Never for singing or copying an existing song.
---

# Cartoon sound

You are the sound designer. The user is not a programmer: never ask them to run anything. Every
sound here is **made from maths** by `scripts/synth.py` (oscillators, filtered noise, plucked
strings, bells, a small reverb), so it is original and free of rights. No install, no download.

## Rules
- Python standard library only. Run the script with `python3 -I`, from the project folder, with
  paths inside the project. Never `pip install`, never fetch audio from the web.
- Never imitate or rebuild a recognisable existing song, jingle or melody (no « Joyeux
  anniversaire », no famous lullaby): the music beds are generated chord loops and melodies.
- Voices come from Piper (section 1b) or from the user's own recording, never from a cloned real
  person's voice.
- Deterministic: same command, same file. Re-running replaces only files this skill made.
- Names follow the cartoon-story patterns (`^[a-z0-9][a-z0-9-]{0,39}$` + `.wav`).

## 1. Make the sounds
From the video project folder (make `public/audio/` first):

- The whole effects kit (about 30 WAV files, a few seconds):
  `python3 -I '<skill>/scripts/synth.py' sfx 'public/audio'`
- A music bed as long as the film (style: `day`, `dance`, `night`, `snow`; ~10 s of work for 36 s):
  `python3 -I '<skill>/scripts/synth.py' music '<style>' '<seconds>' 'public/audio/music-<style>.wav'`
- `python3 -I '<skill>/scripts/synth.py' list` prints the effect names.

| effect | use it for |
|---|---|
| `sfx-pop` | a word or object popping on screen |
| `sfx-boing` | a jump, a hop, a bounce |
| `sfx-ding`, `sfx-chime` | a title badge, a good idea, « bonjour » |
| `sfx-sparkle`, `sfx-shimmer`, `sfx-magic` | stars, glows, something magical |
| `sfx-whoosh`, `sfx-whoosh-fast` | camera moves, wipes, flying objects |
| `sfx-plouf`, `sfx-splat`, `sfx-bubbles` | water, a fall, bubbles |
| `sfx-squeak` | Pistache's signature « couic » |
| `sfx-hic` | a hiccup |
| `sfx-tada` | a success, the end card |
| `sfx-riser` | tension rising to a reveal (sync on its END) |
| `sfx-steps`, `sfx-thump`, `sfx-flutter`, `sfx-click`, `sfx-tick`, `sfx-typing` | walking, landing, leaves, buttons, the end-card bubble |
| `sfx-xylo-1` … `sfx-xylo-8` | counting: one rising note per number |

Style guide for music: `day` (ukulele + bells, 112 BPM) for meadows and beaches; `dance` (with a
light beat, 124 BPM) for dance and races; `night` (music box lullaby, 3/4) for night and bedtime;
`snow` (soft pad + bells) for winter.

## 1b. Voices (Piper, offline)
Install once, after telling the user in one line and getting their OK (about 50 MB + 60–75 MB per
voice): a virtual environment `.tools/piper/` in the current folder (`python3 -m venv .tools/piper`
then `.tools/piper/bin/pip install piper-tts`), and the French voices from
`https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/<name>/medium/<file>` into
`.tools/voices/`: `fr_FR-tom-medium` (narrator), `fr_FR-siwis-medium` (Noisette),
`fr_FR-upmc-medium` (speaker 0 « jessica », Pistache) — each `.onnx` and `.onnx.json`. The
network needs `huggingface.co` and its file server (`us.aws.cdn.hf.co`). Put a `.gitignore`
containing `*` inside `.tools/` (never edit the user's own `.gitignore`).

Write the episode's caption lines to a JSON file (`[{id, text, speaker?}]`, the same text as the
captions), then:
`python3 -I '<skill>/scripts/voice.py' '.tools/piper/bin/piper' '.tools/voices' '<lines.json>' 'public/audio' 'voice-<episode>'`
It prints each line's length. **Everything written on screen is read aloud, starting the moment
it appears** (the user asked for this): the title card (narrator), every caption, every pop word
(list them in the episode's `extraVoices`, with the same words as on screen) and the end card
(Noisette). `voiceTrack(ep)` in the season engine builds that list; write it to the JSON with its
times and check that no voice runs into the next one (keep 0.1 s of air), else shorten or re-time.
Profiles (in `voice.py`, childlike, soft and even, as the user asked): narrator = Jessica ×1.1,
Noisette = Siwis ×1.25, spoken slowly (length scale 1.18, the user found her too fast) (a little girl), Pistache = Tom ×1.42 (a small boy mouse). Every line is
processed to be soft, continuous and « angelic » (what the user asked for): anti-alias filter before
the pitch is raised (that aliasing sounded saturated), cubic resampling, gentle 2:1 compression,
the last 220 ms of every line glide down softly like a human voice (never a hard stop), a small
airy room, the same loudness for every line (RMS -22 dB) and a soft ceiling. Keep it that way
unless the user asks. Each file ends with a 0.35 s room tail: allow it when checking overlaps. Pitch is raised without changing speed. In the season engine set
`voicePrefix: "voice-<episode>"`; the music ducks 9 dB under voices.

## 1c. Listen before delivering (Whisper) — never skip
Claude cannot hear. The user found words swallowed (« a le hoquet » → « a l'hoquet »), an ugly pitch
rise after « … », and muffled consonants — none of which volume and length checks can catch. So
every voice line is checked by an ear before any render:
- Install once, with the user's OK: `python3 -m venv .tools/whisper` then
  `.tools/whisper/bin/pip install faster-whisper`; the `small` model downloads into
  `.tools/whisper-models` on first use (needs `huggingface.co` and its file server).
- Generate AND check in one go (it retries each failing line up to 4 times — Piper varies a
  little between runs — and keeps the best take):
  `.tools/whisper/bin/python -I '<skill>/scripts/voice_qc.py' '.tools/piper/bin/piper' '.tools/voices' '.tools/whisper-models' '<lines.json>' 'public/audio' 'voice-<episode>'`
  `check.py` alone re-checks existing files.
- A line passes when Whisper's transcript matches the text (score ≥ 0.8, no content word missing,
  near-homophones such as « hockey » for « hoquet » accepted) and there is no sustained pitch jump
  of more than 11 semitones. One-word lines (« Un ! ») are too short to grade.
- When a line still fails: respell the word for the voice in `PRONOUNCE` (voice.py) — e.g.
  « hoquet » → « ho-quet », « cerf-volant » → « cerfvolant » — or rephrase the caption. Never use
  « … » in a line the voice must read naturally (it is said as a full stop now). Read the
  remaining failures yourself: Whisper's own mistakes on names and homophones are not voice faults.

## 2. Place them
Cue every effect from the same times the scenes use (the caption and action times of the
storyboard), so picture and sound cannot drift. `syncAt` is the moment inside the file that must
land on the action: 0 for every effect here except `sfx-riser` (its length, 1.6 s).
- cartoon-story season engine: an episode takes `music: { file, gainDb }` and
  `cues: [{ file, t, syncAt?, gainDb? }]`; `engine/sound.ts` gives `commonCues(endAt, duration)`
  (badge ding, end-card ta-da, typing bubble) and `countCues(times)` (rising xylophone notes).
  The music is ducked 5 dB under every caption automatically.
- Starting levels that work (the engine also trims every effect by 9 dB, the user found them too
  loud): voices 0 dB; music -9 dB; main hits -4 to -6 dB; ambience and steps -10 to -16 dB.

## 3. Mix and master
Render, then master exactly like the cinematic-motion skill, Step 9: loudnorm pass 1 (measure),
pass 2 with the measured values (each checked against `^-?\d{1,3}(\.\d{1,2})?$`) into `out/`,
adding `-t <seconds>` so the AAC tail does not make the file longer than the film. Measure the
result again: `input_i` within 1 LU of -14 and `input_tp` at most -1.0, else run pass 2 again from
the new values. Check one video and one audio stream and the frame count.

## 4. Tell the user
Say which music style and which effects you used, that every sound was generated from code (free
of rights, nothing downloaded), and that they can ask for "plus fort", "moins de musique", "un
autre son pour le saut" in plain words.
