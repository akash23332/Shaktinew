import { useState, useEffect } from 'react';
import "./HealthCareProgram.css";

const MedicineTracker = () => {
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    reminderStyle: 'normal', // gentle, normal, urgent
    vibrationEnabled: true,
    soundEnabled: true,
    emailEnabled: false,
    emailAddress: 'nikhilpalyal6@gmail.com',
    smsEnabled: false,
    phoneNumber: '8264131474',
    snoozeDuration: 15, // minutes
    maxSnoozes: 3 // maximum snooze attempts
  });
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'custom',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: ''
  });

  // Load medications and preferences from localStorage on component mount
  useEffect(() => {
    const storedMeds = localStorage.getItem('medications');
    if (storedMeds) {
      setMedications(JSON.parse(storedMeds));
    }

    const storedPrefs = localStorage.getItem('medicinePreferences');
    if (storedPrefs) {
      setPreferences(JSON.parse(storedPrefs));
    }

    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'MARK_TAKEN') {
          markAsTaken(event.data.medicationId);
        } else if (event.data.type === 'SNOOZE_MEDICATION') {
          snoozeMedication(event.data.medicationId);
        }
      });
    }

    // Request notification permission
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save medications to localStorage whenever medications change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  // Save preferences to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem('medicinePreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Check for medication reminders and track missed doses
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const today = now.toISOString().split('T')[0];

      setMedications(prevMeds => {
        return prevMeds.map(med => {
          let updatedMed = { ...med };
          let shouldNotify = false;
          let isMissed = false;
          let notificationMessage = '';
          let notificationUrgent = false;

          // Check if medication is currently snoozed
          const isSnoozed = med.snoozedUntil && new Date(med.snoozedUntil) > now;
          const snoozeExpired = med.snoozedUntil && new Date(med.snoozedUntil) <= now;

          // Clear expired snooze
          if (snoozeExpired) {
            updatedMed.snoozedUntil = null;
          }

          // Skip notifications if snoozed or if snooze just expired (will be handled in next check)
          if (isSnoozed) {
            return;
          }

          // Check each scheduled time
          med.times.forEach(time => {
            const isCurrentTime = time === currentTime;
            const wasMissedToday = med.lastTaken !== today && time < currentTime;

            if (isCurrentTime && (!med.lastTaken || med.lastTaken !== today)) {
              // Time to take medication
              shouldNotify = true;
              notificationMessage = getReminderMessage(med, false);
            } else if (wasMissedToday && !med.missedDoses.includes(today + '-' + time)) {
              // Dose was missed
              isMissed = true;
              updatedMed.missedDoses = [...(updatedMed.missedDoses || []), today + '-' + time];
              updatedMed.consecutiveMisses = (updatedMed.consecutiveMisses || 0) + 1;
              shouldNotify = true;
              notificationUrgent = true;
              notificationMessage = getReminderMessage(med, true);
            }
          });

          if (shouldNotify) {
            sendNotification(notificationMessage, notificationUrgent, updatedMed);
          }

          return updatedMed;
        });
      });
    };

    const getReminderMessage = (med, isMissed) => {
      const baseMessage = isMissed ?
        `⚠️ MISSED: Time to take ${med.name}` :
        `💊 Time to take ${med.name}`;

      let styleMessage = '';
      if (preferences.reminderStyle === 'gentle') {
        styleMessage = isMissed ? 'Please remember to take your medication when you can.' : 'It\'s time for your medication.';
      } else if (preferences.reminderStyle === 'urgent') {
        styleMessage = isMissed ? 'URGENT: You missed your dose! Take it immediately!' : 'Don\'t forget your medication!';
      } else {
        styleMessage = isMissed ? 'You missed your dose. Please take it now.' : 'Time for your medication.';
      }

      const historyMessage = med.consecutiveMisses > 1 ?
        ` (You've missed ${med.consecutiveMisses} doses in a row)` : '';

      const snoozeCount = med.snoozeCount || 0;
      const snoozeMessage = snoozeCount > 0 ?
        ` (Snoozed ${snoozeCount}/${preferences.maxSnoozes} times)` : '';

      return `${baseMessage}\n${med.dosage}${med.instructions ? ` - ${med.instructions}` : ''}\n${styleMessage}${historyMessage}${snoozeMessage}`;
    };

    const sendNotification = async (message, urgent = false, medication = null) => {
      // Send email notification if enabled
      if (preferences.emailEnabled && preferences.emailAddress) {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
          await fetch(`${backendUrl}/api/notifications/medicine-reminder-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: preferences.emailAddress,
              medicationName: medication?.name || 'Medicine',
              dosage: medication?.dosage,
              instructions: medication?.instructions,
              reminderType: urgent ? 'urgent' : 'normal',
              snoozeCount: medication?.snoozeCount || 0,
              maxSnoozes: preferences.maxSnoozes
            })
          });
        } catch (error) {
          console.log('Email notification failed:', error);
        }
      }

      // Send SMS notification if enabled
      if (preferences.smsEnabled && preferences.phoneNumber) {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
          // Sanitize phone number on client as well
          const cleanedPhone = String(preferences.phoneNumber)
            .trim()
            .replace(/[\s\-()]/g, '')
            .replace(/[^0-9+]/g, '');
          await fetch(`${backendUrl}/api/notifications/medicine-reminder-sms`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone: cleanedPhone,
              medicationName: medication?.name || 'Medicine',
              dosage: medication?.dosage,
              instructions: medication?.instructions,
              reminderType: urgent ? 'urgent' : 'normal',
              snoozeCount: medication?.snoozeCount || 0,
              maxSnoozes: preferences.maxSnoozes
            })
          });
        } catch (error) {
          console.log('SMS notification failed:', error);
        }
      }

      // Use service worker for background notifications (works on mobile)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title: urgent ? '🚨 Medicine Reminder' : '💊 Medicine Reminder',
          body: message,
          urgent,
          medication
        });
        return;
      }

      // Fallback to regular browser notifications
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          const notification = new Notification(
            urgent ? '🚨 Medicine Reminder' : '💊 Medicine Reminder',
            {
              body: message,
              icon: '/logo.png',
              badge: '/logo.png',
              tag: medication ? `medicine-${medication.id}` : 'medicine-reminder',
              requireInteraction: urgent,
              silent: !preferences.soundEnabled,
              actions: medication ? [
                { action: 'take', title: '✅ Mark as Taken' },
                { action: 'snooze', title: `⏰ Snooze ${preferences.snoozeDuration}min` }
              ] : []
            }
          );

          // Add vibration for urgent notifications
          if (urgent && preferences.vibrationEnabled && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }

          // Schedule follow-up for missed doses
          if (urgent && medication) {
            setTimeout(() => {
              sendNotification(`Follow-up: ${message}`, false, medication);
            }, 15 * 60 * 1000); // 15 minutes
          }

          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (error) {
          console.log('Notification error:', error);
        }
      }
    };

    // Request notification permission
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [medications, preferences]);

  // Function to schedule notifications via backend
  const scheduleNotification = async (medication, delayMinutes, reminderType = 'normal') => {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous_user';
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const scheduleAt = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString();

      const response = await fetch(`${backendUrl}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: '💊 Medicine Reminder',
          body: `Time to take ${medication.name}${medication.dosage ? ` - ${medication.dosage}` : ''}${medication.instructions ? `\n${medication.instructions}` : ''}`,
          data: {
            type: 'medicine_reminder',
            medication: medication.name,
            reminderType
          },
          scheduleAt
        })
      });

      if (response.ok) {
        console.log(`Notification scheduled for ${medication.name} in ${delayMinutes} minutes`);
      } else {
        console.log('Failed to schedule notification via backend');
      }
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage || newMed.times.length === 0) return;

    const medication = {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      times: [...newMed.times].sort(), // Sort times chronologically
      startDate: newMed.startDate,
      endDate: newMed.endDate || undefined,
      instructions: newMed.instructions,
      lastTaken: null,
      missedDoses: [],
      consecutiveMisses: 0,
      snoozedUntil: null, // Timestamp when snooze expires
      snoozeCount: 0 // Number of times snoozed
    };

    setMedications(prev => [...prev, medication]);
    setNewMed({
      name: '',
      dosage: '',
      frequency: 'custom',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: ''
    });
    setShowAddForm(false);
  };

  const addTimeSlot = () => {
    setNewMed(prev => ({
      ...prev,
      times: [...prev.times, '12:00']
    }));
  };

  const removeTimeSlot = (index) => {
    if (newMed.times.length > 1) {
      setNewMed(prev => ({
        ...prev,
        times: prev.times.filter((_, i) => i !== index)
      }));
    }
  };

  const updateTimeSlot = (index, time) => {
    setNewMed(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? time : t)
    }));
  };


  const markAsTaken = (medId) => {
    const today = new Date().toISOString().split('T')[0];
    setMedications(prev =>
      prev.map(med =>
        med.id === medId ? { ...med, lastTaken: today, consecutiveMisses: 0, snoozedUntil: null, snoozeCount: 0 } : med
      )
    );
  };

  const snoozeMedication = (medId) => {
    setMedications(prev =>
      prev.map(med => {
        if (med.id === medId) {
          const currentSnoozeCount = med.snoozeCount || 0;

          // Check if max snoozes reached
          if (currentSnoozeCount >= preferences.maxSnoozes) {
            // Send urgent notification instead
            sendNotification(
              `⚠️ Maximum snoozes reached for ${med.name}. Please take your medication now!`,
              true,
              med
            );
            return med; // Don't snooze
          }

          const snoozeUntil = new Date(Date.now() + preferences.snoozeDuration * 60 * 1000).toISOString();
          return {
            ...med,
            snoozedUntil: snoozeUntil,
            snoozeCount: currentSnoozeCount + 1
          };
        }
        return med;
      })
    );
  };

  const deleteMedication = (medId) => {
    setMedications(prev => prev.filter(med => med.id !== medId));
  };

  const getNextDose = (med) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    for (const time of med.times) {
      if (time > currentTime) {
        return time;
      }
    }
    return med.times[0] + ' (tomorrow)';
  };

  const isTakenToday = (med) => {
    const today = new Date().toISOString().split('T')[0];
    return med.lastTaken === today;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '15px', color: '#ffffff' }}>
          Medicine Tracker
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Track your medications and never miss a dose
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '5px' }}>
            {medications.filter(med => isTakenToday(med)).length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Taken Today</div>
        </div>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '5px' }}>
            {medications.filter(med => !isTakenToday(med)).length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pending</div>
        </div>
        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#00d4ff', marginBottom: '5px' }}>
            {medications.length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Meds</div>
        </div>
        <div style={{
          background: 'rgba(245, 101, 101, 0.1)',
          border: '1px solid rgba(245, 101, 101, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#f56565', marginBottom: '5px' }}>
            {medications.reduce((total, med) => total + (med.missedDoses?.length || 0), 0)}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Missed</div>
        </div>
      </div>

      {/* Add Medication Button and Settings */}
      <div style={{ marginBottom: '30px', textAlign: 'center', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          onClick={() => setShowAddForm(true)}
          className="gradient-button"
          style={{ fontSize: '16px', padding: '12px 24px' }}
        >
          + Add New Medication
        </button>
        <button
          onClick={() => setShowPreferences(true)}
          style={{
            fontSize: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Add New Medication</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Medication Name *
              </label>
              <input
                type="text"
                value={newMed.name}
                onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
                placeholder="e.g., Aspirin"
              />
            </div>
            
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Dosage *
              </label>
              <input
                type="text"
                value={newMed.dosage}
                onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
                placeholder="e.g., 100mg"
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '10px' }}>
                Medication Times
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {newMed.times.map((time, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff'
                      }}
                    />
                    {newMed.times.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTimeSlot}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    cursor: 'pointer',
                    fontSize: '14px',
                    alignSelf: 'flex-start'
                  }}
                >
                  + Add Time
                </button>
              </div>
            </div>
            
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Start Date
              </label>
              <input
                type="date"
                value={newMed.startDate}
                onChange={(e) => setNewMed(prev => ({ ...prev, startDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
              Instructions
            </label>
            <textarea
              value={newMed.instructions}
              onChange={(e) => setNewMed(prev => ({ ...prev, instructions: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="e.g., Take with food, avoid alcohol"
            />
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={addMedication}
              className="gradient-button"
              style={{ padding: '10px 20px' }}
            >
              Add Medication
            </button>
          </div>
        </div>
      )}

      {/* Preferences Form */}
      {showPreferences && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Reminder Preferences</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              >
                <option value="Asia/Calcutta">Asia/Calcutta (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Reminder Style
              </label>
              <select
                value={preferences.reminderStyle}
                onChange={(e) => setPreferences(prev => ({ ...prev, reminderStyle: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              >
                <option value="gentle">Gentle</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '10px' }}>
                Notification Options
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={preferences.vibrationEnabled}
                      onChange={(e) => setPreferences(prev => ({ ...prev, vibrationEnabled: e.target.checked }))}
                    />
                    Enable Vibration
                  </label>
                  <label style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={preferences.soundEnabled}
                      onChange={(e) => setPreferences(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                    />
                    Enable Sound
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={preferences.emailEnabled}
                      onChange={(e) => setPreferences(prev => ({ ...prev, emailEnabled: e.target.checked }))}
                    />
                    Enable Email Notifications
                  </label>
                  {preferences.emailEnabled && (
                    <input
                      type="email"
                      placeholder="your-email@example.com"
                      value={preferences.emailAddress}
                      onChange={(e) => setPreferences(prev => ({ ...prev, emailAddress: e.target.value }))}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff'
                      }}
                    />
                  )}
                  <label style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={preferences.smsEnabled}
                      onChange={(e) => setPreferences(prev => ({ ...prev, smsEnabled: e.target.checked }))}
                    />
                    Enable SMS Notifications
                  </label>
                  {preferences.smsEnabled && (
                    <input
                      type="tel"
                      placeholder="10-digit phone number"
                      value={preferences.phoneNumber}
                      onChange={(e) => setPreferences(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff'
                      }}
                    />
                  )}

                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      ⏰ Snooze Settings
                    </label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div>
                        <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>
                          Snooze Duration (minutes)
                        </label>
                        <select
                          value={preferences.snoozeDuration}
                          onChange={(e) => setPreferences(prev => ({ ...prev, snoozeDuration: parseInt(e.target.value) }))}
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#ffffff'
                          }}
                        >
                          <option value="5">5 minutes</option>
                          <option value="10">10 minutes</option>
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ color: '#94a3b8', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>
                          Max Snoozes
                        </label>
                        <select
                          value={preferences.maxSnoozes}
                          onChange={(e) => setPreferences(prev => ({ ...prev, maxSnoozes: parseInt(e.target.value) }))}
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#ffffff'
                          }}
                        >
                          <option value="1">1 time</option>
                          <option value="2">2 times</option>
                          <option value="3">3 times</option>
                          <option value="5">5 times</option>
                          <option value="10">10 times</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowPreferences(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Medications List */}
      {medications.length > 0 ? (
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Your Medications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {medications.map(med => (
              <div
                key={med.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${isTakenToday(med) ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '15px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '5px' }}>
                      {med.name}
                    </h4>
                    <p style={{ color: '#94a3b8', margin: 0 }}>
                      {med.dosage} • {med.frequency} daily
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!isTakenToday(med) && (
                      <button
                        onClick={() => markAsTaken(med.id)}
                        style={{
                          background: '#10b981',
                          border: 'none',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Mark Taken
                      </button>
                    )}
                    <button
                      onClick={() => deleteMedication(med.id)}
                      style={{
                        background: '#ef4444',
                        border: 'none',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Next dose: </span>
                    <span style={{ color: '#ffffff' }}>{getNextDose(med)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Times: </span>
                    <span style={{ color: '#ffffff' }}>{med.times.join(', ')}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Status: </span>
                    <span style={{
                      color: isTakenToday(med) ? '#10b981' :
                             (med.snoozedUntil && new Date(med.snoozedUntil) > new Date()) ? '#f59e0b' :
                             '#ef4444'
                    }}>
                      {isTakenToday(med) ? '✅ Taken today' :
                       (med.snoozedUntil && new Date(med.snoozedUntil) > new Date()) ?
                       `⏰ Snoozed until ${new Date(med.snoozedUntil).toLocaleTimeString()}` :
                       '⏰ Pending'}
                    </span>
                  </div>
                  {(med.consecutiveMisses > 0 || med.missedDoses?.length > 0) && (
                    <div>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Missed: </span>
                      <span style={{ color: '#ef4444' }}>
                        {med.consecutiveMisses} consecutive, {med.missedDoses?.length || 0} total
                      </span>
                    </div>
                  )}
                </div>
                
                {med.instructions && (
                  <div style={{ 
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '10px'
                  }}>
                    <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>Instructions: </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{med.instructions}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💊</div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>No Medications Added</h3>
          <p style={{ color: '#94a3b8' }}>
            Add your first medication to start tracking your doses and reminders.
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineTracker;