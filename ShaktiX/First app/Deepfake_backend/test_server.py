#!/usr/bin/env python3
"""
Simple test server to diagnose connection issues
"""
import sys
from flask import Flask, jsonify
from flask_cors import CORS

print("🚀 Starting test server...")
print(f"Python version: {sys.version}")

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"])

@app.route('/api/health', methods=['GET'])
def health():
    print("📡 Health check requested")
    return jsonify({
        'status': 'healthy',
        'message': 'Test server is running',
        'python_version': sys.version
    })

@app.route('/test', methods=['GET'])
def test():
    print("🧪 Test endpoint requested")
    return jsonify({'message': 'Test successful!'})

if __name__ == '__main__':
    print("🌐 Starting Flask server on http://0.0.0.0:3001")
    print("📋 Available endpoints:")
    print("  - GET /api/health")
    print("  - GET /test")
    try:
        app.run(host='0.0.0.0', port=3001, debug=True)
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
