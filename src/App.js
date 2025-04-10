import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AIProjects from './pages/AIProjects';
import Other from './pages/Other';
import PortfolioWebsite from './pages/PortfolioWebsite';
import EMotorProject from './pages/EMotorProject';
import AmazonFEA from './pages/AmazonFEA';
import Oscilloscope from './pages/Oscilloscope';
import SELProject from './pages/SELProject';
import Research from './pages/Research';
import Certificates from './pages/Certificates';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-projects" element={<AIProjects />} />
          <Route path="/other" element={<Other />} />
          <Route path="/projects/portfolio-website" element={<PortfolioWebsite />} />
          <Route path="/emotor-project" element={<EMotorProject />} />
          <Route path="/amazon-fea" element={<AmazonFEA />} />
          <Route path="/oscilloscope" element={<Oscilloscope />} />
          <Route path="/sel-project" element={<SELProject />} />
          <Route path="/research" element={<Research />} />
          <Route path="/certificates" element={<Certificates />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;