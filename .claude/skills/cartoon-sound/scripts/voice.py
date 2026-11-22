#!/usr/bin/env python3
"""Character voices with Piper (offline neural text-to-speech), pitched per character.

  python3 -I voice.py <piper_bin> <voices_dir> <lines.json> <out_dir> <prefix>

lines.json: [{"id": "l1", "text": "Bonjour ! Je suis *Noisette*.", "speaker": "Noisette"}, ...]
A line without speaker is read by the narrator. Writes <out_dir>/<prefix>-<id>.wav and prints
"<id> <seconds>" for each line. Pitch is raised without changing speed: Piper speaks k times
slower, then the audio is resampled k times faster (stdlib only).
"""
import array
import json
import math
import os
import re
import subprocess
import sys
import tempfile
import wave

PROFILES = {
    # model file, speaker id or None, pitch factor k, base speed (length scale, >1 = slower)
    # Childlike and lively: every voice is raised and a little quicker; Piper's variation is raised
    # (noise scales) so the reading is less flat.
    "narrateur": ("fr_FR-siwis-medium.onnx", None, 1.0, 1.05),  # a soft storyteller (clearest in the Whisper test)
    "Noisette": ("fr_FR-siwis-medium.onnx", None, 1.25, 1.18),  # a little girl, speaking slowly and calmly
    "Pistache": ("fr_FR-tom-medium.onnx", None, 1.42, 0.95),    # a small boy mouse
    "Pipo": ("fr_FR-tom-medium.onnx", None, 1.18, 1.05),        # a gentle little bear
    "Pompon": ("fr_FR-upmc-medium.onnx", 0, 1.38, 0.95),        # a lively little bunny
    "Lou": ("fr_FR-tom-medium.onnx", None, 1.3, 0.95),          # a young fox
}
# Calm, even reading (the user asked for a soft, homogeneous voice): Piper's default variation.
EXPRESSIVE = ["--noise-scale", "0.55", "--noise-w-scale", "0.6"]
NAME = re.compile(r"^[a-z0-9][a-z0-9-]{0,39}$")


# How Piper should SAY some words (found with check.py: Whisper heard the plain spelling wrong).
# Only the voice text changes; captions keep the normal spelling.
PRONOUNCE = {
    "hoquet": "ho-quet",
    "cerf-volant": "cerfvolant",


}


def clean(text):
    text = text.replace("*", "")
    # « … » makes Piper's pitch jump up on the next word: say it as a plain full stop
    text = text.replace("…", ".").replace("...", ".")
    for word, said in PRONOUNCE.items():
        text = re.sub(rf"\b{word}\b", said, text, flags=re.IGNORECASE)
    text = re.sub(r"\.\s*\.", ".", text)
    return re.sub(r"\s+", " ", text).strip()


def lowpass(x, rate, cutoff, stages=2):
    a = 1 - math.exp(-2 * math.pi * cutoff / rate)
    for _ in range(stages):
        y = 0.0
        for i, v in enumerate(x):
            y += a * (v - y)
            x[i] = y
    return x


def resample(x, k):
    """Read the signal k times faster (raises the pitch by k). Cubic interpolation."""
    n = int(len(x) / k)
    out = [0.0] * n
    last = len(x) - 1
    for i in range(n):
        p = i * k
        j = int(p)
        f = p - j
        y0 = x[max(0, j - 1)]; y1 = x[j]; y2 = x[min(last, j + 1)]; y3 = x[min(last, j + 2)]
        out[i] = y1 + 0.5 * f * (y2 - y0 + f * (2 * y0 - 5 * y1 + 4 * y2 - y3 + f * (3 * (y1 - y2) + y3 - y0)))
    return out


def soft_room(x, rate, mix=0.08):
    """A small, soft, airy room (gives the 'angelic' softness the user asked for)."""
    n = len(x)
    tail = int(0.35 * rate)
    x = x + [0.0] * tail
    wet = [0.0] * len(x)
    for d_ms, g in ((29.7, 0.72), (37.1, 0.7), (41.1, 0.68), (43.7, 0.66)):
        d = max(1, int(d_ms * rate / 1000))
        ring = [0.0] * d
        for i, v in enumerate(x):
            j = i % d
            y = ring[j]
            ring[j] = v + y * g
            wet[i] += y * 0.25
    wet = lowpass(wet, rate, 4000.0, 1)
    return [x[i] * (1 - mix) + wet[i] * mix for i in range(len(x))]


