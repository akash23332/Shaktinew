import React, { useState, useEffect, useRef } from 'react';
import { format, differenceInDays, addDays } from "date-fns";
import "./pregnancytracker.css";

const PregnancyTracker = () => {
  const [lastPeriod, setLastPeriod] = useState("");
  const [customDueDate, setCustomDueDate] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);
  const [trimester, setTrimester] = useState(0);

  // Symptom log states
  const [symptomInput, setSymptomInput] = useState("");
  const [severityInput, setSeverityInput] = useState(1);
  const [symptoms, setSymptoms] = useState([]);

  // Daily reminders
  const initialReminders = [
    { id: 1, task: "Hydration", time: "5:00 AM", done: false },
    { id: 2, task: "Hydration", time: "12:00 PM", done: false },
    { id: 3, task: "Hydration", time: "4:00 PM", done: false },
    { id: 4, task: "Nutrition", time: "7:00 AM", done: false },
    { id: 5, task: "Nutrition", time: "1:00 PM", done: false },
    { id: 6, task: "Nutrition", time: "7:00 PM", done: false },
  ];
  const [reminders, setReminders] = useState(initialReminders);

  // Load persisted state
  useEffect(() => {
    try {
      const savedReminders = localStorage.getItem("sx_reminders");
      const savedSymptoms = localStorage.getItem("sx_symptoms");
      const savedLastPeriod = localStorage.getItem("sx_lastPeriod");
      const savedCustomDueDate = localStorage.getItem("sx_customDueDate");
      if (savedReminders) setReminders(JSON.parse(savedReminders));
      if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));
      if (savedLastPeriod) setLastPeriod(savedLastPeriod);
      if (savedCustomDueDate) setCustomDueDate(savedCustomDueDate);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state
  useEffect(() => {
    try { localStorage.setItem("sx_reminders", JSON.stringify(reminders)); } catch {}
  }, [reminders]);

  useEffect(() => {
    try { localStorage.setItem("sx_symptoms", JSON.stringify(symptoms)); } catch {}
  }, [symptoms]);

  useEffect(() => {
    try {
      localStorage.setItem("sx_lastPeriod", lastPeriod || "");
      localStorage.setItem("sx_customDueDate", customDueDate || "");
    } catch {}
  }, [lastPeriod, customDueDate]);

  // Calculate due date based on last menstrual period (Naegle's rule)
  const calculateDueDate = () => {
    if (!lastPeriod) {
      setDueDate(null);
      return;
    }
    const lpDate = new Date(lastPeriod);
    if (isNaN(lpDate)) {
      setDueDate(null);
      return;
    }
    const due = new Date(lpDate);
    due.setDate(due.getDate() + 280); // 40 weeks = 280 days
    setDueDate(due);
  };

  // Rough fetal stats (crown-to-heel length and weight) by typical weeks
  const getFetalStats = (week) => {
    const table = [
      { w: 12, len: 5.4, wt: 14 }, // cm, g
      { w: 16, len: 11.6, wt: 100 },
      { w: 20, len: 25.6, wt: 300 },
      { w: 24, len: 30.0, wt: 600 },
      { w: 28, len: 37.6, wt: 1000 },
      { w: 32, len: 42.4, wt: 1700 },
      { w: 36, len: 47.4, wt: 2600 },
      { w: 40, len: 51.2, wt: 3400 },
    ];
    if (week <= 0) return { lengthCm: "–", weightG: "–" };
    // Find nearest
    const closest = table.reduce((p, c) => Math.abs(c.w - week) < Math.abs(p.w - week) ? c : p);
    return { lengthCm: closest.len, weightG: closest.wt };
  };

  // Format date as dd/mm/yyyy
  const formatDateDDMMYYYY = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Use custom due date if provided (priority)
  useEffect(() => {
    if (customDueDate) {
      const customDate = new Date(customDueDate);
      if (!isNaN(customDate)) {
        setDueDate(customDate);
        return;
      }
    }
    calculateDueDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPeriod, customDueDate]);

  // Add symptom log entry
  const addSymptom = () => {
    if (!symptomInput.trim()) return;
    const newSymptom = {
      id: Date.now(),
      text: symptomInput.trim(),
      severity: severityInput,
      date: new Date().toISOString().slice(0, 10),
    };
    setSymptoms([newSymptom, ...symptoms]);
    setSymptomInput("");
    setSeverityInput(1);
  };

  // Toggle reminder done status
  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, done: !r.done } : r
      )
    );
  };

  // Derive weeks/days/trimester when dueDate is set
  useEffect(() => {
    if (!dueDate) {
      setWeeks(0);
      setDays(0);
      setTrimester(0);
      return;
    }
    const today = new Date();
    const totalDays = 280; // 40 weeks
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilDue = Math.floor((dueDate - today) / msPerDay);
    const daysCompleted = Math.min(Math.max(totalDays - daysUntilDue, 0), totalDays);
    const w = Math.floor(daysCompleted / 7);
    const d = daysCompleted % 7;
    setWeeks(w);
    setDays(d);
    if (w < 13) setTrimester(1);
    else if (w < 27) setTrimester(2);
    else setTrimester(3);
  }, [dueDate]);

  const calculateProgress = () => {
    const pct = ((weeks * 7 + days) / 280) * 100;
    return Math.min(Math.max(pct, 0), 100);
  };

  const getDaysRemaining = () => {
    if (!dueDate) return null;
    const msPerDay = 1000 * 60 * 60 * 24;
    const today = new Date();
    return Math.max(Math.ceil((dueDate - today) / msPerDay), 0);
  };

  // Baby size and development info by milestone weeks
  const getBabyMilestone = (week) => {
    const milestones = [
      { week: 4, size: "Poppy seed", emoji: "🌱", dev: "Implantation completes; neural tube begins forming." },
      { week: 8, size: "Raspberry", emoji: "🍓", dev: "All major organs start developing; heartbeat detectable." },
      { week: 12, size: "Lime", emoji: "🍈", dev: "Facial features refine; risk of miscarriage declines." },
      { week: 16, size: "Avocado", emoji: "🥑", dev: "Skeletal system strengthens; baby may start to move." },
      { week: 20, size: "Banana", emoji: "🍌", dev: "You may feel regular kicks; senses and sleep cycles improve." },
      { week: 24, size: "Corn", emoji: "🌽", dev: "Lungs develop branches; skin becomes less transparent." },
      { week: 28, size: "Eggplant", emoji: "🍆", dev: "Third trimester starts; eyes open and close; brain growth accelerates." },
      { week: 32, size: "Squash", emoji: "🎃", dev: "Bones fully formed but soft; rapid weight gain continues." },
      { week: 36, size: "Papaya", emoji: "🍈", dev: "Baby drops into pelvis; practicing breathing movements." },
      { week: 40, size: "Watermelon", emoji: "🍉", dev: "Full term; organs mature and ready for birth." },
    ];
    if (week <= 0) return { week: 0, size: "—", emoji: "🤰", dev: "Enter your dates to see growth updates." };
    return milestones.reduce((prev, curr) =>
      Math.abs(curr.week - week) < Math.abs(prev.week - week) ? curr : prev
    );
  };

  const calcRef = useRef(null);

  return (
    <div className="pregnancy-tracker">
      <header className="header-section">
        <div className="overlay"></div>
        <div className="header-content">
          <h1>Pregnancy Journey</h1>
          <p>Track your pregnancy with personalized insights, growth updates, and daily symptom monitoring.</p>
          <button className="start-tracking-btn" onClick={() => calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Start Tracking</button>
        </div>
      </header>

      <main className="main-content">
        {/* Due Date Calculator (always visible) and conditional cards */}

        {/* Due Date Calculator */}
        <section ref={calcRef} className="card due-date-calculator">
          <h3><i className="fa fa-calendar-alt"></i> Due Date Calculator</h3>
          <p>Calculate your estimated due date</p>
          <label>
            Last Menstrual Period
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              placeholder="dd/mm/yyyy"
              max={new Date().toISOString().slice(0, 10)}
            />
          </label>
          <label>
            Custom Due Date (Optional)
            <input
              type="date"
              value={customDueDate}
              onChange={(e) => setCustomDueDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>
          <div className="due-date-result" aria-live="polite">
            {dueDate ? (
              <p><strong>Estimated Due Date:</strong> {formatDateDDMMYYYY(dueDate)}</p>
            ) : (
              <p>Please enter your last menstrual period to see your due date.</p>
            )}
          </div>
        </section>

        {dueDate && (
          <section className="card progress-card-advanced">
            <h3><i className="fa fa-baby"></i> Pregnancy Progress</h3>
            <p>Your current pregnancy overview</p>
            <div className="progress-bar-container" aria-label="Pregnancy progress">
              <div className="progress-bar" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
            {/* Trimester timeline */}
            <div className="trimester-timeline" aria-hidden>
              <div className={`segment ${weeks < 13 ? 'active' : ''}`}></div>
              <div className={`segment ${weeks >= 13 && weeks < 27 ? 'active' : ''}`}></div>
              <div className={`segment ${weeks >= 27 ? 'active' : ''}`}></div>
              <div className="indicator" style={{ left: `${Math.min((weeks/40)*100, 100)}%` }}></div>
            </div>
            <div className="progress-metrics">
              <div className="metric">
                <div className="metric-label">Estimated Due Date</div>
                <div className="metric-value">{formatDateDDMMYYYY(dueDate)}</div>
              </div>
              <div className="metric">
                <div className="metric-label">Days remaining</div>
                <div className="metric-value">{getDaysRemaining()}</div>
              </div>
              <div className="metric">
                <div className="metric-label">Completion</div>
                <div className="metric-value">{calculateProgress().toFixed(0)}%</div>
              </div>
            </div>
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-value">{weeks}</span>
                <span className="stat-label">Weeks</span>
              </div>
              <div className="stat">
                <span className="stat-value">{days}</span>
                <span className="stat-label">Days</span>
              </div>
              <div className="stat">
                <span className="stat-value">{trimester}</span>
                <span className="stat-label">Trimester</span>
              </div>
            </div>
          </section>
        )}

        {dueDate && (
          <section className="card weekly-growth">
            <h3><i className="fa fa-seedling"></i> Weekly Growth</h3>
            <p>Week {weeks || 0} • Baby size and development</p>
            {(() => { const b = getBabyMilestone(weeks); return (
              <div className="baby-size" style={{ marginTop: 6 }}>
                <span className="baby-emoji" aria-hidden>{b.emoji}</span>
                <span className="baby-text">Size of a <strong>{b.size}</strong></span>
              </div>
            ); })()}
            {(() => { const s = getFetalStats(weeks); return (
              <div className="growth-stats">
                <div className="growth-item">
                  <div className="growth-label">Length</div>
                  <div className="growth-value">{s.lengthCm} cm</div>
                </div>
                <div className="growth-item">
                  <div className="growth-label">Weight</div>
                  <div className="growth-value">{s.weightG} g</div>
                </div>
              </div>
            ); })()}
            <div className="growth-stats">
              <div className="growth-item">
                <div className="growth-label">Due date</div>
                <div className="growth-value">{formatDateDDMMYYYY(dueDate)}</div>
              </div>
              <div className="growth-item">
                <div className="growth-label">Days remaining</div>
                <div className="growth-value">{getDaysRemaining()}</div>
              </div>
            </div>
            <div className="pregnancy-info">
              <div className="info-card">
                <h4>Development</h4>
                <p>{getBabyMilestone(weeks).dev}</p>
              </div>
            </div>
          </section>
        )}

        {/* Daily Symptom Log */}
        <section className="card symptom-log">
          <h3><i className="fa fa-stethoscope"></i> Daily Symptom Log</h3>
          <p>Track symptoms and their severity (1-10 scale)</p>
          <div className="symptom-entry">
            <input
              type="text"
              placeholder="Enter symptom (e.g., morning sickness, fatigue)"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSymptom()}
            />
            <input
              type="number"
              min="1"
              max="10"
              value={severityInput}
              onChange={(e) => setSeverityInput(Math.max(1, Math.min(10, Number(e.target.value))))}
            />
            <button onClick={addSymptom} aria-label="Add Symptom">+</button>
          </div>
          <ul className="symptom-list">
            {symptoms.length === 0 && <li>No symptoms logged yet.</li>}
            {symptoms.map(({ id, text, severity, date }) => (
              <li key={id}>
                <div className="symptom-text">{text}</div>
                <div className="symptom-date">{date}</div>
                <div className="symptom-severity">{severity}/10</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Daily Reminders */}
        <section className="card daily-reminders">
          <h3><i className="fa fa-clock"></i> Daily Reminders</h3>
          <p>Stay on top of your health routine</p>
          {/* Hydration & Nutrition Progress Glasses */}
          <div className="reminder-glasses">
            {(() => {
              const totalHydration = reminders.filter(r => r.task === "Hydration").length;
              const doneHydration = reminders.filter(r => r.task === "Hydration" && r.done).length;
              const pct = totalHydration ? Math.round((doneHydration / totalHydration) * 100) : 0;
              return (
                <div className="hydration-glass" aria-label={`Hydration ${pct}% complete`}>
                  <div className="glass">
                    <div className="water" style={{ height: `${pct}%` }} />
                    <div className="shine" />
                  </div>
                  <div className="glass-meta">
                    <div className="glass-percent">{pct}%</div>
                    <div className="glass-label">Hydration</div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const totalNutrition = reminders.filter(r => r.task === "Nutrition").length;
              const doneNutrition = reminders.filter(r => r.task === "Nutrition" && r.done).length;
              const pctN = totalNutrition ? Math.round((doneNutrition / totalNutrition) * 100) : 0;
              return (
                <div className="nutrition-glass" aria-label={`Nutrition ${pctN}% complete`}>
                  <div className="glass">
                    <div className="water" style={{ height: `${pctN}%` }} />
                    <div className="shine" />
                  </div>
                  <div className="glass-meta">
                    <div className="glass-percent">{pctN}%</div>
                    <div className="glass-label">Nutrition</div>
                  </div>
                </div>
              );
            })()}
          </div>
          <ul className="reminder-list">
            {reminders.map(({ id, task, time, done }) => (
              <li key={id} className={done ? "done" : ""}>
                <span className="reminder-icon">
                  <i className="fa fa-circle"></i>
                </span>
                <span className="reminder-task">{task}</span>
                <span className="reminder-time">{time}</span>
                <button
                  className="complete-btn"
                  onClick={() => toggleReminder(id)}
                  aria-label={`Mark ${task} at ${time} as complete`}
                >
                  {done ? "✓ Done" : "Click to complete"}
                </button>
              </li>
            ))}
          </ul>
        </section>

      </main>
    </div>
  );
};

export default PregnancyTracker;