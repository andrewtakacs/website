import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SecretPage.css';

function SecretPage() {
  const navigate = useNavigate();
  const [squarePosition, setSquarePosition] = useState({ x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 });
  const [isSquareDragging, setIsSquareDragging] = useState(false);
  const [circle, setCircle] = useState(null);
  const [isCircleDragging, setIsCircleDragging] = useState(false);
  const [isRecordVisible, setIsRecordVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isOnTurntable, setIsOnTurntable] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    // Check if the user has the correct session storage key
    const isAuthenticated = sessionStorage.getItem('secretAccess') === 'granted';
    if (!isAuthenticated) {
      navigate('/other');
    }
  }, [navigate]);

  const getRandomRecord = () => {
    const records = [
      { cover: 'dsotm.jpeg', vinyl: 'dsotm1.jpeg' },
      { cover: 'discovery.jpeg', vinyl: 'discovery1.jpeg' },
      { cover: 'berloiz.jpeg', vinyl: 'berloiz1.jpeg' },
      { cover: 'lowend.jpeg', vinyl: 'lowend1.jpeg' },
      { cover: 'dana.jpeg', vinyl: 'dana1.jpeg' },
      { cover: 'tainted.jpeg', vinyl: 'tainted1.jpeg' },
      { cover: 'idol.jpeg', vinyl: 'idol1.jpeg' },
      { cover: 'bubba.jpeg', vinyl: 'bubba1.jpeg' },
      { cover: 'ken.jpeg', vinyl: 'ken1.jpeg' },
      { cover: 'djq.jpeg', vinyl: 'djq1.jpeg' },
      { cover: 'coc.jpeg', vinyl: 'coc1.jpeg' },
      { cover: 'pump.jpeg', vinyl: 'pump1.jpeg' },
      { cover: 'sade.jpeg', vinyl: 'sade1.jpeg' }
    ];
    return records[Math.floor(Math.random() * records.length)];
  };

  const handleCrateTouch = () => {
    if (isRecordVisible) {
      setIsRecordVisible(false);
      setCircle(null);
      setIsSpinning(false);
    } else {
      const newRecord = getRandomRecord();
      setCurrentRecord(newRecord);
      setIsRecordVisible(true);
      setIsSpinning(false);
      setSquarePosition({
        x: 150,
        y: window.innerHeight / 2 - 50
      });
    }
  };

  const handleCrateDoubleClick = () => {
    if (isRecordVisible) {
      setIsRecordVisible(false);
      setCircle(null);
      setIsSpinning(false);
    } else {
      const newRecord = getRandomRecord();
      setCurrentRecord(newRecord);
      setIsRecordVisible(true);
      setIsSpinning(false);
      setSquarePosition({
        x: 150,
        y: window.innerHeight / 2 - 50
      });
    }
  };

  const handleSquareTouch = () => {
    if (!circle) {
      setCircle({
        id: 1,
        position: {
          x: squarePosition.x + 70,
          y: squarePosition.y
        }
      });
      setIsSpinning(false);
    } else {
      setCircle(null);
    }
  };

  const handleSquareDoubleClick = () => {
    if (!circle) {
      setCircle({
        id: 1,
        position: {
          x: squarePosition.x + 70,
          y: squarePosition.y
        }
      });
      setIsSpinning(false);
    } else {
      setCircle(null);
    }
  };

  const handleSquareMouseDown = () => {
    setIsSquareDragging(true);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    
    if (isSquareDragging) {
      setSquarePosition({
        x: clientX - 50,
        y: clientY - 50
      });
    } else if (isCircleDragging && circle) {
      setCircle({
        ...circle,
        position: {
          x: clientX - 50,
          y: clientY - 50
        }
      });
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    
    if (e.target.classList.contains('record-sleeve')) {
      setIsSquareDragging(true);
      setSquarePosition({
        x: clientX - 50,
        y: clientY - 50
      });
    } else if (e.target.classList.contains('vinyl')) {
      setIsCircleDragging(true);
      setCircle({
        ...circle,
        position: {
          x: clientX - 50,
          y: clientY - 50
        }
      });
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = getClientCoordinates(e);
    if (isSquareDragging) {
      setSquarePosition({
        x: clientX - 50,
        y: clientY - 50
      });
    } else if (isCircleDragging && circle) {
      setCircle({
        ...circle,
        position: {
          x: clientX - 50,
          y: clientY - 50
        }
      });
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsSquareDragging(false);
    setIsCircleDragging(false);
    
    // Check if vinyl is on any turntable
    if (circle) {
      const turntableElements = document.querySelectorAll('.music-image.turntable');
      const vinylRect = {
        left: circle.position.x,
        top: circle.position.y,
        right: circle.position.x + 100,
        bottom: circle.position.y + 100
      };

      // Check each turntable for collision
      for (const turntableElement of turntableElements) {
        const turntableRect = turntableElement.getBoundingClientRect();
        
        if (
          vinylRect.left < turntableRect.right &&
          vinylRect.right > turntableRect.left &&
          vinylRect.top < turntableRect.bottom &&
          vinylRect.bottom > turntableRect.top
        ) {
          // Position vinyl on turntable with offset
          setCircle({
            ...circle,
            position: {
              x: turntableRect.left + (turntableRect.width - 100) / 2 - 15,
              y: turntableRect.top + (turntableRect.height - 100) / 2 - 2
            }
          });
          setIsOnTurntable(true);
          setIsSpinning(true);
          break; // Stop checking other turntables once we find a match
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsSquareDragging(false);
    setIsCircleDragging(false);
    
    // Check if vinyl is on any turntable
    if (circle) {
      const turntableElements = document.querySelectorAll('.music-image.turntable');
      const vinylRect = {
        left: circle.position.x,
        top: circle.position.y,
        right: circle.position.x + 100,
        bottom: circle.position.y + 100
      };

      // Check each turntable for collision
      for (const turntableElement of turntableElements) {
        const turntableRect = turntableElement.getBoundingClientRect();
        
        if (
          vinylRect.left < turntableRect.right &&
          vinylRect.right > turntableRect.left &&
          vinylRect.top < turntableRect.bottom &&
          vinylRect.bottom > turntableRect.top
        ) {
          // Position vinyl on turntable with offset
          setCircle({
            ...circle,
            position: {
              x: turntableRect.left + (turntableRect.width - 100) / 2 - 15,
              y: turntableRect.top + (turntableRect.height - 100) / 2 - 2
            }
          });
          setIsOnTurntable(true);
          setIsSpinning(true);
          break; // Stop checking other turntables once we find a match
        }
      }
    }
  };

  const handleCircleTouch = (e) => {
    e.stopPropagation();
    // Only allow double-tap to remove record on mobile
    if (e.touches && e.touches.length > 1) {
      setCircle(null);
      return;
    }
    // Allow single touch to start dragging
    setIsCircleDragging(true);
    setIsOnTurntable(false);
    setIsSpinning(false);
  };

  const handleCircleMouseDown = (e) => {
    e.stopPropagation();
    setIsCircleDragging(true);
    setIsOnTurntable(false);
    setIsSpinning(false);
  };

  const handleCircleDoubleClick = (e) => {
    e.stopPropagation();
    setCircle(null);
    setIsSpinning(false);
  };

  const getClientCoordinates = (e) => {
    if (e.touches) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      };
    }
    return {
      clientX: e.clientX,
      clientY: e.clientY
    };
  };

  // Animation effect for spinning vinyl
  useEffect(() => {
    let animationFrameId;
    if (isSpinning) {
      const animate = () => {
        setRotationAngle(prevAngle => (prevAngle + 1) % 360);
        animationFrameId = requestAnimationFrame(animate);
      };
      animationFrameId = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isSpinning]);

  // Add resize event listener to update vinyl position
  useEffect(() => {
    const handleResize = () => {
      if (isOnTurntable && circle) {
        const turntableElements = document.querySelectorAll('.music-image.turntable');
        for (const turntableElement of turntableElements) {
          const turntableRect = turntableElement.getBoundingClientRect();
          const vinylRect = {
            left: circle.position.x,
            top: circle.position.y,
            right: circle.position.x + 100,
            bottom: circle.position.y + 100
          };
          
          if (
            vinylRect.left < turntableRect.right &&
            vinylRect.right > turntableRect.left &&
            vinylRect.top < turntableRect.bottom &&
            vinylRect.bottom > turntableRect.top
          ) {
            setCircle({
              ...circle,
              position: {
                x: turntableRect.left + (turntableRect.width - 100) / 2 - 15,
                y: turntableRect.top + (turntableRect.height - 100) / 2 - 2
              }
            });
            break;
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOnTurntable, circle]);

  return (
    <div 
      className="secret-page-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >

      <h1 className="welcome-heading">hello!</h1>
      <h2 className="secret-page-title">
        drag and drop a record to the turntable to play it
      </h2>
      
      <div className="music-images">
        <img src="/images/music/atoff.png" alt="Music" className="music-image turntable" />
        <img src="/images/music/djm.png" alt="Music" className="music-image" />
        <img src="/images/music/atoff.png" alt="Music" className="music-image turntable" />
      </div>
      
      <div 
        className="record-crate"
        onTouchStart={handleCrateTouch}
        onDoubleClick={handleCrateDoubleClick}
      />
      
      {isRecordVisible && currentRecord && (
        <>
          <div
            className="square record-sleeve"
            style={{
              left: `${squarePosition.x}px`,
              top: `${squarePosition.y}px`,
              cursor: isSquareDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              backgroundImage: `url(/images/records/cover/${currentRecord.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onMouseDown={handleSquareMouseDown}
            onTouchStart={handleSquareTouch}
            onDoubleClick={handleSquareDoubleClick}
          />
          {circle && (
            <div 
              className="circle vinyl"
              style={{
                left: `${circle.position.x}px`,
                top: `${circle.position.y}px`,
                cursor: isCircleDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                backgroundImage: `url(/images/records/vinyl/${currentRecord.vinyl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '--vinyl-transform': isSpinning ? `rotate(${rotationAngle}deg)` : 'none',
                transition: isSpinning ? 'none' : 'transform 0.3s ease'
              }}
              onMouseDown={handleCircleMouseDown}
              onTouchStart={handleCircleTouch}
              onDoubleClick={handleCircleDoubleClick}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SecretPage; 