def soften(samples, rate, k):
    """Soft, even, continuous voice: anti-alias filter BEFORE raising the pitch (the harsh
    'saturated' sound came from aliasing), cubic resampling, gentle compression, a soft airy room,
    a natural fade at the end of every line, the same loudness for every line and a soft ceiling."""
    x = [v / 32768.0 for v in samples]
    if k != 1.0:
        x = lowpass(x, rate, min(9000.0, 0.45 * rate / k), 3)
        x = resample(x, k)
    x = lowpass(x, rate, 9000.0, 1)  # a light touch: stronger filters muffled the consonants (Whisper test)
    # trim the silence Piper leaves at the end, so the fade lands on the last syllable
    thr = 0.01 * max(1e-9, max(abs(v) for v in x))
    endi = len(x)
    while endi > 1 and abs(x[endi - 1]) < thr:
        endi -= 1
    x = x[: min(len(x), endi + int(0.04 * rate))]
    # gentle compression (2:1 above -24 dB, slow release) for a continuous, even voice
    att = math.exp(-1 / (0.008 * rate))
    rel = math.exp(-1 / (0.25 * rate))
    t = 10 ** (-24 / 20)
    env = 0.0
    for i, v in enumerate(x):
        lv = abs(v)
        env = att * env + (1 - att) * lv if lv > env else rel * env + (1 - rel) * lv
        if env > t:
            x[i] = v * (t * (env / t) ** 0.5) / env
    # natural ending: the last 220 ms glide down softly (cosine), a 12 ms fade-in at the start
    fo = min(len(x) // 3, int(0.22 * rate))
    for i in range(fo):
        x[len(x) - fo + i] *= 0.5 * (1 + math.cos(math.pi * (i + 1) / fo))
    fi = min(len(x) // 4, int(0.012 * rate))
    for i in range(fi):
        x[i] *= i / fi
    x = soft_room(x, rate)
    # same loudness for every line, soft ceiling (no clipping)
    rms = math.sqrt(sum(v * v for v in x) / max(1, len(x))) or 1e-9
    g = (10 ** (-22.0 / 20)) / rms
    ceil = 10 ** (-5.0 / 20)
    out = array.array("h", bytes(2 * len(x)))
    for i, v in enumerate(x):
        out[i] = int(ceil * math.tanh(v * g / ceil) * 32767)
    return out


def main(argv):
    if len(argv) != 6:
        print(__doc__)
        return 2
    piper, voices, lines_path, out_dir, prefix = argv[1:]
    if not NAME.match(prefix):
        raise SystemExit("bad prefix")
    lines = json.load(open(lines_path, encoding="utf-8"))
    os.makedirs(out_dir, exist_ok=True)
    for line in lines:
        if not NAME.match(line["id"]):
            raise SystemExit("bad line id")
        who = line.get("speaker") or "narrateur"
        model, spk, k, ls = PROFILES.get(who, PROFILES["narrateur"])
        with tempfile.TemporaryDirectory() as tmp:
            raw = os.path.join(tmp, "raw.wav")
            cmd = [piper, "-m", os.path.join(voices, model), "-f", raw, "--length-scale", str(ls * k), "--sentence-silence", "0.1"] + EXPRESSIVE
            if spk is not None:
                cmd += ["-s", str(spk)]
            subprocess.run(cmd, input=clean(line["text"]).encode("utf-8"), check=True, capture_output=True)
            with wave.open(raw) as w:
                rate = w.getframerate()
                samples = array.array("h", w.readframes(w.getnframes()))
        samples = soften(samples, rate, k)
        path = os.path.join(out_dir, f"{prefix}-{line['id']}.wav")
        with wave.open(path, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(rate)
            w.writeframes(samples.tobytes())
        print(line["id"], round(len(samples) / rate, 2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
