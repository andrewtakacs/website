import { useState, useEffect, useRef, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Footer from '../components/Footer';
import './AIProjects.css';

// Lazy-import the minimal Plotly bundle (scatter3d only, ~500KB vs 3MB full)
let PlotlyComponent = null;

const dataUrl = (name) => `${process.env.PUBLIC_URL}/data/submarine/${name}`;

// Shared transparent layout base
const baseLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: "'IBM Plex Mono', monospace", size: 10, color: '#6B6863' },
  margin: { l: 0, r: 0, t: 0, b: 0 },
  scene: {
    bgcolor: 'rgba(0,0,0,0)',
    xaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'x', font: { size: 10 } } },
    yaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'y', font: { size: 10 } } },
    zaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'z', font: { size: 10 } } },
    aspectmode: 'cube',
    camera: { eye: { x: 1.8, y: 1.8, z: 1.8 } },
  },
  showlegend: false,
};

// Forwards wheel events from a plot container to the page so scrolling still works.
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

const plotConfig = {
  displayModeBar: 'hover',
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  displaylogo: false,
  responsive: true,
  scrollZoom: false,
};

function SubPlot({ dataFile, buildTrace, layout, caption }) {
  const [data, setData] = useState(null);
  const [Plot, setPlot] = useState(null);
  const [error, setError] = useState(false);
  const sizerRef = useScrollPassthrough();

  useEffect(() => {
    // Load Plotly and data in parallel
    Promise.all([
      PlotlyComponent
        ? Promise.resolve(PlotlyComponent)
        : import('react-plotly.js').then(m => { PlotlyComponent = m.default; return m.default; }),
      fetch(dataFile).then(r => r.json()),
    ])
      .then(([Plt, json]) => {
        setPlot(() => Plt);
        setData(json);
      })
      .catch(() => setError(true));
  }, [dataFile]);

  if (error) return <div className="plot-error">Failed to load plot data.</div>;
  if (!data || !Plot) return <div className="plot-loading">loading plot…</div>;

  return (
    <div className="submarine-plot-wrap">
      <div className="submarine-plot-sizer" ref={sizerRef}>
        <Plot
          data={[buildTrace(data)]}
          layout={layout}
          config={plotConfig}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <p className="image-caption">{caption}</p>
    </div>
  );
}

