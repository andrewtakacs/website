import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Footer from '../components/Footer';
import './AIProjects.css';

let PlotlyComponent = null;

const trainingDataUrl = `${process.env.PUBLIC_URL}/data/fashionnn/training.json`;

const basePlotLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: "'IBM Plex Mono', monospace", size: 9, color: '#6B6863' },
  margin: { l: 45, r: 10, t: 28, b: 36 },
  xaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8', title: { text: 'epoch', font: { size: 9 } } },
  yaxis: { gridcolor: '#C4C0B8', zerolinecolor: '#C4C0B8' },
  showlegend: true,
  legend: { x: 0.5, y: -0.18, orientation: 'h', xanchor: 'center', font: { size: 8 } },
};

function TrainingPlots() {
  const [Plot, setPlot] = useState(null);
  const [td, setTd] = useState(null);

  useEffect(() => {
    Promise.all([
      PlotlyComponent
        ? Promise.resolve(PlotlyComponent)
        : import('react-plotly.js').then(m => { PlotlyComponent = m.default; return m.default; }),
      fetch(trainingDataUrl).then(r => r.json()),
    ]).then(([Plt, json]) => {
      setPlot(() => Plt);
      setTd(json);
    });
  }, []);

  if (!td || !Plot) return <div className="plot-loading">loading plots…</div>;

  const epochs = td.epochs;
  const fashion = td.datasets[0];
  const digit   = td.datasets[1];

  const panels = [
    {
      title: 'Fashion MNIST — Train Accuracy',
      caption: 'Fig 1 — Fashion MNIST training accuracy',
      y: fashion.train_acc,
    },
    {
      title: 'Fashion MNIST — Val Accuracy',
      caption: 'Fig 2 — Fashion MNIST validation accuracy',
      y: fashion.val_acc,
    },
    {
      title: 'Digit MNIST — Train Accuracy',
      caption: 'Fig 3 — Digit MNIST training accuracy',
      y: digit.train_acc,
    },
    {
      title: 'Digit MNIST — Val Accuracy',
      caption: 'Fig 4 — Digit MNIST validation accuracy',
      y: digit.val_acc,
    },
  ];

  return (
    <div className="confusion-grid">
      {panels.map(({ title, caption, y }) => (
        <div key={title} className="confusion-panel">
          <div style={{ position: 'relative', width: '100%', paddingBottom: '80%' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Plot
                data={[{ x: epochs, y, type: 'scatter', mode: 'lines', line: { color: '#B8581A' }, showlegend: false }]}
                layout={{ ...basePlotLayout, showlegend: false, title: { text: title, font: { size: 10, color: '#6B6863' } } }}
                config={{ staticPlot: true, displayModeBar: false }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
              />
            </div>
          </div>
          <p className="image-caption">{caption}</p>
        </div>
      ))}
    </div>
  );
}

function ReLUPlot() {
  const toSVG = (dx, dy) => ({
    x: 50 + (dx + 3) / 6 * 230,
    y: 140 - (dy + 0.5) / 4 * 120,
  });

  const xTicks = [-3, -2, -1, 0, 1, 2, 3];
  const yTicks = [0, 1, 2, 3];
  const p0 = toSVG(-3, 0);
  const p1 = toSVG(0, 0);
  const p2 = toSVG(3, 3);
  const axisY = toSVG(0, 0).y;
  const axisX = toSVG(0, 0).x;

  return (
    <div className="mnist-img-section">
      <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 380, display: 'block', margin: '0 auto' }}>
        {xTicks.map(tx => {
          const { x } = toSVG(tx, 0);
          return <line key={tx} x1={x} y1={20} x2={x} y2={140} stroke="#C4C0B8" strokeWidth={0.5} />;
        })}
        {yTicks.map(ty => {
          const { y } = toSVG(0, ty);
          return <line key={ty} x1={50} y1={y} x2={280} y2={y} stroke="#C4C0B8" strokeWidth={0.5} />;
        })}
        <line x1={50} y1={axisY} x2={280} y2={axisY} stroke="#6B6863" strokeWidth={1} />
        <line x1={axisX} y1={20} x2={axisX} y2={140} stroke="#6B6863" strokeWidth={1} />
        <polyline
          points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
          fill="none" stroke="#B8581A" strokeWidth={2} strokeLinejoin="round"
        />
        {xTicks.map(tx => {
          const { x } = toSVG(tx, 0);
          return <text key={tx} x={x} y={155} textAnchor="middle" fontSize={8} fill="#6B6863" fontFamily="IBM Plex Mono, monospace">{tx}</text>;
        })}
        {yTicks.map(ty => {
          const { y } = toSVG(0, ty);
          return <text key={ty} x={44} y={y + 3} textAnchor="end" fontSize={8} fill="#6B6863" fontFamily="IBM Plex Mono, monospace">{ty}</text>;
        })}
        <text x={165} y={170} textAnchor="middle" fontSize={9} fill="#6B6863" fontFamily="IBM Plex Mono, monospace">z</text>
        <text x={22} y={80} textAnchor="middle" fontSize={9} fill="#6B6863" fontFamily="IBM Plex Mono, monospace" transform="rotate(-90 22 80)">f(z)</text>
      </svg>
      <p className="image-caption">ReLU activation.</p>
    </div>
  );
}

export default function FashionMNISTNN() {
  return (
    <div className="inner-page ai-projects-page">
      <div className="detail-header">
        <span className="page-label">software / ai · 004</span>
        <h1 className="detail-title">Deep Neural Network — Fashion MNIST</h1>
        <div className="detail-meta">
          <span className="dim">2024</span>
          <span className="dim">·</span>
          <span className="dim">neural-network</span>
          <span className="dim">·</span>
          <span className="dim">deep-learning</span>
        </div>
      </div>
      <hr className="rule" />

      <div className="ai-projects-text">
        <h3>Abstract</h3>
        <p>
          The Fashion MNIST dataset is a collection of images of 10 different types of clothing items, such as shirts, trousers, and shoes. Created by Zalando Research in 2017 as a more challenging replacement for the original MNIST dataset. This project uses a fully connected neural network to classify Fashion MNIST. It is similar to how the brains of humans work!
        </p>
        <h3>Background</h3>
        <p>
          Just like the digit MNIST, the Fashion MNIST dataset contains 60,000 training images and 10,000 test images. Each image is 28x28 pixels and grayscale.
        </p>

        <h3>Mathematical Theory</h3>
        <div className="math-text">
          A neural network contains neurons which can be thought of as cells like cells in a brain. The inputs are <InlineMath math="I = x_1w_1+x_2w_2+\cdots x_nw_n" /> where <InlineMath math="x_n" /> is an input and <InlineMath math="w_n" /> is its weight. What occurs at each neuron:
        </div>
        <BlockMath math={String.raw`y=f\left(\sum_{n=1}^{N}{x_nw_n+b}\right)`} />
        <div className="math-text">
          The Rectified Linear Unit (ReLU) introduces non-linearity. It is simple, effective, and commonly used. Originally introduced in 1941 as a mathematical abstraction of biological neurons:
        </div>
        <div className="math-text">
          Formulating as a computation graph, neuron inputs <InlineMath math="\vec{x}\ \epsilon\ \mathbb{R}^n" />, weights <InlineMath math="\vec{w}\ \epsilon\ \mathbb{R}^n" />, bias <InlineMath math="b\ \epsilon\ \mathbb{R}" />:
        </div>
        <BlockMath math={String.raw`z\ =\ {\vec{w}\ }^T\ \vec{x}\ +b`} />
        <div className="math-text">ReLU activation:</div>
        <BlockMath math={String.raw`f(z) = \max(0, z)`} />
        <ReLUPlot />
        <div className="math-text">Final prediction:</div>
        <BlockMath math={String.raw`\hat{y}=f\left(z\right)=f\left(\vec{w^T}\ \vec{x}\ +b\right)`} />
        <div className="math-text">
          The loss function <InlineMath math="L(\hat{y},y)" /> computes error between predicted and true output. Gradient descent iteratively updates weights and bias to minimize the loss. The learning rate <InlineMath math="\alpha" /> controls the step size:
        </div>
        <BlockMath math={String.raw`{\vec{w}}_{k+1}={\vec{w}}_k-\alpha\nabla_{\vec{w}}J\left({\vec{w}}_k,w\right)`} />
        <BlockMath math={String.raw`{\vec{b}}_{k+1}={\vec{b}}_k-\alpha\nabla_{\vec{w}}J\left({\vec{b}}_k,b\right)`} />
        <div className="math-text">Backpropagation uses the chain rule to compute gradients through the network:</div>
        <BlockMath math={String.raw`\frac{\partial L}{\partial w}=\frac{\partial L}{\partial \hat{y}}\frac{\partial \hat{y}}{\partial w}`} />
        <BlockMath math={String.raw`\frac{\partial L}{\partial b}=\frac{\partial L}{\partial \hat{y}}\frac{\partial \hat{y}}{\partial b}`} />
        <div className="math-text"><strong>Weight Initialization Methods:</strong></div>
        <div className="math-text">Random Normal Initialization:</div>
        <BlockMath math={String.raw`w \sim \mathcal{N}(0, 1)`} />
        <div className="math-text">Xavier (Glorot) Initialization - keeps gradient scale the same across layers:</div>
        <BlockMath math={String.raw`w \sim \mathcal{N}\left(0, \sqrt{\frac{2}{n_{in} + n_{out}}}\right)`} />
        <div className="math-text">Kaiming (He) Initialization - designed for ReLU networks:</div>
        <BlockMath math={String.raw`w \sim \mathcal{N}\left(0, \sqrt{\frac{2}{n_{in}}}\right)`} />
        <div className="math-text">
          Batch Normalization normalizes each layer's inputs to have mean 0 and variance 1, mitigating vanishing/exploding gradients:
        </div>
        <BlockMath math={String.raw`\hat{x}^{(i)} = \frac{x^{(i)} - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}`} />
        <div className="math-text">
          Where <InlineMath math="\mu_B" /> is the mini-batch mean, <InlineMath math="\sigma_B^2" /> is the mini-batch variance, <InlineMath math="\epsilon" /> is a small constant. Then scaled and shifted with learnable parameters:
        </div>
        <BlockMath math={String.raw`y^{(i)} = \gamma \hat{x}^{(i)} + \beta`} />
        <div className="math-text">
          Dropout Regularization randomly sets a fraction of input units to zero during training to prevent co-adaptation:
        </div>
        <BlockMath math={String.raw`y^{(i)} = \begin{cases} 0 & \text{with probability } p \\ \frac{x^{(i)}}{1-p} & \text{with probability } 1-p \end{cases}`} />
        <div className="math-text">
          Where <InlineMath math="p" /> is the dropout rate. At test time, no dropout is applied and weights are scaled by <InlineMath math="1-p" />.
        </div>

        <h3>Results</h3>
        <TrainingPlots />
        <div className="math-text">
          Both models were successful. The digit classification model achieved 98.5% accuracy and the fashion model achieved 90.1%. More weights consistently improved performance; training time remained roughly constant across model sizes due to GPU parallelism in PyTorch.
        </div>
      </div>

      <Footer />
    </div>
  );
}
