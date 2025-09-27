import React from "react";
import "./HealthCareProgram.css";
import Hero from "./Hero";
import ServicesGrid from "./ServicesGrid";
import HealthRoute from "./HealthRoute";

const HealthCarePlatform = () => {
  return (
    <div className="healthcare-platform">
      <Hero />
      <ServicesGrid />
      <HealthRoute />
    </div>
  );
};

export default HealthCarePlatform;