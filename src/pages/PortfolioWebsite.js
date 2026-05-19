import EarthCode from '../components/EarthCode';
import Footer from '../components/Footer';
import './PortfolioWebsite.css';

export default function PortfolioWebsite() {
  return (
    <div className="inner-page portfolio-website-page">
      <div className="detail-header">
        <span className="page-label">software / 003</span>
        <h1 className="detail-title">Portfolio Website</h1>
        <div className="detail-meta">
          <span className="dim">2024</span>
          <span className="dim">·</span>
          <span className="dim">react / web</span>
        </div>
      </div>

      <hr className="rule" />

      <div className="portfolio-website-content">
        <div className="portfolio-website-text sans dim">
          <p>
            Built from scratch with React and JavaScript — no templates, no pre-built component libraries.
            Hosted on GitHub Pages with a custom domain. Full control over every detail.
          </p>
          <p>
            For example, here is a rotating ASCII Earth that responds to scroll:
          </p>
        </div>
        <div className="earth-code-container">
          <EarthCode />
        </div>
      </div>

      <Footer />
    </div>
  );
}
