import React, { useEffect } from "react";
import Navigation from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../components/health-components/HealthCareProgram.css";
import AiChatbot from "../../components/health-components/AiChatbot";

const AIChatbot = () => {
  // Open page from the top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  return (
    <div className="min-h-screen" style={{ paddingTop: "80px" }}>
      <Navigation />
      <section
        className="section"
        style={{
          maxWidth: 1120,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingInline: "1rem",
        }}
      >
        <AiChatbot />
      </section>
      <Footer />
    </div>
  );
};

export default AIChatbot;
