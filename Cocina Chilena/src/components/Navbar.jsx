import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-text">Cocina Chilena</span>
          <span className="brand-subtitle">Administrador de Menu</span>
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="toggle-icon">{isMenuOpen ? '✕' : '☰'}</span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <span className="nav-icon">📋</span>
            Menu
          </li>
          <li className="navbar-item">
            <span className="nav-icon">📊</span>
            Estadisticas
          </li>
          <li className="navbar-item">
            <span className="nav-icon">⚙️</span>
            Configuracion
          </li>
        </ul>

        <div className="navbar-user">
          <span className="user-avatar">👤</span>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;