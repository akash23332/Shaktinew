import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './VideoConsultation.css';

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

const VideoConsultationLite = () => {
  const videoRef = useRef(null);

  const [view, setView] = useState('booking'); // booking | consultation | prescription
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [appointments, setAppointments] = useState([]);
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notes, setNotes] = useState('');
  const printRefs = useRef({});

  const notify = (msg) => { try { window?.alert(msg); } catch (_) {} };

  const toggleSymptom = (sym) => {
    setSelectedSymptoms((prev) => prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]);
  };

  const book = () => {
    const symptomsText = [...selectedSymptoms, customSymptom.trim()].filter(Boolean).join(', ');
    if (!selectedDoctor || !patientName || !symptomsText || !date || !time) {
      notify('Please fill all fields and select a doctor.');
      return;
    }
    const apt = { id: Date.now().toString(), doctorId: selectedDoctor.id, patientName, date, time, symptoms: symptomsText, status: 'scheduled' };
    setAppointments((prev) => [...prev, apt]);
    notify(`Appointment booked with ${selectedDoctor.name} on ${date} at ${time}`);
    setPatientName(''); setSelectedSymptoms([]); setCustomSymptom(''); setDate(''); setTime('');
    setView('consultation');
  };

  const startCall = async (aptId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setActiveAppointmentId(aptId);
    } catch (e) { notify('Please allow camera and microphone access to start the call.'); }
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
    const p = {
      id: Date.now().toString(),
      appointmentId: apt.id,
      doctorName: doc?.name || 'Doctor',
      patientName: apt.patientName,
      date: new Date().toISOString().split('T')[0],
      diagnosis: 'General consultation',
      medications: [ { name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '3 days', instructions: 'After meals' } ],
      notes: notes || 'Follow up if symptoms persist.'
    };
    setPrescriptions((prev) => [p, ...prev]);
    notify('Prescription generated.');
  };

  const downloadPrescription = (prescription) => {
    const text = `DIGITAL PRESCRIPTION\nDoctor: ${prescription.doctorName}\nPatient: ${prescription.patientName}\nDate: ${prescription.date}\nDiagnosis: ${prescription.diagnosis}\n\nMedications:\n${prescription.medications.map(m => `- ${m.name} / ${m.dosage} / ${m.frequency} / ${m.duration} / ${m.instructions}`).join('\n')}\n\nNotes: ${prescription.notes}\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `prescription-${prescription.id}.txt`; a.click(); URL.revokeObjectURL(url);
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

  return (
    <div className="vc-container">
      <div className="vc-header">
        <h2 className="vc-title">Video Consultation & Prescription</h2>
        <p className="vc-subtitle">Book, connect, and receive a digital prescription</p>
      </div>

      <div className="vc-actions" style={{ justifyContent: 'center', marginBottom: 16 }}>
        <button className="vc-btn" onClick={() => setView('booking')}>Booking</button>
        <button className="vc-btn vc-btn-outline" onClick={() => setView('consultation')}>Consultation</button>
        <button className="vc-btn vc-btn-outline" onClick={() => setView('prescription')}>Prescriptions</button>
      </div>

      {view === 'booking' && (
        <div className="vc-grid">
          <div className="vc-card">
            <h3>Select a Doctor</h3>
            <div className="vc-grid">
              {mockDoctors.map((d) => (
                <div key={d.id} className="vc-card" style={{ cursor: 'pointer', borderColor: selectedDoctor?.id === d.id ? '#00d4ff' : 'rgba(255,255,255,0.1)' }} onClick={() => setSelectedDoctor(d)}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 28 }}>{d.avatar}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{d.name}</div>
                      <div className="vc-subtitle" style={{ marginTop: 4 }}>{d.specialty}</div>
                      <div className="vc-subtitle" style={{ marginTop: 4 }}>Next: {d.nextAvailable}</div>
                      <div className="vc-subtitle" style={{ marginTop: 4 }}>Languages: {d.languages.join(', ')}</div>
                      <div style={{ color: '#10b981', marginTop: 6 }}>${d.price} / session</div>
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
                  {timeSlots.map((t) => (<option key={t} value={t}>{t}</option>))}
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
            <div className="vc-field" style={{ marginTop: 12 }}>
              <label className="vc-label">Consultation Notes</label>
              <textarea className="vc-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Doctor's notes..." />
            </div>
          </div>
        </div>
      )}

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
            {prescriptions.length === 0 && (<div className="vc-subtitle">No prescriptions yet.</div>)}
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

                <div className="rx-paper" ref={(el) => (printRefs.current[p.id] = el)}>
                  <div className="rx-header">
                    <div className="rx-logo" aria-hidden>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="g2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#00D4FF"/>
                            <stop offset="1" stopColor="#0099CC"/>
                          </linearGradient>
                        </defs>
                        <path d="M12 2l2.2 4.7 5.2.8-3.7 3.7.9 5.1L12 14.7 7.4 16.3l.9-5.1L4.6 7.5l5.2-.8L12 2z" fill="url(#g2)"/>
                      </svg>
                    </div>
                    <div className="rx-brand">
                      <div className="rx-title">ShaktiX Health</div>
                      <div className="rx-sub">Digital Prescription</div>
                    </div>
                  </div>

                  <div className="rx-row">
                    <div><span className="rx-label">Doctor:</span> {p.doctorName}</div>
                    <div><span className="rx-label">Date:</span> {p.date}</div>
                  </div>
                  <div className="rx-row">
                    <div><span className="rx-label">Patient:</span> {p.patientName}</div>
                    <div><span className="rx-label">ID:</span> #{p.id}</div>
                  </div>

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

export default VideoConsultationLite;
