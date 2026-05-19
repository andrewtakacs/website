"""
Pre-compute submarine data JSON for the SubmarineFourier page.
Run once from the website root: python3 scripts/precompute_submarine.py
Outputs to public/data/submarine/
"""
import numpy as np
from scipy.io import loadmat
from scipy.ndimage import gaussian_filter
import json, os

DATA_PATH = os.path.expanduser(
    '~/Desktop/school/AMATH/Homework1Resubmit/subdata.mat'
)
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'submarine')
os.makedirs(OUT_DIR, exist_ok=True)

Lh = 10
N = 64
coords = np.linspace(-Lh, Lh, N + 1)[:-1]  # N points

print("Loading data...")
d = loadmat(DATA_PATH)['subdata']  # (262144, 49)

# ── 1. RAW PLOT ─────────────────────────────────────────────────────────────
# Take frame 0, reshape, normalise, then downsample to every 4th point (16^3=4096)
step = 4
raw = np.abs(d[:, 0].reshape(N, N, N))
raw /= raw.max()

xi = coords[::step]
xv, yv, zv = np.meshgrid(xi, xi, xi, indexing='ij')
raw_ds = raw[::step, ::step, ::step]
mask = raw_ds > 0.15  # keep higher-magnitude points to show the "chaotic mess"

raw_out = {
    'x': xv[mask].tolist(),
    'y': yv[mask].tolist(),
    'z': zv[mask].tolist(),
    'v': raw_ds[mask].tolist(),
}
print(f"  raw points: {len(raw_out['x'])}")
with open(os.path.join(OUT_DIR, 'raw.json'), 'w') as f:
    json.dump(raw_out, f)

# ── 2. FREQUENCY DOMAIN ─────────────────────────────────────────────────────
# Average FFT magnitude across all 49 frames
print("Computing averaged FFT...")
freqsum = np.zeros((N, N, N), dtype=float)
for t in range(49):
    frame = d[:, t].reshape(N, N, N)
    freqsum += np.abs(np.fft.fftshift(np.fft.fftn(frame)))
freqavg = freqsum / 49
freqavg /= freqavg.max()

# Find dominant frequency
dom_idx = np.unravel_index(np.argmax(freqavg), freqavg.shape)
K = (2 * np.pi / (2 * Lh)) * np.linspace(-N/2, N/2 - 1, N)
kx, ky, kz = K[dom_idx[0]], K[dom_idx[1]], K[dom_idx[2]]
print(f"  dominant frequency: kx={kx:.3f}, ky={ky:.3f}, kz={kz:.3f}")

# Keep only points above threshold to limit data size
thresh = 0.70
mask_f = freqavg > thresh
kxv, kyv, kzv = np.meshgrid(K, K, K, indexing='ij')
freq_out = {
    'kx': kxv[mask_f].tolist(),
    'ky': kyv[mask_f].tolist(),
    'kz': kzv[mask_f].tolist(),
    'v':  freqavg[mask_f].tolist(),
    'dom': {'kx': float(kx), 'ky': float(ky), 'kz': float(kz)},
}
print(f"  freq points: {len(freq_out['kx'])}")
with open(os.path.join(OUT_DIR, 'freq.json'), 'w') as f:
    json.dump(freq_out, f)

# ── 3. SUBMARINE PATH ────────────────────────────────────────────────────────
# Gaussian filter centred on dominant frequency, then inverse FFT each frame
print("Computing submarine path...")
sigma = 1.0  # filter width in index-space
filt = np.zeros((N, N, N), dtype=float)
filt[dom_idx] = 1.0
filt = gaussian_filter(filt, sigma=sigma * 2)
filt /= filt.max()

xs, ys, zs, ts = [], [], [], []
for t in range(49):
    frame = d[:, t].reshape(N, N, N)
    fhat = np.fft.fftshift(np.fft.fftn(frame))
    filtered = fhat * filt
    spatial = np.abs(np.fft.ifftn(np.fft.ifftshift(filtered)))
    spatial /= spatial.max()
    peak = np.unravel_index(np.argmax(spatial), spatial.shape)
    xs.append(float(coords[peak[0]]))
    ys.append(float(coords[peak[1]]))
    zs.append(float(coords[peak[2]]))
    ts.append(t * 0.5)  # hours (every 30 min)

path_out = {'x': xs, 'y': ys, 'z': zs, 't': ts}
with open(os.path.join(OUT_DIR, 'path.json'), 'w') as f:
    json.dump(path_out, f)
print(f"  path points: {len(xs)}")

print("\nDone! Files written to public/data/submarine/")
sizes = {f: os.path.getsize(os.path.join(OUT_DIR, f)) for f in os.listdir(OUT_DIR)}
for fn, sz in sizes.items():
    print(f"  {fn}: {sz/1024:.1f} KB")
