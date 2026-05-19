"""Shared helper: save a list of RGB PIL frames as a transparent GIF.

Strategy: build one global palette from all frames combined, find which
palette index is closest to the matte colour (site background), mark that
as the transparent colour.  Every frame is then quantised with the same
palette so the transparent index is consistent across frames.
"""
import numpy as np
from PIL import Image

MATTE = (246, 244, 240)   # --bg: #f6f4f0


def save_transparent_gif(rgb_frames, path, durations, loop=0,
                          matte=MATTE, tol=14):
    """
    rgb_frames : list of PIL Image in 'RGB' mode, all the same size
    path       : output .gif path
    durations  : int or list of int (ms per frame)
    tol        : colour-distance tolerance for detecting matte pixels
    """
    if not rgb_frames:
        return

    w, h = rgb_frames[0].size
    n    = len(rgb_frames)

    # ── 1. Build a global palette from a sample of frames ────────────────────
    step   = max(1, n // 8)           # sample ≤8 evenly-spaced frames
    sample = rgb_frames[::step][:8]
    combined = Image.new('RGB', (w, h * len(sample)))
    for i, f in enumerate(sample):
        combined.paste(f, (0, i * h))
    global_p = combined.quantize(colors=255, dither=0)
    pal = global_p.getpalette()       # flat list, 768 ints

    # ── 2. Find palette index closest to matte ────────────────────────────────
    matte = np.array(matte, dtype=int)
    pal_arr = np.array(pal[:len(pal)//3*3], dtype=int).reshape(-1, 3)
    dists   = np.max(np.abs(pal_arr - matte), axis=1)
    trans_idx = int(np.argmin(dists))

    # ── 3. Quantise every frame with the same global palette ─────────────────
    p_frames = []
    for f in rgb_frames:
        pf = f.quantize(palette=global_p, dither=0)
        # Zero out pixels within tolerance of matte → force them to trans_idx
        arr_orig = np.array(f, dtype=int)
        arr_q    = np.array(pf)
        bg_mask  = np.max(np.abs(arr_orig - matte), axis=2) < tol
        arr_q[bg_mask] = trans_idx
        p_frames.append(Image.fromarray(arr_q.astype(np.uint8), 'P'))

    # Copy the global palette into every frame so disposal=2 works correctly
    for pf in p_frames:
        pf.putpalette(pal)

    if isinstance(durations, int):
        durations = [durations] * n

    p_frames[0].save(
        path,
        save_all=True,
        append_images=p_frames[1:],
        duration=durations,
        loop=loop,
        transparency=trans_idx,
        disposal=2,
        optimize=False,
    )
    print(f'Saved {path}  ({w}×{h}, {n} frames, transparent={trans_idx})')
