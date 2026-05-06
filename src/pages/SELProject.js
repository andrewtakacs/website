import React from 'react';
import './SELProject.css';
import { SecurityHeaders } from '../utils/security';

const SELProject = () => {
  return (
    <div className="sel-page">
      <SecurityHeaders title="SEL Manufacturing Improvement | Andrew Takacs" description="Manufacturing process improvement project completed for Schweitzer Engineering Laboratories." />
      <section className="sel-hero">
        <h1 className="section-title">SEL Manufacturing Improvement Project</h1>
      </section>

      <div className="sel-content">
        <section className="sel-section">
          <h2>Overview</h2>
          <div className="sel-text">
            <h3>Project Background</h3>
            <p>
              This page is under construction. Please check back soon!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SELProject; 