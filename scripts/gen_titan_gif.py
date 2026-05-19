"""Titan submersible — horizontal rotating buckled hull with hemispherical endcaps."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from gif_utils import save_transparent_gif, MATTE

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from PIL import Image
import io

OUT = '/Users/andrew/WEBSITE/website/public/images/thumb_titan.gif'

BG     = [v/255 for v in MATTE]
W, H   = 4.2, 2.07
DPI    = 100
FRAMES = 72

R     = 0.7765
L     = 2.540
AMP   = 0.38 * R

N_C = 2
M_A = 2

N_THETA = 90
N_Z     = 55
N_CAP   = 30

theta = np.linspace(0, 2 * np.pi, N_THETA, endpoint=True)
z_pts = np.linspace(0, L, N_Z)
TH, ZZ = np.meshgrid(theta, z_pts)

# Endcap parametric grid
phi_c = np.linspace(0, np.pi / 2, N_CAP)
t_cap = np.linspace(0, 2 * np.pi, N_THETA, endpoint=True)
PHI_C, T_CAP = np.meshgrid(phi_c, t_cap)

# w=0 at both ends → w_norm=0.5 → neutral mid-colormap
CAP_COLOR = '#8A9EB8'

cmap = mcolors.LinearSegmentedColormap.from_list(
    'titan_stress',
    ['#1A3A6C', '#8A9EB8', '#C42010'],  # compression (blue) → neutral steel → tension (red)
)

frames = []

for fi in range(FRAMES):
    t   = fi / FRAMES
    amp = AMP * 0.5 * (1.0 - np.cos(2 * np.pi * t))

    w     = amp * np.cos(N_C * TH) * np.sin(M_A * np.pi * ZZ / L)
    R_def = R + w

    # Cylinder axis along X (horizontal sub orientation)
    X_hull = ZZ - L / 2
    Y_hull = R_def * np.cos(TH)
    Z_hull = R_def * np.sin(TH)

    w_norm = np.clip((w / (AMP + 1e-9) + 1.0) / 2.0, 0, 1)

    # Hemispherical endcaps
    r_cap  = R * np.cos(PHI_C)
    ax_cap = R * np.sin(PHI_C)
    Y_cap  = r_cap * np.cos(T_CAP)
    Z_cap  = r_cap * np.sin(T_CAP)
    X_front =  L / 2 + ax_cap
    X_back  = -L / 2 - ax_cap

    fig = plt.figure(figsize=(W, H), dpi=DPI, facecolor=BG)
    ax  = fig.add_subplot(111, projection='3d')
    ax.set_facecolor(BG)

    ax.plot_surface(X_hull, Y_hull, Z_hull,
                    facecolors=cmap(w_norm),
                    linewidth=0, antialiased=True, shade=False)

    cap_kw = dict(linewidth=0, antialiased=True, shade=False)
    ax.plot_surface(X_front, Y_cap, Z_cap, color=CAP_COLOR, **cap_kw)
    ax.plot_surface(X_back,  Y_cap, Z_cap, color=CAP_COLOR, **cap_kw)

    # Undeformed reference rings at both junctions
    t_ring  = np.linspace(0, 2 * np.pi, 200)
    ring_kw = dict(color='#C4C0B8', linewidth=0.7, linestyle='--', alpha=0.7)
    ax.plot(np.full_like(t_ring, -L/2), R*np.cos(t_ring), R*np.sin(t_ring), **ring_kw)
    ax.plot(np.full_like(t_ring,  L/2), R*np.cos(t_ring), R*np.sin(t_ring), **ring_kw)

    ax.set_axis_off()
    for pane in [ax.xaxis.pane, ax.yaxis.pane, ax.zaxis.pane]:
        pane.fill = False
        pane.set_edgecolor('none')
    ax.grid(False)

    lim      = (R + AMP) * 1.35
    half_len = L / 2 + R + 0.05
    ax.set_xlim(-half_len, half_len)
    ax.set_ylim(-lim, lim)
    ax.set_zlim(-lim, lim)
    ax.set_box_aspect([2 * half_len, 2 * lim, 2 * lim])

    azim = fi * (360.0 / FRAMES)
    ax.view_init(elev=15, azim=azim)

    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=DPI, facecolor=BG,
                bbox_inches='tight', pad_inches=0.04)
    plt.close(fig)
    buf.seek(0)
    frames.append(Image.open(buf).convert('RGB').copy())

save_transparent_gif(frames, OUT, durations=60)
