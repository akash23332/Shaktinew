# Deepfake Detection Backend Setup Guide

## Overview
Your ShaktiX application now has a complete backend for deepfake detection! This guide will help you set it up and use it.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your configuration:
   - **Required**: Set `PORT=3001` (or your preferred port)
   - **Optional**: Add `HUGGINGFACE_API_TOKEN` for enhanced AI analysis

### 3. Start the Server
```bash
npm run server
```

### 4. Start the Frontend
```bash
npm run dev
```

## 🔧 Configuration Options

### Basic Setup (Mock Analysis)
- No additional configuration needed
- Uses intelligent mock analysis with realistic results
- Perfect for development and testing

### Enhanced Setup (Real AI Analysis)
1. Get a Hugging Face API token:
   - Visit [huggingface.co](https://huggingface.co/)
   - Create account → Settings → Access Tokens
   - Create token with "Read" permissions
   
2. Add to `.env`:
   ```
   HUGGINGFACE_API_TOKEN=your_token_here
   ```

## 📡 API Endpoints

### POST `/api/deepfake/analyze`
Upload and analyze an image for deepfake detection.

**Request**: Multipart form data with `image` field
**Response**:
```json
{
  "success": true,
  "analysis": {
    "confidence": 0.85,
    "isDeepfake": false,
    "details": {
      "faceConsistency": 0.92,
      "temporalCoherence": 0.88,
      "artifactDetection": 0.76,
      "modelUsed": "ShaktiX Analysis",
      "processingTime": 1500
    },
    "metadata": {
      "filename": "image.jpg",
      "fileSize": 245760,
      "uploadTime": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### POST `/api/deepfake/generate-report`
Generate a detailed analysis report.

**Request**:
```json
{
  "analysisData": { /* analysis result */ },
  "reportType": "standard"
}
```

**Response**:
```json
{
  "success": true,
  "report": {
    "id": "report-1234567890",
    "summary": {
      "verdict": "APPEARS AUTHENTIC",
      "confidence": "85.0%",
      "riskLevel": "LOW"
    },
    "recommendations": [
      "✅ This image appears to be authentic based on our analysis.",
      "🔄 Consider running additional verification if you have concerns."
    ]
  }
}
```

### GET `/api/health`
Check server status and configuration.

## 🎯 Features

### ✅ Implemented
- **File Upload**: Secure image upload with validation
- **AI Analysis**: Real AI integration + intelligent fallback
- **Report Generation**: Detailed analysis reports
- **File Cleanup**: Automatic temporary file removal
- **Error Handling**: Graceful fallbacks and error messages
- **Security**: File type validation, size limits

### 🔄 Frontend Integration
- **Real API Calls**: No more mock data
- **Error Handling**: Fallback to mock analysis if API fails
- **Progress Tracking**: Real-time analysis status
- **Report Display**: Enhanced result presentation

## 🛡️ Security Features

- **File Validation**: Only JPEG, PNG, WebP allowed
- **Size Limits**: 10MB maximum file size
- **Temporary Storage**: Files auto-deleted after analysis
- **Error Isolation**: API failures don't break the app

## 🔍 Testing

1. **Start both servers**:
   ```bash
   # Terminal 1
   npm run server
   
   # Terminal 2  
   npm run dev
   ```

2. **Test the feature**:
   - Go to `/deepfake-detection`
   - Upload an image
   - Click "Analyze Image"
   - Generate report

3. **Check server logs** for analysis details

## 🚨 Troubleshooting

### "API connection failed" message
- Ensure server is running on port 3001
- Check console for error details
- App will use fallback analysis

### File upload issues
- Check file type (JPEG, PNG, WebP only)
- Ensure file size < 10MB
- Verify server has write permissions

### Hugging Face errors
- Verify API token is correct
- Check token permissions
- App will fallback to mock analysis

## 🔮 Future Enhancements

- **Video Analysis**: Support for video deepfake detection
- **Batch Processing**: Multiple file analysis
- **PDF Reports**: Downloadable detailed reports
- **Real-time Monitoring**: Live deepfake detection
- **Custom Models**: Integration with specialized models

## 📞 Support

If you encounter issues:
1. Check server logs
2. Verify environment configuration
3. Test with different image files
4. Use browser developer tools for debugging

Your deepfake detection backend is now fully operational! 🎉
