"""IAM Handwriting thumbnail — cursive 'hello' drawn stroke-by-stroke on ruled paper."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy.interpolate import splprep, splev
from PIL import Image
import io

OUT = '/Users/andrew/WEBSITE/website/public/images/thumb_iam.gif'

BG        = [v/255 for v in MATTE]
INK       = '#181715'
ACCENT    = '#B8581A'
RULE      = '#D8D4CD'
DIM       = '#6B6863'

W, H   = 3.0, 2.07
DPI    = 100

FRAMES_DRAW = 72
FRAMES_HOLD = 22

# ── Cursive 'hello' waypoints ─────────────────────────────────────────────────
# Axes limits: x ∈ [0,10], y ∈ [0,7]  (y=0 bottom in matplotlib)
# Baseline: y=2.5  |  x-height midline: y=3.6  |  ascender top: y=5.6
# Each group of waypoints is one letter; they chain together continuously.

raw_pts = np.array([
    # ── h ──────────────────────────────────────────────────────────────────────
    [0.70, 2.50],  # entry
    [0.72, 3.20],
    [0.74, 5.60],  # ascender peak
    [0.76, 3.20],
    [0.78, 2.50],  # back to baseline
    [1.00, 3.10],  # arch begins
    [1.20, 3.70],  # arch top
    [1.40, 3.10],
    [1.55, 2.50],  # back to baseline
    [1.65, 2.50],  # exit h

    # ── e ──────────────────────────────────────────────────────────────────────
    [1.75, 3.10],  # rise to midline
    [1.90, 3.65],  # top of e
    [2.15, 3.70],
    [2.38, 3.50],
    [2.45, 3.10],  # right side
    [2.38, 2.68],
    [2.10, 2.50],  # bottom of e
    [1.88, 2.58],
    [1.80, 2.90],  # back up through middle
    [2.40, 2.90],  # cross-bar exit
    [2.58, 2.50],  # exit e

    # ── l ──────────────────────────────────────────────────────────────────────
    [2.68, 3.20],
    [2.75, 5.60],  # ascender peak
    [2.80, 3.20],
    [2.85, 2.50],  # baseline
    [2.95, 2.28],  # small bottom loop
    [3.12, 2.32],
    [3.20, 2.50],  # exit l
    [3.30, 2.50],  # connecting stroke

    # ── l ──────────────────────────────────────────────────────────────────────
    [3.40, 3.20],
    [3.47, 5.60],  # ascender peak
    [3.52, 3.20],
    [3.57, 2.50],  # baseline
    [3.67, 2.28],  # small bottom loop
    [3.84, 2.32],
    [3.92, 2.50],  # exit l
    [4.02, 2.50],  # connecting stroke

    # ── o ──────────────────────────────────────────────────────────────────────
    [4.12, 3.00],  # rise into o
    [4.16, 3.70],  # top-left of oval
    [4.42, 4.00],  # top
    [4.72, 3.90],  # top-right
    [4.88, 3.50],  # right side
    [4.88, 2.90],
    [4.68, 2.45],  # bottom
    [4.38, 2.38],
    [4.14, 2.58],  # bottom-left
    [4.12, 3.00],  # close oval (back to entry)
    [4.90, 3.10],  # exit right
    [5.00, 2.50],  # exit o at baseline
])

# Smooth spline through all waypoints
tck, u = splprep([raw_pts[:, 0], raw_pts[:, 1]], s=0.08, k=3)
u_fine = np.linspace(0, 1, 1200)
xs, ys = splev(u_fine, tck)

N = len(xs)

# ── Ruled-line y positions ────────────────────────────────────────────────────
BASELINE = 2.50
MIDLINE  = 3.60
ASCENDER = 5.60

def make_frame(reveal, cursor=True):
    fig, ax = plt.subplots(figsize=(W, H), dpi=DPI, facecolor=BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.set_aspect('equal')
    ax.axis('off')

    # Ruled lines
    for y, lw, ls in [
        (BASELINE, 0.8, '-'),
        (MIDLINE,  0.5, '--'),
        (ASCENDER, 0.5, ':'),
    ]:
        ax.axhline(y, color=RULE, linewidth=lw, linestyle=ls, zorder=1)

    # Drawn stroke up to reveal
    end = max(2, reveal)
    TRAIL = max(1, N // 18)

    # Older ink — full opacity
    if end - TRAIL > 1:
        ax.plot(xs[:end - TRAIL], ys[:end - TRAIL],
                color=INK, linewidth=1.6, solid_capstyle='round',
                solid_joinstyle='round', zorder=3)

    # Recent trail — fades from dim to ink
    for i in range(max(0, end - TRAIL), end - 1):
        t = (i - (end - TRAIL)) / TRAIL
        r = int(24  + (180 - 24)  * (1 - t))
        g = int(23  + (174 - 23)  * (1 - t))
        b = int(21  + (167 - 21)  * (1 - t))
        col = (r/255, g/255, b/255)
        ax.plot(xs[i:i+2], ys[i:i+2],
                color=col, linewidth=1.6, solid_capstyle='round',
                solid_joinstyle='round', zorder=4)

    # Pen cursor dot
    if cursor and end >= 1:
        ax.plot(xs[end - 1], ys[end - 1], 'o',
                color=ACCENT, markersize=4.5, zorder=5)

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=DPI, facecolor=BG,
                bbox_inches='tight', pad_inches=0.06)
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert('RGB').copy()

# ── Render frames ─────────────────────────────────────────────────────────────
frames    = []
durations = []

# Ease-in-out curve so early strokes feel deliberate, later ones flow
for fi in range(FRAMES_DRAW):
    t = fi / (FRAMES_DRAW - 1)
    # slight ease-in then linear
    t_eased = t ** 0.75
    reveal = max(2, int(N * t_eased))
    frames.append(make_frame(reveal, cursor=True))
    durations.append(55)

# Hold final frame (no cursor — ink is dry)
final = make_frame(N, cursor=False)
for _ in range(FRAMES_HOLD):
    frames.append(final.copy())
    durations.append(90)

save_transparent_gif(frames, OUT, durations)
