import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const [tickets, setTickets] = useState([]);
  const [center, setCenter] = useState([40.7128, -74.0060]); // Default to NYC, will update if tickets exist
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Request user's real location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`);
        const data = await response.json();
        const validTickets = data.filter(t => t.latitude && t.longitude);
        setTickets(validTickets);
        
        if (validTickets.length > 0) {
          setCenter(prevCenter => {
            if (prevCenter[0] === 40.7128) {
              return [validTickets[0].latitude, validTickets[0].longitude];
            }
            return prevCenter;
          });
        }
      } catch (err) {
        console.error("Error fetching map data:", err);
      }
    };
    fetchTickets();
  }, []);

  // Custom marker icons based on severity
  const getMarkerIcon = (severity) => {
    let color = 'green';
    if (severity === 'Urgent') color = 'red';
    else if (severity === 'Medium') color = 'orange';
    else if (severity === 'User') color = '#3b82f6'; // Blue for user
    
    const size = severity === 'User' ? 24 : 20;
    const border = severity === 'User' ? '3px solid #60a5fa' : '3px solid white';
    
    return L.divIcon({
      className: 'custom-icon',
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${border}; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`
    });
  };

  return (
    <div className="map-view" style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Road Health Map</h1>
        <p>Real-time visualization of reported issues and their severity.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', padding: '0.5rem' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
          <ChangeView center={center} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {userLocation && (
            <Marker position={userLocation} icon={getMarkerIcon('User')}>
              <Popup>Your Current Location</Popup>
            </Marker>
          )}

          {tickets.map(ticket => (
            <Marker 
              key={ticket.id} 
              position={[ticket.latitude, ticket.longitude]}
              icon={getMarkerIcon(ticket.severity)}
            >
              <Popup>
                <div style={{ color: '#333' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{ticket.title}</h3>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Type:</strong> {ticket.issueType}</p>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Severity:</strong> {ticket.severity}</p>
                  <p style={{ margin: 0 }}><strong>Status:</strong> {ticket.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
