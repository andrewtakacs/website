import React from 'react';
import './Certificates.css';
import { SecurityHeaders } from '../utils/security';

const Certificates = () => {
  return (
    <div className="certificates-page">
      <SecurityHeaders title="Certificates | Andrew Takacs" description="Professional certifications and credentials earned by Andrew Takacs." />
      <div className="certificates-container">
        <div className="certificate-card">
          <img src={`${process.env.PUBLIC_URL}/images/Certificate_1.jpg`} alt="Certificate 1" />
        </div>
        <div className="certificate-card">
          <img src={`${process.env.PUBLIC_URL}/images/Certificate_2.jpg`} alt="Certificate 2" />
        </div>
      </div>
    </div>
  );
};

export default Certificates; 