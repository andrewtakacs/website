import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.about}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className="grid grid--lg-cols-2 grid--gap-xl">
            <div className={styles.content}>
              <h1 className={styles.title}>About</h1>
              <div className={styles.text}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                  veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
            <div className={styles.image}>
              <div className={styles.placeholderImage}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.process}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Process</h2>
          <div className="grid grid--md-cols-3 grid--gap-lg">
            <div className={styles.processItem}>
              <div className={styles.processNumber}>01</div>
              <h3 className={styles.processTitle}>Research</h3>
              <p className={styles.processDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
            <div className={styles.processItem}>
              <div className={styles.processNumber}>02</div>
              <h3 className={styles.processTitle}>Design</h3>
              <p className={styles.processDescription}>
                Duis aute irure dolor in reprehenderit in voluptate velit 
                esse cillum dolore eu fugiat.
              </p>
            </div>
            <div className={styles.processItem}>
              <div className={styles.processNumber}>03</div>
              <h3 className={styles.processTitle}>Build</h3>
              <p className={styles.processDescription}>
                Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;