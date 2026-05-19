"""MNIST digit '3' drawn pixel-by-pixel — dark ink on transparent background."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import json, base64, io
import numpy as np
from PIL import Image, ImageDraw

DATA = '/Users/andrew/WEBSITE/website/public/data/mnist/reconstructions.json'
OUT  = '/Users/andrew/WEBSITE/website/public/images/thumb_mnist.gif'

BG      = MATTE
GRID_C  = (210, 206, 200)   # faint grid on light bg
INK_C   = (24,  23,  21)    # --ink ≈ #181715
CURSOR  = (184, 88,  26)    # orange accent
TRAIL_C = (120, 110, 100)   # faint trail

W_PX, H_PX = 300, 207
SCALE  = 6
DIGIT  = 3
THRESH = 80

with open(DATA) as f:
    d = json.load(f)
perfect = d['rows'][-1]
b64 = perfect['images'][DIGIT]
raw = base64.b64decode(b64.split(',')[-1])
grid = np.array(Image.open(io.BytesIO(raw)).convert('L'))

ink_mask   = grid > THRESH
ink_pixels = list(zip(*np.where(ink_mask)))

remaining = list(ink_pixels)
remaining.sort(key=lambda p: (p[0], p[1]))
order = [remaining.pop(0)]
while remaining:
    last = order[-1]
    dists = [(abs(p[0]-last[0]) + abs(p[1]-last[1]), i) for i, p in enumerate(remaining)]
    _, best_i = min(dists)
    order.append(remaining.pop(best_i))

N = len(order)

GRID_PX  = 28 * SCALE
OFFSET_X = (W_PX - GRID_PX) // 2
OFFSET_Y = (H_PX - GRID_PX) // 2

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

DRAW_FRAMES  = 60
TRAIL_LEN    = 4
HOLD_FRAMES  = 20

frames = []
durations = []

def pixels_at_frame(fi):
    t = fi / DRAW_FRAMES
    return max(1, int(N * (t ** 0.7) * 1.05))

for fi in range(DRAW_FRAMES):
    target  = min(N, pixels_at_frame(fi))
    revealed = order[:target]

    base, draw = make_base()
    for idx, (r, c) in enumerate(revealed):
        age = target - 1 - idx
        if age < TRAIL_LEN:
            t = age / TRAIL_LEN
            col = tuple(int(TRAIL_C[k] + (INK_C[k] - TRAIL_C[k]) * (1 - t)) for k in range(3))
        else:
            col = INK_C
        draw.rectangle(cell_rect(r, c), fill=col)

    if revealed:
        r, c = revealed[-1]
        cx = OFFSET_X + c * SCALE + SCALE // 2
        cy = OFFSET_Y + r * SCALE + SCALE // 2
        R  = SCALE // 2 + 1
        draw.ellipse([cx-R, cy-R, cx+R, cy+R], fill=CURSOR)

    frames.append(base)
    durations.append(50)

base, draw = make_base()
for r, c in order:
    draw.rectangle(cell_rect(r, c), fill=INK_C)
for _ in range(HOLD_FRAMES):
    frames.append(base.copy())
    durations.append(80)

save_transparent_gif(frames, OUT, durations)
