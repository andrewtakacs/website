import { useState, useEffect, useRef, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Footer from '../components/Footer';
import './AIProjects.css';
import './RDREDecoder.css';

let PlotlyComponent = null;
function loadPlotly() {
  return PlotlyComponent
    ? Promise.resolve(PlotlyComponent)
    : import('react-plotly.js').then(m => { PlotlyComponent = m.default; return m.default; });
}

function useScrollPassthrough() {
  const ref = useRef(null);
  const handler = useCallback((e) => { window.scrollBy({ top: e.deltaY, behavior: 'auto' }); }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('wheel', handler, { passive: true });
    return () => el.removeEventListener('wheel', handler);
  }, [handler]);
  return ref;
}

const monoFont = "'IBM Plex Mono', monospace";
const plotConfig = {
  displayModeBar: 'hover',
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  displaylogo: false,
  responsive: true,
  scrollZoom: false,
};

// ── Error data from paper (Table, Fig. 10) ────────────────────────────────────
// ε = ||ŷ − y||₂ / ||y||₂ — relative L² reconstruction error
const QR_SENSORS    = [1, 2, 3, 5, 9, 12];
const QR_POD        = [0.6795, 0.7801, 0.6574, 0.3158, 0.4455, 0.3680];
const QR_SHRED      = [0.4952, 0.5068, 0.1149, 0.1652, 0.1194, 0.0784];
const PRIME_SENSORS = [3, 5];
const PRIME_POD     = [1.008,  1.735];
const PRIME_SHRED   = [0.2570, 0.2456];

// ── Interactive error plot ─────────────────────────────────────────────────────
function ErrorPlot() {
  const [Plot, setPlot] = useState(null);
  const ref = useScrollPassthrough();

  useEffect(() => { loadPlotly().then(P => setPlot(() => P)); }, []);

  if (!Plot) return <div className="plot-loading">loading plot…</div>;

  const baseMarker = (symbol = 'circle') => ({ size: 7, symbol });
  const traces = [
    {
      type: 'scatter', mode: 'lines+markers',
      name: 'QR · POD (linear)',
      x: QR_SENSORS, y: QR_POD,
      line: { color: '#C4C0B8', width: 2 },
      marker: baseMarker(),
      hovertemplate: 'ε = %{y:.4f}<extra>QR · POD  n=%{x}</extra>',
    },
    {
      type: 'scatter', mode: 'lines+markers',
      name: 'QR · SHRED',
      x: QR_SENSORS, y: QR_SHRED,
      line: { color: '#B8581A', width: 2 },
      marker: baseMarker(),
      hovertemplate: 'ε = %{y:.4f}<extra>QR · SHRED  n=%{x}</extra>',
    },
    {
      type: 'scatter', mode: 'lines+markers',
      name: 'Prime · POD (linear)',
      x: PRIME_SENSORS, y: PRIME_POD,
      line: { color: '#C4C0B8', width: 2, dash: 'dash' },
      marker: baseMarker('square'),
      hovertemplate: 'ε = %{y:.4f}<extra>Prime · POD  n=%{x}</extra>',
    },
    {
      type: 'scatter', mode: 'lines+markers',
      name: 'Prime · SHRED',
      x: PRIME_SENSORS, y: PRIME_SHRED,
      line: { color: '#B8581A', width: 2, dash: 'dash' },
      marker: baseMarker('square'),
      hovertemplate: 'ε = %{y:.4f}<extra>Prime · SHRED  n=%{x}</extra>',
    },
  ];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor:  'rgba(0,0,0,0)',
    font: { family: monoFont, size: 10, color: '#6B6863' },
    margin: { l: 60, r: 20, t: 15, b: 55 },
    xaxis: {
      title: { text: 'number of sensors (n)', font: { size: 10 } },
      gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8',
      tickvals: QR_SENSORS,
    },
    yaxis: {
      title: { text: 'relative L² error  ε', font: { size: 10 } },
      gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8',
      rangemode: 'tozero',
    },
    showlegend: true,
    legend: {
      font: { size: 9, color: '#6B6863' },
      bgcolor: 'rgba(0,0,0,0)',
      bordercolor: 'rgba(0,0,0,0)',
      x: 0.98, xanchor: 'right', y: 0.98,
    },
  };

  return (
    <div className="submarine-plot-wrap">
      <div className="robot-plot-sizer" style={{ height: 320 }} ref={ref}>
        <Plot data={traces} layout={layout} config={plotConfig}
              style={{ width: '100%', height: '100%' }} useResizeHandler />
      </div>
      <p className="image-caption">
        Fig 1 — Relative L² reconstruction error vs. number of sensors.
        Solid = QR placement, dashed = Prime placement.
        Orange = SHRED, gray = linear POD.
      </p>
    </div>
  );
}

