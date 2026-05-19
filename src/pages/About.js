import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './About.css';

const skills = {
  technical: [
    'Python',
    { name: 'SolidWorks', link: '/certificates' },
    'MATLAB',
    'Java',
    'JavaScript',
    'HTML/CSS',
  ],
  engineering: [
    { name: 'CAD Design', link: '/certificates' },
    { name: 'Finite Element Analysis', link: '/certificates' },
    { name: 'CFD', link: '/certificates' },
    'Project Management',
    'Technical Writing',
    'Research',
  ],
};

const education = [
  {
    degree: 'MS Aerospace Engineering',
    school: 'University of Washington',
    period: '2023 – present',
  },
  {
    degree: 'BS Mechanical Engineering',
    school: 'Washington State University',
    period: '2019 – 2023',
  },
  {
    degree: 'Running Start',
    school: 'Bellevue College',
    period: '2017 – 2019',
  },
];

const experience = [
  {
    title: 'Graduate Research Assistant',
    company: 'University of Washington',
    location: 'Seattle, WA',
    period: 'Aug 2024 – present',
    bullets: [
      'Conducting research on rotational detonation engines for future space propulsion.',
    ],
  },
  {
    title: 'Production Operations Engineer Intern',
    company: 'SpaceX',
    location: 'Bastrop, TX',
    period: 'Sep – Dec 2025',
    bullets: [
      'Production operations engineering on Starship manufacturing line.',
    ],
  },
  {
    title: 'Stress Analysis Engineer Intern',
    company: 'Boeing',
    location: 'Seattle, WA',
    period: 'Jun – Sep 2025',
    bullets: [
      'Stress analysis on Boeing 777X components.',
      'FEA, physical testing, and hand calculation validation.',
    ],
  },
  {
    title: 'Project Engineer Intern',
    company: 'Titan Electric',
    location: 'Bellevue, WA',
    period: 'May – Aug 2024',
    bullets: [
      'Managed $1.2M+ in purchase orders.',
      'Built automation tools for safety reporting, saving time and resources.',
    ],
  },
  {
    title: 'Undergraduate Research Assistant',
    company: 'Washington State University',
    location: 'Pullman, WA',
    period: 'Oct 2021 – Oct 2022',
    bullets: [
      'Implemented lean manufacturing in 5,800 sq ft cryogenic hydrogen lab.',
      'Wire pass-through designs: +68% connections, −50% cost.',
    ],
  },
  {
    title: 'MEP Intern',
    company: 'BNBuilders',
    location: 'Seattle, WA',
    period: 'May – Aug 2023',
    bullets: [
      'Coordinated MEP installations across 10 construction sites.',
      'Reviewed power systems for Google, Facebook facilities.',
      'NFPA/UL/ASME code compliance — zero violations.',
    ],
  },
];

export default function About() {
  return (
    <div className="inner-page about-page">

      <hr className="rule" />

      <section className="about-section">
        <div className="section-header">
          <span className="section-label">EXPERIENCE</span>
          <hr className="section-rule" />
        </div>
        <div className="exp-list">
          {experience.map((e, i) => (
            <div key={i} className="exp-entry">
              <div className="exp-meta">
                <span className="exp-period dim">{e.period}</span>
              </div>
              <div className="exp-body">
                <div className="exp-header-row">
                  <span className="exp-title">{e.title}</span>
                  <span className="exp-company dim">{e.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section className="about-section">
        <div className="section-header">
          <span className="section-label">EDUCATION</span>
          <hr className="section-rule" />
        </div>
        <div className="edu-list">
          {education.map((e, i) => (
            <div key={i} className="edu-entry">
              <div className="exp-meta">
                <span className="exp-period dim">{e.period}</span>
              </div>
              <div className="exp-body">
                <div className="exp-header-row">
                  <span className="exp-title">{e.degree}</span>
                  <span className="exp-company dim">{e.school}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section className="about-section">
        <div className="section-header">
          <span className="section-label">SKILLS</span>
          <hr className="section-rule" />
        </div>
        <div className="skills-row">
          {[...skills.technical, ...skills.engineering].map((s, i) => (
            typeof s === 'string' ? (
              <span key={i} className="skill-tag dim">{s}</span>
            ) : (
              <Link key={i} to={s.link} className="skill-tag skill-link">{s.name}</Link>
            )
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
