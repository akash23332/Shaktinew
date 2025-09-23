import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Email Transporter
let emailTransporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('Email transporter initialized successfully');
  } else {
    console.log('Email not configured - set EMAIL_USER and EMAIL_PASS for email notifications');
  }
} catch (error) {
  console.log('Email transporter initialization failed:', error.message);
}

// Initialize Twilio for SMS
let twilioClient = null;
try {
  // Read from env or fall back to provided credentials
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'ACdd7fc8d6dc2b939c3e3933de29c399fd';
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '59b6377a743a32b8398c143b55396a3c';
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+17752040711';

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    // Ensure downstream code relying on env keeps working
    process.env.TWILIO_PHONE_NUMBER = TWILIO_PHONE_NUMBER;
    console.log('Twilio SMS client initialized successfully');
  } else {
    console.log('SMS not configured - set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER for SMS notifications');
  }
} catch (error) {
  console.log('Twilio initialization failed:', error.message);
}

// Helper to normalize phone numbers
function normalizePhoneNumber(input) {
  try {
    if (!input) return null;
    let p = String(input).trim();
    // Remove spaces, dashes, parentheses
    p = p.replace(/[\s\-()]/g, '');
    // Keep digits and plus only
    p = p.replace(/[^0-9+]/g, '');
    // If starts with 00, convert to +
    if (p.startsWith('00')) p = '+' + p.slice(2);
    // If does not start with +, try common cases
    if (!p.startsWith('+')) {
      // If already starts with country code 91 and total 12 digits, add +
      if (p.startsWith('91') && p.length === 12) {
        p = '+' + p;
      } else if (p.length === 10) {
        // Assume India if 10 digits
        p = '+91' + p;
      }
    }
    return p;
  } catch (_) {
    return null;
  }
}

// Centralized SMS sender with provider abstraction (Twilio | Fonoster via REST)
async function sendSms({ to, message }) {
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();
  const normalizedTo = normalizePhoneNumber(to);
  if (!normalizedTo) throw new Error('Invalid phone number');

  if (provider === 'fonoster') {
    const apiUrl = process.env.FONOSTER_API_URL; // e.g., https://your-fonoster-host/sms
    const apiKey = process.env.FONOSTER_API_KEY; // Bearer token or API key
    const from = process.env.FONOSTER_FROM || process.env.TWILIO_PHONE_NUMBER; // sender number or ID

    if (!apiUrl || !apiKey || !from) {
      throw new Error('Fonoster not configured: set FONOSTER_API_URL, FONOSTER_API_KEY, and FONOSTER_FROM');
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        to: normalizedTo,
        from,
        text: message
      })
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Fonoster error: ${res.status} ${t}`);
    }
    let json = {};
    try { json = await res.json(); } catch (_) {}
    return { provider: 'fonoster', id: json.id || json.messageId || 'ok' };
  }

  // Default Twilio branch
  if (!twilioClient) throw new Error('Twilio not configured');
  const sms = await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: normalizedTo
  });
  return { provider: 'twilio', id: sms.sid };
}

// Centralized SMS sender with provider abstraction (Twilio | Fonoster via REST)
async function sendSms({ to, message }) {
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();
  const normalizedTo = normalizePhoneNumber(to);
  if (!normalizedTo) throw new Error('Invalid phone number');

  if (provider === 'fonoster') {
    const apiUrl = process.env.FONOSTER_API_URL; // e.g., https://your-fonoster-host/sms
    const apiKey = process.env.FONOSTER_API_KEY; // Bearer token or API key
    const from = process.env.FONOSTER_FROM || process.env.TWILIO_PHONE_NUMBER; // sender number or ID

    if (!apiUrl || !apiKey || !from) {
      throw new Error('Fonoster not configured: set FONOSTER_API_URL, FONOSTER_API_KEY, and FONOSTER_FROM');
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        to: normalizedTo,
        from,
        text: message
      })
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Fonoster error: ${res.status} ${t}`);
    }
    let json = {};
    try { json = await res.json(); } catch (_) {}
    return { provider: 'fonoster', id: json.id || json.messageId || 'ok' };
  }

  // Default Twilio branch
  if (!twilioClient) throw new Error('Twilio not configured');
  const sms = await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: normalizedTo
  });
  return { provider: 'twilio', id: sms.sid };
}

