import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import Footer from '../components/Footer';
import './AIProjects.css';

let PlotlyComponent = null;

const dataUrl = (name) => `${process.env.PUBLIC_URL}/data/fashioncnn/${name}`;

function loadPlotly() {
  return PlotlyComponent
    ? Promise.resolve(PlotlyComponent)
    : import('react-plotly.js').then(m => { PlotlyComponent = m.default; return m.default; });
}

const MONO = "'IBM Plex Mono', monospace";
const COLORS = ['#B8581A', '#2D5A8A', '#4A7A4A'];

const basePlotLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: MONO, size: 9, color: '#6B6863' },
  margin: { l: 45, r: 10, t: 28, b: 50 },
  xaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'epoch', font: { size: 9 } } },
  yaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8' },
  showlegend: true,
  legend: { x: 0.5, y: -0.22, orientation: 'h', xanchor: 'center', font: { size: 8 } },
};

const plotConfig = { staticPlot: true, displayModeBar: false };

function CurvePanel({ Plot, title, traces }) {
  return (
    <div className="confusion-panel">
      <div style={{ position: 'relative', width: '100%', paddingBottom: '80%' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Plot
            data={traces}
            layout={{
              ...basePlotLayout,
              title: { text: title, font: { size: 10, color: '#6B6863' } },
            }}
            config={plotConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        </div>
      </div>
    </div>
  );
}

function TrainingGrid({ Plot, data, label }) {
  const epochs = data.epochs;
  const configs = data.configs;

  const makePanels = () => [
    {
      title: 'Training Loss',
      traces: configs.map((c, i) => ({
        x: epochs, y: c.train_loss, type: 'scatter', mode: 'lines',
        line: { color: COLORS[i % COLORS.length] }, name: c.name,
      })),
    },
    {
      title: 'Validation Loss',
      traces: configs.map((c, i) => ({
        x: epochs, y: c.val_loss, type: 'scatter', mode: 'lines',
        line: { color: COLORS[i % COLORS.length] }, name: c.name,
      })),
    },
    {
      title: 'Training Accuracy',
      traces: configs.map((c, i) => ({
        x: epochs, y: c.train_acc.map(v => v * 100), type: 'scatter', mode: 'lines',
        line: { color: COLORS[i % COLORS.length] }, name: c.name,
      })),
    },
    {
      title: 'Validation Accuracy',
      traces: configs.map((c, i) => ({
        x: epochs, y: c.val_acc.map(v => v * 100), type: 'scatter', mode: 'lines',
        line: { color: COLORS[i % COLORS.length] }, name: c.name,
      })),
    },
  ];

  return (
    <>
      <div className="confusion-grid">
        {makePanels().map(({ title, traces }) => (
          <CurvePanel key={title} Plot={Plot} title={title} traces={traces} />
        ))}
      </div>
      <p className="image-caption">{label}</p>
    </>
  );
}

function FcnPlots() {
  const [Plot, setPlot] = useState(null);
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    Promise.all([
      loadPlotly(),
      fetch(dataUrl('fcn_curves.json')).then(r => {
        if (!r.ok) throw new Error('missing');
        return r.json();
      }),
    ])
      .then(([Plt, json]) => { setPlot(() => Plt); setData(json); })
      .catch(() => setMissing(true));
  }, []);

  if (missing) return (
    <div className="plot-loading" style={{ aspectRatio: '2/1', fontSize: '0.65rem' }}>
      run notebook cell 2 to generate FCN training curves
    </div>
  );
  if (!data || !Plot) return <div className="plot-loading">loading plots…</div>;

  return (
    <TrainingGrid
      Plot={Plot}
      data={data}
      label="Fig 1 — FCN: training and validation loss / accuracy for three hidden-layer configurations."
    />
  );
}

function CnnPlots() {
  const [Plot, setPlot] = useState(null);
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    Promise.all([
      loadPlotly(),
      fetch(dataUrl('cnn_curves.json')).then(r => {
        if (!r.ok) throw new Error('missing');
        return r.json();
      }),
    ])
      .then(([Plt, json]) => { setPlot(() => Plt); setData(json); })
      .catch(() => setMissing(true));
  }, []);

  if (missing) return (
    <div className="plot-loading" style={{ aspectRatio: '2/1', fontSize: '0.65rem' }}>
      run notebook cell 3 to generate CNN training curves
    </div>
  );
  if (!data || !Plot) return <div className="plot-loading">loading plots…</div>;

  return (
    <TrainingGrid
      Plot={Plot}
      data={data}
      label="Fig 2 — CNN: training and validation loss / accuracy for three optimizer configurations."
    />
  );
}

function FeatureMapGrid() {
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(dataUrl('feature_maps.json'))
      .then(r => { if (!r.ok) throw new Error('missing'); return r.json(); })
      .then(setData)
      .catch(() => setMissing(true));
  }, []);

  if (missing) return (
    <div className="plot-loading" style={{ aspectRatio: '4/1', fontSize: '0.65rem' }}>
      run notebook cell 5 to generate feature maps
    </div>
  );
  if (!data) return <div className="plot-loading">loading…</div>;

  const examples = data.examples ?? [{ label: 'Input', input_img: null, feature_maps: data.images }];

  return (
    <div className="mnist-img-section">
      {examples.map(({ label, input_img, feature_maps }) => (
        <div key={label} style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.7rem',
            color: '#6B6863',
            marginBottom: '0.4rem',
            letterSpacing: '0.04em',
          }}>
            {label}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
            {input_img && (
              <div className="mnist-pc-cell" style={{ flexShrink: 0 }}>
                <img src={input_img} alt={label} className="mnist-px-img" />
                <span className="mnist-pc-label">input</span>
              </div>
            )}
            <div className="mnist-pc-grid" style={{ flex: 1 }}>
              {feature_maps.map((src, i) => (
                <div key={i} className="mnist-pc-cell">
                  <img src={src} alt={`f${i + 1}`} className="mnist-px-img" />
                  <span className="mnist-pc-label">f{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <p className="image-caption">Fig 3 — conv1 feature maps: each filter's response to a Sneaker, Dress, and Shirt input.</p>
    </div>
  );
}

export default function FashionMNISTCNN() {
  return (
    <div className="inner-page ai-projects-page">
      <div className="detail-header">
        <span className="page-label">software / ai · 005</span>
        <h1 className="detail-title">Convolutional Neural Network — Fashion MNIST</h1>
        <div className="detail-meta">
          <span className="dim">2024</span>
          <span className="dim">·</span>
          <span className="dim">CNN</span>
          <span className="dim">·</span>
          <span className="dim">deep-learning</span>
        </div>
      </div>
      <hr className="rule" />

      <div className="ai-projects-text">
        <h3>Abstract</h3>
        <p>
          This project uses a Convolutional Neural Network (CNN) to classify the Fashion MNIST dataset — the same goal as the previous project but with a fundamentally different and more efficient model architecture.
        </p>
        <h3>Background</h3>
        <p>
          In the fully connected network, every neuron in one layer connects to every neuron in the next layer. This grows rapidly as network size increases, making computation expensive. CNNs address this by using local connectivity and shared weights.
        </p>

        <h3>Mathematical Theory</h3>
        <div className="math-text">
          A CNN uses convolutional layers with small filters (3×3 in this example) that slide across the image to detect features like edges, textures, and corners. The convolution operation:
        </div>
        <BlockMath math={String.raw`Image\ Data=X=\left[\begin{matrix}x_{\left(1,1\right)}&\ldots&x_{\left(1,28\right)}\\\vdots&\ddots&\vdots\\x_{\left(28,1\right)}&\ldots&x_{\left(28,28\right)}\\\end{matrix}\right]`} />
        <BlockMath math={String.raw`Convolutional\ Layer\ =W=\left[\begin{matrix}w_{(1,1)}&w_{(1,2)}&w_{(1,3)}\\w_{(2,1)}&w_{(2,2)}&w_{(2,3)}\\w_{(3,1)}&w_{(3,2)}&w_{(3,3)}\\\end{matrix}\right]`} />
        <div className="math-text">The convolution operation — the filter W slides across the image X:</div>
        <BlockMath math={String.raw`Z(i,j)\ =\ \sum_{m\ =\ 0}^{3}\sum_{n\ =\ 0}^{3}{X_{i+m-1,j+n-1}\ast W_{(m,n)}+b\ }`} />
        <div className="math-text">After convolution, ReLU is applied to introduce non-linearity:</div>
        <BlockMath math={String.raw`\text{ReLU}(z) = \max(0, z)`} />
        <div className="math-text">Pooling layers reduce feature map size by summarizing each region with its maximum value:</div>
        <BlockMath math={String.raw`\left[\begin{matrix}1&2&1&0\\2&7&3&8\\9&4&1&0\\8&3&1&6\end{matrix}\right] \xrightarrow{\text{max pool}} \left[\begin{matrix}7&8\\9&6\end{matrix}\right]`} />
        <BlockMath math={String.raw`P_{i,j,k}=\max\left[\begin{matrix}A_{2i,2j,k}&A_{2i,2j+1,k}\\A_{2i+1,2j,k}&A_{2i+1,2j+1,k}\end{matrix}\right]`} />
        <div className="math-text">After convolutional and pooling layers, the feature maps are flattened and passed through fully connected layers:</div>
        <BlockMath math={String.raw`flattening:\ f\ =\ \left[f_1,f_2\cdots f_{6272}\right]\ \text{note: } (14\times14\times32)=6272`} />
        <BlockMath math={String.raw`fully\ connected\ layer\ (128\ neurons):\ W^{FC1}=\left[\begin{matrix}w_{\left(1,1\right)}&\ldots&w_{\left(1,128\right)}\\\vdots&\ddots&\vdots\\w_{\left(6272,1\right)}&\ldots&w_{\left(6272,128\right)}\\\end{matrix}\right]`} />
        <BlockMath math={String.raw`layer\ output:\ h=f\ast W^{FC1}+b^{FC1}`} />
        <BlockMath math={String.raw`output\ layer\ (10\ neurons):\ W^{FC2}=\left[\begin{matrix}w_{\left(1,1\right)}&\ldots&w_{\left(1,10\right)}\\\vdots&\ddots&\vdots\\w_{\left(128,1\right)}&\ldots&w_{\left(128,10\right)}\\\end{matrix}\right]`} />
        <BlockMath math={String.raw`final\ output:\ y=softmax(h\ast W^{FC2}+b^{FC2})`} />

        <h3>Results</h3>

        <h4>FCN — Hidden Layer Size Comparison</h4>
        <FcnPlots />
        <div className="math-text">
          Three FCN configurations were trained for 40 epochs with Adam optimizer and Kaiming initialization. More weights consistently improved performance. Training time per epoch remained roughly similar across model sizes due to GPU parallelism.
        </div>

        <h4>CNN — Optimizer Comparison</h4>
        <CnnPlots />
        <div className="math-text">
          The same CNN architecture (16→32 channels, 3×3 kernel) was trained with three optimizers for 20 epochs. Adam achieved the highest validation accuracy. SGD with momentum was a close second. RMSProp showed slower convergence at the tested learning rate.
        </div>

        <h4>CNN — Feature Maps</h4>
        <FeatureMapGrid />
        <div className="math-text">
          Each cell above shows the response of one conv1 filter to a single input image. Filters learn to detect distinct spatial features — edges, textures, and shapes — that are then combined in deeper layers for classification.
        </div>
      </div>

      <Footer />
    </div>
  );
}
