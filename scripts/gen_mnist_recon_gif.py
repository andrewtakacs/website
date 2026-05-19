"""Generate MNIST digit reconstruction GIF: k=1 → 784 (digits getting clearer)."""
import json, base64, io
import numpy as np
from PIL import Image, ImageDraw, ImageFont

DATA = '/Users/andrew/WEBSITE/website/public/data/mnist/reconstructions.json'
OUT  = '/Users/andrew/WEBSITE/website/public/images/thumb_mnist.gif'

BG    = '#0a0a08'
DIM   = (100, 96, 90)
WHITE = (245, 244, 242)
ACC   = (184, 88, 26)    # orange accent

W_PX, H_PX = 300, 207

with open(DATA) as f:
    d = json.load(f)

rows = d['rows']   # [{k, energy, images: [base64png x10]}, ...]

def decode_imgs(row):
    imgs = []
    for b64 in row['images']:
        raw = base64.b64decode(b64.split(',')[-1])
        img = Image.open(io.BytesIO(raw)).convert('L')
        imgs.append(img)
    return imgs

# Pre-decode all k levels
all_imgs = [(r['k'], r['energy'], decode_imgs(r)) for r in rows]

COLS, ROWS = 5, 2   # 5 cols × 2 rows = 10 digits
CELL  = 28
PAD   = 3
GRID_W = COLS * CELL + (COLS - 1) * PAD
GRID_H = ROWS * CELL + (ROWS - 1) * PAD

HOLD   = 18   # frames to hold each k level
XFADE  = 8    # cross-fade frames between levels

def make_grid(imgs_10, alpha=1.0, prev_grid=None):
    """Paste 10 digit images into a 5×2 grid PIL image (L mode)."""
    grid = Image.new('L', (GRID_W, GRID_H), 0)
    for idx, img in enumerate(imgs_10):
        col = idx % COLS
        row_i = idx // COLS
        x = col * (CELL + PAD)
        y = row_i * (CELL + PAD)
        grid.paste(img, (x, y))
    if prev_grid is not None and alpha < 1.0:
        grid = Image.blend(prev_grid, grid, alpha)
    return grid

def make_frame(grid, k_val, energy):
    canvas = Image.new('RGB', (W_PX, H_PX), BG)

    # Centre the grid
    gx = (W_PX - GRID_W) // 2
    gy = (H_PX - GRID_H) // 2 - 10

    # Draw each digit with orange tint (they're grayscale, map to orange)
    rgb_grid = Image.new('RGB', (GRID_W, GRID_H), (10, 10, 8))
    for idx in range(10):
        col = idx % COLS
        row_i = idx // COLS
        px = col * (CELL + PAD)
        py = row_i * (CELL + PAD)
        cell_L = grid.crop((px, py, px + CELL, py + CELL))
        arr = np.array(cell_L, dtype=float) / 255.0
        r = (arr * ACC[0]).astype(np.uint8)
        g = (arr * ACC[1]).astype(np.uint8)
        b = (arr * ACC[2]).astype(np.uint8)
        cell_rgb = Image.fromarray(np.stack([r, g, b], axis=-1), 'RGB')
        rgb_grid.paste(cell_rgb, (px, py))

    # 3× upscale for crispness
    scale = 3
    rgb_grid = rgb_grid.resize((GRID_W * scale, GRID_H * scale), Image.NEAREST)
    canvas.paste(rgb_grid, (gx - (GRID_W * (scale - 1)) // 2,
                             gy - (GRID_H * (scale - 1)) // 2))

    # Label at bottom
    draw = ImageDraw.Draw(canvas)
    label = f'k = {k_val}   {energy:.0f}% variance'
    # Use default font (PIL built-in)
    draw.text((W_PX // 2, H_PX - 22), label, fill=DIM, anchor='mm')

    return canvas

frames = []
durations = []

prev_grids = None

for i, (k, energy, imgs) in enumerate(all_imgs):
    cur_grid = make_grid(imgs)

    # Cross-fade from previous level
    if prev_grids is not None:
        for fi in range(XFADE):
            alpha = (fi + 1) / XFADE
            blended = make_grid(imgs, alpha=alpha, prev_grid=prev_grids)
            frames.append(make_frame(blended, k, energy))
            durations.append(45)

    # Hold frames
    for _ in range(HOLD):
        frames.append(make_frame(cur_grid, k, energy))
        durations.append(80 if i < len(all_imgs) - 1 else 150)

    prev_grids = cur_grid

frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
)
print(f'Saved {OUT} ({W_PX}x{H_PX}, {len(frames)} frames)')
