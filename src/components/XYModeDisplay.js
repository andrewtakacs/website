import React, { useEffect, useRef, useState } from 'react';
import './OscilloscopeDisplay.css';

const XYModeDisplay = ({ width = 600, height = 600 }) => {
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

  const drawLissajous = (ctx, width, height) => {
    const amplitude = Math.min(width, height) / 4;
    const frequencyX = 1; // X frequency
    const frequencyY = 1; // Y frequency
    const phase = time;

    // Draw the horizontal sine wave (Y component)
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const t = (x / width) * Math.PI * 2;
      const y = height / 2 + amplitude * Math.sin(frequencyY * t + phase);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw the vertical sine wave (X component)
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let y = 0; y < height; y++) {
      const t = (y / height) * Math.PI * 2;
      const x = width / 2 + amplitude * Math.sin(frequencyX * t + 2*phase);
      
      if (y === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Calculate the current point on the Lissajous curve
    const currentT = (time % (Math.PI * 2));
    const currentX = width / 2 + amplitude * Math.sin(frequencyX * currentT + phase);
    const currentY = height / 2 + amplitude * Math.sin(frequencyY * currentT);

    // Draw tracing lines
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); // Dashed line

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

    // Draw the Lissajous figure
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      const x = width / 2 + amplitude * Math.sin(frequencyX * t + phase);
      const y = height / 2 + amplitude * Math.sin(frequencyY * t);
      
      if (t === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

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
    
    // Draw Lissajous figure
    drawLissajous(ctx, width, height);
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

export default XYModeDisplay; 