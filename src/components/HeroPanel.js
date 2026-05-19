import { useRef, useCallback } from 'react';
import './HUD.css';

const PARAM_CONFIG = {
  density: { min: 0.1, max: 1.0, step: 0.01, label: 'DENSITY' },
  flow:    { min: 0.3, max: 1.0, step: 0.01, label: 'FLOW' },
  noise:   { min: 0.05, max: 0.9, step: 0.01, label: 'NOISE' },
  decay:   { min: 0.3, max: 1.0, step: 0.01, label: 'DECAY' },
};

function MiniField({ metrics }) {
  const dots = Array.from({ length: 16 }, (_, i) => {
    const col = i % 4;
    const bucket = Math.floor(col / (4 / 3));
    const density = metrics[['x', 'y', 'z'][Math.min(bucket, 2)]] || 0.33;
    return { opacity: 0.15 + density * 0.7 };
  });

  return (
    <div className="hud-mini-field">
      {dots.map((d, i) => (
        <span key={i} className="hud-mini-dot" style={{ opacity: d.opacity }} />
      ))}
    </div>
  );
}

function DraggableParam({ paramKey, value, config, onChange }) {
  const dragRef = useRef(null);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startVal = value;
    const range = config.max - config.min;

    const onMove = (ev) => {
      const dy = startY - ev.clientY;
      const delta = (dy / 120) * range;
      const next = Math.max(config.min, Math.min(config.max, startVal + delta));
      onChange(paramKey, Math.round(next / config.step) * config.step);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [value, config, paramKey, onChange]);

  return (
    <div className="hud-param-row" ref={dragRef} onMouseDown={onMouseDown}>
      <span className="hud-param-label">{config.label}</span>
      <span className="hud-param-value">{value.toFixed(2)}</span>
    </div>
  );
}

function XYZBars({ metrics }) {
  return (
    <div className="hud-xyz">
      {['x', 'y', 'z'].map((k) => (
        <div key={k} className="hud-xyz-row">
          <span className="hud-xyz-label">{k.toUpperCase()}</span>
          <div className="hud-xyz-track">
            <div className="hud-xyz-fill" style={{ width: `${Math.round((metrics[k] || 0.33) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HeroPanel({ params, setParams, metrics }) {
  const handleChange = useCallback((key, val) => {
    setParams(prev => ({ ...prev, [key]: val }));
  }, [setParams]);

  const randomizeSeed = useCallback(() => {
    setParams(prev => ({ ...prev, seed: Math.floor(Math.random() * 99999) }));
  }, [setParams]);

  return (
    <div className="hud-right" style={{ position: 'absolute' }}>
      <span className="hud-panel-label">[FIELD]</span>
      <MiniField metrics={metrics} />

      <div className="hud-params">
        {Object.entries(PARAM_CONFIG).map(([key, cfg]) => (
          <DraggableParam
            key={key}
            paramKey={key}
            value={params[key]}
            config={cfg}
            onChange={handleChange}
          />
        ))}
        <div className="hud-param-row hud-seed-row" onClick={randomizeSeed}>
          <span className="hud-param-label">SEED</span>
          <span className="hud-param-value hud-seed-value">{params.seed}</span>
        </div>
      </div>

      <XYZBars metrics={metrics} />
    </div>
  );
}
