import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { playAudioWithFallback } from '../../utils/audioPlayback';
import { detectLiveVoiceMatch, detectDomainConcept } from '../../utils/similarityEngine';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  FileText, 
  MapPin, 
  ChevronRight, 
  Volume2, 
  Sparkles, 
  Flag, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  VolumeX,
  Edit,
  Crosshair
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getFriendlyLocationName } from '../../utils/locationResolver';

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
};

export const CitizenHome: React.FC = () => {
  const { 
    setCitizenTab, 
    issues, 
    setSelectedIssueId, 
    submitNewIssue, 
    language,
    t,
    joinCluster,
    clusters
  } = useApp();

  // Real GPS & Map Viewport state for CitizenHome
  const [homeMapCenter, setHomeMapCenter] = useState<[number, number]>([23.2045, 77.085]);
  const [homeUserGps, setHomeUserGps] = useState<[number, number]>([23.2030, 77.0820]);
  const [isLocatingHomeGps, setIsLocatingHomeGps] = useState<boolean>(false);
  const [homeMapLayer, setHomeMapLayer] = useState<'street' | 'satellite'>('street');

  const locateHomeGps = () => {
    if ('geolocation' in navigator) {
      setIsLocatingHomeGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          setHomeUserGps([lat, lng]);
          setHomeMapCenter([lat, lng]);
          setIsLocatingHomeGps(false);
        },
        (err) => {
          setIsLocatingHomeGps(false);
          setHomeMapCenter([23.2045, 77.085]);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto">
      {/* Namaste Greeting Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('namaste', 'Namaste')}, Ramesh</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                {t('verifiedCitizen', 'VERIFIED CITIZEN')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
              {t('wardLocation', 'Ward 3 • Rampur, Sehore, MP')}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0F2A4A] flex items-center justify-center border border-blue-100">
            <Flag className="w-4 h-4" />
          </div>
        </div>

        {/* Panchayat active token pill */}
        <div className="mt-3 py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 font-medium">{t('portalActive', 'Gram Panchayat Portal Active')}</span>
          </div>
          <span className="font-mono text-slate-700 font-bold">{t('token', 'Token')} #MP-SEH-084</span>
        </div>
      </div>

      {/* SEVA SUVIDHA 24x7 - REAL-TIME VOICE REPORTING */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {t('sevaSuvidha', 'SEVA SUVIDHA 24x7')}
            </span>
            <h2 className="text-base font-extrabold text-slate-900">{t('reportAProblem', 'REPORT A PROBLEM')}</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0F2A4A] text-[11px] font-bold border border-blue-200 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>AI Assisted</span>
          </span>
        </div>

        <div className="p-4">
          <p className="text-xs text-slate-600 mb-4">
            {t('micInstructions', 'See something that needs municipal or panchayat attention? Speak directly into your microphone.')}
          </p>

          {/* Voice-First Grievance Reporting Launchpad */}
          <div
            onClick={() => setCitizenTab('report')}
            className="bg-gradient-to-b from-blue-50/70 to-slate-50 rounded-2xl p-6 border border-blue-100 text-center cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Ambient pulse glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

            {/* Big Mic Button */}
            <div className="relative inline-block mb-3.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCitizenTab('report');
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-lg transition-all cursor-pointer bg-[#0F2A4A] group-hover:bg-[#183d6a] group-hover:scale-110 ring-4 ring-blue-100/80"
                title={t('tapToSpeak', 'Tap to Speak')}
              >
                <Mic className="w-7 h-7" />
              </button>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0F2A4A] transition-colors">
              {t('tapToSpeak', 'Tap to Speak')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {t('speechSupported', 'Hindi, Malwi, Bundeli & English supported')}
            </p>

            <div className="mt-4 flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-white border border-slate-200/90 shadow-2xs group-hover:bg-blue-50 group-hover:border-blue-200 transition-all flex items-center space-x-2 text-xs font-bold text-[#0F2A4A]">
                <span>{language === 'hi' ? 'शिकायत पंजीकरण खोलें (बोलें या लिखें)' : 'Open Grievance Form (Voice or Type)'}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MY CIVIC TRACKER - Ward 3 Overview */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {t('myCivicTracker', 'MY CIVIC TRACKER')}
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Ward 3 Overview</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">{language === 'hi' ? 'कुल दर्ज' : 'TOTAL FILED'}</span>
              <span className="text-2xl font-black text-slate-900">05</span>
            </div>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">{t('statusResolved', 'RESOLVED')}</span>
              <span className="text-2xl font-black text-emerald-700">03</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide block">{t('statusInProgress', 'IN PROGRESS')}</span>
              <span className="text-2xl font-black text-[#0F2A4A]">01</span>
            </div>
            <Hourglass className="w-5 h-5 text-blue-600" />
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">{t('statusOpen', 'PENDING REVIEW')}</span>
              <span className="text-2xl font-black text-amber-700">01</span>
            </div>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>
      </div>

      {/* COMMUNITY MAP - 2 pending issues within 500m */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                {language === 'hi' ? 'सामुदायिक नक्शा' : 'COMMUNITY MAP'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'आपके आस-पास की समस्याएं • रामपुर एवं सीहोर' : 'Live issues near your location • Rampur & Sehore'}
            </p>
          </div>
          
          <div className="flex items-center space-x-1.5">
            {/* Street / Satellite Toggle */}
            <div className="flex items-center bg-slate-100 rounded p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setHomeMapLayer('street')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  homeMapLayer === 'street' ? 'bg-[#0F2A4A] text-white' : 'text-slate-600'
                }`}
              >
                {language === 'hi' ? 'सड़क' : 'Street'}
              </button>
              <button
                type="button"
                onClick={() => setHomeMapLayer('satellite')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  homeMapLayer === 'satellite' ? 'bg-[#0F2A4A] text-white' : 'text-slate-600'
                }`}
              >
                {language === 'hi' ? 'सैटेलाइट' : 'Satellite'}
              </button>
            </div>

            {/* Locate Me GPS Button */}
            <button
              type="button"
              onClick={locateHomeGps}
              className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded flex items-center space-x-1 cursor-pointer shadow-2xs"
              title="Locate device GPS position"
            >
              <Crosshair className={`w-3 h-3 text-blue-600 ${isLocatingHomeGps ? 'animate-spin' : ''}`} />
              <span>{isLocatingHomeGps ? (language === 'hi' ? 'खोज रहे...' : 'Locating...') : (language === 'hi' ? 'जीपीएस' : 'GPS')}</span>
            </button>

            <button 
              onClick={() => setCitizenTab('map')}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              title={language === 'hi' ? 'पूरा नक्शा देखें' : 'Expand full map'}
            >
              <MapPin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Interactive Leaflet Community Map */}
        <div className="relative h-48 bg-slate-200 overflow-hidden">
          <MapContainer
            center={homeMapCenter}
            zoom={14}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <MapController center={homeMapCenter} zoom={14} />

            {homeMapLayer === 'street' ? (
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

            {/* User Real Location Pin */}
            <Marker
              position={homeUserGps}
              icon={L.divIcon({
                className: 'user-pin',
                html: `
                  <div style="background-color: #0F2A4A; color: white; padding: 2px 6px; border-radius: 9999px; font-weight: bold; font-size: 9px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #34D399; display: inline-block;"></span>
                    <span>${language === 'hi' ? 'आपका स्थान' : 'Your GPS'}</span>
                  </div>
                `,
                iconSize: [75, 20],
                iconAnchor: [37, 20]
              })}
            >
              <Popup>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">{language === 'hi' ? 'आपका वास्तविक स्थान' : 'Your Ground Location'}</span>
                  <span className="text-[11px] font-bold text-slate-700 block mt-0.5">
                    {getFriendlyLocationName(homeUserGps)}
                  </span>
                </div>
              </Popup>
            </Marker>

            {/* Accuracy Circle */}
            <Circle
              center={homeUserGps}
              radius={25}
              pathOptions={{ color: '#2563EB', fillColor: '#3B82F6', fillOpacity: 0.2 }}
            />

            {/* Handpump Issue Pin */}
            <Marker
              position={[23.2045, 77.0812]}
              icon={L.divIcon({
                className: 'issue-pin',
                html: `
                  <div style="background-color: #EF4444; color: white; padding: 3px 6px; border-radius: 6px; font-weight: bold; font-size: 9px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1.5px solid white; white-space: nowrap;">
                    ⚠️ ${language === 'hi' ? 'हैंडपंप समस्या' : 'Handpump Issue'}
                  </div>
                `,
                iconSize: [95, 20],
                iconAnchor: [47, 20]
              })}
              eventHandlers={{
                click: () => {
                  setSelectedIssueId('#GS-1248');
                  setCitizenTab('activity');
                }
              }}
            >
              <Popup>
                <div className="text-xs font-bold">{language === 'hi' ? '#GS-1248: हैंडपंप खराबी' : '#GS-1248: Handpump Failure'}</div>
                <div className="text-[11px] text-slate-700 font-semibold mt-0.5">{language === 'hi' ? 'वार्ड 3 • रामपुर ग्राम पंचायत' : 'Ward 3 • Rampur Gram Panchayat'}</div>
                <div className="text-[10px] text-slate-500">{language === 'hi' ? '१७ ग्रामीणों ने दर्ज किया' : '17 citizens reported'}</div>
              </Popup>
            </Marker>

            {/* Sector 15 Pothole Pin */}
            <Marker
              position={[23.2018, 77.0895]}
              icon={L.divIcon({
                className: 'pothole-pin',
                html: `
                  <div style="background-color: #F59E0B; color: white; padding: 3px 6px; border-radius: 6px; font-weight: bold; font-size: 9px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1.5px solid white; white-space: nowrap;">
                    ⚠️ ${language === 'hi' ? 'सड़क का गड्ढा #1245' : 'Pothole #1245'}
                  </div>
                `,
                iconSize: [80, 20],
                iconAnchor: [40, 20]
              })}
              eventHandlers={{
                click: () => {
                  setSelectedIssueId('#GS-1245');
                  setCitizenTab('activity');
                }
              }}
            >
              <Popup>
                <div className="text-xs font-bold">{language === 'hi' ? '#GS-1245: मुख्य सड़क पर गड्ढा' : '#GS-1245: Main Road Pothole'}</div>
                <div className="text-[11px] text-slate-700 font-semibold mt-0.5">{language === 'hi' ? 'सेक्टर 15 सेंट्रल रोड • सीहोर' : 'Sector 15 Central Road • Sehore Town'}</div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* Floating Bottom Card */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between shadow-xs z-[500]">
            <span className="text-slate-700 font-semibold flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              {language === 'hi' ? 'वार्ड 3 में हैंडपंप खराबी (५०० मीटर)' : 'Handpump failure at Ward 3 (500m)'}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedIssueId('#GS-1248');
                setCitizenTab('activity');
              }}
              className="text-[11px] font-bold text-[#0F2A4A] hover:underline cursor-pointer"
            >
              {language === 'hi' ? 'स्थिति देखें' : 'Track Issue'}
            </button>
          </div>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => setCitizenTab('map')}
            className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#0F2A4A] rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पूरा वार्ड नक्शा खोलें' : 'Open Full Interactive Community Map'}</span>
          </button>
        </div>
      </div>

      {/* NEARBY COMMUNITY MATTERS - View All */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            {language === 'hi' ? 'आस-पास के सामुदायिक मामले' : 'NEARBY COMMUNITY MATTERS'}
          </h2>
          <button 
            onClick={() => setCitizenTab('activity')}
            className="text-[11px] font-bold text-[#0F2A4A] hover:underline cursor-pointer"
          >
            {language === 'hi' ? 'सभी देखें' : 'View All'}
          </button>
        </div>

        <div className="space-y-3">
          {/* Issue 1: Broken Streetlight */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F2A4A] flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-slate-900">{language === 'hi' ? 'स्ट्रीट लाइट बंद' : 'Broken Streetlight'}</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 text-slate-700">{t('statusOpen', 'OPEN')}</span>
                </div>
                <p className="text-[11px] text-slate-500">{language === 'hi' ? 'सेक्टर 12 मार्केट रोड' : 'Sector 12 Market Road'}</p>
                <p className="text-[10px] text-slate-400">{language === 'hi' ? 'संजय वी. द्वारा २ घंटे पहले दर्ज' : 'Reported 2 hrs ago by Sanjay V.'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedIssueId('#GS-1248');
                setCitizenTab('activity');
              }}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-[#0F2A4A] rounded-lg text-xs font-bold cursor-pointer"
            >
              {language === 'hi' ? 'देखें' : 'Track'}
            </button>
          </div>

          {/* Issue 2: Village Handpump */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-slate-900">{language === 'hi' ? 'गांव का हैंडपंप' : 'Village Handpump'}</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">{t('statusInProgress', 'IN PROGRESS')}</span>
                </div>
                <p className="text-[11px] text-slate-500">{language === 'hi' ? 'वार्ड 3 रामपुर' : 'Ward 3 Rampur'}</p>
                <p className="text-[10px] text-slate-400">{language === 'hi' ? 'कल दर्ज • जल निगम (PHED) को सौंपा गया' : 'Reported Yesterday • Assigned to PHED'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedIssueId('#GS-1248');
                setCitizenTab('activity');
              }}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-[#0F2A4A] rounded-lg text-xs font-bold cursor-pointer"
            >
              {language === 'hi' ? 'देखें' : 'Track'}
            </button>
          </div>

          {/* Resolved Announcement */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 border-l-4 border-l-emerald-600">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'समस्या का समाधान पूर्ण' : 'Redressal Completed'}</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-snug">
              {language === 'hi' 
                ? 'पंचायत सफाई वाहन ने गल्ला मंडी चौराहे से १८ घंटे में कचरा पूरी तरह हटा दिया।' 
                : 'Panchayat sanitation vehicle cleared garbage accumulation at Galla Mandi crossing within 18h.'}
            </p>
            <p className="text-[10px] text-emerald-800 font-medium mt-1">
              {language === 'hi' ? 'वार्ड सदस्य द्वारा सत्यापित • ४ घंटे पहले' : 'Verified by Ward Member • 4h ago'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
