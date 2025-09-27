import React from "react";
import { useNavigate } from "react-router-dom";
import "./HealthCareProgram.css";
import healthAnalysisImg from "../../assets/health-analysis.jpg";
import aiTeleClinicImg from "../../assets/ai-tele-clinic.jpg";
import healthTrackerImg from "../../assets/health-tracker.jpg";
import healthLibraryImg from "../../assets/health-library.jpg";

const SERVICES = [
  {
    id: 1,
    title: "Health Analysis",
    subtitle: "Advanced Diagnostics",
    description: "Comprehensive lab and symptom analysis to spot health risks early.",
    image: healthAnalysisImg,
    features: [
      // Map to /health/analysis/*
      { label: "Nearby Doctors", route: "/health/analysis/nearby-doctors" },
      { label: "Health Score Analysis", route: "/health/analysis/health-score" },
      { label: "Video Doctor Consultation", route: "/health/tele-clinic/video-consultation" },
    ],
  },
  {
    id: 2,
    title: "AI Tele Clinic",
    subtitle: "Virtual Consultations",
    description: "Book secure video calls with certified doctors powered by AI triage.",
    image: aiTeleClinicImg,
    features: [
      // Map to /health/tele-clinic/*
      { label: "AI Symptom Checker", route: "/health/tele-clinic/symptom-checker" },
      { label: "Medical AI Chatbot", route: "/health/tele-clinic/chatbot" },
      { label: "Medicine Tracker", route: "/health/tele-clinic/medicine-tracker" },
    ],
  },
  {
    id: 3,
    title: "Health Tracker",
    subtitle: "Real-time Monitoring",
    description: "Monitor vitals and daily activity with instant insights and alerts.",
    image: healthTrackerImg,
    features: [
      { label: "Menstrual Tracker", route: "/health/tracker/menstrual-tracker" },
      { label: "Pregnancy Tracker", route: "/health/tracker/pregnancy-tracker" },
      { label: "Medical History", route: "/health/tracker/medical-history" },
    ],
  },
  {
    id: 4,
    title: "Health Library",
    subtitle: "Medical Knowledge",
    description: "Read curated articles and guides reviewed by medical professionals.",
    image: healthLibraryImg,
    features: [
      "Curated Articles",
      "Doctor Reviewed",
      "Save & Share",
    ],
  },
];

const ServicesGrid = () => {
  const navigate = useNavigate();
  return (
    <section className="section section-full services-section">
      <h2 className="section-title">Care Solutions</h2>
      <p className="section-subtitle">Choose a service to get started</p>
      <div className="services-container">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="service-card"
            data-id={service.id}
            aria-label={`${service.title} card`}
          >
            <div className="card-image-container">
              <img src={service.image} alt={service.title} className="card-image" />
              <div className="card-overlay">
                <div className="card-content">
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-subtitle small">{service.subtitle}</p>
                  <ul className="feature-list" aria-label="Key features">
                    {service.features?.map((f, idx) => {
                      const label = typeof f === 'string' ? f : f.label;
                      const route = typeof f === 'string' ? undefined : f.route;
                      return (
                        <li
                          className="feature-item"
                          key={idx}
                          style={{ "--i": idx, cursor: route ? 'pointer' : 'default' }}
                          role={route ? 'button' : undefined}
                          tabIndex={route ? 0 : -1}
                          aria-label={route ? `Open ${label}` : undefined}
                          onClick={(e) => {
                            // avoid triggering parent card navigation
                            e.stopPropagation();
                            if (route) navigate(route);
                          }}
                          onKeyDown={(e) => {
                            if (!route) return;
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(route);
                            }
                          }}
                        >
                          <span className="feature-dot" aria-hidden="true" />
                          <span className="feature-text">{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="card-desc">{service.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;

