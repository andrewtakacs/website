"""
Pre-compute MNIST data for the MNISTClassification page.
Run once from the website root: python3 scripts/precompute_mnist.py
Outputs to public/data/mnist/
"""
import numpy as np
import struct, json, os, base64
from io import BytesIO
from PIL import Image
from sklearn.decomposition import PCA
from sklearn.linear_model import RidgeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.metrics import confusion_matrix

DATA_DIR = os.path.expanduser('~/Desktop/school/AMATH/Homework3/data/')
OUT_DIR  = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'mnist')
os.makedirs(OUT_DIR, exist_ok=True)

def read_images(path):
    with open(path, 'rb') as f:
        _, n, r, c = struct.unpack('>IIII', f.read(16))
        return np.frombuffer(f.read(), dtype=np.uint8).reshape(n, r, c)

def read_labels(path):
    with open(path, 'rb') as f:
        _, n = struct.unpack('>II', f.read(8))
        return np.frombuffer(f.read(), dtype=np.uint8)

def arr_to_b64(arr_2d):
    """Normalize float array to uint8 PNG base64, 28×28 stored, CSS scales it."""
    a = arr_2d.astype(float)
    lo, hi = a.min(), a.max()
    if hi > lo:
        a = (a - lo) / (hi - lo) * 255
    img = Image.fromarray(a.astype(np.uint8), mode='L')
    buf = BytesIO()
    img.save(buf, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

# ── Load data ────────────────────────────────────────────────────────────────
print("Loading MNIST...")
X_train = read_images(DATA_DIR + 'train-images.idx3-ubyte')  # (60000, 28, 28)
y_train = read_labels(DATA_DIR + 'train-labels.idx1-ubyte')
X_test  = read_images(DATA_DIR + 't10k-images.idx3-ubyte')
y_test  = read_labels(DATA_DIR + 't10k-labels.idx1-ubyte')

X_train_flat   = X_train.reshape(60000, 784).astype(float) / 255.0
X_test_flat    = X_test.reshape(10000, 784).astype(float)  / 255.0

# ── 1. Full PCA for energy + PC modes ────────────────────────────────────────
print("Fitting full PCA(784)...")
pca_full = PCA(n_components=784)
pca_full.fit(X_train_flat)

cumvar = np.cumsum(pca_full.explained_variance_ratio_)
thresh = 0.85
k_thresh = int(np.searchsorted(cumvar, thresh)) + 1

print(f"  components at {thresh*100:.0f}%: {k_thresh}")

with open(os.path.join(OUT_DIR, 'energy.json'), 'w') as f:
    json.dump({
        'k': list(range(1, 785)),
        'energy': cumvar.tolist(),
        'threshold': thresh,
        'k_threshold': k_thresh,
    }, f, separators=(',', ':'))

# PC modes — negate like the notebook does for visual clarity
components = pca_full.components_[:16].reshape(16, 28, 28)
pc_images = [arr_to_b64(-components[i]) for i in range(16)]

with open(os.path.join(OUT_DIR, 'pcmodes.json'), 'w') as f:
    json.dump({'images': pc_images}, f, separators=(',', ':'))
print(f"  PC modes written")

# ── 2. Reconstructions at various k values ───────────────────────────────────
print("Computing reconstructions...")
k_values = [1, 3, 59, 184, 784]

# One representative sample per digit 0-9 from training set
sample_idx = [np.where(y_train == d)[0][0] for d in range(10)]
samples = X_train_flat[sample_idx]  # (10, 784)

rows = []
for k in k_values:
    print(f"  k={k}...")
    pca_k = PCA(n_components=k)
    pca_k.fit(X_train_flat)
    projected   = pca_k.transform(samples)
    recon       = pca_k.inverse_transform(projected)  # (10, 784)
    energy_pct  = float(cumvar[k - 1]) * 100
    imgs = [arr_to_b64(recon[d].reshape(28, 28)) for d in range(10)]
    rows.append({'k': k, 'energy': round(energy_pct, 2), 'images': imgs})

with open(os.path.join(OUT_DIR, 'reconstructions.json'), 'w') as f:
    json.dump({'rows': rows}, f, separators=(',', ':'))
print("  Reconstructions written")

# ── 3. Classifiers + confusion matrices ──────────────────────────────────────
print("Fitting PCA(59) for classifiers...")
pca_59 = PCA(n_components=k_thresh)
X_tr = pca_59.fit_transform(X_train_flat)
X_te = pca_59.transform(X_test_flat)
y_train_int = y_train.astype(int)
y_test_int  = y_test.astype(int)

classifiers = []

for name, clf in [
    ('Ridge (α=0.001)',  RidgeClassifier(alpha=0.001)),
    ('KNN (n=3)',        KNeighborsClassifier(n_neighbors=3)),
    ('LDA (svd)',        LinearDiscriminantAnalysis(solver='svd')),
]:
    print(f"  {name}...")
    clf.fit(X_tr, y_train_int)
    y_pred = clf.predict(X_te)
    cm = confusion_matrix(y_test_int, y_pred).tolist()
    acc = float((np.array(y_pred) == y_test_int).mean())
    classifiers.append({'name': name, 'matrix': cm, 'accuracy': round(acc, 4)})
    print(f"    accuracy: {acc:.4f}")

# SVM hardcoded from notebook results (full RBF SVC would take too long)
classifiers.append({
    'name': 'SVM (RBF)',
    'matrix': [
        [974,  0,  1,  0,  0,  2,  0,  1,  2,  0],
        [  0,1130,  2,  0,  0,  0,  2,  0,  1,  0],
        [  5,  0,1012,  0,  0,  0,  2,  9,  4,  0],
        [  0,  0,  1,996,  0,  3,  0,  6,  3,  1],
        [  0,  0,  2,  0,966,  0,  3,  0,  1, 10],
        [  2,  0,  0,  7,  1,877,  2,  0,  2,  1],
        [  6,  2,  0,  0,  2,  2,945,  0,  1,  0],
        [  0,  5,  9,  2,  2,  0,  0,1003,  0,  7],
        [  2,  0,  1,  3,  1,  3,  1,  2,959,  2],
        [  2,  3,  1,  6,  8,  2,  1,  4,  2,980],
    ],
    'accuracy': 0.9841,
})

# Metrics table (from notebook results)
metrics = {
    'headers': ['Ridge', 'KNN', 'LDA', 'SVM'],
    'rows': [
        {'label': 'Precision',    'values': [0.85934, 0.97522, 0.87610, 0.98410]},
        {'label': 'Recall',       'values': [0.85318, 0.97488, 0.87400, 0.98410]},
        {'label': 'F1 Score',     'values': [0.85312, 0.97500, 0.87410, 0.98410]},
        {'label': 'CV Accuracy',  'values': [0.84385, 0.97613, 0.86550, 0.98210]},
        {'label': 'Test Accuracy','values': [0.85610, 0.97520, 0.87530, 0.98410]},
    ],
}

with open(os.path.join(OUT_DIR, 'confusion.json'), 'w') as f:
    json.dump({'classifiers': classifiers, 'metrics': metrics}, f, separators=(',', ':'))
print("  Confusion matrices written")

print("\nDone!")
for fn in sorted(os.listdir(OUT_DIR)):
    sz = os.path.getsize(os.path.join(OUT_DIR, fn))
    print(f"  {fn}: {sz/1024:.1f} KB")
