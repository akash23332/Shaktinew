import os
import uuid
import time
import json
import numpy as np
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB file limit
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def detect_deepfake_simple(image_path):
    """
    Simplified deepfake detection for testing.
    Uses basic image analysis without heavy ML models.
    """
    start_time = time.time()
    try:
        # Load image
        image = Image.open(image_path).convert('RGB')
        img_array = np.array(image)
        
        # Simple heuristics for demonstration
        # 1. Image quality assessment
        brightness = np.mean(img_array)
        contrast = np.std(img_array)
        
        # 2. Color distribution analysis
        r_channel = img_array[:,:,0]
        g_channel = img_array[:,:,1] 
        b_channel = img_array[:,:,2]
        
        color_balance = abs(np.mean(r_channel) - np.mean(g_channel)) + abs(np.mean(g_channel) - np.mean(b_channel))
        
        # 3. Edge analysis (simple version)
        gray = np.mean(img_array, axis=2)
        edges = np.abs(np.diff(gray, axis=0)).sum() + np.abs(np.diff(gray, axis=1)).sum()
        edge_density = edges / (gray.shape[0] * gray.shape[1])
        
        # Calculate scores based on heuristics
        quality_score = min(1.0, (brightness / 128) * (contrast / 64))
        color_score = max(0.1, 1 - (color_balance / 100))
        edge_score = min(1.0, edge_density / 1000)
        
        # Combine scores
        face_consistency = (quality_score + color_score) / 2
        temporal_coherence = 0.95  # Default high for images
        artifact_detection = 1 - edge_score
        
        # Final authenticity calculation
        authenticity = (0.4 * face_consistency + 0.2 * temporal_coherence + 0.4 * artifact_detection)
        is_deepfake = authenticity < 0.6
        confidence = abs(authenticity - 0.5) * 2
        
        processing_time = time.time() - start_time
        
        return {
            'confidence': confidence,
            'isDeepfake': is_deepfake,
            'details': {
                'faceConsistency': face_consistency,
                'temporalCoherence': temporal_coherence,
                'artifactDetection': artifact_detection,
                'modelUsed': 'Simple Heuristic Analysis',
                'processingTime': round(processing_time, 2)
            }
        }
    except Exception as e:
        print(f"Error in detect_deepfake_simple: {e}")
        return {
            'confidence': 0.5,
            'isDeepfake': False,
            'details': {
                'faceConsistency': 0.5,
                'temporalCoherence': 0.5,
                'artifactDetection': 0.5,
                'modelUsed': 'Error Fallback',
                'processingTime': 0.1
            }
        }

@app.route('/api/deepfake/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'error': 'Invalid file type. Use PNG, JPG, JPEG, or WebP'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    # Run detection
    analysis = detect_deepfake_simple(filepath)
    analysis['metadata'] = {
        'filename': filename,
        'fileSize': os.path.getsize(filepath),
        'uploadTime': datetime.now().isoformat()
    }
    
    # Clean up uploaded file
    os.remove(filepath)
    
    return jsonify({
        'success': True,
        'analysis': analysis
    })

@app.route('/api/deepfake/generate-report', methods=['POST'])
def generate_report():
    try:
        data = request.get_json()
        if not data or 'analysisData' not in data:
            return jsonify({'success': False, 'error': 'Missing analysis data'}), 400
        
        analysis = data['analysisData']
        report_type = data.get('reportType', 'standard')
        
        # Generate report structure
        report_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().isoformat()
        
        verdict = 'DEEPFAKE DETECTED' if analysis['isDeepfake'] else 'AUTHENTIC'
        risk_level = 'HIGH' if analysis['confidence'] > 0.7 else 'MEDIUM' if analysis['confidence'] > 0.4 else 'LOW'
        
        report = {
            'id': report_id,
            'timestamp': timestamp,
            'summary': {
                'verdict': verdict,
                'confidence': f"{analysis['confidence'] * 100:.1f}%",
                'riskLevel': risk_level
            },
            'technicalDetails': {
                'faceConsistency': f"{analysis['details']['faceConsistency'] * 100:.0f}%",
                'temporalCoherence': f"{analysis['details']['temporalCoherence'] * 100:.0f}%",
                'artifactDetection': f"{analysis['details']['artifactDetection'] * 100:.0f}%",
                'modelUsed': analysis['details']['modelUsed']
            },
            'fullAnalysis': analysis,
            'reportType': report_type
        }
        
        return jsonify({
            'success': True,
            'report': report
        })
    except Exception as e:
        print(f"Report generation error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Deepfake Detection API',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("Starting Simple Deepfake Detection Server...")
    app.run(host='0.0.0.0', port=3002, debug=True)
