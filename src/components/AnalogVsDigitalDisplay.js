import React, { useEffect, useRef, useState } from 'react';
import './OscilloscopeDisplay.css';

const AnalogVsDigitalDisplay = ({ width = 800, height = 400 }) => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#0f0';
    
    // Add axis labels
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f0';
    
    // Voltage label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Voltage (V)', 0, 0);
    ctx.restore();
    
    // Time label
    ctx.fillText('Time (s)', width / 2, height - 10);
    
    // Reset for labels
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    
    // Draw X-axis labels
    for (let x = 0; x <= width; x += width / 10) {
      const label = ((x / width) * 10 - 5).toFixed(1);
      ctx.fillText(label, x - 10, height + 20);
    }
    
    // Draw Y-axis labels
    for (let y = 0; y <= height; y += height / 10) {
      const label = ((1 - y / height) * 2 - 1).toFixed(1);
      ctx.fillText(label, -30, y + 4);
    }
  };

  const drawAnalogSignal = (ctx, width, height) => {
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const amplitude = height / 2;
    const frequency = 2;
    const phase = time;

    for (let x = 0; x < width; x++) {
      const y = height / 2 + amplitude * Math.sin((x / width) * frequency * Math.PI * 2 + phase);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  };

  const drawDigitalSignal = (ctx, width, height) => {
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const amplitude = height / 2;
    const frequency = 2;
    const phase = time;
    const steps = 16; // Number of steps in the digital signal

    for (let i = 0; i < steps; i++) {
      const x1 = (i / steps) * width;
      const x2 = ((i + 1) / steps) * width;
      const y = height / 2 + amplitude * Math.sin((i / steps) * frequency * Math.PI * 2 + phase);
      
      // Draw horizontal line
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      
      // Draw vertical line (if not the last step)
      if (i < steps - 1) {
        const nextY = height / 2 + amplitude * Math.sin(((i + 1) / steps) * frequency * Math.PI * 2 + phase);
        ctx.moveTo(x2, y);
        ctx.lineTo(x2, nextY);
      }
    }

    ctx.stroke();
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
    
    // Draw both signals
    drawAnalogSignal(ctx, width, height);
    drawDigitalSignal(ctx, width, height);
  };

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 0.03);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  // Redraw effect
  useEffect(() => {
    drawCanvas();
  }, [time, width, height]);

  return (
    <div className="oscilloscope-display">
      <canvas ref={canvasRef} className="oscilloscope-canvas" />
    </div>
  );
};

export default AnalogVsDigitalDisplay; 