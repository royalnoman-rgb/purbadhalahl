import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { MapPin, Navigation } from 'lucide-react';

export default function MapTracker() {
  const [locations, setLocations] = useState<any[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [driverName, setDriverName] = useState('');
  const [vehicleType, setVehicleType] = useState('CNG');

  useEffect(() => {
    const q = query(collection(db, 'locations'));
    const unsub = onSnapshot(q, (snapshot) => {
      // Filter out stale locations (older than 2 hours maybe? For now just show all recent)
      const locs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Basic filtering: Only show locations updated in the last 6 hours
      const now = Date.now();
      const activeLocs = locs.filter((l: any) => {
        if (!l.updatedAt) return false;
        // Firebase timestamp or ms
        const time = l.updatedAt?.toMillis ? l.updatedAt.toMillis() : l.updatedAt;
        return (now - time) < 6 * 60 * 60 * 1000;
      });
      setLocations(activeLocs);
    });
    return () => unsub();
  }, []);

  const handleCheckIn = () => {
    if (!navigator.geolocation) {
      alert("আপনার ব্রাউজারে লোকেশন সাপোর্ট করে না।");
      return;
    }

    if (!driverName) {
      alert("অনুগ্রহ করে আপনার নাম দিন");
      return;
    }

    setIsTracking(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const newDoc = await addDoc(collection(db, 'locations'), {
          name: driverName,
          type: vehicleType,
          lat: latitude,
          lng: longitude,
          updatedAt: serverTimestamp()
        });
        setTrackingId(newDoc.id);

        // Watch position
        const watchId = navigator.geolocation.watchPosition(async (pos) => {
          await updateDoc(doc(db, 'locations', newDoc.id), {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            updatedAt: serverTimestamp()
          });
        });

        // Save watchId to clean up later if needed
        (window as any).driverWatchId = watchId;

      } catch (err) {
        console.error(err);
        alert("লোকেশন আপডেট করতে সমস্যা হয়েছে।");
        setIsTracking(false);
      }
    }, (err) => {
      console.error(err);
      alert("লোকেশন পারমিশন দিন।");
      setIsTracking(false);
    });
  };

  const handleStopTracking = async () => {
    if ((window as any).driverWatchId) {
      navigator.geolocation.clearWatch((window as any).driverWatchId);
    }
    setIsTracking(false);
    setTrackingId(null);
  };

  // Default center: Purbadhala approximately
  const defaultCenter: [number, number] = [24.9333, 90.6000];

  const createCustomIcon = (type: string, name: string) => {
    let bgColor = "#10b981"; // emerald for CNG
    if (type === 'Car') bgColor = "#3b82f6"; // blue
    else if (type === 'Hiace') bgColor = "#8b5cf6"; // purple
    else if (type === 'Bike') bgColor = "#f59e0b"; // amber

    const html = `
      <div style="
        background-color: ${bgColor};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
      <div style="
        position: absolute;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        white-space: nowrap;
        color: #333;
      ">
        ${name} (${type})
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden z-0">
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-end justify-between bg-emerald-50">
        <div>
          <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-600" />
            লাইভ গাড়ির অবস্থান
          </h2>
          <p className="text-sm text-emerald-700">সিএনজি, প্রাইভেট কার, বা হাইয়েস এর লাইভ অবস্থান দেখুন</p>
        </div>
        
        <div className="flex gap-2 flex-wrap items-end">
          {!isTracking ? (
            <>
              <div className="flex flex-col">
                <input 
                  type="text" 
                  placeholder="আপনার নাম" 
                  className="text-sm px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-32 sm:w-40"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <select 
                  className="text-sm px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                >
                  <option value="CNG">সিএনজি</option>
                  <option value="Car">প্রাইভেট কার</option>
                  <option value="Hiace">হাইয়েস</option>
                  <option value="Bike">ভাড়ায় চালিত হোন্ডা</option>
                </select>
              </div>
              <button 
                onClick={handleCheckIn}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                চেক-ইন করুন
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 bg-emerald-100 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-800">আপনার অবস্থান শেয়ার হচ্ছে</span>
              <button 
                onClick={handleStopTracking}
                className="text-red-600 font-medium text-sm ml-2 hover:underline"
              >
                বন্ধ করুন
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: '400px', zIndex: 0 }} className="relative">
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map(loc => (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]} 
              icon={createCustomIcon(loc.type, loc.name)}
            >
              <Popup>
                <b>{loc.name}</b><br />
                ধরণ: {loc.type}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
