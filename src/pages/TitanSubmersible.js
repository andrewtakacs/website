import { useState, useEffect, useRef, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Footer from '../components/Footer';
import './AIProjects.css';
import './TitanSubmersible.css';

let PlotlyComponent = null;
const loadPlotly = () =>
  PlotlyComponent
    ? Promise.resolve(PlotlyComponent)
    : import('react-plotly.js').then(m => { PlotlyComponent = m.default; return m.default; });

const dataUrl = name => `${process.env.PUBLIC_URL}/data/titan/${name}`;

const FONT = { family: "'IBM Plex Mono', monospace", size: 10, color: '#6B6863' };
const baseLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(0,0,0,0)',
  font: FONT,
  margin: { l: 52, r: 16, t: 16, b: 72 },
};

const plotConfig = {
  displayModeBar: 'hover',
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  displaylogo: false,
  responsive: true,
  scrollZoom: false,
};

function useScrollPassthrough() {
  const ref = useRef(null);
  const handler = useCallback(e => { window.scrollBy({ top: e.deltaY, behavior: 'auto' }); }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('wheel', handler, { passive: true });
    return () => el.removeEventListener('wheel', handler);
  }, [handler]);
  return ref;
}

// ── pre-computed mode shape geometry (runs once at module load) ──────────────
const R_HULL = 1.553 / 2;   // 0.7765 m mid-plane radius
const L_HULL = 2.540;        // m hull length
const AMP    = 0.25 * R_HULL;
const N_PTS  = 250;

const THETAS = Array.from({ length: N_PTS + 1 }, (_, i) => 2 * Math.PI * i / N_PTS);
const ZS     = Array.from({ length: N_PTS + 1 }, (_, i) => L_HULL * i / N_PTS);

// Cross-section (radial) mode shapes: varying circumferential wave number n
const UND_CIRCLE = {
  x: THETAS.map(t => R_HULL * Math.cos(t)),
  y: THETAS.map(t => R_HULL * Math.sin(t)),
};
const RADIAL_MODES = [2, 3, 4].map(n => ({
  n,
  x: THETAS.map(t => (R_HULL + AMP * Math.cos(n * t)) * Math.cos(t)),
  y: THETAS.map(t => (R_HULL + AMP * Math.cos(n * t)) * Math.sin(t)),
}));

// Axial (side-view) mode shapes: varying axial half-wave number m
// Negative amplitude: external pressure buckles the hull inward (concave)
const AXIAL_MODES = [1, 2, 3].map(m => ({
  m,
  top: ZS.map(z => R_HULL - AMP * Math.sin(m * Math.PI * z / L_HULL)),
  bot: ZS.map(z => -(R_HULL - AMP * Math.sin(m * Math.PI * z / L_HULL))),
}));

