# ShaktiX Health App

A comprehensive health and wellness application built with React, featuring AI-powered health analysis, telemedicine, and various health tracking tools.

## Features

- **Nearby Doctors**: Find healthcare professionals using real-time location data
- **AI Symptom Checker**: Get health insights powered by artificial intelligence
- **Medicine Tracker**: Keep track of your medications and reminders
- **Pregnancy Tracker**: Monitor pregnancy progress and get personalized advice
- **Deepfake Detection**: Advanced AI-powered deepfake detection tools
- **Voice Shield**: Voice analysis and protection features

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "ShaktiX/First app"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys (see setup guides below).

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Configuration

### Google Maps API (Required for Nearby Doctors)
- Follow the setup guide in `GOOGLE_MAPS_SETUP.md`
- Get API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
- Enable Maps JavaScript API and Places API

### Firebase (Optional)
- Configure Firebase settings in `.env` for additional features

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── health-components/     # Health-related components
│   └── ui/                    # Reusable UI components
├── pages/                     # Application pages
├── hooks/                     # Custom React hooks
├── lib/                       # Utility libraries
└── context/                   # React context providers
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
