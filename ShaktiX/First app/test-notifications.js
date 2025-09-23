// Simple test script to check notification setup
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3001';
// Allow passing phone/email via CLI for flexible testing
const ARG_PHONE = process.argv[2];
const TEST_PHONE = ARG_PHONE || process.env.TEST_PHONE || '8264131474';

async function testNotifications() {
  console.log('🧪 Testing Notification System...\n');

  try {
    // Test health check
    console.log('1. Checking server health...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    const health = await healthResponse.json();
    console.log('   Server Status:', health.ok ? '✅ Running' : '❌ Down');
    console.log('   Email Configured:', health.emailConfigured ? '✅ Yes' : '❌ No');
    console.log('   SMS Configured:', health.smsConfigured ? '✅ Yes' : '❌ No');

    // Test email notification
    console.log('\n2. Testing email notification...');
    try {
      const emailResponse = await fetch(`${BACKEND_URL}/api/notifications/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'nikhilpalyal6@gmail.com',
          subject: '🧪 Test Notification',
          text: 'This is a test notification from your Medicine Tracker!'
        })
      });

      if (emailResponse.ok) {
        console.log('   Email: ✅ Sent successfully');
      } else {
        const error = await emailResponse.json();
        console.log('   Email: ❌ Failed -', error.error);
      }
    } catch (error) {
      console.log('   Email: ❌ Error -', error.message);
    }

    // Test SMS notification
    console.log('\n3. Testing SMS notification...');
    console.log('   Target phone:', TEST_PHONE);
    try {
      const smsResponse = await fetch(`${BACKEND_URL}/api/notifications/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: TEST_PHONE,
          message: '🧪 Test SMS from Medicine Tracker!'
        })
      });

      if (smsResponse.ok) {
        console.log('   SMS: ✅ Sent successfully');
      } else {
        const error = await smsResponse.json();
        console.log('   SMS: ❌ Failed -', error.error);
      }
    } catch (error) {
      console.log('   SMS: ❌ Error -', error.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n📋 Environment Variables Check:');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
  console.log('   TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
  console.log('   TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
  console.log('   TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Missing');
}

testNotifications();