// ── fig 1: fiber angle sweep ─────────────────────────────────────────────────
function AngleSweepPlot() {
  const [Plot, setPlot] = useState(null);
  const [json, setJson] = useState(null);
  const [error, setError] = useState(false);
  const ref = useScrollPassthrough();

  useEffect(() => {
    Promise.all([loadPlotly(), fetch(dataUrl('angle_sweep.json')).then(r => r.json())])
      .then(([Plt, data]) => { setPlot(() => Plt); setJson(data); })
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="plot-loading">failed to load.</div>;
  if (!json || !Plot) return <div className="plot-loading">loading plot…</div>;

  return (
    <div className="submarine-plot-wrap">
      <div className="titan-chart-sizer" ref={ref}>
        <Plot
          data={[
            {
              type: 'scatter', mode: 'lines',
              x: json.angles, y: json.pcr_mpa,
              name: 'P_cr (MPa)',
              line: { color: '#181715', width: 1.5 },
              yaxis: 'y',
              hovertemplate: 'θ=%{x}°  P_cr=%{y:.1f} MPa<extra></extra>',
            },
            {
              type: 'scatter', mode: 'lines',
              x: json.angles, y: json.a22_gpa,
              name: 'A₂₂ (GPa)',
              line: { color: '#B8581A', width: 1.5, dash: 'dash' },
              yaxis: 'y2',
              hovertemplate: 'θ=%{x}°  A₂₂=%{y:.2f} GPa<extra></extra>',
            },
            {
              type: 'scatter', mode: 'lines',
              x: [json.chosen_angle, json.chosen_angle],
              y: [0, Math.max(...json.pcr_mpa) * 1.08],
              line: { color: '#6B6863', width: 1, dash: 'dot' },
              name: 'chosen θ = 90°',
              yaxis: 'y',
              hoverinfo: 'skip',
            },
          ]}
          layout={{
            ...baseLayout,
            margin: { l: 52, r: 52, t: 16, b: 60 },
            xaxis: {
              title: { text: 'fiber angle θ (°)', font: FONT, standoff: 8 },
              tickfont: FONT, gridcolor: '#C4C0B8', linecolor: '#C4C0B8', dtick: 30,
            },
            yaxis: {
              title: { text: 'P_cr (MPa)', font: FONT, standoff: 8 },
              tickfont: FONT, gridcolor: '#C4C0B8', linecolor: '#C4C0B8',
            },
            yaxis2: {
              title: { text: 'A₂₂ (GPa)', font: FONT, standoff: 8 },
              tickfont: FONT, overlaying: 'y', side: 'right',
              gridcolor: 'rgba(0,0,0,0)', linecolor: '#C4C0B8',
            },
            showlegend: true,
            legend: { font: FONT, bgcolor: 'rgba(0,0,0,0)', x: 0.02, xanchor: 'left', y: 0.98 },
          }}
          config={plotConfig}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <p className="image-caption">
        fig 1 — fiber orientation angle vs. critical pressure P_cr and hoop stiffness A₂₂.
        both peak at ±90°, confirming [90°/90°/0°] as the optimal stacking.
      </p>
    </div>
  );
}

// ── fig 2: critical pressure by mode ────────────────────────────────────────
function PcrModesPlot() {
  const [Plot, setPlot] = useState(null);
  const [json, setJson] = useState(null);
  const [error, setError] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(null);
  const ref = useScrollPassthrough();

  useEffect(() => {
    Promise.all([loadPlotly(), fetch(dataUrl('pcr_modes.json')).then(r => r.json())])
      .then(([Plt, data]) => { setPlot(() => Plt); setJson(data); })
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="plot-loading">failed to load.</div>;
  if (!json || !Plot) return <div className="plot-loading">loading plot…</div>;

  const labels = json.modes.map(d => `m=${d.m}, n=${d.n}`);
  const values = json.modes.map(d => d.pcr_mpa);
  const colors = json.modes.map((_, i) =>
    i === 0 ? '#181715' : i === hoverIdx ? '#B8581A' : '#C4C0B8'
  );
  const hov = hoverIdx !== null ? json.modes[hoverIdx] : null;

  return (
    <div className="submarine-plot-wrap">
      <div className="titan-chart-sizer" ref={ref}>
        <Plot
          data={[
            {
              type: 'bar',
              x: labels, y: values,
              marker: { color: colors },
              hovertemplate: '<b>%{x}</b><br>P_cr = %{y:.1f} MPa<extra></extra>',
            },
            {
              type: 'scatter', mode: 'lines',
              x: labels, y: Array(labels.length).fill(json.p_titanic_mpa),
              line: { color: '#B8581A', width: 1.5, dash: 'dot' },
              name: 'Titanic depth (39 MPa)',
              hovertemplate: '39 MPa<extra></extra>',
            },
          ]}
          layout={{
            ...baseLayout,
            xaxis: { tickfont: FONT, tickangle: -25, gridcolor: '#C4C0B8', linecolor: '#C4C0B8' },
            yaxis: {
              title: { text: 'P_cr (MPa)', font: FONT, standoff: 8 },
              tickfont: FONT, gridcolor: '#C4C0B8', linecolor: '#C4C0B8',
            },
            showlegend: true,
            legend: { font: FONT, bgcolor: 'rgba(0,0,0,0)', x: 0.98, xanchor: 'right', y: 0.98 },
            bargap: 0.35,
          }}
          config={plotConfig}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          onHover={e => { if (e.points[0]) setHoverIdx(e.points[0].pointIndex); }}
          onUnhover={() => setHoverIdx(null)}
          useResizeHandler
        />
      </div>
      {hov && (
        <div className="titan-hover-card">
          <span>m={hov.m}, n={hov.n}</span>
          <span>P_cr = <strong>{hov.pcr_mpa} MPa</strong></span>
          <span>equiv. depth = <strong>{hov.depth_km} km</strong></span>
          <span>FOS = <strong>{hov.fos}</strong></span>
        </div>
      )}
      <p className="image-caption">
        fig 2 — critical buckling pressure by mode (m,n). hover for depth and FOS.
        dashed line = titanic wreck depth (39 MPa). governing mode m=2, n=1 shown in black.
      </p>
    </div>
  );
}

const RADIAL_STYLES = [
  { label: '2nd radial mode, n=2' },
  { label: '3rd radial mode, n=3' },
  { label: '4th radial mode, n=4' },
];
const AXIAL_STYLES = [
  { label: '1st axial mode, m=1' },
  { label: '2nd axial mode, m=2' },
  { label: '3rd axial mode, m=3' },
];

function ModeIndicator({ styles, activeIdx, onSelect }) {
  return (
    <div className="titan-anim-indicator">
      {styles.map((s, i) => (
        <button
          key={i}
          className={`titan-anim-label${i === activeIdx ? ' active' : ''}`}
          onClick={() => onSelect(i)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ── fig 3: cross-section radial mode shapes (animated) ───────────────────────
function RadialModesPlot() {
  const [Plot, setPlot] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => { loadPlotly().then(Plt => setPlot(() => Plt)); }, []);

  const startCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActiveIdx(i => (i + 1) % 3), 2000);
  }, []);

  useEffect(() => {
    startCycle();
    return () => clearInterval(intervalRef.current);
  }, [startCycle]);

  const handleSelect = (idx) => { setActiveIdx(idx); startCycle(); };

  if (!Plot) return <div className="plot-loading">loading plot…</div>;

  const active = RADIAL_MODES[activeIdx];

  return (
    <div className="submarine-plot-wrap">
      <div className="titan-radial-sizer">
        <Plot
          data={[
            {
              type: 'scatter', mode: 'lines',
              x: UND_CIRCLE.x, y: UND_CIRCLE.y,
              line: { color: '#C4C0B8', width: 1.5, dash: 'dot' },
              hoverinfo: 'none',
            },
            {
              type: 'scatter', mode: 'lines',
              x: active.x, y: active.y,
              line: { color: '#181715', width: 2 },
              hoverinfo: 'none',
            },
          ]}
          layout={{
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor:  'rgba(0,0,0,0)',
            margin: { l: 8, r: 8, t: 8, b: 8 },
            xaxis: { visible: false, scaleanchor: 'y', scaleratio: 1 },
            yaxis: { visible: false },
            showlegend: false,
          }}
          config={{ staticPlot: true }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <ModeIndicator styles={RADIAL_STYLES} activeIdx={activeIdx} onSelect={handleSelect} />
      <p className="image-caption">
        fig 3 — radial (cross-section) buckling mode shapes viewed from the end.
        n = circumferential wave number. undeformed hull shown dashed.
      </p>
    </div>
  );
}

// ── fig 4: axial side-view mode shapes (animated) ────────────────────────────
function AxialModesPlot() {
  const [Plot, setPlot] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => { loadPlotly().then(Plt => setPlot(() => Plt)); }, []);

  const startCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActiveIdx(i => (i + 1) % 3), 2000);
  }, []);

  useEffect(() => {
    startCycle();
    return () => clearInterval(intervalRef.current);
  }, [startCycle]);

  const handleSelect = (idx) => { setActiveIdx(idx); startCycle(); };

  if (!Plot) return <div className="plot-loading">loading plot…</div>;

  const active = AXIAL_MODES[activeIdx];

  return (
    <div className="submarine-plot-wrap">
      <div className="titan-axial-sizer">
        <Plot
          data={[
            {
              type: 'scatter', mode: 'lines',
              x: ZS, y: ZS.map(() => R_HULL),
              line: { color: '#C4C0B8', width: 1.5, dash: 'dot' },
              hoverinfo: 'none',
            },
            {
              type: 'scatter', mode: 'lines',
              x: ZS, y: ZS.map(() => -R_HULL),
              line: { color: '#C4C0B8', width: 1.5, dash: 'dot' },
              hoverinfo: 'none',
            },
            {
              type: 'scatter', mode: 'lines',
              x: ZS, y: active.top,
              line: { color: '#181715', width: 2 },
              hoverinfo: 'none',
            },
            {
              type: 'scatter', mode: 'lines',
              x: ZS, y: active.bot,
              line: { color: '#181715', width: 2 },
              hoverinfo: 'none',
            },
          ]}
          layout={{
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor:  'rgba(0,0,0,0)',
            margin: { l: 8, r: 8, t: 8, b: 8 },
            xaxis: { visible: false, range: [0, L_HULL] },
            yaxis: { visible: false, range: [-(R_HULL + AMP) * 1.2, (R_HULL + AMP) * 1.2] },
            showlegend: false,
          }}
          config={{ staticPlot: true }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <ModeIndicator styles={AXIAL_STYLES} activeIdx={activeIdx} onSelect={handleSelect} />
      <p className="image-caption">
        fig 4 — axial buckling mode shapes (side view), top and bottom cylinder edges.
        m = number of axial half-waves. undeformed hull shown dashed.
      </p>
    </div>
  );
}

// ── fig 5: FOS comparison ────────────────────────────────────────────────────
function FOSComparisonPlot() {
  const [Plot, setPlot] = useState(null);
  const [json, setJson] = useState(null);
  const [error, setError] = useState(false);
  const ref = useScrollPassthrough();

  useEffect(() => {
    Promise.all([loadPlotly(), fetch(dataUrl('fos_comparison.json')).then(r => r.json())])
      .then(([Plt, data]) => { setPlot(() => Plt); setJson(data); })
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="plot-loading">failed to load.</div>;
  if (!json || !Plot) return <div className="plot-loading">loading plot…</div>;

  const labels = json.configs.map(d => d.label.replace('\n', ' '));
  const values = json.configs.map(d => d.fos);
  const colors = json.configs.map(d => d.type === 'analytical' ? '#181715' : '#6B6863');

  return (
    <div className="submarine-plot-wrap">
      <div className="titan-chart-sizer" ref={ref}>
        <Plot
          data={[
            {
              type: 'bar',
              x: labels, y: values,
              marker: { color: colors },
              hovertemplate: '<b>%{x}</b><br>FOS = %{y:.2f}<extra></extra>',
            },
            {
              type: 'scatter', mode: 'lines',
              x: labels, y: Array(labels.length).fill(json.fos_required),
              line: { color: '#B8581A', width: 1.5, dash: 'dot' },
              name: 'ASME recommended (5.0)',
              hovertemplate: 'ASME: FOS=5<extra></extra>',
            },
            {
              type: 'scatter', mode: 'lines',
              x: labels, y: Array(labels.length).fill(json.fos_unity),
              line: { color: '#C4C0B8', width: 1, dash: 'dash' },
              name: 'FOS = 1 (failure)',
              hovertemplate: 'failure<extra></extra>',
            },
          ]}
          layout={{
            ...baseLayout,
            xaxis: { tickfont: FONT, gridcolor: '#C4C0B8', linecolor: '#C4C0B8' },
            yaxis: {
              title: { text: 'factor of safety', font: FONT, standoff: 8 },
              tickfont: FONT, gridcolor: '#C4C0B8', linecolor: '#C4C0B8', range: [0, 6.5],
            },
            showlegend: true,
            legend: { font: FONT, bgcolor: 'rgba(0,0,0,0)', x: 0.98, xanchor: 'right', y: 0.98 },
            bargap: 0.4,
          }}
          config={plotConfig}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
      <p className="image-caption">
        fig 5 — factor of safety: analytical CLT (black) vs. all Abaqus configurations (gray).
        none reach the ASME-recommended FOS of 5 for buckling-governed pressure vessels.
      </p>
    </div>
  );
}

// ── computed ABD numerical values ────────────────────────────────────────────
function ABDDisplay() {
  return (
    <div className="titan-abd-grid">
      <div className="titan-matrix-block">
        <span className="titan-matrix-label">[A] extensional (N/m)</span>
        <BlockMath math={String.raw`\begin{bmatrix}6.510&0.234&0\\0.234&12.315&0\\0&0&0.397\end{bmatrix}\!\times10^{9}`} />
      </div>
      <div className="titan-matrix-block">
        <span className="titan-matrix-label">[B] coupling (N)</span>
        <BlockMath math={String.raw`\begin{bmatrix}5.407&0&0\\0&{-5.407}&0\\0&0&0\end{bmatrix}\!\times10^{5}`} />
      </div>
      <div className="titan-matrix-block">
        <span className="titan-matrix-label">[D] bending (N·m)</span>
        <BlockMath math={String.raw`\begin{bmatrix}8.704&0.312&0\\0.312&16.479&0\\0&0&0.530\end{bmatrix}\!\times10^{6}`} />
      </div>
    </div>
  );
}

// ── geometry / parameter tables ───────────────────────────────────────────────
function GeometryTables() {
  return (
    <div className="titan-param-grid">
      <div className="titan-param-block">
        <h4>geometry</h4>
        <table className="titan-table">
          <tbody>
            <tr><td>outer diameter</td><td>1.68 m</td></tr>
            <tr><td>inner diameter</td><td>1.426 m</td></tr>
            <tr><td>mid-plane diameter</td><td>1.553 m</td></tr>
            <tr><td>hull length L</td><td>2.540 m</td></tr>
            <tr><td>wall thickness t</td><td>0.1267 m</td></tr>
            <tr><td>D/t ratio</td><td>≈ 12.3</td></tr>
          </tbody>
        </table>
      </div>
      <div className="titan-param-block">
        <h4>laminate</h4>
        <table className="titan-table">
          <tbody>
            <tr><td>ply thickness</td><td>0.191 mm</td></tr>
            <tr><td>plies per sub-laminate</td><td>133</td></tr>
            <tr><td>sub-laminates</td><td>5</td></tr>
            <tr><td>total plies</td><td>665</td></tr>
            <tr><td>fiber volume fraction</td><td>60%</td></tr>
            <tr><td>stacking</td><td>[90°/90°/0°]</td></tr>
          </tbody>
        </table>
      </div>
      <div className="titan-param-block">
        <h4>elastic properties (60% V_f)</h4>
        <table className="titan-table">
          <tbody>
            <tr><td>E₁₁</td><td>154 GPa</td></tr>
            <tr><td>E₂₂</td><td>8.85 GPa</td></tr>
            <tr><td>G₁₂</td><td>3 GPa</td></tr>
            <tr><td>ν₁₂</td><td>0.32</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Abaqus stiffener results table ────────────────────────────────────────────
function StiffenerTable() {
  const rows = [
    { config: 'no stiffeners (baseline)', fos: '2.7323' },
    { config: '3 × 2.5 cm rings',          fos: '2.7669' },
    { config: '5 × 2.5 cm rings',          fos: '2.8010' },
    { config: '5 × 5 cm rings',            fos: '2.8556' },
  ];
  return (
    <table className="titan-table" style={{ width: '100%', marginTop: '0.5rem' }}>
      <thead>
        <tr>
          <th>Abaqus configuration</th>
          <th style={{ textAlign: 'right' }}>FOS (eigenvalue)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.config}>
            <td>{r.config}</td>
            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{r.fos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── main page ────────────────────────────────────────────────────────────────
export default function TitanSubmersible() {
  return (
    <div className="inner-page ai-projects-page">
      <div className="detail-header">
        <span className="page-label">software / 008</span>
        <h1 className="detail-title">Titan Submersible — Buckling Investigation</h1>
        <div className="detail-meta">
          <span className="dim">2026</span>
          <span className="dim">·</span>
          <span className="dim">CLT</span>
          <span className="dim">·</span>
          <span className="dim">FEA</span>
          <span className="dim">·</span>
          <span className="dim">buckling</span>
          <span className="dim">·</span>
          <span className="dim">composite structures</span>
        </div>
      </div>

      <hr className="rule" />

      <div className="ai-projects-text" style={{ paddingTop: '2rem' }}>

        {/* ── Abstract ── */}
        <h3>Abstract</h3>
        <p>
          Understanding the buckling behavior of a thick composite pressure hull under extreme
          hydrostatic pressure is essential, as demonstrated by the 2023 OceanGate Titan
          implosion. This project investigates the structural capacity of an idealized,
          defect-free CFRP cylinder resembling Titan's pressure hull at the Titanic wreck depth
          (~3,880 m, 39 MPa). The hull is treated as a simply-supported cylindrical shell with
          665 plies in a [90°/90°/0°] stacking sequence, characterized from publicly available
          geometry and material data in the NTSB and USCG accident reports. Classical Laminate
          Theory (CLT) predicts the governing mode as m=2, n=1 with a factor of safety
          of <strong>3.16</strong>. Abaqus eigenvalue buckling confirms the same mode
          at <strong>2.73</strong>, with circumferential stiffeners reaching 2.86 at best.
          Both values fall short of the ASME-recommended FOS of 5, indicating that real-world
          imperfections were likely decisive in the actual failure.
        </p>

        <hr className="rule" />

        {/* ── Background ── */}
        <h3>Background</h3>
        <p>
          The OceanGate Titan was a carbon-fiber-reinforced polymer (CFRP) submersible operated
          for deep-sea expeditions to the RMS Titanic wreck. On June 18, 2023, the vehicle
          imploded during descent. NTSB concluded that pressure hull buckling failure was the
          cause, with delamination contributing across multiple prior dives — present but
          undetected until catastrophic failure.
        </p>
        <p>
          OceanGate CEO Stockton Rush chose CFRP to eliminate syntactic foam and reduce
          production cost. The hull was manufactured via filament winding: prepreg carbon fiber
          wound over a cylindrical mandrel by AFP equipment (Electroimpact). The result was five
          co-bonded 1-inch sub-laminates, each with 133 plies. Fiber wrinkles were identified by
          NTSB reviewers in the trimmed end sections. This project builds an idealized
          (defect-free) model to establish what the hull theoretically could withstand — and uses
          that baseline to reason about the gap between ideal and actual performance.
        </p>

        <hr className="rule" />

        {/* ── Geometry ── */}
        <h3>Hull Geometry &amp; Material</h3>
        <GeometryTables />
        <p style={{ marginTop: '1rem' }}>
          The laminate used Grafil 37-800 carbon fiber with Epon 862 epoxy, estimated at 60%
          fiber volume fraction. The individual sub-laminate and global laminate structure:
        </p>
        <BlockMath math={String.raw`U = [\theta_h,\;{-\theta_h},\;0^\circ], \qquad L_{133} = \bigl[U^{44},\;\theta_h\bigr], \qquad L_{\text{global}} = L_{133}^{\times 5}`} />

        <hr className="rule" />

        {/* ── Analytical approach ── */}
        <h3>Analytical Approach — CLT &amp; Critical Collapse Pressure</h3>
        <p>
          A closed-form critical buckling pressure <InlineMath math="P_{cr}" /> is derived from
          Classical Laminate Theory combined with the governing equilibrium equations for
          cylindrical composite shells under uniform external hydrostatic pressure. The in-plane
          forces <InlineMath math="N_{ij}" />, bending moments <InlineMath math="M_{ij}" />, and
          transverse shear forces <InlineMath math="K_i" /> acting on the composite shell are
          expressed as functions of in-plane strains, curvatures, and shear strains through the
          laminate stiffness relations, written compactly as an 8×8 stiffness matrix:
        </p>
        <BlockMath math={String.raw`\begin{bmatrix}N_x\\N_y\\N_{xy}\\M_x\\M_y\\M_{xy}\\K_x\\K_y\end{bmatrix}=\begin{bmatrix}A_{11}&A_{12}&A_{16}&B_{11}&B_{12}&B_{16}&0&0\\A_{12}&A_{22}&A_{26}&B_{12}&B_{22}&B_{26}&0&0\\A_{16}&A_{26}&A_{66}&B_{16}&B_{26}&B_{66}&0&0\\C_{11}&C_{12}&C_{16}&D_{11}&D_{12}&D_{16}&0&0\\C_{12}&C_{22}&C_{26}&D_{12}&D_{22}&D_{26}&0&0\\C_{16}&C_{26}&C_{66}&D_{16}&D_{26}&D_{66}&0&0\\0&0&0&0&0&0&F_{44}&F_{45}\\0&0&0&0&0&0&F_{45}&F_{55}\end{bmatrix}\begin{bmatrix}\varepsilon_x\\\varepsilon_y\\\gamma_{xy}\\\kappa_x\\\kappa_y\\\kappa_{xy}\\\gamma_{xz}\\\gamma_{yz}\end{bmatrix}`} />

        <p>
          The A, B, D sub-matrices — extensional, bending-extension coupling, and bending
          stiffness — are built from the transformed reduced stiffness <InlineMath math="\bar{Q}^k_{ij}" /> of
          each ply integrated through the laminate thickness. In this formulation{' '}
          <InlineMath math="C_{ij} = B_{ij}" />:
        </p>
        <BlockMath math={String.raw`A_{ij}=\sum_{k=1}^{N}\bar{Q}^k_{ij}(h_k-h_{k-1}),\quad B_{ij}=\frac{1}{2}\sum_{k=1}^{N}\bar{Q}^k_{ij}(h_k^2-h_{k-1}^2),\quad D_{ij}=\frac{1}{3}\sum_{k=1}^{N}\bar{Q}^k_{ij}(h_k^3-h_{k-1}^3)`} />

        <p>Computed matrices for the [90°/90°/0°] 665-ply laminate:</p>
        <ABDDisplay />
        <p>
          The non-zero off-diagonal B matrix reflects bending-extension coupling from the
          asymmetric 0° ply arrangement within each sub-laminate.
        </p>

        <p>
          The Critical Collapse Pressure <InlineMath math="P_{cr}" /> is the smaller root of a
          quadratic derived from the governing equilibrium equations combined with the laminate
          constitutive relations above:
        </p>
        <BlockMath math={String.raw`p_{cr}=\frac{-\beta-\sqrt{\beta^2-4\alpha\delta}}{2\alpha}`} />

        <p>
          where <InlineMath math="a = R_m = 0.7765\;\text{m}" /> is the mid-plane radius,{' '}
          <InlineMath math="b = \zeta = a" />, <InlineMath math="L = 2.540\;\text{m}" />,{' '}
          <InlineMath math="m" /> is the number of axial half-waves, and{' '}
          <InlineMath math="n" /> is the number of circumferential waves. The intermediate
          variables <InlineMath math="\phi_1,\phi_2,\phi_3" /> are:
        </p>
        <BlockMath math={String.raw`\phi_1 = a\frac{\pi n m}{L},\qquad \phi_2 = \frac{ab}{2}\frac{\pi^2 n^2}{L^2},\qquad \phi_3 = m^2 + \frac{ab}{2}\frac{\pi^2 n^2}{L^2} - 1`} />

        <p>
          The stiffness coefficients <InlineMath math="U_i, V_i, W_i" /> are determinantal
          combinations of the ABD terms:
        </p>
        <BlockMath math={String.raw`\begin{aligned}U_1 &= \frac{\pi^2 n^2}{L^2}\,a\,A_{11} + \frac{m^2}{a}\,A_{66}\\[6pt]V_1 &= \frac{\pi n m}{L}\!\left(A_{12}+A_{66}+\frac{1}{a}(2B_{66}-B_{12})\right)\\[6pt]W_1 &= \frac{\pi n}{L}\!\left(A_{12}+\frac{m^2}{a}(2B_{66}-B_{12})-\frac{\pi^2 n^2}{L^2}a\,B_{11}\right)\end{aligned}`} />
        <BlockMath math={String.raw`\begin{aligned}U_2 &= \frac{\pi n m}{L}\!\left(A_{12}+A_{66}+\frac{1}{a}(C_{66}-C_{12})\right)\\[6pt]V_2 &= \frac{\pi^2 n^2}{L^2}\!\left(a A_{66}+2B_{66}+C_{66}+\frac{2}{a}D_{66}\right)+\frac{m^2}{a^2}\!\left(a A_{22}-B_{22}-C_{22}+\frac{1}{a}D_{22}\right)\\[6pt]W_2 &= \frac{m}{a^2}(a A_{22}-C_{22})+\frac{\pi^2 n^2 m}{L^2}\!\left(2B_{66}-B_{12}+\frac{1}{a}(D_{12}+2D_{66})\right)+\frac{m^3}{a^3}(D_{22}-a B_{22})\end{aligned}`} />
        <BlockMath math={String.raw`\begin{aligned}U_3 &= \frac{\pi n}{L}\!\left(A_{12}-\frac{\pi^2 n^2}{L^2}a\,C_{11}-\frac{m^2}{a}(C_{12}-2C_{66})\right)\\[6pt]V_3 &= \frac{m}{a^2}(a A_{22}-B_{22})+\frac{\pi^2 n^2}{L^2}\frac{m}{a}(2a C_{66}-a C_{12}+D_{12}+4D_{66})-\frac{m^3}{a^3}(a C_{22}-D_{22})\\[6pt]W_3 &= \frac{1}{a}A_{22}-\frac{\pi^2 n^2}{L^2}(B_{12}+C_{12})-\frac{m^2}{a^2}(C_{22}+B_{22})+\frac{\pi^4 n^4}{L^4}a D_{11}+\frac{\pi^2 n^2 m^2}{L^2}\frac{2}{a}(D_{12}+2D_{66})+\frac{m^4}{a^3}D_{22}\end{aligned}`} />

        <p>
          The quadratic coefficients <InlineMath math="\alpha,\beta,\delta" /> are then:
        </p>
        <BlockMath math={String.raw`\begin{aligned}\alpha &= U_1\phi_2\phi_3+U_2\phi_1\phi_3+U_3\dfrac{\phi_1\phi_2}{m}\\[8pt]\beta &= -U_1(V_2\phi_3+W_3\phi_2)+U_2\!\left(V_1\phi_3-W_3\phi_1+V_3\dfrac{\phi_1}{m}\right)+U_3\!\left(W_1\phi_2+W_2\phi_1-V_2\dfrac{\phi_1}{m}\right)\\[8pt]\delta &= U_1(V_2 W_3-V_3 W_2)+U_2(V_3 W_1-V_1 W_3)+U_3(V_1 W_2-V_2 W_1)\end{aligned}`} />

        <p>
          The hydrostatic load at wreck depth, and the factor of safety definition:
        </p>
        <BlockMath math={String.raw`p_h=\rho_{\text{sw}}\,g\,h=(1025)(9.81)(3880)\approx39.0\;\text{MPa},\qquad \text{FOS}=\frac{P_{cr}}{P_h}`} />

        <hr className="rule" />

        {/* ── Ply angle selection ── */}
        <h3>Ply Angle Selection</h3>
        <p>
          The actual stacking sequence was not published — NTSB described "two cylindrical plies
          followed by one longitudinal ply." To determine the optimal cylindrical ply
          angle <InlineMath math="\theta_h" />, both <InlineMath math="P_{cr}" /> and hoop
          stiffness <InlineMath math="A_{22}" /> were swept from −90° to +90°. Both peak at ±90°,
          confirming [90°/90°/0°] as the analysis baseline.
        </p>
        <AngleSweepPlot />

        {/* ── Pcr modes ── */}
        <h3>Buckling Modes — Analytical Results</h3>
        <p>
          With [90°/90°/0°], <InlineMath math="P_{cr}" /> was evaluated for m=2–4 axial
          half-waves and n=1–3 circumferential waves. The minimum occurs at <strong>m=2, n=1</strong>{' '}
          with <InlineMath math="P_{cr}\approx123\;\text{MPa}" /> and FOS=3.16 against the 39 MPa
          wreck-depth pressure.
        </p>
        <PcrModesPlot />

        {/* ── Mode shapes ── */}
        <h3>Computed Buckling Mode Shapes</h3>
        <p>
          Buckling mode shapes are sinusoidal deformations of the cylindrical surface.
          Radial displacement follows{' '}
          <InlineMath math="w(\theta,z)=A\cos(n\theta)\sin\!\left(\tfrac{m\pi z}{L}\right)" />,
          where <InlineMath math="n" /> governs the cross-section shape and <InlineMath math="m" /> governs
          axial variation. Amplitude is exaggerated for visibility.
        </p>
        <RadialModesPlot />
        <AxialModesPlot />

        <hr className="rule" />

        {/* ── Numerical approach ── */}
        <h3>Numerical Approach — Abaqus Eigenvalue Buckling</h3>
        <p>
          The analytical predictions were validated with an Abaqus finite-element eigenvalue
          buckling analysis. The hull was modeled as a thin cylindrical shell using S4R elements
          (200 circumferential × 120 axial), with the laminate defined via its computed ABD
          matrices applied as a GeneralStiffnessSection. Simple-support boundary conditions
          constrained radial translation at both end rings, matching the titanium end-cap
          interface. A reference pressure of 39 MPa was applied uniformly to the outer surface;
          the BuckleStep solver extracted the first 10 eigenvalues.
        </p>
        <p>
          Circumferential steel rings (E=200 GPa, ν=0.3) were modeled in four configurations —
          varying count (3 or 5) and cross-section thickness (2.5 or 5 cm) — connected to the
          hull interior via tie constraints (perfect bond). All configurations produced the same
          m=2, n=1 governing mode.
        </p>
        <StiffenerTable />

        <hr className="rule" />

        {/* ── Results ── */}
        <h3>Results &amp; Discussion</h3>
        <FOSComparisonPlot />
        <p>
          CLT predicts FOS=3.16 and Abaqus gives FOS=2.73 for the same m=2, n=1 governing mode.
          The difference arises from CLT's idealized homogeneous shell assumption versus the S4R
          discretization, which captures local bending effects and boundary sensitivity more
          realistically. Stiffeners raise the FOS incrementally to 2.86 at best — none
          approaching the ASME-recommended FOS of 5.
        </p>
        <p>
          Real-world imperfections — fiber wrinkles, voids, delamination zones — would reduce
          the actual FOS well below 2.73, potentially below 1.0 under repeated pressure cycling.
          NTSB identified wrinkles in the trimmed hull sections; progressive delamination under
          cyclic load is consistent with the sequence of events leading to the June 2023 implosion.
        </p>

        <hr className="rule" />

        {/* ── Summary ── */}
        <h3>Summary</h3>
        <div className="titan-summary-grid">
          <div className="titan-summary-item">
            <span className="titan-summary-label">governing mode</span>
            <span className="titan-summary-value">m=2, n=1</span>
          </div>
          <div className="titan-summary-item">
            <span className="titan-summary-label">P_cr — analytical</span>
            <span className="titan-summary-value">123 MPa</span>
          </div>
          <div className="titan-summary-item">
            <span className="titan-summary-label">FOS — analytical</span>
            <span className="titan-summary-value">3.16</span>
          </div>
          <div className="titan-summary-item">
            <span className="titan-summary-label">FOS — Abaqus baseline</span>
            <span className="titan-summary-value">2.73</span>
          </div>
          <div className="titan-summary-item">
            <span className="titan-summary-label">FOS — Abaqus best</span>
            <span className="titan-summary-value">2.86</span>
          </div>
          <div className="titan-summary-item">
            <span className="titan-summary-label">ASME recommended</span>
            <span className="titan-summary-value">≥ 5.0</span>
          </div>
        </div>
        <p style={{ marginTop: '1.2rem' }}>
          The idealized laminate theoretically survives wreck-depth pressure, but with a factor
          of safety well below structural design standards. Documented imperfections in the real
          hull would reduce this margin to failure.
        </p>

      </div>

      <Footer />
    </div>
  );
}
