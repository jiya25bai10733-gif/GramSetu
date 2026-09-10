import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  Filter, 
  Crosshair, 
  ArrowRight, 
  X, 
  Compass, 
  Building2, 
  ShieldCheck, 
  AlertTriangle,
  Radio,
  Clock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const createPin = (color: string, label: string) => {
  return L.divIcon({
    className: 'gis-pin',
    html: `
      <div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 8px; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2px solid white; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
        <span>${label}</span>
      </div>
    `,
    iconSize: [110, 26],
    iconAnchor: [55, 26]
  });
};

const officerGpsPin = L.divIcon({
  className: 'officer-pin',
  html: `
    <div style="background-color: #0F2A4A; color: #38BDF8; padding: 4px 8px; border-radius: 9999px; font-weight: 800; font-size: 10px; box-shadow: 0 4px 12px rgba(15, 42, 74, 0.5); border: 2px solid white; display: flex; align-items: center; gap: 5px; white-space: nowrap;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #38BDF8; display: inline-block; animation: pulse 1s infinite;"></span>
      <span>PATROL VAN #04 (YOU)</span>
    </div>
  `,
  iconSize: [140, 26],
  iconAnchor: [70, 26]
});

// Dynamic Re-centering component
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Map click listener for coordinate telemetry
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    }
  });
  return null;
};

