import Footer from '../components/Footer';

export default function Pwnagotchi() {
  return (
    <div className="inner-page detail-page">
      <div className="detail-header">
        <span className="page-label">hardware / 001</span>
        <h1 className="detail-title">Super Slim Pwnagotchi</h1>
        <div className="detail-meta">
          <span className="dim">2026</span>
          <span className="dim">·</span>
          <span className="dim">embedded / hardware</span>
        </div>
      </div>

      <hr className="rule" />

      <div className="detail-body sans dim">
        <p>This page is under construction. Content coming soon.</p>
      </div>

      <Footer />
    </div>
  );
}
