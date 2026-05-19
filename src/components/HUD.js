import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HUD.css';

const NAV_ITEMS = [
  { num: '00', label: 'home',     path: '/' },
  { num: '01', label: 'hardware', path: '/hardware' },
  { num: '02', label: 'software', path: '/software' },
  { num: '03', label: 'about',    path: '/about' },
  { num: '04', label: 'contact',  path: '/contact' },
];


function StatusWaveform() {
  const canvasRef = useRef(null);
  const phaseRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = x / w;
        const y = h / 2 + Math.sin(t * Math.PI * 8 + phaseRef.current) * (h * 0.3)
                        + Math.sin(t * Math.PI * 3 + phaseRef.current * 0.7) * (h * 0.15);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(26,25,23,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
      phaseRef.current += 0.04;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} width={80} height={14} className="hud-waveform" />;
}

function OutputWaveform() {
  const canvasRef = useRef(null);
  const offsetRef = useRef(0);
  const frameRef = useRef(null);
  const dataRef = useRef(Array.from({ length: 60 }, () => Math.random()));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      offsetRef.current++;
      if (offsetRef.current % 4 === 0) {
        dataRef.current.shift();
        dataRef.current.push(Math.random());
      }

      const barW = w / dataRef.current.length;
      dataRef.current.forEach((v, i) => {
        const barH = Math.max(2, v * h);
        ctx.fillStyle = `rgba(26,25,23,${0.3 + v * 0.5})`;
        ctx.fillRect(i * barW, h - barH, barW - 1, barH);
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} width={90} height={18} className="hud-output-wave" />;
}


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
