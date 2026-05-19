import { useState, useEffect, useRef, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Footer from '../components/Footer';
import './AIProjects.css';

let PlotlyComponent = null;
const dataUrl = (name) => `${process.env.PUBLIC_URL}/data/robot/${name}`;

const COLORS = {
  walking: '#7a3a10',
  jumping: '#3a3835',
  running: '#181715',
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

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

const baseLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: "'IBM Plex Mono', monospace", size: 10, color: '#6B6863' },
  margin: { l: 0, r: 0, t: 0, b: 0 },
  scene: {
    bgcolor: 'rgba(0,0,0,0)',
    xaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'PC1', font: { size: 10 } } },
    yaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'PC2', font: { size: 10 } } },
    zaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'PC3', font: { size: 10 } } },
    aspectmode: 'cube',
    camera: { eye: { x: 1.8, y: 1.8, z: 1.8 } },
  },
  showlegend: true,
  legend: {
    font: { family: "'IBM Plex Mono', monospace", size: 9, color: '#6B6863' },
    bgcolor: 'rgba(0,0,0,0)',
    bordercolor: 'rgba(0,0,0,0)',
  },
};

const plotConfig = {
  displayModeBar: 'hover',
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  displaylogo: false,
  responsive: true,
  scrollZoom: false,
};

// Build bone line segments from joint positions using skeleton connectivity
function buildBones(frame, I, J) {
  const x = [], y = [], z = [];
  for (let k = 0; k < I.length; k++) {
    x.push(frame.x[I[k]], frame.x[J[k]], null);
    y.push(frame.y[I[k]], frame.y[J[k]], null);
    z.push(frame.z[I[k]], frame.z[J[k]], null);
  }
  return { x, y, z };
}

