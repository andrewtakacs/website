import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/hardware', label: 'hardware' },
  { path: '/software', label: 'software' },
  { path: '/about',    label: 'about' },
  { path: '/contact',  label: 'contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-back" onClick={() => navigate(-1)} aria-label="Go back">
          ← back
        </button>

        <NavLink to="/" className="navbar-logo">AT</NavLink>

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
