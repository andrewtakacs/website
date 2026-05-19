"""
Pre-compute skeleton animation data for walking, jumping, running.
Run from website root: python3 scripts/precompute_robot_anim.py
Outputs to public/data/robot/
"""
import numpy as np
import json, os

TRAIN_DIR = os.path.expanduser('~/Desktop/school/AMATH/Homework2/hw2data/train/')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'robot')
os.makedirs(OUT_DIR, exist_ok=True)

# Skeleton bone connections (0-indexed), from HW2_Helper.ipynb
I = np.array([1,2,3,4,5,6,1,8,9,10,11,12,1,14,15,16,17,18,19,16,21,22,23,25,26,24,28,16,30,31,32,33,34,35,33,37]) - 1
J = np.array([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,26,27,28,29,30,31,32,33,34,35,36,37,38]) - 1

actions = ['walking', 'jumping', 'running']

# Use sample _1 for each action (clean representative sample)
STEP = 2  # take every 2nd frame to halve data size

out = {
    'I': I.tolist(),
    'J': J.tolist(),
    'actions': {},
}

for action in actions:
    path = TRAIN_DIR + f'{action}_1.npy'
    vals = np.load(path)             # (114, T)
    xyz = vals.reshape(38, 3, -1)    # (38 joints, 3 coords, T frames)
    xyz = xyz.real

    # Center on root joint (joint 0) at frame 0, normalize scale
    root = xyz[0, :, 0:1]           # (3, 1)
    xyz = xyz - root
    scale = np.percentile(np.abs(xyz), 95)
    xyz = xyz / scale

    T = xyz.shape[2]
    frames = []
    for t in range(0, T, STEP):
        frame_joints = xyz[:, :, t]  # (38, 3)
        frames.append({
            'x': np.round(frame_joints[:, 0], 4).tolist(),
            'y': np.round(frame_joints[:, 1], 4).tolist(),
            'z': np.round(frame_joints[:, 2], 4).tolist(),
        })

    out['actions'][action] = frames
    print(f"  {action}: {len(frames)} frames, {T} original")

with open(os.path.join(OUT_DIR, 'skeleton.json'), 'w') as f:
    json.dump(out, f, separators=(',', ':'))  # compact

sz = os.path.getsize(os.path.join(OUT_DIR, 'skeleton.json'))
print(f"\nDone! skeleton.json: {sz/1024:.1f} KB")
