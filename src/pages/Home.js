import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParticleField from '../components/ParticleField';
import HUD from '../components/HUD';
import HeroPanel from '../components/HeroPanel';
import HARDWARE_PROJECTS from '../data/hardwareProjects';
import SOFTWARE_PROJECTS from '../data/softwareProjects';
import './Home.css';

const DEFAULT_PARAMS = {
  density: 0.62,
  flow:    0.8,
  noise:   0.31,
  decay:   0.3,
  seed:    81271,
};

const sorted = (arr) => [...arr].sort((a, b) => new Date(b.date) - new Date(a.date));

const TOP_HARDWARE = sorted(HARDWARE_PROJECTS).slice(0, 3);
const TOP_SOFTWARE = sorted(SOFTWARE_PROJECTS).slice(0, 3);
const EXTRA_SOFTWARE = Math.max(0, SOFTWARE_PROJECTS.length - 3);

export default function Home() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [metrics, setMetrics] = useState({ x: 0.33, y: 0.33, z: 0.33, count: 0 });
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const els = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.dataset.section);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleMetrics = useCallback((m) => setMetrics(m), []);

  return (
    <div className="home">

      <div className="home-hero" data-section="home">
        <ParticleField params={params} onMetricsUpdate={handleMetrics} />
        <HeroPanel params={params} setParams={setParams} metrics={metrics} />
      </div>

      <section className="home-section" data-section="hardware">
        <div className="home-section-inner">
          <span className="home-section-num">01</span>
          <Link to="/hardware" className="home-section-title">Hardware</Link>
          <ul className="home-section-list">
            {TOP_HARDWARE.map(p => (
              <li key={p.title}>
                <span>{p.title}</span>
              </li>
            ))}
          </ul>
          <Link to="/hardware" className="home-section-link">→ view hardware</Link>
        </div>
      </section>

      <section className="home-section" data-section="software">
        <div className="home-section-inner">
          <span className="home-section-num">02</span>
          <Link to="/software" className="home-section-title">Software</Link>
          <ul className="home-section-list">
            {TOP_SOFTWARE.map(p => (
              <li key={p.title}>
                <span>{p.title}</span>
              </li>
            ))}
            {EXTRA_SOFTWARE > 0 && (
              <li className="home-section-more"><span>+ {EXTRA_SOFTWARE} more</span></li>
            )}
          </ul>
          <Link to="/software" className="home-section-link">→ view software</Link>
        </div>
      </section>

      <section className="home-section" data-section="about">
        <div className="home-section-inner">
          <span className="home-section-num">03</span>
          <Link to="/about" className="home-section-title">About</Link>
          <div className="home-section-bio">
            <p>Andrew Takacs</p>
            <p>MS Aerospace Engineering — University of Washington</p>
            <p>BS Mechanical Engineering — Washington State University</p>
          </div>
          <Link to="/about" className="home-section-link">→ view profile</Link>
        </div>
      </section>

      <section className="home-section" data-section="contact">
        <div className="home-section-inner">
          <span className="home-section-num">04</span>
          <Link to="/contact" className="home-section-title">Contact</Link>
          <div className="home-section-bio">
            <p data-email={atob('YW5kcmV3ZHRha2Fjc0Bob3RtYWlsLmNvbQ==')} className="home-email-obf" />
            <p>github.com/andrewtakacs</p>
            <p>linkedin.com/in/takacsandrew</p>
          </div>
          <Link to="/contact" className="home-section-link">→ get in touch</Link>
        </div>
      </section>

      <HUD activeSection={activeSection} />
    </div>
  );
}
