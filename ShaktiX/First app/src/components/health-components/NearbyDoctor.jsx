import React, { useState, useEffect, useRef } from 'react';

// Google Maps API Key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const NearbyDoctors = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [debugInfo, setDebugInfo] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5); // search radius in KM
  const [dataSource, setDataSource] = useState(''); // 'google' | 'osm'
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const specialties = [
    'all',
    'doctor',
    'hospital',
    'pharmacy',
    'dentist',
    'physiotherapist'
  ];

  // Fetch from both sources in parallel and use the first non-empty successful result
  const fetchNearbyFirstAvailable = async (lat, lng) => {
    const tasks = [];

    // Only add Google Maps task if API key is available
    if (GOOGLE_MAPS_API_KEY) {
      tasks.push((async () => {
        try {
          const g = await fetchNearbyDoctorsClient(lat, lng);
          return { source: 'google', data: g };
        } catch (e) {
          return { source: 'google', error: e };
        }
      })());
    }

    // Always include OpenStreetMap as fallback
    tasks.push((async () => {
      try {
        const o = await fetchNearbyDoctorsOverpass(lat, lng);
        return { source: 'osm', data: o };
      } catch (e) {
        return { source: 'osm', error: e };
      }
    })());

    const results = await Promise.all(tasks);
    // Prefer first non-empty
    const withData = results.find(r => Array.isArray(r.data) && r.data.length > 0);
    if (withData) return withData;
    // If both returned empty arrays, pick google if present else osm
    const anySuccess = results.find(r => Array.isArray(r.data));
    if (anySuccess) return anySuccess;
    // Otherwise return the one without error if available
    const any = results.find(r => !r.error);
    if (any) return any;
    // If both failed, throw google's error or generic
    throw (results.find(r => r.source === 'google')?.error || new Error('All sources failed'));
  };

  // Approximate IP-based geolocation fallback
  const getIpApproxLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('IP geolocation HTTP error');
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        return { lat: data.latitude, lng: data.longitude };
      }
      throw new Error('IP geolocation missing coords');
    } catch (e) {
      setDebugInfo({ phase: 'ipgeo:exception', message: String(e) });
      throw e;
    }
  };

  // Dynamically load Google Maps JS API with Places library
  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve();
          return;
        }
        if (!GOOGLE_MAPS_API_KEY) {
          reject(new Error('Missing Google Maps API key'));
          return;
        }
        // If a script is already loading
        const existing = document.querySelector('script[data-gmaps-loader="true"]');
        if (existing) {
          const onLoad = () => { cleanup(); resolve(); };
          const onError = () => { cleanup(); reject(new Error('Failed to load Google Maps script')); };
          const cleanup = () => {
            existing.removeEventListener('load', onLoad);
            existing.removeEventListener('error', onError);
          };
          existing.addEventListener('load', onLoad);
          existing.addEventListener('error', onError);
          // Timeout in case script tag is blocked
          setTimeout(() => {
            cleanup();
            if (!(window.google && window.google.maps && window.google.maps.places)) {
              reject(new Error('Google Maps script load timed out'));
            }
          }, 15000);
          return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.setAttribute('data-gmaps-loader', 'true');
        const onLoad = () => { clearTimeout(timer); resolve(); };
        const onError = () => { clearTimeout(timer); reject(new Error('Failed to load Google Maps script')); };
        script.onload = onLoad;
        script.onerror = onError;
        document.head.appendChild(script);
        const timer = setTimeout(() => {
          script.onload = null;
          script.onerror = null;
          reject(new Error('Google Maps script load timed out'));
        }, 15000);
      } catch (e) {
        reject(e);
      }
    });
  };

  const fetchNearbyDoctorsClient = async (lat, lng) => {
    await loadGoogleMaps();
    return new Promise((resolve, reject) => {
      try {
        const { google } = window;
        const locationObj = new google.maps.LatLng(lat, lng);
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        let finished = false;
        const timeoutId = setTimeout(() => {
          if (!finished) {
            setDebugInfo({ phase: 'gmaps_js:nearby_timeout' });
            reject(new Error('Nearby search timed out'));
          }
        }, 15000);

        service.nearbySearch(
          {
            location: locationObj,
            radius: Math.max(500, Math.min(50000, Math.round(radiusKm * 1000))),
            // Prefer doctors, but also include hospitals via keyword to broaden results
            type: ['doctor'],
            keyword: 'doctor clinic hospital health'
          },
          (results, status) => {
            if (finished) return;
            finished = true;
            clearTimeout(timeoutId);
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              const doctorsData = results.map((place) => ({
                id: place.place_id,
                name: place.name,
                specialty: determineSpecialty(place.name || '', place.types || []),
                rating: place.rating || 0,
                distance: place.geometry?.location ? calculateDistance(
                  lat,
                  lng,
                  place.geometry.location.lat(),
                  place.geometry.location.lng()
                ) : 0,
                address: place.vicinity || place.formatted_address || 'Address unavailable',
                phone: 'Contact clinic',
                availability: 'Check availability',
                image: getDoctorEmoji(place.name || ''),
                types: place.types || []
              }));
              resolve(doctorsData);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              // Fallback to TextSearch for broader matching
              try {
                const textService = new google.maps.places.PlacesService(document.createElement('div'));
                textService.textSearch({
                  location: locationObj,
                  radius: Math.max(500, Math.min(50000, Math.round(radiusKm * 1000))),
                  query: `doctor OR hospital OR clinic near ${lat},${lng}`,
                }, (res2, status2) => {
                  if (status2 === google.maps.places.PlacesServiceStatus.OK && res2) {
                    const mapped = res2.map((place) => ({
                      id: place.place_id,
                      name: place.name,
                      specialty: determineSpecialty(place.name || '', place.types || []),
                      rating: place.rating || 0,
                      distance: place.geometry?.location ? calculateDistance(
                        lat,
                        lng,
                        place.geometry.location.lat(),
                        place.geometry.location.lng()
                      ) : 0,
                      address: place.vicinity || place.formatted_address || 'Address unavailable',
                      phone: 'Contact clinic',
                      availability: 'Check availability',
                      image: getDoctorEmoji(place.name || ''),
                      types: place.types || []
                    }));
                    resolve(mapped);
                  } else {
                    setDebugInfo({ phase: 'gmaps_js:textsearch_status_not_ok', status2 });
                    resolve([]);
                  }
                });
              } catch (e) {
                setDebugInfo({ phase: 'gmaps_js:textsearch_exception', message: String(e) });
                resolve([]);
              }
            } else {
              setDebugInfo({ phase: 'gmaps_js:nearby_status_not_ok', status });
              reject(new Error(`PlacesService nearbySearch failed: ${status}`));
            }
          }
        );
      } catch (e) {
        setDebugInfo({ phase: 'gmaps_js:exception', message: String(e) });
        reject(e);
      }
    });
  };

  // Fallback: OpenStreetMap Overpass API
  const fetchNearbyDoctorsOverpass = async (lat, lng) => {
    const radius = Math.max(500, Math.min(50000, Math.round(radiusKm * 1000)));
    // Query doctors, hospitals, clinics
    const query = `
      [out:json][timeout:25];
      (
        node["healthcare"="doctor"](around:${radius},${lat},${lng});
        node["amenity"="doctors"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="clinic"](around:${radius},${lat},${lng});
      );
      out center 50;`;
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data: query }).toString(),
    });
    if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
    const data = await res.json();
    const elements = data.elements || [];
    const mapped = elements.map((el) => {
      const name = el.tags?.name || 'Healthcare Facility';
      const types = [];
      if (el.tags?.amenity) types.push(el.tags.amenity);
      if (el.tags?.healthcare) types.push(el.tags.healthcare);
      const center = el.type === 'node' ? { lat: el.lat, lon: el.lon } : (el.center || {});
      const d = center.lat && center.lon ? calculateDistance(lat, lng, center.lat, center.lon) : 0;

      // Build a better address from available OSM data
      let address = [el.tags?.addr_housenumber, el.tags?.addr_street, el.tags?.addr_city].filter(Boolean).join(', ');

      // If no structured address, try to build one from other available data
      if (!address) {
        const addressParts = [];
        if (el.tags?.addr_housename) addressParts.push(el.tags.addr_housename);
        if (el.tags?.addr_place) addressParts.push(el.tags.addr_place);
        if (el.tags?.addr_suburb) addressParts.push(el.tags.addr_suburb);
        if (el.tags?.addr_city) addressParts.push(el.tags.addr_city);
        if (el.tags?.addr_state) addressParts.push(el.tags.addr_state);
        if (el.tags?.addr_postcode) addressParts.push(el.tags.addr_postcode);
        if (el.tags?.addr_country) addressParts.push(el.tags.addr_country);

        address = addressParts.join(', ');

        // If still no address, provide coordinates as fallback
        if (!address && center.lat && center.lon) {
          address = `${center.lat.toFixed(4)}, ${center.lon.toFixed(4)}`;
        }
      }

      return {
        id: `${el.type}-${el.id}`,
        name,
        specialty: determineSpecialty(name, types),
        rating: 0,
        distance: d,
        address: address || 'Address unavailable',
        phone: el.tags?.phone || 'Contact clinic',
        availability: 'Check availability',
        image: '🏥',
        types,
      };
    });
    return mapped;
  };

  const determineSpecialty = (name, types) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('cardio') || nameLower.includes('heart')) return 'Cardiology';
    if (nameLower.includes('derma') || nameLower.includes('skin')) return 'Dermatology';
    if (nameLower.includes('ortho') || nameLower.includes('bone')) return 'Orthopedics';
    if (nameLower.includes('pedia') || nameLower.includes('child')) return 'Pediatrics';
    if (nameLower.includes('neuro') || nameLower.includes('brain')) return 'Neurology';
    if (nameLower.includes('dent') || types.includes('dentist')) return 'Dentistry';
    if (types.includes('hospital')) return 'Hospital';
    if (types.includes('pharmacy')) return 'Pharmacy';
    return 'General Practice';
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const getDoctorEmoji = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('dr.') || nameLower.includes('doctor')) return '👨‍⚕️';
    return '🏥';
  };

  // Function to format address in proper alphabetical format
  const formatAddress = (address) => {
    if (!address || address === 'Address unavailable') return address;

    // Handle coordinate format (latitude, longitude)
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(address.trim())) {
      return address; // Keep coordinates as-is
    }

    // Split address into parts and capitalize each word
    return address
      .split(',')
      .map(part => {
        // Capitalize each word in the part
        return part.trim().split(' ')
          .map(word => {
            // Don't capitalize small words unless they're at the start
            const smallWords = ['and', 'or', 'but', 'nor', 'yet', 'so', 'for', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'of', 'with', 'by'];
            if (smallWords.includes(word.toLowerCase())) {
              return word.toLowerCase();
            }
            // Capitalize first letter, rest lowercase
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(' ');
      })
      .join(', ');
  };


  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation({
          lat,
          lng
        });

        try {
          const result = await fetchNearbyFirstAvailable(lat, lng);
          setDataSource(result.source);
          setDoctors(result.data || []);
          if (!result.data || result.data.length === 0) {
            setError('No results found nearby. Try increasing radius or changing location.');
          }
        } finally {
          setLoading(false);
        }
      },
      () => {
        // Browser geolocation failed or denied — try IP-based approx location
        (async () => {
          try {
            const approx = await getIpApproxLocation();
            setLocation(approx);
            const result = await fetchNearbyFirstAvailable(approx.lat, approx.lng);
            setDataSource(result.source);
            setDoctors(result.data || []);
            if (!result.data || result.data.length === 0) {
              setError('No results found nearby. Try increasing radius or changing location.');
            }
          } catch {
            setError('Unable to retrieve your location. Please enable location services.');
          } finally {
            setLoading(false);
          }
        })();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const useManualLocation = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Please enter valid latitude (-90 to 90) and longitude (-180 to 180).');
      return;
    }

    setLoading(true);
    setError('');
    setLocation({ lat, lng });

    try {
      const result = await fetchNearbyFirstAvailable(lat, lng);
      setDataSource(result.source);
      setDoctors(result.data || []);
      if (!result.data || result.data.length === 0) {
        setError('No results found nearby. Try increasing radius or changing location.');
      }
      setShowManualLocation(false);
    } catch {
      setError('Failed to fetch doctors for manual location.');
    } finally {
      setLoading(false);
    }
  };

  // Manual location entry removed

  const filteredDoctors = selectedSpecialty === 'all'
    ? doctors
    : doctors.filter(doctor => {
        if (selectedSpecialty === 'doctor') return doctor.types.includes('doctor');
        if (selectedSpecialty === 'hospital') return doctor.types.includes('hospital');
        if (selectedSpecialty === 'pharmacy') return doctor.types.includes('pharmacy');
        if (selectedSpecialty === 'dentist') return doctor.types.includes('dentist');
        if (selectedSpecialty === 'physiotherapist') return doctor.types.includes('physiotherapist');
        return doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
      });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => a.distance - b.distance);

  // Auto-refresh when radius or location changes (debounced)
  const radiusDebounceRef = useRef(null);
  useEffect(() => {
    if (!location) return;
    if (radiusDebounceRef.current) clearTimeout(radiusDebounceRef.current);
    radiusDebounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const result = await fetchNearbyFirstAvailable(location.lat, location.lng);
        setDataSource(result.source);
        setDoctors(result.data || []);
        if (!result.data || result.data.length === 0) {
          setError('No results found nearby. Try increasing radius or changing location.');
        }
      } catch (e) {
        setError(e.message || 'Failed to refresh results');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (radiusDebounceRef.current) clearTimeout(radiusDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusKm, location?.lat, location?.lng]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    return stars.join('') + ` (${rating})`;
  };

  const callDoctor = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getDirections = (doctor) => {
    // Use coordinates for more accurate directions if available
    if (location && doctor.address !== 'Address unavailable') {
      // Use Google Maps directions with origin and destination coordinates
      const origin = `${location.lat},${location.lng}`;
      const destination = encodeURIComponent(formatAddress(doctor.address));
      window.open(`https://maps.google.com/maps/dir/${origin}/${destination}`, '_blank');
    } else if (location) {
      // Fallback: use coordinates for both origin and approximate destination
      const origin = `${location.lat},${location.lng}`;
      // Try to estimate destination coordinates from the doctor's data if available
      // For now, just search for the doctor name near the user's location
      const query = encodeURIComponent(`${doctor.name} near me`);
      window.open(`https://maps.google.com/maps?q=${query}&ll=${origin}`, '_blank');
    } else {
      // Final fallback: just search for the address or doctor name
      const query = doctor.address !== 'Address unavailable' ? formatAddress(doctor.address) : doctor.name;
      const encodedQuery = encodeURIComponent(query);
      window.open(`https://maps.google.com/maps?q=${encodedQuery}`, '_blank');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '15px', color: '#ffffff' }}>
          Find Nearby Doctors
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '25px' }}>
          Locate qualified healthcare professionals in your area
        </p>

        {!location && (
          <div style={{
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📍</div>
            <p style={{ color: '#00d4ff', marginBottom: '15px' }}>
              We need your location to find nearby doctors
            </p>
            {!GOOGLE_MAPS_API_KEY && (
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '15px'
              }}>
                <p style={{ color: '#f59e0b', margin: 0, fontSize: '14px' }}>
                  ⚠️ Google Maps API key not configured. Using OpenStreetMap fallback. For better results, add your API key to .env file (see GOOGLE_MAPS_SETUP.md).
                </p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="gradient-button"
                style={{
                  fontSize: '16px',
                  padding: '12px 24px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Getting Location...' : 'Enable Location'}
              </button>
              <button
                onClick={() => setShowManualLocation(!showManualLocation)}
                style={{
                  fontSize: '16px',
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  color: '#00d4ff',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                {showManualLocation ? 'Hide Manual' : 'Enter Location'}
              </button>
            </div>
            {showManualLocation && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <p style={{ color: '#94a3b8', marginBottom: '10px', textAlign: 'center' }}>
                  Enter your coordinates manually
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '14px' }}>Latitude:</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      placeholder="e.g. 28.6139"
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        width: '120px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '14px' }}>Longitude:</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      placeholder="e.g. 77.2090"
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        width: '120px'
                      }}
                    />
                  </div>
                  <button
                    onClick={useManualLocation}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      background: '#10b981',
                      border: 'none',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    Use Location
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#ef4444', margin: 0 }}>
              ⚠️ {error}
            </p>
            {debugInfo && (
              <pre style={{
                marginTop: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '10px',
                color: '#94a3b8',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '12px'
              }}>
{JSON.stringify(debugInfo, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {location && doctors.length > 0 && (
        <>
          {/* Location Info */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <span style={{ color: '#10b981' }}>
              📍 Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
            <button
              onClick={() => { setLocation(null); getCurrentLocation(); }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Re-detect location
            </button>
          </div>

          {/* Specialty Filter */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '10px' }}>
              Filter by Specialty:
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '16px',
                minWidth: '200px'
              }}
            >
              {specialties.map(specialty => (
                <option
                  key={specialty}
                  value={specialty}
                  style={{ background: '#1e293b', color: '#ffffff' }}
                >
                  {specialty === 'all' ? 'All Specialties' :
                   specialty === 'doctor' ? 'Doctors' :
                   specialty === 'hospital' ? 'Hospitals' :
                   specialty === 'pharmacy' ? 'Pharmacies' :
                   specialty === 'dentist' ? 'Dentists' :
                   specialty === 'physiotherapist' ? 'Physiotherapists' :
                   specialty}
                </option>
              ))}
            </select>
            <div style={{ marginTop: '12px' }}>
              <label style={{ color: '#94a3b8', marginRight: '8px' }}>Search radius:</label>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              >
                {[2,5,10,20,30,50].map(km => (
                  <option key={km} value={km} style={{ background: '#1e293b', color: '#ffffff' }}>{km} km</option>
                ))}
              </select>
              <button
                onClick={async () => {
                  if (!location) return;
                  try {
                    setLoading(true);
                    const data = await fetchNearbyDoctorsClient(location.lat, location.lng);
                    setDoctors(data);
                  } catch (e) {
                    setError(e.message || 'Failed to refresh results');
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{ marginLeft: '10px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Doctors List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#ffffff', margin: 0 }}>
                {sortedDoctors.length} Doctor{sortedDoctors.length !== 1 ? 's' : ''} Found
                {selectedSpecialty !== 'all' && ` (${selectedSpecialty})`}
              </h3>
              {dataSource && (
                <span style={{
                  background: dataSource === 'google' ? 'linear-gradient(135deg, #34d399, #10b981)' : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  color: '#fff',
                  padding: '6px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Source: {dataSource === 'google' ? 'Google' : 'OpenStreetMap'}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {sortedDoctors.map(doctor => (
                <div
                  key={doctor.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '25px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    {/* Doctor Avatar */}
                    <div style={{
                      fontSize: '4rem',
                      background: 'rgba(0, 212, 255, 0.1)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {doctor.image}
                    </div>

                    {/* Doctor Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <h4 style={{ color: '#ffffff', fontSize: '1.4rem', marginBottom: '5px' }}>
                            {doctor.name}
                          </h4>
                          <p style={{ color: '#00d4ff', fontSize: '1rem', margin: 0 }}>
                            {doctor.specialty}
                          </p>
                        </div>
                        <div style={{
                          background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                          color: 'white',
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {doctor.distance} mi
                        </div>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ color: '#fbbf24', marginBottom: '5px' }}>
                          {renderStars(doctor.rating)}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>
                          📍 {formatAddress(doctor.address)}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>
                          📞 {doctor.phone}
                        </div>
                        <div style={{ color: '#10b981', fontSize: '0.9rem' }}>
                          🕒 {doctor.availability}
                        </div>
                        {location && (
                          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            🔍 Search location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => callDoctor(doctor.phone)}
                          style={{
                            background: '#10b981',
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          📞 Call Now
                        </button>
                        <button
                          onClick={() => getDirections(doctor)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          🗺️ Directions
                        </button>
                        <button
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(0, 212, 255, 0.3)',
                            color: '#00d4ff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          📅 Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty state when we have a location but no doctors and not loading */}
      {location && !loading && doctors.length === 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '24px',
          textAlign: 'center',
          marginTop: '10px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🩺</div>
          <h4 style={{ color: '#ffffff', marginBottom: '6px' }}>No doctors found within {radiusKm} km</h4>
          <p style={{ color: '#94a3b8', marginBottom: '12px' }}>Try increasing the search radius or change location.</p>
          <div style={{ display: 'inline-flex', gap: '8px' }}>
            <button onClick={() => setRadiusKm(Math.min(50, radiusKm * 2))} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '8px' }}>Increase radius</button>
            <button onClick={() => { setLocation(null); setShowManualLocation(true); }} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '8px' }}>Change location</button>
          </div>
        </div>
      )}

      {loading && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Finding Nearby Doctors</h3>
          <p style={{ color: '#94a3b8' }}>
            Please wait while we locate healthcare professionals in your area...
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyDoctors;