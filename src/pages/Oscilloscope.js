import React from 'react';
import './Oscilloscope.css';

const Oscilloscope = () => {
  return (
    <div className="oscilloscope-page">
      <section className="oscilloscope-hero">
        <h1 className="section-title">Oscilloscope Project</h1>
      </section>

      <div className="oscilloscope-content">
        <section className="oscilloscope-section">
          <h2>Overview</h2>
          <div className="oscilloscope-text">
            <h3>What is an Oscilloscope?</h3>
            <p>
              An oscilloscope is a device that displays electrical signals. It is a type of electronic instrument that displays voltage as a function of time.
              I like to use the oscilloscope to display two signals on the same screen in real time to make unique art, Lissajous curves and more!
            </p>
          </div>
        </section>

        <section className="oscilloscope-section">
          <h3>Technical Implementation</h3>
          <div className="oscilloscope-text">
            <p>
              Some skills that I used to create this project were:
            </p>
            <ul>
              <li>Knowledge of oscilloscopes and how they work</li>
                <li>Signal processing and algorithms using JavaScript</li>
                <li>Interactive visualization controls using React, HTML, and CSS</li>
                <li>Optimized performance for real-time display</li>
            </ul>
            <p>
              This is arguably the best oscilloscope code run on a website!
            </p>
            <p>
              <strong>Try it out for yourself by clicking the button below!</strong>
            </p>
            <p>
              Under construction. Please check back soon for the link!
            </p>
    
          </div>
        </section>
      </div>
    </div>
  );
};

export default Oscilloscope; 