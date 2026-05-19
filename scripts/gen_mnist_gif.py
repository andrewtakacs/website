"""Generate confusion matrix GIF cycling through classifiers for MNIST thumbnail."""
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from PIL import Image
import io

DATA = '/Users/andrew/WEBSITE/website/public/data/mnist/confusion.json'
OUT  = '/Users/andrew/WEBSITE/website/public/images/thumb_mnist.gif'

BG   = '#0f0e0c'
DIM  = '#6B6863'
ACC  = '#B8581A'

W, H = 3.0, 2.07
DPI  = 100

with open(DATA) as f:
    d = json.load(f)

classifiers = d['classifiers']  # [{name, matrix, accuracy}, ...]

# Custom dark colormap: near-black → orange
cmap_colors = ['#0f0e0c', '#1a1512', '#3d2610', '#7a4a1e', '#B8581A', '#d4743a']
dark_orange  = mcolors.LinearSegmentedColormap.from_list('dark_orange', cmap_colors)

HOLD_FRAMES = 25
FADE_FRAMES = 8

frames = []
durations = []

for clf in classifiers:
    name     = clf['name']
    matrix   = np.array(clf['matrix'], dtype=float)
    accuracy = clf['accuracy']

    # Normalise rows so color shows per-class accuracy
    row_sums = matrix.sum(axis=1, keepdims=True)
    norm     = np.where(row_sums > 0, matrix / row_sums, 0)

    # --- hold frames ---
    for _ in range(HOLD_FRAMES):
        fig, ax = plt.subplots(figsize=(W, H), dpi=DPI, facecolor=BG)
        ax.set_facecolor(BG)

        im = ax.imshow(norm, cmap=dark_orange, vmin=0, vmax=1, aspect='auto')

        ax.set_xticks([]); ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_edgecolor('#2a2826')

        short = name.split('(')[0].strip()
        ax.set_title(f'{short} · {accuracy*100:.1f}% acc',
                     color=DIM, fontsize=7, fontfamily='monospace', pad=4)

        fig.tight_layout(pad=0.3)
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=DPI, facecolor=BG)
        plt.close(fig)
        buf.seek(0)
        frames.append(Image.open(buf).copy())
        durations.append(60)

    # --- quick fade out (darken) ---
    for fi in range(FADE_FRAMES):
        alpha = 1.0 - (fi + 1) / FADE_FRAMES
        fig, ax = plt.subplots(figsize=(W, H), dpi=DPI, facecolor=BG)
        ax.set_facecolor(BG)

        faded = mcolors.LinearSegmentedColormap.from_list(
            'faded', [c + f'{int(alpha*255):02x}' if len(c)==7 else c for c in cmap_colors])
        ax.imshow(norm * alpha, cmap=dark_orange, vmin=0, vmax=1, aspect='auto')
        ax.set_xticks([]); ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_edgecolor('#2a2826')

        short = name.split('(')[0].strip()
        ax.set_title(f'{short} · {accuracy*100:.1f}% acc',
                     color=DIM, fontsize=7, fontfamily='monospace', pad=4,
                     alpha=alpha)

        fig.tight_layout(pad=0.3)
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=DPI, facecolor=BG)
        plt.close(fig)
        buf.seek(0)
        frames.append(Image.open(buf).copy())
        durations.append(40)

W_px = frames[0].width
H_px = frames[0].height
frames = [f.resize((W_px, H_px), Image.LANCZOS) for f in frames]

frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
)
print(f'Saved {OUT} ({W_px}x{H_px}, {len(frames)} frames)')
