import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight, 
  Radio, 
  RefreshCw, 
  ShieldAlert, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Users,
  Crosshair,
  Compass
} from 'lucide-react';
import { PANCHAYAT_METRICS } from '../../data/mockData';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

const createDotIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-dot',
    html: `
      <div style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 6px; font-weight: bold; font-size: 9px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 1.5px solid white; white-space: nowrap;">
        ${label}
      </div>
    `,
    iconSize: [80, 20],
    iconAnchor: [40, 20]
  });
};

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
};

const WARD_COORDINATES: Record<string, [number, number]> = {
  'Sehore Block (HQ)': [23.2032, 77.0844],
  'Rampur Gram Panchayat': [23.2045, 77.0812],
  'Bilkisganj Sub-Division': [23.1900, 77.0680],
  'Shyampur Tehsil': [23.2125, 77.0988],
};

export const OfficialDashboard: React.FC = () => {
  const { 
    issues, 
    setSelectedIssueId, 
    setOfficialTab, 
    clusters, 
    setSelectedClusterId 
  } = useApp();

  const [activeWard, setActiveWard] = useState<string>('Sehore Block (HQ)');
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.2032, 77.0844]);
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleWardChange = (ward: string) => {
    setActiveWard(ward);
    if (WARD_COORDINATES[ward]) {
      setMapCenter(WARD_COORDINATES[ward]);
      setMapZoom(15);
    }
  };

  const locateRealGps = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          setUserLocation([lat, lng]);
          setMapCenter([lat, lng]);
          setMapZoom(16);
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS location error:', err);
          setIsLocating(false);
          setMapCenter([23.2032, 77.0844]);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const urgentCount = issues.filter(i => i.priority === 'URGENT' || i.slaBreached).length;
  const inProgressCount = issues.filter(i => i.status === 'IN PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const pendingCount = issues.filter(i => i.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      {/* Top Bar with Ward Selector & Live Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F2A4A] tracking-tight">Official Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor and resolve community issues across your jurisdiction • Sehore Administrative Division
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs text-xs">
            <span className="text-slate-400 font-bold mr-2 text-[10px] uppercase tracking-wider">ACTIVE WARD:</span>
            <select 
              value={activeWard}
              onChange={(e) => handleWardChange(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Sehore Block (HQ)">Sehore Block (HQ)</option>
              <option value="Rampur Gram Panchayat">Rampur Gram Panchayat</option>
              <option value="Bilkisganj Sub-Division">Bilkisganj Sub-Division</option>
              <option value="Shyampur Tehsil">Shyampur Tehsil</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-[#0F2A4A] hover:bg-[#183d6a] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>LIVE REFRESH</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 65% / Right 35% matching screen3.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* GIS Telemetry Map Card matching screen3.png */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-700">GIS TELEMETRY:</span>
                <span className="text-slate-700 font-bold">
                  {activeWard} • Rampur Gram Panchayat
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={locateRealGps}
                  className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-bold text-blue-700 hover:bg-blue-50 flex items-center space-x-1 cursor-pointer"
                  title="Detect live GPS location"
                >
                  <Crosshair className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Fixing...' : 'Real GPS'}</span>
                </button>
                <div className="flex items-center bg-white border border-slate-200 rounded p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setMapLayer('street')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      mapLayer === 'street' ? 'bg-[#0F2A4A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Street
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapLayer('satellite')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      mapLayer === 'satellite' ? 'bg-[#0F2A4A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-72 w-full relative">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <MapController center={mapCenter} zoom={mapZoom} />

                {mapLayer === 'street' ? (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                ) : (
                  <TileLayer
                    attribution='&copy; Esri &mdash; DigitalGlobe'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                )}

                {userLocation && (
                  <Circle
                    center={userLocation}
                    radius={30}
                    pathOptions={{ color: '#2563EB', fillColor: '#3B82F6', fillOpacity: 0.3 }}
                  />
                )}

                {issues.map(iss => {
                  const color = iss.status === 'RESOLVED' ? '#10B981' : iss.priority === 'URGENT' ? '#EF4444' : '#3B82F6';
                  return (
                    <Marker
                      key={iss.id}
                      position={iss.coordinates}
                      icon={createDotIcon(color, `${iss.token} ${iss.title.substring(0, 10)}...`)}
                    >
                      <Popup>
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-slate-900 block">{iss.title}</span>
                          <span className="text-[11px] font-bold text-slate-800 block flex items-center">
                            📍 {iss.locationName}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-medium">{iss.panchayat}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIssueId(iss.id);
                              setOfficialTab('issues');
                            }}
                            className="mt-1 w-full py-1 bg-[#0F2A4A] text-white text-[10px] font-bold rounded cursor-pointer"
                          >
                            Open Dossier
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Bottom bar inside Map Card */}
            <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  REAL-TIME JURISDICTION MAP
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {activeWard} • Live GPS telemetry active for civic redressal teams
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setOfficialTab('map')}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  FULL EXTENT
                </button>
                <button
                  type="button"
                  onClick={() => setOfficialTab('issues')}
                  className="px-3 py-1.5 bg-[#0F2A4A] hover:bg-[#183d6a] text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  MANAGE ALL
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE COMMUNITY ISSUES LIST matching screen3.png */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                  ACTIVE COMMUNITY ISSUES
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-[#0F2A4A]">
                  12 Active
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Sorted by Administrative Urgency</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Item 1: Handpump */}
              <div className="p-4 hover:bg-slate-50/70 transition-all flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        VILLAGE HANDPUMP NOT WORKING
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">2 hrs ago</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">Ward 3 • Rampur Gram Panchayat</span>
                      <span>•</span>
                      <span>CATEGORY: WATER WORKS</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                      17 citizens reported contaminated muddy water and broken pump handle. Primary drinking source for 31 households in Harijan Basti. Urgent bore-well inspection required.
                    </p>
                    <div className="flex items-center space-x-3 mt-2.5">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        Report #1248
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 uppercase">
                        ESCALATED TO JE
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssueId('#GS-1248');
                    setOfficialTab('issues');
                  }}
                  className="px-4 py-1.5 border border-slate-300 hover:border-[#0F2A4A] hover:bg-blue-50 text-[#0F2A4A] text-xs font-bold rounded-lg cursor-pointer transition-all shrink-0"
                >
                  OPEN
                </button>
              </div>

              {/* Item 2: Large Pothole */}
              <div className="p-4 hover:bg-slate-50/70 transition-all flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        LARGE POTHOLE ON MAIN ROAD
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">4 hrs ago</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">Sector 15 Central Road</span>
                      <span>•</span>
                      <span>CATEGORY: PWD ROADS</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                      Deep 2-foot pothole near Central Park gate causing serious traffic hazard for two-wheelers. Rainwater pooling has obscured edge markings.
                    </p>
                    <div className="flex items-center space-x-3 mt-2.5">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        Report #1245
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                        FIELD CREW NOTIFIED
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssueId('#GS-1245');
                    setOfficialTab('issues');
                  }}
                  className="px-4 py-1.5 border border-slate-300 hover:border-[#0F2A4A] hover:bg-blue-50 text-[#0F2A4A] text-xs font-bold rounded-lg cursor-pointer transition-all shrink-0"
                >
                  OPEN
                </button>
              </div>

              {/* Item 3: Transformer Oil Leak */}
              <div className="p-4 hover:bg-slate-50/70 transition-all flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0F2A4A] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        DISTRIBUTION TRANSFORMER OIL LEAK
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">6 hrs ago</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">Shyampur Feeder • Pole #81</span>
                      <span>•</span>
                      <span>CATEGORY: ELECTRICITY BOARD</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                      Heavy sparks observed post 14:00 hrs. Low voltage surge impacting agricultural pumps across 14 neighboring farmlands.
                    </p>
                    <div className="flex items-center space-x-3 mt-2.5">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        Report #1250
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                        UNDER INVESTIGATION
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssueId('#GS-1250');
                    setOfficialTab('issues');
                  }}
                  className="px-4 py-1.5 border border-slate-300 hover:border-[#0F2A4A] hover:bg-blue-50 text-[#0F2A4A] text-xs font-bold rounded-lg cursor-pointer transition-all shrink-0"
                >
                  OPEN
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setOfficialTab('issues')}
                className="text-xs font-bold text-[#0F2A4A] hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>VIEW ALL ACTIVE REDRESSALS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) matching screen3.png */}
        <div className="lg:col-span-4 space-y-6">
          {/* SYSTEM METRICS (FY 2026-Q2) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                SYSTEM METRICS
              </h2>
              <span className="text-[11px] font-bold text-slate-400">FY 2026-Q2</span>
            </div>

            {/* Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-3xl font-black text-slate-900 block">1,284</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  TOTAL ISSUES
                </span>
              </div>
              <div className="text-center p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-3xl font-black text-emerald-600 block">846</span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  RESOLVED
                </span>
              </div>
              <div className="text-center p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-3xl font-black text-[#0F2A4A] block">312</span>
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                  IN PROGRESS
                </span>
              </div>
              <div className="text-center p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-3xl font-black text-amber-600 block">126</span>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  PENDING
                </span>
              </div>
            </div>

            {/* Urgent Escalations Box */}
            <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-red-900 block">
                  URGENT ESCALATIONS
                </span>
                <span className="text-[11px] text-red-700">SLA breach threshold exceeded &gt; 48h</span>
              </div>
              <span className="text-3xl font-black text-red-600">24</span>
            </div>

            {/* Resolution Rate Progress */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Overall Resolution Rate</span>
                <span className="font-extrabold text-slate-900">65.8%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#0F2A4A] h-full rounded-full" style={{ width: '65.8%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Target: 75% per Directive</span>
                <span className="text-emerald-600 font-bold">+4.2% this week</span>
              </div>
            </div>
          </div>

          {/* PANCHAYAT COMMAND matching screen3.png */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#0F2A4A]" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  PANCHAYAT COMMAND
                </h2>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Field Officer deployments & status across the 4 key Gram Panchayats in Sehore Block.
            </p>

            <div className="space-y-2.5">
              {PANCHAYAT_METRICS.map((pm, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{pm.name}</h3>
                    <p className="text-[10px] text-slate-500">
                      Officer: {pm.officer} ({pm.role})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${pm.status === 'urgent' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                      <span className="text-xs font-bold text-slate-800">{pm.openIssues} Open</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{pm.attendanceRate}% Attendance</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Monsoon Protocol Warning Alert */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start space-x-2.5 text-xs text-slate-700">
              <ShieldAlert className="w-4 h-4 text-[#0F2A4A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Monsoon Protocol:</strong> Heavy rainfall warning issued for Sehore Tehsil. PWD drains in Ward 3 require pre-emptive desilting log.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