// ── SHRED architecture diagram ─────────────────────────────────────────────────
function ArchDiagram() {
  return (
    <div className="shred-arch">
      <div className="arch-block arch-input">
        <div className="arch-label">sensor input</div>
        <div className="arch-math">
          <InlineMath math="y_{t-l},\ldots,y_t" />
        </div>
        <div className="arch-note">m × (l+1) series</div>
      </div>

      <div className="arch-connector">
        <div className="arch-arrow-line" />
        <div className="arch-arrow-head">›</div>
      </div>

      <div className="arch-block arch-lstm">
        <div className="arch-label">LSTM encoder</div>
        <div className="arch-math">
          <InlineMath math="\tilde{z}_t = G(\mathbf{y};\,W_\text{LSTM})" />
        </div>
        <div className="arch-note">recurrent · nonlinear</div>
      </div>

      <div className="arch-connector">
        <div className="arch-arrow-line" />
        <div className="arch-arrow-head">›</div>
      </div>

      <div className="arch-block arch-decoder">
        <div className="arch-label">shallow decoder</div>
        <div className="arch-math">
          <InlineMath math="\tilde{x}_t = F(\tilde{z}_t;\,W_\text{RD})" />
        </div>
        <div className="arch-note">linear · spatial</div>
      </div>

      <div className="arch-connector">
        <div className="arch-arrow-line" />
        <div className="arch-arrow-head">›</div>
      </div>

      <div className="arch-block arch-output">
        <div className="arch-label">reconstruction</div>
        <div className="arch-math">
          <InlineMath math="\tilde{x}_t \in \mathbb{R}^n" />
        </div>
        <div className="arch-note">full luminosity field</div>
      </div>
    </div>
  );
}

