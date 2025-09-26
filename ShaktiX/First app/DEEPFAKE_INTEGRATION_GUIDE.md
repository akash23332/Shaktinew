# 🔍 Deepfake Detection - Complete Integration Guide

## 📋 Overview

Your ShaktiX deepfake detection system is **already fully implemented** and ready to use! This guide shows you how to set it up and integrate the frontend with the backend.

## 🏗️ Architecture

```
Frontend (React/Vite)     Backend (Flask/Python)
┌─────────────────────┐   ┌──────────────────────┐
│ DeepfakeDetection   │◄──┤ Flask API Server     │
│ Component           │   │ (Port 3001)          │
│                     │   │                      │
│ • File Upload       │   │ • AI Model Analysis  │
│ • Progress Tracking │   │ • Fallback Detection │
│ • Results Display   │   │ • Report Generation  │
│ • Report Generation │   │ • File Processing    │
└─────────────────────┘   └──────────────────────┘
```

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
# Navigate to backend directory
cd "c:\Users\LENOVO\OneDrive\Desktop\ShaktiX\ShaktiX\First app\Deepfake_backend"

# Install Python packages
pip install -r requirements.txt
```

### Step 2: Start the Backend Server

```bash
# Run the Flask server
python app.py
```

You should see:
```
✅ Transformers and PyTorch available (if AI libraries installed)
Loading Hugging Face deepfake detection model...
✅ Model loaded successfully!
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:3001
* Running on http://[::1]:3001
```

### Step 3: Start the Frontend

```bash
# In a new terminal, navigate to frontend
cd "c:\Users\LENOVO\OneDrive\Desktop\ShaktiX\ShaktiX\First app"

# Start the React development server
npm run dev
```

### Step 4: Access the Application

1. Open your browser to `http://localhost:5173`
2. Navigate to **Cybersecurity** → **Deepfake Detection**
3. Upload an image and analyze it!

## 🔧 Configuration Options

### Environment Variables (.env)

Create a `.env` file in the backend directory:

```env
# Optional: Hugging Face token for enhanced AI models
HF_TOKEN=your_huggingface_token_here

# Server configuration
PORT=3001
```

### AI Model Configuration

Your system supports multiple detection modes:

1. **Full AI Mode** (Best accuracy)
   - Requires: `transformers`, `torch`, `torchvision`
   - Uses: Hugging Face deepfake detection model
   - Fallback: Advanced heuristic analysis

2. **Fallback Mode** (Good accuracy)
   - Uses: Computer vision techniques
   - Includes: Face detection, artifact analysis, quality metrics

## 📡 API Endpoints

### 1. Analyze Image
```http
POST http://localhost:3001/api/deepfake/analyze
Content-Type: multipart/form-data

Body: image file (PNG, JPG, JPEG, WebP)
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "confidence": 0.85,
    "isDeepfake": true,
    "details": {
      "faceConsistency": 0.7,
      "temporalCoherence": 0.95,
      "artifactDetection": 0.8,
      "modelUsed": "HuggingFace Deepfake CNN + Custom Features",
      "processingTime": 2.1
    },
    "metadata": {
      "filename": "test.jpg",
      "fileSize": 245760,
      "uploadTime": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 2. Generate Report
```http
POST http://localhost:3001/api/deepfake/generate-report
Content-Type: application/json

