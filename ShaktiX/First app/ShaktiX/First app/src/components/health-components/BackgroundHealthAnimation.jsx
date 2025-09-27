import React from "react";
import HeartbeatGraph from "./HeartbeatGraph";
import "./HealthCareProgram.css";

// Full-page, non-interactive background health animation
const BackgroundHealthAnimation = () => {
  return (
    <div className="bg-health" aria-hidden>
      {/* Multiple layers for depth */}
      <div className="bg-health-layer">
        <HeartbeatGraph bpm={80} height={260} amplitude={24} thickness={2.5} />
      </div>
      <div className="bg-health-layer bg-health-dim">
        <HeartbeatGraph bpm={64} height={200} amplitude={18} thickness={2} />
      </div>
    </div>
  );
};

export default BackgroundHealthAnimation;
