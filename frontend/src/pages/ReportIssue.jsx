import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, AlertTriangle, Loader2 } from 'lucide-react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueType: 'Pothole',
    area: 'Downtown',
    latitude: '',
    longitude: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get location. Please allow location access.");
          setLocationLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image of the issue.");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      alert("Please capture GPS location.");
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('issueType', formData.issueType);
    submitData.append('area', formData.area);
    submitData.append('latitude', formData.latitude);
    submitData.append('longitude', formData.longitude);
    submitData.append('image', image);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
        method: 'POST',
        body: submitData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="report-success" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(16,185,129,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '2rem' }}>
          <AlertTriangle size={64} color="var(--status-safe)" />
        </div>
        <h1 style={{ marginBottom: '1rem' }}>Issue Reported Successfully!</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Thank you for making our roads safer. The AI has analyzed your image.
        </p>
        <div className="glass-panel" style={{ display: 'inline-block', padding: '2rem', textAlign: 'left', minWidth: '300px' }}>
          <p><strong>Ticket ID:</strong> #{result.id}</p>
          <p style={{ margin: '1rem 0' }}>
            <strong>AI Severity Detection:</strong> 
            <span className={`badge ${result.severity.toLowerCase()}`} style={{ marginLeft: '10px' }}>
              {result.severity}
            </span>
          </p>
          <p><strong>Confidence Score:</strong> {(result.confidenceScore * 100).toFixed(0)}%</p>
        </div>
        <div style={{ marginTop: '3rem' }}>
          <button className="btn btn-primary" onClick={() => {
            setResult(null);
            setImage(null);
            setPreview(null);
            setFormData({ title: '', description: '', issueType: 'Pothole', area: 'Downtown', latitude: '', longitude: '' });
          }}>Report Another Issue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-issue" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Report a Road Issue</h1>
        <p>Help us improve road conditions by reporting issues you encounter.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem' }}>
        <div className="input-group">
          <label>Photo/Video Evidence</label>
          <div 
            style={{ 
              border: '2px dashed rgba(255,255,255,0.2)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textAlign: 'center',
              cursor: 'pointer',
              background: preview ? 'transparent' : 'rgba(0,0,0,0.2)'
            }}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ maxHeight: '250px', borderRadius: '8px', objectFit: 'contain' }} />
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>
                <Camera size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Click to upload or drag and drop</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>High quality images help AI severity detection</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="input-group">
            <label>Issue Title</label>
            <input 
              type="text" 
              className="input-field" 
              name="title" 
              placeholder="e.g. Deep Pothole on Main St" 
              value={formData.title} 
              onChange={handleInputChange} 
              required
            />
          </div>
          <div className="input-group">
            <label>Issue Type</label>
            <select 
              className="input-field" 
              name="issueType" 
              value={formData.issueType} 
              onChange={handleInputChange}
            >
              <option>Pothole</option>
              <option>Crack</option>
              <option>Drainage/Waterlogging</option>
              <option>Fallen Tree</option>
              <option>Broken Streetlight</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Specific Area</label>
          <select 
            className="input-field" 
            name="area" 
            value={formData.area} 
            onChange={handleInputChange}
          >
            <option>Downtown</option>
            <option>Uptown</option>
            <option>Northside</option>
            <option>Southside</option>
            <option>Eastside</option>
            <option>Westside</option>
          </select>
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea 
            className="input-field" 
            name="description" 
            rows="3" 
            placeholder="Provide additional details..." 
            value={formData.description} 
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="input-group">
          <label>GPS Location</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Latitude, Longitude" 
              value={formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : ''} 
              readOnly 
              style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--text-secondary)' }}
            />
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={getLocation}
              disabled={locationLoading}
              style={{ minWidth: '150px' }}
            >
              {locationLoading ? <Loader2 className="animate-spin" /> : <><MapPin size={18} /> Auto Capture</>}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
            {loading ? <><Loader2 className="animate-spin" /> Analyzing Image & Submitting...</> : <><Upload size={20} /> Submit Report</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
