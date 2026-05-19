import { Link } from 'react-router-dom';
import './HUD.css';

const NAV_ITEMS = [
  { num: '00', label: 'home',     path: '/' },
  { num: '01', label: 'hardware', path: '/hardware' },
  { num: '02', label: 'software', path: '/software' },
  { num: '03', label: 'about',    path: '/about' },
  { num: '04', label: 'contact',  path: '/contact' },
];



export default function HUD({ activeSection = 'home' }) {
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="hud">

      {/* Top bar */}
      <div className="hud-top">
        <div className="hud-top-left">
          <Link to="/" className="hud-logo">AT</Link>
        </div>
        <div className="hud-top-right">
        </div>
      </div>

      {/* Left nav */}
      <div className="hud-left">
        <nav className="hud-nav">
          {NAV_ITEMS.map(({ num, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`hud-nav-item${activeSection === label ? ' hud-nav-item--active' : ''}`}
            >
              <span className="hud-nav-num">{num}</span>
              <span className="hud-nav-label">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="hud-crosshair">+</div>
      </div>

      {/* Bottom bar */}
      <div className="hud-bottom">
        <div className="hud-bottom-left">
        </div>
        <div className="hud-bottom-right">
          <button className="hud-full-btn" onClick={handleFullscreen}>[FULL] ⊞</button>
        </div>
      </div>

    </div>
  );
}
