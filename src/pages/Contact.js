import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Obfuscate email address
    const obfuscateEmail = () => {
      const parts = ['atakac', '@', 'uw', '.', 'edu'];
      const obfuscated = parts.map(part => {
        return part.split('').map(char => {
          return `&#${char.charCodeAt(0)};`;
        }).join('');
      }).join('');
      setEmail(obfuscated);
    };

    obfuscateEmail();
  }, []);

  const handleEmailClick = (e) => {
    e.preventDefault();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000); // Hide after 2 seconds
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Me</h1>
      </div>
      <div className="contact-content">
        <div className="contact-section">
          <div className="contact-text">
            <div className="contact-details">
              <div className="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className="email-container">
                  <span 
                    className="obfuscated-email"
                    dangerouslySetInnerHTML={{ __html: email }}
                    onClick={handleEmailClick}
                  />
                  {showTooltip && (
                    <div className="email-tooltip">
                      Hidden to protect from spam
                    </div>
                  )}
                </div>
              </div>
              
              <div className="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <a href="https://github.com/andrewtakacs" target="_blank" rel="noopener noreferrer">github.com/andrewtakacs</a>
              </div>
              
              <div className="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <a href="https://www.linkedin.com/in/takacsandrew/" target="_blank" rel="noopener noreferrer">linkedin.com/in/takacsandrew</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 