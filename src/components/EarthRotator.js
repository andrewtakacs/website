import { useState, useEffect } from 'react';

const EarthRotator = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [earthContent, setEarthContent] = useState('');
  const [stars, setStars] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [earthFrames, setEarthFrames] = useState([]);
  const [framesLoaded, setFramesLoaded] = useState(false);

  // Generate random stars
  useEffect(() => {
    const generateStars = () => {
      const starCount = 150;
      const symbols = ['*', '.'];
      
      const newStars = Array.from({ length: starCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2
      }));
      
      setStars(newStars);
    };

    generateStars();
  }, []);

  // Parallax scroll effect and visibility detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const earthSection = document.querySelector('.earthRotator');
      
      if (earthSection) {
        const rect = earthSection.getBoundingClientRect();
        // More generous visibility detection - show when any part is visible
        const isInView = rect.bottom > -100 && rect.top < windowHeight + 100;
        setIsVisible(isInView);
      }
      
      setScrollY(scrollY);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload all earth frames at once
  useEffect(() => {
    const loadAllFrames = async () => {
      try {
        const framePromises = [];
        for (let i = 1; i <= 12; i++) {
          framePromises.push(
            fetch(`/earthframes/earth${i}.txt`)
              .then(response => response.text())
              .catch(error => {
                console.error(`Failed to load earth frame ${i}:`, error);
                return ''; // Return empty string for failed frames
              })
          );
        }
        
        const frames = await Promise.all(framePromises);
        setEarthFrames(frames);
        setFramesLoaded(true);
        setEarthContent(frames[0]); // Set initial frame
      } catch (error) {
        console.error('Failed to load earth frames:', error);
      }
    };
    
    loadAllFrames();
  }, []);

  // Rotate through frames - only when visible and frames are loaded
  useEffect(() => {
    if (!isVisible || !framesLoaded || earthFrames.length === 0) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        const nextFrame = prev >= 12 ? 1 : prev + 1;
        setEarthContent(earthFrames[nextFrame - 1] || '');
        return nextFrame;
      });
    }, 2000); // Change frame every 2 seconds

    return () => clearInterval(interval);
  }, [isVisible, framesLoaded, earthFrames]);

  // Cleanup effect to stop all animations when component unmounts
  useEffect(() => {
    return () => {
      // This will run when component unmounts
      setCurrentFrame(1);
      setEarthContent('');
      setEarthFrames([]);
      setFramesLoaded(false);
    };
  }, []);

  return (
    <section className="earthRotator" aria-label="Rotating ASCII Earth">
      <div className="earthContainer">
        {/* Stars with parallax effect - only render when visible */}
        {isVisible && stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y + (scrollY * star.speed * 0.1)}%`,
              fontSize: `${star.size}em`,
              opacity: star.opacity,
              transform: `translateY(${scrollY * star.speed * -0.1}px)`
            }}
          >
            {star.symbol}
          </div>
        ))}
        
        {/* Earth with circular background - only render when visible */}
        {isVisible && (
          <div className="earthWrapper">
            <div className="earthBackground"></div>
            <pre className="earthAscii">{earthContent}</pre>
          </div>
        )}
      </div>
      
      <style>{`
        .earthRotator {
          position: relative;
          min-height: 88vh;
          border-bottom: 1px solid var(--color-border);
          overflow: hidden;
          background: var(--color-background);
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .earthContainer {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: var(--space-8) 0;
          overflow: hidden;
          min-height: 800px;
        }

        .star {
          position: absolute;
          color: var(--color-text-primary);
          font-family: 'Courier New', monospace;
          font-weight: bold;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          transition: transform 0.1s ease-out;
        }

        .earthWrapper {
          position: relative;
          display: inline-block;
          z-index: 2;
          width: 100%;
          max-width: 800px;
          height: 700px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .earthBackground {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          aspect-ratio: 1;
          background: var(--color-background);
          border-radius: 50%;
          z-index: 1;
        }

        .earthAscii {
          font-family: 'Courier New', monospace;
          font-size: clamp(6px, 0.8vw, 10px);
          font-weight: bold;
          line-height: 1;
          color: var(--color-text-primary);
          opacity: 0.8;
          white-space: pre;
          text-align: center;
          margin: 0;
          user-select: none;
          transition: opacity 0.3s ease-in-out;
          position: relative;
          z-index: 3;
          max-width: 100%;
          max-height: 100%;
          overflow: hidden;
          object-fit: contain;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .earthWrapper {
            height: 500px;
            max-width: 100%;
          }
          
          .earthBackground {
            width: 95%;
          }
          
          .earthAscii {
            font-size: clamp(4px, 1.5vw, 8px);
            line-height: 1.1;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .earthWrapper {
            height: 550px;
          }
          
          .earthBackground {
            width: 80%;
          }
          
          .earthAscii {
            font-size: clamp(5px, 1.2vw, 9px);
            line-height: 1.05;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .earthWrapper {
            height: 600px;
          }
          
          .earthAscii {
            font-size: clamp(6px, 1vw, 10px);
          }
        }

        @media (min-width: 1025px) {
          .earthAscii {
            font-size: clamp(7px, 0.8vw, 12px);
          }
        }
      `}</style>
    </section>
  );
};

export default EarthRotator;
