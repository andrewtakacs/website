import React from 'react';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      company: "Company Name",
      position: "Software Engineer",
      period: "2022 - Present",
      description: "Description of your role and key achievements at this company.",
      technologies: ["React", "Node.js", "AWS"],
      location: "Seattle, WA"
    },
    {
      company: "Previous Company",
      position: "Full Stack Developer",
      period: "2020 - 2022",
      description: "Description of your role and key achievements at this company.",
      technologies: ["Python", "Django", "PostgreSQL"],
      location: "Remote"
    },
    // Add more experiences as needed
  ];

  return (
    <div className="experience-page">
      <section className="experience-hero">
        <h1 className="section-title">Experience</h1>
        <p className="section-subtitle">My professional journey and contributions</p>
      </section>

      <section className="experience-timeline">
        {experiences.map((exp, index) => (
          <div key={index} className="experience-card">
            <div className="experience-header">
              <h2>{exp.position}</h2>
              <span className="experience-period">{exp.period}</span>
            </div>
            <div className="experience-company">
              <h3>{exp.company}</h3>
              <span className="experience-location">{exp.location}</span>
            </div>
            <p className="experience-description">{exp.description}</p>
            <div className="experience-technologies">
              {exp.technologies.map((tech, techIndex) => (
                <span key={techIndex} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Experience; 