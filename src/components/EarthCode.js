import React, { useState, useEffect } from "react";
import "./EarthStyle.css";

const EarthCode = () => {
  const [earthFrames, setEarthFrames] = useState([]); // Array to store ASCII frames
  const [currentFrame, setCurrentFrame] = useState(0); // Current frame index
  const [scrollPosition, setScrollPosition] = useState(0); // Scroll position
  const [baseFrame, setBaseFrame] = useState(0); // Base frame for continuous rotation

  // Load ASCII art frames from the files in the earth_frames folder
  useEffect(() => {
    const loadFrames = async () => {
      const totalFrames = 12; // Number of frames I have of earth
      const frames = [];
      
      // Loop through the frames and load them
      for (let i = 1; i <= totalFrames; i++) {
        const response = await fetch(`/earthframes/earth${i}.txt`);
        const text = await response.text();
        frames.push(text);
      }

      setEarthFrames(frames); // Set loaded frames into state
    };

    loadFrames();
  }, []); // Only run once on component mount

  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Continuous rotation with variable speed based on scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setBaseFrame(prevFrame => (prevFrame + 1) % earthFrames.length);
    }, 1000); // Base speed of 1 frame per second

    return () => clearInterval(interval);
  }, [earthFrames.length]);

  // Calculate the final frame index combining base rotation and scroll effect
  const scrollEffect = Math.floor(scrollPosition / 30);
  const frameIndex = (baseFrame + scrollEffect) % earthFrames.length;

  // Update current frame when frame index changes
  useEffect(() => {
    setCurrentFrame(frameIndex);
  }, [frameIndex]);

  return (
    <div className="earth-container">
      <div className="earth">
        {earthFrames[currentFrame]}
      </div>
    </div>
  );
};

export default EarthCode; 