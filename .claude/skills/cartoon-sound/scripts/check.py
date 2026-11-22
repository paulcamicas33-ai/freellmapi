#!/usr/bin/env python3
"""The ear: transcribe every generated voice line with Whisper (offline) and compare it with the
text it should say; also flag sudden upward pitch jumps (an ugly « montée »).

  <whisper-venv>/bin/python -I check.py <models_dir> <lines.json> <audio_dir> <prefix>

Prints one line per voice file: PASS/FAIL, the match score, what Whisper heard, and any pitch jump.
Exit code 1 when anything fails. Needs faster-whisper and numpy (in the whisper venv).
"""
import difflib, json, re, sys, unicodedata, wave
import numpy as np
from faster_whisper import WhisperModel

NAMES = "Noisette, Pistache, Pompon, Pipo, Lou, Flamme, Lili, Mistigri."
NUM = {"un": "1", "une": "1", "deux": "2", "trois": "3", "quatre": "4", "cinq": "5", "six": "6"}


def norm(t):
    t = t.replace("*", "").lower()
    t = unicodedata.normalize("NFD", t)
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^a-z0-9' ]", " ", t).replace("'", " ")
    words = [NUM.get(w, w) for w in t.split()]
    words = [w[:-1] if len(w) > 3 and w.endswith("s") else w for w in words]  # plural does not matter to a listener
    # homophones that do not matter to a listener
    return [{"a": "a", "est": "et", "ses": "ces"}.get(w, w) for w in words]


def load16k(p):
    w = wave.open(p)
    r = w.getframerate()
    a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    n = int(len(a) * 16000 / r)
    return np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a).astype(np.float32), a, r


def pitch_jumps(a, r, max_semitones=11.0):
    """Autocorrelation pitch every 20 ms; report jumps of more than `max_semitones` within 100 ms."""
    hop, win = int(0.02 * r), int(0.04 * r)
    f0 = []
    for i in range(0, len(a) - win, hop):
        x = a[i:i + win] - a[i:i + win].mean()
        if np.sqrt((x * x).mean()) < 0.02:
            f0.append(0.0)
            continue
        c = np.correlate(x, x, "full")[win - 1:]
        lo, hi = int(r / 600), int(r / 120)
        k = lo + int(np.argmax(c[lo:hi]))
        f0.append(r / k if c[k] > 0.4 * c[0] else 0.0)
    # a real ugly jump = the pitch climbs more than `max_semitones` and STAYS up for 3+ frames
    out = []
    i = 0
    while i < len(f0) - 8:
        a0 = f0[i]
        if a0 > 0:
            up = [12 * np.log2(f / a0) if f > 0 else 0 for f in f0[i + 2:i + 9]]
            if sum(1 for u in up if u > max_semitones) >= 3:
                out.append(f"{i * 0.02:.2f}s +{max(up):.0f} st")
                i += 10
                continue
        i += 1
    return out


def main(argv):
    if len(argv) != 5:
        print(__doc__)
        return 2
    models, lines_path, audio_dir, prefix = argv[1:]
    model = WhisperModel("small", device="cpu", compute_type="int8", download_root=models)
    bad = 0
    for line in json.load(open(lines_path, encoding="utf-8")):
        path = f"{audio_dir}/{prefix}-{line['id']}.wav"
        x16, raw, rate = load16k(path)
        segs, _ = model.transcribe(x16, language="fr", beam_size=5, initial_prompt=NAMES)
        heard = " ".join(s.text.strip() for s in segs)
        want, got = norm(line["text"]), norm(heard)
        score = difflib.SequenceMatcher(None, want, got).ratio()
        # a word counts as heard if Whisper wrote it or a near-homophone (« hoquet » ~ « hockey »)
        missing = [w for w in want if len(w) > 2 and w not in got
                   and max((difflib.SequenceMatcher(None, w, g).ratio() for g in got), default=0) < 0.6]
        jumps = pitch_jumps(raw, rate)
        single = len(want) <= 1  # one short word (« Un ! ») is too short for Whisper itself: not graded
        ok = single or (score >= 0.8 and not missing and not jumps)
        bad += not ok
        print(f"{'PASS' if ok else 'FAIL'} {line['id']:9} {score:.2f}  heard: {heard}" + (f"  | missing: {missing}" if missing else "") + (f"  | pitch: {jumps}" if jumps else ""), flush=True)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
