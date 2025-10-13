import React from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <div className={styles.contact}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>
            Let's work together on your next project.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className={styles.content}>
        <div className="container">
          <div className="grid grid--lg-cols-2 grid--gap-xl">
            {/* Contact Info */}
            <div className={styles.info}>
              <h2 className={styles.sectionTitle}>Get in Touch</h2>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <h3>Email</h3>
                  <p>hello@andrewtakacs.com</p>
                </div>
                <div className={styles.contactItem}>
                  <h3>Location</h3>
                  <p>Seattle, WA</p>
                </div>
                <div className={styles.contactItem}>
                  <h3>Availability</h3>
                  <p>Open to new opportunities</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formSection}>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Name</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="Your name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input 
                    type="email" 
                    className={styles.input}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Subject</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="Project inquiry"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Message</label>
                  <textarea 
                    className={styles.textarea}
                    rows="5"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                
                <button type="submit" className={styles.submitButton}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;