import { useParams, Link } from "react-router-dom";
import healthAnalysisImg from "../../assets/health-analysis.jpg";
import aiTeleClinicImg from "../../assets/ai-tele-clinic.jpg";
import healthTrackerImg from "../../assets/health-tracker.jpg";
import healthLibraryImg from "../../assets/health-library.jpg";

const SERVICES = [
  { id: 1, title: "Health Analysis", subtitle: "Advanced Diagnostics", image: healthAnalysisImg, description: "Deep insights into your health using comprehensive diagnostics and trends." },
  { id: 2, title: "AI Tele Clinic", subtitle: "Virtual Consultations", image: aiTeleClinicImg, description: "Connect with doctors remotely using secure, real‑time video consultations." },
  { id: 3, title: "Health Tracker", subtitle: "Real-time Monitoring", image: healthTrackerImg, description: "Track vitals and activities with real‑time analytics and personalized alerts." },
  { id: 4, title: "Health Library", subtitle: "Medical Knowledge", image: healthLibraryImg, description: "Explore curated medical resources, guides, and trusted health articles." },
];

export default function ServiceDetail() {
  const { id } = useParams();
  const service = SERVICES.find((s) => String(s.id) === String(id));

  if (!service) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Service not found</h1>
        <Link to="/" style={{ color: "#0ea5a3" }}>Go back</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px" }}>
      <Link to="/" style={{ color: "#0ea5a3" }}>&larr; Back</Link>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start", marginTop: 16 }}>
        <img src={service.image} alt={service.title} style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
        <div>
          <h1 style={{ fontSize: 36, margin: 0, color: "#0ea5a3" }}>{service.title}</h1>
          <p style={{ margin: "8px 0 16px", color: "#64748b" }}>{service.subtitle}</p>
          <p style={{ lineHeight: 1.7, fontSize: 16 }}>{service.description}</p>
        </div>
      </div>
    </div>
  );
}

