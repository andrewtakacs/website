import React, { useEffect, useRef, useState } from 'react';
import './CircleDisplay.css';

const CircleDisplay = ({ width = 600, height = 600 }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorXRef = useRef(null);
  const oscillatorYRef = useRef(null);
  const gainNodeXRef = useRef(null);
  const gainNodeYRef = useRef(null);
  const pannerXRef = useRef(null);
  const pannerYRef = useRef(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const [time, setTime] = useState(0);
  const [frequencyX, setFrequencyX] = useState(3);
  const [frequencyY, setFrequencyY] = useState(2);
  const [magnitudeX, setMagnitudeX] = useState(1);
  const [magnitudeY, setMagnitudeY] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [isMagnitudeDemoPlaying, setIsMagnitudeDemoPlaying] = useState(false);
  const [waveTypeX, setWaveTypeX] = useState('sine');
  const [waveTypeY, setWaveTypeY] = useState('sine');
  const [smoothingX, setSmoothingX] = useState(0);
  const [smoothingY, setSmoothingY] = useState(0);
  const [phase, setPhase] = useState(Math.PI / 2);
  const [isPhaseRotating, setIsPhaseRotating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Lissajous demo
  const demoPatterns = [
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 2 },
    { x: 3, y: 4 },
    { x: 4, y: 3 },
    { x: 5, y: 4 }
  ];

  // Mary Had a Little Lamb notes (frequency ratios)
  const maryNotes = [
    { x: 3.297, y: 3.297, pause: false }, 
    { x: 2.934, y: 2.934, pause: true },
    { x: 2.934, y: 2.934, pause: false }, 
    { x: 2.616, y: 2.616, pause: true },
    { x: 2.616, y: 2.616, pause: false },
    { x: 2.934, y: 2.934, pause: true },
    { x: 2.934, y: 2.934, pause: false },
    { x: 3.297, y: 3.297, pause: true },
    { x: 3.297, y: 3.297, pause: false }, 
    { x: 3.297, y: 3.297, pause: false },
    { x: 3.297, y: 3.297, pause: true },
    { x: 2.934, y: 2.934, pause: false },
    { x: 2.934, y: 2.934, pause: false },
    { x: 2.934, y: 2.934, pause: true },
    { x: 3.297, y: 3.297, pause: false },
    { x: 3.922, y: 3.922, pause: true },
    { x: 3.922, y: 3.922, pause: false },
    { x: 3.922, y: 3.922, pause: false },
    { x: 3.297, y: 3.297, pause: true },
    { x: 3.297, y: 3.297, pause: false },
    { x: 2.934, y: 2.934, pause: true },
    { x: 2.934, y: 2.934, pause: false },
    { x: 2.616, y: 2.616, pause: true },
    { x: 2.616, y: 2.616, pause: false },
    { x: 2.934, y: 2.934, pause: true },
    { x: 2.934, y: 2.934, pause: false },
    { x: 3.297, y: 3.297, pause: true },
    { x: 3.297, y: 3.297, pause: false },
    { x: 3.297, y: 3.297, pause: false },
    { x: 3.297, y: 3.297, pause: false },
    { x: 3.297, y: 3.297, pause: true },
    { x: 3.297, y: 3.297, pause: false },
    { x: 2.934, y: 2.934, pause: true },
    { x: 2.934, y: 2.934, pause: false },
    { x: 2.934, y: 2.934, pause: false },
    { x: 3.297, y: 3.297, pause: true },
    { x: 3.297, y: 3.297, pause: false },
    { x: 2.934, y: 2.934, pause: true },
    { x: 2.934, y: 2.934, pause: false },
    { x: 2.616, y: 2.616, pause: true }
  ];

  // Wave types for random selection
  const waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];

  // Function to randomize wave parameters
  const randomizeWaves = () => {
    // Random wave types
    setWaveTypeX(waveTypes[Math.floor(Math.random() * waveTypes.length)]);
    setWaveTypeY(waveTypes[Math.floor(Math.random() * waveTypes.length)]);
    
    // Random frequencies between 1 and 5
    setFrequencyX(Math.floor(Math.random() * 5) + 1);
    setFrequencyY(Math.floor(Math.random() * 5) + 1);
    
    // Random magnitudes between 0.5 and 1.5
    setMagnitudeX(Math.random() + 0.5);
    setMagnitudeY(Math.random() + 0.5);
    
    // Reset smoothing when changing wave types
    setSmoothingX(0);
    setSmoothingY(0);
  };

  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // On iOS to resume the audio context after creation
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        oscillatorXRef.current = audioContextRef.current.createOscillator();
        oscillatorYRef.current = audioContextRef.current.createOscillator();
        gainNodeXRef.current = audioContextRef.current.createGain();
        gainNodeYRef.current = audioContextRef.current.createGain();
        pannerXRef.current = audioContextRef.current.createStereoPanner();
        pannerYRef.current = audioContextRef.current.createStereoPanner();

        // Set up audio routing
        oscillatorXRef.current.connect(gainNodeXRef.current);
        gainNodeXRef.current.connect(pannerXRef.current);
        pannerXRef.current.connect(audioContextRef.current.destination);
        pannerXRef.current.pan.value = 1; // Right channel

        oscillatorYRef.current.connect(gainNodeYRef.current);
        gainNodeYRef.current.connect(pannerYRef.current);
        pannerYRef.current.connect(audioContextRef.current.destination);
        pannerYRef.current.pan.value = -1; // Left channel

        // Set initial frequencies
        oscillatorXRef.current.frequency.value = frequencyX * 100;
        oscillatorYRef.current.frequency.value = frequencyY * 100;

        // Set initial wave types
        oscillatorXRef.current.type = waveTypeX;
        oscillatorYRef.current.type = waveTypeY;

        // Set initial gain
        gainNodeXRef.current.gain.value = 0;
        gainNodeYRef.current.gain.value = 0;

        setAudioInitialized(true);
        setAudioError(null);
      }
    } catch (error) {
      console.error('Audio initialization error:', error);
      setAudioError('Unable to initialize audio. Please ensure you\'re using a supported browser and have granted audio permissions.');
    }
  };

  const toggleAudio = async () => {
    try {
      if (!audioInitialized) {
        await initializeAudio();
      }

      if (!audioContextRef.current) return;

      if (!isPlaying) {
        // Resume audio context if it's suspended (important for iOS)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Start oscillators
        oscillatorXRef.current.start();
        oscillatorYRef.current.start();
        gainNodeXRef.current.gain.value = 0.1;
        gainNodeYRef.current.gain.value = 0.1;
      } else {
        // Stop oscillators
        gainNodeXRef.current.gain.value = 0;
        gainNodeYRef.current.gain.value = 0;
        oscillatorXRef.current.stop();
        oscillatorYRef.current.stop();

        // Create new oscillators for next play
        oscillatorXRef.current = audioContextRef.current.createOscillator();
        oscillatorYRef.current = audioContextRef.current.createOscillator();
        oscillatorXRef.current.connect(gainNodeXRef.current);
        oscillatorYRef.current.connect(gainNodeYRef.current);
        oscillatorXRef.current.frequency.value = frequencyX * 100;
        oscillatorYRef.current.frequency.value = frequencyY * 100;
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioError('Unable to play audio. Please ensure you\'re using a supported browser and have granted audio permissions.');
    }
  };

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
  };

  const drawCircle = (ctx, width, height) => {
    const baseScale = Math.min(width, height) / 4;
    const centerXPos = width / 2 + centerX * (width / 4);
    const centerYPos = height / 2 + centerY * (height / 4);

    // Helper function to get wave value based on type
    const getWaveValue = (t, type, smoothing = 0) => {
      switch (type) {
        case 'sine':
          return Math.sin(t);
        case 'triangle':
          const triangle = 2 * Math.abs(2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5))) - 1;
          if (smoothing > 0) {
            const smoothed = Math.sin(t) * smoothing + triangle * (1 - smoothing);
            return smoothed;
          }
          return triangle;
        case 'sawtooth':
          const saw = 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
          if (smoothing > 0) {
            const smoothed = Math.sin(t) * smoothing + saw * (1 - smoothing);
            return smoothed;
          }
          return saw;
        case 'square':
          return Math.sign(Math.sin(t));
        default:
          return Math.sin(t);
      }
    };

    // Draw the horizontal component wave (Y signal)
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    let lastY = 0;
    for (let x = 0; x < width; x++) {
      const t = (x / width) * Math.PI * 2 + time * frequencyY;
      const y = centerYPos + baseScale * magnitudeY * getWaveValue(t + rotation, waveTypeY, smoothingY);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      lastY = y;
    }
    ctx.stroke();

    // Draw the vertical component wave (X signal)
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    let lastX = 0;
    for (let y = 0; y < height; y++) {
      const t = (y / height) * Math.PI * 2 + time * frequencyX;
      const x = centerXPos + baseScale * magnitudeX * getWaveValue(t + rotation + phase, waveTypeX, smoothingX);
      
      if (y === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      lastX = x;
    }
    ctx.stroke();

    // Calculate the dot position at the intersection of the tracing lines
    const dotX = lastX;
    const dotY = lastY;

    // Draw tracing lines using lastX and lastY from signals
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical tracing line (follows X signal)
    ctx.beginPath();
    ctx.moveTo(lastX, 0);
    ctx.lineTo(lastX, height);
    ctx.stroke();

    // Horizontal tracing line (follows Y signal)
    ctx.beginPath();
    ctx.moveTo(0, lastY);
    ctx.lineTo(width, lastY);
    ctx.stroke();

    // Reset line style
    ctx.setLineDash([]);

    // Draw the Lissajous curve
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      const x = centerXPos + baseScale * magnitudeX * getWaveValue(frequencyX * t + rotation + phase, waveTypeX, smoothingX);
      const y = centerYPos + baseScale * magnitudeY * getWaveValue(frequencyY * t + rotation, waveTypeY, smoothingY);
      
      if (t === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw the current point at the intersection
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
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
    
    // Draw circle
    drawCircle(ctx, width, height);
  };

  // Animation effect
  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 0.02);
      }, 16); // ~60fps
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnimating]);

  // Animation effect for rotation
  useEffect(() => {
    let animationFrame;
    let lastTime = 0;
    const rotationSpeed = 0.5; // Adjust this value to change rotation speed

    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      if (isRotating) {
        setRotation(prevRotation => {
          const newRotation = prevRotation + rotationSpeed * deltaTime;
          return newRotation % (Math.PI * 2); // Keep rotation between 0 and 2pi
        });
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isRotating) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRotating]);

  // Add this effect for phase rotation
  useEffect(() => {
    let animationFrame;
    let lastTime = 0;
    const phaseSpeed = 0.5; // Adjust this value to change phase rotation speed

    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      if (isPhaseRotating) {
        setPhase(prevPhase => {
          const newPhase = prevPhase + phaseSpeed * deltaTime;
          return newPhase % (Math.PI * 2); // Keep phase between 0 and 2pi
        });
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPhaseRotating) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPhaseRotating]);

  // Redraw effect
  useEffect(() => {
    drawCanvas();
  }, [time, width, height, frequencyX, frequencyY, magnitudeX, magnitudeY, rotation, centerX, centerY]);

  // Update oscillator frequencies and gains when they change
  useEffect(() => {
    if (oscillatorXRef.current && oscillatorYRef.current) {
      oscillatorXRef.current.frequency.value = frequencyX * 100;
      oscillatorYRef.current.frequency.value = frequencyY * 100;
      gainNodeXRef.current.gain.value = isPlaying ? magnitudeX * 0.1 : 0;
      gainNodeYRef.current.gain.value = isPlaying ? magnitudeY * 0.1 : 0;
    }
  }, [frequencyX, frequencyY, magnitudeX, magnitudeY, isPlaying]);

  // Demo effect
  useEffect(() => {
    let demoInterval;
    let currentPattern = 0;

    if (isDemoPlaying) {
      demoInterval = setInterval(() => {
        if (currentPattern >= demoPatterns.length) {
          setIsDemoPlaying(false);
          setFrequencyX(3);
          setFrequencyY(2);
          return;
        }
        setFrequencyX(demoPatterns[currentPattern].x);
        setFrequencyY(demoPatterns[currentPattern].y);
        currentPattern++;
      }, 2000);
    }

    return () => {
      if (demoInterval) clearInterval(demoInterval);
    };
  }, [isDemoPlaying]);

  // Song effect
  useEffect(() => {
    let songInterval;
    let currentNote = 0;

    if (isSongPlaying) {
      songInterval = setInterval(() => {
        if (currentNote >= maryNotes.length) {
          setIsSongPlaying(false);
          setFrequencyX(3);
          setFrequencyY(2);
          setMagnitudeX(1);
          setMagnitudeY(1);
          return;
        }
        setFrequencyX(maryNotes[currentNote].x);
        setFrequencyY(maryNotes[currentNote].y);
        if (maryNotes[currentNote].pause) {
          setMagnitudeX(0.01);
          setMagnitudeY(0.01);
        } else {
          setMagnitudeX(1);
          setMagnitudeY(1);
        }
        currentNote++;
      }, 300);
    }

    return () => {
      if (songInterval) clearInterval(songInterval);
    };
  }, [isSongPlaying]);

  // Magnitude transition demo
  useEffect(() => {
    let magnitudeInterval;
    let startTime;
    const duration = 20000; // 10 seconds for full transition (doubled from 5)
    const pauseDuration = 4000; // 2 seconds pause at extremes and 1:1 ratio (doubled from 1)

    if (isMagnitudeDemoPlaying) {
      startTime = Date.now();
      magnitudeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const cycleTime = duration + pauseDuration * 3; // Total time for one complete cycle (including pauses)
        const cycleProgress = (elapsed / cycleTime) % 1;
        
        let progress;
        if (cycleProgress < 0.2) {
          // First part: 0 to 1
          progress = cycleProgress * 5;
        } else if (cycleProgress < 0.3) {
          // First pause at 1,0
          progress = 1;
        } else if (cycleProgress < 0.5) {
          // Second part: 1 to 0.5
          progress = 1 - ((cycleProgress - 0.3) * 2.5);
        } else if (cycleProgress < 0.6) {
          // Pause at 0.5,0.5 (1:1 ratio)
          progress = 0.5;
        } else if (cycleProgress < 0.8) {
          // Third part: 0.5 to 0
          progress = 0.5 - ((cycleProgress - 0.6) * 2.5);
        } else {
          // Final pause at 0,1
          progress = 0;
        }
        
        // X goes from 0 to 1 and back, Y goes from 1 to 0 and back
        setMagnitudeX(progress);
        setMagnitudeY(1 - progress);
      }, 16); // ~60fps for smooth animation
    }

    return () => {
      if (magnitudeInterval) clearInterval(magnitudeInterval);
    };
  }, [isMagnitudeDemoPlaying]);

  const toggleDemo = () => {
    setIsDemoPlaying(!isDemoPlaying);
    setIsAnimating(!isDemoPlaying);
    if (isSongPlaying) setIsSongPlaying(false);
  };

  const toggleSong = () => {
    setIsSongPlaying(!isSongPlaying);
    setIsAnimating(!isSongPlaying);
    if (isDemoPlaying) setIsDemoPlaying(false);
    if (isMagnitudeDemoPlaying) setIsMagnitudeDemoPlaying(false);
  };

  const toggleMagnitudeDemo = () => {
    if (!isMagnitudeDemoPlaying) {
      setFrequencyX(3);
      setFrequencyY(3);
    }
    setIsMagnitudeDemoPlaying(!isMagnitudeDemoPlaying);
    setIsAnimating(!isMagnitudeDemoPlaying);
    if (isSongPlaying) setIsSongPlaying(false);
    if (isDemoPlaying) setIsDemoPlaying(false);
  };

  return (
    <div className="oscilloscope-display">
      <div className="canvas-container">
        <canvas ref={canvasRef} className="oscilloscope-canvas" />
        <button 
          onClick={() => setIsAnimating(!isAnimating)}
          className={`animation-control ${isAnimating ? 'active' : ''}`}
        >
          {isAnimating ? '◼' : '▶'}
        </button>
      </div>
      <div className="controls">
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Frequency X: {frequencyX} ({(frequencyX * 100).toFixed(2)}Hz)</label>
            <select
              value={waveTypeX}
              onChange={(e) => setWaveTypeX(e.target.value)}
              className="wave-select"
            >
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="square">Square</option>
            </select>
            {(waveTypeX === 'triangle' || waveTypeX === 'sawtooth') && (
              <div className="smoothing-control">
                <label style={{ minWidth: '150px' }}>Smooth: {(smoothingX * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={smoothingX}
                  onChange={(e) => setSmoothingX(parseFloat(e.target.value))}
                  className="smoothing-slider"
                />
              </div>
            )}
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={Math.round(frequencyX)}
            onChange={(e) => setFrequencyX(parseInt(e.target.value))}
            disabled={isSongPlaying}
            className="control-slider"
          />
        </div>
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Frequency Y: {frequencyY} ({(frequencyY * 100).toFixed(2)}Hz)</label>
            <select
              value={waveTypeY}
              onChange={(e) => setWaveTypeY(e.target.value)}
              className="wave-select"
            >
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="square">Square</option>
            </select>
            {(waveTypeY === 'triangle' || waveTypeY === 'sawtooth') && (
              <div className="smoothing-control">
                <label style={{ minWidth: '150px' }}>Smooth: {(smoothingY * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={smoothingY}
                  onChange={(e) => setSmoothingY(parseFloat(e.target.value))}
                  className="smoothing-slider"
                />
              </div>
            )}
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={Math.round(frequencyY)}
            onChange={(e) => setFrequencyY(parseInt(e.target.value))}
            disabled={isSongPlaying}
            className="control-slider"
          />
        </div>
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Magnitude X: {magnitudeX.toFixed(2)}</label>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={magnitudeX}
            onChange={(e) => setMagnitudeX(parseFloat(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Magnitude Y: {magnitudeY.toFixed(2)}</label>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={magnitudeY}
            onChange={(e) => setMagnitudeY(parseFloat(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Rotation: {(rotation * 180 / Math.PI).toFixed(0)}°</label>
            <button 
              onClick={() => setIsRotating(!isRotating)}
              className={`control-button ${isRotating ? 'active' : ''}`}
            >
              {isRotating ? '◼' : '▶'}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation * 180 / Math.PI}
            onChange={(e) => setRotation(parseFloat(e.target.value) * Math.PI / 180)}
            className="control-slider"
          />
        </div>
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Phase: {(phase * 180 / Math.PI).toFixed(0)}°</label>
            <button 
              onClick={() => setIsPhaseRotating(!isPhaseRotating)}
              className={`control-button ${isPhaseRotating ? 'active' : ''}`}
            >
              {isPhaseRotating ? '◼' : '▶'}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={phase * 180 / Math.PI}
            onChange={(e) => setPhase(parseFloat(e.target.value) * Math.PI / 180)}
            className="control-slider"
          />
        </div>
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Center X: {centerX.toFixed(2)}</label>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={centerX}
            onChange={(e) => setCenterX(parseFloat(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="control-group">
          <div className="control-row">
            <label className="control-label">Center Y: {centerY.toFixed(2)}</label>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={centerY}
            onChange={(e) => setCenterY(parseFloat(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="button-group">
          <button 
            onClick={toggleAudio}
            className={`control-button ${isPlaying ? 'active' : ''}`}
          >
            {isPlaying ? 'Stop Audio' : 'Play Audio'}
          </button>
          {audioError && (
            <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
              {audioError}
            </div>
          )}
          <button 
            onClick={toggleDemo}
            className={`control-button ${isDemoPlaying ? 'active' : ''}`}
          >
            {isDemoPlaying ? 'Stop Demo' : 'Play Demo'}
          </button>
          <button 
            onClick={toggleSong}
            className={`control-button ${isSongPlaying ? 'active' : ''}`}
          >
            {isSongPlaying ? 'Stop Song' : 'Play Song'}
          </button>
          <button 
            onClick={toggleMagnitudeDemo}
            className={`control-button ${isMagnitudeDemoPlaying ? 'active' : ''}`}
          >
            {isMagnitudeDemoPlaying ? 'Stop Panning' : 'Start Panning'}
          </button>
          <button 
            onClick={randomizeWaves}
            className="control-button"
          >
            Randomize
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircleDisplay; 