import React, { useEffect, useRef } from "react";
import "./HealthCareProgram.css";
import healthAnalysisImg from "../../assets/health-analysis.jpg";
import aiTeleClinicImg from "../../assets/ai-tele-clinic.jpg";
import healthTrackerImg from "../../assets/health-tracker.jpg";

const steps = [
  {
    id: 1,
    title: "Medical Walk‑In",
    desc: "Kickstart with a quick health status and profile setup.",
    points: [
      "Create your profile",
      "Sync health records",
      "Set personal goals",
      "See quick status",
    ],
  },
  {
    id: 2,
    title: "Remote Triage",
    desc: "Answer smart questions. AI summarizes for your doctor.",
    points: [
      "Smart symptom intake",
      "AI summary for doctor",
      "Instant recommendations",
      "Safe, encrypted chat",
    ],
  },
  {
    id: 3,
    title: "Next‑Step Plan",
    desc: "Personalized plan with reminders and progress tracking.",
    points: [
      "Daily checklist",
      "Vitals & reminders",
      "Progress dashboards",
      "Follow‑ups booked",
    ],
  },
];

export default function HealthRoute() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // compute step dot positions based on card vertical centers
    const computeDots = () => {
      const cards = Array.from(el.querySelectorAll('.route-card'));
      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY; // document Y of section
      const sectionHeight = el.offsetHeight || 1;
      cards.slice(0, 3).forEach((c, i) => {
        const cr = c.getBoundingClientRect();
        const cardCenterDocY = cr.top + window.scrollY + cr.height / 2;
        const rel = (cardCenterDocY - sectionTop) / sectionHeight; // 0..1
        const pct = Math.min(0.95, Math.max(0.05, rel));
        el.style.setProperty(`--dot${i + 1}-top`, `${(pct * 100).toFixed(2)}%`);
      });
    };

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      // How much of the section has been traversed (0..1)
      const total = rect.height + vh * 0.2; // add a bit of slack
      const progressed = Math.min(Math.max(vh * 0.8 - rect.top, 0), total);
      const pct = total > 0 ? progressed / total : 0;
      el.style.setProperty("--route-progress", String(pct));

      // Toggle reached classes when progress surpasses each dot top
      const p100 = pct * 100;
      const getTop = (n) => parseFloat((getComputedStyle(el).getPropertyValue(`--dot${n}-top`) || '0').replace('%','')) || 0;
      const t1 = getTop(1), t2 = getTop(2), t3 = getTop(3);
      el.querySelector('.route-wrapper')?.classList.toggle('reached-1', p100 >= t1 - 1);
      el.querySelector('.route-wrapper')?.classList.toggle('reached-2', p100 >= t2 - 1);
      el.querySelector('.route-wrapper')?.classList.toggle('reached-3', p100 >= t3 - 1);
    };

    const ro = new ResizeObserver(() => { computeDots(); onScroll(); });
    ro.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    computeDots();
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section route-section">
      <div className="route-header">
        <h2 className="route-title">HEALTHROUTE</h2>
        <p className="route-subtitle">Your Journey to Better Health</p>
      </div>

      <div className="route-wrapper">
        {/* Center rails + animated wavy spline */}
        <div className="route-line-rail" aria-hidden />
        <svg className="route-spline" viewBox="0 0 80 1000" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="splineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#26e1b1" />
            </linearGradient>
            <filter id="splineGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* twin rails to mimic double center line */}
          <rect x="37" y="0" width="2" height="1000" rx="1" fill="rgba(0,212,255,0.2)" />
          <rect x="41" y="0" width="2" height="1000" rx="1" fill="rgba(0,212,255,0.2)" />

          {/* Wavy spline path crossing center around steps */}
          <g className="spline-maskable">
            <path
              className="spline-glow"
              d="M 0 20 C 40 90, 40 150, 40 220
                 C 40 280, 75 340, 60 420
                 C 45 520, 15 620, 40 720
                 C 60 810, 75 900, 80 980"
              fill="none"
              stroke="#00c3ec"
              strokeWidth="6"
              opacity="0.5"
              filter="url(#splineGlow)"
            />
            <path
              className="spline-stroke"
              d="M 0 20 C 40 90, 40 150, 40 220
                 C 40 280, 75 340, 60 420
                 C 45 520, 15 620, 40 720
                 C 60 810, 75 900, 80 980"
              fill="none"
              stroke="url(#splineGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {/* Step dots positioned along the section (align with cards) */}
        <div className="route-step-dots" aria-hidden>
          <span className="route-step-dot route-dot-1" />
          <span className="route-step-dot route-dot-2" />
          <span className="route-step-dot route-dot-3" />
        </div>

        {/* Image popovers that reveal when reaching dots */}
        <div className="route-popovers" aria-hidden>
          <div className="route-popover right pop1" style={{ "--top": "var(--dot1-top)" }}>
            <img src={healthAnalysisImg} alt="Health Analysis" />
            <div className="pop-caption">Smart onboarding with quick health status</div>
          </div>
          <div className="route-popover left pop2" style={{ "--top": "var(--dot2-top)" }}>
            <img src={aiTeleClinicImg} alt="AI Tele Clinic" />
            <div className="pop-caption">Remote triage and AI‑assisted review</div>
          </div>
          <div className="route-popover right pop3" style={{ "--top": "var(--dot3-top)" }}>
            <img src={healthTrackerImg} alt="Health Tracker" />
            <div className="pop-caption">Personalized plan with progress tracking</div>
          </div>
        </div>

        <div className="route-steps">
          {steps.map((s, idx) => (
            <article key={s.id} className="route-card">
              <div className="route-step-number" aria-hidden>{idx + 1}</div>
              <div className="route-card-head">
                <span className="route-icon" aria-hidden />
                <h3 className="route-card-title">{s.title}</h3>
              </div>
              <p className="route-card-desc">{s.desc}</p>
              <ul className="route-list">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <button className="btn-primary route-cta">Get Started</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
