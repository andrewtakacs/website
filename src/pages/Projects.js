import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: "AI Projects",
      description: "Various AI projects I have worked on",
      image: `${process.env.PUBLIC_URL}/images/ai-project.jpeg`,
      link: "/ai-projects"
    },
    {
      title: "Portfolio Website",
      description: "This website you are currently on!",
      image: `${process.env.PUBLIC_URL}/images/website.png`,
      link: "/projects/portfolio-website"
    },
    {
      title: "Fuel Cell Electric Vehicle eMotor Transmission Fixture",
      description: "A fuel cell electric vehicle eMotor transmission fixture I designed and built for my capstone project at Washington State University.",
      image: `${process.env.PUBLIC_URL}/images/eMotor.png`,
      link: "/emotor-project"
    },
    {
      title: "Amazon Drone Bracket FEA",
      description: "A finite element analysis and topology optimization project I completed at Washington State University.",
      image: `${process.env.PUBLIC_URL}/images/amazon.jpg`,
      link: "/amazon-fea"
    },
    {
      title: "Oscilloscope",
      description: "Oscilloscope code and art I designed",
      image: `${process.env.PUBLIC_URL}/images/Osci.jpg`,
      link: "/oscilloscope"
    },
    {
      title: "Schweitzer Engineering Laboratories Manufacturing Improvement",
      description: "A manufacturing improvement project I completed for Schweitzer Engineering Laboratories.",
      image: `${process.env.PUBLIC_URL}/images/SEL.png`,
      link: "/sel-project"
    },
   
  ];

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <h1 className="section-title">Some of My Projects</h1>
      </section>

      <section className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            {project.link ? (
              <Link to={project.link} className="project-link">
                <div className="project-image" data-title={project.title}>
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </Link>
            ) : (
              <>
                <div className="project-image" data-title={project.title}>
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Projects; 