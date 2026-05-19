import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/hardware', label: 'hardware' },
  { path: '/software', label: 'software' },
  { path: '/about',    label: 'about' },
];

function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const IconLight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 18h6M10 22h4M8.5 14.5c-1.25-1.05-2-2.55-2-4.25a5.5 5.5 0 0 1 11 0c0 1.7-.75 3.2-2 4.25-.7.58-1 1.05-1 1.75h-5c0-.7-.3-1.17-1-1.75Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#1e1e1e' : '#f6f4f0';
    metas.forEach(m => m.setAttribute('content', color));
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
          {theme === 'dark' ? <IconLight /> : <IconMoon />}
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
