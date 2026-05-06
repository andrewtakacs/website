import React from 'react';
import './Research.css';
import { SecurityHeaders } from '../utils/security';

const Research = () => {
  return (
    <div className="research-page">
      <SecurityHeaders title="Research | Andrew Takacs" description="Graduate research at the University of Washington focused on rotational detonation engines and advanced propulsion systems." />
      <div className="research-hero">
        <div className="hero-content">
          <h1>Research</h1>
        </div>
      </div>
      
      <div className="research-content">
        <div className="construction-message">
          <h2>Page Under Construction</h2>
          <p>Please check back soon for updates on my research work.</p>
        </div>
      </div>
    </div>
  );
};

export default Research; 