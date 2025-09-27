import React, { useEffect } from "react";
import Navigation from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../components/health-components/HealthCareProgram.css";
import HealthScore from "../../components/health-components/HealthScore";

const HealthScoreAnalysis = () => {
  // Ensure the page opens from the top when navigating to this route
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);
  return (
    <div className="min-h-screen" style={{ paddingTop: "80px" }}>
      <Navigation />
      <section
        className="section section-full"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 140px)',
          padding: '20px'
        }}
      >
        <div style={{ width: '100%', maxWidth: 1120, margin: '0 auto' }}>
          {/* Overview widget */}
          <HealthScore showHeader={false} />

          {/* Guidance card */}
          <div className="card" style={{ maxWidth: 960, margin: "16px auto", padding: 24 }}>
            <p style={{ margin: 0, color: "#94a3b8" }}>
              Enter and track your key metrics over time to improve this score. This analysis is informational only and not a medical diagnosis.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HealthScoreAnalysis;