// Health check: reveals whether env config is present and server is up
app.get('/api/health', async (req, res) => {
  const apiKey = process.env.INFERMEDICA_API_KEY;
  const appId = process.env.INFERMEDICA_APP_ID;
  const configPresent = Boolean(apiKey && appId);
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();
  const fonosterConfigured = Boolean(process.env.FONOSTER_API_URL && process.env.FONOSTER_API_KEY && (process.env.FONOSTER_FROM || process.env.TWILIO_PHONE_NUMBER));
  res.json({
    ok: true,
    port: PORT,
    configPresent,
    emailConfigured: Boolean(emailTransporter),
    smsConfigured: provider === 'fonoster' ? fonosterConfigured : Boolean(twilioClient),
    smsProvider: provider
  });
});

// Send Email Notification
app.post('/api/notifications/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Recipient email, subject, and text are required' });
    }

    if (!emailTransporter) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>')
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error?.message || 'unknown error' });
  }
});

// Medicine Reminder Email
app.post('/api/notifications/medicine-reminder-email', async (req, res) => {
  try {
    const { email, medicationName, dosage, instructions, reminderType = 'normal', snoozeCount = 0, maxSnoozes = 3 } = req.body;

    if (!email || !medicationName) {
      return res.status(400).json({ error: 'Email and medication name are required' });
    }

    let subject = '💊 Medicine Reminder';
    let text = `Time to take ${medicationName}`;

    if (dosage) {
      text += ` - ${dosage}`;
    }

    if (instructions) {
      text += `\n\nInstructions: ${instructions}`;
    }

    // Add snooze information
    if (snoozeCount > 0) {
      text += `\n\n(Snoozed ${snoozeCount}/${maxSnoozes} times)`;
    }

    // Add personalized messaging based on reminder type
    switch (reminderType) {
      case 'urgent':
        subject = '🚨 URGENT: Medicine Reminder';
        text += '\n\n⚠️ IMPORTANT: This dose was missed! Please take it immediately.';
        break;
      case 'gentle':
        subject = '💊 Gentle Medicine Reminder';
        text += '\n\nWhen you have a moment, please remember to take your medication.';
        break;
      case 'followup':
        subject = '⏰ Follow-up Medicine Reminder';
        text = `Don't forget your ${medicationName} medication.`;
        break;
    }

    text += '\n\nThis is an automated reminder from your Medicine Tracker app.';
    text += '\n\nStay healthy! 🏥💊';

    const response = await fetch(`${req.protocol}://${req.get('host')}/api/notifications/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject,
        text
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    res.json(result);
  } catch (error) {
    console.error('Medicine reminder email error:', error);
    res.status(500).json({ error: 'Failed to send medicine reminder email' });
  }
});

// Send SMS Notification
app.post('/api/notifications/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    // Normalize and log destination phone number
    const phoneNumber = normalizePhoneNumber(to);
    console.log('[SMS] Request to send:', {
      rawTo: to,
      normalizedTo: phoneNumber,
      messagePreview: message?.slice(0, 60)
    });

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      return res.status(400).json({ error: 'Invalid phone number format after normalization' });
    }

    const result = await sendSms({ to: phoneNumber, message });
    console.log('SMS sent successfully via', result.provider, 'id:', result.id);
    res.json({
      success: true,
      message: 'SMS sent successfully',
      provider: result.provider,
      messageId: result.id
    });
  } catch (error) {
    console.error('SMS send error:', error);
    res.status(500).json({ error: 'Failed to send SMS', details: error?.message || 'unknown error' });
  }
});

// Medicine Reminder SMS
app.post('/api/notifications/medicine-reminder-sms', async (req, res) => {
  try {
    const { phone, medicationName, dosage, instructions, reminderType = 'normal', snoozeCount = 0, maxSnoozes = 3 } = req.body;

    if (!phone || !medicationName) {
      return res.status(400).json({ error: 'Phone number and medication name are required' });
    }

    let message = `💊 Medicine Reminder\nTime to take ${medicationName}`;

    if (dosage) {
      message += ` - ${dosage}`;
    }

    if (instructions) {
      message += `\n${instructions}`;
    }

    // Add snooze information
    if (snoozeCount > 0) {
      message += `\n(Snoozed ${snoozeCount}/${maxSnoozes} times)`;
    }

    // Add personalized messaging based on reminder type
    switch (reminderType) {
      case 'urgent':
        message = `🚨 URGENT Medicine Reminder\nMISSED: ${medicationName}`;
        if (dosage) message += ` - ${dosage}`;
        message += '\nPlease take immediately!';
        break;
      case 'followup':
        message = `⏰ Follow-up Reminder\nDon't forget: ${medicationName}`;
        break;
    }

    message += '\n\nStay healthy! 🏥💊';

    const response = await fetch(`${req.protocol}://${req.get('host')}/api/notifications/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phone,
        message
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    res.json(result);
  } catch (error) {
    console.error('Medicine reminder SMS error:', error);
    res.status(500).json({ error: 'Failed to send medicine reminder SMS' });
  }
});

// Test notification endpoint
app.post('/api/notifications/test', async (req, res) => {
  try {
    const { email, phone } = req.body;
    let results = { email: null, sms: null };

    // Test email
    if (email && emailTransporter) {
      try {
        const emailResult = await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: '🧪 Test Notification - Medicine Tracker',
          text: 'This is a test notification from your Medicine Tracker app.\n\nIf you received this, email notifications are working! 🎉\n\nStay healthy! 🏥💊'
        });
        results.email = { success: true, messageId: emailResult.messageId };
      } catch (error) {
        results.email = { success: false, error: error.message };
      }
    }

    // Test SMS
    if (phone) {
      try {
        const phoneNumber = normalizePhoneNumber(phone);
        console.log('[SMS][TEST] Request to send:', { rawTo: phone, normalizedTo: phoneNumber });
        const send = await sendSms({
          to: phoneNumber,
          message: '🧪 Test SMS from Medicine Tracker\n\nIf you received this, SMS notifications are working! 🎉\n\nStay healthy! 🏥💊'
        });
        results.sms = { success: true, messageId: send.id, provider: send.provider };
      } catch (error) {
        results.sms = { success: false, error: error.message };
      }
    }

    res.json({
      success: true,
      message: 'Test notifications sent',
      results,
      configured: {
        email: Boolean(emailTransporter),
        sms: Boolean(twilioClient)
      }
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ error: 'Failed to send test notifications' });
  }
});

// Symptom parsing using Infermedica NLP
app.post('/api/symptoms/parse', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for symptom parsing' });
    }

    const apiKey = process.env.INFERMEDICA_API_KEY;
    const appId = process.env.INFERMEDICA_APP_ID;

    if (!apiKey || !appId) {
      return res.status(500).json({ error: 'Infermedica API credentials not configured' });
    }

    const response = await fetch('https://api.infermedica.com/v3/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Id': appId,
        'App-Key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        include_tokens: false,
        include_mentions: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Infermedica API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract symptom IDs from mentions
    const symptoms = data.mentions
      .filter(mention => mention.type === 'symptom')
      .map(mention => ({
        id: mention.id,
        name: mention.name,
        choice_id: mention.choice_id,
        common_name: mention.common_name,
      }));

    res.json({ symptoms });
  } catch (error) {
    console.error('Symptom parsing error:', error);
    res.status(500).json({ error: 'Failed to parse symptoms' });
  }
});

// Diagnosis using Infermedica API
app.post('/api/symptoms/diagnose', async (req, res) => {
  try {
    const { symptoms, age = 35, sex = 'male' } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ error: 'Symptoms array is required for diagnosis' });
    }

    const apiKey = process.env.INFERMEDICA_API_KEY;
    const appId = process.env.INFERMEDICA_APP_ID;

    // If API credentials are not configured, use demo/fallback mode
    if (!apiKey || !appId) {
      console.log('Using fallback diagnosis mode - API credentials not configured');

      // Simple rule-based fallback for demo purposes
      const fallbackConditions = [];

      // Common Cold: cough, sore throat, runny nose, fatigue
      if (symptoms.includes('s_6') || symptoms.includes('s_1193') || symptoms.includes('s_181') || symptoms.includes('s_98')) {
        const coldSymptoms = ['s_6', 's_1193', 's_181', 's_98'].filter(s => symptoms.includes(s));
        fallbackConditions.push({
          id: 'c_1',
          name: 'Common Cold',
          probability: Math.min(85, coldSymptoms.length * 20 + 25),
          common_name: 'Common Cold',
        });
      }

      // Flu: fever, headache, muscle aches, fatigue, cough
      if (symptoms.includes('s_13') || symptoms.includes('s_21') || symptoms.includes('s_10') || symptoms.includes('s_98') || symptoms.includes('s_6')) {
        const fluSymptoms = ['s_13', 's_21', 's_10', 's_98', 's_6'].filter(s => symptoms.includes(s));
        fallbackConditions.push({
          id: 'c_2',
          name: 'Influenza (Flu)',
          probability: Math.min(90, fluSymptoms.length * 18 + 20),
          common_name: 'Flu',
        });
      }

      // Migraine: headache, nausea, dizziness
      if (symptoms.includes('s_21') || symptoms.includes('s_17') || symptoms.includes('s_156')) {
        const migraineSymptoms = ['s_21', 's_17', 's_156'].filter(s => symptoms.includes(s));
        fallbackConditions.push({
          id: 'c_3',
          name: 'Migraine',
          probability: Math.min(80, migraineSymptoms.length * 25 + 30),
          common_name: 'Migraine Headache',
        });
      }

      // Gastroenteritis: nausea, stomach pain, fatigue
      if (symptoms.includes('s_17') || symptoms.includes('s_162') || symptoms.includes('s_98')) {
        const gastroSymptoms = ['s_17', 's_162', 's_98'].filter(s => symptoms.includes(s));
        fallbackConditions.push({
          id: 'c_4',
          name: 'Gastroenteritis',
          probability: Math.min(75, gastroSymptoms.length * 20 + 35),
          common_name: 'Stomach Flu',
        });
      }

      // Sort by probability
      fallbackConditions.sort((a, b) => b.probability - a.probability);

      return res.json({
        conditions: fallbackConditions.slice(0, 5),
        should_stop: false,
        serious_conditions: fallbackConditions.filter(c => c.probability > 60),
        demo_mode: true
      });
    }

    // Convert symptoms to Infermedica format
    const evidence = symptoms.map(symptomId => ({
      id: symptomId,
      choice_id: 'present',
      source: 'initial'
    }));

    const response = await fetch('https://api.infermedica.com/v3/diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Id': appId,
        'App-Key': apiKey,
      },
      body: JSON.stringify({
        sex: sex,
        age: age,
        evidence: evidence,
        extras: {
          disable_groups: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Infermedica diagnosis API error: ${response.status}`);
    }

    const data = await response.json();

    // Format the response
    const conditions = data.conditions.slice(0, 5).map(condition => ({
      id: condition.id,
      name: condition.name,
      probability: Math.round(condition.probability * 100),
      common_name: condition.common_name,
    }));

    res.json({
      conditions,
      should_stop: data.should_stop,
      serious_conditions: conditions.filter(c => c.probability > 50),
      demo_mode: false
    });
  } catch (error) {
    console.error('Diagnosis error:', error);
    res.status(500).json({ error: 'Failed to get diagnosis' });
  }
});

