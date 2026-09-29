import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Crosshair, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Radio, 
  Play, 
  Pause, 
  ShieldAlert, 
  Edit, 
  UserCheck, 
  ArrowUpRight, 
  FileText, 
  Check, 
  X,
  Printer,
  Compass
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

const createCirclePin = (text: string, sub: string) => {
  return L.divIcon({
    className: 'custom-circle-pin',
    html: `
      <div style="background-color: #0F2A4A; color: white; border: 2px solid #EF4444; border-radius: 8px; padding: 4px 8px; font-weight: bold; font-size: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); text-align: center;">
        <div>${text}</div>
        <div style="color: #F87171; font-size: 8px;">${sub}</div>
      </div>
    `,
    iconSize: [120, 36],
    iconAnchor: [60, 36]
  });
};

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
};

export const OfficialIssueDetail: React.FC<{ issueId: string; onBack: () => void }> = ({ issueId, onBack }) => {
  const { issues, updateIssueStatus, escalateIssue, reassignIssue } = useApp();

  const issue = issues.find(i => i.id === issueId || i.token === issueId) || issues[1] || issues[0];

  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(issue.coordinates || [23.2018, 77.0895]);
  const [mapZoom, setMapZoom] = useState(15);
  const [userPatrolGps, setUserPatrolGps] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (issue.coordinates) {
      setMapCenter(issue.coordinates);
    }
  }, [issue]);

  const handleLocateOfficer = () => {
    if ('geolocation' in navigator) {
      setIsLocatingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          setUserPatrolGps([lat, lng]);
          setMapCenter([lat, lng]);
          setMapZoom(16);
          setIsLocatingGps(false);
        },
        (err) => {
          console.warn('Patrol GPS error:', err);
          setIsLocatingGps(false);
          setMapCenter(issue.coordinates || [23.2018, 77.0895]);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  const [statusNote, setStatusNote] = useState('Replacement materials delivered on site. Ground crew completing asphalt roller compression.');
  const [selectedStatus, setSelectedStatus] = useState(issue.status);
  const [escalateReason, setEscalateReason] = useState('SLA 48h limit breached without field technician sign-off.');

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [issue]);

  const toggleVoicePlayback = () => {
    if (isPlayingVoice) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingVoice(false);
      return;
    }

    // Play the authentic audio recorded when the complaint was filled
    if (issue.voiceReport?.audioUrl) {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(issue.voiceReport.audioUrl);
        audioPlayerRef.current.onended = () => setIsPlayingVoice(false);
        audioPlayerRef.current.onerror = () => setIsPlayingVoice(false);
      } else {
        audioPlayerRef.current.src = issue.voiceReport.audioUrl;
      }
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play()
        .then(() => setIsPlayingVoice(true))
        .catch(err => {
          console.warn('Playback error:', err);
          setIsPlayingVoice(false);
        });
    } else if ('speechSynthesis' in window && issue.voiceReport?.transcriptHindi) {
      const utterance = new SpeechSynthesisUtterance(issue.voiceReport.transcriptHindi);
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingVoice(true);
    }
  };

  const handleUpdateStatusSubmit = () => {
    updateIssueStatus(issue.id, selectedStatus, statusNote);
    setShowStatusModal(false);
  };

  const handleEscalateSubmit = () => {
    escalateIssue(issue.id, escalateReason);
    setShowEscalateModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Sub-header Bar matching screen4.png */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-200 rounded-md text-slate-700 cursor-pointer mr-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span>ISSUES</span>
          <span>/</span>
          <span className="uppercase">{issue.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">{issue.token}-SECTOR-15</span>
          <span>/</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-[#0F2A4A]">
            {issue.priority} PRIORITY
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYNCED WITH WARD 4 OPERATIONS</span>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center space-x-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>DOCKET</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout matching screen4.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): GIS Node & Tech Specs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* GIS Node Header */}
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block uppercase">
                  GIS NODE: {issue.panchayat.replace(/\s+/g, '-').toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  GRID REF: {issue.coordinates[0].toFixed(5)}° N, {issue.coordinates[1].toFixed(5)}° E
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                {/* Street / Satellite Switch */}
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

                <button
                  type="button"
                  onClick={handleLocateOfficer}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-700 flex items-center space-x-1 hover:bg-slate-100 cursor-pointer shadow-2xs"
                  title="Locate live field officer GPS"
                >
                  <Crosshair className={`w-3 h-3 text-[#0F2A4A] ${isLocatingGps ? 'animate-spin' : ''}`} />
                  <span>{isLocatingGps ? 'LOCATING...' : '[ LOCATE ME ]'}</span>
                </button>
              </div>
            </div>

            {/* GIS Map */}
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

                {/* Officer Live GPS Fix Marker */}
                {userPatrolGps && (
                  <>
                    <Marker
                      position={userPatrolGps}
                      icon={L.divIcon({
                        className: 'officer-live-dot',
                        html: `
                          <div style="background-color: #2563EB; color: white; padding: 2px 6px; border-radius: 9999px; font-weight: bold; font-size: 9px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); white-space: nowrap;">
                            📍 Field Officer
                          </div>
                        `,
                        iconSize: [80, 20],
                        iconAnchor: [40, 20]
                      })}
                    />
                    <Circle
                      center={userPatrolGps}
                      radius={35}
                      pathOptions={{ color: '#2563EB', fillColor: '#3B82F6', fillOpacity: 0.25 }}
                    />
                  </>
                )}

                {/* Incident Target Pin */}
                <Marker
                  position={issue.coordinates}
                  icon={createCirclePin(`${issue.token}: ${issue.title.substring(0, 14)}`, `PRIORITY: ${issue.priority}`)}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-slate-900 block">{issue.title}</span>
                      <span className="font-mono text-[10px] text-slate-500 block">
                        {issue.coordinates[0].toFixed(5)}° N, {issue.coordinates[1].toFixed(5)}° E
                      </span>
                      <span className="text-[10px] text-slate-600 block">{issue.locationName}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* GIS Telemetry Strip */}
            <div className="p-3 bg-white border-t border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
                <span className="font-bold text-slate-800">Incident {issue.token}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-slate-800 rounded-xs"></span>
                <span className="text-slate-600">Secondary Reports (2)</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Geotag Verified</span>
              </div>
            </div>
          </div>

          {/* Municipal Technical Specs Grid */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                MUNICIPAL ZONE
              </span>
              <span className="font-extrabold text-slate-800 text-sm">{issue.panchayat}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                ROAD CLASS
              </span>
              <span className="font-extrabold text-slate-800 text-sm">Major Arterial 40m</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                AVERAGE PEAK TRAFFIC
              </span>
              <span className="font-extrabold text-slate-800 text-sm">3,200 PCU / hr</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                WEATHER STATUS
              </span>
              <span className="font-extrabold text-slate-800 text-sm">Dry • 31°C</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Dossier, Timeline, Evidence, Action Buttons */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            {/* Header & Status */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  CIVIC INCIDENT DOSSIER
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-blue-100 text-[#0F2A4A] border border-blue-200">
                  STATUS: [ {issue.status} ]
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                TRACKING DETAILS: {issue.title.toUpperCase()}
              </h2>
            </div>

            {/* Incident Meta Box */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">INCIDENT TOKEN</span>
                <span className="text-base font-mono font-black text-[#0F2A4A]">{issue.token}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">LOCATION</span>
                <span className="font-bold text-slate-800">{issue.locationName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">CATEGORY</span>
                <span className="font-bold text-slate-800">{issue.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">CITIZENS IMPACTED</span>
                <span className="font-bold text-slate-800">{issue.upvotes} Registered Upvotes</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">LAT / LNG</span>
                <span className="font-mono text-slate-700">
                  {issue.coordinates[0].toFixed(5)}, {issue.coordinates[1].toFixed(5)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">SLA REMAINING</span>
                <span className="font-bold text-amber-700">{issue.slaRemainingHours} hours</span>
              </div>
            </div>

            {/* Official Grievance Summary */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                OFFICIAL GRIEVANCE SUMMARY
              </h3>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs italic text-slate-700 leading-relaxed">
                "{issue.summary}"
              </div>
            </div>

            {/* Resolution Timeline & Logistics */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
                RESOLUTION TIMELINE & LOGISTICS
              </h3>
              <div className="space-y-3 relative pl-6 border-l-2 border-slate-200 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">REPORT LOGGED</span>
                    <p className="text-[11px] text-slate-500">Verified by GramSetu Citizen Engine</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      ASSIGNED TO FMC ROAD MAINTENANCE TEAM
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Lead Engineer: D. K. Sharma (Unit #08)
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                    issue.status === 'IN PROGRESS' || issue.status === 'RESOLVED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-500'
                  }`}>
                    {issue.status === 'IN PROGRESS' || issue.status === 'RESOLVED' ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      SCHEDULED REPAIR OPERATIONS
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Cold-mix asphalt truck dispatched for 14:00 slot
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                    issue.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-500'
                  }`}>
                    {issue.status === 'RESOLVED' ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      RESOLVED VERIFICATION
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Field engineer geotag photo submission required
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Evidence Dossier matching screen4.png */}
            <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  COMMUNITY EVIDENCE DOSSIER
                </span>
                <span className="text-[10px] font-bold text-emerald-800 flex items-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                  2 Geotags Attached
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 relative h-28 rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                    alt="Pothole ground inspection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    28.4110°N • 77.3190°E
                  </div>
                </div>

                <div className="md:col-span-7 bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                      <Radio className="w-3.5 h-3.5 text-[#0F2A4A]" />
                      <span>Voice Report Transcript ({issue.voiceReport?.dialect || 'Hindi'})</span>
                    </div>
                    {issue.voiceReport?.audioUrl ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Saved Audio Available</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Written Report</span>
                    )}
                  </div>
                  <p className="italic text-slate-600 leading-snug">
                    "{issue.voiceReport?.transcriptHindi || issue.summary}"
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-500">
                      Reported by: {issue.reportedBy} ({issue.reporterToken})
                    </span>
                    <div className="flex items-center space-x-2">
                      {isPlayingVoice && (
                        <div className="flex items-center space-x-1 text-red-600 font-bold text-[10px]">
                          <span className="w-1 h-3 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="w-1 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          <span>Playing</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={toggleVoicePlayback}
                        className={`font-bold hover:underline flex items-center space-x-1 cursor-pointer ${
                          isPlayingVoice ? 'text-red-600' : 'text-[#0F2A4A]'
                        }`}
                        title="Play audio recorded by citizen"
                      >
                        {isPlayingVoice ? <Pause className="w-3 h-3 text-red-600" /> : <Play className="w-3 h-3 text-[#0F2A4A]" />}
                        <span>{isPlayingVoice ? 'Pause' : 'Play Audio'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Action Controls matching screen4.png */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(true)}
                className="py-2.5 px-3 bg-[#0F2A4A] hover:bg-[#183d6a] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>[ UPDATE STATUS ]</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReassignModal(true)}
                className="py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>[ REASSIGN ]</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEscalateModal(true)}
                className="py-2.5 px-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>[ ESCALATE ]</span>
              </button>
            </div>
          </div>

          {/* Junior Engineer Unit Card matching screen4.png bottom */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F2A4A] flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Junior Engineer Unit #08</h4>
                <p className="text-[11px] text-slate-500">
                  Faridabad Municipal Corporation • On duty
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="tel:+919826044120"
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => alert('Radio dispatch signal transmitted to Unit #08 handheld RT-700.')}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <Radio className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: UPDATE STATUS */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Update Issue Redressal Status
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Recording official progress update for {issue.token}.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e: any) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                >
                  <option value="OPEN">OPEN (Under Review)</option>
                  <option value="VERIFIED">VERIFIED (Field Checked)</option>
                  <option value="ASSIGNED">ASSIGNED (Routed to Department)</option>
                  <option value="IN PROGRESS">IN PROGRESS (Work Commenced)</option>
                  <option value="REPAIR SCHEDULED">REPAIR SCHEDULED</option>
                  <option value="RESOLVED">RESOLVED (Completed with Evidence)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Notes / Verification Log</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatusSubmit}
                  className="px-4 py-2 bg-[#0F2A4A] text-white rounded-lg text-xs font-bold hover:bg-[#183d6a] cursor-pointer shadow-sm"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ESCALATE */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowEscalateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-red-600 mb-1">
              <ArrowUpRight className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">
                Trigger Official Administrative Escalation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Escalate {issue.token} from <strong>{issue.administrativeLevel}</strong> to the higher authority tier.
            </p>

            <div className="space-y-3.5">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800">
                <strong>Next Authority:</strong> District Authority Redressal Oversight Cell (Collector Office)
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Escalation Memo / Directive</label>
                <textarea
                  rows={3}
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEscalateSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer shadow-sm"
                >
                  Confirm Escalation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REASSIGN */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowReassignModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Reassign Incident to Department / Officer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dispatch work order and telemetry route map.
            </p>

            <div className="space-y-3">
              <div
                onClick={() => {
                  reassignIssue(issue.id, {
                    name: 'D. K. Sharma',
                    role: 'Lead Field Engineer',
                    department: 'PWD Roads & Highways',
                    unit: 'FMC Road Works Team B (Unit #08)',
                    phone: '+91 98260 44120',
                    badge: '#MP-PWD-771'
                  });
                  setShowReassignModal(false);
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0F2A4A] hover:bg-blue-50 cursor-pointer text-xs"
              >
                <h4 className="font-bold text-slate-900">D. K. Sharma • PWD Road Works Team B</h4>
                <p className="text-[11px] text-slate-500">Unit #08 • Faridabad / Sehore Sector</p>
              </div>

              <div
                onClick={() => {
                  reassignIssue(issue.id, {
                    name: 'Rajesh Verma',
                    role: 'Junior Engineer (JE)',
                    department: 'MPPKVVCL Power Grid',
                    unit: 'Substation Flying Squad',
                    phone: '+91 94250 88712',
                    badge: '#JE-PWR-990'
                  });
                  setShowReassignModal(false);
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0F2A4A] hover:bg-blue-50 cursor-pointer text-xs"
              >
                <h4 className="font-bold text-slate-900">Rajesh Verma • MPPKVVCL Power Grid</h4>
                <p className="text-[11px] text-slate-500">Substation Flying Squad</p>
              </div>

              <div
                onClick={() => {
                  reassignIssue(issue.id, {
                    name: 'SDO Jal Nigam',
                    role: 'SDO Drinking Water',
                    department: 'Rural Drinking Water & Sanitation',
                    unit: 'Panchayat Jal Seva',
                    phone: '+91 94251 00214',
                    badge: '#MP-SEH-JAL'
                  });
                  setShowReassignModal(false);
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0F2A4A] hover:bg-blue-50 cursor-pointer text-xs"
              >
                <h4 className="font-bold text-slate-900">SDO Jal Nigam • Water Works Cell</h4>
                <p className="text-[11px] text-slate-500">Borewell & Handpump Repair Team</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