export const OfficialMap: React.FC = () => {
  const { issues, setSelectedIssueId, setOfficialTab } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'IN PROGRESS' | 'RESOLVED'>('ALL');
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');

  // Real-life Coordinates & Patrol Telemetry
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.2045, 77.0870]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [officerLocation, setOfficerLocation] = useState<[number, number]>([23.2032, 77.0844]);
  const [officerAccuracy, setOfficerAccuracy] = useState<number>(10);
  const [isLocatingOfficer, setIsLocatingOfficer] = useState<boolean>(false);
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    locateFieldOfficer();
  }, []);

  const locateFieldOfficer = () => {
    if ('geolocation' in navigator) {
      setIsLocatingOfficer(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          const acc = Math.round(pos.coords.accuracy);
          setOfficerLocation([lat, lng]);
          setOfficerAccuracy(acc);
          setIsLocatingOfficer(false);
          setMapCenter([lat, lng]);
          setMapZoom(15);
        },
        (err) => {
          console.warn('Patrol GPS acquisition error, defaulting to Sehore HQ:', err);
          setIsLocatingOfficer(false);
          setOfficerLocation([23.2032, 77.0844]);
          setOfficerAccuracy(15);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const filtered = issues.filter(iss => {
    const matchesCat = categoryFilter === 'ALL' || iss.category.includes(categoryFilter);
    const matchesStatus = statusFilter === 'ALL' || iss.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Map Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              GIS Jurisdictional Telemetry Map
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial overlay of civic grievances & field patrol telemetry across Sehore Administrative Sub-division
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Street vs Satellite Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setMapLayer('street')}
              className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-all ${
                mapLayer === 'street' ? 'bg-[#0F2A4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗺️ Street
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('satellite')}
              className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-all ${
                mapLayer === 'satellite' ? 'bg-[#0F2A4A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛰️ Satellite
            </button>
          </div>

          {/* Real GPS Patrol Locate */}
          <button
            type="button"
            onClick={locateFieldOfficer}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-all"
            title="Locate Field Patrol Van via Real Device GPS"
          >
            <Crosshair className={`w-3.5 h-3.5 text-blue-600 ${isLocatingOfficer ? 'animate-spin' : ''}`} />
            <span>{isLocatingOfficer ? 'Fixing GPS...' : 'Locate Patrol (GPS)'}</span>
          </button>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Categories ({issues.length})</option>
            <option value="Water">Water Supply</option>
            <option value="Road">Roads & PWD</option>
            <option value="Electricity">Electricity Board</option>
            <option value="Sanitation">Sanitation</option>
          </select>
        </div>
      </div>

      {/* Jurisdiction Quick Jump Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
          SECTOR QUICK JUMP:
        </span>
        <button
          type="button"
          onClick={() => {
            setMapCenter([officerLocation[0], officerLocation[1]]);
            setMapZoom(16);
          }}
          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 shrink-0 cursor-pointer"
        >
          📍 Patrol Van GPS ({officerLocation[0].toFixed(4)}, {officerLocation[1].toFixed(4)})
        </button>
        <button
          type="button"
          onClick={() => {
            setMapCenter([23.2032, 77.0844]);
            setMapZoom(15);
          }}
          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
        >
          Sehore Block HQ
        </button>
        <button
          type="button"
          onClick={() => {
            setMapCenter([23.2045, 77.0812]);
            setMapZoom(16);
          }}
          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
        >
          Rampur Gram Panchayat (Ward 3)
        </button>
        <button
          type="button"
          onClick={() => {
            setMapCenter([23.2018, 77.0895]);
            setMapZoom(16);
          }}
          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
        >
          Sector 15 Main Arterial Road
        </button>
        <button
          type="button"
          onClick={() => {
            setMapCenter([23.2125, 77.0988]);
            setMapZoom(16);
          }}
          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
        >
          Shyampur Grid Sub-Station
        </button>
      </div>

      {/* Full Map Canvas */}
      <div className="h-[560px] rounded-2xl overflow-hidden border border-slate-300 shadow-sm relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <MapClickHandler onMapClick={(lat, lng) => setClickedCoord({ lat, lng })} />

          {/* Tile Layers */}
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

          {/* Jurisdiction Perimeter Circle (Sehore District Sub-division) */}
          <Circle
            center={[23.2045, 77.0870]}
            radius={2800}
            pathOptions={{
              color: '#0F2A4A',
              weight: 1.5,
              dashArray: '6, 6',
              fillColor: '#0F2A4A',
              fillOpacity: 0.03
            }}
          />

          {/* Officer Patrol Marker */}
          <Marker position={officerLocation} icon={officerGpsPin}>
            <Popup>
              <div className="text-xs p-1">
                <span className="font-extrabold text-[#0F2A4A] block">FIELD PATROL VAN #04</span>
                <span className="font-mono text-slate-500 text-[10px]">
                  Real GPS: {officerLocation[0].toFixed(5)}° N, {officerLocation[1].toFixed(5)}° E
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                  Status: Active On-Duty • Speed: 0 km/h
                </span>
              </div>
            </Popup>
          </Marker>

          <Circle
            center={officerLocation}
            radius={officerAccuracy * 2}
            pathOptions={{
              color: '#38BDF8',
              fillColor: '#38BDF8',
              fillOpacity: 0.2,
              weight: 1
            }}
          />

          {/* Issues Markers */}
          {filtered.map(iss => {
            const color = iss.status === 'RESOLVED' ? '#10B981' : iss.priority === 'URGENT' ? '#EF4444' : '#0F2A4A';
            return (
              <Marker
                key={iss.id}
                position={iss.coordinates}
                icon={createPin(color, `${iss.token} ${iss.title.substring(0, 14)}...`)}
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

        {/* Clicked Telemetry Coordinate Floating Banner */}
        {clickedCoord && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-300 shadow-xl z-[1000] text-xs max-w-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-[#0F2A4A] flex items-center space-x-1">
                <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                <span>INSPECTED GIS GRID</span>
              </span>
              <button
                type="button"
                onClick={() => setClickedCoord(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-2 space-y-1 font-mono text-[11px]">
              <div>LAT: <span className="text-slate-800 font-bold">{clickedCoord.lat}° N</span></div>
              <div>LNG: <span className="text-slate-800 font-bold">{clickedCoord.lng}° E</span></div>
              <div className="text-[10px] text-slate-500 font-sans mt-1">
                Sub-Division: Sehore Tehsil Central Sector
              </div>
            </div>
          </div>
        )}

        {/* Selected Marker Floating Dossier */}
        {selectedIssue && (
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-300 shadow-2xl z-[1000] animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-[#0F2A4A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedIssue.token}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedIssue.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedIssue.status}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                  {selectedIssue.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedIssue.locationName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 line-clamp-2">{selectedIssue.summary}</p>

            <div className="mt-3 pt-2 bg-slate-50 rounded-lg p-2 text-[11px] grid grid-cols-2 gap-2 border border-slate-200/70">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">COORDINATES</span>
                <span className="font-mono text-slate-700">
                  {selectedIssue.coordinates[0].toFixed(4)}, {selectedIssue.coordinates[1].toFixed(4)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">SLA REMAINING</span>
                <span className="font-bold text-amber-600 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedIssue.slaRemainingHours} hrs</span>
                </span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                {selectedIssue.upvotes} Citizens Impacted
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedIssueId(selectedIssue.id);
                  setOfficialTab('issues');
                }}
                className="px-3 py-1.5 bg-[#0F2A4A] hover:bg-[#183d6a] text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
              >
                <span>Open Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
