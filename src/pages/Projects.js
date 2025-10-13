import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Projects.module.css';

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeLocation, setActiveLocation] = useState('all');
  const [activeStack, setActiveStack] = useState('all');
  const [activeYear, setActiveYear] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Submarine Tracking Fourier',
      category: 'software',
      description: 'Advanced signal processing project using Fourier transforms for underwater acoustic tracking systems. Implemented real-time frequency domain analysis for submarine detection and classification.',
      year: '2024',
      location: 'WSU',
      stack: ['Python', 'MATLAB'],
      image: '/images/PJ1Sub.png'
    },
    {
      id: 2,
      title: 'Humanoid Robot PCA',
      category: 'mechanical',
      description: 'Principal Component Analysis implementation for humanoid robot motion planning and control. Developed dimensionality reduction techniques for efficient robot movement optimization.',
      year: '2024',
      location: 'WSU',
      stack: ['Python', 'MATLAB'],
      image: '/images/PJ2RobotRun.gif'
    },
    {
      id: 3,
      title: 'Number Classification',
      category: 'software',
      description: 'Machine learning project for handwritten digit recognition using various classification algorithms. Achieved high accuracy on MNIST dataset with multiple neural network architectures.',
      year: '2023',
      location: 'WSU',
      stack: ['Python', 'PyTorch'],
      image: '/images/PJ3MNIST16.png'
    },
    {
      id: 4,
      title: 'Deep Neural Network',
      category: 'software',
      description: 'Implementation of deep learning architectures for complex pattern recognition tasks. Built and trained multi-layer neural networks with advanced optimization techniques.',
      year: '2023',
      location: 'WSU',
      stack: ['Python', 'PyTorch'],
      image: '/images/PJ5FCN.png'
    },
    {
      id: 5,
      title: 'Convolutional Neural Network',
      category: 'software',
      description: 'Computer vision project using CNNs for image classification and feature extraction. Developed custom architectures for specific visual recognition tasks.',
      year: '2023',
      location: 'WSU',
      stack: ['Python', 'PyTorch'],
      image: '/images/PJ5CNN.png'
    },
    {
      id: 6,
      title: 'Project Alpha',
      category: 'software',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      year: '2024',
      location: 'Personal',
      stack: ['React'],
      image: null
    },
    {
      id: 7,
      title: 'Project Beta',
      category: 'hardware',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      year: '2024',
      location: 'Personal',
      stack: ['Python'],
      image: null
    },
    {
      id: 8,
      title: 'Project Gamma',
      category: 'aerospace',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      year: '2023',
      location: 'UW',
      stack: ['MATLAB', 'AnsysFluent'],
      image: null
    },
    {
      id: 9,
      title: 'Project Delta',
      category: 'mechanical',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      year: '2023',
      location: 'WSU',
      stack: ['Solidworks'],
      image: null
    },
    {
      id: 10,
      title: 'Project Epsilon',
      category: 'other',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      year: '2023',
      location: 'Personal',
      stack: ['Python'],
      image: null
    },
    {
      id: 11,
      title: 'Project Zeta',
      category: 'software',
      description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
      year: '2022',
      location: 'Personal',
      stack: ['React'],
      image: null
    }
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'aerospace', label: 'Aerospace' },
    { id: 'software', label: 'Software' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'other', label: 'Other' }
  ];

  const locations = [
    { id: 'all', label: 'All' },
    { id: 'personal', label: 'Personal' },
    { id: 'wsu', label: 'WSU' },
    { id: 'uw', label: 'UW' }
  ];

  const stacks = [
    { id: 'all', label: 'All' },
    { id: 'python', label: 'Python' },
    { id: 'matlab', label: 'MATLAB' },
    { id: 'react', label: 'React' },
    { id: 'pytorch', label: 'PyTorch' },
    { id: 'ansysfluent', label: 'AnsysFluent' },
    { id: 'solidworks', label: 'Solidworks' }
  ];

  const years = [
    { id: 'all', label: 'All' },
    { id: '2025', label: '2025' },
    { id: '2024', label: '2024' },
    { id: '2023', label: '2023' },
    { id: '2022', label: '2022' },
    { id: '2021', label: '2021' }
  ];

  // Sync URL params with state
  useEffect(() => {
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const stack = searchParams.get('stack');
    const year = searchParams.get('year');
    
    if (category && categories.find(cat => cat.id === category)) {
      setActiveFilter(category);
    }
    if (location && locations.find(loc => loc.id === location)) {
      setActiveLocation(location);
    }
    if (stack && stacks.find(s => s.id === stack)) {
      setActiveStack(stack);
    }
    if (year && years.find(y => y.id === year)) {
      setActiveYear(year);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (newParams) => {
    const currentParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === 'all' || !value) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, value);
      }
    });
    setSearchParams(currentParams);
  };

  const handleFilterChange = (categoryId) => {
    setActiveFilter(categoryId);
    updateURL({ category: categoryId });
  };

  const handleLocationChange = (locationId) => {
    setActiveLocation(locationId);
    updateURL({ location: locationId });
  };

  const handleStackChange = (stackId) => {
    setActiveStack(stackId);
    updateURL({ stack: stackId });
  };

  const handleYearChange = (yearId) => {
    setActiveYear(yearId);
    updateURL({ year: yearId });
  };


  const clearAllFilters = () => {
    setActiveFilter('all');
    setActiveLocation('all');
    setActiveStack('all');
    setActiveYear('all');
    updateURL({ category: 'all', location: 'all', stack: 'all', year: 'all' });
  };

  // Keyboard navigation for filter buttons
  const handleKeyDown = (event, categoryId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFilterChange(categoryId);
    }
  };

  const filteredProjects = projects.filter(project => {
    const categoryMatch = activeFilter === 'all' || project.category === activeFilter;
    const locationMatch = activeLocation === 'all' || project.location.toLowerCase() === activeLocation;
    const stackMatch = activeStack === 'all' || project.stack.some(s => s.toLowerCase() === activeStack);
    const yearMatch = activeYear === 'all' || project.year === activeYear;
    
    return categoryMatch && locationMatch && stackMatch && yearMatch;
  });

  return (
    <div className={styles.projects}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            A collection of projects spanning mechanical engineering, aerospace, software development, hardware design, and more.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filter}>
        <div className="container">
          {/* Primary Category Filter */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Category</h3>
            <div className={styles.filterList} role="tablist" aria-label="Project categories">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`${styles.filterButton} ${activeFilter === category.id ? styles.filterButtonActive : ''}`}
                  onClick={() => handleFilterChange(category.id)}
                  onKeyDown={(e) => handleKeyDown(e, category.id)}
                  role="tab"
                  aria-selected={activeFilter === category.id}
                  tabIndex={activeFilter === category.id ? 0 : -1}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters */}
          <div className={styles.secondaryFilters}>
              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Location</h3>
                <div className={styles.filterList}>
                  {locations.map(location => (
                    <button
                      key={location.id}
                      className={`${styles.filterButton} ${activeLocation === location.id ? styles.filterButtonActive : ''}`}
                      onClick={() => handleLocationChange(location.id)}
                      role="tab"
                      aria-selected={activeLocation === location.id}
                    >
                      {location.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Stack</h3>
                <div className={styles.filterList}>
                  {stacks.map(stack => (
                    <button
                      key={stack.id}
                      className={`${styles.filterButton} ${activeStack === stack.id ? styles.filterButtonActive : ''}`}
                      onClick={() => handleStackChange(stack.id)}
                      role="tab"
                      aria-selected={activeStack === stack.id}
                    >
                      {stack.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Year</h3>
                <div className={styles.filterList}>
                  {years.map(year => (
                    <button
                      key={year.id}
                      className={`${styles.filterButton} ${activeYear === year.id ? styles.filterButtonActive : ''}`}
                      onClick={() => handleYearChange(year.id)}
                      role="tab"
                      aria-selected={activeYear === year.id}
                    >
                      {year.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className={styles.projectsGrid}>
        <div className="container">
          <div className={styles.grid}>
            {filteredProjects.map((project, index) => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectImage}>
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className={styles.projectImageContent}
                    />
                  ) : (
                    <div className={styles.placeholderImage}></div>
                  )}
                </div>
                <div className={styles.projectInfo}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No projects found</h3>
              <p>No projects match the selected category. Try selecting a different filter above.</p>
              <button 
                className={styles.clearFilterButton}
                onClick={clearAllFilters}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;