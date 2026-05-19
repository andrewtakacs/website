import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/hardware', label: 'hardware' },
  { path: '/software', label: 'software' },
  { path: '/about',    label: 'about' },
];

const TOP_LEVEL = new Set(['/', '/hardware', '/software', '/about', '/contact']);

function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 4.5zm0 13.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM4.5 12a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4.5 12zm16.5 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75zM6.697 7.757a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 1 1-1.062-1.061l1.061-1.061a.75.75 0 0 1 1.061 0zm11.666 9.546a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 0 1-1.062-1.06l1.061-1.062a.75.75 0 0 1 1.061 0zm-9.546 1.06a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 0 1 1.06-1.062l1.062 1.061a.75.75 0 0 1 0 1.061zM18.364 6.697a.75.75 0 0 1-1.061 0l-1.062-1.06a.75.75 0 0 1 1.061-1.062l1.062 1.061a.75.75 0 0 1 0 1.061zM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5z"/>
  </svg>
);

const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162z"/>
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCount, setNavCount] = useState(0);
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setNavCount(c => c + 1);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.navbar')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [closeMenu]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const showBack = navCount > 1 && location.pathname !== '/';

  const lastBackClick = useRef(0);
  const handleBack = () => {
    const now = Date.now();
    if (now - lastBackClick.current < 400) {
      navigate('/');
    } else {
      navigate(-1);
    }
    lastBackClick.current = now;
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {showBack ? (
          <button className="navbar-back" onClick={handleBack} aria-label="Go back">
            ←
          </button>
        ) : (
          <NavLink to="/" className="navbar-logo">AT</NavLink>
        )}

        <div className="navbar-links">
          {NAV_LINKS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <button className="navbar-theme" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>

        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          {NAV_LINKS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => isActive ? 'navbar-mobile-link active' : 'navbar-mobile-link'}
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
