import React from 'react';
import styles from './Home.module.css';
import EarthRotator from '../components/EarthRotator';

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Rotating ASCII Earth Section */}
      <EarthRotator />
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Hello!
            </h1>
            <h1 className={styles.title}>
              I'm Andrew
            </h1>
            <p className={styles.subtitle}>
              Welcome to my website
            </p>
            <div className={styles.description}>
              <p>
                Feel free to look around and learn more about me, some of my projects, and stuff I like to do...
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Work */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.featuredContent}>
            <h2 className={styles.sectionTitle}>My Favorites</h2>
            <div className={styles.featuredGrid}>
              <div className={styles.featuredItem}>
                <div className={styles.featuredImage}>
                  <div className={styles.placeholderImage}></div>
                </div>
                <div className={styles.featuredInfo}>
                  <h3>Project Alpha</h3>
                  <p>Lorem ipsum dolor sit amet consectetur</p>
                </div>
              </div>
              <div className={styles.featuredItem}>
                <div className={styles.featuredImage}>
                  <div className={styles.placeholderImage}></div>
                </div>
                <div className={styles.featuredInfo}>
                  <h3>Project Beta</h3>
                  <p>Adipiscing elit sed do eiusmod tempor</p>
                </div>
              </div>
              <div className={styles.featuredItem}>
                <div className={styles.featuredImage}>
                  <div className={styles.placeholderImage}></div>
                </div>
                <div className={styles.featuredInfo}>
                  <h3>Project Gamma</h3>
                  <p>Incididunt ut labore et dolore magna</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;