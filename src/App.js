import React from 'react';
import { BrowserRouter as Router, Routes, Route, basename } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Other from './pages/Other';
import AIProjects from './pages/AIProjects';
import PortfolioWebsite from './pages/PortfolioWebsite';
import EMotorProject from './pages/EMotorProject';
import AmazonFEA from './pages/AmazonFEA';
import Oscilloscope from './pages/Oscilloscope';
import SELProject from './pages/SELProject';
import Certificates from './pages/Certificates';
import Research from './pages/Research';
import './App.css';

function App() {
  return (
    <Router basename="/andrewtakacshtml">
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/other" element={<Other />} />
          <Route path="/ai-projects" element={<AIProjects />} />
          <Route path="/projects/portfolio-website" element={<PortfolioWebsite />} />
          <Route path="/emotor-project" element={<EMotorProject />} />
          <Route path="/amazon-fea" element={<AmazonFEA />} />
          <Route path="/oscilloscope" element={<Oscilloscope />} />
          <Route path="/sel-project" element={<SELProject />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;