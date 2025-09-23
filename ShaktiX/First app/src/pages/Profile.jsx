import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [website, setWebsite] = useState("");
  const [emgName, setEmgName] = useState("");
  const [emgPhone, setEmgPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setDob(user.dob || "");
      setCity(user.city || "");
      setCountry(user.country || "");
      setAddress(user.address || "");
      setOccupation(user.occupation || "");
      setWebsite(user.website || "");
      setEmgName(user.emgName || "");
      setEmgPhone(user.emgPhone || "");
      setAvatar(user.avatar || "");
      setPreview(user.avatar || "");
    }
  }, [user]);

  const onPickFile = () => fileRef.current && fileRef.current.click();

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = String(ev.target?.result || "");
      setPreview(dataUrl);
    };
    reader.readAsDataURL(f);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Persist avatar preview as avatar, fallback to existing
    updateProfile({
      name,
      email,
      phone,
      bio,
      dob,
      city,
      country,
      address,
      occupation,
      website,
      emgName,
      emgPhone,
      avatar: preview || avatar,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="min-h-screen profile-page">
      <Navigation />
      
      {/* Professional Hero Section */}
      <div className="profile-hero-professional">
        <div className="profile-hero-bg">
          <div className="profile-hero-pattern"></div>
          <div className="profile-hero-gradient"></div>
        </div>
        
        <div className="profile-hero-content">
          <div className="profile-card-header">
            <div className="profile-avatar-section-professional">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-professional" onClick={onPickFile}>
                  <div className="profile-avatar-inner">
              {preview ? (
                      <img src={preview} alt="Profile" className="profile-avatar-image" />
                    ) : (
                      <div className="profile-avatar-default">
                        <div className="profile-avatar-icon">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                        </div>
                </div>
              )}
            </div>
                  <div className="profile-avatar-overlay">
                    <div className="profile-avatar-upload-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
            </div>
                    <span className="profile-avatar-text">Change Photo</span>
              </div>
            </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} hidden />
            </div>
              
              <div className="profile-info-professional">
                <div className="profile-name-section">
                  <h1 className="profile-name-professional">{name || "Your Name"}</h1>
                  <div className="profile-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"></path>
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                      <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                      <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                    </svg>
                    Verified
              </div>
            </div>

                <p className="profile-title-professional">{occupation || "Professional Title"}</p>
                
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{city && country ? `${city}, ${country}` : "Location not set"}</span>
          </div>

                  <div className="profile-detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>Member since {new Date().getFullYear()}</span>
              </div>
                  
                  <div className="profile-detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{phone || "Contact not provided"}</span>
              </div>
            </div>
              </div>
            </div>

            <div className="profile-actions-professional">
              <button 
                className={`profile-edit-btn-professional ${isEditing ? 'editing' : ''}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                <div className="profile-edit-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
              </div>
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>
              </div>
              </div>
              </div>
            </div>

      <main className="profile-main">
        <div className="profile-container">
          {/* Navigation Tabs */}
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Personal Info
            </button>
            <button 
              className={`profile-tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contact Details
            </button>
            <button 
              className={`profile-tab ${activeTab === 'professional' ? 'active' : ''}`}
              onClick={() => setActiveTab('professional')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Professional
            </button>
            </div>

          {/* Profile Content */}
          <div className="profile-content">
            {isEditing ? (
              <form className="profile-edit-form" onSubmit={onSubmit}>
                {activeTab === 'personal' && (
                  <div className="profile-section">
                    <h3 className="profile-section-title">Personal Information</h3>
                    <div className="profile-form-grid">
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="name">Full Name</label>
                        <input 
                          className="profile-input" 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="email">Email Address</label>
                        <input 
                          className="profile-input" 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="bio">Bio</label>
                        <textarea 
                          className="profile-textarea" 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          placeholder="Tell us about yourself..."
                          rows="3"
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="dob">Date of Birth</label>
                        <input 
                          className="profile-input" 
                          id="dob" 
                          type="date" 
                          value={dob} 
                          onChange={(e) => setDob(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="profile-section">
                    <h3 className="profile-section-title">Contact Information</h3>
                    <div className="profile-form-grid">
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="phone">Phone Number</label>
                        <input 
                          className="profile-input" 
                          id="phone" 
                          inputMode="numeric" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))} 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="address">Address</label>
                        <input 
                          className="profile-input" 
                          id="address" 
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)} 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="city">City</label>
                        <input 
                          className="profile-input" 
                          id="city" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="country">Country</label>
                        <input 
                          className="profile-input" 
                          id="country" 
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)} 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="emgName">Emergency Contact Name</label>
                        <input 
                          className="profile-input" 
                          id="emgName" 
                          value={emgName} 
                          onChange={(e) => setEmgName(e.target.value)} 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="emgPhone">Emergency Contact Phone</label>
                        <input 
                          className="profile-input" 
                          id="emgPhone" 
                          inputMode="numeric" 
                          value={emgPhone} 
                          onChange={(e) => setEmgPhone(e.target.value.replace(/\D/g, "").slice(0, 15))} 
                        />
              </div>
              </div>
            </div>
                )}

                {activeTab === 'professional' && (
                  <div className="profile-section">
                    <h3 className="profile-section-title">Professional Information</h3>
                    <div className="profile-form-grid">
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="occupation">Occupation</label>
                        <input 
                          className="profile-input" 
                          id="occupation" 
                          value={occupation} 
                          onChange={(e) => setOccupation(e.target.value)} 
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-label" htmlFor="website">Website</label>
                        <input 
                          className="profile-input" 
                          id="website" 
                          type="url" 
                          placeholder="https://yourwebsite.com" 
                          value={website} 
                          onChange={(e) => setWebsite(e.target.value)} 
                        />
              </div>
              </div>
            </div>
                )}

                <div className="profile-form-actions">
                  <button type="button" className="profile-cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="profile-save-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17,21 17,13 7,13 7,21"></polyline>
                      <polyline points="7,3 7,8 15,8"></polyline>
                    </svg>
                    Save Changes
                  </button>
            </div>

            {saved && (
                  <div className="profile-save-toast">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Profile updated successfully!
            </div>
            )}
          </form>
            ) : (
              <div className="profile-view">
                {activeTab === 'personal' && (
                  <div className="profile-section">
                    <h3 className="profile-section-title">Personal Information</h3>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <label>Full Name</label>
                        <p>{name || "Not provided"}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Email</label>
                        <p>{email || "Not provided"}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Bio</label>
                        <p>{bio || "No bio available"}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Date of Birth</label>
                        <p>{dob ? new Date(dob).toLocaleDateString() : "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="profile-section">
                    <h3 className="profile-section-title">Contact Information</h3>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <label>Phone</label>
                        <p>{phone || "Not provided"}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Address</label>
                        <p>{address || "Not provided"}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Location</label>
                        <p>{city && country ? `${city}, ${country}` : "Not provided"}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Emergency Contact</label>
                        <p>{emgName && emgPhone ? `${emgName} - ${emgPhone}` : "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'professional' && (
                  <div className="profile-section">
                    <h3 className="profile-section-title">Professional Information</h3>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <label>Occupation</label>
                        <p>{occupation || "Not provided"}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Website</label>
                        <p>{website ? <a href={website} target="_blank" rel="noopener noreferrer">{website}</a> : "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;


