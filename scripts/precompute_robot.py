"""
Pre-compute humanoid robot PCA data JSON for the HumanoidRobotPCA page.
Run from website root: python3 scripts/precompute_robot.py
Outputs to public/data/robot/
"""
import numpy as np
import json, os

TRAIN_DIR = os.path.expanduser('~/Desktop/school/AMATH/Homework2/hw2data/train/')
TEST_DIR  = os.path.expanduser('~/Desktop/school/AMATH/Homework2/hw2data/test/')
OUT_DIR   = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'robot')
os.makedirs(OUT_DIR, exist_ok=True)

actions = ['walking', 'jumping', 'running']
colors  = ['#B8581A', '#6B6863', '#181715']  # accent, dim, ink

# ── Load training data ───────────────────────────────────────────────────────
print("Loading training data...")
xtrain = np.zeros((114, 1500), dtype=complex)
start_col = 0
for action in actions:
    for i in range(1, 6):
        load = np.load(TRAIN_DIR + f"{action}_{i}.npy")
        end_col = start_col + load.shape[1]
        xtrain[:, start_col:end_col] = load
        start_col = end_col

xtrain_centered = xtrain - np.mean(xtrain, axis=1, keepdims=True)
U, s, Vt = np.linalg.svd(xtrain_centered, full_matrices=False)
U, s, Vt = np.real(U), np.real(s), np.real(Vt)

ground_truth = np.repeat([0, 1, 2], 500)  # 500 samples per action

# ── 1. Cumulative energy ─────────────────────────────────────────────────────
print("Computing cumulative energy...")
cumulative_energy = np.cumsum(s**2) / np.sum(s**2)
energy_out = {
    'k': list(range(1, len(cumulative_energy) + 1)),
    'energy': cumulative_energy.tolist(),
}
with open(os.path.join(OUT_DIR, 'energy.json'), 'w') as f:
    json.dump(energy_out, f)
print(f"  modes to 95%: {int(np.searchsorted(cumulative_energy, 0.95)) + 1}")

# ── 2. 3D PCA scatter (PC1, PC2, PC3) ────────────────────────────────────────
print("Computing 3D PCA projection...")
PC3 = (U[:, :3].T @ xtrain_centered).T.real  # (1500, 3)

scatter_out = {'actions': []}
for idx, (action, color) in enumerate(zip(actions, colors)):
    mask = np.where(ground_truth == idx)[0][::3]  # every 3rd point
    scatter_out['actions'].append({
        'label': action,
        'color': color,
        'pc1': PC3[mask, 0].tolist(),
        'pc2': PC3[mask, 1].tolist(),
        'pc3': PC3[mask, 2].tolist(),
    })
with open(os.path.join(OUT_DIR, 'pca3d.json'), 'w') as f:
    json.dump(scatter_out, f)
print(f"  total points: {PC3.shape[0]}")

# ── 3. Centroid classifier ───────────────────────────────────────────────────
print("Computing centroids...")
k = 3  # 3 PC modes
PC_k = (U[:, :k].T @ xtrain_centered).T.real  # (1500, k)

centroids = []
for idx, (action, color) in enumerate(zip(actions, colors)):
    c = np.mean(PC_k[ground_truth == idx], axis=0)
    centroids.append({'label': action, 'color': color, 'coords': c.tolist()})

centroid_out = {
    'scatter': scatter_out['actions'],  # reuse the 3D scatter
    'centroids': centroids,
}
with open(os.path.join(OUT_DIR, 'centroids.json'), 'w') as f:
    json.dump(centroid_out, f)

print("\nDone!")
for fn in os.listdir(OUT_DIR):
    sz = os.path.getsize(os.path.join(OUT_DIR, fn))
    print(f"  {fn}: {sz/1024:.1f} KB")
