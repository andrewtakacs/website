import React from 'react';
import './PortfolioWebsite.css';
import EarthCode from '../components/EarthCode';
import { SecurityHeaders } from '../utils/security';

const PortfolioWebsite = () => {
  return (
    <div className="portfolio-website-page">
      <SecurityHeaders title="Portfolio Website | Andrew Takacs" description="This portfolio website was built from scratch with React and JavaScript, hosted on GitHub Pages with a custom domain." />
      <section className="portfolio-website-hero">
        <h1 className="section-title">Portfolio Website Project</h1>
      </section>

      <div className="portfolio-website-content">
        <section className="portfolio-website-section">
          <h2>Overview</h2>
          <div className="portfolio-website-text">
            <h3>About This Project</h3>
            <p>
              This website was built from scratch using JavaScript, React and GitHub, without any pre-built components, templates, or libraries.
            </p>

            <p>
              This makes hosting and deployment free, avoiding third-party services like WordPress. It also gives me full control over the website and its content, allowing me to customize it freely however I want. For example, I can do this:
            </p>
          </div>
        </section>
        <div className="earth-code-container">
          <EarthCode />
        </div>
      </div>
    </div>
  );
};

export default PortfolioWebsite; 