// ── Error table ────────────────────────────────────────────────────────────────
function ErrorTable() {
  const rows = [
    { n: 1,  qrPOD: 0.6795, qrSHRED: 0.4952, prPOD: null,  prSHRED: null  },
    { n: 2,  qrPOD: 0.7801, qrSHRED: 0.5068, prPOD: null,  prSHRED: null  },
    { n: 3,  qrPOD: 0.6574, qrSHRED: 0.1149, prPOD: 1.008, prSHRED: 0.2570},
    { n: 5,  qrPOD: 0.3158, qrSHRED: 0.1652, prPOD: 1.735, prSHRED: 0.2456},
    { n: 9,  qrPOD: 0.4455, qrSHRED: 0.1194, prPOD: null,  prSHRED: null  },
    { n: 12, qrPOD: 0.3680, qrSHRED: 0.0784, prPOD: null,  prSHRED: null  },
  ];
  const fmt = (v) => v != null ? v.toFixed(4) : '—';
  const isBest = (row) => (field) => {
    const vals = [row.qrPOD, row.qrSHRED, row.prPOD, row.prSHRED].filter(x => x != null);
    return row[field] === Math.min(...vals);
  };

  return (
    <div className="mnist-metrics-wrap">
      <table className="mnist-metrics-table">
        <thead>
          <tr>
            <th>sensors</th>
            <th>QR · POD</th>
            <th>QR · SHRED</th>
            <th>Prime · POD</th>
            <th>Prime · SHRED</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const best = isBest(row);
            return (
              <tr key={row.n}>
                <td className="mnist-metrics-label">{row.n}</td>
                <td className={best('qrPOD')   ? 'mnist-metrics-best' : ''}>{fmt(row.qrPOD)}</td>
                <td className={best('qrSHRED') ? 'mnist-metrics-best' : ''}>{fmt(row.qrSHRED)}</td>
                <td className={best('prPOD')   ? 'mnist-metrics-best' : ''}>{fmt(row.prPOD)}</td>
                <td className={best('prSHRED') ? 'mnist-metrics-best' : ''}>{fmt(row.prSHRED)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function RDREDecoder() {
  return (
    <div className="inner-page ai-projects-page">

      <div className="detail-header">
        <span className="page-label">software / research · 001</span>
        <h1 className="detail-title">Rotating Detonation Rocket Engine — Shallow Recurrent Decoder</h1>
        <div className="detail-meta">
          <span className="dim">2025</span>
          <span className="dim">·</span>
          <span className="dim">UW graduate research</span>
          <span className="dim">·</span>
          <span className="dim">LSTM</span>
          <span className="dim">·</span>
          <span className="dim">POD</span>
          <span className="dim">·</span>
          <span className="dim">system identification</span>
        </div>
      </div>

      <hr className="rule" />

      <div className="ai-projects-text">

        <h3>Abstract</h3>
        <p>
          Rotating detonation engines (RDEs) offer significant thermodynamic advantages over conventional
          deflagration-based combustors, but their extreme operating conditions — high temperature, pressure,
          and wave speeds — make full-field diagnostics practically impossible at scale. This work presents
          a data-driven reconstruction framework based on the <strong>Shallow REcurrent Decoder (SHRED)</strong>,
          which combines an LSTM recurrent encoder with a shallow linear decoder to infer the full 2D luminosity
          field of an RDE annulus from a minimal number of sparse pressure sensor measurements.
          Reconstruction performance is benchmarked against linear POD reconstruction and two sensor placement
          strategies: QR-pivot sampling and Prime sampling.
        </p>

        <h3>What is a Rotating Detonation Engine?</h3>
        <p>
          Conventional rocket and jet engines burn propellant through <strong>deflagration</strong> — a subsonic
          combustion wave that propagates by thermal diffusion. Deflagration is well-understood and easy to
          sustain, but it is thermodynamically limited by the Brayton cycle.
        </p>
        <p>
          A <strong>rotating detonation engine (RDE)</strong> instead burns propellant via <strong>detonation</strong>:
          a supersonic combustion wave (Mach 5–10) that couples with a leading shock and self-sustains as it
          propagates azimuthally around a ring-shaped (annular) combustion chamber. Detonation follows the
          Humphrey cycle, which is more thermodynamically efficient — theoretically 25–40% more so than
          deflagration at equivalent conditions. This makes RDEs a compelling candidate for next-generation
          propulsion.
        </p>
        <p>
          The challenge: a detonation wave laps the annulus roughly <strong>21,800 times per second</strong>.
          Temperatures exceed 3,000 K and pressures spike to hundreds of atmospheres. Conventional
          instrumentation — thermocouples, pressure taps, embedded sensors — cannot survive or respond fast
          enough to capture the wave dynamics in detail.
        </p>
        <p>
          At the University of Washington RDE Laboratory, a 1-inch annular RDE is imaged with a high-speed
          camera (HSV) at <strong>240,000 frames per second</strong>, providing a 2D luminosity field of
          the combustion zone with a 3.8 μs exposure time. This gives a ground truth full-field measurement — but
          a full-frame camera is impractical for embedded diagnostics or flight hardware.
          The goal: reconstruct that full field from only a handful of sparse pressure readings.
        </p>

        <h3>The Data</h3>
        <p>
          Each HSV frame is a 2D image of the annulus which is unrolled and flattened into a single
          state vector <InlineMath math="x_t \in \mathbb{R}^n" />, where <InlineMath math="n" /> is
          the number of spatial grid points (pixels). Stacking <InlineMath math="T" /> consecutive
          frames gives the <strong>data matrix</strong>:
        </p>
        <BlockMath math={String.raw`X \in \mathbb{R}^{n \times T}, \quad X = \bigl[x_1 \mid x_2 \mid \cdots \mid x_T\bigr]`} />
        <div className="math-text">
          In practice, only <InlineMath math="m \ll n" /> spatial locations are measurable.
          The <strong>sensor measurement</strong> at time <InlineMath math="t" /> is:
        </div>
        <BlockMath math={String.raw`y_t = C_s\, x_t \in \mathbb{R}^m`} />
        <div className="math-text">
          where <InlineMath math="C_s \in \mathbb{R}^{m \times n}" /> is a sparse binary selection matrix
          that picks the <InlineMath math="m" /> sensor locations from the full state.
          The reconstruction problem is to recover <InlineMath math="x_t" /> from
          the sequence <InlineMath math="\{y_{t-l}, \ldots, y_t\}" />.
        </div>

        <h3>Proper Orthogonal Decomposition</h3>
        <p>
          Before building the network, the high-dimensional data is compressed using
          <strong> Proper Orthogonal Decomposition (POD)</strong> — the fluid mechanics name for
          Principal Component Analysis applied to spatiotemporal data.
          The data matrix is factored via the <strong>Singular Value Decomposition (SVD)</strong>:
        </p>
        <BlockMath math={String.raw`X = U\,\Sigma\,V^\top`} />
        <div className="math-text">
          <InlineMath math="U \in \mathbb{R}^{n \times n}" /> — orthogonal spatial modes
          (columns are the POD modes, ordered by variance captured)
        </div>
        <div className="math-text">
          <InlineMath math="\Sigma \in \mathbb{R}^{n \times T}" /> — diagonal matrix of singular
          values <InlineMath math="\sigma_1 \geq \sigma_2 \geq \cdots \geq 0" />
        </div>
        <div className="math-text">
          <InlineMath math="V^\top \in \mathbb{R}^{T \times T}" /> — temporal coefficients
        </div>
        <p>
          Truncating to the first <InlineMath math="r" /> modes gives a rank-<InlineMath math="r" /> approximation:
        </p>
        <BlockMath math={String.raw`X \approx U_r\,\Sigma_r\,V_r^\top`} />
        <div className="math-text">
          The singular values <InlineMath math="\sigma_i" /> decay rapidly — a small number of modes
          captures most of the variance. The latent state dimension is set to <InlineMath math="r \approx m" />
          (number of available sensors), giving a compact representation the decoder can target.
        </div>
        <p>
          A <strong>linear POD reconstruction</strong> works by projecting the sensor measurements
          onto the POD modes via QR factorization, then lifting back to the full space.
          This baseline is fast but purely linear — it struggles when the sensor count is small
          and cannot capture nonlinear wave dynamics.
        </p>

        <h3>SHRED — Shallow Recurrent Decoder Network</h3>
        <p>
          SHRED addresses the nonlinearity by learning the map from sparse sensor history to
          full-field reconstruction. The architecture has two components trained end-to-end:
        </p>

        <ArchDiagram />

        <h4>Recurrent Encoder — LSTM</h4>
        <p>
          A Long Short-Term Memory (LSTM) network processes a sliding window of
          <InlineMath math=" l+1 " /> consecutive sensor snapshots and produces a latent
          state <InlineMath math="\tilde{z}_t \in \mathbb{R}^r" />:
        </p>
        <BlockMath math={String.raw`\tilde{z}_t = G\!\left(\bigl[y_{t-l},\, y_{t-l+1},\, \ldots,\, y_t\bigr];\; W_\text{LSTM}\right)`} />
        <div className="math-text">
          The LSTM's gating mechanism — forget, input, and output gates — lets it selectively
          retain information across the time window, capturing the periodic nature of the detonation
          wave without forgetting earlier context.
        </div>
        <BlockMath math={String.raw`\begin{aligned}
f_t &= \sigma(W_f [h_{t-1}, y_t] + b_f) \\
i_t &= \sigma(W_i [h_{t-1}, y_t] + b_i) \\
\tilde{c}_t &= \tanh(W_c [h_{t-1}, y_t] + b_c) \\
c_t &= f_t \odot c_{t-1} + i_t \odot \tilde{c}_t \\
h_t &= \sigma(W_o [h_{t-1}, y_t] + b_o) \odot \tanh(c_t)
\end{aligned}`} />
        <div className="math-text">
          The hidden state <InlineMath math="h_t" /> at the final step of the window is the
          latent representation <InlineMath math="\tilde{z}_t" />.
        </div>

        <h4>Shallow Decoder</h4>
        <p>
          A single linear (or lightly nonlinear) layer maps the latent state to the
          full reconstructed field in POD coordinates, which is then lifted to the full space:
        </p>
        <BlockMath math={String.raw`\tilde{x}_t = F(\tilde{z}_t;\; W_\text{RD}) \approx U_r\,\hat{a}_t`} />
        <div className="math-text">
          The decoder is deliberately kept shallow — all temporal complexity lives in the LSTM.
          The decoder only needs to learn a linear lifting from latent to spatial.
          This factored design keeps the parameter count low and the model interpretable.
        </div>

        <h4>Training</h4>
        <p>
          The full network is trained in two steps: (1) compute POD modes from the ground-truth
          data matrix, then (2) train SHRED by minimizing the mean-squared reconstruction error
          on the training split. The sensor history length <InlineMath math="l=1" /> (one previous
          step included) proved sufficient for this dataset.
          The reconstruction operator is:
        </p>
        <BlockMath math={String.raw`\mathcal{N}\!\left(\{y_{t-l:t}\}_{1}^{l+1};\, W_\text{LSTM}, W_\text{RD}\right) \approx x_t`} />

        <h3>Sensor Placement</h3>
        <p>
          Where the sensors are placed matters enormously when only a few are available.
          Two strategies are compared:
        </p>

        <h4>QR Pivot Sampling</h4>
        <p>
          The QR decomposition with column pivoting is applied to the transpose of the
          truncated POD mode matrix <InlineMath math="U_r^\top" />:
        </p>
        <BlockMath math={String.raw`U_r^\top P = QR`} />
        <div className="math-text">
          The permutation matrix <InlineMath math="P" /> reorders columns (spatial locations)
          so that the most informative ones appear first. Selecting the first
          <InlineMath math=" m " /> pivot locations ensures the chosen sensors maximize
          the orthogonality of the selected POD rows — the mathematical condition that makes
          linear inversion best-conditioned. These locations tend to cluster where the POD
          modes vary most, i.e. where the detonation wave has the most discriminating information.
        </div>

        <h4>Prime Sampling</h4>
        <p>
          The Prime method (from prior literature) uses a physics-informed constraint: sensors
          must be spaced at least 10° apart around the annulus, since the detonation wave
          itself spans less than 1° and sensors closer together would be nearly redundant.
          Within that spacing constraint, sensors are placed to maximize the captured variance.
          In practice this constraint makes Prime placement <em>less</em> adaptive than QR
          and leads to higher reconstruction error, particularly at low sensor counts.
        </p>

        <h3>Results</h3>
        <p>
          Each configuration was evaluated on held-out test data by computing the relative
          L² reconstruction error between the SHRED forecast and the ground-truth luminosity field:
        </p>
        <BlockMath math={String.raw`\varepsilon = \frac{\|\tilde{x} - x\|_2}{\|x\|_2}`} />

        <ErrorPlot />
        <ErrorTable />

        <p>
          Several patterns are clear. <strong>SHRED consistently outperforms linear POD</strong> at
          every sensor count and placement strategy — often by a factor of 3–6×. With only 3 QR-placed
          sensors, SHRED achieves <InlineMath math="\varepsilon = 0.115" />, while the linear POD model
          achieves <InlineMath math="\varepsilon = 0.657" /> with the same sensors.
        </p>
        <p>
          <strong>QR placement consistently outperforms Prime placement.</strong> The Prime method
          was designed with a minimum 10° spacing assumption, but since the detonation wave
          subtends less than 1°, this constraint turns out not to be the binding factor — sensor
          orthogonality (captured by QR) matters more. Prime placement yields errors above 1.0
          for the linear POD model at 3 and 5 sensors.
        </p>
        <p>
          <strong>SHRED captures wave structure; linear POD does not.</strong> At low sensor counts,
          linear POD can approximate the mean intensity but fails to reconstruct the position and
          internal structure of the detonation wave. SHRED, through its recurrent encoder,
          learns the wave's periodicity and uses the sensor history to forecast where the wave
          is heading — enabling accurate positional reconstruction even from a single sensor.
        </p>
        <p>
          As sensor count increases, both methods improve, but SHRED's advantage narrows — at
          12 QR-placed sensors, the gap between SHRED (0.078) and POD (0.368) remains
          significant. The error plateau in the QR-POD curve around 5–9 sensors suggests the
          linear model is hitting a fundamental limit, not a data limit.
        </p>

        <h3>Conclusion</h3>
        <p>
          SHRED demonstrates that full-field reconstruction of rotating detonation engine flow
          fields is achievable from a very small number of sparse pressure sensors. The LSTM
          encoder learns the temporal structure of the detonation wave, enabling the shallow
          decoder to lift from a low-dimensional latent space to the full spatial field.
          QR-pivot sensor placement provides a principled, data-driven alternative to
          physics-heuristic approaches like Prime sampling, and consistently yields better-conditioned
          reconstructions.
        </p>
        <p>
          Future work could extend SHRED to multi-wave RDE configurations, real-time embedded
          deployment, and pressure-luminosity cross-modal reconstruction — inferring the
          luminosity field directly from pressure transducer signals without any camera data
          at inference time.
        </p>

      </div>

      <Footer />
    </div>
  );
}
