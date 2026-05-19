import React, { useEffect, useRef, useState } from 'react';
import './OscilloscopeDisplay.css';

const STEP_OPTIONS = [8, 16, 32, 64, 128];

const AnalogVsDigitalDisplay = ({ width = 800, height = 400 }) => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);
  const [steps, setSteps] = useState(16);

  const drawGrid = (ctx, w, h) => {
    const DIVS_X = 10, DIVS_Y = 8;
    const cellW = w / DIVS_X, cellH = h / DIVS_Y;
    ctx.strokeStyle = 'rgba(0,180,0,0.25)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= DIVS_X; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, h); ctx.stroke();
    }
    for (let j = 0; j <= DIVS_Y; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * cellH); ctx.lineTo(w, j * cellH); ctx.stroke();
    }
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = 'rgba(0,200,0,0.35)';
    for (let i = 0; i <= DIVS_X * 5; i++) {
      const x = i * (cellW / 5);
      ctx.beginPath(); ctx.moveTo(x, cy - 3); ctx.lineTo(x, cy + 3); ctx.stroke();
    }
    for (let j = 0; j <= DIVS_Y * 5; j++) {
      const y = j * (cellH / 5);
      ctx.beginPath(); ctx.moveTo(cx - 3, y); ctx.lineTo(cx + 3, y); ctx.stroke();
    }
  };

  const drawAnalogSignal = (ctx, w, h) => {
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const amplitude = h / 2.5, frequency = 2, phase = time;
    for (let x = 0; x < w; x++) {
      const y = h / 2 + amplitude * Math.sin((x / w) * frequency * Math.PI * 2 + phase);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const drawDigitalSignal = (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(0,255,0,0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const amplitude = h / 2.5, frequency = 2, phase = time;
    const boxWidth = w / steps;
    for (let i = 0; i < steps; i++) {
      const xCenter = i * boxWidth;
      const y = h / 2 + amplitude * Math.sin((i / steps) * frequency * Math.PI * 2 + phase);
      ctx.moveTo(xCenter, y);
      ctx.lineTo(xCenter + boxWidth, y);
      if (i < steps - 1) {
        const nextY = h / 2 + amplitude * Math.sin(((i + 1) / steps) * frequency * Math.PI * 2 + phase);
        ctx.moveTo(xCenter + boxWidth, y);
        ctx.lineTo(xCenter + boxWidth, nextY);
      }
    }
    ctx.stroke();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height);
    drawAnalogSignal(ctx, width, height);
    drawDigitalSignal(ctx, width, height);
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.03), 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    drawCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, width, height, steps]);

  return (
    <div className="osc-bezel">
      <div className="canvas-container">
        <canvas ref={canvasRef} className="oscilloscope-canvas" />
        <div className="screen-buttons">
          {STEP_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setSteps(n)}
              className={`animation-control${steps === n ? ' active' : ''}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalogVsDigitalDisplay;
