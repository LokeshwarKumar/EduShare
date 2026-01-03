import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  /* ===================== STYLES ===================== */

  const navbar = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.08)'
  };

  const container = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logo = {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#111',
    textDecoration: 'none'
  };

  const desktopMenu = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#fff',
    padding: '0.5rem',
    borderRadius: '999px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
  };

  const navLink = (active) => ({
    padding: '0.45rem 0.9rem',
    borderRadius: '999px',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: active ? '#fff' : '#555',
    background: active ? '#111' : 'transparent',
    transition: 'all 0.25s ease'
  });

  const adminLink = {
    color: '#d97706',
    fontWeight: 600
  };

  const userBadge = {
    padding: '0.4rem 0.9rem',
    background: '#f4f4f5',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#333'
  };

  const button = {
    padding: '0.45rem 1rem',
    borderRadius: '999px',
    border: 'none',
    background: '#111',
    color: '#fff',
    fontSize: '0.85rem',
    cursor: 'pointer'
  };

  const mobileBtn = {
    display: 'none',
    fontSize: '1.7rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };

  const mobileMenu = {
    background: '#fff',
    padding: '1rem 2rem',
    borderTop: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  };

  const mobileLink = (active) => ({
    textDecoration: 'none',
    padding: '0.7rem 1rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    color: active ? '#fff' : '#333',
    background: active ? '#111' : '#f7f7f7'
  });

  /* ===================== JSX ===================== */

  return (
    <nav style={navbar}>
      <div style={container}>
        <Link to={isAuthenticated ? '/' : '/login'} style={logo}>
          EduMat
        </Link>

        {/* Desktop Menu */}
        <div
          style={{
            ...desktopMenu,
            ...(window.innerWidth <= 768 ? { display: 'none' } : {})
          }}
        >
          {isAuthenticated ? (
            <>
              <NavLink to="/" style={navLink(isActive('/'))}>Home</NavLink>
              <NavLink to="/materials" style={navLink(isActive('/materials'))}>Browse</NavLink>
              <NavLink to="/upload" style={navLink(isActive('/upload'))}>Upload</NavLink>
              <NavLink to="/my-materials" style={navLink(isActive('/my-materials'))}>
                My Materials
              </NavLink>

              {user?.roles?.includes('ROLE_ADMIN') && (
                <NavLink
                  to="/admin"
                  style={{ ...navLink(isActive('/admin')), ...adminLink }}
                >
                  Admin
                </NavLink>
              )}

              <span style={userBadge}>
                👋 {user?.firstName || user?.username}
              </span>

              <button style={button} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={navLink(isActive('/login'))}>Login</NavLink>
              <NavLink to="/register" style={navLink(isActive('/register'))}>
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            ...mobileBtn,
            ...(window.innerWidth <= 768 ? { display: 'block' } : {})
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && window.innerWidth <= 768 && (
        <div style={mobileMenu}>
          {isAuthenticated ? (
            <>
              <NavLink to="/" style={mobileLink(isActive('/'))}>Home</NavLink>
              <NavLink to="/materials" style={mobileLink(isActive('/materials'))}>
                Browse
              </NavLink>
              <NavLink to="/upload" style={mobileLink(isActive('/upload'))}>
                Upload
              </NavLink>
              <NavLink to="/my-materials" style={mobileLink(isActive('/my-materials'))}>
                My Materials
              </NavLink>

              {user?.roles?.includes('ROLE_ADMIN') && (
                <NavLink to="/admin" style={mobileLink(isActive('/admin'))}>
                  Admin
                </NavLink>
              )}

              <button style={{ ...button, width: '100%' }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={mobileLink(isActive('/login'))}>
                Login
              </NavLink>
              <NavLink to="/register" style={mobileLink(isActive('/register'))}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