function SubPathPlot({ dataFile }) {
  const [Plot, setPlot] = useState(null);
  const [pathData, setPathData] = useState(null);
  const [frame, setFrame] = useState(0);
  const sizerRef = useScrollPassthrough();

  useEffect(() => {
    Promise.all([
      PlotlyComponent
        ? Promise.resolve(PlotlyComponent)
        : import('react-plotly.js').then(m => { PlotlyComponent = m.default; return m.default; }),
      fetch(dataFile).then(r => r.json()),
    ]).then(([Plt, json]) => {
      setPlot(() => Plt);
      setPathData(json);
    });
  }, [dataFile]);

  useEffect(() => {
    if (!pathData) return;
    const total = pathData.x.length;
    const id = setInterval(() => {
      setFrame(f => (f + 1) % total);
    }, 220);
    return () => clearInterval(id);
  }, [pathData]);

  if (!pathData || !Plot) return <div className="plot-loading">loading plot…</div>;

  const n = frame + 1;
  const trail = {
    type: 'scatter3d',
    mode: 'lines',
    x: pathData.x.slice(0, n),
    y: pathData.y.slice(0, n),
    z: pathData.z.slice(0, n),
    line: { color: '#B8581A', width: 3 },
    hoverinfo: 'none',
  };
  const head = {
    type: 'scatter3d',
    mode: 'markers',
    x: [pathData.x[frame]],
    y: [pathData.y[frame]],
    z: [pathData.z[frame]],
    marker: { size: 7, color: '#181715', symbol: 'circle' },
    hovertemplate: `t = ${pathData.t[frame].toFixed(1)} hr<extra></extra>`,
  };

  return (
    <div className="submarine-plot-wrap">
      <div className="submarine-plot-sizer" ref={sizerRef}>
        <Plot
          data={[trail, head]}
          layout={{
            ...baseLayout,
            title: { text: 'Submarine Traveling', font: { color: '#C4C0B8', size: 14 } },
            scene: {
              ...baseLayout.scene,
              xaxis: { ...baseLayout.scene.xaxis, range: [-10, 10] },
              yaxis: { ...baseLayout.scene.yaxis, range: [-10, 10] },
              zaxis: { ...baseLayout.scene.zaxis, range: [-10, 10] },
            },
          }}
          config={{ ...plotConfig, staticPlot: false }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <div className="plot-anim-controls">
        <span className="plot-anim-time">t = {pathData.t[frame].toFixed(1)} hr</span>
      </div>
      <p className="image-caption">Fig 3 — Reconstructed Submarine Path  (24 hours)</p>
    </div>
  );
}

export default function SubmarineFourier() {
  return (
    <div className="inner-page ai-projects-page">
      <div className="detail-header">
        <span className="page-label">software / ai · 001</span>
        <h1 className="detail-title">Submarine Tracking — Fourier Transform</h1>
        <div className="detail-meta">
          <span className="dim">2024</span>
          <span className="dim">·</span>
          <span className="dim">fourier</span>
          <span className="dim">·</span>
          <span className="dim">signal-processing</span>
        </div>
      </div>
      <hr className="rule" />

      <div className="ai-projects-text">
        <h3>Abstract</h3>
        <p>
          This project begins with submarine pressure data, which is challenging to interpret. The process starts with deriving the Fourier series and Discrete Fourier Transform from a basis function. Using the Fourier transform, the submarine data is analyzed by averaging the transforms for each frame and applying a Gaussian filter to clarify the submarine's presence amidst the noisy data. This method uncovers the submarine's primary frequency and reveals its path, which was previously obscured.
        </p>

        <h3>Background</h3>
        <p>
          The submarine data was captured every 30 minutes for 24 hours. The data captured is a broad spectrum recording of the acoustic pressure data sampled on a uniform grid with a size of 64 × 64 × 64, giving four dimensions: time, x, y, and z — 12.8 million data points total. Plotted raw, it's a chaotic mess. Try to find the submarine below.
        </p>

        {/* Plot 1 — raw chaotic data */}
        <SubPlot
          dataFile={dataUrl('raw.json')}
          buildTrace={(d) => ({
            type: 'scatter3d',
            mode: 'markers',
            x: d.x, y: d.y, z: d.z,
            marker: {
              size: 2.5,
              color: d.v,
              colorscale: [
                [0, '#C4C0B8'],
                [0.5, '#B8581A'],
                [1, '#181715'],
              ],
              opacity: 0.65,
              showscale: false,
            },
          })}
          layout={{
            ...baseLayout,
            scene: {
              ...baseLayout.scene,
              xaxis: { ...baseLayout.scene.xaxis, title: { text: 'x', font: { size: 10 } }, range: [-10, 10] },
              yaxis: { ...baseLayout.scene.yaxis, range: [-10, 10] },
              zaxis: { ...baseLayout.scene.zaxis, range: [-10, 10] },
            },
          }}
          caption="Fig 1 — Raw Acoustic Pressure"
        />

        <h3>Mathematical Theory</h3>
        <div className="math-text">
          Functions can be represented as a linear combination of basis, or fundamental, functions. The most famous example is the Fourier Series, which expresses a function as a sum of sine and cosine waves:
        </div>
        <BlockMath math={String.raw`f(x)=\sum_{k=0}^{n}c_k\psi_k(x)`} />
        <div className="math-text">
          <InlineMath math="c_k" /> is the k-th coefficient (weight) &nbsp;·&nbsp;
          <InlineMath math="\psi_k(x)" /> is the k-th basis function
        </div>
        <BlockMath math={String.raw`f(x)=\sum_{k=0}^{n}c_k\psi_k(x)\longrightarrow f(x)=\sum_{k=0}^{n}\left(c_k\sin{(2\pi xk+P)}\right)`} />
        <div className="math-text">
          Setting the basis to a sine wave with phase <InlineMath math="P" /> and expanding with the angle sum identity:
        </div>
        <BlockMath math={String.raw`\sin{(A+B)}=\sin{(A)}\cos{(B)}+\cos{(A)}\sin{(B)}`} />
        <BlockMath math={String.raw`\sum_{k=0}^{n}\left(c_k\sin{(2\pi xk)}\cos{(P)}+c_k\cos{(2\pi xk)\sin{(P)}}\right)`} />
        <div className="math-text">
          Simplifying with <InlineMath math="a_k=c_k\cos{(P)}" /> and <InlineMath math="b_k=c_k\sin{(P)}" />:
        </div>
        <BlockMath math={String.raw`\sum_{k=0}^{n}{\left(a_k\sin{(xk)}+b_k\cos{(xk)}\right)}`} />
        <div className="math-text">The coefficients are found by orthogonality:</div>
        <BlockMath math={String.raw`a_k=\frac{1}{\pi}\int_{0}^{2\pi}{f(x)\sin{(2\pi xk)}dx} \qquad b_k=\frac{1}{\pi}\int_{0}^{2\pi}{f(x)\cos{(2\pi xk)}dx}`} />
        <div className="math-text">The complete Fourier Series:</div>
        <BlockMath math={String.raw`f(x)=\frac{a_0}{2}+\sum_{k=1}^{\infty}{(\left(a_k\sin{(xk)}+b_k\cos{(xk)}\right)}`} />
        <div className="math-text">Converting via Euler's formula, <strong>the Fourier Series in complex exponential form:</strong></div>
        <BlockMath math={String.raw`f(x)=\sum_{k=-\infty}^{\infty} c_k e^{i k x} \qquad c_k = \frac{1}{2\pi} \int_{0}^{2\pi} f(x) e^{-i k x} \, dx`} />
        <div className="math-text">
          The submarine data is not periodic, so we use the Discrete Fourier Transform (Nyquist-Shannon):
        </div>
        <BlockMath math={String.raw`F(k)=\sum_{n=0}^{N-1}{f(n)e^{-2\pi ikn/N}}`} />
        <div className="math-text">
          Averaging FFT snapshots across all 49 time frames suppresses noise and amplifies persistent signals:
        </div>
        <BlockMath math={String.raw`\frac{1}{N} \sum_{n=0}^{N-1} |X(f_n)|^2`} />
        <div className="math-text">Dominant frequency identification:</div>
        <BlockMath math={String.raw`f_{dom} = \arg\max_f |X(f)|`} />
        <div className="math-text">Gaussian filter applied in frequency space, then inverse FFT to recover spatial position:</div>
        <BlockMath math={String.raw`y(t) = \int_{-\infty}^{\infty} x(\tau) \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(t-\tau)^2}{2\sigma^2}} d\tau`} />

        <h3>Results</h3>
        <p><strong>Submarine Found!</strong></p>

        {/* Plot 2 — frequency domain cluster */}
        <SubPlot
          dataFile={dataUrl('freq.json')}
          buildTrace={(d) => ({
            type: 'scatter3d',
            mode: 'markers',
            x: d.kx, y: d.ky, z: d.kz,
            marker: {
              size: 4,
              color: d.v,
              colorscale: [
                [0, '#C4C0B8'],
                [0.5, '#B8581A'],
                [1, '#181715'],
              ],
              opacity: 0.85,
              showscale: false,
            },
          })}
          layout={{
            ...baseLayout,
            scene: {
              ...baseLayout.scene,
              xaxis: { ...baseLayout.scene.xaxis, title: { text: 'kx', font: { size: 10 } }, range: [-10, 10] },
              yaxis: { ...baseLayout.scene.yaxis, title: { text: 'ky', font: { size: 10 } }, range: [-10, 10] },
              zaxis: { ...baseLayout.scene.zaxis, title: { text: 'kz', font: { size: 10 } }, range: [-10, 10] },
            },
          }}
          caption="Fig 2 — Found the Submarine! "
        />

        {/* Plot 3 — animated submarine path */}
        <SubPathPlot dataFile={dataUrl('path.json')} />
      </div>

      <Footer />
    </div>
  );
}
