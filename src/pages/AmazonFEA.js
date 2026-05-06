import React from 'react';
import './AmazonFEA.css';
import { SecurityHeaders } from '../utils/security';

const AmazonFEA = () => {
  return (
    <div className="amazon-fea-page">
      <SecurityHeaders title="Amazon Drone Bracket FEA | Andrew Takacs" description="Finite element analysis and topology optimization of an Amazon drone bracket to improve structural integrity while minimizing weight." />
      <section className="amazon-fea-hero">
        <h1 className="section-title">Amazon Drone Bracket FEA</h1>
      </section>

      <div className="amazon-fea-content">
        <section className="amazon-fea-section">
          <h2>Overview</h2>
          <div className="amazon-fea-text">
            <h3>Project Background</h3>
            <p>
              This project focused on performing finite element analysis and topology optimization 
              on an Amazon drone bracket. The analysis was conducted to improve the structural 
              integrity while minimizing weight.
            </p>
            <p>
             This page is under construction. Please check back soon!
        </p>
          </div>
        </section>
        
     

  
      </div>
    </div>
  );
};

export default AmazonFEA; 