{
  "analysisData": { /* analysis result from step 1 */ },
  "reportType": "standard"
}
```

## 🎨 Frontend Features

### Interactive Workflow
- **Step 1**: Upload image with drag-and-drop or file picker
- **Step 2**: Real-time AI analysis with progress tracking
- **Step 3**: Detailed results with confidence scores
- **Step 4**: Professional report generation

### UI Components
- File preview with image thumbnails
- Step-by-step progress indicators
- Confidence scoring with color-coded results
- Technical details breakdown
- Export and reporting functionality

## 🔍 Detection Features

### AI-Powered Analysis
1. **Spectral Analysis** - Frequency pattern detection
2. **Face Consistency** - Facial landmark verification
3. **Temporal Coherence** - Motion and timing analysis
4. **Artifact Detection** - AI generation signatures
5. **Quality Assessment** - Image quality metrics

### Results Interpretation
- **Confidence Score**: 0-100% likelihood of manipulation
- **Risk Levels**: LOW (0-40%), MEDIUM (40-70%), HIGH (70-100%)
- **Technical Metrics**: Individual component scores
- **Processing Time**: Analysis duration

## 🛠️ Troubleshooting

### Common Issues

#### 1. Backend Won't Start
```bash
# Check Python version (3.8+ required)
python --version

# Install missing dependencies
pip install flask flask-cors opencv-python pillow numpy
```

#### 2. AI Model Loading Fails
- **Symptom**: "⚠️ Failed to load HF model"
- **Solution**: Install AI dependencies or use fallback mode
```bash
pip install transformers torch torchvision
```

#### 3. CORS Errors
- **Symptom**: Frontend can't connect to backend
- **Solution**: Ensure backend allows your frontend URL
- **Check**: `CORS(app, origins=["http://localhost:5173"])` in app.py

#### 4. File Upload Fails
- **Check**: File size (max 10MB)
- **Check**: File format (PNG, JPG, JPEG, WebP only)
- **Check**: Backend `uploads/` directory exists

### Performance Optimization

#### For Better Accuracy
1. Install full AI dependencies (`transformers`, `torch`)
2. Configure Hugging Face token in `.env`
3. Use high-quality input images

#### For Faster Processing
1. Use smaller image sizes (resize before upload)
2. Use fallback mode for quick analysis
3. Optimize server resources

## 🔐 Security Features

### File Handling
- Secure filename sanitization
- File type validation
- Size limits (10MB max)
- Automatic cleanup after processing

### Data Protection
- No permanent file storage
- Temporary processing only
- CORS protection
- Input validation

## 📊 Integration Examples

### Custom Analysis
```javascript
// Frontend: Custom analysis call
const analyzeCustomImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('http://localhost:3001/api/deepfake/analyze', {
    method: 'POST',
    body: formData,
  });
  
  const result = await response.json();
  return result.analysis;
};
```

### Batch Processing
```python
# Backend: Process multiple images
@app.route('/api/deepfake/batch-analyze', methods=['POST'])
def batch_analyze():
    files = request.files.getlist('images')
    results = []
    
    for file in files:
        if allowed_file(file.filename):
            # Process each file
            analysis = detect_deepfake(file)
            results.append(analysis)
    
    return jsonify({'results': results})
```

## 🎯 Next Steps

### Enhancements You Can Add
1. **Video Analysis** - Extend to video files
2. **Batch Processing** - Multiple file uploads
3. **API Authentication** - Secure API access
4. **Database Storage** - Save analysis history
5. **Advanced Reporting** - PDF export, detailed forensics

### Production Deployment
1. **Environment Setup** - Production environment variables
2. **Server Configuration** - Gunicorn, nginx setup
3. **Monitoring** - Logging and error tracking
4. **Scaling** - Load balancing, caching

## ✅ Verification Checklist

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend API
- [ ] File upload works correctly
- [ ] Analysis returns results
- [ ] Report generation functions
- [ ] Error handling works (try invalid files)
- [ ] UI displays results properly

## 🆘 Support

If you encounter issues:

1. **Check Console Logs** - Browser developer tools
2. **Check Server Logs** - Backend terminal output
3. **Verify Dependencies** - All packages installed
4. **Test API Directly** - Use Postman or curl
5. **Check File Permissions** - Upload directory writable

---

**🎉 Congratulations!** Your deepfake detection system is ready to protect users from manipulated media. The integration between your React frontend and Flask backend provides a professional-grade solution with both AI-powered and fallback detection methods.
