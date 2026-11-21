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
    "narrateur": ("fr_FR-upmc-medium.onnx", 0, 1.12, 0.95),   # a warm young storyteller
    "Noisette": ("fr_FR-siwis-medium.onnx", None, 1.32, 0.92),  # a little girl
    "Pistache": ("fr_FR-tom-medium.onnx", None, 1.55, 0.9),     # a small boy mouse
}
EXPRESSIVE = ["--noise-scale", "0.8", "--noise-w-scale", "1.0"]
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


def normalize(samples, peak_db=-1.0):
    peak = max(1, max(abs(s) for s in samples))
    g = (10 ** (peak_db / 20)) * 32767 / peak
    return array.array("h", (int(max(-32767, min(32767, s * g))) for s in samples))


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
        samples = normalize(samples)
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
