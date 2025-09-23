import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("");
  const formRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [locMsg, setLocMsg] = useState("Fetching your location…");

  const onSubmit = async (e) => {
    e.preventDefault();
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.sendForm(serviceId, templateId, formRef.current || e.currentTarget, publicKey);
        setStatus("Message sent! We'll get back to you soon.");
        (formRef.current || e.currentTarget).reset();
      } catch (_) {
        setStatus("Could not send via email service. Opening mail app...");
        const data = new FormData(e.currentTarget);
        const name = data.get("fullName");
        const email = data.get("email");
        const subject = data.get("subject");
        const message = data.get("message");
        window.location.href = `mailto:nikhilpalyal6@gmail.com?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(`From: ${name} <${email}>\n+\n${message}`)}`;
      }
    } else {
      const data = new FormData(e.currentTarget);
      const name = data.get("fullName");
      const email = data.get("email");
      const subject = data.get("subject");
      const message = data.get("message");
      window.location.href = `mailto:nikhilpalyal6@gmail.com?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(`From: ${name} <${email}>\n+\n${message}`)}`;
    }

    setTimeout(() => setStatus(""), 3000);
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocMsg("Geolocation not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setLocMsg("");
      },
      () => setLocMsg("Location permission denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <div className="min-h-screen services-page">
      <Navigation />

      <header className="contact-hero">
        <h1 className="services-heading">{t('contact.heading')}</h1>
        <p className="services-subtitle">{t('contact.subtitle')}</p>
      </header>

      <main className="contact-grid">
        <section className="contact-info">
          <div className="contact-card">
            <h2>Contact Information</h2>
            <p>Reach us through any of the channels below.</p>
            <ul className="contact-list">
              <li>
                <span className="ci-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                support@shaktix.com
              </li>
              <li>
                <span className="ci-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </span>
                +1 (555) 123-4567
              </li>
              <li>
                <span className="ci-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </span>
                San Francisco, CA
              </li>
            </ul>
            <div className="contact-social">
              <a href="#" aria-label="LinkedIn" className="social-link">in</a>
              <a href="#" aria-label="Twitter" className="social-link">t</a>
              <a href="#" aria-label="Facebook" className="social-link">f</a>
            </div>
          </div>

          <div className="map-card">
            <div className="map-embed" aria-label="Map">
              {coords ? (
                <iframe
                  title="Your Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 12 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&z=14&output=embed`}
                ></iframe>
              ) : (
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#86e7ff"}}>
                  {locMsg || "Loading map…"}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="contact-form-card">
          <h2>{t('contact.send')}</h2>
          <p className="contact-hint">{t('contact.hint')}</p>
          <form className="contact-form" onSubmit={onSubmit} ref={formRef}>
            <div className="grid-2">
              <div>
                <label className="auth-label" htmlFor="fullName">Full Name</label>
                <input className="auth-input" id="fullName" name="fullName" autoComplete="name" required />
              </div>
              <div>
                <label className="auth-label" htmlFor="email">Email</label>
                <input className="auth-input" id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>
            <div>
              <label className="auth-label" htmlFor="subject">Subject</label>
              <input className="auth-input" id="subject" name="subject" maxLength={120} required />
            </div>
            <div>
              <label className="auth-label" htmlFor="message">Message</label>
              <textarea className="auth-input contact-textarea" id="message" name="message" rows={6} placeholder="How can we help?" required />
            </div>
            <div className="profile-actions">
              <button className="button primary lg" type="submit">Send Message</button>
            </div>
            {status && <div className="save-toast" role="status">{status}</div>}
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;


