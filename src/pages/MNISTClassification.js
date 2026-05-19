import { useState, useEffect, useRef, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import Footer from '../components/Footer';
import './AIProjects.css';

let PlotlyComponent = null;
const dataUrl = (name) => `${process.env.PUBLIC_URL}/data/mnist/${name}`;

function useScrollPassthrough() {
  const ref = useRef(null);
  const handler = useCallback((e) => {
    window.scrollBy({ top: e.deltaY, behavior: 'auto' });
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('wheel', handler, { passive: true });
    return () => el.removeEventListener('wheel', handler);
  }, [handler]);
  return ref;
}

function loadPlotly() {
  return PlotlyComponent
    ? Promise.resolve(PlotlyComponent)
    : import('react-plotly.js').then(m => { PlotlyComponent = m.default; return m.default; });
}

const plotConfig = {
  displayModeBar: 'hover',
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  displaylogo: false,
  responsive: true,
  scrollZoom: false,
};

const monoFont = "'IBM Plex Mono', monospace";

// ── Preprocessing: crop bounding box, scale to ~20×20, center in 28×28 ──────
// This matches the MNIST normalization so drawn digits align with training data.
function preprocessPixels(canvas) {
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, 28, 28).data;

  let minX = 28, maxX = -1, minY = 28, maxY = -1;
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      if (data[(y * 28 + x) * 4] > 10) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;

  const w = maxX - minX + 1, h = maxY - minY + 1;
  const scale = 18 / Math.max(w, h);
  const newW = Math.round(w * scale), newH = Math.round(h * scale);
  const offX = Math.round((28 - newW) / 2), offY = Math.round((28 - newH) / 2);

  const tmp = document.createElement('canvas');
  tmp.width = 28; tmp.height = 28;
  const tctx = tmp.getContext('2d');
  tctx.fillStyle = '#000';
  tctx.fillRect(0, 0, 28, 28);
  tctx.imageSmoothingEnabled = true;
  tctx.imageSmoothingQuality = 'high';
  tctx.drawImage(canvas, minX, minY, w, h, offX, offY, newW, newH);

  const out = tctx.getImageData(0, 0, 28, 28).data;
  const pixels = new Float32Array(784);
  for (let i = 0; i < 784; i++) pixels[i] = out[i * 4] / 255;
  return pixels;
}

// ── Model inference helpers ──────────────────────────────────────────────────
// x(n_in) @ W(n_in*n_out flat) + b(n_out) → out(n_out)
function vecMatAdd(x, W, b, nIn, nOut) {
  const out = new Float32Array(nOut);
  for (let j = 0; j < nOut; j++) {
    let s = b[j];
    for (let i = 0; i < nIn; i++) s += x[i] * W[i * nOut + j];
    out[j] = s;
  }
  return out;
}

function runModel(pixels, m) {
  // PCA project: centered @ components_T  (784→59)
  const centered = pixels.map((v, i) => v - m.mean[i]);
  const pca = vecMatAdd(centered, m.components_T, new Float32Array(m.dims.pca_out), m.dims.pca_in, m.dims.pca_out);
  // Hidden layer with ReLU
  let h = vecMatAdd(pca, m.W1, m.b1, m.dims.pca_out, m.dims.h1);
  h = h.map(v => Math.max(0, v));
  // Output + softmax
  const logits = vecMatAdd(h, m.W2, m.b2, m.dims.h1, m.dims.out);
  const maxL = Math.max(...logits);
  const exp = logits.map(v => Math.exp(v - maxL));
  const sum = exp.reduce((a, b) => a + b, 0);
  return Array.from(exp.map(v => v / sum));
}

