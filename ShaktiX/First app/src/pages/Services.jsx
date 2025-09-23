import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen services-page">
      <Navigation />

      {/* Hero Section with Interactive Service Showcase */}
      <section className="services-hero">
        <div className="services-hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Comprehensive Protection
              <span className="gradient-text"> Solutions</span>
            </h1>
            <p className="hero-subtitle">
              Experience the future of personal safety with our integrated ecosystem of AI-powered protection services. 
              From health monitoring to cybersecurity, we provide complete coverage for modern life.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Core Services</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Monitoring</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Reliability</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="service-orbit">
              <div className="orbit-center">
                <div className="center-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="orbit-item orbit-1">
                <div className="orbit-icon">🏥</div>
                <div className="orbit-label">Health</div>
              </div>
              <div className="orbit-item orbit-2">
                <div className="orbit-icon">🛡️</div>
                <div className="orbit-label">Safety</div>
              </div>
              <div className="orbit-item orbit-3">
                <div className="orbit-icon">🔒</div>
                <div className="orbit-label">Cyber</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Navigation - Beautifully Positioned */}
      <section className="quick-access-section">
        <div className="container">
          <div className="quick-access-content">
            <div className="access-header">
              <h2>Choose Your Protection</h2>
              <p>Get instant access to the safety service you need most</p>
            </div>
            <div className="access-buttons">
              <a href="/health" className="access-btn health-access">
                <div className="access-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="access-info">
                  <h3>Health Protection</h3>
                  <p>AI monitoring & tele-clinic</p>
                </div>
                <div className="access-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
              
              <a href="/safety" className="access-btn safety-access">
                <div className="access-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="access-info">
                  <h3>Personal Safety</h3>
                  <p>Smart SOS & safe routes</p>
            </div>
                <div className="access-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
          </div>
              </a>
              
              <a href="/cybersecurity" className="access-btn cyber-access">
                <div className="access-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="access-info">
                  <h3>Cybersecurity</h3>
                  <p>Digital identity protection</p>
                </div>
                <div className="access-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
            </div>
              </a>
          </div>
            </div>
          </div>
      </section>

      {/* Service Showcase Grid */}
      <section className="service-showcase">
        <div className="container">
          <div className="section-header">
            <h2>Our Service Portfolio</h2>
            <p>Comprehensive protection across all aspects of your digital and physical life</p>
          </div>
          <div className="service-grid">
            <div className="service-card health-service">
              <div className="service-header">
                <div className="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="service-badge">Health Protection</div>
              </div>
              <h3>Proactive Health Monitoring</h3>
              <p>AI-powered health insights with blockchain-secured medical records and 24/7 tele-clinic support.</p>
              <div className="service-features">
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-text">Health Analytics</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🏥</div>
                  <div className="feature-text">Tele-clinic</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📱</div>
                  <div className="feature-text">IoT Monitoring</div>
                </div>
              </div>
              <div className="service-cta">
                <button className="service-btn">Learn More</button>
              </div>
            </div>

            <div className="service-card safety-service">
              <div className="service-header">
                <div className="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="service-badge">Personal Safety</div>
              </div>
              <h3>AI-Powered Safety Network</h3>
              <p>Real-time threat detection with smart routing, emergency response, and discreet SOS capabilities.</p>
              <div className="service-features">
                <div className="feature-item">
                  <div className="feature-icon">🗺️</div>
                  <div className="feature-text">Safe Routes</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚨</div>
                  <div className="feature-text">Smart SOS</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💍</div>
                  <div className="feature-text">Smart Ring</div>
                </div>
          </div>
              <div className="service-cta">
                <button className="service-btn">Learn More</button>
          </div>
        </div>

            <div className="service-card cyber-service">
              <div className="service-header">
                <div className="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="service-badge">Cybersecurity</div>
              </div>
              <h3>Digital Identity Protection</h3>
              <p>Advanced threat detection with voice authentication, deepfake detection, and blockchain evidence storage.</p>
              <div className="service-features">
                <div className="feature-item">
                  <div className="feature-icon">🎤</div>
                  <div className="feature-text">Voice Shield</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔍</div>
                  <div className="feature-text">Deepfake Detection</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⛓️</div>
                  <div className="feature-text">Evidence Locker</div>
                </div>
              </div>
              <div className="service-cta">
                <button className="service-btn">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Comparison Table */}
      <section className="service-comparison">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Protection Level</h2>
            <p>Select the plan that best fits your safety needs and lifestyle</p>
          </div>
          <div className="comparison-table">
            <div className="table-header">
              <div className="plan-header basic">
                <h3>Basic</h3>
                <div className="plan-price">$29<span>/month</span></div>
                <p>Essential protection for everyday safety</p>
              </div>
              <div className="plan-header premium">
                <h3>Premium</h3>
                <div className="plan-price">$59<span>/month</span></div>
                <p>Comprehensive protection with advanced features</p>
                <div className="popular-badge">Most Popular</div>
              </div>
              <div className="plan-header enterprise">
                <h3>Enterprise</h3>
                <div className="plan-price">$99<span>/month</span></div>
                <p>Complete ecosystem for organizations</p>
              </div>
            </div>
            <div className="table-body">
              <div className="feature-row">
                <div className="feature-name">AI SafeRoute</div>
                <div className="feature-value basic">✓</div>
                <div className="feature-value premium">✓</div>
                <div className="feature-value enterprise">✓</div>
              </div>
              <div className="feature-row">
                <div className="feature-name">Smart SOS</div>
                <div className="feature-value basic">✓</div>
                <div className="feature-value premium">✓</div>
                <div className="feature-value enterprise">✓</div>
              </div>
              <div className="feature-row">
                <div className="feature-name">Health Monitoring</div>
                <div className="feature-value basic">Basic</div>
                <div className="feature-value premium">Advanced</div>
                <div className="feature-value enterprise">Premium</div>
              </div>
              <div className="feature-row">
                <div className="feature-name">Cybersecurity Suite</div>
                <div className="feature-value basic">-</div>
                <div className="feature-value premium">✓</div>
                <div className="feature-value enterprise">✓</div>
              </div>
              <div className="feature-row">
                <div className="feature-name">24/7 Support</div>
                <div className="feature-value basic">Email</div>
                <div className="feature-value premium">Phone + Chat</div>
                <div className="feature-value enterprise">Dedicated Manager</div>
              </div>
              <div className="feature-row">
                <div className="feature-name">Team Management</div>
                <div className="feature-value basic">-</div>
                <div className="feature-value premium">-</div>
                <div className="feature-value enterprise">✓</div>
              </div>
            </div>
            <div className="table-footer">
              <button className="plan-btn basic">Get Started</button>
              <button className="plan-btn premium">Get Started</button>
              <button className="plan-btn enterprise">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Visualization */}
      <section className="tech-stack">
        <div className="container">
          <div className="section-header">
            <h2>Powered by Advanced Technology</h2>
            <p>Our services are built on cutting-edge technology for maximum reliability and security</p>
          </div>
          <div className="tech-layers">
            <div className="tech-layer ai-layer">
              <div className="layer-header">
                <div className="layer-icon">🤖</div>
                <h3>Artificial Intelligence</h3>
              </div>
              <div className="layer-tech">
                <div className="tech-item">Machine Learning</div>
                <div className="tech-item">Computer Vision</div>
                <div className="tech-item">Natural Language Processing</div>
                <div className="tech-item">Predictive Analytics</div>
              </div>
            </div>
            <div className="tech-layer iot-layer">
              <div className="layer-header">
                <div className="layer-icon">🌐</div>
                <h3>Internet of Things</h3>
              </div>
              <div className="layer-tech">
                <div className="tech-item">Smart Sensors</div>
                <div className="tech-item">Wearable Devices</div>
                <div className="tech-item">Edge Computing</div>
                <div className="tech-item">Real-time Data</div>
              </div>
            </div>
            <div className="tech-layer blockchain-layer">
              <div className="layer-header">
                <div className="layer-icon">⛓️</div>
                <h3>Blockchain Security</h3>
              </div>
              <div className="layer-tech">
                <div className="tech-item">Immutable Records</div>
                <div className="tech-item">Smart Contracts</div>
                <div className="tech-item">Cryptographic Security</div>
                <div className="tech-item">Decentralized Storage</div>
              </div>
            </div>
            <div className="tech-layer cloud-layer">
              <div className="layer-header">
                <div className="layer-icon">☁️</div>
                <h3>Cloud Infrastructure</h3>
              </div>
              <div className="layer-tech">
                <div className="tech-item">Auto-scaling</div>
                <div className="tech-item">99.9% Uptime</div>
                <div className="tech-item">Global CDN</div>
                <div className="tech-item">Disaster Recovery</div>
              </div>
          </div>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="process-flow">
        <div className="container">
          <div className="section-header">
            <h2>How Our Services Work</h2>
            <p>A seamless, integrated approach to your protection</p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Assessment & Setup</h3>
                <p>We analyze your needs and configure personalized protection settings</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="flow-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Continuous Monitoring</h3>
                <p>AI systems monitor your environment and health in real-time</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="flow-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Threat Detection</h3>
                <p>Advanced algorithms identify potential risks before they become problems</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="flow-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>Intelligent Response</h3>
                <p>Automated systems take action and alert appropriate responders</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="flow-step">
              <div className="step-number">05</div>
              <div className="step-content">
                <h3>Evidence & Recovery</h3>
                <p>Incidents are documented and you receive support for recovery</p>
          </div>
          </div>
          </div>
        </div>
      </section>

      {/* Service Benefits */}
      <section className="service-benefits">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose ShaktiX Services</h2>
            <p>Measurable benefits that make a real difference in your safety and peace of mind</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>85% Faster Response</h3>
              <p>AI-powered threat detection reduces emergency response time by 85% compared to traditional methods.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>99.9% Uptime</h3>
              <p>Enterprise-grade infrastructure ensures your protection is always active and reliable.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Zero Data Breaches</h3>
              <p>Blockchain-secured data with end-to-end encryption ensures your information stays private.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>24/7 Expert Support</h3>
              <p>Round-the-clock assistance from certified safety and cybersecurity professionals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Complete Protection?</h2>
            <p>Join thousands of users who trust ShaktiX for their safety and security needs.</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Start Free Trial</button>
              <button className="cta-btn secondary">Schedule Demo</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;


