// Debug script to test Gmail setup
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testGmail() {
  console.log('🔍 Testing Gmail Configuration...\n');

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  console.log('📧 Email User:', emailUser);
  console.log('🔑 Password Set:', emailPass ? 'Yes' : 'No');
  console.log('🔑 Password Length:', emailPass ? emailPass.length : 0);
  console.log('🔑 Password Format:', emailPass === 'your_gmail_app_password_here' ? '❌ STILL PLACEHOLDER' : '✅ CUSTOM PASSWORD');

  if (!emailUser || !emailPass || emailPass === 'your_gmail_app_password_here') {
    console.log('\n❌ Gmail not configured properly!');
    console.log('\n📋 To fix:');
    console.log('1. Go to: https://myaccount.google.com/apppasswords');
    console.log('2. Generate app password for "Medicine Tracker"');
    console.log('3. Replace EMAIL_PASS in .env with the 16-character password');
    console.log('4. Restart server: npm run server');
    return;
  }

  console.log('\n📤 Testing email connection...');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail connection successful!');

    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      subject: '🧪 Gmail Test - Medicine Tracker',
      text: 'If you received this email, Gmail is working correctly!\n\n✅ Email notifications are ready!\n\nStay healthy! 🏥💊'
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Check your email:', emailUser);

  } catch (error) {
    console.log('❌ Gmail test failed:', error.message);

    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 This usually means:');
      console.log('1. Wrong app password (use the 16-character one from Google)');
      console.log('2. 2FA not enabled on your Google account');
      console.log('3. App password expired or revoked');
    }
  }
}

testGmail();