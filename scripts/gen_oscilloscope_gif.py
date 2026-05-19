"""Oscilloscope Lissajous — dark green phosphor on transparent background."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
import io

OUT = '/Users/andrew/WEBSITE/website/public/images/thumb_oscilloscope.gif'

BG     = [v/255 for v in MATTE]
GRID   = '#D8D4CE'
GREEN  = '#1a6b2a'    # muted dark green — readable on light bg
MID    = '#2e9448'    # brighter layer
GLOW   = '#a8d8b0'    # wide soft halo (desaturated)
DOT    = '#0f4d1c'

W, H   = 3.0, 2.07
DPI    = 100
FRAMES = 80

frames = []

for fi in range(FRAMES):
    fig, ax = plt.subplots(figsize=(W, H), dpi=DPI, facecolor=BG)
    ax.set_facecolor(BG)

    delta = (fi / FRAMES) * 2 * np.pi
    t_full = np.linspace(0, 2 * np.pi, 2000)
    x_full = np.sin(3 * t_full + delta)
    y_full = np.sin(4 * t_full)

    fill_frac = min(1.0, fi / (FRAMES * 0.6))
    n = max(2, int(len(t_full) * fill_frac))
    x = x_full[:n]
    y = y_full[:n]

    # Faint grid
    for v in [-0.5, 0, 0.5]:
        ax.axhline(v, color=GRID, lw=0.5, zorder=1)
        ax.axvline(v, color=GRID, lw=0.5, zorder=1)

    # Glow layers: soft wide → medium → crisp bright
    ax.plot(x, y, color=GLOW,  lw=7, alpha=0.35, solid_capstyle='round', zorder=2)
    ax.plot(x, y, color=MID,   lw=2.5, alpha=0.7, solid_capstyle='round', zorder=3)
    ax.plot(x, y, color=GREEN, lw=1.0, alpha=1.0, solid_capstyle='round', zorder=4)

    if n > 1:
        ax.scatter([x[-1]], [y[-1]], color=DOT, s=16, zorder=5, edgecolors='none')

    ax.set_xlim(-1.15, 1.15)
    ax.set_ylim(-1.15, 1.15)
    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_edgecolor(GRID)
        spine.set_linewidth(0.5)

    fig.tight_layout(pad=0.2)

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=DPI, facecolor=BG)
    plt.close(fig)
    buf.seek(0)
    frames.append(Image.open(buf).convert('RGB').copy())

save_transparent_gif(frames, OUT, durations=55)
