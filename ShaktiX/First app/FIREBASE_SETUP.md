# Firebase Setup Guide for Medicine Reminder Push Notifications

This guide will help you set up Firebase Cloud Messaging (FCM) for real phone notifications in your Medicine Tracker app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "medicine-tracker-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Cloud Messaging

1. In your Firebase project, go to **Project Settings** (gear icon)
2. Click on the **Cloud Messaging** tab
3. Click **Generate key pair** under "Web Push certificates"
4. Copy the **VAPID Key** - you'll need this later

## Step 3: Generate Service Account Key

1. In Firebase Console, go to **Project Settings**
2. Click on the **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file - this contains your service account credentials

## Step 4: Configure Environment Variables

Update your `.env` file with the Firebase configuration:

### Frontend Configuration (VITE_ prefixed)
```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### Backend Configuration (Server-side)
```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your_project_id.iam.gserviceaccount.com
```

## Step 5: Get Firebase Configuration Values

### From Firebase Console:
1. **Project Settings** → **General** → **Your apps** → **Web app** (</> icon)
2. Copy the config object values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### From Service Account JSON:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `client_id` → `FIREBASE_CLIENT_ID`

## Step 6: Test the Setup

1. Restart your development servers:
   ```bash
   # Terminal 1 (Backend)
   npm run server

   # Terminal 2 (Frontend)
   npm run dev
   ```

2. Open the app in your browser
3. Go to Medicine Tracker → Settings
4. Grant notification permissions when prompted
5. Add a medication and set a reminder time
6. Wait for the reminder time or test manually

## Step 7: Deploy to Production

When deploying to production:

1. **Update Firebase Security Rules**:
   - Go to Firebase Console → Firestore/Database
   - Set up security rules for your data

2. **Configure Domain**:
   - Add your production domain to Firebase authorized domains
   - Update VAPID key if needed

3. **Environment Variables**:
   - Set all environment variables in your production environment
   - Ensure Firebase credentials are properly secured

## Troubleshooting

### Common Issues:

1. **"process is not defined" error**:
   - Make sure you're using `import.meta.env` instead of `process.env` in frontend code

2. **Notifications not working**:
   - Check browser notification permissions
   - Verify Firebase configuration
   - Check browser console for errors

3. **Service worker not registering**:
   - Ensure `/sw.js` is accessible
   - Check browser developer tools → Application → Service Workers

4. **Push notifications not received on phone**:
   - Ensure the app is added to home screen (PWA)
   - Check that FCM token is properly registered
   - Verify Firebase project configuration

### Testing Notifications:

You can test notifications using the browser developer tools:
1. Open DevTools → Application → Notifications
2. Manually trigger notifications for testing

## Features Enabled

With this setup, you'll have:

- ✅ **Real phone push notifications** (even when app is closed)
- ✅ **Background notifications** via service worker
- ✅ **Cross-device synchronization**
- ✅ **Scheduled notifications** for medicine reminders
- ✅ **Urgent notifications** with vibration for missed doses
- ✅ **Follow-up reminders** after 15 minutes
- ✅ **Customizable reminder styles** (gentle, normal, urgent)

## Security Notes

- Never commit Firebase service account keys to version control
- Use environment variables for all sensitive configuration
- Regularly rotate service account keys
- Monitor Firebase usage and costs