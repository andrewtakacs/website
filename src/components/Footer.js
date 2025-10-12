import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const checkIfBottom = () => {
    // Check if the user has scrolled to the bottom of the page
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.innerHeight + window.scrollY;
    if (scrollHeight - scrollPosition <= 1) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkIfBottom);
    // Cleanup the event listener on unmount
    return () => window.removeEventListener('scroll', checkIfBottom);
  }, []);

  useEffect(() => {
    // Add the class to the body when on the Space page
    document.body.classList.add('space-page');

    // Cleanup when leaving the Space page
    return () => {
      document.body.classList.remove('space-page');
    };
  }, []); // Empty array ensures this runs only once when component mounts

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scroll smooth
    });
  };

  return (
    <div className={`footer ${isAtBottom ? 'footer-show' : ''}`}>
      {/* LinkedIn Icon */}
      <a href="https://www.linkedin.com/in/takacsandrew/" target="_blank" rel="noopener noreferrer" className="footer-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </a>

      {/* YouTube Icon */}
      <a href="https://www.youtube.com/@andrewtakacs9957" target="_blank" rel="noopener noreferrer" className="footer-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      </a>

      {/* Email Icon */}
      <a href="mailto:atakac@uw.edu" target="_blank" rel="noopener noreferrer" className="footer-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polygon points="4,4 20,4 22,6 12,13 2,6" />
        </svg>
      </a>

      {/* GitHub Icon */}
      <a href="https://github.com/andrewtakacs" target="_blank" rel="noopener noreferrer" className="footer-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </a>

      {/* Scroll to Top Icon */}
      <a href="#" onClick={scrollToTop} className="footer-icon">
        <div className="footer-icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </div>
      </a>
    </div>
  );
};

export default Footer; 