"""RDRE thumbnail — detonation wave rotating around an annular combustion chamber."""
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

OUT = '/Users/andrew/WEBSITE/website/public/images/thumb_rdre.gif'

BG    = [v/255 for v in MATTE]
W, H  = 3.0, 2.07
DPI   = 100
FRAMES = 48   # one full revolution

# Annulus geometry (normalised to unit outer radius)
R_OUT = 0.92
R_IN  = 0.55

# Detonation wave parameters
WAVE_AZ_SIGMA = np.radians(28)   # azimuthal half-width of the wave
WAVE_R_SIGMA  = (R_OUT - R_IN) * 0.45   # radial half-width
TRAIL_AZ      = np.radians(130)   # how far the combustion trail extends behind wave

# Build polar grid
NR   = 200
NTHETA = 800
r     = np.linspace(R_IN, R_OUT, NR)
theta = np.linspace(0, 2 * np.pi, NTHETA, endpoint=False)
R, TH = np.meshgrid(r, theta, indexing='ij')  # shape (NR, NTHETA)
X = R * np.cos(TH)
Y = R * np.sin(TH)

# Colour map: dark background → dark orange → bright white (fire)
fire_colors = [
    (0.00, (*[v/255 for v in MATTE], 1.0)),   # matte bg (fully transparent in gif)
    (0.15, (0.12, 0.08, 0.04, 1.0)),           # very dark brown
    (0.35, (0.55, 0.18, 0.02, 1.0)),           # deep orange
    (0.60, (0.88, 0.45, 0.06, 1.0)),           # bright orange
    (0.80, (0.98, 0.80, 0.30, 1.0)),           # yellow-orange
    (1.00, (1.00, 0.97, 0.90, 1.0)),           # hot white
]
fire_cmap = mcolors.LinearSegmentedColormap.from_list('fire', fire_colors)

frames = []

for fi in range(FRAMES):
    wave_angle = fi / FRAMES * 2 * np.pi   # wave leading-edge position

    # ── Compute luminosity field ──────────────────────────────────────────────
    # Angular distance from wave leading edge (wrapped to [-π, π])
    dtheta = (TH - wave_angle + np.pi) % (2 * np.pi) - np.pi

    # Detonation wave spike: Gaussian in both azimuth and radial
    r_mid = (R_IN + R_OUT) / 2
    wave_peak = (
        np.exp(-0.5 * (dtheta / WAVE_AZ_SIGMA) ** 2) *
        np.exp(-0.5 * ((R - r_mid) / WAVE_R_SIGMA) ** 2)
    )

    # Combustion trail: exponential decay behind the wave
    trail_mask = (dtheta > 0) & (dtheta < TRAIL_AZ)
    trail = np.where(
        trail_mask,
        0.30 * np.exp(-dtheta / (TRAIL_AZ * 0.4)) *
        np.exp(-0.5 * ((R - r_mid) / (WAVE_R_SIGMA * 1.6)) ** 2),
        0.0,
    )

    # Dim ring glow (unburned propellant, radial gradient)
    ring_glow = 0.04 * np.exp(-0.5 * ((R - r_mid) / (WAVE_R_SIGMA * 2.0)) ** 2)

    lum = np.clip(wave_peak + trail + ring_glow, 0, 1)

    # ── Plot ──────────────────────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(W, H), dpi=DPI, facecolor=BG)
    ax.set_facecolor(BG)

    ax.pcolormesh(X, Y, lum, cmap=fire_cmap, vmin=0, vmax=1,
                  shading='gouraud', rasterized=True, zorder=2)

    # Thin annulus outline — dark on light bg
    outline_kw = dict(fill=False, linewidth=0.6, zorder=3)
    ax.add_patch(plt.Circle((0, 0), R_OUT, edgecolor='#6B6863', **outline_kw))
    ax.add_patch(plt.Circle((0, 0), R_IN,  edgecolor='#6B6863', **outline_kw))

    # Fit full ring in height; pad horizontally for landscape frame
    v_margin = R_OUT + 0.14          # vertical: ring + padding
    h_margin = v_margin * (W / H)    # horizontal: wider because landscape
    ax.set_xlim(-h_margin, h_margin)
    ax.set_ylim(-v_margin, v_margin)
    ax.set_aspect('equal')
    ax.axis('off')

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=DPI, facecolor=BG,
                bbox_inches='tight', pad_inches=0.06)
    plt.close(fig)
    buf.seek(0)
    frames.append(Image.open(buf).convert('RGB').copy())

save_transparent_gif(frames, OUT, durations=60)
