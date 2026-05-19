import Footer from '../components/Footer';
import './Certificates.css';

export default function Certificates() {
  return (
    <div className="inner-page certificates-page">
      <div className="certificates-header">
        <span className="page-label">certificates</span>
      </div>

      <hr className="rule" />

      <div className="certificates-container">
        <div className="certificate-card">
          <img src={`${process.env.PUBLIC_URL}/images/Certificate_1.jpg`} alt="Certificate 1" loading="lazy" />
        </div>
        <div className="certificate-card">
          <img src={`${process.env.PUBLIC_URL}/images/Certificate_2.jpg`} alt="Certificate 2" loading="lazy" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
