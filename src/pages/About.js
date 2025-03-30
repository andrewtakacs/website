import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  const skills = {
    technical: [
      'Python',
      { name: 'SolidWorks', link: '/certificates' },
      'MATLAB',
      'Java',
      'JavaScript',
      'HTML/CSS'
    ],
    engineering: [
      { name: 'CAD Design', link: '/certificates' },
      { name: 'Finite Element Analysis', link: '/certificates' },
      { name: 'CFD', link: '/certificates' },
      'Project Management',
      'Technical Writing',
      'Research'
    ]
  };

  const education = [
    {
      degree: "MS Aerospace Engineering",
      school: "University of Washington",
      period: "2023 - Present",
      description: "Thesis and course work based master's program focused on fluids while reasearching advanced aerospace propulsion."
    },
    {
      degree: "BS Mechanical Engineering",
      school: "Washington State University",
      period: "2019 - 2023",
      description: "Graduated with magna cum laude one year early with a focus on thermal fluids. I was on the President's Honors Roll every semester."
    },
    {
      degree: "Running Start Program",
      school: "Bellevue College",
      period: "2017 - 2019",
      description: "Earned 100 college credits while in high school through a community college program, maintaining Honors Roll."
    }
  ];

  const experience = [
    {
      title: "Graduate Research Assistant",
      company: "University of Washington",
      location: "Seattle, WA",
      period: "August 2024 - Present",
      description: [
        "Conducting research on rotational detonation engines an innovative field of propulsion technology for future space travel.",
        <>
          Learn more about the technology {" "}
          <a 
            href="https://www.nasa.gov/centers-and-facilities/marshall/nasas-3d-printed-rotating-detonation-rocket-engine-test-a-success/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </>
      ]
    },
    {
      title: "Project Engineer Internship",
      company: "Titan Electric",
      location: "Bellevue, WA",
      period: "May 2024 to August 2024",
      description: [
        "Managed over $1.2 Million in purchase orders significantly exceeding the average showcasing project responsibility.",
        "Developed new automation process for saftey stickers and budget breakdown reports saving the company time and resources.",
      ]
    },
    {
      title: "Undergraduate Research Assistant",
      company: "Washington State University",
      location: "Pullman, WA",
      period: "October 2021 - October 2022",
      description: [
        "Led a team to implement production spaces in a 5,800-square-foot graduate research laboratory, integrating lean manufacturing and Six Sigma techniques for cryogenic hydrogen research.",
        "Created wire pass-through designs for liquid hydrogen research experiments, increasing connections by 68% and reducing costs by 50%.",
        <span key="research-link">
          Learn more about the research{" "}
          <a 
            href="https://hydrogen.wsu.edu" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </span>
      ]
    },
    {
      title: "Mechanical Electrical Plumbing (MEP) Internship",
      company: "BNBuilders",
      location: "Seattle, WA",
      period: "May 2023 - August 2023",
      description: [
        "Coordinated cross-functional teams on ten construction sites, overseeing MEP installations. Ensuring collaboration, adherence to schedules, and successful achievement of milestones.",
        "Reviewed power systems which helped implement backup power solutions in high-profile buildings, ensuring seamless operations for clients such as Google and Facebook.",
        "Assessed technical code compliance with NFPA, UL, and ASME, ensuring projects met requirements to uphold safety standards resulting in zero injuries and code violations."
      ]
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <h1 className="section-title">About Me</h1>
      </section>

      <div className="about-content">
        <section className="about-section">
          <h2>Education</h2>
          <div className="education-grid">
            {education.map((edu, index) => (
              <div key={index} className="education-card">
                <h3>{edu.degree}</h3>
                <h4 data-school={edu.school}>{edu.school}</h4>
                <p className="period">{edu.period}</p>
                <p className="description">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Professional Experience</h2>
          <div className="experience-grid">
            {experience.map((exp, index) => (
              <div key={index} className="experience-card">
                <div className="experience-header">
                  <h3>{exp.title}</h3>
                  <h4 data-company={exp.company}>{exp.company}</h4>
                  <p className="location">{exp.location}</p>
                  <p className="period">{exp.period}</p>
                </div>
                <ul className="experience-description">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skills-column">
              <h3>Technical Skills</h3>
              <ul>
                {skills.technical.map((skill, index) => (
                  <li key={index}>
                    {typeof skill === 'string' ? (
                      skill
                    ) : (
                      <Link to={skill.link} className="certificate-link">
                        {skill.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="skills-column">
              <h3>Engineering Skills</h3>
              <ul>
                {skills.engineering.map((skill, index) => (
                  <li key={index}>
                    {typeof skill === 'string' ? (
                      skill
                    ) : (
                      <Link to={skill.link} className="certificate-link">
                        {skill.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About; 