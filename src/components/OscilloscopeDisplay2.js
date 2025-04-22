import React, { useEffect, useRef, useState } from 'react';
import './OscilloscopeDisplay.css';

const OscilloscopeDisplay = ({ width = 800, height = 400 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [time, setTime] = useState(0);

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#0f0';
    
    // Draw center lines
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
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
    
    // Reset for grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    
    // Draw vertical lines and X-axis labels
    for (let x = 0; x <= width; x += width / 10) {
      if (x !== width / 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      const label = ((x / width) * 10 - 5).toFixed(1);
      ctx.fillText(label, x - 10, height + 20);
    }
    
    // Draw horizontal lines and Y-axis labels
    for (let y = 0; y <= height; y += height / 10) {
      if (y !== height / 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      const label = ((1 - y / height) * 2 - 1).toFixed(1);
      ctx.fillText(label, -30, y + 4);
    }
  };

  const drawSineWave = (ctx, width, height) => {
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Scale to fit within the 4x4 grid
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

  const drawHorizontalLine = (ctx, width, height) => {
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const y = height / 2;
    ctx.moveTo(0, y-height/5);
    ctx.lineTo(width, y-height/5);
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
    
    // Draw both the sine wave and horizontal line
    drawHorizontalLine(ctx, width, height);
    drawSineWave(ctx, width, height);
  };

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 0.1);
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

export default OscilloscopeDisplay; 