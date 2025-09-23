import React, { useState, useCallback } from 'react';
import axios from 'axios';

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [nlpText, setNlpText] = useState('');
  const [parsedSymptoms, setParsedSymptoms] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [inputMode, setInputMode] = useState('checkbox'); // 'checkbox' or 'nlp'
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [expandedSymptoms, setExpandedSymptoms] = useState(new Set());

  // Local keyword-based parser fallback for NLP mode
  const localParseSymptoms = (text) => {
    const t = (text || '').toLowerCase();
    const found = new Set();
    const addIf = (regex, id) => { if (regex.test(t)) found.add(id); };

    // Fever
    addIf(/\bfever|pyrexia|high temperature\b/, 's_13');
    // Headache / migraine
    addIf(/\bheadache|migraine|head pain\b/, 's_21');
    // Cough
    addIf(/\bcough|coughing\b/, 's_6');
    // Sore throat
    addIf(/\bsore throat|throat pain|throat hurts|pharyngitis\b/, 's_1193');
    // Fatigue
    addIf(/\bfatigue|tired(ness)?|exhaust(ed|ion)|low energy\b/, 's_98');
    // Nausea / vomiting
    addIf(/\bnausea|nauseous|vomit(ing)?|queasy\b/, 's_17');
    // Muscle aches / myalgia
    addIf(/\bmuscle ache(s)?|myalgia|body ache(s)?|sore muscles\b/, 's_10');
    // Runny nose / rhinorrhea
    addIf(/\brunny nose|rhinorrhea|nasal discharge|runny nostril(s)?\b/, 's_181');
    // Chest pain
    addIf(/\bchest pain|chest tight(ness)?|pressure in chest\b/, 's_50');
    // Shortness of breath / dyspnea
    addIf(/\bshort(ness)? of breath|breathless|dyspnea|difficulty breathing\b/, 's_18');
    // Dizziness / vertigo
    addIf(/\bdizz(y|iness)|lightheaded(ness)?|vertigo\b/, 's_156');
    // Stomach/abdominal pain
    addIf(/\bstomach pain|abdominal pain|tummy ache|belly ache\b/, 's_162');

    return Array.from(found);
  };

  // Debounced symptom parsing
  const parseSymptoms = useCallback(async (text) => {
    if (!text.trim()) {
      setParsedSymptoms([]);
      return;
    }

    setIsParsing(true);
    try {
      const response = await axios.post('http://localhost:3001/api/symptoms/parse', { text });
      const extractedSymptoms = response.data.symptoms.map(symptom => symptom.id);
      setParsedSymptoms(extractedSymptoms);
    } catch (error) {
      console.error('Error parsing symptoms:', error);
      // Fallback to local keyword-based parsing so UX still works without backend
      const local = localParseSymptoms(text);
      setParsedSymptoms(local);
    } finally {
      setIsParsing(false);
    }
  }, []);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const debouncedParse = useCallback(debounce(parseSymptoms, 500), [parseSymptoms]);

  const handleNlpTextChange = (e) => {
    const text = e.target.value;
    setNlpText(text);
    debouncedParse(text);
  };

  // Function to get detailed symptom information
  const getSymptomDescription = (symptomId) => {
    const descriptions = {
      's_13': 'Fever is a temporary increase in body temperature, usually caused by infection. Normal body temperature is around 98.6°F (37°C), and fever is typically considered when temperature exceeds 100.4°F (38°C).',
      's_21': 'Headache is pain or discomfort in the head or neck region. It can be caused by tension, migraines, dehydration, lack of sleep, or underlying medical conditions.',
      's_6': 'Cough is a reflex action to clear the airways of mucus, irritants, or foreign particles. It can be dry (non-productive) or productive (with mucus).',
      's_1193': 'Sore throat is pain, scratchiness, or irritation of the throat that often worsens when swallowing. It can be caused by viral infections, bacterial infections, or irritants.',
      's_98': 'Fatigue is a feeling of tiredness, exhaustion, or lack of energy that can be physical, mental, or both. It may be caused by inadequate sleep, stress, or medical conditions.',
      's_17': 'Nausea is an unpleasant feeling in the stomach that may lead to vomiting. It can be caused by motion sickness, food poisoning, pregnancy, or other medical conditions.',
      's_10': 'Muscle aches (myalgia) are pains in the muscles that can affect any part of the body. They are often caused by overuse, injury, infection, or autoimmune conditions.',
      's_181': 'Runny nose (rhinorrhea) is excess nasal discharge that can be clear, white, yellow, or green. It is commonly caused by allergies, infections, or irritants.',
      's_50': 'Chest pain is discomfort or pain in the chest area that can range from mild to severe. It may be caused by heart problems, lung issues, or musculoskeletal conditions.',
      's_18': 'Shortness of breath (dyspnea) is difficulty breathing or the feeling of not getting enough air. It can be caused by respiratory, cardiac, or other systemic conditions.',
      's_156': 'Dizziness is a sensation of lightheadedness, unsteadiness, or vertigo. It can be caused by inner ear problems, low blood pressure, dehydration, or neurological issues.',
      's_162': 'Stomach pain (abdominal pain) is discomfort in the abdominal area. It can range from mild to severe and may be caused by digestive issues, infections, or other conditions.'
    };

    return descriptions[symptomId] || 'Detailed information about this symptom is being analyzed.';
  };

  // Function to get helpful tips for managing symptoms
  const getSymptomTips = (symptomId) => {
    const tips = {
      's_13': [
        'Stay hydrated with water, clear broths, or electrolyte drinks',
        'Rest in a cool, comfortable environment',
        'Use a light blanket if you have chills',
        'Take fever-reducing medication like acetaminophen if needed'
      ],
      's_21': [
        'Rest in a dark, quiet room',
        'Apply a cold or warm compress to your forehead',
        'Stay hydrated and avoid caffeine',
        'Practice relaxation techniques like deep breathing'
      ],
      's_6': [
        'Stay hydrated to help loosen mucus',
        'Use a humidifier to moisten the air',
        'Try honey and lemon in warm water (for adults)',
        'Elevate your head while sleeping'
      ],
      's_1193': [
        'Gargle with warm salt water',
        'Stay hydrated and rest your voice',
        'Use throat lozenges or hard candy',
        'Avoid irritants like smoke and dry air'
      ],
      's_98': [
        'Get adequate sleep (7-9 hours per night)',
        'Stay hydrated and eat nutritious meals',
        'Take short breaks during activities',
        'Exercise regularly but avoid overexertion'
      ],
      's_17': [
        'Eat small, frequent meals',
        'Avoid strong odors and fatty foods',
        'Stay hydrated with clear fluids',
        'Try ginger tea or acupressure wristbands'
      ],
      's_10': [
        'Rest the affected muscles',
        'Apply ice or heat as appropriate',
        'Gentle stretching may help',
        'Over-the-counter pain relievers if needed'
      ],
      's_181': [
        'Use saline nasal sprays',
        'Stay hydrated and use a humidifier',
        'Blow your nose gently',
        'Avoid irritants like smoke and strong perfumes'
      ],
      's_50': [
        'Seek immediate medical attention if severe',
        'Rest and avoid strenuous activity',
        'Monitor your symptoms closely',
        'Contact emergency services if pain radiates to arm or jaw'
      ],
      's_18': [
        'Sit upright and stay calm',
        'Use pursed-lip breathing technique',
        'Seek immediate medical attention if severe',
        'Avoid lying flat and loosen tight clothing'
      ],
      's_156': [
        'Sit or lie down immediately',
        'Focus on a fixed point to reduce vertigo',
        'Move slowly when changing positions',
        'Stay hydrated and avoid sudden movements'
      ],
      's_162': [
        'Rest and avoid heavy meals',
        'Apply a heating pad to the area',
        'Stay hydrated and eat bland foods',
        'Seek medical attention if severe or persistent'
      ]
    };

    return tips[symptomId] || ['Monitor your symptoms and consult a healthcare professional if they persist or worsen.'];
  };

  const symptoms = [
    { id: 's_13', name: 'Fever', category: 'general' },
    { id: 's_21', name: 'Headache', category: 'neurological' },
    { id: 's_6', name: 'Cough', category: 'respiratory' },
    { id: 's_1193', name: 'Sore Throat', category: 'respiratory' },
    { id: 's_98', name: 'Fatigue', category: 'general' },
    { id: 's_17', name: 'Nausea', category: 'digestive' },
    { id: 's_10', name: 'Muscle Aches', category: 'musculoskeletal' },
    { id: 's_181', name: 'Runny Nose', category: 'respiratory' },
    { id: 's_50', name: 'Chest Pain', category: 'cardiovascular' },
    { id: 's_18', name: 'Shortness of Breath', category: 'respiratory' },
    { id: 's_156', name: 'Dizziness', category: 'neurological' },
    { id: 's_162', name: 'Stomach Pain', category: 'digestive' }
  ];

  const conditionRules = {
    'Common Cold': {
      symptoms: ['s_6', 's_1193', 's_181', 's_98'],
      minSymptoms: 2,
      description: 'A viral infection of the upper respiratory tract',
      recommendations: [
        'Get plenty of rest',
        'Stay hydrated',
        'Use throat lozenges for sore throat',
        'Consider over-the-counter pain relievers'
      ]
    },
    'Flu': {
      symptoms: ['s_13', 's_21', 's_10', 's_98', 's_6'],
      minSymptoms: 3,
      description: 'A viral infection that affects the respiratory system',
      recommendations: [
        'Get bed rest',
        'Drink plenty of fluids',
        'Consider antiviral medication (consult doctor)',
        'Monitor temperature regularly'
      ]
    },
    'Migraine': {
      symptoms: ['s_21', 's_17', 's_156'],
      minSymptoms: 2,
      description: 'A type of headache characterized by severe pain',
      recommendations: [
        'Rest in a dark, quiet room',
        'Apply cold or warm compress',
        'Stay hydrated',
        'Consider migraine medication'
      ]
    },
    'Gastroenteritis': {
      symptoms: ['s_17', 's_162', 's_98'],
      minSymptoms: 2,
      description: 'Inflammation of the stomach and intestines',
      recommendations: [
        'Stay hydrated with clear fluids',
        'Rest and avoid solid foods initially',
        'Gradually reintroduce bland foods',
        'Seek medical attention if symptoms persist'
      ]
    }
  };

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = async () => {
    let symptomsToAnalyze = inputMode === 'checkbox' ? selectedSymptoms : parsedSymptoms;

    // In NLP mode, if debounce hasn't populated yet, parse locally from current text
    if (inputMode === 'nlp' && symptomsToAnalyze.length === 0 && nlpText.trim()) {
      symptomsToAnalyze = localParseSymptoms(nlpText);
      setParsedSymptoms(symptomsToAnalyze);
    }

    if (symptomsToAnalyze.length === 0) return;

    setIsParsing(true);
    try {
      const response = await axios.post('http://localhost:3001/api/symptoms/diagnose', {
        symptoms: symptomsToAnalyze,
        age: 35, // Default age, could be made configurable
        sex: 'male' // Default sex, could be made configurable
      });

      const conditions = response.data.conditions.map(condition => ({
        name: condition.name,
        probability: condition.probability,
        description: `Common name: ${condition.common_name}${response.data.demo_mode ? ' (Demo Mode)' : ''}`,
        recommendations: response.data.demo_mode ? [
          'This is a demo analysis - for real diagnosis, configure Infermedica API',
          'Please consult a healthcare professional for accurate diagnosis',
          'This is not a substitute for medical advice'
        ] : [
          'Please consult a healthcare professional for accurate diagnosis',
          'This is not a substitute for medical advice',
          'Monitor your symptoms and seek medical attention if they worsen'
        ]
      }));

      setIsDemoMode(response.data.demo_mode || false);
      setResults(conditions);
      setShowResults(true);
    } catch (error) {
      console.error('Diagnosis error:', error);
      // Fallback to basic rule-based analysis if API fails
      const possibleConditions = [];

      Object.entries(conditionRules).forEach(([conditionName, rule]) => {
        const matchingSymptoms = symptomsToAnalyze.filter(symptom =>
          rule.symptoms.includes(symptom)
        );

        if (matchingSymptoms.length >= rule.minSymptoms) {
          const probability = Math.min(
            (matchingSymptoms.length / rule.symptoms.length) * 100,
            95
          );

          possibleConditions.push({
            name: conditionName,
            probability: Math.round(probability),
            description: rule.description,
            recommendations: rule.recommendations
          });
        }
      });

      possibleConditions.sort((a, b) => b.probability - a.probability);
      setResults(possibleConditions);
      setShowResults(true);
    } finally {
      setIsParsing(false);
    }
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setResults([]);
    setShowResults(false);
    setNlpText('');
    setParsedSymptoms([]);
    setInputMode('checkbox');
    setExpandedSymptoms(new Set());
  };

  const toggleSymptomExpansion = (symptomId) => {
    const newExpanded = new Set(expandedSymptoms);
    if (newExpanded.has(symptomId)) {
      newExpanded.delete(symptomId);
    } else {
      newExpanded.add(symptomId);
    }
    setExpandedSymptoms(newExpanded);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {!showResults ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '15px', color: '#ffffff' }}>
              AI Symptom Checker
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Describe your symptoms or select from the list to get preliminary health insights
            </p>
            <div style={{
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              marginTop: '20px'
            }}>
              <p style={{ color: '#ffc107', fontSize: '0.9rem', margin: 0 }}>
                ⚠️ This is for informational purposes only. Always consult a healthcare professional for proper diagnosis.
              </p>
              {isDemoMode && (
                <p style={{ color: '#ff9800', fontSize: '0.8rem', margin: '5px 0 0 0', fontStyle: 'italic' }}>
                  🔧 Demo Mode: Using simulated analysis. Configure Infermedica API for real medical data.
                </p>
              )}
            </div>
          </div>

          {/* Input Mode Selector */}
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '25px', padding: '5px' }}>
              <button
                onClick={() => setInputMode('checkbox')}
                style={{
                  background: inputMode === 'checkbox' ? 'linear-gradient(135deg, #00d4ff, #0099cc)' : 'transparent',
                  color: inputMode === 'checkbox' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Select Symptoms
              </button>
              <button
                onClick={() => setInputMode('nlp')}
                style={{
                  background: inputMode === 'nlp' ? 'linear-gradient(135deg, #00d4ff, #0099cc)' : 'transparent',
                  color: inputMode === 'nlp' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Describe Symptoms
              </button>
            </div>
          </div>

          {inputMode === 'checkbox' ? (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.3rem' }}>
                Select Your Symptoms ({selectedSymptoms.length} selected)
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    style={{
                      background: selectedSymptoms.includes(symptom.id)
                        ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: selectedSymptoms.includes(symptom.id)
                        ? '2px solid #00d4ff'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      color: selectedSymptoms.includes(symptom.id) ? '#ffffff' : '#94a3b8',
                      fontWeight: selectedSymptoms.includes(symptom.id) ? '600' : '400'
                    }}>
                      {symptom.name}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: selectedSymptoms.includes(symptom.id) ? 'rgba(255,255,255,0.8)' : '#64748b',
                      marginTop: '5px'
                    }}>
                      {symptom.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.3rem' }}>
                Describe Your Symptoms
              </h3>
              <textarea
                value={nlpText}
                onChange={handleNlpTextChange}
                placeholder="Describe your symptoms in natural language (e.g., 'I have a headache, fever, and sore throat')"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
              {isParsing && (
                <div style={{ marginTop: '10px', color: '#94a3b8', fontSize: '0.9rem' }}>
                  Analyzing your description...
                </div>
              )}
              {parsedSymptoms.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '15px' }}>
                    Detected Symptoms ({parsedSymptoms.length}):
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '15px'
                  }}>
                    {parsedSymptoms.map((symptomId) => {
                      const symptom = symptoms.find(s => s.id === symptomId);
                      const isExpanded = expandedSymptoms.has(symptomId);
                      return symptom ? (
                        <div
                          key={symptomId}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '15px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleSymptomExpansion(symptomId)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                                  color: '#ffffff',
                                  padding: '4px 10px',
                                  borderRadius: '15px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  marginRight: '10px'
                                }}
                              >
                                {symptom.category}
                              </div>
                              <h5 style={{ color: '#ffffff', margin: 0, fontSize: '1rem' }}>
                                {symptom.name}
                              </h5>
                            </div>
                            <div style={{
                              color: '#94a3b8',
                              fontSize: '1.2rem',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }}>
                              ▼
                            </div>
                          </div>

                          <div style={{
                            color: '#94a3b8',
                            fontSize: '0.9rem',
                            lineHeight: '1.4',
                            marginBottom: isExpanded ? '15px' : '0',
                            maxHeight: isExpanded ? 'none' : '3.6em',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                          }}>
                            {getSymptomDescription(symptom.id)}
                          </div>

                          {isExpanded && (
                            <div style={{
                              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                              paddingTop: '15px',
                              marginTop: '15px'
                            }}>
                              <h6 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: '8px' }}>
                                💡 Quick Tips:
                              </h6>
                              <ul style={{ color: '#94a3b8', fontSize: '0.85rem', paddingLeft: '20px', margin: 0 }}>
                                {getSymptomTips(symptom.id).map((tip, index) => (
                                  <li key={index} style={{ marginBottom: '4px' }}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={analyzeSymptoms}
              disabled={
                isParsing ||
                (inputMode === 'checkbox' && selectedSymptoms.length === 0) ||
                (inputMode === 'nlp' && nlpText.trim().length === 0)
              }
              className="gradient-button"
              style={{
                fontSize: '16px',
                padding: '15px 30px',
                opacity:
                  isParsing ||
                  (inputMode === 'checkbox' && selectedSymptoms.length === 0) ||
                  (inputMode === 'nlp' && nlpText.trim().length === 0)
                    ? 0.5 : 1,
                cursor:
                  isParsing ||
                  (inputMode === 'checkbox' && selectedSymptoms.length === 0) ||
                  (inputMode === 'nlp' && nlpText.trim().length === 0)
                    ? 'not-allowed' : 'pointer'
              }}
            >
              {isParsing ? 'Analyzing...' : `Analyze Symptoms (${inputMode === 'checkbox' ? selectedSymptoms.length : (parsedSymptoms.length || localParseSymptoms(nlpText).length)})`}
            </button>
          </div>
        </>
      ) : (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '15px', color: '#ffffff' }}>
              Analysis Results
            </h2>
            <p style={{ color: '#94a3b8' }}>
              Based on your symptoms: {
                (inputMode === 'checkbox' ? selectedSymptoms : parsedSymptoms)
                  .map(id => symptoms.find(s => s.id === id)?.name || id)
                  .join(', ')
              }
            </p>
          </div>

          {results.length > 0 ? (
            <div style={{ marginBottom: '30px' }}>
              {results.map((condition, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '25px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ color: '#ffffff', fontSize: '1.4rem', margin: 0 }}>
                      {condition.name}
                    </h3>
                  </div>
                  
                  <p style={{ color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
                    {condition.description}
                  </p>

                  <div style={{ marginBottom: '15px' }}>
                    <span style={{
                      background: condition.probability > 70 ? '#ef4444' :
                                 condition.probability > 40 ? '#f59e0b' : '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {condition.probability}% probability
                    </span>
                  </div>

                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '10px' }}>
                      Important Notes:
                    </h4>
                    <ul style={{ color: '#94a3b8', paddingLeft: '20px' }}>
                      {condition.recommendations.map((rec, idx) => (
                        <li key={idx} style={{ marginBottom: '5px' }}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '40px',
              marginBottom: '30px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🤔</div>
              <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>No Clear Matches</h3>
              <p style={{ color: '#94a3b8' }}>
                Your symptoms don't match our common condition patterns. Please consult a healthcare professional for proper evaluation.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button onClick={resetChecker} className="btn-cta" style={{ marginRight: '15px' }}>
              <span className="btn-icon-left">↻</span>
              Check New Symptoms
            </button>
            <button 
              onClick={() => window.open('tel:911', '_self')}
              style={{
                background: '#ef4444',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Emergency: Call 911
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;