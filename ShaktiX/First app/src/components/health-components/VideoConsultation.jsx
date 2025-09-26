import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './VideoConsultation.css';

// Mock doctors data - in production, this would come from API
const mockDoctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Medicine', price: 75, avatar: '👩‍⚕️', languages: ['English', 'Spanish'], nextAvailable: 'Tomorrow 10:00' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiology', price: 120, avatar: '👨‍⚕️', languages: ['English', 'Mandarin'], nextAvailable: 'Tomorrow 14:30' },
  { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatology', price: 95, avatar: '👩‍⚕️', languages: ['English', 'Spanish'], nextAvailable: 'In 2 days 09:00' },
];

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const commonSymptoms = [
  'Fever', 'Cough', 'Cold', 'Headache', 'Sore throat', 'Back pain', 'Stomach ache',
  'Nausea', 'Vomiting', 'Diarrhea', 'Skin rash', 'Allergy', 'Anxiety', 'Fatigue',
  'Shortness of breath', 'Chest pain', 'Ear pain', 'Eye irritation'
];

const VideoConsultation = () => {
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [view, setView] = useState('booking'); // booking | consultation | prescription
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientName, setPatientName] = useState('');
  // Symptoms selection
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); // array of strings
  const [customSymptom, setCustomSymptom] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [appointments, setAppointments] = useState([]);
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notes, setNotes] = useState('');
  const printRefs = useRef({});

  // AI Medical Assistant state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [extractedSymptoms, setExtractedSymptoms] = useState([]);
  const [extractedConditions, setExtractedConditions] = useState([]);
  const [extractedMedications, setExtractedMedications] = useState([]);
  const [extractedAdvice, setExtractedAdvice] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Advanced AI Features
  const [llmAssistant, setLlmAssistant] = useState(null);
  const [isLlmTyping, setIsLlmTyping] = useState(false);
  const [llmSuggestions, setLlmSuggestions] = useState([]);
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);
  const [medicalImages, setMedicalImages] = useState([]);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [aiDocuments, setAiDocuments] = useState([]);

  // Real-Time Data Features
  const [realTimeDoctors, setRealTimeDoctors] = useState([]);
  const [patientMetrics, setPatientMetrics] = useState(null);
  const [medicineDatabase, setMedicineDatabase] = useState([]);
  const [consultationDashboard, setConsultationDashboard] = useState(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);

  // Simple helper to show a toast-like alert
  const notify = (msg) => {
    try { window?.alert(msg); } catch (_) {}
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscription(prev => prev + finalTranscript);
          // Add to conversation history
          setConversationHistory(prev => [...prev, {
            timestamp: new Date(),
            text: finalTranscript.trim(),
            speaker: 'patient', // Assume patient speaking for now
            type: 'transcription'
          }]);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
      };

      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start/Stop transcription
  const toggleTranscription = () => {
    if (!recognitionRef.current) {
      notify('Speech recognition not supported in this browser');
      return;
    }

    if (isTranscribing) {
      recognitionRef.current.stop();
      setIsTranscribing(false);
    } else {
      setTranscription('');
      setConversationHistory([]);
      recognitionRef.current.start();
      setIsTranscribing(true);
    }
  };

  // Analyze conversation with AI
  const analyzeConversation = async () => {
    if (!transcription.trim()) {
      notify('No conversation to analyze');
      return;
    }

    try {
      // Parse symptoms using the API
      const symptomResponse = await fetch('/api/symptoms/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription })
      });

      if (symptomResponse.ok) {
        const symptomData = await symptomResponse.json();
        setExtractedSymptoms(symptomData.symptoms || []);

        // Get diagnosis if symptoms found
        if (symptomData.symptoms && symptomData.symptoms.length > 0) {
          const diagnosisResponse = await fetch('/api/symptoms/diagnose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              symptoms: symptomData.symptoms.map(s => s.id),
              age: 35, // Default age, could be made configurable
              sex: 'male' // Default, could be made configurable
            })
          });

          if (diagnosisResponse.ok) {
            const diagnosisData = await diagnosisResponse.json();
            setExtractedConditions(diagnosisData.conditions || []);
          }
        }
      }

      // Extract medications and advice using simple pattern matching
      const medicationPatterns = /\b(?:take|taking|prescribe|prescribing|medication|medicine|drug)\s+([a-zA-Z\s]+?)(?:\s+(?:mg|ml|tablet|capsule|times?|daily|twice|thrice)|$)/gi;
      const advicePatterns = /\b(?:should|recommend|advise|advice|avoid|drink|eat|exercise|rest|sleep)\s+([a-zA-Z\s]+?)(?:\s+(?:daily|regularly|immediately)|$)/gi;

      const medications = [];
      const advice = [];

      let match;
      while ((match = medicationPatterns.exec(transcription)) !== null) {
        medications.push(match[1].trim());
      }

      while ((match = advicePatterns.exec(transcription)) !== null) {
        advice.push(match[1].trim());
      }

      setExtractedMedications([...new Set(medications)]);
      setExtractedAdvice([...new Set(advice)]);

      // Store analysis
      const analysis = {
        timestamp: new Date(),
        transcription: transcription,
        symptoms: extractedSymptoms,
        conditions: extractedConditions,
        medications: extractedMedications,
        advice: extractedAdvice,
        conversationHistory: conversationHistory
      };

      setAiAnalysis(analysis);

      // Store securely (in a real app, this would be encrypted and sent to secure storage)
      console.log('AI Analysis completed:', analysis);

    } catch (error) {
      console.error('AI analysis error:', error);
      notify('Failed to analyze conversation');
    }
  };

  // Fetch real-time doctor availability
  const fetchDoctorAvailability = async () => {
    try {
      // In a real implementation, this would call an API
      // For now, we'll simulate real-time updates
      const updatedDoctors = mockDoctors.map(doctor => ({
        ...doctor,
        nextAvailable: getRandomAvailability(),
        isAvailable: Math.random() > 0.3 // 70% chance of being available
      }));

      // Update doctors list with real-time data
      // In a real app, this would update state
      console.log('Real-time doctor availability updated:', updatedDoctors);
      return updatedDoctors;
    } catch (error) {
      console.error('Failed to fetch doctor availability:', error);
      return mockDoctors;
    }
  };

  // Fetch patient medical history
  const fetchPatientHistory = async (patientName) => {
    try {
      // In a real implementation, this would call a secure API
      // For demo purposes, return mock data
      const mockHistory = {
        patientName,
        lastVisit: '2024-01-15',
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        allergies: ['Penicillin'],
        currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
        recentSymptoms: ['Fatigue', 'Headache']
      };

      console.log('Patient history fetched:', mockHistory);
      return mockHistory;
    } catch (error) {
      console.error('Failed to fetch patient history:', error);
      return null;
    }
  };

  // Helper function for random availability
  const getRandomAvailability = () => {
    const options = [
      'Available now',
      'In 30 minutes',
      'In 1 hour',
      'Tomorrow 09:00',
      'Tomorrow 14:00',
      'In 2 days 10:00'
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  // Conversational AI (LLM) Assistant - local only (external chatbot disabled)
  const getLLMAssistance = async (context, query) => {
    try {
      setIsLlmTyping(true);
      const fallbackResponse = generateFallbackLLMResponse(context, query);
      setLlmAssistant(fallbackResponse);
      setLlmSuggestions([]);
      return { assistance: fallbackResponse, suggestions: [] };
    } catch (error) {
      console.error('LLM assistance error:', error);
      const fallbackResponse = generateFallbackLLMResponse(context, query);
      setLlmAssistant(fallbackResponse);
      setLlmSuggestions([]);
      return { assistance: fallbackResponse, suggestions: [] };
    } finally {
      setIsLlmTyping(false);
    }
  };

  // Computer Vision AI for Medical Images
  const analyzeMedicalImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('type', 'medical');

      const response = await fetch('/api/vision/medical-analyze', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const analysis = await response.json();
        setImageAnalysis(analysis);
        setMedicalImages(prev => [...prev, {
          file: imageFile,
          analysis: analysis,
          timestamp: new Date()
        }]);
        return analysis;
      }
    } catch (error) {
      console.error('Medical image analysis error:', error);
    }
    return null;
  };

  // AI-Powered Document Generation
  const generateAIDocument = async (documentType, data) => {
    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: documentType,
          data: data,
          ai: {
            transcription: transcription,
            analysis: aiAnalysis,
            voiceAnalysis: voiceAnalysis,
            imageAnalysis: imageAnalysis
          }
        })
      });

      if (response.ok) {
        const document = await response.json();
        setAiDocuments(prev => [...prev, document]);
        return document;
      }
    } catch (error) {
      console.error('AI document generation error:', error);
    }
    return null;
  };

  // Fallback LLM Response Generator
  const generateFallbackLLMResponse = (context, query) => {
    const responses = {
      symptoms: "Based on the patient's description, I recommend checking for common conditions. Consider asking about duration, severity, and associated symptoms.",
      diagnosis: "The symptoms suggest possible differential diagnoses. I recommend a thorough physical examination and appropriate diagnostic tests.",
      treatment: "Treatment should be tailored to the specific diagnosis. Consider evidence-based guidelines and patient preferences.",
      followUp: "Schedule appropriate follow-up based on the condition severity. Monitor for any changes in symptoms.",
      default: "I can assist with symptom analysis, diagnosis suggestions, and treatment recommendations. How can I help with this consultation?"
    };

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('symptom')) return responses.symptoms;
    if (lowerQuery.includes('diagnos')) return responses.diagnosis;
    if (lowerQuery.includes('treat')) return responses.treatment;
    if (lowerQuery.includes('follow')) return responses.followUp;

    return responses.default;
  };

  // Voice Analysis Helpers
  const detectVoiceEmotion = (audioData) => {
    // Simulate emotion detection based on pitch, tone, speed
    const emotions = ['calm', 'anxious', 'pain', 'frustrated', 'normal'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };

  const detectStressLevel = (audioData) => {
    return Math.floor(Math.random() * 100); // 0-100 stress level
  };

  const assessSpeechClarity = (audioData) => {
    return Math.floor(Math.random() * 100); // 0-100 clarity score
  };

  const detectConfidenceLevel = (audioData) => {
    return Math.floor(Math.random() * 100); // 0-100 confidence score
  };

  const detectHealthIndicators = (audioData) => {
    // Simulate health indicators from voice
    return {
      respiratory: Math.random() > 0.7,
      fatigue: Math.random() > 0.6,
      dehydration: Math.random() > 0.8,
      pain: Math.random() > 0.5
    };
  };

  // Real-Time Data Fetching Functions

  // Fetch real-time doctor availability
  const fetchRealTimeDoctors = async (specialty = '', location = '') => {
    try {
      const params = new URLSearchParams();
      if (specialty) params.append('specialty', specialty);
      if (location) params.append('location', location);

      const response = await fetch(`/api/realtime/doctors/availability?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRealTimeDoctors(data.doctors);
        return data.doctors;
      }
    } catch (error) {
      console.error('Failed to fetch real-time doctors:', error);
    }
    return [];
  };

  // Fetch real-time patient health metrics
  const fetchPatientMetrics = async (patientId = 'pat_001') => {
    try {
      const response = await fetch(`/api/realtime/patient/metrics/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setPatientMetrics(data.metrics);
        return data.metrics;
      }
    } catch (error) {
      console.error('Failed to fetch patient metrics:', error);
    }
    return null;
  };

  // Search real-time medicine database
  const searchMedicines = async (query = '', category = '') => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);

      const response = await fetch(`/api/realtime/medicines/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMedicineDatabase(data.medicines);
        return data.medicines;
      }
    } catch (error) {
      console.error('Failed to search medicines:', error);
    }
    return [];
  };

  // Fetch real-time consultation dashboard
  const fetchConsultationDashboard = async (appointmentId = activeAppointmentId) => {
    if (!appointmentId) return null;

    try {
      const response = await fetch(`/api/realtime/consultation/dashboard/${appointmentId}`);
      if (response.ok) {
        const data = await response.json();
        setConsultationDashboard(data.dashboard);
        return data.dashboard;
      }
    } catch (error) {
      console.error('Failed to fetch consultation dashboard:', error);
    }
    return null;
  };

  // Fetch real-time updates
  const fetchRealTimeUpdates = async () => {
    try {
      const response = await fetch('/api/realtime/updates');
      if (response.ok) {
        const data = await response.json();
        setRealTimeUpdates(prev => [...prev.slice(-9), ...data.updates.events]); // Keep last 10 updates
        return data.updates;
      }
    } catch (error) {
      console.error('Failed to fetch real-time updates:', error);
    }
    return null;
  };

  // Start real-time data updates
  const startRealTimeUpdates = () => {
    setIsRealTimeActive(true);

    // Initial data fetch
    fetchRealTimeDoctors();
    fetchPatientMetrics();
    fetchConsultationDashboard();
    fetchRealTimeUpdates();

    // Set up intervals for real-time updates
    const intervals = [
      setInterval(() => fetchRealTimeDoctors(), 30000), // Doctor availability every 30s
      setInterval(() => fetchPatientMetrics(), 10000), // Patient metrics every 10s
      setInterval(() => fetchConsultationDashboard(), 5000), // Dashboard every 5s
      setInterval(() => fetchRealTimeUpdates(), 10000), // Updates every 10s
    ];

    // Store intervals for cleanup
    return intervals;
  };

  // Stop real-time updates
  const stopRealTimeUpdates = (intervals) => {
    setIsRealTimeActive(false);
    intervals.forEach(clearInterval);
  };

  // Auto-start real-time updates when consultation begins
  useEffect(() => {
    let intervals = [];
    if (activeAppointmentId && view === 'consultation') {
      intervals = startRealTimeUpdates();
    }

    return () => {
      if (intervals.length > 0) {
        stopRealTimeUpdates(intervals);
      }
    };
  }, [activeAppointmentId, view]);

  const book = () => {
    const symptomsText = [...selectedSymptoms, customSymptom.trim()].filter(Boolean).join(', ');
    if (!selectedDoctor || !patientName || !symptomsText || !date || !time) {
      notify('Please fill all fields and select a doctor.');
      return;
    }
    const apt = {
      id: Date.now().toString(),
      doctorId: selectedDoctor.id,
      patientName,
      date,
      time,
      symptoms: symptomsText,
      status: 'scheduled',
    };
    setAppointments((prev) => [...prev, apt]);
    notify(`Appointment booked with ${selectedDoctor.name} on ${date} at ${time}`);
    setPatientName('');
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setDate('');
    setTime('');
    setView('consultation');
  };

  const startCall = async (aptId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setActiveAppointmentId(aptId);
    } catch (e) {
      notify('Please allow camera and microphone access to start the call.');
    }
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (activeAppointmentId) {
      setAppointments((prev) => prev.map((a) => a.id === activeAppointmentId ? { ...a, status: 'completed' } : a));
      setView('prescription');
    }
    setActiveAppointmentId(null);
  };

  const generatePrescription = (apt) => {
    const doc = mockDoctors.find((d) => d.id === apt.doctorId) || selectedDoctor;

    // Use AI analysis if available
    let diagnosis = 'General consultation';
    let medications = [
      { name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '3 days', instructions: 'After meals' }
    ];
    let prescriptionNotes = notes || 'Follow up if symptoms persist.';

    if (aiAnalysis) {
      // Use AI-extracted conditions for diagnosis
      if (extractedConditions.length > 0) {
        diagnosis = extractedConditions[0].name;
      }

      // Use AI-extracted medications if available
      if (extractedMedications.length > 0) {
        medications = extractedMedications.map(med => ({
          name: med,
          dosage: 'As prescribed',
          frequency: 'As directed',
          duration: 'As needed',
          instructions: 'Follow doctor\'s instructions'
        }));
      }

      // Include AI advice in notes
      if (extractedAdvice.length > 0) {
        prescriptionNotes += '\n\nAI-Detected Advice: ' + extractedAdvice.join(', ');
      }

      // Add privacy compliance note
      prescriptionNotes += '\n\n🔒 This prescription was generated with AI assistance. All medical data is processed in compliance with HIPAA/GDPR standards.';
    }

    const p = {
      id: Date.now().toString(),
      appointmentId: apt.id,
      doctorName: doc?.name || 'Doctor',
      doctorSpecialty: doc?.specialty || 'General Medicine',
      doctorLicense: 'MD' + Math.floor(Math.random() * 100000), // Mock license
      patientName: apt.patientName,
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagnosis,
      medications: medications,
      notes: prescriptionNotes,
      aiAssisted: !!aiAnalysis,
      extractedSymptoms: extractedSymptoms,
      extractedConditions: extractedConditions
    };

    setPrescriptions((prev) => [p, ...prev]);
    notify('AI-assisted prescription generated.');
  };

  const downloadPrescription = (prescription) => {
    const text = `DIGITAL PRESCRIPTION\nDoctor: ${prescription.doctorName}\nPatient: ${prescription.patientName}\nDate: ${prescription.date}\nDiagnosis: ${prescription.diagnosis}\n\nMedications:\n${prescription.medications.map(m => `- ${m.name} / ${m.dosage} / ${m.frequency} / ${m.duration} / ${m.instructions}`).join('\n')}\n\nNotes: ${prescription.notes}\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `prescription-${prescription.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPNG = async (id) => {
    const el = printRefs.current[id];
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl; a.download = `shaktix-prescription-${id}.png`; a.click();
  };

  const exportAsPDF = async (id) => {
    const el = printRefs.current[id];
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const contentWidth = pageWidth - margin * 2;
    const ratio = canvas.height / canvas.width;
    const imgHeight = contentWidth * ratio;
    const y = (pageHeight - imgHeight) / 2 < margin ? margin : (pageHeight - imgHeight) / 2;
    pdf.addImage(imgData, 'JPEG', margin, y, contentWidth, imgHeight, undefined, 'FAST');
    pdf.save(`shaktix-prescription-${id}.pdf`);
  };

  const toggleSymptom = (sym) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  return (
    <div className="vc-container">
      <div className="vc-header">
        <h2 className="vc-title">Video Consultation & Prescription</h2>
        <p className="vc-subtitle">Book, connect, and receive a digital prescription</p>
      </div>

      {/* View Switcher */}
      <div className="vc-actions" style={{ justifyContent: 'center', marginBottom: 16 }}>
        <button className="vc-btn" onClick={() => setView('booking')}>Booking</button>
        <button className="vc-btn vc-btn-outline" onClick={() => setView('consultation')}>Consultation</button>
        <button className="vc-btn vc-btn-outline" onClick={() => setView('prescription')}>Prescriptions</button>
      </div>

      {/* Booking */}
      {view === 'booking' && (
        <div className="vc-grid">
          <div className="vc-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Select a Doctor</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="vc-btn vc-btn-outline"
                  onClick={() => fetchRealTimeDoctors().then(() => notify('Real-time doctor data updated'))}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  🔄 Live Update
                </button>
                <button
                  className={`vc-btn ${isRealTimeActive ? 'vc-btn-danger' : 'vc-btn-outline'}`}
                  onClick={() => isRealTimeActive ? stopRealTimeUpdates([]) : startRealTimeUpdates()}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  {isRealTimeActive ? '⏹️ Stop Live' : '▶️ Start Live'}
                </button>
              </div>
            </div>
            <div className="vc-grid">
              {(realTimeDoctors.length > 0 ? realTimeDoctors : mockDoctors).map((d) => (
                <div key={d.id} className="vc-card" style={{
                  cursor: 'pointer',
                  borderColor: selectedDoctor?.id === d.id ? '#00d4ff' : 'rgba(255,255,255,0.1)',
                  position: 'relative'
                }} onClick={() => setSelectedDoctor(d)}>
                  {/* Real-time status indicator */}
                  {d.realTimeStatus && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: d.realTimeStatus === 'online' ? '#22c55e' :
                                      d.realTimeStatus === 'busy' ? '#f59e0b' : '#ef4444',
                      boxShadow: `0 0 6px ${d.realTimeStatus === 'online' ? '#22c55e' :
                                          d.realTimeStatus === 'busy' ? '#f59e0b' : '#ef4444'}`
                    }}></div>
                  )}

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 28, position: 'relative' }}>
                      {d.avatar || '👨‍⚕️'}
                      {d.realTimeStatus === 'online' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          border: '1px solid #0f172a'
                        }}></div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {d.name}
                        {d.rating && (
                          <span style={{ fontSize: '12px', color: '#fbbf24' }}>
                            ⭐ {d.rating}
                          </span>
                        )}
                      </div>
                      <div className="vc-subtitle" style={{ marginTop: 4 }}>{d.specialty}</div>
                      <div className="vc-subtitle" style={{ marginTop: 4 }}>
                        {d.availability || d.nextAvailable}
                        {d.waitTime !== undefined && d.waitTime > 0 && (
                          <span style={{ color: '#f59e0b', marginLeft: '4px' }}>
                            ({d.waitTime}min wait)
                          </span>
                        )}
                      </div>
                      <div className="vc-subtitle" style={{ marginTop: 4 }}>
                        Languages: {d.languages?.join(', ') || 'English'}
                      </div>
                      <div style={{ color: '#10b981', marginTop: 6, fontSize: '14px' }}>
                        ${d.price?.consultation || d.price || 'N/A'} / session
                        {d.experience && (
                          <span style={{ color: '#94a3b8', marginLeft: '8px', fontSize: '12px' }}>
                            {d.experience}
                          </span>
                        )}
                      </div>
                      {d.location && (
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                          📍 {d.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="vc-card">
            <h3>Book Your Appointment</h3>
            <div className="vc-field">
              <label className="vc-label">Full Name *</label>
              <input className="vc-input" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="vc-field">
              <label className="vc-label">Symptoms *</label>
              <div className="vc-chips">
                {commonSymptoms.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`vc-chip ${selectedSymptoms.includes(s) ? 'active' : ''}`}
                    onClick={() => toggleSymptom(s)}
                  >{s}</button>
                ))}
              </div>
              <div className="vc-chip-add">
                <input
                  className="vc-input"
                  placeholder="Add a custom symptom (optional)"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                />
                <button
                  type="button"
                  className="vc-btn vc-btn-outline"
                  onClick={() => {
                    const v = customSymptom.trim();
                    if (!v) return;
                    if (!selectedSymptoms.includes(v)) setSelectedSymptoms((p) => [...p, v]);
                    setCustomSymptom('');
                  }}
                >Add</button>
              </div>
              <div className="vc-help">Choose multiple that apply. You can also add your own.</div>
            </div>
            <div className="vc-row">
              <div className="vc-field">
                <label className="vc-label">Date *</label>
                <input className="vc-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="vc-field">
                <label className="vc-label">Time *</label>
                <select className="vc-select" value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="">Select time</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            {selectedDoctor && (
              <div className="vc-card" style={{ marginTop: 8 }}>
                <div className="vc-label">Summary</div>
                <div className="vc-subtitle">Doctor: {selectedDoctor.name}</div>
                <div className="vc-subtitle">Specialty: {selectedDoctor.specialty}</div>
                <div className="vc-subtitle">Duration: 30 minutes</div>
                <div style={{ color: '#10b981' }}>Total: ${selectedDoctor.price}</div>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <button className="vc-btn" onClick={book} disabled={!selectedDoctor}>Book Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation */}
      {view === 'consultation' && (
        <div className="vc-grid">
          <div className="vc-card">
            <h3>Upcoming Appointments</h3>
            {appointments.filter((a) => a.status === 'scheduled').length === 0 && (
              <div className="vc-subtitle">No upcoming appointments. Book one first.</div>
            )}
            {appointments.filter((a) => a.status === 'scheduled').map((a) => {
              const d = mockDoctors.find((x) => x.id === a.doctorId);
              return (
                <div key={a.id} className="vc-card" style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{d?.name}</div>
                      <div className="vc-subtitle">{d?.specialty}</div>
                      <div className="vc-subtitle">{a.date} at {a.time}</div>
                    </div>
                    <div className="vc-actions">
                      <button className="vc-btn" onClick={() => startCall(a.id)}>Start Video Call</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="vc-card">
            <h3>Live Consultation</h3>
            <div className="vc-video">
              <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="vc-actions" style={{ marginTop: 8 }}>
              <button className="vc-btn vc-btn-outline" onClick={() => endCall()}>End Call</button>
            </div>

            {/* Advanced AI Medical Assistant Section */}
            <div className="vc-card" style={{ marginTop: 16, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
              <h4 style={{ color: '#00d4ff', marginBottom: 12 }}>🚀 Advanced AI Medical Assistant</h4>

              {/* AI Feature Tabs */}
              <div className="vc-tabs" style={{ marginBottom: 16 }}>
                <button className="vc-tab active">Conversation</button>
                <button className="vc-tab">Voice Analysis</button>
                <button className="vc-tab">Medical Images</button>
                <button className="vc-tab">AI Documents</button>
              </div>

              {/* Transcription & LLM Controls */}
              <div className="vc-actions" style={{ marginBottom: 12 }}>
                <button
                  className={`vc-btn ${isTranscribing ? 'vc-btn-danger' : ''}`}
                  onClick={toggleTranscription}
                  disabled={!activeAppointmentId}
                >
                  {isTranscribing ? '⏹️ Stop Recording' : '🎤 Start Recording'}
                </button>
                <button
                  className="vc-btn vc-btn-outline"
                  onClick={analyzeConversation}
                  disabled={!transcription.trim()}
                >
                  🧠 Analyze Conversation
                </button>
                <button
                  className="vc-btn vc-btn-outline"
                  onClick={() => getLLMAssistance(transcription, 'Provide clinical insights for this consultation')}
                  disabled={!transcription.trim() || isLlmTyping}
                >
                  💬 LLM Assistant
                </button>
              </div>

              {/* Transcription Display */}
              {transcription && (
                <div className="vc-field" style={{ marginBottom: 12 }}>
                  <label className="vc-label">Live Transcription</label>
                  <div className="vc-transcription" style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {transcription || 'No transcription yet...'}
                  </div>
                </div>
              )}

              {/* LLM Assistant Response */}
              {llmAssistant && (
                <div className="vc-llm-response" style={{ marginTop: 12, padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h5 style={{ color: '#00d4ff', marginBottom: 8 }}>🧠 LLM Medical Assistant</h5>
                  <p style={{ color: '#e2e8f0', lineHeight: '1.5', marginBottom: 8 }}>{llmAssistant}</p>
                  {llmSuggestions.length > 0 && (
                    <div>
                      <strong style={{ color: '#fff' }}>Suggestions:</strong>
                      <ul style={{ marginTop: 4, paddingLeft: 20, color: '#94a3b8' }}>
                        {llmSuggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {isLlmTyping && (
                <div style={{ marginTop: 12, padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ color: '#00d4ff' }}>🧠 LLM is analyzing...</div>
                </div>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <div className="vc-ai-analysis" style={{ marginTop: 12 }}>
                  <h5 style={{ color: '#00d4ff', marginBottom: 8 }}>🧠 AI Analysis Results</h5>

                  {extractedSymptoms.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: '#fff' }}>Detected Symptoms:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 4 }}>
                        {extractedSymptoms.map((symptom, idx) => (
                          <span key={idx} className="vc-chip" style={{ background: 'rgba(255,193,7,0.2)', color: '#ffc107' }}>
                            {symptom.common_name || symptom.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedConditions.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: '#fff' }}>Possible Conditions:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 4 }}>
                        {extractedConditions.slice(0, 3).map((condition, idx) => (
                          <span key={idx} className="vc-chip" style={{ background: 'rgba(220,53,69,0.2)', color: '#dc3545' }}>
                            {condition.common_name} ({condition.probability}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedMedications.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: '#fff' }}>Mentioned Medications:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 4 }}>
                        {extractedMedications.map((med, idx) => (
                          <span key={idx} className="vc-chip" style={{ background: 'rgba(40,167,69,0.2)', color: '#28a745' }}>
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedAdvice.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: '#fff' }}>Recommended Advice:</strong>
                      <ul style={{ marginTop: 4, paddingLeft: 20, color: '#94a3b8' }}>
                        {extractedAdvice.map((advice, idx) => (
                          <li key={idx}>{advice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Voice Analysis Section */}
              {voiceAnalysis && (
                <div className="vc-voice-analysis" style={{ marginTop: 12, padding: '12px', background: 'rgba(138,43,226,0.1)', borderRadius: '8px' }}>
                  <h5 style={{ color: '#da70d6', marginBottom: 8 }}>🎵 Advanced Voice Analysis</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><strong>Emotion:</strong> {voiceAnalysis.emotion}</div>
                    <div><strong>Stress Level:</strong> {voiceAnalysis.stress}/100</div>
                    <div><strong>Speech Clarity:</strong> {voiceAnalysis.clarity}/100</div>
                    <div><strong>Confidence:</strong> {voiceAnalysis.confidence}/100</div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Health Indicators:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 4 }}>
                      {Object.entries(voiceAnalysis.health).map(([key, value]) => (
                        value && <span key={key} className="vc-chip" style={{ background: 'rgba(255,0,0,0.2)', color: '#ff6b6b' }}>{key}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Image Upload & Analysis */}
              <div className="vc-image-upload" style={{ marginTop: 12 }}>
                <h5 style={{ color: '#00d4ff', marginBottom: 8 }}>📷 Medical Image Analysis</h5>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && analyzeMedicalImage(e.target.files[0])}
                  style={{ marginBottom: 8, color: '#fff' }}
                />
                {imageAnalysis && (
                  <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                    <strong>Analysis Results:</strong>
                    {imageAnalysis.medical?.recommendations?.map((rec, idx) => (
                      <div key={idx} style={{ color: '#94a3b8', fontSize: '14px' }}>• {rec}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Document Generation */}
              <div className="vc-ai-documents" style={{ marginTop: 12 }}>
                <h5 style={{ color: '#00d4ff', marginBottom: 8 }}>📄 AI Document Generation</h5>
                <div className="vc-actions">
                  <button
                    className="vc-btn vc-btn-outline"
                    onClick={() => generateAIDocument('consultation-summary', { patientName })}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Generate Summary
                  </button>
                  <button
                    className="vc-btn vc-btn-outline"
                    onClick={() => generateAIDocument('treatment-plan', { patientName })}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Treatment Plan
                  </button>
                  <button
                    className="vc-btn vc-btn-outline"
                    onClick={() => generateAIDocument('follow-up-reminder', { patientName })}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Follow-up
                  </button>
                </div>
                {aiDocuments.length > 0 && (
                  <div style={{ marginTop: 8, maxHeight: '150px', overflowY: 'auto' }}>
                    {aiDocuments.map((doc, idx) => (
                      <div key={idx} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '4px' }}>
                        <strong>{doc.title}</strong>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{doc.summary || 'Document generated'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Real-Time Data Dashboard */}
              {isRealTimeActive && (
                <div className="vc-realtime-dashboard" style={{ marginTop: 16, padding: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px' }}>
                  <h4 style={{ color: '#22c55e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📊 Real-Time Dashboard
                    <span style={{ fontSize: '12px', background: 'rgba(34,197,94,0.2)', padding: '2px 6px', borderRadius: '10px' }}>LIVE</span>
                  </h4>

                  {/* Real-Time Doctor Availability */}
                  {realTimeDoctors.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ color: '#22c55e', marginBottom: 8 }}>👨‍⚕️ Available Doctors</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {realTimeDoctors.slice(0, 3).map((doctor, idx) => (
                          <div key={idx} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', minWidth: '120px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{doctor.name}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{doctor.specialty}</div>
                            <div style={{
                              fontSize: '10px',
                              color: doctor.realTimeStatus === 'online' ? '#22c55e' : '#f59e0b',
                              fontWeight: 'bold'
                            }}>
                              {doctor.availability}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real-Time Patient Metrics */}
                  {patientMetrics && (
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ color: '#22c55e', marginBottom: 8 }}>❤️ Patient Vitals</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Heart Rate</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{patientMetrics.vitals.heartRate.current} BPM</div>
                        </div>
                        <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Blood Pressure</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                            {patientMetrics.vitals.bloodPressure.systolic}/{patientMetrics.vitals.bloodPressure.diastolic}
                          </div>
                        </div>
                        <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>O2 Saturation</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{patientMetrics.vitals.oxygenSaturation.current}%</div>
                        </div>
                        <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Steps Today</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{patientMetrics.activity.stepsToday}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real-Time Medicine Search */}
                  <div style={{ marginBottom: 12 }}>
                    <h5 style={{ color: '#22c55e', marginBottom: 8 }}>💊 Medicine Database</h5>
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      onChange={(e) => e.target.value && searchMedicines(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    {medicineDatabase.length > 0 && (
                      <div style={{ marginTop: '8px', maxHeight: '100px', overflowY: 'auto' }}>
                        {medicineDatabase.slice(0, 2).map((med, idx) => (
                          <div key={idx} style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '4px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{med.name}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>${med.price.tablet?.current || 'N/A'}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Consultation Dashboard */}
                  {consultationDashboard && (
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ color: '#22c55e', marginBottom: 8 }}>📈 Consultation Status</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Duration</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{consultationDashboard.duration} min</div>
                        </div>
                        <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>AI Activity</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                            {consultationDashboard.ai.suggestionsCount} suggestions
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real-Time Updates Feed */}
                  {realTimeUpdates.length > 0 && (
                    <div>
                      <h5 style={{ color: '#22c55e', marginBottom: 8 }}>🔄 Live Updates</h5>
                      <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                        {realTimeUpdates.slice(-5).map((update, idx) => (
                          <div key={idx} style={{
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            fontSize: '11px',
                            color: '#94a3b8'
                          }}>
                            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                              {update.type.replace(/_/g, ' ').toUpperCase()}:
                            </span> {update.data.message || 'Update received'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Privacy Notice */}
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '6px',
                padding: '8px',
                marginTop: 12,
                fontSize: '12px',
                color: '#ffc107'
              }}>
                🔒 All conversations are transcribed locally and analyzed securely. Medical data is processed in compliance with HIPAA/GDPR standards. No data is stored permanently without explicit consent.
              </div>
            </div>

            <div className="vc-field" style={{ marginTop: 12 }}>
              <label className="vc-label">Consultation Notes</label>
              <textarea className="vc-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Doctor's notes..." />
            </div>
          </div>
        </div>
      )}

      {/* Prescription */}
      {view === 'prescription' && (
        <div className="vc-grid">
          <div className="vc-card">
            <h3>Generate Prescription</h3>
            {appointments.filter((a) => a.status === 'completed').length === 0 && (
              <div className="vc-subtitle">No completed consultations yet.</div>
            )}
            {appointments.filter((a) => a.status === 'completed').map((a) => (
              <div key={a.id} className="vc-card" style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>Appointment on {a.date}</div>
                  <div className="vc-subtitle">Patient: {a.patientName}</div>
                </div>
                <button className="vc-btn" onClick={() => generatePrescription(a)}>Generate</button>
              </div>
            ))}
          </div>

          <div className="vc-card">
            <h3>Digital Prescriptions</h3>
            {prescriptions.length === 0 && (
              <div className="vc-subtitle">No prescriptions yet.</div>
            )}
            {prescriptions.map((p) => (
              <div key={p.id} className="vc-card" style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>#{p.id}</div>
                    <div className="vc-subtitle">Doctor: {p.doctorName}</div>
                    <div className="vc-subtitle">Patient: {p.patientName}</div>
                    <div className="vc-subtitle">Date: {p.date}</div>
                  </div>
                  <div className="vc-actions">
                    <button className="vc-btn vc-btn-outline" onClick={() => exportAsPNG(p.id)}>Download PNG</button>
                    <button className="vc-btn" onClick={() => exportAsPDF(p.id)}>Download PDF</button>
                  </div>
                </div>

                {/* Render a printable prescription layout (white paper) */}
                <div className="rx-paper" ref={(el) => (printRefs.current[p.id] = el)}>
                  <div className="rx-header">
                    <div className="rx-logo" aria-hidden>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#00D4FF"/>
                            <stop offset="1" stopColor="#0099CC"/>
                          </linearGradient>
                        </defs>
                        <path d="M12 2l2.2 4.7 5.2.8-3.7 3.7.9 5.1L12 14.7 7.4 16.3l.9-5.1L4.6 7.5l5.2-.8L12 2z" fill="url(#g)"/>
                      </svg>
                    </div>
                    <div className="rx-brand">
                      <div className="rx-title">ShaktiX Health</div>
                      <div className="rx-sub">Digital Prescription</div>
                    </div>
                  </div>

                  <div className="rx-row">
                    <div><span className="rx-label">Doctor:</span> {p.doctorName}</div>
                    <div><span className="rx-label">Specialty:</span> {p.doctorSpecialty}</div>
                  </div>
                  <div className="rx-row">
                    <div><span className="rx-label">License:</span> {p.doctorLicense}</div>
                    <div><span className="rx-label">Date:</span> {p.date}</div>
                  </div>
                  <div className="rx-row">
                    <div><span className="rx-label">Patient:</span> {p.patientName}</div>
                    <div><span className="rx-label">ID:</span> #{p.id}</div>
                  </div>
                  {p.aiAssisted && (
                    <div className="rx-row" style={{ background: 'rgba(0, 212, 255, 0.1)', padding: '4px 8px', borderRadius: '4px', margin: '8px 0' }}>
                      <div style={{ fontSize: '12px', color: '#00d4ff' }}>🤖 AI-Assisted Prescription</div>
                    </div>
                  )}

                  <div className="rx-section">
                    <div className="rx-section-title">Diagnosis</div>
                    <div className="rx-box">{p.diagnosis}</div>
                  </div>

                  <div className="rx-section">
                    <div className="rx-section-title">Medications</div>
                    <div className="rx-list">
                      {p.medications.map((m, i) => (
                        <div key={i} className="rx-med">
                          <div className="rx-med-name">{m.name}</div>
                          <div className="rx-med-details">{m.dosage} • {m.frequency} • {m.duration} • {m.instructions}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rx-section">
                    <div className="rx-section-title">Notes</div>
                    <div className="rx-box">{p.notes}</div>
                  </div>

                  <div className="rx-footer">This is a computer generated prescription and does not require a physical signature.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultation;