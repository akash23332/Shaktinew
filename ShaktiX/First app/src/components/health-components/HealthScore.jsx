import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Backend base URL: set VITE_BACKEND_URL in your .env (e.g., http://localhost:3001)
const BASE_URL = (import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');

// ===== Local fallback calculators =====
const localBMI = (weightKg, heightCm) => {
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  const interpretation = bmi < 18.5
    ? 'Underweight - Consider gaining weight through nutritious foods'
    : bmi < 25
      ? 'Normal weight - Maintain healthy lifestyle'
      : bmi < 30
        ? 'Overweight - Consider weight management'
        : 'Obese - Consult healthcare provider for weight management plan';
  return { bmi: Math.round(bmi * 10) / 10, category, interpretation };
};

const localBMR = (weightKg, heightCm, age, gender) => {
  let bmr = 0;
  if ((gender || '').toLowerCase() === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return { bmr: Math.round(bmr), unit: 'calories/day' };
};

const localBodyFat = (bmi, age, gender) => {
  const g = (gender || '').toLowerCase();
  const val = g === 'male' ? (1.20 * bmi) + (0.23 * age) - 16.2 : (1.20 * bmi) + (0.23 * age) - 5.4;
  const pct = Math.max(0, Math.round(val * 10) / 10);
  const category = g === 'male'
    ? (val < 6 ? 'Essential Fat' : val < 14 ? 'Athletes' : val < 18 ? 'Fitness' : val < 25 ? 'Average' : 'Obese')
    : (val < 10 ? 'Essential Fat' : val < 18 ? 'Athletes' : val < 22 ? 'Fitness' : val < 32 ? 'Average' : 'Obese');
  return { bodyFatPercentage: pct, category };
};

const localIdealWeight = (heightCm, gender) => {
  const inches = heightCm / 2.54;
  const over = Math.max(0, inches - 60);
  const g = (gender || '').toLowerCase();
  const base = g === 'male' ? 48 : 45.5;
  const perInch = g === 'male' ? 2.7 : 2.2;
  const ideal = base + perInch * over;
  return {
    idealWeight: Math.round(ideal * 10) / 10,
    range: { min: Math.round(ideal * 0.9 * 10) / 10, max: Math.round(ideal * 1.1 * 10) / 10 },
    unit: 'kg'
  };
};

const localHealthScore = (metrics, age, gender, activity, heightCm) => {
  const metricConfigs = {
    weight: { weight: 0.15, optimal: { min: 50, max: 100 } },
    height: { weight: 0.05, optimal: { min: 150, max: 200 } },
    bloodPressure: { weight: 0.25, optimal: { min: 90, max: 120 } },
    heartRate: { weight: 0.2, optimal: { min: 60, max: 80 } },
    cholesterol: { weight: 0.2, optimal: { min: 125, max: 200 } },
    bloodSugar: { weight: 0.2, optimal: { min: 70, max: 100 } }
  };

  let totalScore = 0;
  let totalWeight = 0;

  metrics.forEach(m => {
    const cfg = metricConfigs[m.id];
    if (!cfg || m.value === 0) return;
    let optimal = cfg.optimal;
    if (m.id === 'weight' && heightCm && gender) {
      const inches = heightCm / 2.54;
      const over = Math.max(0, inches - 60);
      const base = (gender || '').toLowerCase() === 'male' ? 48 : 45.5;
      const perInch = (gender || '').toLowerCase() === 'male' ? 2.7 : 2.2;
      const ideal = base + perInch * over;
      optimal = { min: ideal * 0.9, max: ideal * 1.1 };
    }
    const { value, range } = m;
    let score = 0;
    if (value >= optimal.min && value <= optimal.max) score = 100;
    else if (value < optimal.min) {
      const distance = optimal.min - value;
      const maxDistance = optimal.min - (range ? range.min : 0);
      score = Math.max(0, 100 - (distance / maxDistance) * 100);
    } else {
      const distance = value - optimal.max;
      const maxDistance = (range ? range.max : value * 2) - optimal.max;
      score = Math.max(0, 100 - (distance / maxDistance) * 100);
    }
    totalScore += score * cfg.weight;
    totalWeight += cfg.weight;
  });

  let ageFactor = 1;
  if (age > 65) ageFactor = 0.95; else if (age > 50) ageFactor = 0.98; else if (age < 25) ageFactor = 1.02;
  let activityFactor = 1;
  switch ((activity || '').toLowerCase()) {
    case 'sedentary': activityFactor = 0.95; break;
    case 'light': activityFactor = 0.98; break;
    case 'moderate': activityFactor = 1; break;
    case 'active': activityFactor = 1.02; break;
    case 'very_active': activityFactor = 1.05; break;
  }
  const score = totalWeight > 0 ? Math.min(100, Math.round((totalScore / totalWeight) * ageFactor * activityFactor)) : 0;
  return score;
};

// Default metrics definition to support migration from older saved data
const DEFAULT_METRICS = [
  {
    id: 'height',
    name: 'Height',
    value: 0,
    unit: 'cm',
    range: { min: 120, max: 220, optimal: { min: 150, max: 200 } },
    weight: 0.05
  },
  {
    id: 'weight',
    name: 'Weight',
    value: 0,
    unit: 'kg',
    range: { min: 40, max: 150, optimal: { min: 50, max: 100 } },
    weight: 0.15
  },
  {
    id: 'bloodPressure',
    name: 'Blood Pressure (Systolic)',
    value: 0,
    unit: 'mmHg',
    range: { min: 80, max: 200, optimal: { min: 90, max: 120 } },
    weight: 0.25
  },
  {
    id: 'heartRate',
    name: 'Resting Heart Rate',
    value: 0,
    unit: 'bpm',
    range: { min: 40, max: 120, optimal: { min: 60, max: 80 } },
    weight: 0.2
  },
  {
    id: 'cholesterol',
    name: 'Total Cholesterol',
    value: 0,
    unit: 'mg/dL',
    range: { min: 100, max: 400, optimal: { min: 125, max: 200 } },
    weight: 0.2
  },
  {
    id: 'bloodSugar',
    name: 'Blood Sugar (Fasting)',
    value: 0,
    unit: 'mg/dL',
    range: { min: 60, max: 200, optimal: { min: 70, max: 100 } },
    weight: 0.2
  }
];

const HealthScore = ({ showHeader = true }) => {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  const [overallScore, setOverallScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('moderate');

  const updateAge = (value) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 120) {
      setAge(numValue);
    }
  };

  // API calculation results
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [bodyFat, setBodyFat] = useState(null);
  const [idealWeight, setIdealWeight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverOnline, setServerOnline] = useState(null); // null=unknown, true/false
  const [usingLocal, setUsingLocal] = useState(false);

  // Load saved data from localStorage (with migration to ensure defaults exist)
  useEffect(() => {
    const saved = localStorage.getItem('healthMetrics');
    if (saved) {
      const data = JSON.parse(saved);
      const savedMetrics = Array.isArray(data.metrics) ? data.metrics : [];
      // Merge: take defaults in order and override values from saved by id
      const merged = DEFAULT_METRICS.map(def => {
        const found = savedMetrics.find(m => m.id === def.id);
        return found ? { ...def, ...found } : def;
      });
      // Append any unknown metrics from saved (future extensibility)
      savedMetrics.forEach(m => {
        if (!merged.find(x => x.id === m.id)) merged.push(m);
      });
      setMetrics(merged);
      setAge(data.age || 30);
      setGender(data.gender || 'male');
      setActivity(data.activity || 'moderate');
    }
  }, []);

  // Save data to localStorage and calculate health metrics whenever inputs change
  useEffect(() => {
    localStorage.setItem('healthMetrics', JSON.stringify({
      metrics,
      age,
      gender,
      activity
    }));
    calculateHealthMetrics();
  }, [metrics, age, gender, activity]);

  // Poll backend health to show status badge
  useEffect(() => {
    let stopped = false;
    const check = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/health`, { timeout: 3000 });
        if (!stopped) setServerOnline(Boolean(res.data?.ok));
      } catch {
        if (!stopped) setServerOnline(false);
      }
    };
    check();
    const t = setInterval(check, 30000);
    return () => { stopped = true; clearInterval(t); };
  }, []);

  const calculateHealthMetrics = async () => {
    const weightMetric = metrics.find(m => m.id === 'weight');
    const heightMetric = metrics.find(m => m.id === 'height');

    if (!weightMetric?.value || !heightMetric?.value || !age || !gender) {
      setOverallScore(0);
      setBmi(null);
      setBmr(null);
      setBodyFat(null);
      setIdealWeight(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Optional: quick health check to fail fast if server is down/misconfigured
      let serverOk = true;
      try {
        const health = await axios.get(`${BASE_URL}/api/health`, { timeout: 4000 });
        if (!health.data?.ok) serverOk = false;
      } catch (hcErr) {
        serverOk = false;
      }
      if (!serverOk) {
        setServerOnline(false);
        throw new Error(`Backend not reachable at ${BASE_URL}. Falling back to local calculations.`);
      }

      // Calculate BMI
      const bmiResponse = await axios.post(`${BASE_URL}/api/health-calculations/bmi`, {
        weight: weightMetric.value,
        height: heightMetric.value
      });
      setBmi(bmiResponse.data);

      // Calculate BMR
      const bmrResponse = await axios.post(`${BASE_URL}/api/health-calculations/bmr`, {
        weight: weightMetric.value,
        height: heightMetric.value,
        age,
        gender
      });
      setBmr(bmrResponse.data);

      // Calculate Body Fat (needs BMI)
      const bodyFatResponse = await axios.post(`${BASE_URL}/api/health-calculations/body-fat`, {
        bmi: bmiResponse.data.bmi,
        age,
        gender
      });
      setBodyFat(bodyFatResponse.data);

      // Calculate Ideal Weight
      const idealWeightResponse = await axios.post(`${BASE_URL}/api/health-calculations/ideal-weight`, {
        height: heightMetric.value,
        gender
      });
      setIdealWeight(idealWeightResponse.data);

      // Calculate Overall Health Score
      const healthScoreResponse = await axios.post(`${BASE_URL}/api/health-calculations/health-score`, {
        metrics,
        age,
        gender,
        activity,
        height: heightMetric.value
      });
      setOverallScore(healthScoreResponse.data.overallScore);
      setUsingLocal(false);

    } catch (err) {
      console.error('Error calculating health metrics:', err);
      // Local fallback calculations
      try {
        const weightMetric = metrics.find(m => m.id === 'weight');
        const heightMetric = metrics.find(m => m.id === 'height');
        const bmiLocal = localBMI(weightMetric.value, heightMetric.value);
        setBmi(bmiLocal);
        const bmrLocal = localBMR(weightMetric.value, heightMetric.value, age, gender);
        setBmr(bmrLocal);
        const bodyFatLocal = localBodyFat(bmiLocal.bmi, age, gender);
        setBodyFat(bodyFatLocal);
        const idealWeightLocal = localIdealWeight(heightMetric.value, gender);
        setIdealWeight(idealWeightLocal);
        const scoreLocal = localHealthScore(metrics, age, gender, activity, heightMetric.value);
        setOverallScore(scoreLocal);
        setError(`Using local calculations. ${err?.message || ''}`.trim());
        setUsingLocal(true);
      } catch (fallbackErr) {
        const msg = err?.response?.data?.error || err?.message || 'Unknown error';
        setError(`Failed to calculate health metrics. ${msg}`);
        setOverallScore(0);
        setBmi(null);
        setBmr(null);
        setBodyFat(null);
        setIdealWeight(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Animate the score display whenever overallScore changes
  useEffect(() => {
    const duration = 600; // ms
    const start = performance.now();
    const from = displayScore;
    const to = overallScore;

    setPulse(true);

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.round(from + (to - from) * t);
      setDisplayScore(value);
      if (t < 1) {
        requestAnimationFrame(step);
      }
    };
    const raf = requestAnimationFrame(step);

    const timer = setTimeout(() => setPulse(false), duration + 100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [overallScore]);

  const updateMetric = (id, value) => {
    const metric = metrics.find(m => m.id === id);
    if (!metric) return;

    // Validate input value
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return;

    // Additional validation based on metric type
    if (id === 'height' && (numValue < 100 || numValue > 250)) return; // cm
    if (id === 'weight' && (numValue < 30 || numValue > 200)) return; // kg
    if (id === 'bloodPressure' && (numValue < 60 || numValue > 250)) return; // mmHg
    if (id === 'heartRate' && (numValue < 30 || numValue > 200)) return; // bpm
    if (id === 'cholesterol' && (numValue < 50 || numValue > 500)) return; // mg/dL
    if (id === 'bloodSugar' && (numValue < 40 || numValue > 300)) return; // mg/dL

    setMetrics(prev =>
      prev.map(metric =>
        metric.id === id ? { ...metric, value: numValue } : metric
      )
    );
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // Green
    if (score >= 70) return '#f59e0b'; // Yellow
    if (score >= 50) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score > 0) return 'Needs Improvement';
    return 'Incomplete Data';
  };

  const getMetricScore = (metric) => {
    if (metric.value === 0) return 0;

    const { value } = metric;
    const { optimal, min, max } = metric.range;

    if (value >= optimal.min && value <= optimal.max) {
      return 100;
    } else if (value < optimal.min) {
      const distance = optimal.min - value;
      const maxDistance = optimal.min - min;
      return Math.max(0, 100 - (distance / maxDistance) * 100);
    } else {
      const distance = value - optimal.max;
      const maxDistance = max - optimal.max;
      return Math.max(0, 100 - (distance / maxDistance) * 100);
    }
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (overallScore < 70) {
      recommendations.push("Consider consulting with a healthcare provider for a comprehensive health assessment");
    }
    
    metrics.forEach(metric => {
      const score = getMetricScore(metric);
      if (score < 70 && metric.value > 0) {
        switch (metric.id) {
          case 'weight':
            if (metric.value > metric.range.optimal.max) {
              recommendations.push("Consider a balanced diet and regular exercise to achieve healthy weight");
            } else {
              recommendations.push("Consider increasing caloric intake with nutritious foods");
            }
            break;
          case 'bloodPressure':
            recommendations.push("Monitor blood pressure regularly and consider lifestyle changes to improve cardiovascular health");
            break;
          case 'heartRate':
            recommendations.push("Incorporate cardiovascular exercise to improve heart health");
            break;
          case 'cholesterol':
            recommendations.push("Consider dietary changes and exercise to improve cholesterol levels");
            break;
          case 'bloodSugar':
            recommendations.push("Monitor blood sugar levels and consider dietary adjustments");
            break;
        }
      }
    });

    if (activity === 'sedentary') {
      recommendations.push("Increase physical activity - even light exercise can significantly improve health");
    }

    return recommendations;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {showHeader && (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '15px', color: '#ffffff' }}>
            Health Score Analysis
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Track your health metrics and get personalized insights
          </p>
          {/* Status Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            <span style={{
              padding: '6px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
              background: serverOnline === null ? 'rgba(255,255,255,0.06)'
                : serverOnline ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: serverOnline === null ? '1px solid rgba(255,255,255,0.12)'
                : serverOnline ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(239,68,68,0.35)',
              color: serverOnline === null ? '#94a3b8' : serverOnline ? '#10b981' : '#ef4444'
            }}>
              Server: {serverOnline === null ? 'Checking…' : serverOnline ? 'Online' : 'Offline'}
            </span>
            <span style={{
              padding: '6px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
              background: usingLocal ? 'rgba(99,102,241,0.15)' : 'rgba(14,165,233,0.15)',
              border: usingLocal ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(14,165,233,0.35)',
              color: usingLocal ? '#818cf8' : '#0ea5e9'
            }}>
              Mode: {usingLocal ? 'Local' : 'Backend'}
            </span>
          </div>
        </div>
      )}

      {/* Overall Score Display */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
          transform: pulse ? 'scale(1.08)' : 'scale(1)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: getScoreColor(overallScore) }} aria-live="polite">
            {displayScore}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SCORE</div>
        </div>
      </div>

      {/* Personal Info */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Personal Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => updateAge(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff'
              }}
              min="1"
              max="120"
              placeholder="Enter age"
            />
          </div>
          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff'
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff'
              }}
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light Activity</option>
              <option value="moderate">Moderate Activity</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 10, color: '#94a3b8', fontSize: '0.9rem' }}>
          Enter height (cm) and weight (kg) to unlock calculations. Other metrics improve accuracy.
        </div>
      </div>

      {/* Health Calculations */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Health Calculations</h3>
        {(!metrics.find(m => m.id === 'height')?.value || !metrics.find(m => m.id === 'weight')?.value) ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.2)',
            borderRadius: '10px'
          }}>
            <div style={{ color: '#ffc107', fontSize: '1.1rem', marginBottom: '10px' }}>
              📏 Enter both Height and Weight to see health calculations
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              BMI, BMR, Body Fat %, and Ideal Weight will be calculated automatically
            </div>
          </div>
        ) : (
          (bmi || bmr || bodyFat || idealWeight) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {bmi && (
                <div style={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00d4ff' }}>{bmi.bmi}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>BMI</div>
                  <div style={{ color: '#00d4ff', fontSize: '0.8rem', marginTop: '5px' }}>{bmi.category}</div>
                </div>
              )}
              {bmr && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '10px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e' }}>{bmr.bmr}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>BMR</div>
                  <div style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '5px' }}>{bmr.unit}</div>
                </div>
              )}
              {bodyFat && (
                <div style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  borderRadius: '10px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>{bodyFat.bodyFatPercentage}%</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Body Fat</div>
                  <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '5px' }}>{bodyFat.category}</div>
                </div>
              )}
              {idealWeight && (
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '10px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#a855f7' }}>{idealWeight.idealWeight} {idealWeight.unit}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Ideal Weight</div>
                  <div style={{ color: '#a855f7', fontSize: '0.8rem', marginTop: '5px' }}>
                    {idealWeight.range.min}-{idealWeight.range.max} {idealWeight.unit}
                  </div>
                </div>
              )}
            </div>
          )
        )}
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '15px', color: '#94a3b8' }}>
            Calculating...
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <div style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</div>
            <button
              onClick={calculateHealthMetrics}
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {loading ? 'Retrying...' : 'Retry Calculation'}
            </button>
          </div>
        )}
      </div>

      {/* Health Metrics */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Health Metrics</h3>
        {(!metrics.find(m => m.id==='height')?.value || !metrics.find(m => m.id==='weight')?.value) && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            color: '#ffc107',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            fontSize: '0.9rem'
          }}>
            Tip: Add both Height and Weight to start the calculations.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {metrics.map(metric => {
            const score = getMetricScore(metric);
            return (
              <div key={metric.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ color: '#ffffff', fontWeight: '500' }}>
                    {metric.name}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      Optimal: {metric.range.optimal.min}-{metric.range.optimal.max} {metric.unit}
                    </span>
                    {metric.value > 0 && (
                      <span style={{ 
                        color: getScoreColor(score),
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        Score: {Math.round(score)}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input
                    type="number"
                    value={metric.value || ''}
                    onChange={(e) => updateMetric(metric.id, Number(e.target.value))}
                    style={{
                      width: '120px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff'
                    }}
                    placeholder="Enter value"
                    min={metric.range.min}
                    max={metric.range.max}
                  />
                  <span style={{ color: '#94a3b8', minWidth: '50px' }}>{metric.unit}</span>
                  <div style={{ 
                    flex: 1, 
                    height: '8px', 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {metric.value > 0 && (
                      <div style={{
                        width: `${Math.min(100, (score / 100) * 100)}%`,
                        height: '100%',
                        background: getScoreColor(score),
                        borderRadius: '4px',
                        transition: 'all 0.3s ease'
                      }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {overallScore > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Health Recommendations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {getRecommendations().map((recommendation, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px',
                  background: 'rgba(0, 212, 255, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 212, 255, 0.2)'
                }}
              >
                <span style={{ color: '#00d4ff', fontSize: '1.2rem' }}>💡</span>
                <span style={{ color: '#94a3b8', lineHeight: '1.5' }}>{recommendation}</span>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#ffc107', fontSize: '0.9rem', margin: 0 }}>
              ⚠️ This tool provides general health insights only. Always consult healthcare professionals for medical advice and before making significant health changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthScore;