import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
    { path: 'theme', label: 'Theme', isThemeToggle: true }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          @
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navDesktop}>
          <button
            className={styles.desktopToggle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Dropdown Navigation */}
      <div className={`${styles.navMobile} ${isOpen ? styles.navMobileOpen : ''}`}>
        <ul className={styles.navListMobile}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.navItemMobile}>
              {item.isThemeToggle ? (
                <button
                  className={`${styles.navLinkMobile} ${styles.themeToggleButton}`}
                  onClick={() => {
                    // Toggle theme logic here
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`${styles.navLinkMobile} ${isActive(item.path) ? styles.navLinkMobileActive : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;