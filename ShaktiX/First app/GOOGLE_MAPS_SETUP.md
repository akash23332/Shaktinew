# Google Maps API Setup Guide

## Prerequisites
- Google Cloud Console account
- A project in Google Cloud Console

## Step 1: Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Enable billing for your project (required for Maps API)
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "API Key"
6. Copy the generated API key

## Step 2: Enable Required APIs
In Google Cloud Console, go to "APIs & Services" > "Library" and enable:
- Maps JavaScript API
- Places API

## Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env` in your project root:
   ```bash
   cp .env.example .env
   ```

2. Add your API key to the `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

## Step 4: Restrict API Key (Recommended for Production)
1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domain(s):
   - `localhost:5173` (for development)
   - `yourdomain.com` (for production)
5. Under "API restrictions", select "Restrict key" and check:
   - Maps JavaScript API
   - Places API

## Step 5: Test the Setup
1. Restart your development server
2. Navigate to the Nearby Doctors page
3. The component should now work with real-time location data

## Troubleshooting
- **API Key not working**: Check that the APIs are enabled and the key is correctly added to `.env`
- **Billing issues**: Ensure billing is enabled for your Google Cloud project
- **CORS errors**: Make sure your domain is added to API key restrictions
- **Quota exceeded**: Check your API usage limits in Google Cloud Console

## Cost Information
Google Maps APIs have usage limits and costs:
- Free tier: $200 credit per month
- Maps JavaScript API: Free for basic usage
- Places API: $17 per 1,000 requests (after free tier)

Monitor your usage in Google Cloud Console > APIs & Services > Dashboard.