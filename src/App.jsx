import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const BACKEND_URL = "https://flood-backend-xk0l.onrender.com";

// Fix for default marker icon not showing (using CDN instead of local imports)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
}

async function registerForNotifications(lat, lng) {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const token = await getToken(messaging, { vapidKey: "BKdWjY06m77EdHzb5Sq8ZZhZLkJAjMgCamdgLTHXq7dOlEt4B3gdC9VBXzQjzv-_yNn_hsidv5hWKTDo4gojXFQ" });

  await fetch(`${BACKEND_URL}/register-device`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, lat, lng }),
  });
}

function App() {
  const [position, setPosition] = useState([22.5726, 88.3639]); // default: Kolkata
  const [riskZones, setRiskZones] = useState([]);

  // Get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          console.log("Accuracy in meters:", pos.coords.accuracy);
          registerForNotifications(latitude, longitude);
        },
        (error) => {
          console.log("Location access denied or unavailable:", error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
    }
  }, []);

  // Listen for foreground notifications
  useEffect(() => {
    onMessage(messaging, (payload) => {
      alert(`${payload.notification.title}: ${payload.notification.body}`);
    });
  }, []);

  // Fetch risk zones from backend whenever position changes
  useEffect(() => {
    const [lat, lng] = position;
    fetch(`${BACKEND_URL}/risk-zones?lat=${lat}&lng=${lng}`)
      .then(res => res.json())
      .then(data => setRiskZones(data.zones))
      .catch(err => console.error('Failed to fetch risk zones:', err));
  }, [position]);

  return (
    <div>
      <h1>Flood Nowcasting System</h1>
      <MapContainer center={position} zoom={13} style={{ height: '400px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RecenterMap position={position} />
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
        {riskZones.map((zone) => (
          <Circle
            key={zone.zone_id}
            center={[zone.lat, zone.lng]}
            radius={300}
            pathOptions={{
              color: zone.risk_level === 'high' ? 'red' : 'orange',
              fillColor: zone.risk_level === 'high' ? 'red' : 'orange',
              fillOpacity: 0.4
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
