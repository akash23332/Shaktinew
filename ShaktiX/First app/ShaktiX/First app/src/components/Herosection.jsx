import { useTranslation } from "react-i18next";
import video2 from "../assets/smile.mp4";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="hero-section">
      {/* Background Video */}
      <div>
        <video 
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={(e) => console.error('Video failed to load:', e)}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
        >
          <source src={video2} type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img 
            src="/lovable-uploads/59e52ccd-a4ce-462b-8f05-2b81cd67d4a4.png" 
            alt="ShaktiX - Empowering Women Through AI & Blockchain" 
            className="hero-background"
          />
        </video>
        {/* Overlay for better text readability */}
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="animate-fade-in space-y-8">
          {/* Main Heading */}
          <h1 className="hero-heading">
            <span className="hero-title">{t('hero.title1')}</span>
            <br />
            <span className="hero-title">{t('hero.title2')} </span>
            <span className="hero-highlight">{t('hero.highlight')}</span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          </div>

          {/* CTA Button */}
          <div className="hero-cta">
            <a className="hero-button" href="/services">
              {t('hero.cta')}
              <svg className="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </a>
          </div>
        </div>
  

      {/* Social Media Icons */}
      <div className="social-icons animate-fade-in">
        <a
          href="#linkedin"
          className="social-icon"
          aria-label="LinkedIn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 10v5m0-8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3l-3-3h-3l-3 3a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z"></path>
          </svg>
        </a>
        <a
          href="#twitter"
          className="social-icon"
          aria-label="Twitter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 4s-4 7-10 11-11-4-11-4 4-7 10-11 11 4 11 4z"></path>
            <path d="m5 15 4-4 6 6 4-5.5"></path>
          </svg>
        </a>
        <a
          href="#facebook"
          className="social-icon"
          aria-label="Facebook"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;