import Navigation from "../components/Navbar";
import HeroSection from "../components/Herosection";
import Footer from "../components/Footer";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const [serviceOpen, setServiceOpen] = useState({ health: false, safety: false, cyber: false });
  const [howOpen, setHowOpen] = useState([false, false, false, false, false]);

  const toggleService = (key) =>
    setServiceOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleHow = (idx) =>
    setHowOpen((prev) => prev.map((v, i) => (i === idx ? !v : v)));

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      
      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="services-header">
            <h2 className="services-main-heading">{t('index.servicesHeading')}</h2>
            <p className="services-main-subtitle">{t('index.servicesSub', 'Discover the three pillars of ShaktiX — Health, Safety, and Cybersecurity — working together to protect and empower women in every sphere of life.')}</p>
          </div>
          
          <div className="services-grid">
            {/* Health Service */}
            <div className="service-card health-card">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                </svg>
              </div>
              <h3 className="service-title">{t('index.healthTitle')}</h3>
              <ul className="service-features">
                <li>
                  <h4>{t('index.blockchainWallet')}</h4>
                  <p>{t('index.blockchainDesc')}</p>
                </li>
                <li>
                  <h4>{t('index.aiTeleclinic')}</h4>
                  <p>{t('index.aiTeleclinicDesc')}</p>
                </li>
                <li>
                  <h4>{t('index.iotMonitoring')}</h4>
                  <p>{t('index.iotDesc')}</p>
                </li>
              </ul>
              <button className="more-btn" type="button" onClick={() => toggleService("health")}>
                {serviceOpen.health ? t('index.hideDetails') : t('index.learnMore')}
              </button>
              <div className={`card-more ${serviceOpen.health ? "open" : ""}`}>
                <p>
                  {t('index.healthMore')}
                </p>
              </div>
            </div>

            {/* Safety Service */}
            <div className="service-card safety-card">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3 className="service-title">{t('index.safetyTitle')}</h3>
              <ul className="service-features">
                <li>
                  <h4>{t('index.aiSaferoute')}</h4>
                  <p>{t('index.saferouteDesc')}</p>
                </li>
                <li>
                  <h4>{t('index.smartSos')}</h4>
                  <p>{t('index.sosDesc')}</p>
                </li>
                <li>
                  <h4>{t('index.smartRingSos')}</h4>
                  <p>{t('index.ringDesc')}</p>
                </li>
              </ul>
              <button className="more-btn" type="button" onClick={() => toggleService("safety")}>
                {serviceOpen.safety ? t('index.hideDetails') : t('index.learnMore')}
              </button>
              <div className={`card-more ${serviceOpen.safety ? "open" : ""}`}>
                <p>
                  {t('index.safetyMore')}
                </p>
              </div>
            </div>

            {/* Cybersecurity Service */}
            <div className="service-card cybersecurity-card">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="service-title">{t('index.cyberTitle')}</h3>
              <ul className="service-features">
                <li>
                  <h4>{t('index.voiceshield')}</h4>
                  <p>{t('index.voiceDesc')}</p>
                </li>
                <li>
                  <h4>{t('index.deepfake')}</h4>
                  <p>{t('index.deepfakeDesc')}</p>
                </li>
                <li>
                  <h4>{t('index.evidenceLocker')}</h4>
                  <p>{t('index.evidenceDesc')}</p>
                </li>
              </ul>
              <button className="more-btn" type="button" onClick={() => toggleService("cyber")}>
                {serviceOpen.cyber ? t('index.hideDetails') : t('index.learnMore')}
              </button>
              <div className={`card-more ${serviceOpen.cyber ? "open" : ""}`}>
                <p>
                  {t('index.cyberMore')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Unique Value Section */}
      <section className="unique-value-section">
        <div className="container">
          <div className="unique-header">
            
            <h2 className="unique-heading">What Makes ShaktiX Unique?</h2>
            <p className="unique-subtitle">Three revolutionary advantages that set us apart in women's safety and security</p>
          </div>
          
          <div className="unique-grid">
            <div className="unique-card unified-platform">
              <div className="card-background">
                <div className="bg-pattern"></div>
              </div>
              <div className="unique-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="card-number">01</div>
              <h3>The Unified Platform</h3>
              <p>No other app combines health, safety, and cybersecurity into one comprehensive solution. Experience seamless protection across all aspects of your life.</p>
              <div className="card-features">
                <span className="feature-tag">All-in-One</span>
                <span className="feature-tag">Integrated</span>
                <span className="feature-tag">Comprehensive</span>
              </div>
            </div>

            <div className="unique-card proactive-protection">
              <div className="card-background">
                <div className="bg-pattern"></div>
              </div>
              <div className="unique-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="card-number">02</div>
              <h3>Proactive Protection</h3>
              <p>We don't just react to threats; our AI actively monitors and alerts users to potential risks before they escalate into dangerous situations.</p>
              <div className="card-features">
                <span className="feature-tag">AI-Powered</span>
                <span className="feature-tag">Predictive</span>
                <span className="feature-tag">24/7 Monitoring</span>
              </div>
            </div>

            <div className="unique-card blockchain-trust">
              <div className="card-background">
                <div className="bg-pattern"></div>
              </div>
              <div className="unique-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="card-number">03</div>
              <h3>Blockchain for Trust</h3>
              <p>Our use of blockchain for health data and legal evidence provides a level of security and immutable proof that is unmatched in the industry.</p>
              <div className="card-features">
                <span className="feature-tag">Immutable</span>
                <span className="feature-tag">Secure</span>
                <span className="feature-tag">Transparent</span>
              </div>
            </div>
          </div>
          
          <div className="unique-stats">
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime Guarantee</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Protected Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Monitoring</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Core Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="how-header">
           
            <h2 className="how-heading">How It Works</h2>
            <p className="how-subtitle">Five simple steps to complete protection and peace of mind</p>
          </div>
          
          <div className="how-steps">
            <div className={`how-step ${howOpen[0] ? "open" : ""}`}>
              <div className="step-visual">
                <div className="step-number">1</div>
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <div className="step-content">
                <h3>Enroll</h3>
                <p>Create your secure, single-point-of-entry profile in minutes with our intuitive setup process.</p>
                <div className="step-features">
                  <span className="feature-tag">Quick Setup</span>
                  <span className="feature-tag">Secure Profile</span>
                </div>
                <button className="more-btn sm" type="button" onClick={() => toggleHow(0)}>
                  {howOpen[0] ? "Hide details" : "Learn more"}
                </button>
                <div className={`card-more ${howOpen[0] ? "open" : ""}`}>
                  <p>We use strong encryption and privacy-by-design defaults to keep sign-up effortless and safe.</p>
                </div>
              </div>
            </div>

            <div className={`how-step ${howOpen[1] ? "open" : ""}`}>
              <div className="step-visual">
                <div className="step-number">2</div>
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
              </div>
              <div className="step-content">
                <h3>Connect</h3>
                <p>Seamlessly integrate with wearables, health apps, and other data sources for comprehensive monitoring.</p>
                <div className="step-features">
                  <span className="feature-tag">IoT Integration</span>
                  <span className="feature-tag">Real-time Sync</span>
                </div>
                <button className="more-btn sm" type="button" onClick={() => toggleHow(1)}>
                  {howOpen[1] ? "Hide details" : "Learn more"}
                </button>
                <div className={`card-more ${howOpen[1] ? "open" : ""}`}>
                  <p>Connect once, and your insights keep flowing securely across devices and services.</p>
                </div>
              </div>
            </div>

            <div className={`how-step ${howOpen[2] ? "open" : ""}`}>
              <div className="step-visual">
                <div className="step-number">3</div>
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </div>
              <div className="step-content">
                <h3>Protect</h3>
                <p>Our advanced AI continuously monitors for threats across health, safety, and cybersecurity domains.</p>
                <div className="step-features">
                  <span className="feature-tag">AI Monitoring</span>
                  <span className="feature-tag">24/7 Protection</span>
                </div>
                <button className="more-btn sm" type="button" onClick={() => toggleHow(2)}>
                  {howOpen[2] ? "Hide details" : "Learn more"}
                </button>
                <div className={`card-more ${howOpen[2] ? "open" : ""}`}>
                  <p>Signals are fused from multiple domains to catch risks early and reduce false alarms.</p>
                </div>
              </div>
            </div>

            <div className={`how-step ${howOpen[3] ? "open" : ""}`}>
              <div className="step-visual">
                <div className="step-number">4</div>
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    <circle cx="12" cy="8" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="step-content">
                <h3>Alert</h3>
                <p>Receive instant notifications and immediate support when potential risks are detected.</p>
                <div className="step-features">
                  <span className="feature-tag">Instant Alerts</span>
                  <span className="feature-tag">Emergency Support</span>
                </div>
                <button className="more-btn sm" type="button" onClick={() => toggleHow(3)}>
                  {howOpen[3] ? "Hide details" : "Learn more"}
                </button>
                <div className={`card-more ${howOpen[3] ? "open" : ""}`}>
                  <p>Choose alert preferences and escalation paths so the right help reaches you fast.</p>
                </div>
              </div>
            </div>

            <div className={`how-step ${howOpen[4] ? "open" : ""}`}>
              <div className="step-visual">
                <div className="step-number">5</div>
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    <path d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
              </div>
              <div className="step-content">
                <h3>Secure</h3>
                <p>All your data is automatically encrypted and secured on the blockchain for permanent records.</p>
                <div className="step-features">
                  <span className="feature-tag">Blockchain Security</span>
                  <span className="feature-tag">Data Integrity</span>
                </div>
                <button className="more-btn sm" type="button" onClick={() => toggleHow(4)}>
                  {howOpen[4] ? "Hide details" : "Learn more"}
                </button>
                <div className={`card-more ${howOpen[4] ? "open" : ""}`}>
                  <p>Immutable proofs help with audits, care continuity, and digital rights protection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
           
            <h2 className="testimonials-heading">What Our Users Say</h2>
            <p className="testimonials-subtitle">Real stories from women who have transformed their safety and security with ShaktiX</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card student-testimonial">
              <div className="testimonial-rating">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="testimonial-content">
                <p>"The AI SafeRoute helped me feel so much more confident walking home at night. It's a game-changer for my daily commute."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="author-info">
                  <h4>Ananya P.</h4>
                  <span>Student, Delhi University</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card mother-testimonial">
              <div className="testimonial-rating">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="testimonial-content">
                <p>"My medical records are always in one place, and I know they are secure. I feel so much more in control of my health and my family's wellbeing."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="author-info">
                  <h4>Kavita L.</h4>
                  <span>Mother & Working Professional</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card creator-testimonial">
              <div className="testimonial-rating">
                <div className="stars">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="testimonial-content">
                <p>"It's an amazing feeling to know I have a tool that can help protect me from digital harassment. The evidence locker is brilliant for my work."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="author-info">
                  <h4>Divya G.</h4>
                  <span>Digital Creator & Influencer</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonials-stats">
            <div className="testimonial-stat">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="testimonial-stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="testimonial-stat">
              <div className="stat-number">98%</div>
              <div className="stat-label">Would Recommend</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final Call to Action */}
      <section className="final-cta-section">
        <div className="cta-background">
          <div className="cta-pattern"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            
            <h2 className="cta-heading">Ready to Build a Safer Future?</h2>
            <p className="cta-text">Join thousands of women who have already taken control of their health, safety, and digital security. Your protection starts today.</p>
            
            <div className="cta-features">
              <div className="cta-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                  <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                </svg>
                <span>Free 30-day trial</span>
              </div>
              <div className="cta-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                </svg>
                <span>24/7 protection</span>
              </div>
              <div className="cta-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Bank-level security</span>
              </div>
            </div>
            
            <div className="cta-actions">
              <a href="/signup" className="cta-button primary">
                <span>Get Started Free</span>
                <svg className="cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </a>
              <a href="/services" className="cta-button secondary">
                <span>Learn More</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </a>
            </div>
            
           
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;