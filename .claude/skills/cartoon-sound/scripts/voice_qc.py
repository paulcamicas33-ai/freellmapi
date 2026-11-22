#!/usr/bin/env python3
"""Generate the voices of an episode, have Whisper listen to every line, and regenerate the lines
it does not understand (Piper varies a little on each run) — keeping the best take.

  <whisper-venv>/bin/python -I voice_qc.py <piper_bin> <voices_dir> <models_dir> <lines.json> <audio_dir> <prefix> [tries]

Prints the final verdict for every line and the length of each file ("<id> <seconds>").
A line that still fails after all tries is reported FAIL with what Whisper heard: rephrase it or
add a respelling to PRONOUNCE in voice.py, then run again.
"""
import json, os, shutil, subprocess, sys, tempfile, wave, difflib
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import check  # noqa: E402
from faster_whisper import WhisperModel  # noqa: E402


def gen(piper, voices, items, out_dir, prefix):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False)
        tmp = f.name
    try:
        subprocess.run(["python3", "-I", os.path.join(HERE, "voice.py"), piper, voices, tmp, out_dir, prefix], check=True, capture_output=True)
    finally:
        os.unlink(tmp)


def grade(model, line, path):
    x16, raw, rate = check.load16k(path)
    segs, _ = model.transcribe(x16, language="fr", beam_size=5, initial_prompt=check.NAMES)
    heard = " ".join(s.text.strip() for s in segs)
    want, got = check.norm(line["text"]), check.norm(heard)
    score = difflib.SequenceMatcher(None, want, got).ratio()
    missing = [w for w in want if len(w) > 2 and w not in got and max((difflib.SequenceMatcher(None, w, g).ratio() for g in got), default=0) < 0.6]
    jumps = check.pitch_jumps(raw, rate)
    ok = len(want) <= 1 or (score >= 0.8 and not missing and not jumps)
    return ok, score - 0.2 * len(missing) - 0.3 * len(jumps), heard, missing, jumps, len(raw) / rate


def main(argv):
    if len(argv) not in (7, 8):
        print(__doc__)
        return 2
    piper, voices, models, lines_path, out_dir, prefix = argv[1:7]
    tries = int(argv[7]) if len(argv) == 8 else 4
    lines = json.load(open(lines_path, encoding="utf-8"))
    model = WhisperModel("small", device="cpu", compute_type="int8", download_root=models)
    gen(piper, voices, lines, out_dir, prefix)
    best = {}
    for ln in lines:
        best[ln["id"]] = grade(model, ln, f"{out_dir}/{prefix}-{ln['id']}.wav")
    for attempt in range(1, tries):
        todo = [ln for ln in lines if not best[ln["id"]][0]]
        if not todo:
            break
        tmpd = tempfile.mkdtemp()
        gen(piper, voices, todo, tmpd, prefix)
        for ln in todo:
            path = f"{tmpd}/{prefix}-{ln['id']}.wav"
            g = grade(model, ln, path)
            if g[1] > best[ln["id"]][1]:
                best[ln["id"]] = g
                shutil.copy(path, f"{out_dir}/{prefix}-{ln['id']}.wav")
        shutil.rmtree(tmpd)
    bad = 0
    for ln in lines:
        ok, sc, heard, missing, jumps, secs = best[ln["id"]]
        bad += not ok
        print(f"{'PASS' if ok else 'FAIL'} {ln['id']:9} {secs:.2f}s  heard: {heard}" + (f"  | missing: {missing}" if missing else "") + (f"  | pitch: {jumps}" if jumps else ""), flush=True)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