// ── Draw & predict component ─────────────────────────────────────────────────
function DrawPredict() {
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [probs, setProbs] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef(null);

  useEffect(() => {
    fetch(dataUrl('model.json')).then(r => r.json()).then(m => {
      m.mean         = new Float32Array(m.mean);
      m.components_T = new Float32Array(m.components_T);
      m.W1 = new Float32Array(m.W1);
      m.b1 = new Float32Array(m.b1);
      m.W2 = new Float32Array(m.W2);
      m.b2 = new Float32Array(m.b2);
      setModel(m);
    });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 28, 28);
  }, []);

  const predict = useCallback(() => {
    if (!model) return;
    const pixels = preprocessPixels(canvasRef.current);
    if (!pixels) return;
    setProbs(runModel(pixels, model));
  }, [model]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 28, 28);
    setProbs(null);
  }, []);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (28 / r.width),
      y: (src.clientY - r.top)  * (28 / r.height),
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    setDrawing(true);
    lastPos.current = getPos(e, canvasRef.current);
  }, []);

  const draw = useCallback((e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }, [drawing]);

  const endDraw = useCallback((e) => {
    e.preventDefault();
    setDrawing(false);
    lastPos.current = null;
    predict();
  }, [predict]);

  const predicted = probs ? probs.indexOf(Math.max(...probs)) : null;

  return (
    <div className="draw-wrap">
      <div className="draw-canvas-col">
        <canvas
          ref={canvasRef}
          width={28} height={28}
          className="draw-canvas draw-canvas-pixel"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <button className="draw-clear" onClick={clear}>clear</button>
      </div>
      <div className="draw-result-col">
        {!model && <span className="draw-hint">loading model…</span>}
        {model && (
          <>
            <div className="draw-predicted">{predicted !== null ? predicted : ' '}</div>
            <div className="draw-bars">
              {Array.from({ length: 10 }, (_, i) => {
                const p = probs ? probs[i] : 0;
                return (
                  <div key={i} className={`draw-bar-row${i === predicted ? ' draw-bar-best' : ''}`}>
                    <span className="draw-bar-label">{i}</span>
                    <div className="draw-bar-track">
                      <div className="draw-bar-fill" style={{ width: `${(p * 100).toFixed(1)}%` }} />
                    </div>
                    <span className="draw-bar-pct">{probs ? `${(p * 100).toFixed(1)}%` : ' '}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Cumulative energy ────────────────────────────────────────────────────────
function EnergyPlot() {
  const [Plot, setPlot] = useState(null);
  const [d, setD] = useState(null);
  const ref = useScrollPassthrough();

  useEffect(() => {
    Promise.all([loadPlotly(), fetch(dataUrl('energy.json')).then(r => r.json())])
      .then(([Plt, json]) => { setPlot(() => Plt); setD(json); });
  }, []);

  if (!d || !Plot) return <div className="plot-loading">loading plot…</div>;

  const traces = [
    {
      type: 'scatter', mode: 'lines',
      x: d.k, y: d.energy.map(v => v * 100),
      line: { color: '#B8581A', width: 2 },
      name: 'cumulative variance',
      hovertemplate: 'k=%{x}  %{y:.2f}%<extra></extra>',
    },
    {
      type: 'scatter', mode: 'markers',
      x: [d.k_threshold], y: [d.energy[d.k_threshold - 1] * 100],
      marker: { color: '#181715', size: 7 },
      name: `${d.threshold * 100}% threshold`,
      hovertemplate: `k=${d.k_threshold} · threshold<extra></extra>`,
    },
    {
      type: 'scatter', mode: 'lines',
      x: [1, 784], y: [d.threshold * 100, d.threshold * 100],
      line: { color: '#C4C0B8', width: 1, dash: 'dot' },
      name: `${d.threshold * 100}%`,
      hoverinfo: 'none',
    },
  ];

  return (
    <div className="submarine-plot-wrap">
      <div className="robot-plot-sizer" ref={ref}>
        <Plot
          data={traces}
          layout={{
            paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
            font: { family: monoFont, size: 10, color: '#6B6863' },
            margin: { l: 45, r: 20, t: 10, b: 40 },
            xaxis: { title: { text: 'PC components (k)', font: { size: 10 } }, gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8' },
            yaxis: { title: { text: 'cumulative variance (%)', font: { size: 10 } }, gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', range: [0, 101] },
            showlegend: true,
            legend: { font: { size: 9, color: '#6B6863' }, bgcolor: 'rgba(0,0,0,0)', bordercolor: 'rgba(0,0,0,0)' },
          }}
          config={{ ...plotConfig, staticPlot: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <p className="image-caption">
        Fig 1 - Cumulative variance. {d.k_threshold} components reach {d.threshold * 100}%.
      </p>
    </div>
  );
}

// ── PC modes grid (base64 PNGs) ──────────────────────────────────────────────
function PCModesGrid() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch(dataUrl('pcmodes.json')).then(r => r.json()).then(setD); }, []);
  if (!d) return <div className="plot-loading">loading…</div>;
  return (
    <div className="mnist-img-section">
      <div className="mnist-pc-grid">
        {d.images.map((src, i) => (
          <div key={i} className="mnist-pc-cell">
            <img src={src} alt={`PC ${i + 1}`} className="mnist-px-img" />
            <span className="mnist-pc-label">PC {i + 1}</span>
          </div>
        ))}
      </div>
      <p className="image-caption">
        Fig 2 - First 16 principal components.
      </p>
    </div>
  );
}

// ── Reconstruction grid ──────────────────────────────────────────────────────
function ReconGrid() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch(dataUrl('reconstructions.json')).then(r => r.json()).then(setD); }, []);
  if (!d) return <div className="plot-loading">loading…</div>;
  return (
    <div className="mnist-img-section">
      {d.rows.map(row => (
        <div key={row.k} className="mnist-recon-row">
          <span className="mnist-recon-label">k={row.k}<br /><span className="mnist-recon-energy">{row.energy.toFixed(1)}%</span></span>
          <div className="mnist-recon-imgs">
            {row.images.map((src, i) => (
              <img key={i} src={src} alt={`digit ${i} k=${row.k}`} className="mnist-px-img" />
            ))}
          </div>
        </div>
      ))}
      <p className="image-caption">
        Fig 3 - PCA reconstruction at various k values.
      </p>
    </div>
  );
}

// ── Single confusion matrix heatmap ─────────────────────────────────────────
function ConfusionHeatmap({ classifier, Plot }) {
  const ref = useScrollPassthrough();
  const { name, matrix, accuracy } = classifier;
  const labels = ['0','1','2','3','4','5','6','7','8','9'];
  const maxVal = Math.max(...matrix.flat());

  const annotations = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      annotations.push({
        x: labels[j], y: labels[i],
        text: String(matrix[i][j]),
        showarrow: false,
        font: {
          size: 7, family: monoFont,
          color: matrix[i][j] > maxVal * 0.4 ? '#f6f4f0' : '#181715',
        },
      });
    }
  }

  const data = [{
    type: 'heatmap',
    z: matrix,
    x: labels, y: labels,
    colorscale: [[0,'#f6f4f0'],[0.4,'#DEDAD2'],[0.7,'#6B6863'],[1,'#181715']],
    showscale: false,
    hovertemplate: 'true: %{y}  pred: %{x}<br>count: %{z}<extra></extra>',
  }];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: monoFont, size: 9, color: '#6B6863' },
    margin: { l: 35, r: 10, t: 28, b: 35 },
    xaxis: { title: { text: 'predicted', font: { size: 8 } }, tickfont: { size: 7 }, gridcolor: 'rgba(0,0,0,0)', linecolor: '#C4C0B8' },
    yaxis: { title: { text: 'true', font: { size: 8 } }, tickfont: { size: 7 }, autorange: 'reversed', gridcolor: 'rgba(0,0,0,0)', linecolor: '#C4C0B8' },
    annotations,
    title: { text: `${name} · ${(accuracy * 100).toFixed(2)}%`, font: { size: 8.5, color: '#6B6863', family: monoFont }, y: 0.98 },
  };

  return (
    <div className="confusion-panel">
      <div className="confusion-sizer" ref={ref}>
        <Plot data={data} layout={layout} config={{ ...plotConfig, staticPlot: true }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
    </div>
  );
}

// ── 2×2 confusion matrix grid ────────────────────────────────────────────────
function ConfusionGrid() {
  const [Plot, setPlot] = useState(null);
  const [d, setD] = useState(null);

  useEffect(() => {
    Promise.all([loadPlotly(), fetch(dataUrl('confusion.json')).then(r => r.json())])
      .then(([Plt, json]) => { setPlot(() => Plt); setD(json); });
  }, []);

  if (!d || !Plot) return <div className="plot-loading">loading plots…</div>;

  return (
    <div className="submarine-plot-wrap">
      <div className="confusion-grid">
        {d.classifiers.map(clf => (
          <ConfusionHeatmap key={clf.name} classifier={clf} Plot={Plot} />
        ))}
      </div>
      <p className="image-caption">
        Fig 4 - Confusion matrices. Diagonal = correct predictions.
      </p>
    </div>
  );
}

// ── Metrics table ────────────────────────────────────────────────────────────
function MetricsTable() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch(dataUrl('confusion.json')).then(r => r.json()).then(setD); }, []);
  if (!d) return null;
  const { metrics } = d;
  return (
    <div className="mnist-metrics-wrap">
      <table className="mnist-metrics-table">
        <thead>
          <tr>
            <th></th>
            {metrics.headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {metrics.rows.map(row => (
            <tr key={row.label}>
              <td className="mnist-metrics-label">{row.label}</td>
              {row.values.map((v, i) => (
                <td key={i} className={v === Math.max(...row.values) ? 'mnist-metrics-best' : ''}>
                  {v.toFixed(4)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MNISTClassification() {
  return (
    <div className="inner-page ai-projects-page">
      <div className="detail-header">
        <span className="page-label">software / ai · 003</span>
        <h1 className="detail-title">Number Classification — MNIST Dataset</h1>
        <div className="detail-meta">
          <span className="dim">2024</span>
          <span className="dim">·</span>
          <span className="dim">MNIST</span>
          <span className="dim">·</span>
          <span className="dim">classifiers</span>
        </div>
      </div>
      <hr className="rule" />

      <div className="ai-projects-text">
        <h3>Abstract</h3>
        <p>
          The MNIST dataset is a collection of handwritten digits commonly used for training and testing machine learning algorithms. This project applies PCA for dimensionality reduction and compares four classifiers - Ridge, KNN, LDA, and SVM - to classify digits 0-9. It's the "Hello World" of machine learning.
        </p>

        <h3>Background</h3>
        <p>
          60,000 training images and 10,000 test images, each 28x28 pixels in grayscale - 784 features per sample. PCA reduces this to 59 components while retaining 85% of the variance.
        </p>

        <h3>Try It</h3>
        <div className="math-text">Draw any digit below - the model predicts in real time using the MLP trained above (97.4% test accuracy).</div>
        <DrawPredict />

        <h3>Mathematical Theory</h3>
        <div className="math-text">
          K-Fold Cross Validation partitions the dataset into k equally sized folds, training on k−1 and testing on the remaining:
        </div>
        <BlockMath math={String.raw`E_{cv} = \frac{1}{k}\sum_{i=1}^k\left(\frac{1}{|X_i|}\sum_{x\in X_i}L(f(x),y)\right)`} />
        <div className="math-text">
          <strong>Ridge</strong> - L2 regularization prevents overfitting. Best alpha found: 0.001:
        </div>
        <BlockMath math={String.raw`\min_{w,b}\sum_{i=1}^n(y_i - (w^Tx_i+b))^2 + \alpha\sum_{j=1}^p w_j^2`} />
        <div className="math-text">
          <strong>KNN</strong> - classifies by the majority class among the k nearest training points. Best k=3:
        </div>
        <BlockMath math={String.raw`d(x,x_i)=\sqrt{\sum_{j=1}^p(x_j-x_{ij})^2}\qquad y = \text{mode}\{y\in E_k(x)\}`} />
        <div className="math-text">
          <strong>LDA</strong> - linear decision boundary via Bayes' rule with class-specific means and shared covariance:
        </div>
        <BlockMath math={String.raw`w = \Sigma^{-1}(\mu_1 - \mu_2) \qquad P(y=k|x) = \frac{P(x|y=k)P(y=k)}{P(x)}`} />
        <div className="math-text">
          <strong>SVM</strong> - maximizes the margin between classes, with an RBF kernel for non-linear boundaries:
        </div>
        <BlockMath math={String.raw`\min_{w,b} \frac{1}{2} \|w\|^2 \quad \text{s.t.} \quad y_i (w^T x_i + b) \geq 1`} />
        <BlockMath math={String.raw`K(x_i, x_j) = \exp(-\gamma \|x_i - x_j\|^2)`} />

        <h3>Results</h3>

        <EnergyPlot />

        <PCModesGrid />

        <ReconGrid />

        <ConfusionGrid />

        <MetricsTable />

        <h3>Summary</h3>
        <p>
          PCA reduced MNIST from 784 to 59 dimensions (a 92.5% reduction). SVM achieved the highest accuracy at 98.41%. KNN (97.52%) outperformed both Ridge (85.61%) and LDA (87.53%), confirming non-linear classifiers better fit this data.
        </p>
      </div>

      <Footer />
    </div>
  );
}
