import React, { useEffect } from "react";
import Navigation from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../components/health-components/HealthCareProgram.css";
import SymptomChecker from "../../components/health-components/SymptomChecker";

const AISymptomChecker = () => {
  // Ensure the page opens from the top when navigating here
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  return (
    <div className="min-h-screen" style={{ paddingTop: "80px" }}>
      <Navigation />
      <section className="section section-full" style={{ padding: "20px 0" }}>
        <div style={{ width: "100%", maxWidth: 1120, margin: "0 auto" }}>
          <SymptomChecker />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AISymptomChecker;
