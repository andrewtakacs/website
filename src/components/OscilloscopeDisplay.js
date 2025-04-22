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
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
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

const HeartDisplay = ({ width = 600, height = 600 }) => {
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
    
    // X-axis label
    ctx.fillText('X Signal', width / 2, height - 10);
    
    // Y-axis label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Y Signal', 0, 0);
    ctx.restore();
    
    // Reset for labels
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    
    // Draw X-axis labels
    for (let x = 0; x <= width; x += width / 10) {
      const label = ((x / width) * 2 - 1).toFixed(1);
      ctx.fillText(label, x - 10, height + 20);
    }
    
    // Draw Y-axis labels
    for (let y = 0; y <= height; y += height / 10) {
      const label = ((1 - y / height) * 2 - 1).toFixed(1);
      ctx.fillText(label, -30, y + 4);
    }
  };

  const drawHeart = (ctx, width, height) => {
    const scale = Math.min(width, height) / 4;
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw the heart using parametric equations
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      // Heart parametric equations
      const x = centerX + scale * 16 * Math.pow(Math.sin(t), 3);
      const y = centerY - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      
      if (t === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw the current point
    const currentT = (time % (Math.PI * 2));
    const currentX = centerX + scale * 16 * Math.pow(Math.sin(currentT), 3);
    const currentY = centerY - scale * (13 * Math.cos(currentT) - 5 * Math.cos(2*currentT) - 2 * Math.cos(3*currentT) - Math.cos(4*currentT));

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

    // Draw the current point
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
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
  }, [time, width, height]);

  return (
    <div className="oscilloscope-display">
      <canvas ref={canvasRef} className="oscilloscope-canvas" />
    </div>
  );
};

export { OscilloscopeDisplay, HeartDisplay }; 