import Footer from '../components/Footer';
import './AIProjects.css';
import './IAMHandwriting.css';

export default function IAMHandwriting() {
  return (
    <div className="inner-page ai-projects-page">

      <div className="detail-header">
        <span className="page-label">software / research · wip</span>
        <h1 className="detail-title">Handwriting Synthesis</h1>
        <div className="detail-meta">
          <span className="dim">2026</span>
          <span className="dim">·</span>
          <span className="dim">in progress</span>
          <span className="dim">·</span>
          <span className="dim">stroke modeling</span>
          <span className="dim">·</span>
          <span className="dim">generative</span>
        </div>
      </div>

      <hr className="rule" />

      <div className="ai-projects-text">

        <h3>Goal</h3>
        <p>
          Given any document even containing LaTeX, produce a PDF that looks like it was handwritten by me.
          The output should be indistinguishable from something I actually wrote on paper.
        </p>

        <h3>Why Not Just Use a Font?</h3>
        <p>
          My first instinct was to trace my own letters, package them as a font, and
          call it good. I did this, but it does not look too realistic. Every 'a' is the same as any other 'a'
          Even if I randomized the letter generation it would not really feel good because handwriting changes in slant and size
          depending on what comes before and after it. So, a custom font wont work....
        </p>

        <div className="hw-figure">
          <img
            src="/images/hw_font_test.png"
            alt="Custom handwriting font output"
            className="hw-img"
          />
          <p className="image-caption">
            Fig 1. Output from the custom TTF built from my collected glyph strokes. It is
            readable, but repeated letters reuse the same baked glyph, which makes the
            result feel mechanical instead of handwritten.
          </p>
        </div>

        <h3>Stroke-Based Renderer Approach</h3>
        <p>
          Instead of encoding strokes as a font, Build rendering pipeline that works
          directly with the raw stroke data.
        </p>

        <p>
          The data collection step uses a Flask server + iPad web UI that captures Apple Pencil
          strokes as raw (x, y, pressure, time) sequences. Each glyph is recorded 10 times to
          build a small variation library. The renderer picks a random sample for each character,
          applies Gaussian perturbation to the stroke points, and draws each stroke as a smooth
          cubic Bezier curve with pressure-dependent width.
        </p>

        <div className="hw-figure">
          <img
            src="/images/hw_stroke_ref.png"
            alt="Collected Apple Pencil stroke glyphs"
            className="hw-img"
          />
          <p className="image-caption">
            Fig 2. Stroke reference sheet generated from the collection app.
            10 samples per glyph, captured with Apple Pencil on iPad.
            About 50% of the full glyph set is collected so far.
          </p>
        </div>

        <div className="hw-figure">
          <img
            src="/images/hw_render_output.png"
            alt="Stroke renderer output"
            className="hw-img"
          />
          <p className="image-caption">
            Fig 3. Stroke renderer output on a sample LaTeX file.
            The letters are my actual strokes, math layout is handled by the pipeline.
            The text body still looks too uniform and letters do not flow into each other.
          </p>
        </div>

        <h3>Why the Stroke Renderer Still Falls Short</h3>
        <p>
          The stroke renderer is better than a font but hits a hard ceiling. The core problem is
          that each letter is still an independent stamp. Real handwriting has contextual shaping:
          the 'a' at the end of a word curves differently from one in the middle. Letters connect
          with entry and exit strokes that depend on both neighbors. The renderer has none of this.
          It also struggles with layout: spacing constants that work for one font size break at
          another, math expressions require a recursive layout engine to place fractions and
          integrals correctly, and the overall line rhythm lacks the slight organic irregularity
          that makes handwriting look natural.
        </p>

        <h3>Approach 2: IAM Dataset + RNN on Personal Stroke Data</h3>
        <p>
          The right fix is a generative model that learns stroke dynamics directly rather than
          replaying recorded samples. The plan follows Graves (2013): an LSTM stack with a
          mixture density network head that models the joint distribution of pen offsets
          (delta-x, delta-y, pen-lift) at each timestep. A soft attention mechanism aligns
          the stroke sequence to the input character sequence so the model can generate any
          text, not just text it has seen.
        </p>
        <p>
          Training starts on the IAM Handwriting Database, which has online stroke data from
          657 writers across roughly 115,000 word samples. That gives the model broad stroke
          dynamics before it ever sees my handwriting. Fine-tuning on the personal stroke
          collection then shifts the style without losing the fluency learned from IAM.
        </p>
        <p>
          The key advantage over the stamp-based approach: the model generates strokes
          autoregressively, so each step is conditioned on everything written before it.
          Letter shapes emerge from context, connecting strokes happen naturally, and
          variation is baked into the sampling process rather than bolted on after the fact.
        </p>

        <h3>Status</h3>
        <ul>
          <li>Data collection app: working, ~50% of glyph set collected on iPad</li>
          <li>LaTeX parser: handles fractions, sqrt, subscripts, Greek symbols, sections</li>
          <li>Stroke renderer pipeline: built, currently broken on spacing and layout</li>
          <li>Custom TTF font: built and tested, retired as approach</li>
          <li>IAM dataset download and preprocessing: not started</li>
          <li>LSTM + MDN training: not started</li>
          <li>Fine-tuning on personal strokes: not started</li>
        </ul>

        <h3>References</h3>
        <p>
          Graves, A. (2013). <em>Generating Sequences With Recurrent Neural Networks.</em> arXiv:1308.0850.
          <br />
          Marti, U.-V. and Bunke, H. (2002). <em>The IAM-database: an English sentence database for offline
          handwriting recognition.</em> IJDAR 5, 39-46.
        </p>

      </div>

      <Footer />
    </div>
  );
}
