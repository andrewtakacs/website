"""Fashion MNIST CNN thumbnail GIF — 3x3 filter sweeps across a shirt image.

Left panel: original image with the sliding 3x3 filter window highlighted.
Right panel: the convolution output builds up as the filter moves.
No text. Transparent background. Site palette.
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

# Best shirt sample (class 6, pre-computed highest contrast index)
SHIRT_IDX = 3262
grid = images[SHIRT_IDX].astype(np.float32)

OUT = '/Users/andrew/WEBSITE/website/public/images/thumb_cnn.gif'

# ── Palette ──────────────────────────────────────────────────────────────────
BG      = MATTE
GRID_C  = (210, 206, 200)
INK_C   = (24,  23,  21)
ACC     = (184, 88,  26)    # orange — filter highlight & output
DIM_C   = (160, 150, 140)

# ── Layout ───────────────────────────────────────────────────────────────────
W_PX, H_PX = 300, 207
SCALE       = 5             # each pixel → 5x5 screen px
IMG_PX      = 28 * SCALE    # 140 px

GAP         = 12            # gap between left and right panels
TOTAL_W     = IMG_PX * 2 + GAP
LEFT_X      = (W_PX - TOTAL_W) // 2
RIGHT_X     = LEFT_X + IMG_PX + GAP
TOP_Y       = (H_PX - IMG_PX) // 2


# ── Helpers ───────────────────────────────────────────────────────────────────
def px_rect(panel_x, r, c):
    x = panel_x + c * SCALE
    y = TOP_Y   + r * SCALE
    return x, y, x + SCALE - 1, y + SCALE - 1

def draw_image(draw, panel_x, pixel_array, highlight=None):
    """Draw a 28x28 pixel array on a white background. highlight=(r,c) draws orange 3x3 box."""
    arr = pixel_array
    for r in range(28):
        for c in range(28):
            v = int(arr[r, c])
            if v > 20:
                # v=255 → pure dark ink, v≈0 → transparent (skip)
                t = v / 255.0
                col = tuple(int(BG[k] * (1 - t) + INK_C[k] * t) for k in range(3))
                draw.rectangle(px_rect(panel_x, r, c), fill=col)

    if highlight is not None:
        hr, hc = highlight
        for dr in range(-1, 2):
            for dc in range(-1, 2):
                nr, nc = hr + dr, hc + dc
                if 0 <= nr < 28 and 0 <= nc < 28:
                    v = int(arr[nr, nc])
                    t = v / 255.0
                    base_col = tuple(int(BG[k] * (1 - t) + INK_C[k] * t) for k in range(3))
                    col = tuple(min(255, int(base_col[k] * 0.3 + ACC[k] * 0.7)) for k in range(3))
                    draw.rectangle(px_rect(panel_x, nr, nc), fill=col)
        # Orange border around the 3x3 box
        x0 = panel_x + max(0, hc - 1) * SCALE
        y0 = TOP_Y   + max(0, hr - 1) * SCALE
        x1 = panel_x + min(27, hc + 1) * SCALE + SCALE - 1
        y1 = TOP_Y   + min(27, hr + 1) * SCALE + SCALE - 1
        draw.rectangle([x0, y0, x1, y1], outline=ACC, width=2)

def draw_output(draw, panel_x, pixel_array, revealed_mask):
    """Draw the shirt on the right, revealed so far in orange tint."""
    for r in range(28):
        for c in range(28):
            if not revealed_mask[r, c]:
                continue
            v = int(pixel_array[r, c])
            if v > 20:
                t = v / 255.0
                # blend ink toward orange based on brightness
                col = tuple(min(255, int(ACC[k] * t + BG[k] * (1 - t))) for k in range(3))
                draw.rectangle(px_rect(panel_x, r, c), fill=col)

def draw_divider(draw):
    mx = LEFT_X + IMG_PX + GAP // 2
    draw.line([(mx, TOP_Y + 10), (mx, TOP_Y + IMG_PX - 10)], fill=GRID_C, width=1)

# ── Scan positions ────────────────────────────────────────────────────────────
# Every (r, c) the filter visits, raster order
positions = [(r, c) for r in range(28) for c in range(28)]
N = len(positions)  # 784

# We skip frames to keep the GIF reasonable length
STEP        = 4     # visit every Nth position for drawing
HOLD_FRAMES = 30
FADE_FRAMES = 12

scan_positions = positions[::STEP]  # ~196 keyframes

frames    = []
durations = []

revealed = np.zeros((28, 28), dtype=bool)

# ── Sweep frames ─────────────────────────────────────────────────────────────
for (r, c) in scan_positions:
    # Mark all positions up to this one as revealed
    idx = r * 28 + c
    for rr in range(28):
        for cc in range(28):
            if rr * 28 + cc <= idx:
                revealed[rr, cc] = True

    base = Image.new('RGB', (W_PX, H_PX), BG)
    draw = ImageDraw.Draw(base)

    draw_image(draw, LEFT_X, grid, highlight=(r, c))
    draw_output(draw, RIGHT_X, grid, revealed)
    draw_divider(draw)

    frames.append(base)
    durations.append(30)

# ── Hold on completed output ──────────────────────────────────────────────────
revealed[:] = True
base = Image.new('RGB', (W_PX, H_PX), BG)
draw = ImageDraw.Draw(base)
draw_image(draw, LEFT_X, grid)
draw_output(draw, RIGHT_X, grid, revealed)
draw_divider(draw)

for _ in range(HOLD_FRAMES):
    frames.append(base.copy())
    durations.append(80)

# ── Fade out ──────────────────────────────────────────────────────────────────
for fi in range(FADE_FRAMES):
    fade = Image.blend(base, Image.new('RGB', (W_PX, H_PX), BG), (fi + 1) / FADE_FRAMES)
    frames.append(fade)
    durations.append(35)

save_transparent_gif(frames, OUT, durations)
