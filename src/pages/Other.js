import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Other.css';

function Other() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // If you are reading this to try to access the page... good for you! I'm almost impressed.
    if (value.toLowerCase() === 'teddy') {
      // Set a session storage key to indicate successful authentication
      sessionStorage.setItem('secretAccess', 'granted');
      // Navigate to the secret page
      navigate('/secret');
    }
  };

  return (
    <div className="other-page">
      <section className="other-hero">
        <h1 className="section-title">Other</h1>
      </section>

      <div className="other-content">
        <section className="other-section">
          <h2>Overview</h2>
          <div className="other-text">
            <p>Welcome to my Other page! Here you'll find additional information about my interests, activities, and other relevant details that don't fit into the main categories.</p>
            <p>This page is under construction. Please check back soon!</p>

            <h2>Friends & Family</h2>
            <div className="value-prompt">
            <p>To access this, please answer this question: What is the name of my dog?</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter the name..."
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Other; 