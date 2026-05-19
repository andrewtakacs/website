import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import HARDWARE_PROJECTS from '../data/hardwareProjects';
import './Hardware.css';

const SORTED = [...HARDWARE_PROJECTS].sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Hardware() {
  return (
    <div className="inner-page hardware-page">
      <div className="page-header">
        <span className="page-label">hardware</span>
        <span className="page-count dim">[{SORTED.length} items]</span>
      </div>

      <hr className="rule" />

      <div className="project-list">
        {SORTED.map((p, idx) => {
          const id = String(idx + 1).padStart(3, '0');
          return (
            <div key={p.title} className="project-entry">
              <Link to={p.link} className="project-row">
                {p.image
                  ? <img src={p.image} alt={p.title} className="project-thumb" />
                  : <div className="project-thumb-placeholder" />
                }
                <span className="project-id dim">{id}</span>
                <span className="project-title">{p.title}</span>
                <span className="project-year dim">{p.year}</span>
              </Link>

              <hr className="rule" style={{ margin: 0 }} />
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
