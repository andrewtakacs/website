import React, { useEffect, useRef, useState } from 'react';
import './OscilloscopeDisplay.css';

const HeartDisplay = ({ width = 600, height = 600 }) => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);

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

  const drawHeart = (ctx, width, height) => {
    const scale = Math.min(width, height) / 18;
    const centerX = width / 2;
    const centerY = height / 2 - 25;

    // Draw the horizontal component wave (Y signal)
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const t = (x / width) * Math.PI * 2 + time;
      const y = centerY - scale * (5 * Math.cos(t) - 2 * Math.cos(2*t) - 0.8 * Math.cos(3*t) - 0.4 * Math.cos(4*t));
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw the vertical component wave (X signal)
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let y = 0; y < height; y++) {
      const t = (y / height) * Math.PI * 2 + time;
      const x = centerX + scale * 6 * Math.pow(Math.sin(t), 3);
      
      if (y === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Calculate the current point on the heart curve
    const currentT = (time % (Math.PI * 2));
    const currentX = centerX + scale * 6 * Math.pow(Math.sin(currentT), 3);
    const currentY = centerY - scale * (5 * Math.cos(currentT) - 2 * Math.cos(2*currentT) - 0.8 * Math.cos(3*currentT) - 0.4 * Math.cos(4*currentT));

    // Draw tracing lines
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical tracing line
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, height);
    ctx.stroke();

    // Horizontal tracing line
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width, currentY);
    ctx.stroke();

    // Reset line style
    ctx.setLineDash([]);

    // Draw the heart figure
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      const x = centerX + scale * 6 * Math.pow(Math.sin(t), 3);
      const y = centerY - scale * (5 * Math.cos(t) - 2 * Math.cos(2*t) - 0.8 * Math.cos(3*t) - 0.4 * Math.cos(4*t));
      
      if (t === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw glowing dot
    [
      { r: 18, a: 0.06 },
      { r: 12, a: 0.12 },
      { r: 7,  a: 0.25 },
      { r: 4,  a: 0.6  },
    ].forEach(({ r, a }) => {
      ctx.beginPath();
      ctx.arc(currentX, currentY, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,80,${a})`;
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ccffcc';
    ctx.fill();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height);
    
    // Draw heart
    drawHeart(ctx, width, height);
  };

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 0.02);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  // Redraw effect
  useEffect(() => {
    drawCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, width, height]);

  return (
    <div className="osc-bezel">
      <div className="canvas-container">
        <canvas ref={canvasRef} className="oscilloscope-canvas" />
      </div>
    </div>
  );
};

export default HeartDisplay; 