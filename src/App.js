import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Hardware = lazy(() => import('./pages/Hardware'));
const Software = lazy(() => import('./pages/Software'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Certificates = lazy(() => import('./pages/Certificates'));
const SecretPage = lazy(() => import('./pages/SecretPage'));
const Oscilloscope = lazy(() => import('./pages/Oscilloscope'));
const PortfolioWebsite = lazy(() => import('./pages/PortfolioWebsite'));
const EMotorProject = lazy(() => import('./pages/EMotorProject'));
const AmazonFEA = lazy(() => import('./pages/AmazonFEA'));
const SELProject = lazy(() => import('./pages/SELProject'));
const Pwnagotchi = lazy(() => import('./pages/Pwnagotchi'));
const TitanSubmersible = lazy(() => import('./pages/TitanSubmersible'));
const SubmarineFourier = lazy(() => import('./pages/SubmarineFourier'));
const HumanoidRobotPCA = lazy(() => import('./pages/HumanoidRobotPCA'));
const MNISTClassification = lazy(() => import('./pages/MNISTClassification'));
const FashionMNISTNN = lazy(() => import('./pages/FashionMNISTNN'));
const FashionMNISTCNN = lazy(() => import('./pages/FashionMNISTCNN'));
const IAMHandwriting = lazy(() => import('./pages/IAMHandwriting'));
const RDREDecoder = lazy(() => import('./pages/RDREDecoder'));

function ScrollToTop() {
  const { pathname } = useLocation();
  return null;
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Navbar />
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hardware" element={<Hardware />} />
              <Route path="/software" element={<Software />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/secret" element={<SecretPage />} />
              <Route path="/oscilloscope" element={<Oscilloscope />} />
              <Route path="/projects/portfolio-website" element={<PortfolioWebsite />} />
              <Route path="/emotor-project" element={<EMotorProject />} />
              <Route path="/amazon-fea" element={<AmazonFEA />} />
              <Route path="/sel-project" element={<SELProject />} />
              <Route path="/pwnagotchi" element={<Pwnagotchi />} />
              <Route path="/projects/titan-submersible" element={<TitanSubmersible />} />
              <Route path="/projects/ai/submarine-fourier" element={<SubmarineFourier />} />
              <Route path="/projects/ai/humanoid-robot-pca" element={<HumanoidRobotPCA />} />
              <Route path="/projects/ai/mnist-classification" element={<MNISTClassification />} />
              <Route path="/projects/ai/fashion-mnist-nn" element={<FashionMNISTNN />} />
              <Route path="/projects/ai/fashion-mnist-cnn" element={<FashionMNISTCNN />} />
              <Route path="/projects/ai/iam-handwriting" element={<IAMHandwriting />} />
              <Route path="/projects/ai/rdre-decoder" element={<RDREDecoder />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
