import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoImage from "../assets/logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth() || {};
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    setIsUserOpen(false);
    navigate("/");
  };

  return (
    <nav className="nav-container">
      <div className="nav-content flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="nav-logo">
          <img src={logoImage} alt="Shaktix" style={{ height: '32px', width: 'auto' }} />
        </a>

        {/* Desktop Navigation */}
        <ul className="nav-links desktop space-x-6">
          <li><a href="/" className="nav-link">{t('nav.home')}</a></li>
          <li><a href="/services" className="nav-link">{t('nav.services')}</a></li>
          <li><a href="/about" className="nav-link">{t('nav.about')}</a></li>
          <li><a href="/contact" className="nav-link">{t('nav.contact')}</a></li>
          <li><LanguageSwitcher /></li>
          
          <li className="nav-search">
            <button className="nav-search-button" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <svg className="nav-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder={t('nav.search')}
              aria-label="Search"
              className={`nav-search-input ${isSearchOpen ? 'open' : 'collapsed'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
                }
              }}
            />
          </li>
          {user ? (
            <li className="user-menu">
              <button className="user-trigger" onClick={() => setIsUserOpen(!isUserOpen)} aria-haspopup="menu" aria-expanded={isUserOpen}>
                <span className="user-avatar" aria-hidden="true">
                  {user && user.avatar ? (
                    <img src={user.avatar} alt="User avatar" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="7" r="4"></circle>
                      <path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path>
                    </svg>
                  )}
                </span>
                <span className="user-name">{user.name}</span>
              </button>
              {isUserOpen && (
                <div className="user-dropdown" role="menu">
                  <a className="user-item" href="/profile" role="menuitem" onClick={() => setIsUserOpen(false)}>{t('nav.editProfile')}</a>
                  <button className="user-item" onClick={handleLogout} role="menuitem">{t('nav.logout')}</button>
                </div>
              )}
            </li>
          ) : (
            <li><a href="/signup" className="nav-link">{t('nav.signup')}</a></li>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9,22 9,12 15,12 15,22"></polyline>
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
    <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
      <ul className="mobile-nav-links">
        <li><a href="/" className="mobile-nav-link">{t('nav.home')}</a></li>
        <li><a href="/services" className="mobile-nav-link">{t('nav.services')}</a></li>
        <li><a href="#about" className="mobile-nav-link">{t('nav.about')}</a></li>
        <li><a href="/contact" className="mobile-nav-link">{t('nav.contact')}</a></li>
        <li><LanguageSwitcher /></li>
          {user ? (
            <li><span className="mobile-nav-link" aria-label="User">{user.name}</span></li>
          ) : (
            <li><a href="/signup" className="mobile-nav-link">Sign Up</a></li>
          )}
          <li className="mobile-search">
            <button className="mobile-search-button" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <svg className="mobile-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder={t('nav.search')}
              aria-label="Search"
              className={`mobile-search-input ${isSearchOpen ? 'open' : 'collapsed'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
                }
              }}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;