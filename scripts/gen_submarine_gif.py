"""Submarine path animation — transparent background, dark ink palette."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import json, math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
import io

DATA = '/Users/andrew/WEBSITE/website/public/data/submarine/path.json'
OUT  = '/Users/andrew/WEBSITE/website/public/images/thumb_submarine.gif'

BG   = [v/255 for v in MATTE]
LINE = '#B8581A'
HEAD = '#181715'
DIM  = '#6B6863'
GRID = '#C4C0B8'

W, H = 3.0, 2.07
DPI  = 100
TOTAL_FRAMES = 60
DRAW_FRAMES  = 49

with open(DATA) as f:
    d = json.load(f)
xs, ys, zs = d['x'], d['y'], d['z']

xr = [min(xs)-.5, max(xs)+.5]
yr = [min(ys)-.5, max(ys)+.5]
zr = [min(zs)-.5, max(zs)+.5]

frames = []

for fi in range(TOTAL_FRAMES):
    fig = plt.figure(figsize=(W, H), dpi=DPI, facecolor=BG)
    ax  = fig.add_subplot(111, projection='3d')
    ax.set_facecolor(BG)

    n = min(fi + 1, DRAW_FRAMES)

    ax.plot(xs[:n], ys[:n], zs[:n], color=LINE, lw=1.8, alpha=0.95)
    ax.scatter([xs[n-1]], [ys[n-1]], [zs[n-1]], color=HEAD, s=22, zorder=5)

    ax.set_xlim(xr); ax.set_ylim(yr); ax.set_zlim(zr)
    ax.set_axis_off()

    elev = 20 + 5 * math.sin(fi * math.pi / TOTAL_FRAMES)
    azim = -60 + fi * (90 / TOTAL_FRAMES)
    ax.view_init(elev=elev, azim=azim)

    ax.text2D(0.04, 0.92, 'submarine path', transform=ax.transAxes,
              color=DIM, fontsize=6, fontfamily='monospace')

    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=DPI,
                facecolor=BG, bbox_inches='tight', pad_inches=0.05)
    plt.close(fig)
    buf.seek(0)
    frames.append(Image.open(buf).convert('RGB').copy())

durations = [60] * DRAW_FRAMES + [120] * (TOTAL_FRAMES - DRAW_FRAMES)
save_transparent_gif(frames, OUT, durations)
