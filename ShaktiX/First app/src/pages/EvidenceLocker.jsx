import { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import "./evidence.css";

export default function EvidenceLocker() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [evidenceRecord, setEvidenceRecord] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const onPick = async (e) => {
    setError("");
    setHash("");
    setTimestamp("");
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      setCurrentStep(2);
      await generateHash(f);
    }
  };

  async function generateHash(f) {
    try {
      setBusy(true);
      const buf = await f.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buf);
      const bytes = Array.from(new Uint8Array(digest));
      const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHash(hex);
      setCurrentStep(3);
      // Auto-generate timestamp
      setTimeout(() => {
        setTimestamp(new Date().toISOString());
        setCurrentStep(4);
      }, 1000);
    } catch (e) {
      console.error(e);
      setError("Unable to compute hash in this browser.");
    } finally {
      setBusy(false);
    }
  }

  const preserveEvidence = async () => {
    if (!hash || !timestamp || !file) {
      setError("Please complete all steps before preserving evidence");
      return;
    }

    try {
      setBusy(true);
      console.log('Preserving evidence...');

      const response = await fetch(`${API_BASE}/evidence/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: hash,
          timestamp: timestamp,
          filename: file.name,
          fileSize: file.size,
          fileType: file.type,
          metadata: {
            originalName: file.name,
            uploadTime: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setEvidenceRecord(data.evidence);
        alert(`✅ Evidence Preserved Successfully!\n\n📄 Evidence ID: ${data.evidence.id}\n🔗 Blockchain Anchor: ${data.evidence.blockchainAnchor}\n⏰ Timestamp: ${data.evidence.timestamp}\n\n✨ Your evidence is now tamper-proof and court-ready!`);
      } else {
        throw new Error(data.error || 'Failed to preserve evidence');
      }
    } catch (error) {
      console.error('Evidence preservation error:', error);
      setError(`Failed to preserve evidence: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const verifyEvidence = async () => {
    if (!hash || !file) {
      setError("Please upload a file first");
      return;
    }

    try {
      setBusy(true);
      console.log('Verifying evidence...');

      const response = await fetch(`${API_BASE}/evidence/verify-hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: hash
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.verification.found) {
        setVerificationResult(data.verification);
        alert(`🔍 Evidence Verification Complete!\n\n✅ Evidence Found: ${data.verification.evidenceId}\n📁 Filename: ${data.verification.filename}\n✅ Integrity: ${data.verification.integrity}\n🔗 Chain of Custody: ${data.verification.chainOfCustody}\n⛓️ Blockchain Status: ${data.verification.blockchainStatus}\n🔗 Blockchain Anchor: ${data.verification.blockchainAnchor}\n⏰ Original Timestamp: ${new Date(data.verification.originalTimestamp).toLocaleString()}\n\n🎯 Evidence authenticity confirmed!`);
      } else if (data.success && !data.verification.found) {
        setVerificationResult(data.verification);
        alert(`❌ Evidence Not Found!\n\n🔍 Hash Search: No matching evidence found\n❓ Integrity: ${data.verification.integrity}\n❓ Chain of Custody: ${data.verification.chainOfCustody}\n❓ Blockchain Status: ${data.verification.blockchainStatus}\n\n⚠️ This file may not be preserved in our system or may have been tampered with.`);
      } else {
        throw new Error(data.error || 'Failed to verify evidence');
      }
    } catch (error) {
      console.error('Evidence verification error:', error);
      setError(`Failed to verify evidence: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const searchEvidence = async () => {
    if (!searchId.trim()) {
      setSearchError("Please enter an Evidence ID");
      return;
    }

    try {
      setBusy(true);
      setSearchError("");
      console.log('Searching for evidence:', searchId);

      const response = await fetch(`${API_BASE}/evidence/${searchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSearchResult(data.evidence);
        alert(`🔍 Evidence Found!\n\n📄 Evidence ID: ${data.evidence.id}\n📁 Filename: ${data.evidence.filename}\n📊 File Size: ${(data.evidence.fileSize / 1024).toFixed(1)} KB\n🔗 Hash: ${data.evidence.hash.substring(0, 16)}...\n⏰ Created: ${new Date(data.evidence.createdAt).toLocaleString()}\n✅ Status: ${data.evidence.status.toUpperCase()}\n🔒 Blockchain Anchor: ${data.evidence.blockchainAnchor}`);
      } else {
        throw new Error(data.error || 'Evidence not found');
      }
    } catch (error) {
      console.error('Evidence search error:', error);
      setSearchError(`Failed to find evidence: ${error.message}`);
      setSearchResult(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen services-page evidence-page">
      <Navigation />

      {/* Hero */}
      <section className="evid-hero">
        <div className="container evid-hero-content">
          <div className="evid-badges">
            <div className="evid-badge court">🏛️ Court-friendly provenance</div>
            <div className="evid-badge blockchain">Preserve with Blockchain</div>
          </div>
          <h1 className="evid-title">Evidence Preservation</h1>
          <p className="evid-subtitle">
            Upload your evidence (screenshot, PDF, chat logs, etc.) and we'll generate a unique digital fingerprint (SHA‑256 hash).
            This ensures your file cannot be altered or denied later.
          </p>
          
          {/* Evidence Search Section */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>🔍 Find Your Evidence</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter Evidence ID (e.g., evidence-1727172648000)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={searchEvidence}
                disabled={busy}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: busy ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {busy ? '⏳' : '🔍 Search'}
              </button>
            </div>
            {searchError && (
              <div style={{ marginTop: '10px', color: '#ff6b6b', fontSize: '14px' }}>
                ❌ {searchError}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Workflow */}
      <section className="workflow-section">
        <div className="container">
          <h2 className="workflow-title">Interactive Workflow</h2>
          
          {/* Step Indicators */}
          <div className="step-indicators">
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">01</span>
              <span className="step-label">Upload</span>
            </div>
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">02</span>
              <span className="step-label">Hash</span>
            </div>
            <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">03</span>
              <span className="step-label">Timestamp</span>
            </div>
            <div className={`step-indicator ${currentStep >= 4 ? 'active' : ''}`}>
              <span className="step-number">04</span>
              <span className="step-label">Verify</span>
            </div>
          </div>

          {/* Workflow Cards */}
          <div className="workflow-grid">
            <div className="workflow-card upload">
              <h3>Upload</h3>
              <p>Submit file securely with client-side hashing.</p>
              <input type="file" className="auth-input" onChange={onPick} />
              {file && (
                <div className="evid-file-info">
                  <div><strong>Name:</strong> {file.name}</div>
                  <div><strong>Size:</strong> {Math.round(file.size/1024)} KB</div>
                  <div><strong>Type:</strong> {file.type || 'unknown'}</div>
                </div>
              )}
            </div>

            <div className="workflow-card hash">
              <h3>Hash</h3>
              <p>Generate and display a unique SHA-256 fingerprint.</p>
              {busy && <p className="evid-muted">Generating SHA‑256 hash…</p>}
              {hash && (
                <div className="hash-display">
                  <code className="hash-value">{hash}</code>
                </div>
              )}
              {error && <p className="evid-error">{error}</p>}
            </div>

            <div className="workflow-card timestamp">
              <h3>Timestamp</h3>
              <p>Anchor the hash into an append-only ledger.</p>
              {timestamp && (
                <div className="timestamp-display">
                  <code className="timestamp-value">{timestamp}</code>
                </div>
              )}
            </div>

            <div className="workflow-card verify">
              <h3>Verify</h3>
              <p>Re-upload anytime to confirm integrity and chain-of-custody.</p>
              {currentStep >= 4 && (
                <div className="verify-status">
                  <span className="verify-check">✓</span>
                  <span>Evidence preserved successfully</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="workflow-actions">
            <button 
              className="button primary lg" 
              disabled={currentStep < 4 || busy}
              onClick={preserveEvidence}
              style={{ cursor: currentStep >= 4 && !busy ? 'pointer' : 'not-allowed' }}
            >
              {busy ? '⏳ Preserving...' : '🔒 Preserve Evidence'}
            </button>
            <button 
              className="button outline lg"
              disabled={!hash || busy}
              onClick={verifyEvidence}
              style={{ cursor: hash && !busy ? 'pointer' : 'not-allowed' }}
            >
              {busy ? '⏳ Verifying...' : '🔍 Verify Evidence'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '5px',
              color: '#c33'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Success Display */}
          {evidenceRecord && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#efe',
              border: '1px solid #cfc',
              borderRadius: '5px',
              color: '#363'
            }}>
              <strong>✅ Evidence Preserved!</strong>
              <br />Evidence ID: {evidenceRecord.id}
              <br />Blockchain Anchor: {evidenceRecord.blockchainAnchor}
              <br /><strong>💡 Save this Evidence ID to retrieve your evidence later!</strong>
            </div>
          )}

          {/* Search Results Display */}
          {searchResult && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              color: '#333'
            }}>
              <h4 style={{ marginBottom: '15px', color: '#007bff' }}>🔍 Evidence Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                <div><strong>Evidence ID:</strong> {searchResult.id}</div>
                <div><strong>Status:</strong> <span style={{ color: '#28a745' }}>{searchResult.status.toUpperCase()}</span></div>
                <div><strong>Filename:</strong> {searchResult.filename}</div>
                <div><strong>File Size:</strong> {(searchResult.fileSize / 1024).toFixed(1)} KB</div>
                <div><strong>File Type:</strong> {searchResult.fileType}</div>
                <div><strong>Verified:</strong> {searchResult.verified ? '✅ Yes' : '❌ No'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Hash:</strong> <code style={{ fontSize: '12px', backgroundColor: '#f1f3f4', padding: '2px 4px', borderRadius: '3px' }}>{searchResult.hash}</code></div>
                <div><strong>Created:</strong> {new Date(searchResult.createdAt).toLocaleString()}</div>
                <div><strong>Blockchain Anchor:</strong> {searchResult.blockchainAnchor}</div>
              </div>
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
                <strong>📋 How to Use This Evidence:</strong>
                <ul style={{ marginTop: '5px', paddingLeft: '20px', fontSize: '13px' }}>
                  <li>Reference the Evidence ID in legal documents</li>
                  <li>Use the hash to verify file integrity</li>
                  <li>Cite the blockchain anchor for timestamp proof</li>
                  <li>Present this record as proof of authenticity</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
