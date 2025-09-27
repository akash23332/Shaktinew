// Test Twilio SMS Configuration
import twilio from 'twilio';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('🧪 Testing Twilio Configuration...\n');

// Check if credentials are set
if (!accountSid || !authToken || !phoneNumber) {
  console.log('❌ Missing Twilio credentials:');
  if (!accountSid) console.log('   ACdd7fc8d6dc2b939c3e3933de29c399fd');
  if (!authToken) console.log('   59b6377a743a32b8398c143b55396a3c');
  if (!phoneNumber) console.log('  +17752040711');

  console.log('\n📋 How to get credentials:');
  console.log('1. Go to: https://console.twilio.com/');
  console.log('2. Sign up for free account');
  console.log('3. Go to Dashboard → Account Info');
  console.log('4. Copy Account SID (starts with AC...)');
  console.log('5. Copy Auth Token');
  console.log('6. Get a phone number from Phone Numbers → Manage');
  console.log('7. Update your .env file');
  process.exit(1);
}

// Validate credential format
console.log('🔍 Checking credential format...');

if (!accountSid.startsWith('AC')) {
  console.log('❌ TWILIO_ACCOUNT_SID should start with "AC"');
  console.log('   Your value:', accountSid);
  process.exit(1);
}

if (accountSid.length !== 34) {
  console.log('❌ TWILIO_ACCOUNT_SID should be 34 characters long');
  console.log('   Your value length:', accountSid.length);
  process.exit(1);
}

if (!phoneNumber.startsWith('+')) {
  console.log('❌ TWILIO_PHONE_NUMBER should start with "+"');
  console.log('   Your value:', phoneNumber);
  process.exit(1);
}

console.log('✅ Credential format looks good');

// Test Twilio connection
console.log('\n📡 Testing Twilio connection...');

try {
  const client = twilio(accountSid, authToken);

  // Test account info
  const account = await client.api.accounts(accountSid).fetch();
  console.log('✅ Successfully connected to Twilio!');
  console.log('📱 Account Status:', account.status);
  console.log('📞 Phone Number:', phoneNumber);

  // Test sending SMS
  console.log('\n📤 Testing SMS send...');
  const message = await client.messages.create({
    body: '🧪 Test SMS from Medicine Tracker\n\nIf you received this, SMS notifications are working! 🎉\n\nStay healthy! 🏥💊',
    from: phoneNumber,
    to: '+918264131474' // Your phone number
  });

  console.log('✅ SMS sent successfully!');
  console.log('📨 Message SID:', message.sid);
  console.log('📱 Check your phone for the test message');

} catch (error) {
  console.log('❌ Twilio test failed:', error.message);

  if (error.code === 20003) {
    console.log('💰 This usually means you need to add funds to your Twilio account');
    console.log('   Go to: https://console.twilio.com/billing');
  } else if (error.code === 21211) {
    console.log('📞 Phone number format issue');
  } else if (error.code === 21608) {
    console.log('🔒 Phone number not verified (trial account limitation)');
    console.log('   Verify your phone number in Twilio Console');
  }
}

console.log('\n🎯 Next steps:');
console.log('1. If SMS was received: ✅ SMS is working!');
console.log('2. If not received: Check Twilio Console for error details');
console.log('3. Add funds to Twilio account for production use');