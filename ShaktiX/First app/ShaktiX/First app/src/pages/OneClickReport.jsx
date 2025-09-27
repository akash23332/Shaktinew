import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import "./oneclick.css";

export default function OneClickReport() {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [incidentType, setIncidentType] = useState("Harassment");
  const [platform, setPlatform] = useState("Instagram");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const userId = "user-000001";
  const timestamp = useMemo(() => new Date().toISOString(), []);

  const useCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch location: " + err.message);
      }
    );
  };

  const onFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles(picked);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate preparing a ready-to-share report JSON
    const payload = {
      userId,
      timestamp,
      contact: contact || undefined,
      location: location || undefined,
      incidentType,
      platform,
      description,
      evidence: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    };

    // For now, just show the JSON preview. This is where you'd call an API.
    setTimeout(() => {
      setSubmitting(false);
      const pretty = JSON.stringify(payload, null, 2);
      alert("Report prepared. Copy for platform/authority.\n\n" + pretty);
    }, 700);
  };

  // Ensure top-of-page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen services-page report-page">
      <Navigation />

      {/* Hero */}
      <section className="report-hero">
        <div className="container report-hero-content">
          <div className="report-badge">Rapid Action</div>
          <h1 className="report-title">One‑Click Report</h1>
          <p className="report-subtitle">
            File a report in seconds. Attach evidence and describe the incident. We'll guide you to the right next steps and
            prepare a ready‑to‑share report for platforms or authorities.
          </p>
          <button className="button outline lg" onClick={() => document.getElementById("report-form")?.scrollIntoView({ behavior: "smooth" })}>
            Report Now (One‑Click)
          </button>
        </div>
      </section>

      {/* Main content */}
      <section className="report-content">
        <div className="container report-grid">
          <div className="report-left">
            <form id="report-form" className="report-card" onSubmit={onSubmit}>
              <div className="card-head">
                <div className="card-icon">⚠️</div>
                <h2>Report Details</h2>
              </div>

              <div className="grid-2">
                <div>
                  <label className="auth-label">User ID</label>
                  <input className="auth-input" value={userId} readOnly />
                </div>
                <div>
                  <label className="auth-label">Contact (optional)</label>
                  <input className="auth-input" placeholder="Email or phone" value={contact} onChange={(e) => setContact(e.target.value)} />
                </div>
                <div>
                  <label className="auth-label">Timestamp (UTC)</label>
                  <input className="auth-input" value={timestamp} readOnly />
                </div>
                <div>
                  <label className="auth-label">Location</label>
                  <div className="input-with-button">
                    <input className="auth-input" placeholder="City, Country or coords" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <button type="button" className="button outline sm" onClick={useCurrentLocation}>Use Current Location</button>
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="auth-label">Incident type</label>
                  <select className="auth-input" value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
                    <option>Harassment</option>
                    <option>Impersonation</option>
                    <option>Deepfake / Image Abuse</option>
                    <option>Fraud / Scam</option>
                    <option>Doxxing</option>
                  </select>
                </div>
                <div>
                  <label className="auth-label">Platform</label>
                  <select className="auth-input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>WhatsApp</option>
                    <option>X (Twitter)</option>
                    <option>YouTube</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="auth-label">Incident description</label>
                <textarea className="auth-input report-textarea" placeholder="Describe what happened, include usernames, links, timestamps..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label className="auth-label">Attach evidence (images, videos, screenshots)</label>
                <input type="file" className="auth-input" multiple onChange={onFileChange} />
                {files.length > 0 && (
                  <ul className="evidence-list">
                    {files.map((f, i) => (
                      <li key={i}>{f.name} <span>({Math.round(f.size/1024)} KB)</span></li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="profile-actions">
                <button className="button primary lg" type="submit" disabled={submitting}>
                  {submitting ? "Preparing..." : "Generate Report"}
                </button>
                <button className="button outline lg" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <aside className="report-right">
            <div className="report-card tips">
              <div className="card-head">
                <h2>Quick Tips</h2>
              </div>
              <ul className="tips-list">
                <li>Save links, usernames, and timestamps.</li>
                <li>Attach screenshots or screen recordings.</li>
                <li>Don't engage further with the harasser or scammer.</li>
                <li>We'll generate a ready‑to‑send report for platforms.</li>
              </ul>
            </div>
            <div className="report-card guidance">
              <div className="card-head">
                <h2>Next Steps</h2>
              </div>
              <ol className="next-steps">
                <li>Review the generated report summary.</li>
                <li>Submit it to the relevant platform or local authority.</li>
                <li>Follow up using your case/reference number.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
