"""Generate rotating PCA scatter GIF for the humanoid robot thumbnail."""
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
import io

DATA = '/Users/andrew/WEBSITE/website/public/data/robot/pca3d.json'
OUT  = '/Users/andrew/WEBSITE/website/public/images/thumb_robot.gif'

BG  = '#0f0e0c'
DIM = '#6B6863'

COLORS = {
    'walking': '#B8581A',
    'jumping': '#C4C0B8',
    'running': '#F5F4F2',
}

W, H = 3.0, 2.07
DPI  = 100
FRAMES = 60  # one full rotation

with open(DATA) as f:
    d = json.load(f)

frames = []

for fi in range(FRAMES):
    azim = -60 + fi * (360 / FRAMES)

    fig = plt.figure(figsize=(W, H), dpi=DPI, facecolor=BG)
    ax  = fig.add_subplot(111, projection='3d', facecolor=BG)

    for action in d['actions']:
        label  = action['label']
        color  = COLORS.get(label, DIM)
        pc1    = action['pc1']
        pc2    = action['pc2']
        pc3    = action['pc3']
        ax.scatter(pc1, pc2, pc3, color=color, s=2, alpha=0.6, linewidths=0)

    for pane in [ax.xaxis.pane, ax.yaxis.pane, ax.zaxis.pane]:
        pane.fill = False
        pane.set_edgecolor('#2a2826')
    ax.grid(False)
    ax.set_xticks([]); ax.set_yticks([]); ax.set_zticks([])
    ax.set_xlabel('PC1', color=DIM, fontsize=6, labelpad=-8)
    ax.set_ylabel('PC2', color=DIM, fontsize=6, labelpad=-8)
    ax.set_zlabel('PC3', color=DIM, fontsize=6, labelpad=-8)
    ax.xaxis.label.set_fontfamily('monospace')
    ax.yaxis.label.set_fontfamily('monospace')
    ax.zaxis.label.set_fontfamily('monospace')

    ax.view_init(elev=18, azim=azim)

    ax.text2D(0.04, 0.92, 'PCA · walk / jump / run', transform=ax.transAxes,
              color=DIM, fontsize=6, fontfamily='monospace')

    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=DPI, facecolor=BG, bbox_inches='tight', pad_inches=0.05)
    plt.close(fig)
    buf.seek(0)
    frames.append(Image.open(buf).copy())

W_px = frames[0].width
H_px = frames[0].height
frames = [f.resize((W_px, H_px), Image.LANCZOS) for f in frames]

frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=80,
    loop=0,
    optimize=True,
)
print(f'Saved {OUT} ({W_px}x{H_px}, {len(frames)} frames)')
