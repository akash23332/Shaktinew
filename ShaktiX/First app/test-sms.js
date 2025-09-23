// Test SMS functionality
import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:3001';

async function testSMS() {
  console.log('📱 Testing SMS Notifications...\n');

  try {
    console.log('🧪 Sending test SMS to 8264131474...');

    const response = await fetch(`${BACKEND_URL}/api/notifications/medicine-reminder-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '8264131474',
        medicationName: 'Test Medicine',
        dosage: '100mg',
        instructions: 'Take with food',
        reminderType: 'normal'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ SMS sent successfully!');
      console.log('📱 Check your phone for the message');
      console.log('📊 Result:', result);
    } else {
      console.log('❌ SMS failed:', result.error);
    }

  } catch (error) {
    console.log('❌ SMS test error:', error.message);
  }

  console.log('\n💡 Note: SMS requires valid Twilio credentials to work');
  console.log('   Get them from: https://console.twilio.com/');
}

testSMS();