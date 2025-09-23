import { useTranslation } from "react-i18next";
import logoImage from "../assets/logo.png";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src={logoImage} alt="Shaktix" style={{ height: '32px', width: 'auto' }} />
              <p>{t('hero.subtitle')}</p>
            </div>
            <p className="footer-description">
              {t('footer.desc', 'Your comprehensive platform for health, safety, and cybersecurity protection.')}
            </p>
            <div className="social-links">
              <a href="#linkedin" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#twitter" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#facebook" className="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#instagram" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>{t('footer.quick', 'Quick Links')}</h4>
            <ul className="footer-links">
              <li><a href="/">{t('nav.home')}</a></li>
              <li><a href="/services">{t('nav.services')}</a></li>
              <li><a href="/about">{t('nav.about')}</a></li>
              <li><a href="/contact">{t('nav.contact')}</a></li>
              <li><a href="/help">{t('footer.help', 'Help Center')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>{t('footer.services', 'Our Services')}</h4>
            <ul className="footer-links">
              <li><a href="/health">{t('footer.health', 'Health Protection')}</a></li>
              <li><a href="/safety">{t('footer.safety', 'Personal Safety')}</a></li>
              <li><a href="/cybersecurity">{t('footer.cyber', 'Cybersecurity')}</a></li>
              <li><a href="/ai-features">{t('footer.ai', 'AI Features')}</a></li>
              <li><a href="/blockchain">{t('footer.blockchain', 'Blockchain Security')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>{t('footer.support', 'Support')}</h4>
            <ul className="footer-links">
              <li><a href="/privacy">{t('footer.privacy', 'Privacy Policy')}</a></li>
              <li><a href="/terms">{t('footer.terms', 'Terms of Service')}</a></li>
              <li><a href="/security">{t('footer.sec', 'Security')}</a></li>
              <li><a href="/faq">{t('footer.faq', 'FAQ')}</a></li>
              <li><a href="/support">{t('footer.support', 'Support')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>{t('contact.heading')}</h4>
            <div className="contact-info">
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>support@shaktix.com</span>
              </div>
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+91 8264131474
                </span>
              </div>
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>India, Punjab</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 {t('brand')}. {t('footer.rights', 'All rights reserved.')}</p>
            <div className="footer-bottom-links">
              <a href="/privacy">{t('footer.privacy', 'Privacy')}</a>
              <a href="/terms">{t('footer.terms', 'Terms')}</a>
              <a href="/cookies">{t('footer.cookies', 'Cookies')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