// Health Calculation APIs

// BMI Calculation
app.post('/api/health-calculations/bmi', (req, res) => {
  try {
    const { weight, height } = req.body; // weight in kg, height in cm

    if (!weight || !height || weight <= 0 || height <= 0) {
      return res.status(400).json({ error: 'Valid weight and height are required' });
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    res.json({
      bmi: Math.round(bmi * 10) / 10,
      category,
      interpretation: getBMIInterpretation(bmi)
    });
  } catch (error) {
    res.status(500).json({ error: 'BMI calculation failed' });
  }
});

// BMR Calculation
app.post('/api/health-calculations/bmr', (req, res) => {
  try {
    const { weight, height, age, gender } = req.body; // weight in kg, height in cm

    if (!weight || !height || !age || !gender || weight <= 0 || height <= 0 || age <= 0) {
      return res.status(400).json({ error: 'Valid weight, height, age, and gender are required' });
    }

    let bmr = 0;
    if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender.toLowerCase() === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      return res.status(400).json({ error: 'Gender must be male or female' });
    }

    res.json({
      bmr: Math.round(bmr),
      unit: 'calories/day'
    });
  } catch (error) {
    res.status(500).json({ error: 'BMR calculation failed' });
  }
});

// Body Fat Percentage Estimation
app.post('/api/health-calculations/body-fat', (req, res) => {
  try {
    const { bmi, age, gender } = req.body;

    if (!bmi || !age || !gender || bmi <= 0 || age <= 0) {
      return res.status(400).json({ error: 'Valid BMI, age, and gender are required' });
    }

    let bodyFat = 0;
    if (gender.toLowerCase() === 'male') {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else if (gender.toLowerCase() === 'female') {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    } else {
      return res.status(400).json({ error: 'Gender must be male or female' });
    }

    res.json({
      bodyFatPercentage: Math.max(0, Math.round(bodyFat * 10) / 10),
      category: getBodyFatCategory(bodyFat, gender)
    });
  } catch (error) {
    res.status(500).json({ error: 'Body fat calculation failed' });
  }
});

// Ideal Weight Range
app.post('/api/health-calculations/ideal-weight', (req, res) => {
  try {
    const { height, gender } = req.body; // height in cm

    if (!height || !gender || height <= 0) {
      return res.status(400).json({ error: 'Valid height and gender are required' });
    }

    const heightInches = height / 2.54;
    const heightOver5Feet = Math.max(0, heightInches - 60); // 5 feet = 60 inches

    let baseWeight = 0;
    let perInch = 0;

    if (gender.toLowerCase() === 'male') {
      baseWeight = 48;
      perInch = 2.7;
    } else if (gender.toLowerCase() === 'female') {
      baseWeight = 45.5;
      perInch = 2.2;
    } else {
      return res.status(400).json({ error: 'Gender must be male or female' });
    }

    const idealWeight = baseWeight + (perInch * heightOver5Feet);
    const range = {
      min: Math.round((idealWeight * 0.9) * 10) / 10,
      max: Math.round((idealWeight * 1.1) * 10) / 10
    };

    res.json({
      idealWeight: Math.round(idealWeight * 10) / 10,
      range,
      unit: 'kg'
    });
  } catch (error) {
    res.status(500).json({ error: 'Ideal weight calculation failed' });
  }
});

// Comprehensive Health Score Calculation
app.post('/api/health-calculations/health-score', (req, res) => {
  try {
    const {
      metrics, // array of metric objects
      age,
      gender,
      activity,
      height // height in cm
    } = req.body;

    if (!metrics || !Array.isArray(metrics) || !age || !gender || !activity) {
      return res.status(400).json({ error: 'Valid metrics array, age, gender, and activity are required' });
    }

    // Define metric configurations
    const metricConfigs = {
      weight: { weight: 0.15, optimal: { min: 50, max: 100 } }, // Will be adjusted based on ideal weight
      height: { weight: 0.05, optimal: { min: 150, max: 200 } }, // Basic range
      bloodPressure: { weight: 0.25, optimal: { min: 90, max: 120 } },
      heartRate: { weight: 0.2, optimal: { min: 60, max: 80 } },
      cholesterol: { weight: 0.2, optimal: { min: 125, max: 200 } },
      bloodSugar: { weight: 0.2, optimal: { min: 70, max: 100 } }
    };

    let totalScore = 0;
    let totalWeight = 0;
    const metricScores = {};
    const recommendations = [];

    // Calculate individual metric scores
    metrics.forEach(metric => {
      const config = metricConfigs[metric.id];
      if (!config || metric.value === 0) return;

      let optimal = config.optimal;

      // Adjust weight optimal range based on ideal weight if height is provided
      if (metric.id === 'weight' && height && gender) {
        const heightInches = height / 2.54;
        const heightOver5Feet = Math.max(0, heightInches - 60);
        const baseWeight = gender.toLowerCase() === 'male' ? 48 : 45.5;
        const perInch = gender.toLowerCase() === 'male' ? 2.7 : 2.2;
        const idealWeight = baseWeight + (perInch * heightOver5Feet);
        optimal = { min: idealWeight * 0.9, max: idealWeight * 1.1 };
      }

      let score = 0;
      const { value } = metric;

      if (value >= optimal.min && value <= optimal.max) {
        score = 100;
      } else if (value < optimal.min) {
        const distance = optimal.min - value;
        const maxDistance = optimal.min - (metric.range ? metric.range.min : 0);
        score = Math.max(0, 100 - (distance / maxDistance) * 100);
      } else {
        const distance = value - optimal.max;
        const maxDistance = (metric.range ? metric.range.max : value * 2) - optimal.max;
        score = Math.max(0, 100 - (distance / maxDistance) * 100);
      }

      metricScores[metric.id] = Math.round(score);
      totalScore += score * config.weight;
      totalWeight += config.weight;
    });

    // Apply age factor
    let ageFactor = 1;
    if (age > 65) ageFactor = 0.95;
    else if (age > 50) ageFactor = 0.98;
    else if (age < 25) ageFactor = 1.02;

    // Apply activity factor
    let activityFactor = 1;
    switch (activity.toLowerCase()) {
      case 'sedentary': activityFactor = 0.95; break;
      case 'light': activityFactor = 0.98; break;
      case 'moderate': activityFactor = 1; break;
      case 'active': activityFactor = 1.02; break;
      case 'very_active': activityFactor = 1.05; break;
    }

    const finalScore = totalWeight > 0 ? Math.min(100, Math.round(totalScore * ageFactor * activityFactor / totalWeight)) : 0;

    // Generate recommendations
    if (finalScore < 70) {
      recommendations.push("Consider consulting with a healthcare provider for a comprehensive health assessment");
    }

    Object.keys(metricScores).forEach(metricId => {
      const score = metricScores[metricId];
      if (score < 70) {
        switch (metricId) {
          case 'weight':
            recommendations.push("Consider a balanced diet and regular exercise to achieve healthy weight");
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

    if (activity.toLowerCase() === 'sedentary') {
      recommendations.push("Increase physical activity - even light exercise can significantly improve health");
    }

    res.json({
      overallScore: finalScore,
      metricScores,
      recommendations,
      factors: { ageFactor, activityFactor }
    });
  } catch (error) {
    res.status(500).json({ error: 'Health score calculation failed' });
  }
});

// Helper functions
function getBMIInterpretation(bmi) {
  if (bmi < 18.5) return 'Underweight - Consider gaining weight through nutritious foods';
  if (bmi < 25) return 'Normal weight - Maintain healthy lifestyle';
  if (bmi < 30) return 'Overweight - Consider weight management';
  return 'Obese - Consult healthcare provider for weight management plan';
}

function getBodyFatCategory(bodyFat, gender) {
  if (gender.toLowerCase() === 'male') {
    if (bodyFat < 6) return 'Essential Fat';
    if (bodyFat < 14) return 'Athletes';
    if (bodyFat < 18) return 'Fitness';
    if (bodyFat < 25) return 'Average';
    return 'Obese';
  } else {
    if (bodyFat < 10) return 'Essential Fat';
    if (bodyFat < 18) return 'Athletes';
    if (bodyFat < 22) return 'Fitness';
    if (bodyFat < 32) return 'Average';
    return 'Obese';
  }
}

app.listen(PORT, () => {
  console.log(`Medical API proxy server running on port ${PORT}`);
});