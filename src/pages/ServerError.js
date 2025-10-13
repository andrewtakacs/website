import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ServerError.module.css';

const ServerError = () => {
  return (
    <div className={styles.serverError}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.errorCode}>500</div>
          <h1 className={styles.title}>Server Error</h1>
          <p className={styles.description}>
            Something went wrong on our end. We're working to fix this issue.
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

export default ServerError;