// ── Single skeleton animation (one action) ───────────────────────────────────
function SkeletonPanel({ action, Plot, skelData }) {
  const [frame, setFrame] = useState(0);
  const sizerRef = useScrollPassthrough();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!skelData) return;
    const total = skelData.actions[action].length;
    const id = setInterval(() => setFrame(f => (f + 1) % total), 60);
    return () => clearInterval(id);
  }, [skelData, action]);

  if (!skelData || !Plot) return <div className="skeleton-panel-loading">…</div>;

  const frames = skelData.actions[action];
  const cur = frames[frame];
  const { I, J } = skelData;
  const zOffset = action === 'jumping'
    ? 0.5 * Math.sin(Math.PI * frame / (frames.length - 1))
    : 0;
  const shiftedCur = { ...cur, z: cur.z.map(v => v + zOffset) };
  const bones = buildBones(shiftedCur, I, J);
  const color = COLORS[action];

  const noAxis = { showticklabels: false, title: { text: '' }, gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8' };

  const traces = [
    {
      type: 'scatter3d', mode: 'lines',
      x: bones.x, y: bones.y, z: bones.z,
      line: { color, width: 3 },
      hoverinfo: 'none', showlegend: false,
    },
    {
      type: 'scatter3d', mode: 'markers',
      x: shiftedCur.x, y: shiftedCur.y, z: shiftedCur.z,
      marker: { size: 3, color, opacity: 0.9 },
      hoverinfo: 'none', showlegend: false,
    },
  ];

  const layout = {
    ...baseLayout,
    scene: {
      ...baseLayout.scene,
      xaxis: { ...noAxis, range: [-1.5, 1.5] },
      yaxis: { ...noAxis, range: [-1.5, 1.5] },
      zaxis: { ...noAxis, range: [-1.5, 1.5] },
      camera: { eye: { x: -1.5, y: 1.5, z: 0.8 } },
    },
    showlegend: false,
  };

  return (
    <div className="skeleton-panel">
      <div className="skeleton-panel-sizer" ref={sizerRef}>
        <Plot
          data={traces}
          layout={layout}
          config={{ ...plotConfig, displayModeBar: false, staticPlot: isMobile }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <p className="image-caption" style={{ color: '#2a2825' }}>{action}</p>
    </div>
  );
}

// ── Row of all three skeletons ────────────────────────────────────────────────
function SkeletonPlot() {
  const [Plot, setPlot] = useState(null);
  const [skelData, setSkelData] = useState(null);

  useEffect(() => {
    Promise.all([
      loadPlotly(),
      fetch(dataUrl('skeleton.json')).then(r => r.json()),
    ]).then(([Plt, json]) => { setPlot(() => Plt); setSkelData(json); });
  }, []);

  return (
    <div className="submarine-plot-wrap">
      <div className="skeleton-row">
        {['walking', 'jumping', 'running'].map(a => (
          <SkeletonPanel key={a} action={a} Plot={Plot} skelData={skelData} />
        ))}
      </div>
      <p className="image-caption">Fig 1 — Skeleton render from sensor data.</p>
    </div>
  );
}

// ── Cumulative energy line chart ─────────────────────────────────────────────
function EnergyPlot() {
  const [Plot, setPlot] = useState(null);
  const [d, setD] = useState(null);
  const sizerRef = useScrollPassthrough();

  useEffect(() => {
    Promise.all([loadPlotly(), fetch(dataUrl('energy.json')).then(r => r.json())])
      .then(([Plt, json]) => { setPlot(() => Plt); setD(json); });
  }, []);

  if (!d || !Plot) return <div className="plot-loading">loading plot…</div>;

  const threshIdx = d.energy.findIndex(v => v >= 0.95);
  const traces = [
    {
      type: 'scatter',
      mode: 'lines',
      x: d.k,
      y: d.energy.map(v => v * 100),
      line: { color: '#B8581A', width: 2 },
      name: 'cumulative energy',
      hovertemplate: 'k=%{x}  energy=%{y:.1f}%<extra></extra>',
    },
    {
      type: 'scatter',
      mode: 'markers',
      x: [threshIdx + 1],
      y: [d.energy[threshIdx] * 100],
      marker: { color: '#181715', size: 7 },
      name: '95% threshold',
      hovertemplate: 'k=%{x}  95% threshold<extra></extra>',
    },
    {
      type: 'scatter',
      mode: 'lines',
      x: [1, d.k.length],
      y: [95, 95],
      line: { color: '#C4C0B8', width: 1, dash: 'dot' },
      name: '95%',
      hoverinfo: 'none',
    },
  ];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: "'IBM Plex Mono', monospace", size: 10, color: '#6B6863' },
    margin: { l: 40, r: 20, t: 10, b: 40 },
    xaxis: {
      title: { text: 'PC modes (k)', font: { size: 10 } },
      gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8',
    },
    yaxis: {
      title: { text: 'cumulative energy (%)', font: { size: 10 } },
      gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8',
      range: [0, 101],
    },
    showlegend: true,
    legend: { font: { size: 9, color: '#6B6863' }, bgcolor: 'rgba(0,0,0,0)', bordercolor: 'rgba(0,0,0,0)' },
  };

  return (
    <div className="submarine-plot-wrap">
      <div className="robot-plot-sizer" ref={sizerRef}>
        <Plot
          data={traces}
          layout={layout}
          config={{ ...plotConfig, staticPlot: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <p className="image-caption">Fig 2 — Cumulative energy vs. PC modes.</p>
    </div>
  );
}

// ── 3D PCA scatter ───────────────────────────────────────────────────────────
function PCAScatterPlot({ dataFile, caption, showCentroids = false }) {
  const [Plot, setPlot] = useState(null);
  const [d, setD] = useState(null);
  const sizerRef = useScrollPassthrough();
  const isMobile = useIsMobile();

  useEffect(() => {
    Promise.all([loadPlotly(), fetch(dataFile).then(r => r.json())])
      .then(([Plt, json]) => { setPlot(() => Plt); setD(json); });
  }, [dataFile]);

  if (!d || !Plot) return <div className="plot-loading">loading plot…</div>;

  const actions = d.actions ?? d.scatter;
  const traces = actions.map(a => ({
    type: 'scatter3d',
    mode: 'markers',
    name: a.label,
    x: a.pc1, y: a.pc2, z: a.pc3,
    marker: { size: 2.5, color: COLORS[a.label], opacity: 0.55 },
    hovertemplate: `${a.label}<extra></extra>`,
  }));

  if (showCentroids && d.centroids) {
    d.centroids.forEach(c => {
      traces.push({
        type: 'scatter3d',
        mode: 'markers',
        name: `${c.label} centroid`,
        x: [c.coords[0]], y: [c.coords[1]], z: [c.coords[2]],
        marker: { size: 8, color: COLORS[c.label], symbol: 'cross', opacity: 1 },
        hovertemplate: `${c.label} centroid<extra></extra>`,
      });
    });
  }

  return (
    <div className="submarine-plot-wrap">
      <div className="submarine-plot-sizer" ref={sizerRef}>
        <Plot
          data={traces}
          layout={baseLayout}
          config={{ ...plotConfig, staticPlot: isMobile }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <p className="image-caption">{caption}</p>
    </div>
  );
}

export default function HumanoidRobotPCA() {
  return (
    <div className="inner-page ai-projects-page">
      <div className="detail-header">
        <span className="page-label">software / ai · 002</span>
        <h1 className="detail-title">Humanoid Robot — PCA & Custom Classifier</h1>
        <div className="detail-meta">
          <span className="dim">2024</span>
          <span className="dim">·</span>
          <span className="dim">PCA</span>
          <span className="dim">·</span>
          <span className="dim">classification</span>
        </div>
      </div>
      <hr className="rule" />

      <div className="ai-projects-text">
        <h3>Abstract</h3>
        <p>
          Humanoid robots have built-in sensors that capture joint motion. This data can reveal key movement patterns, but it's high-dimensional. This project derives Principal Component Analysis (PCA) to reduce the data, then classifies the robot's movement using a Nearest Centroid approach.
        </p>

        <h3>Background</h3>
        <p>
          Robot joint movements are captured as Euler angles through 38 sensors. There are 5 recorded samples of 3 unique movements: walking, running, and jumping. Each movement was sampled for 1.4 seconds.
        </p>
        <SkeletonPlot />

        <h3>Motivation</h3>
        <p>
          <strong>Classifiers</strong> are useful when you want to assign data into categories. Examples: email (spam or not spam), image (cat, dog, airplane, etc.), medical scan (normal or abnormal), manufacturing part (pass or fail).
        </p>
        <p>
          <strong>Data reduction</strong> is useful when you have a lot of data, too many variables, or redundant information, and you want to simplify it while keeping the important structure. This lets you classify faster (because there is less data to go through), saving time and energy.
        </p>

        <h3>Mathematical Theory</h3>
        <div className="math-text">
          Think of PCA like painting a tree: many people paint it differently, but they all capture the same essential shapes. PCA finds those essential shapes in the data. The flattened data matrix <InlineMath math="X" />:
        </div>
        <BlockMath math={String.raw`X = \begin{bmatrix}x_{11} & x_{12} & \cdots & x_{1,1500} \\x_{21} & x_{22} & \cdots & x_{2,1500} \\\vdots & \vdots & \ddots & \vdots \\x_{114,1} & x_{114,2} & \cdots & x_{114,1500}\end{bmatrix}`} />
        <div className="math-text">
          114 rows because 38 sensors × 3 angles each. 1500 columns, one per time step. Decomposed via SVD:
        </div>
        <BlockMath math={String.raw`X = U \Sigma V^T`} />
        <div className="math-text">
          <InlineMath math="U" /> : left singular vectors &nbsp;·&nbsp;
          <InlineMath math="\Sigma" /> : diagonal singular values &nbsp;·&nbsp;
          <InlineMath math="V^T" /> : right singular vectors
        </div>
        <div className="math-text">Cumulative energy determines how many principal components to retain:</div>
        <BlockMath math={String.raw`\text{Cumulative Energy} = \frac{\sum_{i=1}^{k} \sigma_i^2}{\sum_{i=1}^{n} \sigma_i^2}`} />

        <EnergyPlot />

        <div className="math-text">
          At a 95% threshold, only 7 of 114 dimensions are needed. Project the data onto those components:
        </div>
        <BlockMath math={String.raw`X_{\text{reduced}} = U_k^T X`} />
        <div className="math-text">
          To classify, a centroid <InlineMath math="\mu_i" /> is computed for each class <InlineMath math="i" />:
        </div>
        <BlockMath math={String.raw`\mu_i = \frac{1}{N_i} \sum_{j=1}^{N_i} x_j`} />
        <div className="math-text">A new point is assigned to the nearest centroid by Euclidean distance:</div>
        <BlockMath math={String.raw`d_i = \| x_{\text{new}} - \mu_i \|`} />
        <div className="math-text">Centroid classifier accuracy:</div>
        <BlockMath math={String.raw`\text{Accuracy} \approx 95\% = \frac{108}{114}`} />
        <div className="math-text">
          I also implemented a Nearest Neighbor Classifier: compare each test point to every training sample, assign the class of the closest one:
        </div>
        <BlockMath math={String.raw`\text{Accuracy} = \frac{114}{114} = 100\%`} />

        <h3>Results</h3>
        <div className="math-text">
          Projecting all 1500 training samples onto the first 3 principal components shows clean separation between movement classes:
        </div>

        <PCAScatterPlot
          dataFile={dataUrl('pca3d.json')}
          caption="Fig 3 — PCA projection. Walking (orange), jumping (grey), running (black)."
        />

        <div className="math-text">
          Adding the class centroids (crosses) shows how the nearest-centroid classifier partitions the space:
        </div>

        <PCAScatterPlot
          dataFile={dataUrl('centroids.json')}
          caption="Fig 4 — PCA projection with class centroids. 95% centroid accuracy, 100% nearest-neighbor."
          showCentroids
        />

        <h3>Summary</h3>
        <div className="math-text">
          PCA reduced the humanoid robot data from 114 dimensions to just 3 (a 97% reduction) while retaining 100% classification accuracy using the custom nearest-neighbor classifier.
        </div>
      </div>

      <Footer />
    </div>
  );
}
