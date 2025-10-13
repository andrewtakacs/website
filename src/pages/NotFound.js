import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles.primaryButton}>
              Go Home
            </Link>
            <Link to="/projects" className={styles.secondaryButton}>
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
