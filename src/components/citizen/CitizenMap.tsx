import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  X,
  Plus,
  Crosshair,
  Compass,
  Radio,
  Share2,
  RefreshCw
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { getFriendlyLocationName, reverseGeocodeAsync } from '../../utils/locationResolver';

// Leaflet default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pin icons
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 12px; font-weight: bold; font-size: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.35); border: 2px solid white; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
        <span>${label}</span>
      </div>
    `,
    iconSize: [80, 24],
    iconAnchor: [40, 24]
  });
};

const userGpsIcon = L.divIcon({
  className: 'user-gps-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563EB; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); z-index: 10;"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const inspectionPinIcon = L.divIcon({
  className: 'inspect-pin',
  html: `
    <div style="background: #0F2A4A; color: #38BDF8; padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px;">
      <span>📍 New Pin</span>
    </div>
  `,
  iconSize: [80, 24],
  iconAnchor: [40, 24]
});

// Map Controller for Smooth Re-centering
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Map Click Listener
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    }
  });
  return null;
};

// Haversine distance calculator in meters
const computeDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = Math.round(R * c);
  if (meters < 1000) return `${meters}m away`;
  return `${(meters / 1000).toFixed(1)}km away`;
};

export const CitizenMap: React.FC = () => {
  const { issues, setSelectedIssueId, setCitizenTab } = useApp();
  const [filter, setFilter] = useState<'all' | 'water' | 'roads' | 'power' | 'resolved'>('all');
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  
  // Real-life Location & Map Viewport State
  const [userLocation, setUserLocation] = useState<[number, number]>([23.2045, 77.0812]);
  const [userLocationName, setUserLocationName] = useState<string>('Ward 3 • Rampur Gram Panchayat');
  const [userAccuracy, setUserAccuracy] = useState<number>(12);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [hasAcquiredGps, setHasAcquiredGps] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.2045, 77.0850]);
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const [inspectedSpot, setInspectedSpot] = useState<{ lat: number; lng: number } | null>(null);

  // Auto-acquire real GPS on mount
  useEffect(() => {
    locateUserGps();
  }, []);

  const locateUserGps = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          const acc = Math.round(pos.coords.accuracy);
          setUserLocation([lat, lng]);
          setUserAccuracy(acc);
          setHasAcquiredGps(true);
          setIsLocating(false);
          setMapCenter([lat, lng]);
          setMapZoom(16);
          const initialName = getFriendlyLocationName([lat, lng]);
          setUserLocationName(initialName);
          reverseGeocodeAsync(lat, lng).then(addr => {
            if (addr) setUserLocationName(addr);
          });
        },
        (err) => {
          console.warn('Real GPS acquisition notice (using district anchor):', err);
          setIsLocating(false);
          setUserLocation([23.2045, 77.0812]);
          setUserLocationName('Ward 3 • Rampur Gram Panchayat');
          setUserAccuracy(15);
          setHasAcquiredGps(true);
          setMapCenter([23.2045, 77.0812]);
          setMapZoom(15);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const filteredIssues = issues.filter(iss => {
    if (filter === 'water') return iss.category.includes('Water');
    if (filter === 'roads') return iss.category.includes('Road');
    if (filter === 'power') return iss.category.includes('Electricity');
    if (filter === 'resolved') return iss.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="max-w-md mx-auto space-y-3 pb-24 relative">
      {/* Map Control Header */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-base font-extrabold text-slate-900">Ward Community Map</h1>
            </div>
            <p className="text-[11px] text-slate-500">Live civic locations across Rampur & Sehore</p>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={locateUserGps}
              className={`p-2 rounded-lg border text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all ${
                isLocating 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
              title="Locate my real-life GPS position"
            >
              <Crosshair className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Locate Me'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCitizenTab('report')}
              className="py-1.5 px-3 bg-[#0F2A4A] hover:bg-[#183d6a] text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Here</span>
            </button>
          </div>
        </div>

        {/* Real-time GPS Telemetry Banner */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-slate-800 font-bold text-[11px] truncate">
              {userLocationName}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-emerald-700 font-medium hidden sm:inline whitespace-nowrap">±{userAccuracy}m GPS accuracy</span>
          </div>
          
          {/* Map Layer Switcher (Street vs Satellite) */}
          <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setMapLayer('street')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                mapLayer === 'street' ? 'bg-[#0F2A4A] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('satellite')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                mapLayer === 'satellite' ? 'bg-[#0F2A4A] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Quick Area Jump Presets */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 self-center shrink-0">JUMP TO:</span>
          <button
            type="button"
            onClick={() => {
              setMapCenter([userLocation[0], userLocation[1]]);
              setMapZoom(16);
            }}
            className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold shrink-0 cursor-pointer hover:bg-blue-100"
          >
            📍 My Real GPS
          </button>
          <button
            type="button"
            onClick={() => {
              setMapCenter([23.2045, 77.0812]);
              setMapZoom(16);
            }}
            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium shrink-0 cursor-pointer hover:bg-slate-200"
          >
            Rampur Ward 3
          </button>
          <button
            type="button"
            onClick={() => {
              setMapCenter([23.2018, 77.0895]);
              setMapZoom(16);
            }}
            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium shrink-0 cursor-pointer hover:bg-slate-200"
          >
            Sector 15 Main Road
          </button>
          <button
            type="button"
            onClick={() => {
              setMapCenter([23.2125, 77.0988]);
              setMapZoom(16);
            }}
            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium shrink-0 cursor-pointer hover:bg-slate-200"
          >
            Shyampur Feeder
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
              filter === 'all' ? 'bg-[#0F2A4A] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setFilter('water')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
              filter === 'water' ? 'bg-[#0F2A4A] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Water Supply
          </button>
          <button
            onClick={() => setFilter('roads')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
              filter === 'roads' ? 'bg-[#0F2A4A] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Roads
          </button>
          <button
            onClick={() => setFilter('power')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
              filter === 'power' ? 'bg-[#0F2A4A] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Power
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
              filter === 'resolved' ? 'bg-[#0F2A4A] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="h-[430px] rounded-2xl overflow-hidden border border-slate-300 shadow-sm relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* Smooth Re-center Handler */}
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Click to drop custom inspection pin */}
          <MapClickHandler onMapClick={(lat, lng) => {
            setInspectedSpot({ lat, lng });
          }} />

          {/* Layer Switching: Street OpenStreetMap vs Satellite ESRI */}
          {mapLayer === 'street' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {/* User Real GPS Location Marker & Accuracy Radius Circle */}
          <Marker position={userLocation} icon={userGpsIcon}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-blue-700 block">📍 Verified Ground Location</span>
                <span className="text-slate-700 text-[11px] font-semibold block mt-0.5">
                  {userLocationName}
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                  GPS Accuracy: ±{userAccuracy} meters
                </span>
              </div>
            </Popup>
          </Marker>

          <Circle
            center={userLocation}
            radius={userAccuracy}
            pathOptions={{
              fillColor: '#3B82F6',
              fillOpacity: 0.15,
              color: '#2563EB',
              weight: 1.5
            }}
          />

          {/* Clicked Inspection Spot Pin */}
          {inspectedSpot && (
            <Marker position={[inspectedSpot.lat, inspectedSpot.lng]} icon={inspectionPinIcon}>
              <Popup>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Selected Ground Location:</span>
                  <span className="text-slate-700 text-xs font-semibold block">
                    {getFriendlyLocationName([inspectedSpot.lat, inspectedSpot.lng])}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Distance: {computeDistance(userLocation[0], userLocation[1], inspectedSpot.lat, inspectedSpot.lng)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCitizenTab('report')}
                    className="w-full mt-1.5 py-1 px-2 bg-[#0F2A4A] text-white text-[10px] font-bold rounded cursor-pointer"
                  >
                    Report Issue At This Location
                  </button>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Issue Pins with Category Colors */}
          {filteredIssues.map(iss => {
            const color = iss.status === 'RESOLVED' ? '#10B981' : iss.priority === 'URGENT' ? '#EF4444' : '#F59E0B';
            return (
              <Marker
                key={iss.id}
                position={iss.coordinates}
                icon={createCustomIcon(color, `${iss.token} ${iss.title.substring(0, 11)}...`)}
                eventHandlers={{
                  click: () => {
                    setSelectedIssue(iss);
                    setMapCenter(iss.coordinates);
                    setMapZoom(16);
                  }
                }}
              />
            );
          })}
        </MapContainer>

        {/* Floating Instruction Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/80 text-[10px] font-bold text-slate-700 shadow-xs z-[999] pointer-events-none">
          Click any point to inspect location or report
        </div>
      </div>

      {/* Selected Issue Preview Card if clicked */}
      {selectedIssue && (
        <div className="bg-white rounded-2xl p-4 border-2 border-[#0F2A4A] shadow-lg animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {selectedIssue.category}
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">{selectedIssue.token}</span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {computeDistance(userLocation[0], userLocation[1], selectedIssue.coordinates[0], selectedIssue.coordinates[1])}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                {selectedIssue.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                {selectedIssue.summary}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedIssue(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              <span className="font-bold text-slate-900 block flex items-center">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
                {selectedIssue.locationName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {selectedIssue.panchayat || 'Rampur Panchayat'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedIssueId(selectedIssue.id);
                setCitizenTab('activity');
              }}
              className="py-1.5 px-3 bg-[#0F2A4A] hover:bg-[#183d6a] text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Track Issue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
