import Navigation from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen about-page">
      <Navigation />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <h1 className="about-hero-title">
              Empowering Safety Through
              <span className="gradient-text"> Innovation</span>
            </h1>
            <p className="about-hero-subtitle">
              ShaktiX is revolutionizing personal safety with cutting-edge technology, 
              combining AI, IoT, and blockchain to create a comprehensive protection platform 
              that puts dignity, privacy, and freedom at the forefront.
            </p>
            <div className="about-hero-stats">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Lives Protected</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
          <div className="about-hero-visual">
            <div className="hero-graphic">
              <div className="floating-card card-1">
                <div className="card-icon">🛡️</div>
                <div className="card-text">AI Protection</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🔒</div>
                <div className="card-text">Secure Data</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">📱</div>
                <div className="card-text">Smart Alerts</div>
              </div>
              <div className="floating-card card-4">
                <div className="card-icon">🌐</div>
                <div className="card-text">IoT Network</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
          <h2>Our Mission</h2>
          <p>
                To empower women and families with proactive protection across health, safety, and cybersecurity. 
                We combine AI, IoT, and secure ledgers to deliver one trusted platform that protects dignity, 
                privacy, and everyday freedom.
              </p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h2>Our Vision</h2>
              <p>
                A world where safety and wellbeing are fundamental rights, not privileges. We envision a future 
                where technology anticipates risk, strengthens community support, and makes protection accessible 
                to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
        </section>

      {/* Our Story */}
      <section className="our-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
          <h2>Our Story</h2>
              <p className="story-lead">
                We started ShaktiX with a simple belief: safety and wellbeing should be a right, not a privilege.
              </p>
              <p>
                Our cross-disciplinary team builds technology that anticipates risk, strengthens community support, 
                and makes protection accessible to everyone. Founded by experts in AI, cybersecurity, and public 
                safety, we've created a platform that combines the best of modern technology with deep understanding 
                of real-world safety challenges.
              </p>
              <div className="story-highlights">
                <div className="highlight-item">
                  <div className="highlight-year">2020</div>
                  <div className="highlight-text">Founded with a vision for safer communities</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-year">2021</div>
                  <div className="highlight-text">First AI-powered safety system deployed</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-year">2022</div>
                  <div className="highlight-text">Expanded to 10 cities across India</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-year">2023</div>
                  <div className="highlight-text">Launched blockchain-secured data platform</div>
                </div>
              </div>
            </div>
            <div className="story-visual">
              <div className="story-image">
                <div className="image-placeholder">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Dignity</h3>
              <p>Every feature is designed to respect autonomy and privacy, ensuring users maintain control over their personal information and safety decisions.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Trust</h3>
              <p>Security-by-design with transparent governance and controls. We build systems that users can trust with their most sensitive information.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Impact</h3>
              <p>We measure success by real-world safety and wellness outcomes, not just technology metrics. Every feature must make a meaningful difference.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C17.7252 3.57007 19 5.13616 19 7C19 8.86384 17.7252 10.4299 16 10.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Inclusion</h3>
              <p>Products shaped by diverse voices and lived experiences. We ensure our solutions work for everyone, regardless of background or circumstance.</p>
            </div>
          </div>
        </div>
        </section>

      {/* Leadership Team */}
      <section className="leadership-team">
        <div className="container">
          <div className="section-header">
            <h2>Leadership Team</h2>
            <p>Meet the visionaries driving innovation in safety technology</p>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="member-info">
                <h3>Dr. Priya Sharma</h3>
                <div className="member-role">Founder & CEO</div>
                <p>Driving the vision for unified protection and ethical AI. Former cybersecurity researcher with 15+ years in digital safety.</p>
                <div className="member-social">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.366C3.274 4.224 4.194 3.299 5.337 3.299C6.477 3.299 7.401 4.224 7.401 5.366C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="member-info">
                <h3>Rajesh Kumar</h3>
                <div className="member-role">Chief Technology Officer</div>
                <p>Leads platform engineering across AI, blockchain, and IoT. Former Google engineer with expertise in scalable systems.</p>
                <div className="member-social">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.366C3.274 4.224 4.194 3.299 5.337 3.299C6.477 3.299 7.401 4.224 7.401 5.366C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="member-info">
                <h3>Anita Patel</h3>
                <div className="member-role">Head of Safety Operations</div>
                <p>Partners with responders and communities for real-world impact. Former police officer with 20+ years in public safety.</p>
                <div className="member-social">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.366C3.274 4.224 4.194 3.299 5.337 3.299C6.477 3.299 7.401 4.224 7.401 5.366C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

      {/* Technical Team */}
      <section className="technical-team">
        <div className="container">
          <div className="section-header">
            <h2>Technical Excellence</h2>
            <p>Meet the experts who make our technology work in the real world</p>
          </div>
          <div className="tech-team-grid">
            <div className="tech-member">
              <div className="tech-avatar">
                <div className="avatar-initials">AK</div>
              </div>
              <div className="tech-info">
                <h3>Alex Kumar</h3>
                <div className="tech-role">Senior Field Technician</div>
                <p>IoT deployments and site audits • 8 years experience</p>
                <div className="tech-skills">
                  <span className="skill-tag">IoT</span>
                  <span className="skill-tag">Hardware</span>
                  <span className="skill-tag">Networking</span>
                </div>
              </div>
            </div>
            <div className="tech-member">
              <div className="tech-avatar">
                <div className="avatar-initials">RS</div>
              </div>
              <div className="tech-info">
                <h3>Riya Shah</h3>
                <div className="tech-role">Support Engineer</div>
                <p>Device onboarding and diagnostics • 5 years experience</p>
                <div className="tech-skills">
                  <span className="skill-tag">Support</span>
                  <span className="skill-tag">Diagnostics</span>
                  <span className="skill-tag">Training</span>
                </div>
              </div>
            </div>
            <div className="tech-member">
              <div className="tech-avatar">
                <div className="avatar-initials">MV</div>
              </div>
              <div className="tech-info">
                <h3>Mohit Verma</h3>
                <div className="tech-role">Installation Lead</div>
                <p>Safety sensors and network tuning • 10 years experience</p>
                <div className="tech-skills">
                  <span className="skill-tag">Installation</span>
                  <span className="skill-tag">Sensors</span>
                  <span className="skill-tag">Security</span>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Community Says</h2>
            <p>Real stories from people whose lives we've helped protect</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"ShaktiX gave me peace of mind when I was traveling alone for work. The AI alerts and emergency response system made me feel safe and connected to help when I needed it most."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <div className="author-name">Sarah Mehta</div>
                  <div className="author-title">Business Consultant</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a parent, knowing my daughter has access to instant help through ShaktiX is invaluable. The privacy controls and family features give us both security and peace of mind."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">RJ</div>
                <div className="author-info">
                  <div className="author-name">Rajesh Joshi</div>
                  <div className="author-title">Software Engineer</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The community features and local safety network have been game-changers. It's not just technology - it's about building safer neighborhoods together."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">PG</div>
                <div className="author-info">
                  <div className="author-name">Priya Gupta</div>
                  <div className="author-title">Community Leader</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="partnerships">
        <div className="container">
          <div className="section-header">
            <h2>Trusted Partnerships</h2>
            <p>Collaborating with leading organizations to ensure robust, inclusive, and continuously validated solutions</p>
          </div>
          <div className="partners-grid">
            <div className="partner-category">
              <h3>Healthcare Networks</h3>
              <div className="partner-logos">
                <div className="partner-logo">🏥</div>
                <div className="partner-logo">⚕️</div>
                <div className="partner-logo">🏥</div>
              </div>
            </div>
            <div className="partner-category">
              <h3>Law Enforcement</h3>
              <div className="partner-logos">
                <div className="partner-logo">🚔</div>
                <div className="partner-logo">👮</div>
                <div className="partner-logo">🚔</div>
              </div>
            </div>
            <div className="partner-category">
              <h3>Research Labs</h3>
              <div className="partner-logos">
                <div className="partner-logo">🔬</div>
                <div className="partner-logo">🧪</div>
                <div className="partner-logo">🔬</div>
              </div>
            </div>
          </div>
        </div>
        </section>

      <Footer />
    </div>
  );
};

export default About;


