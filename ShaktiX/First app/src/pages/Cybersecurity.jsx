import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./cyber.css";

export default function Cybersecurity() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen services-page cyber-page">
      <Navigation />

      {/* Hero */}
      <section className="cyber-hero">
        <div className="cyber-hero-overlay" />
        <div className="container cyber-hero-content">
          <div className="cyber-hero-badge">🔒 Cybersecurity</div>
          <h1 className="cyber-hero-title">
            Cybersecurity
            <br />
            <span className="cyber-hero-gradient">Protect your digital dignity</span>
          </h1>
          <p className="cyber-hero-subtitle">
            We help you fight deepfakes, harassment, and identity abuse with AI-powered
            protection, secure evidence collection, and privacy-first design.
          </p>
          <div className="cyber-hero-actions">
            <button
              className="button primary lg"
              onClick={() => navigate("/signup")}
            >
              Start Protection
            </button>
            <button
              className="button outline lg"
              onClick={() => navigate("/contact")}
            >
              Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header">
            <h2>What you get</h2>
            <p>Powerful tools that keep you safe in the modern internet</p>
          </div>
          <ul className="tech-grid">
            <li
              className="tech-card"
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label="Open Voice Shield"
              onClick={() => navigate("/voice-shield")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate("/voice-shield");
                }
              }}
            >
              <div className="tech-icon">🎤</div>
              <h3>Voice Shield</h3>
              <p>Authenticate calls and prevent AI-cloned voice scams with real-time checks.</p>
            </li>
            <li
              className="tech-card"
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label="Open Deepfake Detection"
              onClick={() => navigate("/deepfake-detection")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate("/deepfake-detection");
                }
              }}
            >
              <div className="tech-icon">🔍</div>
              <h3>Deepfake Detection</h3>
              <p>Detect manipulated media and protect your online image and reputation.</p>
            </li>
            <li
              className="tech-card"
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label="Open Evidence Locker"
              onClick={() => navigate("/evidence-locker")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate("/evidence-locker");
                }
              }}
            >
              <div className="tech-icon">⛓️</div>
              <h3>Evidence Locker</h3>
              <p>Securely store proofs with tamper-evident timestamps for escalation.</p>
            </li>
            <li
              className="tech-card"
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label="Open One-Click Report"
              onClick={() => navigate("/oneclickreport")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate("/oneclickreport");
                }
              }}
            >
              <div className="tech-icon">📨</div>
              <h3>One‑Click Report</h3>
              <p>Instantly file a structured incident report to platforms or authorities with attached evidence.</p>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
