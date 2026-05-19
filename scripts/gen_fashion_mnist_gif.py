"""Fashion MNIST thumbnail GIF — cycles through all 10 clothing classes.

Each class is revealed pixel-by-pixel (nearest-neighbour scan order) with an
orange cursor, then holds, then fades out before the next class appears.
Style matches the site palette used by the other thumb_*.gif scripts.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import gzip, urllib.request, numpy as np
from PIL import Image, ImageDraw

# ── Data ─────────────────────────────────────────────────────────────────────
CACHE = '/tmp/fashion_mnist'
os.makedirs(CACHE, exist_ok=True)

def _download(url, path):
    if not os.path.exists(path):
        print(f'Downloading {os.path.basename(path)}…')
        urllib.request.urlretrieve(url, path)

BASE = 'https://github.com/zalandoresearch/fashion-mnist/raw/master/data/fashion'
_download(f'{BASE}/t10k-images-idx3-ubyte.gz', f'{CACHE}/images.gz')
_download(f'{BASE}/t10k-labels-idx1-ubyte.gz', f'{CACHE}/labels.gz')

with gzip.open(f'{CACHE}/labels.gz') as f:
    f.read(8)
    labels = np.frombuffer(f.read(), dtype=np.uint8)
with gzip.open(f'{CACHE}/images.gz') as f:
    f.read(16)
    images = np.frombuffer(f.read(), dtype=np.uint8).reshape(-1, 28, 28)

# Class order: start with visually striking items (boot, sneaker, trouser, dress…)
CLASS_ORDER = [9, 7, 1, 3, 4, 5, 2, 8, 6, 0]  # Ankle Boot first, T-Shirt last

# Best sample per class by highest contrast (pre-computed indices)
BEST_IDX = {0: 5129, 1: 7876, 2: 8142, 3: 5673, 4: 2590,
            5: 1947, 6: 3262, 7: 1516, 8: 231,  9: 4423}

samples = [images[BEST_IDX[c]] for c in CLASS_ORDER]

OUT = '/Users/andrew/WEBSITE/website/public/images/thumb_fashion.gif'

# ── Palette ──────────────────────────────────────────────────────────────────
BG      = MATTE               # site background (transparent)
GRID_C  = (210, 206, 200)     # faint grid lines
INK_C   = (24,  23,  21)      # dark ink
CURSOR  = (184, 88,  26)      # orange accent
TRAIL_C = (120, 110, 100)     # recent-pixel trail

# ── Layout ───────────────────────────────────────────────────────────────────
W_PX, H_PX = 300, 207
SCALE       = 6               # each 28-px cell → 6×6 screen pixels
GRID_PX     = 28 * SCALE      # 168 px
OFFSET_X    = (W_PX - GRID_PX) // 2
OFFSET_Y    = (H_PX - GRID_PX) // 2

THRESH      = 60              # pixel value threshold to count as "ink"
DRAW_FRAMES = 55
TRAIL_LEN   = 5
HOLD_FRAMES = 22
FADE_FRAMES = 10

def cell_rect(r, c):
    x = OFFSET_X + c * SCALE
    y = OFFSET_Y + r * SCALE
    return x, y, x + SCALE - 1, y + SCALE - 1

def make_base():
    img  = Image.new('RGB', (W_PX, H_PX), BG)
    draw = ImageDraw.Draw(img)
    for i in range(29):
        x = OFFSET_X + i * SCALE
        y = OFFSET_Y + i * SCALE
        draw.line([(x, OFFSET_Y), (x, OFFSET_Y + GRID_PX)], fill=GRID_C, width=1)
        draw.line([(OFFSET_X, y), (OFFSET_X + GRID_PX, y)], fill=GRID_C, width=1)
    return img, draw

def scan_order(grid):
    """Return ink pixels sorted by (row, col) for a natural top-to-bottom reveal."""
    ys, xs = np.where(grid > THRESH)
    pts = sorted(zip(ys.tolist(), xs.tolist()))
    if not pts:
        return pts
    # Greedy nearest-neighbour for smoother cursor motion
    remaining = list(pts)
    order = [remaining.pop(0)]
    while remaining:
        last = order[-1]
        dists = [abs(p[0] - last[0]) + abs(p[1] - last[1]) for p in remaining]
        best  = int(np.argmin(dists))
        order.append(remaining.pop(best))
    return order

frames    = []
durations = []

for grid in samples:
    order = scan_order(grid)
    N     = len(order)

    def pixels_at(fi):
        t = fi / DRAW_FRAMES
        return max(1, int(N * (t ** 0.65) * 1.08))

    # ── draw phase ───────────────────────────────────────────────────────────
    for fi in range(DRAW_FRAMES):
        target   = min(N, pixels_at(fi))
        revealed = order[:target]

        base, draw = make_base()
        for idx, (r, c) in enumerate(revealed):
            age = target - 1 - idx
            if age < TRAIL_LEN:
                t   = age / TRAIL_LEN
                col = tuple(int(TRAIL_C[k] + (INK_C[k] - TRAIL_C[k]) * (1 - t)) for k in range(3))
            else:
                col = INK_C
            draw.rectangle(cell_rect(r, c), fill=col)

        if revealed:
            r, c = revealed[-1]
            cx = OFFSET_X + c * SCALE + SCALE // 2
            cy = OFFSET_Y + r * SCALE + SCALE // 2
            R  = SCALE // 2 + 1
            draw.ellipse([cx - R, cy - R, cx + R, cy + R], fill=CURSOR)

        frames.append(base)
        durations.append(45)

    # ── hold phase (full image) ───────────────────────────────────────────────
    base, draw = make_base()
    for r, c in order:
        draw.rectangle(cell_rect(r, c), fill=INK_C)
    for _ in range(HOLD_FRAMES):
        frames.append(base.copy())
        durations.append(80)

    # ── fade out ─────────────────────────────────────────────────────────────
    for fi in range(FADE_FRAMES):
        fade_base = Image.blend(base, Image.new('RGB', (W_PX, H_PX), BG), (fi + 1) / FADE_FRAMES)
        frames.append(fade_base)
        durations.append(35)

save_transparent_gif(frames, OUT, durations)
