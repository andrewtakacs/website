import React, { useState, useEffect } from 'react';
import './Timeline.css';

const timelineData = [
  {
    yearStartDate: 2024,
    monthStartDate: 11,
    yearEndDate: 2025,
    monthEndDate: 13,
    title: 'Research Assistant - Rotational Detonation Laboratory',
    company: 'University of Washington',
    details: [
      'Conducted research on rotating detonation engines using high-speed imaging and data acquisition',
      'Developed first-of-their-kind experimental setups to investigate engine efficacy',
      'Modified test setups to improve data accuracy and experimental repeatability'
    ]
  },
  {
    yearStartDate: 2024,
    monthStartDate: 4,
    yearEndDate: 2024,
    monthEndDate: 7,
    title: 'Project Engineer Intern',
    company: 'Titan Electric',
    details: [
      'Designed and implemented automated safety and budget tracking using VBA and Python',
      'Managed over $1.2 million in purchase orders, significantly exceeding intern expectations'
    ]
  },
  {
    yearStartDate: 2024,
    monthStartDate: 0,
    yearEndDate: 2024,
    monthEndDate: 4,
    title: 'Teaching Assistant - SolidWorks',
    company: 'Washington State University',
    details: [
      'Managed a class of 28 students, tracking over 2,000 assignments for accuracy',
      'Delivered lectures, led class sessions, and held regular office hours'
    ]
  },
  {
    yearStartDate: 2023,
    monthStartDate: 4,
    yearEndDate: 2023,
    monthEndDate: 7,
    title: 'MEP Coordinator Intern',
    company: 'BNBuilders',
    details: [
      'Reviewed and implemented backup power solutions for high-profile clients such as Google and Meta',
      'Coordinated MEP installations across ten construction sites, ensuring project adherence',
      'Assessed code compliance using ASME, UL, and NFPA, resulting in zero violations'
    ]
  },
  {
    yearStartDate: 2021,
    monthStartDate: 9,
    yearEndDate: 2022,
    monthEndDate: 9,
    title: 'Research Assistant - Hydrogen Laboratory',
    company: 'Washington State University',
    details: [
      'Led a team to optimize a 5,800 sq. ft. research space for cryogenic hydrogen studies',
      'Implemented HAZOP analysis to mitigate research risks',
      'Developed new wire pass-through designs, increasing connection capacity by 68% and reducing costs by half'
    ]
  }
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function Timeline() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [years, setYears] = useState([]);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Get unique years from both start and end dates
    const allYears = timelineData.flatMap(item => [
      item.yearStartDate,
      item.yearEndDate
    ]);
    const uniqueYears = [...new Set(allYears)];
    setYears(uniqueYears.sort((a, b) => b - a));
  }, []);

  const getMonthPosition = (year, month) => {
    const yearIndex = years.indexOf(year);
    return yearIndex * 12 + (11 - month);
  };

  const handleExperienceClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const isPresent = (month) => {
    return month === 13;
  };

  return (
    <div className="timeline">
      <div className="timeline-columns">
        {/* Years Column */}
        <div className="timeline-years">
          {years.map(year => (
            <div key={year} className="year-label">
              {year}
            </div>
          ))}
        </div>

        {/* Months Column */}
        <div className="timeline-months">
          {years.map(year => (
            <div key={year} className="year-months">
              {months.map((month, index) => (
                <div key={`${year}-${month}`} className="month-label">
                  {month}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Experiences Column */}
        <div className="timeline-experiences">
          {timelineData.map((experience, index) => {
            const startPosition = getMonthPosition(
              experience.yearStartDate,
              experience.monthStartDate
            );
            const endPosition = isPresent(experience.monthEndDate)
              ? getMonthPosition(currentYear, new Date().getMonth())
              : getMonthPosition(experience.yearEndDate, experience.monthEndDate);
            const duration = endPosition - startPosition + 1;

            return (
              <div
                key={index}
                className={`experience-box ${expandedIndex === index ? 'expanded' : ''}`}
                style={{
                  top: `${startPosition * 40}px`,
                  height: `${duration * 40}px`,
                  left: `${index % 2 * 20}px`
                }}
                onClick={() => handleExperienceClick(index)}
              >
                <div className="experience-content">
                  <h3>{experience.title}</h3>
                  <p className="company">{experience.company}</p>
                  <p className="date-range">
                    {months[experience.monthStartDate]} {experience.yearStartDate} – {isPresent(experience.monthEndDate) ? 'Present' : `${months[experience.monthEndDate]} ${experience.yearEndDate}`}
                  </p>
                  {expandedIndex === index && (
                    <div className="experience-details">
                      <ul>
                        {experience.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="timeline-connector" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Timeline; 