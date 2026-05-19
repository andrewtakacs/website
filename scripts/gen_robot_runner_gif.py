"""Humanoid robot running — real MoCap skeleton, dark ink on transparent background."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
import io

DATA = '/Users/andrew/WEBSITE/website/public/data/robot/skeleton.json'
OUT  = '/Users/andrew/WEBSITE/website/public/images/thumb_robot.gif'

BG    = [v/255 for v in MATTE]
INK   = '#181715'
DIM   = '#6B6863'
FAINT = '#C4C0B8'

W, H  = 3.0, 2.07
DPI   = 100
TRAIL = 4

with open(DATA) as f:
    d = json.load(f)

frames_data = d['actions']['running']
I_bones     = d['I']
J_bones     = d['J']
N           = len(frames_data)

ys = [np.array(f['y']) for f in frames_data]
zs = [np.array(f['z']) for f in frames_data]

all_y = np.concatenate(ys)
all_z = np.concatenate(zs)

fig_h    = all_z.max() - all_z.min()
aspect   = W / H
half_w   = fig_h * aspect / 2
cy_cen   = (-all_y.max() + (-all_y.min())) / 2
ylim     = (cy_cen - half_w, cy_cen + half_w)
zlim     = (all_z.min() - 0.10, all_z.max() + 0.30)

frames = []

for fi in range(N):
    fig, ax = plt.subplots(figsize=(W, H), dpi=DPI, facecolor=BG)
    ax.set_facecolor(BG)

    # Ghost trail
    for trail_i in range(TRAIL, 0, -1):
        ghost_fi = (fi - trail_i) % N
        gy = -ys[ghost_fi]
        gz =  zs[ghost_fi]
        alpha = 0.04 + 0.04 * (TRAIL - trail_i)
        for ii, jj in zip(I_bones, J_bones):
            ax.plot([gy[ii], gy[jj]], [gz[ii], gz[jj]],
                    color=INK, lw=1.0, alpha=alpha,
                    solid_capstyle='round', zorder=2)

    # Current frame — subtle shadow then crisp ink line
    cy = -ys[fi]
    cz =  zs[fi]
    for lw, col, alpha, z in [
        (3.5, FAINT, 0.35, 3),
        (1.2, INK,   1.00, 4),
    ]:
        for ii, jj in zip(I_bones, J_bones):
            ax.plot([cy[ii], cy[jj]], [cz[ii], cz[jj]],
                    color=col, lw=lw, alpha=alpha,
                    solid_capstyle='round', zorder=z)

    # Key joints: small dark dots
    for ji in [5, 6, 11, 12, 18, 19]:
        ax.scatter([cy[ji]], [cz[ji]], s=8, color=INK, zorder=6, edgecolors='none')

    ax.set_xlim(ylim)
    ax.set_ylim(zlim)
    ax.set_aspect('equal')
    ax.axis('off')

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=DPI, facecolor=BG,
                bbox_inches='tight', pad_inches=0.05)
    plt.close(fig)
    buf.seek(0)
    frames.append(Image.open(buf).convert('RGB').copy())

save_transparent_gif(frames, OUT, durations=60)
