import { useEffect, useState, useRef } from "react";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import "./voice.css";

export default function VoiceShield() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioFile({ blob: audioBlob, url: audioUrl, name: `recording-${Date.now()}.wav` });
        setCurrentStep(2);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const onFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setAudioFile({ blob: file, url: audioUrl, name: file.name });
      setCurrentStep(2);
    }
  };

  const runAnalysis = async () => {
    if (!audioFile) return;
    
    setIsProcessing(true);
    setCurrentStep(2);
    setAnalysisResult(null);
    
    try {
      console.log('🎙️ Starting voice analysis...');
      
      // Preprocessing step
      setCurrentStep(3);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('audio', audioFile.blob, audioFile.name);
      
      // Call real voice analysis API
      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        body: formData
      });
      
      let data;
      try {
        data = await response.json();
      } catch (_) {
        data = null;
      }

      if (!response.ok) {
        const serverMsg = data?.message || data?.error;
        const fileInfo = data?.fileInfo ? `\nFile: ${data.fileInfo.originalname} (${data.fileInfo.size} bytes, ${data.fileInfo.mimetype})` : '';
        const stack = data?.stack ? `\n\nStack:\n${data.stack}` : '';
        throw new Error(`${serverMsg || 'Server error'} (status ${response.status})${fileInfo}${stack}`);
      }
      
      if (!data) {
        throw new Error('Empty response from server');
      }
      
      if (data.success) {
        console.log('✅ Voice analysis completed:', data.result);
        setAnalysisResult(data.result);
        setCurrentStep(4);
        
        // Show detailed alert with results
        const riskEmoji = data.result.riskLevel === 'HIGH' ? '🚨' : 
                         data.result.riskLevel === 'MEDIUM' ? '⚠️' : '✅';
        
        alert(`${riskEmoji} Voice Analysis Complete!\n\n` +
              `🎯 Result: ${data.result.isCloned ? 'POTENTIAL VOICE CLONE' : 'APPEARS AUTHENTIC'}\n` +
              `📊 Authenticity: ${(data.result.authenticity * 100).toFixed(1)}%\n` +
              `🔍 Confidence: ${(data.result.confidence * 100).toFixed(1)}%\n` +
              `⚠️ Risk Level: ${data.result.riskLevel}\n\n` +
              `📋 Analysis ID: ${data.analysisId}`);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
      
    } catch (error) {
      console.error('❌ Voice analysis error:', error);
      alert(`❌ Analysis Failed\n\n${error.message}\n\nTips:\n- Ensure the file is under 10MB\n- Try WAV/MP3 if other formats fail\n- Check server console for details`);
      setCurrentStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen services-page voice-page">
      <Navigation />

      {/* Hero */}
      <section className="voice-hero">
        <div className="container voice-hero-content">
          <h1 className="voice-title">Voice Shield</h1>
          <p className="voice-subtitle">
            Upload or record audio, preprocess, analyze, and preserve evidence.
          </p>
        </div>
      </section>

      {/* Input & Preview */}
      <section className="voice-section">
        <div className="container">
          <div className="voice-card input-card">
            <h2>Input & Preview</h2>
            
            <div className="input-controls">
              <input 
                type="file" 
                className="auth-input" 
                accept="audio/*"
                onChange={onFileSelect}
              />
              {!audioFile && <p className="file-hint">No file selected.</p>}
              
              <div className="record-controls">
                <button 
                  className={`button ${isRecording ? 'outline' : 'primary'}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? 'Stop' : 'Record'}
                </button>
              </div>
            </div>

            {audioFile && (
              <div className="audio-preview">
                <div className="audio-info">
                  <strong>{audioFile.name}</strong>
                </div>
                <audio controls src={audioFile.url} className="audio-player" />
              </div>
            )}
          </div>

          {/* Preprocessing */}
          <div className="voice-card preprocessing-card">
            <h2>Preprocessing</h2>
            <p>Converts to WAV 16bit mono, normalizes volume, trims silence, applies high-pass, pre-emphasis and noise gate.</p>
            
            {audioFile && (
              <button 
                className="button primary"
                onClick={runAnalysis}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Run Analysis Pipeline'}
              </button>
            )}
          </div>

          {/* Evidence Integrity */}
          <div className="voice-card evidence-card">
            <h2>Evidence Integrity</h2>
            <p>{currentStep >= 3 ? 'Will appear after preprocessing.' : 'Will appear after preprocessing.'}</p>
            
            {currentStep >= 3 && (
              <div className="integrity-status">
                <span className="status-check">✓</span>
                <span>Audio fingerprint generated and secured</span>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="voice-card result-card">
            <h2>Result</h2>
            <p>{analysisResult ? 'Run the pipeline to view results.' : 'Run the pipeline to view results.'}</p>
            
            {analysisResult && (
              <div className="analysis-results">
                <div className="result-summary">
                  <div className={`authenticity-score ${analysisResult.isCloned ? 'cloned' : 'authentic'}`}>
                    {analysisResult.isCloned ? 
                      `🚨 ${analysisResult.riskLevel} RISK: Potential Voice Clone` : 
                      '✅ Appears Authentic'}
                  </div>
                  <div className="confidence-display">
                    Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="authenticity-display">
                    Authenticity: {(analysisResult.authenticity * 100).toFixed(1)}%
                  </div>
                  <div className="risk-display">
                    Risk Level: <span className={`risk-${analysisResult.riskLevel.toLowerCase()}`}>
                      {analysisResult.riskLevel}
                    </span>
                  </div>
                </div>
                
                <div className="detailed-metrics">
                  <h4>🔬 Technical Analysis</h4>
                  <div className="metric-item">
                    <span>Spectral Analysis:</span>
                    <span>{(analysisResult.details.spectralAnalysis * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Voiceprint Uniqueness:</span>
                    <span>{(analysisResult.details.voiceprintMatch * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Temporal Consistency:</span>
                    <span>{(analysisResult.details.temporalConsistency * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Artifact Detection:</span>
                    <span>{((1 - analysisResult.details.artifactDetection) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Audio Quality:</span>
                    <span>{(analysisResult.details.qualityScore * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Technical Details */}
                {analysisResult.technicalDetails && (
                  <div className="technical-details">
                    <h4>🔍 Technical Details</h4>
                    
                    {analysisResult.technicalDetails.spectralAnomalies?.length > 0 && (
                      <div className="detail-section">
                        <strong>Spectral Anomalies:</strong>
                        <ul>
                          {analysisResult.technicalDetails.spectralAnomalies.map((anomaly, index) => (
                            <li key={index}>{anomaly}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysisResult.technicalDetails.detectedArtifacts?.length > 0 && (
                      <div className="detail-section">
                        <strong>Detected Artifacts:</strong>
                        <ul>
                          {analysisResult.technicalDetails.detectedArtifacts.map((artifact, index) => (
                            <li key={index}>{artifact}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysisResult.technicalDetails.voiceCharacteristics && (
                      <div className="detail-section">
                        <strong>Voice Characteristics:</strong>
                        <div className="characteristics-grid">
                          <div>Pitch: {analysisResult.technicalDetails.voiceCharacteristics.pitch}</div>
                          <div>Timbre: {analysisResult.technicalDetails.voiceCharacteristics.timbre}</div>
                          <div>Accent: {analysisResult.technicalDetails.voiceCharacteristics.accent}</div>
                          <div>Style: {analysisResult.technicalDetails.voiceCharacteristics.speakingStyle}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations && (
                  <div className="recommendations">
                    <h4>💡 Recommendations</h4>
                    <ul>
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="result-actions">
                  <button className="button primary">Generate Report</button>
                  <button className="button outline">Export Evidence</button>
                  <button className="button outline">Save to Evidence Locker</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
