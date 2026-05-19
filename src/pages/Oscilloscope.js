import { useRef, useState, useEffect } from 'react';
import './Oscilloscope.css';
import { OscilloscopeDisplay } from '../components/OscilloscopeDisplay';
import Footer from '../components/Footer';
import AnalogVsDigitalDisplay from '../components/AnalogVsDigitalDisplay';
import XYModeDisplay from '../components/XYModeDisplay';
import HeartDisplay from '../components/HeartDisplay';
import CircleDisplay from '../components/CircleDisplay';

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

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="inner-page oscilloscope-page">
      <section className="oscilloscope-hero">
        <h1 className="section-title">Oscilloscope Project</h1>
      </section>

      <hr className="rule" />

      <div className="oscilloscope-content">
        <section className="oscilloscope-section">
          <h2>About this Project</h2>
          <div className="oscilloscope-text">
            <p>
              Welcome to my oscilloscope project! This project shows how I create visuals on an oscilloscope. Try it below!
            </p>
          </div>
          <div className="oscilloscope-display" ref={containerRef}>
            <CircleDisplay width={dimensions.width} height={dimensions.height} />
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
              Analog signals are continuous signals that vary smoothly over time. Digital signals are discrete signals that vary in steps. When you stream music on something like a phone, the signal is digital. Standard music is sampled at 44.1kHz which is 44,100 times per second. When you play a vinyl record, the signal is analog (no jumps just smooth). Below is an example of an analog signal vs a digital signal.
            </p>
            <div className="oscilloscope-display" ref={containerRef}>
              <AnalogVsDigitalDisplay width={dimensions.width} height={dimensions.height} />
            </div>

            <h3>Why an Old Oscilloscope?</h3>
            <p>
            To make art on an oscilloscope, it's actually better to use an older model rather than a modern one. That might sound counterintuitive, but older oscilloscopes use CRT (cathode ray tube) displays, essentially old school TV technology. This allows the screen to draw lines directly from point to point, unlike modern digital scopes that light up individual pixels. As a result, you get a true vector display capable of producing smooth curves and fluid shapes, without being limited by a fixed resolution or pixel grid. Plus, I picked mine up for just $40 (photo below), while new digital oscilloscopes can cost anywhere from several hundred to thousands of dollars.
            </p>
            <img
              src={`${process.env.PUBLIC_URL}/images/oscilloscope.jpg`}
              alt="My oscilloscope"
              style={{ width: '100%', maxWidth: '640px', display: 'block', margin: '16px auto', borderRadius: '6px' }}
            />
          </div>
          <h2>How drawing on it works...</h2>
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
          <h2>Stuff I Made</h2>
          <div className="oscilloscope-text">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { src: 'andrew_osc.gif', alt: 'Oscilloscope animation' },
                { src: 'wsu.gif',        alt: 'WSU oscilloscope art' },
                { src: 'uw.jpg',         alt: 'UW oscilloscope art' },
                { src: 'osc_demo.gif',   alt: 'Oscilloscope demo' },
              ].map(({ src, alt }) => (
                <div key={src} style={{ aspectRatio: '3/4', overflow: 'hidden', borderRadius: '6px', background: '#000' }}>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${src}`}
                    alt={alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
          <h2>See Also</h2>
          <div className="oscilloscope-text">
            <h3>Links</h3>
            <p>
              <br />
              <a href="https://www.youtube.com/watch?v=4gibcRfp4zA&t=2s" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>Inspiration - YouTube</a>
              <br />
              <a href="https://www.youtube.com/watch?v=r6sGWTCMz2k" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>Fourier Series - YouTube</a>
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Oscilloscope;
