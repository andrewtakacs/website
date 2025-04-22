import React, { useRef, useState } from 'react';
import './Oscilloscope.css';
import { OscilloscopeDisplay } from '../components/OscilloscopeDisplay';
import AnalogVsDigitalDisplay from '../components/AnalogVsDigitalDisplay';
import XYModeDisplay from '../components/XYModeDisplay';
import HeartDisplay from '../components/HeartDisplay';

const Oscilloscope = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const updateDimensions = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const width = Math.min(containerWidth, 800);
      const height = width / 2;
      setDimensions({ width, height });
    }
  };

  React.useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="oscilloscope-page">
      <section className="oscilloscope-hero">
        <h1 className="section-title">Oscilloscope Project</h1>
      </section>

      <div className="oscilloscope-content">
        <section className="oscilloscope-section">
          <h2>About this Project</h2>
          <div className="oscilloscope-text">
            <p>
              Welcome to my oscilloscope project! This project shows how I create visuals on an oscilloscope.
            </p>
          </div>
          <h2>Gallery</h2>
          <div className="oscilloscope-text">
            <h3>Animations</h3>
            <h3>Logos</h3>
            <h3> Lissajous Figures</h3>
            <h3>Other</h3>
          </div>
          <h2>Details</h2>
          <div className="oscilloscope-text">
            <h3>What is an Oscilloscope?</h3>
            <p>
              For those who are unfamiliar with what an oscilloscope is, it is a device that displays electrical signals. It displays voltage as a function of time. Below is an AC and DC voltage signal, the AC signal oscillates while the DC signal is constant.
            </p>
            <div className="oscilloscope-display" ref={containerRef}>
              <OscilloscopeDisplay width={dimensions.width} height={dimensions.height} />
            </div>
            <h3>Analog vs Digital</h3>
            <p>
              Analog signals are continuous signals that vary smoothly over time. Digital signals are discrete signals that vary in steps. When you stream music on something like a phone, the signal is digital. Standard music is sampled at 44.1kHz which is 44,100 times per second. When you play a vinyl record, the signal is analog and smooth. Below is an example of an analog signal and a digital signal.
            </p>
            <div className="oscilloscope-display" ref={containerRef}>
              <AnalogVsDigitalDisplay width={dimensions.width} height={dimensions.height} />
            </div>

            <h3>Why an Old Oscilloscope?</h3>
            <p>
            To make art on an oscilloscope, it's actually better to use an older model rather than a modern one. That might sound counterintuitive, but older oscilloscopes use CRT (cathode ray tube) displays, essentially old school TV technology. This allows the screen to draw lines directly from point to point, unlike modern digital scopes that light up individual pixels. As a result, you get a true vector display capable of producing smooth curves and fluid shapes, without being limited by a fixed resolution or pixel grid. Plus, I picked mine up for just $40, while new digital oscilloscopes can cost anywhere from several hundred to thousands of dollars.
            </p>
          </div>
          <h2>How it works...</h2>
          <div className="oscilloscope-text">
            <h3>XY Mode</h3>
            <p>
            When an oscilloscope is in XY mode, it displays two signals, one on the X axis and one on the Y axis. The oscilloscope is like an etch-a-sketch, where both knobs control the position. This allows for any shape to be drawn! Here are some basic examples, notice how the main shape is derived from two signals. To determine the input signals, we can use a Fourier Series.
            </p>
            <div className="oscilloscope-display" ref={containerRef}>
              <XYModeDisplay width={dimensions.width} height={dimensions.height} />
            </div>
            <br/>
            <div className="oscilloscope-display" ref={containerRef}>
              <HeartDisplay width={dimensions.width} height={dimensions.height} />
            </div>


          </div>
          <h2>See Also</h2>
          <div className="oscilloscope-text">
            <h3>Links</h3>
            <p>
              <a href="https://github.com/andrewtakacs/Oscilloscope" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>Oscilloscope Code - GitHub</a>
              <br />
              <a href="https://www.youtube.com/watch?v=4gibcRfp4zA&t=2s" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>Oscilloscope Basics - YouTube</a>
              <br />
              <a href="https://www.youtube.com/watch?v=r6sGWTCMz2k" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>Fourier Series - YouTube</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Oscilloscope; 