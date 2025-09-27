import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Note: background health animation runs globally; the dashboard card shows status only
import "./HealthCareProgram.css";
import Sparkline from "./Sparkline";

const Hero = () => {
  const navigate = useNavigate();
  // No local graph state; background animation runs separately

  const [hr, setHr] = useState(80);
  const [bp, setBp] = useState(118);

  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-title">
          Healthcare Excellence - Advanced Medical Solutions
        </h1>
        <p className="hero-subtitle">
          Revolutionizing patient care with cutting-edge technology, comprehensive health monitoring, and 24/7 emergency response. Your health is our priority with evidence-based treatment protocols.
        </p>
        <div className="hero-ctas">
          <button
            className="btn-primary"
            onClick={() => navigate("/health/tele-clinic/symptom-checker")}
            aria-label="Start Treatment"
          >
            Book Appointment
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/health/analysis/health-score")}
            aria-label="Learn more about health analysis"
          >
            Learn More
          </button>
        </div>
        <div className="kpis">
          <div className="kpi">
            <div className="kpi-value">25K+</div>
            <div className="kpi-label">Patients Supported</div>
          </div>
          <div className="kpi">
            <div className="kpi-value">97%</div>
            <div className="kpi-label">Symptom Triage Accuracy</div>
          </div>
          <div className="kpi">
            <div className="kpi-value">24/7</div>
            <div className="kpi-label">Care & Monitoring</div>
          </div>
        </div>
      </div>

      <div className="hero-right" role="region" aria-label="Health Dashboard">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <span className="status-bullet online" />
            <span className="dash-title">Patient Health Dashboard</span>
          </div>
          <div className="metric-grid" role="group" aria-label="Vitals summary">
            <div className="metric hr-card">
              <div className="metric-title">HEART RATE MONITOR</div>
              <div className="metric-value hr">{hr} BPM</div>
              <Sparkline color="#4cc3ff" glow="rgba(76,195,255,0.85)" range={[60, 105]} seed={hr} onValue={(v) => setHr(v)} />
            </div>
            <div className="metric bp-card">
              <div className="metric-title">BLOOD PRESSURE TREND</div>
              <div className="metric-value bp">{bp} mmHg</div>
              <Sparkline color="#5ad4a1" glow="rgba(90,212,161,0.85)" range={[100, 135]} seed={bp} onValue={(v) => setBp(v)} />
            </div>
          </div>
          <div className="status-row" aria-label="System status">
            <div className="status-pill"><span className="icon fire" /> System Active</div>
            <div className="status-pill"><span className="icon monitor" /> Monitoring 24/7</div>
            <div className="status-pill"><span className="icon lock" /> Data Encrypted</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
