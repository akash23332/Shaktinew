import React, { useState, useRef, useEffect } from 'react';

const AiChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI Medical Assistant. I can provide general health information and wellness guidance. I cannot replace professional medical advice. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Confine scroll within the messages container to avoid page scroll jumps
  const messagesContainerRef = useRef(null);
  // Skip auto-scroll on the very first render
  const didMountRef = useRef(false);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return; // do not auto-scroll on initial mount
    }
    scrollToBottom();
  }, [messages, isTyping]);

  // Removed remote medical AI calls; chatbot now uses local fallback responses only

  // Fallback responses for non-medical questions
  const getFallbackResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Keep some general wellness responses
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return "Regular exercise is crucial for good health! Adults should aim for at least 150 minutes of moderate-intensity aerobic activity per week, plus muscle-strengthening activities twice a week. Start slowly if you're new to exercise and gradually increase intensity. Always consult your doctor before starting a new exercise program, especially if you have health conditions.";
    }

    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return "A balanced diet includes plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated with water, limit processed foods, sugar, and excessive sodium. Portion control is important. For specific dietary needs or restrictions, consider consulting a registered dietitian.";
    }

    if (lowerMessage.includes('sleep')) {
      return "Adults need 7-9 hours of quality sleep per night. Good sleep hygiene includes maintaining a consistent sleep schedule, creating a comfortable sleep environment, avoiding screens before bedtime, and limiting caffeine late in the day. If you have persistent sleep problems, consider speaking with a healthcare provider.";
    }

    // Emergency situations
    if (lowerMessage.includes('chest pain') || lowerMessage.includes('heart attack')) {
      return "⚠️ EMERGENCY: Chest pain can be a sign of a heart attack or other serious condition. If you're experiencing severe chest pain, especially with shortness of breath, nausea, sweating, or pain radiating to your arm or jaw, call 911 immediately. Don't delay seeking emergency medical care.";
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('911')) {
      return "⚠️ For medical emergencies, call 911 immediately. Signs of medical emergencies include severe chest pain, difficulty breathing, severe bleeding, loss of consciousness, severe allergic reactions, or suspected stroke symptoms (face drooping, arm weakness, speech difficulty).";
    }

    const defaultResponses = [
      "I specialize in medical and health-related questions. For symptom assessment and diagnosis suggestions, please describe your symptoms. For other topics, I recommend consulting appropriate professionals.",
      "I'm designed to help with health and medical questions. If you have symptoms you'd like me to assess, please describe them in detail. For non-medical topics, you might want to consult specialized resources.",
      "My expertise is in providing medical information and symptom assessment. Please ask about health concerns, symptoms, or general medical knowledge. For other subjects, I suggest finding relevant experts or resources."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // Function to determine if a question is medical-related
  const isMedicalQuestion = (text) => {
    const medicalKeywords = [
      'symptom', 'pain', 'headache', 'fever', 'cough', 'nausea', 'vomit', 'diarrhea',
      'medicine', 'drug', 'prescription', 'treatment', 'diagnosis', 'disease', 'illness',
      'health', 'medical', 'doctor', 'hospital', 'clinic', 'blood', 'pressure', 'heart',
      'lung', 'stomach', 'head', 'throat', 'ear', 'eye', 'skin', 'bone', 'muscle',
      'infection', 'virus', 'bacteria', 'cancer', 'diabetes', 'asthma', 'allergy',
      'vaccine', 'surgery', 'emergency', 'ambulance', 'pharmacy', 'pill', 'tablet',
      'capsule', 'injection', 'therapy', 'exercise', 'diet', 'nutrition', 'weight',
      'bmi', 'calories', 'protein', 'vitamin', 'mineral', 'sleep', 'stress', 'mental'
    ];
    const lowerText = text.toLowerCase();
    return medicalKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Client-side medical safety filter to avoid prescriptions/dosages
  const enforceMedicalSafety = (text) => {
    try {
      if (!text || typeof text !== 'string') return { text: '', flagged: false };

      const patterns = [
        /\b(?:prescribe|prescribed|prescription|start|take|use|begin|administer)\b[^\n]*\b(?:mg|mcg|ml|milligram|microgram|tablet|tab|capsule|cap|dose|dosage|units?)\b/gi,
        /\b\d+\s*(?:mg|mcg|ml|units?)\b/gi,
        /\b(?:amoxicillin|azithromycin|ibuprofen|paracetamol|acetaminophen|metformin|lisinopril|atorvastatin|omeprazole)\b[^\n]*(?:\d+\s*(?:mg|mcg|ml))?/gi
      ];

      let flagged = false;
      for (const re of patterns) {
        if (re.test(text)) { flagged = true; break; }
      }

      if (!flagged) return { text, flagged: false };

      const safeMessage =
        "I can share general health information and self-care tips, but I can’t provide prescriptions, dosages, or medication instructions.\n\n" +
        "General guidance you may find helpful:\n" +
        "- Stay hydrated, rest adequately, and monitor symptoms.\n" +
        "- Supportive measures: balanced nutrition, good sleep, stress management.\n" +
        "- Seek medical care for red‑flags like severe chest pain, trouble breathing, confusion, persistent high fever, or rapid worsening.\n\n" +
        "This is general information only—please consult a licensed clinician for personalized advice.";

      return { text: safeMessage, flagged: true };
    } catch (_) {
      return { text, flagged: false };
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Use the general AI chatbot API for all questions
      const response = await fetch('http://localhost:3001/api/chatbot/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          context: messages.slice(-5).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        const safe = enforceMedicalSafety(data.response);
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: safe.text,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Fallback to local response if API fails
        const aiResponseText = getFallbackResponse(userMessage.text);
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback response on error
      const aiResponseText = "I'm sorry, I'm experiencing technical difficulties. Please try again later.";
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "I have a headache and nausea",
    "I've been coughing for 3 days",
    "I feel dizzy and lightheaded",
    "My stomach hurts after eating",
    "I have a sore throat and fever",
    "When should I see a doctor?"
  ];

  // quick question click handled inline with setInputText

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '15px', color: '#ffffff' }}>
          AI Medical Assistant
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Provides general health information and wellness guidance
        </p>
        <div style={{
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '10px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#ffc107', fontSize: '0.9rem', margin: 0 }}>
            ⚠️ This AI assistant uses medical AI technology to provide symptom assessment and general health information. It cannot replace professional medical advice, diagnosis, or treatment. Always consult healthcare providers for medical concerns.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Messages Area */}
        <div ref={messagesContainerRef} style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {messages.map(message => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              {!message.isUser && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  🤖
                </div>
              )}
              
              <div style={{
                background: message.isUser 
                  ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '18px',
                maxWidth: '70%',
                lineHeight: '1.5',
                fontSize: '14px',
                boxShadow: message.isUser 
                  ? '0 4px 12px rgba(0, 212, 255, 0.2)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {message.text}
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  marginTop: '5px',
                  textAlign: message.isUser ? 'right' : 'left'
                }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.isUser && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  👤
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🤖
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '12px 16px',
                borderRadius: '18px',
                color: '#94a3b8'
              }}>
                AI is typing...
              </div>
            </div>
          )}
          
          
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about health..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '14px',
                minHeight: '44px',
                maxHeight: '120px',
                resize: 'none',
                outline: 'none'
              }}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isTyping}
              className="gradient-button"
              style={{
                padding: '12px 20px',
                height: '44px',
                fontSize: '14px',
                opacity: (!inputText.trim() || isTyping) ? 0.5 : 1,
                cursor: (!inputText.trim() || isTyping) ? 'not-allowed' : 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '1.1rem' }}>
          Quick Questions:
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInputText(question)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiChatbot;