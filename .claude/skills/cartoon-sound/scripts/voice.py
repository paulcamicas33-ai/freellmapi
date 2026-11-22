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
    "narrateur": ("fr_FR-upmc-medium.onnx", 0, 1.1, 1.0),     # a warm young storyteller
    "Noisette": ("fr_FR-siwis-medium.onnx", None, 1.25, 0.97),  # a little girl
    "Pistache": ("fr_FR-tom-medium.onnx", None, 1.42, 0.95),    # a small boy mouse
}
# Calm, even reading (the user asked for a soft, homogeneous voice): Piper's default variation.
EXPRESSIVE = ["--noise-scale", "0.6", "--noise-w-scale", "0.7"]
NAME = re.compile(r"^[a-z0-9][a-z0-9-]{0,39}$")


def clean(text):
    text = text.replace("*", "")
    return re.sub(r"\s+", " ", text).strip()


def resample(samples, k):
    n = int(len(samples) / k)
    out = array.array("h", bytes(2 * n))
    for i in range(n):
        x = i * k
        j = int(x)
        f = x - j
        a = samples[j]
        b = samples[j + 1] if j + 1 < len(samples) else a
        out[i] = int(a + (b - a) * f)
    return out


def soften(samples, rate, cutoff=6500.0, rms_db=-21.0, threshold_db=-18.0, ratio=3.0, ceiling_db=-4.0):
    """Make every line soft and even: gentle low-pass (less harsh sibilants), smooth compression
    (fewer peaks), the same loudness for every line (RMS), and a soft ceiling (no clipping)."""
    x = [v / 32768.0 for v in samples]
    # two one-pole low-passes in series
    a = 1 - math.exp(-2 * math.pi * cutoff / rate)
    for _ in range(2):
        y = 0.0
        for i, v in enumerate(x):
            y += a * (v - y)
            x[i] = y
    # compressor with a smooth envelope (5 ms attack, 120 ms release)
    att = math.exp(-1 / (0.005 * rate))
    rel = math.exp(-1 / (0.12 * rate))
    thr = 10 ** (threshold_db / 20)
    env = 0.0
    for i, v in enumerate(x):
        lv = abs(v)
        env = att * env + (1 - att) * lv if lv > env else rel * env + (1 - rel) * lv
        if env > thr:
            gain = (thr * (env / thr) ** (1 / ratio)) / env
            x[i] = v * gain
    # same loudness for every line
    rms = math.sqrt(sum(v * v for v in x) / max(1, len(x))) or 1e-9
    g = (10 ** (rms_db / 20)) / rms
    ceil = 10 ** (ceiling_db / 20)
    out = array.array("h", bytes(2 * len(x)))
    for i, v in enumerate(x):
        w = v * g
        w = ceil * math.tanh(w / ceil)  # soft ceiling instead of hard clipping
        out[i] = int(w * 32767)
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
        if k != 1.0:
            samples = resample(samples, k)
        samples = soften(samples, rate)
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
