import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const projectRefs = useRef([]);
  const observerRef = useRef(null);

  const projects = [
    {
      title: "AI Projects",
      description: "Various AI projects I have worked on",
      image: `${process.env.PUBLIC_URL}/images/ai-project.jpeg`,
      link: "/ai-projects",
      categories: ["software"]
    },
    {
      title: "Portfolio Website",
      description: "This website you are currently on!",
      image: `${process.env.PUBLIC_URL}/images/website.png`,
      link: "/projects/portfolio-website",
      categories: ["software"]
    },
    {
      title: "Oscilloscope",
      description: "Oscilloscope code and art I designed",
      image: `${process.env.PUBLIC_URL}/images/Osci.jpg`,
      link: "/oscilloscope",
      categories: ["software"]
    },
    {
      title: "Fuel Cell Electric Vehicle eMotor Transmission Fixture",
      description: "A fuel cell electric vehicle eMotor transmission fixture I designed and built for my capstone project at Washington State University.",
      image: `${process.env.PUBLIC_URL}/images/eMotor.png`,
      link: "/emotor-project",
      categories: ["design", "fabrication"]
    },
    {
      title: "Amazon Drone Bracket FEA",
      description: "A finite element analysis and topology optimization project I completed at Washington State University.",
      image: `${process.env.PUBLIC_URL}/images/amazon.jpg`,
      link: "/amazon-fea",
      categories: ["design"]
    },
    {
      title: "Schweitzer Engineering Laboratories Manufacturing Improvement",
      description: "A manufacturing improvement project I completed for Schweitzer Engineering Laboratories.",
      image: `${process.env.PUBLIC_URL}/images/SEL.png`,
      link: "/sel-project",
      categories: ["design", "fabrication"]
    },
  ];

  useEffect(() => {
    console.log('Active Filter:', activeFilter);
    console.log('Filtered Projects:', filteredProjects);
    
    // Cleanup previous observer
    if (observerRef.current) {
      projectRefs.current.forEach(ref => {
        if (ref) observerRef.current.unobserve(ref);
      });
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const imageElement = entry.target;
          if (entry.isIntersecting) {
            imageElement.classList.add('in-view');
          } else {
            imageElement.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
      }
    );

    // Reset refs array
    projectRefs.current = [];

    // Observe all current project images
    const currentRefs = projectRefs.current;
    filteredProjects.forEach((_, index) => {
      const ref = document.querySelector(`[data-ref-index="${index}"]`);
      if (ref) {
        currentRefs[index] = ref;
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        currentRefs.forEach(ref => {
          if (ref) observerRef.current.unobserve(ref);
        });
      }
    };
  }, [activeFilter]);

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.categories.includes(activeFilter));

  console.log('Rendering with filtered projects:', filteredProjects);

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <h1 className="section-title">Some of My Projects</h1>
      </section>

      <div className="projects-filters">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </button>
        <button 
          className={`filter-button ${activeFilter === 'design' ? 'active' : ''}`}
          onClick={() => setActiveFilter('design')}
        >
          Design & Modeling
        </button>
        <button 
          className={`filter-button ${activeFilter === 'software' ? 'active' : ''}`}
          onClick={() => setActiveFilter('software')}
        >
          Software
        </button>
        <button 
          className={`filter-button ${activeFilter === 'fabrication' ? 'active' : ''}`}
          onClick={() => setActiveFilter('fabrication')}
        >
          Fabrication
        </button>
      </div>

      <section className="projects-grid">
        {filteredProjects.map((project, index) => {
          console.log('Rendering project:', project);
          return (
            <div key={index} className="project-card">
              {project.link ? (
                <Link to={project.link} className="project-link">
                  <div 
                    className="project-image" 
                    data-title={project.title}
                    data-ref-index={index}
                  >
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </Link>
              ) : (
                <>
                  <div 
                    className="project-image" 
                    data-title={project.title}
                    data-ref-index={index}
                  >
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Projects; 