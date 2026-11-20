#!/usr/bin/env python3
"""Cartoon sound synthesizer — original sound effects and music beds, made from maths.

Python standard library only (no install, no download). Deterministic: the same command always
writes the same file. Every sound is original, so it is free of rights for the user.

  python3 -I synth.py sfx   <out_dir>                       # the whole sound-effect kit (WAV)
  python3 -I synth.py music <style> <seconds> <out.wav>     # style: day | night | dance | snow
  python3 -I synth.py list                                  # list sound-effect names
"""
import array
import math
import os
import random
import struct
import sys
import wave

SR = 44100
TAU = 2 * math.pi


# ---------------------------------------------------------------- basics
def buf(seconds):
    return array.array("d", bytes(8 * int(seconds * SR)))


def write_wav(path, data, peak_db=-3.0):
    peak = max(1e-9, max(abs(x) for x in data))
    g = (10 ** (peak_db / 20)) / peak
    n = len(data)
    fade = min(int(0.004 * SR), n // 2)
    out = array.array("h", bytes(2 * n))
    for i, x in enumerate(data):
        k = 1.0
        if i < fade:
            k = i / fade
        elif i > n - fade:
            k = (n - i) / fade
        out[i] = int(max(-32767, min(32767, x * g * k * 32767)))
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(out.tobytes())


def add(dst, src, at=0.0, gain=1.0):
    o = int(at * SR)
    for i, x in enumerate(src):
        j = o + i
        if 0 <= j < len(dst):
            dst[j] += x * gain


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def tone(seconds, f0, f1=None, shape="sine", attack=0.003, decay=None, vib=0.0, vib_rate=6.0, curve=1.0):
    """Oscillator with a pitch glide f0->f1, exponential decay (or linear release), optional vibrato."""
    f1 = f0 if f1 is None else f1
    n = int(seconds * SR)
    out = array.array("d", bytes(8 * n))
    ph = 0.0
    for i in range(n):
        t = i / SR
        k = (i / n) ** curve
        f = f0 + (f1 - f0) * k
        if vib:
            f *= 1 + vib * math.sin(TAU * vib_rate * t)
        ph += TAU * f / SR
        if shape == "sine":
            s = math.sin(ph)
        elif shape == "tri":
            s = 2 / math.pi * math.asin(math.sin(ph))
        else:  # soft square
            s = math.tanh(3 * math.sin(ph))
        env = min(1.0, t / attack) if attack > 0 else 1.0
        env *= math.exp(-t / decay) if decay else (1 - i / n)
        out[i] = s * env
    return out


def noise(seconds, seed, lp_from=8000.0, lp_to=None, decay=None, shape=None):
    """White noise through a one-pole low-pass whose cutoff glides; envelope exp decay or `shape`(k)."""
    rnd = random.Random(seed)
    lp_to = lp_from if lp_to is None else lp_to
    n = int(seconds * SR)
    out = array.array("d", bytes(8 * n))
    y = 0.0
    for i in range(n):
        k = i / n
        fc = lp_from + (lp_to - lp_from) * k
        a = 1 - math.exp(-TAU * fc / SR)
        y += a * (rnd.uniform(-1, 1) - y)
        env = shape(k) if shape else (math.exp(-(i / SR) / decay) if decay else 1.0)
        out[i] = y * env
    return out


def bell(seconds, f, decay=0.9, partials=((1, 1.0), (2.756, 0.45), (5.404, 0.25), (8.93, 0.1))):
    out = buf(seconds)
    for ratio, amp in partials:
        add(out, tone(seconds, f * ratio, decay=decay / ratio ** 0.5, attack=0.001), gain=amp)
    return out


def pluck(seconds, f, seed, bright=0.5):
    """Karplus-Strong plucked string (ukulele / harp)."""
    rnd = random.Random(seed)
    period = max(2, int(SR / f))
    line = [rnd.uniform(-1, 1) for _ in range(period)]
    n = int(seconds * SR)
    out = array.array("d", bytes(8 * n))
    damp = 0.996 - (1 - bright) * 0.01
    for i in range(n):
        j = i % period
        nxt = line[(j + 1) % period]
        v = line[j]
        out[i] = v
        line[j] = damp * 0.5 * (v + nxt)
    return out


def reverb(data, mix=0.25, room=0.82):
    """Small Schroeder reverb: 4 combs + 2 all-passes."""
    n = len(data)
    wet = array.array("d", bytes(8 * n))
    for d in (1557, 1617, 1491, 1422):
        ring = [0.0] * d
        for i in range(n):
            j = i % d
            y = ring[j]
            ring[j] = data[i] + y * room
            wet[i] += y * 0.25
    for d, g in ((225, 0.5), (556, 0.5)):
        ring = [0.0] * d
        for i in range(n):
            j = i % d
            b = ring[j]
            x = wet[i]
            y = -g * x + b
            ring[j] = x + g * y
            wet[i] = y
    return array.array("d", (data[i] * (1 - mix) + wet[i] * mix for i in range(n)))


# ---------------------------------------------------------------- sound effects
def sfx_pop():
    s = tone(0.12, 950, 260, decay=0.035, curve=0.6)
    add(s, noise(0.02, 1, 6000, decay=0.004), gain=0.4)
    return s


def sfx_boing():
    return tone(0.55, 140, 420, shape="tri", decay=0.22, vib=0.12, vib_rate=14, curve=0.5)


def sfx_ding():
    return bell(1.6, midi(84), decay=0.9)


def sfx_chime():
    s = buf(2.0)
    for i, n in enumerate((84, 88, 91, 96)):
        add(s, bell(1.5, midi(n), decay=0.7), at=i * 0.09, gain=0.6)
    return s


def sfx_sparkle(seed=7, seconds=0.9, n=16):
    rnd = random.Random(seed)
    s = buf(seconds + 0.3)
    for i in range(n):
        f = rnd.uniform(2600, 5200)
        add(s, tone(0.18, f, f * 1.02, decay=0.05, attack=0.001), at=i * seconds / n + rnd.uniform(0, 0.02), gain=0.5 - 0.3 * i / n)
    return reverb(s, 0.35)


def sfx_shimmer():
    return sfx_sparkle(seed=11, seconds=1.8, n=34)


def sfx_whoosh():
    return noise(0.7, 3, 250, 3200, shape=lambda k: math.sin(math.pi * k) ** 1.5)


def sfx_whoosh_fast():
    return noise(0.35, 4, 600, 5000, shape=lambda k: math.sin(math.pi * k) ** 2)


def sfx_plouf():
    s = tone(0.35, 520, 110, decay=0.12, curve=0.4)
    add(s, noise(0.6, 5, 2500, 600, decay=0.18), gain=0.8)
    for i in range(4):
        add(s, tone(0.06, 700 + 180 * i, 1200 + 200 * i, decay=0.02), at=0.12 + 0.07 * i, gain=0.25)
    return s


def sfx_splat():
    s = noise(0.4, 6, 1800, 300, decay=0.09)
    add(s, tone(0.2, 200, 70, decay=0.06), gain=0.8)
    return s


def sfx_click():
    s = noise(0.03, 8, 7000, decay=0.003)
    add(s, tone(0.03, 2200, decay=0.006), gain=0.5)
    return s


def sfx_typing():
    s = buf(0.9)
    for i, at in enumerate((0.0, 0.13, 0.31, 0.45, 0.62, 0.74)):
        add(s, sfx_click(), at=at, gain=0.55 + 0.1 * (i % 2))
    return s


def sfx_squeak():
    """Pistache's « couic »."""
    return tone(0.2, 1900, 2700, shape="tri", decay=0.09, vib=0.04, vib_rate=30, curve=0.4)


def sfx_hic():
    s = tone(0.14, 520, 900, decay=0.05, curve=0.3)
    add(s, noise(0.08, 9, 3000, decay=0.02), gain=0.3)
    return s


def sfx_tada():
    s = buf(2.2)
    for i, n in enumerate((72, 76, 79, 84)):
        add(s, bell(1.6 if i == 3 else 0.6, midi(n), decay=0.8 if i == 3 else 0.35), at=i * 0.11, gain=0.7)
        add(s, pluck(1.0 if i == 3 else 0.5, midi(n - 12), 20 + i), at=i * 0.11, gain=0.4)
    return reverb(s, 0.3)


def sfx_riser():
    s = noise(1.6, 12, 300, 6000, shape=lambda k: k ** 2)
    add(s, tone(1.6, 220, 1320, shape="tri", decay=None, curve=1.6), gain=0.35)
    rev = array.array("d", s)
    for i in range(len(rev)):
        rev[i] *= (i / len(rev)) ** 1.5
    return rev


def sfx_bubbles():
    s = buf(0.6)
    rnd = random.Random(13)
    for i in range(5):
        f = rnd.uniform(400, 700)
        add(s, tone(0.07, f, f * 2.2, decay=0.03, curve=0.5), at=i * 0.1, gain=0.6)
    return s


def sfx_step():
    s = tone(0.08, 110, 60, decay=0.02)
    add(s, noise(0.06, 14, 900, decay=0.012), gain=0.5)
    return s


def sfx_steps():
    s = buf(1.6)
    for i in range(6):
        add(s, sfx_step(), at=i * 0.26, gain=0.8)
    return s


def sfx_tick():
    return tone(0.06, 1500, 1400, decay=0.015)


def sfx_magic():
    s = buf(1.6)
    for i in range(14):
        add(s, bell(0.6, midi(72 + (i * 2) % 24), decay=0.25), at=i * 0.05, gain=0.35)
    return reverb(s, 0.4)


def sfx_thump():
    return tone(0.3, 120, 45, decay=0.08)


def sfx_flutter():
    s = buf(0.5)
    for i in range(10):
        add(s, noise(0.04, 30 + i, 2500, decay=0.01), at=i * 0.04, gain=0.6)
    return s


def xylo(n):
    def f():
        s = tone(0.6, midi(n), decay=0.18, attack=0.001)
        add(s, tone(0.2, midi(n) * 4, decay=0.03, attack=0.001), gain=0.35)
        return s
    return f


SFX = {
    "pop": sfx_pop, "boing": sfx_boing, "ding": sfx_ding, "chime": sfx_chime, "sparkle": sfx_sparkle,
    "shimmer": sfx_shimmer, "whoosh": sfx_whoosh, "whoosh-fast": sfx_whoosh_fast, "plouf": sfx_plouf,
    "splat": sfx_splat, "click": sfx_click, "typing": sfx_typing, "squeak": sfx_squeak, "hic": sfx_hic,
    "tada": sfx_tada, "riser": sfx_riser, "bubbles": sfx_bubbles, "steps": sfx_steps, "tick": sfx_tick,
    "magic": sfx_magic, "thump": sfx_thump, "flutter": sfx_flutter,
}
for _i, _n in enumerate((72, 74, 76, 77, 79, 81, 83, 84)):
    SFX[f"xylo-{_i + 1}"] = xylo(_n)


# ---------------------------------------------------------------- music beds
STYLES = {
    # bpm, beats per bar, chords (root midi, quality), melody scale, pluck?, bell?
    "day": dict(bpm=112, beats=4, chords=[(60, "M"), (67, "M"), (69, "m"), (65, "M")], pluck=True, seed=1),
    "dance": dict(bpm=124, beats=4, chords=[(62, "m"), (70, "M"), (65, "M"), (72, "M")], pluck=True, seed=2, drums=True),
    "night": dict(bpm=72, beats=3, chords=[(65, "M"), (60, "M"), (62, "m"), (70, "M")], pluck=False, seed=3),
    "snow": dict(bpm=96, beats=4, chords=[(67, "M"), (64, "m"), (60, "M"), (62, "M")], pluck=False, seed=4),
}


def chord_notes(root, q):
    return [root, root + (4 if q == "M" else 3), root + 7]


def music(style, seconds):
    st = STYLES[style]
    rnd = random.Random(st["seed"])
    beat = 60.0 / st["bpm"]
    bar = beat * st["beats"]
    out = buf(seconds + 2)
    t, b = 0.0, 0
    while t < seconds:
        root, q = st["chords"][b % len(st["chords"])]
        notes = chord_notes(root, q)
        # bass on beat 1 (and 3)
        for k in range(0, st["beats"], 2 if st["beats"] == 4 else 3):
            add(out, tone(beat * 1.6, midi(root - 24), decay=0.5, attack=0.01), at=t + k * beat, gain=0.35)
        if st["pluck"]:
            pattern = (0, 1, 1.5, 2.5, 3) if st["beats"] == 4 else (0, 1, 2)
            for i, p in enumerate(pattern):
                for s_i, n in enumerate(notes):
                    add(out, pluck(0.7, midi(n - 12 + (12 if s_i == 0 and i % 2 else 0)), st["seed"] * 100 + b * 10 + i + s_i),
                        at=t + p * beat + s_i * 0.012, gain=0.22 if i else 0.28)
        else:
            # soft pad: detuned sines with slow attack
            for n in notes:
                for det in (-0.004, 0.004):
                    add(out, tone(bar * 1.05, midi(n - 12) * (1 + det), attack=bar * 0.35, decay=bar * 0.9), at=t, gain=0.07)
        # bell / music-box melody on chord + pentatonic notes
        steps = st["beats"] * (2 if st["bpm"] < 100 else 1)
        for i in range(steps):
            if rnd.random() < (0.75 if style == "night" else 0.55):
                pool = notes + [notes[0] + 12, notes[1] + 12, notes[0] + 2 + 12]
                n = rnd.choice(pool) + 12
                add(out, bell(1.2, midi(n), decay=0.45 if style != "night" else 0.7), at=t + i * bar / steps, gain=0.22)
        if st.get("drums"):
            for k in range(st["beats"]):
                add(out, tone(0.25, 110, 45, decay=0.07), at=t + k * beat, gain=0.55)
                add(out, noise(0.08, 900 + b * 4 + k, 7000, decay=0.02), at=t + k * beat + beat / 2, gain=0.25)
        t += bar
        b += 1
    out = array.array("d", out[: int(seconds * SR)])
    out = reverb(out, 0.22 if style != "night" else 0.32)
    n = len(out)
    for i in range(n):  # gentle fade in and fade out (the film fades too)
        k = min(1.0, i / (0.4 * SR), (n - i) / (1.2 * SR))
        out[i] *= k
    return out


def main(argv):
    if len(argv) >= 2 and argv[1] == "list":
        print("\n".join(sorted(SFX)))
        return 0
    if len(argv) == 3 and argv[1] == "sfx":
        out_dir = argv[2]
        os.makedirs(out_dir, exist_ok=True)
        for name, fn in SFX.items():
            write_wav(os.path.join(out_dir, f"sfx-{name}.wav"), fn(), peak_db=-3.0)
            print("wrote", f"sfx-{name}.wav")
        return 0
    if len(argv) == 5 and argv[1] == "music" and argv[2] in STYLES:
        seconds = float(argv[3])
        if not (1 <= seconds <= 600):
            raise SystemExit("seconds must be between 1 and 600")
        write_wav(argv[4], music(argv[2], seconds), peak_db=-6.0)
        print("wrote", argv[4])
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
