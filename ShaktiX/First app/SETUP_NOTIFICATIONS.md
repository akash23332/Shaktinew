# 📱 Medicine Tracker - Notification Setup Guide

## 🎯 **Goal: Get Real Phone Notifications**

This guide will help you set up email and SMS notifications that go to **your actual email and phone number**.

---

## 📧 **Step 1: Set Up Gmail Notifications**

### **1.1 Get Gmail App Password**
1. Go to: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in with your Gmail account
3. Select **"Mail"** from first dropdown
4. Select **"Other (custom name)"** from second dropdown
5. Type **"Medicine Tracker"** in the name field
6. Click **"Generate"**

### **1.2 Copy the Password**
You'll see a yellow box with a password like:
```
abcd-efgh-ijkl-mnop
```
**Copy this 16-character password exactly** (including hyphens).

### **1.3 Update Your .env File**
Open your `.env` file and replace:
```env
EMAIL_PASS=your_gmail_app_password_here
```
With:
```env
EMAIL_PASS=abcd-efgh-ijkl-mnop
```

### **1.4 Test Gmail**
```bash
node debug-email.js
```

---

## 📱 **Step 2: Set Up SMS Notifications (Recommended)**

### **2.1 Get Twilio Account**
1. Go to: [console.twilio.com](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your email and phone number
4. You'll get **$15+ free credit**

### **2.2 Get Your Credentials**
After signup, copy these from your dashboard:
- **Account SID**: `ACdd7fc8d6dc2b939c3e3933de29c399fd`
- **Auth Token**: `59b6377a743a32b8398c143b55396a3c`
- **Phone Number**: They give you a free number like `+1234567890`

### **2.3 Update .env File**
Replace the demo values:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_real_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### **2.4 Test SMS**
```bash
node test-sms.js
```

---

## ⚙️ **Step 3: Configure In-App Settings**

### **3.1 Open Medicine Tracker**
1. Go to your app: [localhost:5173](http://localhost:5173)
2. Navigate to **Medicine Tracker**
3. Click **⚙️ Settings**

### **3.2 Enable Notifications**
- ✅ **Enable Email Notifications**
- ✅ **Enable SMS Notifications**
- **Email Address**: Your actual email (pre-filled)
- **Phone Number**: Your actual phone number (pre-filled: 8264131474)

### **3.3 Configure Snooze**
- **Snooze Duration**: 15 minutes (recommended)
- **Max Snoozes**: 3 times (recommended)

---

## 🧪 **Step 4: Test Your Setup**

### **4.1 Add a Test Medication**
1. Click **"+ Add New Medication"**
2. **Name**: "Test Medicine"
3. **Dosage**: "100mg"
4. **Times**: Set one time to **current time + 1 minute**
5. Click **"Add Medication"**

### **4.2 Wait for Notification**
- Browser notification will appear
- Email will be sent to your configured email
- SMS will be sent to your configured phone

### **4.3 Test Snooze**
- Click **"⏰ Snooze 15min"** in the notification
- Status changes to **"Snoozed until [time]"**
- New notification appears after 15 minutes

---

## 🔧 **Troubleshooting**

### **❌ Gmail Issues**
**Error**: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Fix**:
1. Make sure you copied the **16-character app password**, not your regular password
2. Ensure **2-Factor Authentication** is enabled on your Google account
3. Try generating a new app password

### **❌ SMS Issues**
**Error**: "SMS service not configured"

**Fix**:
1. Check your Twilio credentials in `.env`
2. Make sure you have credits in your Twilio account
3. Verify the phone number format (should start with +91 for India)

### **❌ No Notifications**
**Check**:
1. Are notifications enabled in your browser?
2. Did you grant notification permissions?
3. Are your credentials correct in `.env`?
4. Is the server running? (`npm run server`)

---

## 📱 **What You'll Get**

### **Browser Notifications**
- Pop-up alerts on your device
- Works even when app is closed (via service worker)
- Action buttons: "Mark as Taken" and "Snooze"

### **Email Notifications**
```
Subject: 💊 Medicine Reminder

Time to take Aspirin - 100mg
Take with food

(Snoozed 1/3 times)

Stay healthy! 🏥💊
```

### **SMS Notifications**
```
💊 Medicine Reminder
Time to take Aspirin - 100mg
Take with food
(Snoozed 1/3 times)

Stay healthy! 🏥💊
```

---

## 🎉 **Success Checklist**

- ✅ **Gmail app password** set in `.env`
- ✅ **Twilio credentials** configured
- ✅ **Email and phone** entered in app settings
- ✅ **Notifications enabled** in settings
- ✅ **Test medication** created and working
- ✅ **Snooze functionality** tested

**Now you'll get real notifications on your phone and email!** 📱🔔💊