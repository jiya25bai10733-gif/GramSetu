import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  User, 
  ChevronDown, 
  Mic, 
  MicOff, 
  Camera, 
  RefreshCw, 
  MapPin, 
  UploadCloud, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  X, 
  Sparkles, 
  Check, 
  ArrowRight,
  Layers,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Crosshair
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Interactive Map Click Handler
const MapClickPicker = ({ onLocationPick }: { onLocationPick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationPick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    },
  });
  return null;
};

// Map Recenter on Coordinates change
const MapRecenter = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 16);
  }, [coords, map]);
  return null;
};

export const CitizenReportIssue: React.FC = () => {
  const { setCitizenTab, submitNewIssue, setSelectedIssueId, joinCluster, language } = useApp();

  const [mode, setMode] = useState<'type' | 'voice'>('type');
  const [category, setCategory] = useState('Water Supply & Sanitation');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Ward 04, Rampur Gram Panchayat (Block-B)');
  const [coordinates, setCoordinates] = useState<[number, number]>([23.1793, 79.9498]);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [mapTileType, setMapTileType] = useState<'street' | 'satellite'>('street');
  
  // Real-time audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [volumeBars, setVolumeBars] = useState<number[]>([8, 14, 6, 16, 10]);

  // Field-specific live dictation: 'subject' | 'description' | null
  const [activeDictatingField, setActiveDictatingField] = useState<'subject' | 'description' | null>(null);

  // Attached photos
  const [photos, setPhotos] = useState<string[]>([]);

  // Modals
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [submittedIssueId, setSubmittedIssueId] = useState<string | null>(null);
  const [matchedClusterTitle, setMatchedClusterTitle] = useState('');

  // Refs for media recording & speech recognition
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch {}
    }
    setActiveDictatingField(null);
    setIsRecording(false);
  };

  // Field-targeted dictation handler (for Subject or Description)
  const toggleFieldDictation = async (field: 'subject' | 'description') => {
    if (activeDictatingField === field) {
      // Stop dictating
      stopAllMedia();
      return;
    }

    // Stop any existing recording first
    stopAllMedia();

    setMicError(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Realtime Audio Volume Meter
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        setVolumeBars([
          Math.max(6, Math.min(24, (dataArray[1] || 0) / 9)),
          Math.max(6, Math.min(28, (dataArray[3] || 0) / 8)),
          Math.max(6, Math.min(30, (dataArray[5] || 0) / 7)),
          Math.max(6, Math.min(28, (dataArray[7] || 0) / 8)),
          Math.max(6, Math.min(24, (dataArray[9] || 0) / 9))
        ]);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      // Record audio buffer for persistence
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              setAudioBlobUrl(reader.result);
            }
          };
          reader.readAsDataURL(audioBlob);
        }
      };
      mediaRecorder.start(200);

      // Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript + ' ';
          }
          const clean = text.trim();
          if (field === 'subject') {
            setSubject(clean.length > 80 ? clean.substring(0, 80) : clean);
          } else {
            setDescription(clean);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Recognition error:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setActiveDictatingField(field);

    } catch (err: any) {
      console.error(err);
      setMicError('Microphone permission required for voice dictation.');
      setActiveDictatingField(null);
    }
  };

  const startGeneralMicRecording = async () => {
    setMicError(null);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        setVolumeBars([
          Math.max(6, Math.min(28, (dataArray[1] || 0) / 8)),
          Math.max(6, Math.min(32, (dataArray[3] || 0) / 7)),
          Math.max(6, Math.min(34, (dataArray[5] || 0) / 6)),
          Math.max(6, Math.min(30, (dataArray[7] || 0) / 7)),
          Math.max(6, Math.min(26, (dataArray[9] || 0) / 8))
        ]);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              setAudioBlobUrl(reader.result);
            }
          };
          reader.readAsDataURL(audioBlob);
        }
      };

      mediaRecorder.start(200);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript + ' ';
          }
          const clean = text.trim();
          setDescription(clean);
          if (!subject) {
            setSubject(clean.length > 40 ? clean.substring(0, 40) + '...' : clean);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setIsRecording(true);

      let sec = 0;
      timerIntervalRef.current = setInterval(() => {
        sec += 1;
        setRecordingSeconds(sec);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setMicError('Microphone permission required for voice dictation.');
      setIsRecording(false);
    }
  };

  const toggleGeneralRecording = () => {
    if (isRecording) {
      stopAllMedia();
    } else {
      startGeneralMicRecording();
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioBlobUrl) return;

    if (isPlayingAudio) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      }
      setIsPlayingAudio(false);
    } else {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio(audioBlobUrl);
        audioElementRef.current.onended = () => setIsPlayingAudio(false);
      } else {
        audioElementRef.current.src = audioBlobUrl;
      }
      audioElementRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setPhotos(prev => [...prev, fakeUrl]);
    }
  };

  const acquireRealLifeLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocatingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          const acc = Math.round(pos.coords.accuracy);
          setCoordinates([lat, lng]);
          setGpsAccuracy(acc);
          setIsLocatingGps(false);
          setLocation(`Live GPS: ${lat}° N, ${lng}° E (Ward 04, Rampur)`);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setIsLocatingGps(false);
          setCoordinates([23.2045, 77.0812]);
          setGpsAccuracy(8);
          setLocation('Ward 04, Rampur Gram Panchayat (23.2045° N, 77.0812° E)');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setCoordinates([23.2045, 77.0812]);
      setLocation('Ward 04, Rampur Gram Panchayat (23.2045° N, 77.0812° E)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleFinal = subject.trim() || description.trim() || 'Reported Civic Grievance';
    const summaryFinal = description.trim() || subject.trim() || 'Civic defect reported by citizen.';

    const result = submitNewIssue({
      title: titleFinal,
      summary: summaryFinal,
      category,
      locationName: location,
      panchayat: 'Rampur Panchayat',
      coordinates: coordinates,
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80'],
      voiceReport: audioBlobUrl ? {
        transcriptHindi: summaryFinal,
        transcriptEnglish: summaryFinal,
        dialect: 'Realtime Voice Engine',
        duration: `00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 5}`,
        audioUrl: audioBlobUrl
      } : undefined
    });

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setSubmittedIssueId(result.issue.id);

    if (result.matchedCluster) {
      setMatchedClusterTitle(result.matchedCluster.title);
      setShowMatchModal(true);
    } else {
      setSelectedIssueId(result.issue.id);
      setCitizenTab('activity');
    }
  };

  return (
    <div className="max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setCitizenTab('home')}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-base text-slate-900 tracking-tight">Report Grievance</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
          <User className="w-4 h-4" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Title Badges */}
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#0F2A4A] text-white">
            CIVIC GRIEVANCE LODGEMENT
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
            SECURE PORTAL
          </span>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Report an Issue</h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-normal">
            Report local public infrastructure issues such as potholes, broken streetlights, or water leakages.
          </p>
        </div>

        {/* Mic Error Notice if permission denied */}
        {micError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <VolumeX className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{micError}</span>
          </div>
        )}

        {/* Form Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'type'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Type & Fill Details
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('voice');
              if (!isRecording) startGeneralMicRecording();
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              mode === 'voice'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Speak (Voice Report)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
              HINDI / DIALECTS
            </span>
          </button>
        </div>

        {/* Voice Mode Realtime Recording Assistant Box */}
        {mode === 'voice' && (
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-center space-y-3">
            <div className="relative inline-block">
              {isRecording && (
                <div className="absolute -inset-2.5 rounded-full bg-red-400/40 animate-ping"></div>
              )}
              <button
                type="button"
                onClick={toggleGeneralRecording}
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-white shadow-md transition-all cursor-pointer ${
                  isRecording ? 'bg-red-600 ring-4 ring-red-200' : 'bg-[#0F2A4A]'
                }`}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                {isRecording ? `Recording... 00:0${recordingSeconds}` : 'Tap Mic to Dictate Grievance'}
              </p>
              <p className="text-[10px] text-slate-500">
                Speaks Hindi or English, words are typed in real-time below
              </p>
            </div>

            {/* Live Waveform */}
            {isRecording && (
              <div className="flex items-center justify-center space-x-1.5 py-1">
                {volumeBars.map((h, i) => (
                  <div key={i} className="w-1.5 bg-red-500 rounded-full" style={{ height: `${h}px` }}></div>
                ))}
              </div>
            )}

            {audioBlobUrl && !isRecording && (
              <div className="flex items-center justify-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={toggleAudioPlayback}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center space-x-1 cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingAudio ? 'Pause' : 'Play Voice Recording'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Lodgement Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Step 1 of 4</span>
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A] cursor-pointer"
              >
                <option>Water Supply & Sanitation</option>
                <option>Roads & Surface Transit</option>
                <option>Electricity & Power Grid</option>
                <option>Sanitation & Drainage</option>
                <option>Irrigation Infrastructure</option>
                <option>Public Health & Dispensary</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Short Summary with Voice Dictate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Short Summary / Subject <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center space-x-2">
                {/* Voice dictate button for Subject */}
                <button
                  type="button"
                  onClick={() => toggleFieldDictation('subject')}
                  className={`text-[11px] font-bold inline-flex items-center space-x-1 px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                    activeDictatingField === 'subject'
                      ? 'bg-red-100 text-red-600 animate-pulse border border-red-200'
                      : 'text-[#0F2A4A] hover:bg-blue-50'
                  }`}
                  title="Speak to dictate subject"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{activeDictatingField === 'subject' ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono">{subject.length} / 80</span>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                maxLength={80}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Broken Handpump near Ward 4 School"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A] ${
                  activeDictatingField === 'subject' ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300'
                }`}
                required
              />
              {activeDictatingField === 'subject' && (
                <span className="absolute right-3 top-2.5 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                </span>
              )}
            </div>

            {/* Live voice indicator for subject */}
            {activeDictatingField === 'subject' && (
              <div className="mt-1.5 flex items-center justify-between px-2 py-1 bg-red-50 rounded-lg text-[10px] text-red-700">
                <div className="flex items-center space-x-1">
                  <span>Speaking into mic...</span>
                  <div className="flex items-center space-x-0.5 ml-1">
                    {volumeBars.map((h, i) => (
                      <div key={i} className="w-1 bg-red-500 rounded-full" style={{ height: `${h * 0.6}px` }}></div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => stopAllMedia()}
                  className="font-bold hover:underline cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Detailed Description with Quick Dictate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Detailed Description <span className="text-red-500">*</span>
              </label>

              {/* Quick Dictate Voice Button matching user's screenshot */}
              <button
                type="button"
                onClick={() => toggleFieldDictation('description')}
                className={`text-[11px] font-bold inline-flex items-center space-x-1 px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                  activeDictatingField === 'description'
                    ? 'bg-red-100 text-red-600 animate-pulse border border-red-200'
                    : 'text-[#0F2A4A] hover:bg-blue-50'
                }`}
                title="Speak to dictate detailed description"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{activeDictatingField === 'description' ? 'Listening...' : 'Quick Dictate'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the defect, when it started, safety hazards, and any nearby public landmarks..."
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A] ${
                  activeDictatingField === 'description' ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300'
                }`}
                required
              ></textarea>
              {activeDictatingField === 'description' && (
                <span className="absolute right-3 top-2.5 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                </span>
              )}
            </div>

            {/* Live voice indicator for description */}
            {activeDictatingField === 'description' && (
              <div className="mt-1.5 flex items-center justify-between px-2 py-1 bg-red-50 rounded-lg text-[10px] text-red-700">
                <div className="flex items-center space-x-1">
                  <span>Dictating live into description...</span>
                  <div className="flex items-center space-x-0.5 ml-1">
                    {volumeBars.map((h, i) => (
                      <div key={i} className="w-1 bg-red-500 rounded-full" style={{ height: `${h * 0.6}px` }}></div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => stopAllMedia()}
                  className="font-bold hover:underline cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Real-time Location & Interactive Map Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Location & Landmark <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={acquireRealLifeLocation}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                <Crosshair className={`w-3 h-3 text-emerald-600 ${isLocatingGps ? 'animate-spin' : ''}`} />
                <span>{isLocatingGps ? 'Detecting GPS...' : 'Acquire Live GPS'}</span>
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A]"
                required
              />
              <button
                type="button"
                onClick={acquireRealLifeLocation}
                className="px-3 py-2 bg-[#0F2A4A] hover:bg-[#183d6a] text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer shrink-0 shadow-2xs"
                title="Refresh with device GPS coordinates"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
                <span>GPS</span>
              </button>
            </div>

            {/* Interactive Leaflet Map Picker Container */}
            <div className="rounded-xl border border-slate-300 overflow-hidden shadow-xs relative">
              {/* Map Controls Bar */}
              <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[10px]">
                <div className="flex items-center space-x-1 text-slate-700 font-bold">
                  <MapPin className="w-3 h-3 text-[#0F2A4A]" />
                  <span>Click anywhere on map to pin defect</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setMapTileType(mapTileType === 'street' ? 'satellite' : 'street')}
                    className="px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded cursor-pointer"
                  >
                    {mapTileType === 'street' ? '🛰 Satellite View' : '🗺 Street View'}
                  </button>
                </div>
              </div>

              {/* Live Map Canvas */}
              <div className="h-44 w-full relative">
                <MapContainer
                  center={coordinates}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url={
                      mapTileType === 'satellite'
                        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                  />
                  <MapRecenter coords={coordinates} />
                  <MapClickPicker
                    onLocationPick={(lat, lng) => {
                      setCoordinates([lat, lng]);
                      setLocation(`Selected Pin: ${lat}° N, ${lng}° E (Ward 04, Rampur)`);
                    }}
                  />
                  <Marker
                    position={coordinates}
                    icon={L.divIcon({
                      className: 'picker-pin',
                      html: `
                        <div style="background-color: #EF4444; color: white; padding: 2px 6px; border-radius: 6px; font-weight: bold; font-size: 9px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white; white-space: nowrap; display: flex; align-items: center; gap: 3px;">
                          <span>📍 Issue Spot</span>
                        </div>
                      `,
                      iconSize: [80, 20],
                      iconAnchor: [40, 20]
                    })}
                  >
                    <Popup>
                      <div className="text-xs font-bold">Defect Location</div>
                      <div className="text-[10px] text-slate-500 font-mono">{coordinates[0]}° N, {coordinates[1]}° E</div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              {/* Coordinates & Verified Geo-Fence Footer */}
              <div className="bg-white p-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">Verified Geo-Fence:</span>
                  <span className="font-mono text-slate-600 text-[10px]">
                    {coordinates[0]}° N, {coordinates[1]}° E {gpsAccuracy ? `(±${gpsAccuracy}m)` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={acquireRealLifeLocation}
                  className="text-[#0F2A4A] font-bold text-[10px] hover:underline cursor-pointer"
                >
                  Center on Me
                </button>
              </div>
            </div>
          </div>

          {/* Evidence Attachment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Evidence Attachment <span className="text-slate-400 font-normal">(Recommended)</span>
              </label>
              <span className="text-[10px] text-slate-400">Max 15MB</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2.5">
              {/* Upload Photo Button */}
              <label className="p-3 bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0F2A4A] flex items-center justify-center mb-1">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upload Field Photos</span>
                <span className="text-[10px] text-slate-400">JPG, PNG up to 15MB</span>
              </label>

              {/* Attach Voice Note */}
              <button
                type="button"
                onClick={toggleGeneralRecording}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : audioBlobUrl
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-dashed border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">
                  {isRecording ? 'Recording...' : audioBlobUrl ? 'Voice Note Attached' : 'Record Voice Note'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {audioBlobUrl ? `${recordingSeconds}s recorded` : 'Live mic recording'}
                </span>
              </button>
            </div>

            {/* Attached Photo Chip */}
            {photos.length > 0 && (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={photos[0]}
                    alt="Pothole / Handpump preview"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-800">IMG_202609_001.jpg</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        GEO-TAG
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">1.8 MB • Geotagged • Verified</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotos([])}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Community Cluster Match Active Notice */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start space-x-2.5">
            <Layers className="w-5 h-5 text-[#0F2A4A] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Community Cluster Match Active</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                If other residents near Block A have already flagged this leak, GramSetu will automatically amalgamate these petitions into an escalated Priority Ticket.
              </p>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#0F2A4A] hover:bg-[#163861] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <span>Submit Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => alert('Draft saved locally in offline cache.')}
              className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Save as Draft</span>
            </button>
          </div>
        </form>

        {/* Footer info pills */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-[11px] text-slate-600">
          <div className="flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Citizen Privacy strictly protected under the <strong>State Citizen Grievance Redressal Act</strong>.</span>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>SLA Redressal Timeline</strong>: Mandated official ground inspection within 48 operational hours.</span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>Free automatic SMS tracking updates dispatched to your registered Aadhaar mobile number.</span>
          </div>
        </div>
      </div>

      {/* SIMILAR COMMUNITY ISSUE FOUND MODAL */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 font-bold">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                AI SIMILARITY DETECTION (94% MATCH)
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                SIMILAR COMMUNITY ISSUE FOUND
              </h3>
              <p className="text-sm font-bold text-[#0F2A4A] mt-1">
                {matchedClusterTitle || 'Village Handpump Not Working'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                <strong className="text-slate-800">17 citizens</strong> reported this issue
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  joinCluster('cluster-handpump-1', description);
                  setShowMatchModal(false);
                  setSelectedIssueId('#GS-1248');
                  setCitizenTab('activity');
                }}
                className="w-full py-2.5 bg-[#0F2A4A] hover:bg-[#183d6a] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                VIEW COMMUNITY ISSUE & ENDORSE
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMatchModal(false);
                  setSelectedIssueId(submittedIssueId);
                  setCitizenTab('activity');
                }}
                className="w-full py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg cursor-pointer"
              >
                CONTINUE AS SEPARATE REPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
