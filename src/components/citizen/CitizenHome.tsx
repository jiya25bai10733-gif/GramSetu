import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { playAudioWithFallback } from '../../utils/audioPlayback';
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

  // Real-time microphone and speech recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [volumeBars, setVolumeBars] = useState<number[]>([10, 15, 8, 18, 12]);
  const [micError, setMicError] = useState<string | null>(null);

  // Match screen state
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [createdIssueId, setCreatedIssueId] = useState<string | null>(null);
  const [matchedClusterTitle, setMatchedClusterTitle] = useState('');

  // Audio & speech recognition refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const previewPlaybackRef = useRef<{ stop: () => void } | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
      if (previewPlaybackRef.current) {
        previewPlaybackRef.current.stop();
        previewPlaybackRef.current = null;
      }
    };
  }, []);

  const stopAllMedia = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
    }
  };

  const startRealtimeRecording = async () => {
    setMicError(null);
    setLiveTranscript('');
    setFinalTranscript('');
    setHasRecordedAudio(false);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      // 1. Get real microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Set up Web Audio API Analyser for real-time visualizer
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
        const bars = [
          Math.max(6, Math.min(28, (dataArray[1] || 0) / 8)),
          Math.max(6, Math.min(32, (dataArray[3] || 0) / 7)),
          Math.max(6, Math.min(34, (dataArray[5] || 0) / 6)),
          Math.max(6, Math.min(30, (dataArray[7] || 0) / 7)),
          Math.max(6, Math.min(26, (dataArray[9] || 0) / 8))
        ];
        setVolumeBars(bars);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      // 3. Set up MediaRecorder for real audio capture
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
              setHasRecordedAudio(true);
            }
          };
          reader.readAsDataURL(audioBlob);
        }
      };

      mediaRecorder.start(200);

      // 4. Set up Web Speech API for real-time live transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setFinalTranscript(final);
          setLiveTranscript(interim || final);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning:', event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setIsRecording(true);

      // 5. Timer
      let sec = 0;
      timerIntervalRef.current = setInterval(() => {
        sec += 1;
        setRecordingSeconds(sec);
      }, 1000);

    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setMicError(
        err.name === 'NotAllowedError' 
          ? 'Microphone permission was denied. Please allow microphone access in your browser settings.'
          : 'Could not access microphone: ' + (err.message || 'Unknown error')
      );
      setIsRecording(false);
    }
  };

  const stopRealtimeRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Default fallback if microphone heard no spoken words
    setTimeout(() => {
      setLiveTranscript(prev => {
        const text = prev.trim() || finalTranscript.trim();
        return text || 'Recorded voice grievance from citizen in Ward 3.';
      });
      setHasRecordedAudio(true);
    }, 300);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRealtimeRecording();
    } else {
      startRealtimeRecording();
    }
  };

  const togglePlayAudio = () => {
    if (!audioBlobUrl) return;

    if (isPlayingAudio) {
      if (previewPlaybackRef.current) {
        previewPlaybackRef.current.stop();
        previewPlaybackRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      const fallbackText = liveTranscript || finalTranscript || 'आवाज़ रिकॉर्डिंग';
      previewPlaybackRef.current = playAudioWithFallback(
        audioBlobUrl,
        fallbackText,
        () => setIsPlayingAudio(true),
        () => {
          setIsPlayingAudio(false);
          previewPlaybackRef.current = null;
        }
      );
    }
  };

  const handleVoiceSubmit = () => {
    const textToSubmit = liveTranscript.trim() || finalTranscript.trim() || 'Recorded civic problem in Ward 3';

    // Auto-detect category from spoken words
    let cat = 'Water Supply & Sanitation';
    const lower = textToSubmit.toLowerCase();
    if (lower.includes('road') || lower.includes('pothole') || lower.includes('सड़क') || lower.includes('गड्ढा')) {
      cat = 'Roads & Surface Transit';
    } else if (lower.includes('bijli') || lower.includes('light') || lower.includes('power') || lower.includes('बिजली') || lower.includes('तार') || lower.includes('करंट')) {
      cat = 'Electricity & Power Grid';
    } else if (lower.includes('drain') || lower.includes('naali') || lower.includes('kachra') || lower.includes('नाली') || lower.includes('कचरा')) {
      cat = 'Sanitation & Drainage';
    }

    const result = submitNewIssue({
      title: textToSubmit.length > 50 ? textToSubmit.substring(0, 50) + '...' : textToSubmit,
      summary: textToSubmit,
      category: cat,
      locationName: 'Ward 3 • Rampur Gram Panchayat',
      panchayat: 'Rampur Panchayat',
      coordinates: [23.2045, 77.0812],
      voiceReport: {
        transcriptHindi: textToSubmit,
        transcriptEnglish: textToSubmit,
        dialect: 'Realtime Mic Capture Engine',
        duration: `00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 5}`,
        audioUrl: audioBlobUrl || undefined
      }
    });

    if (result.matchedCluster) {
      setCreatedIssueId(result.issue.id);
      setMatchedClusterTitle(result.matchedCluster.title);
      setShowClusterModal(true);
    } else {
      setSelectedIssueId(result.issue.id);
      setCitizenTab('activity');
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto">
      {/* Namaste Greeting Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Namaste, Ramesh</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                VERIFIED CITIZEN
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
              Ward 3 • Rampur, Sehore, MP
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
            <span className="text-slate-600 font-medium">Gram Panchayat Portal Active</span>
          </div>
          <span className="font-mono text-slate-700 font-bold">Token #MP-SEH-084</span>
        </div>
      </div>

      {/* SEVA SUVIDHA 24x7 - REAL-TIME VOICE REPORTING */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              SEVA SUVIDHA 24x7
            </span>
            <h2 className="text-base font-extrabold text-slate-900">REPORT A PROBLEM</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0F2A4A] text-[11px] font-bold border border-blue-200 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>AI Assisted</span>
          </span>
        </div>

        <div className="p-4">
          <p className="text-xs text-slate-600 mb-4">
            See something that needs municipal or panchayat attention? Speak directly into your microphone.
          </p>

          {/* Real-time Voice Assistant Box */}
          <div className="bg-gradient-to-b from-blue-50/70 to-slate-50 rounded-xl p-5 border border-blue-100 text-center">
            {/* Big Mic Button */}
            <div className="relative inline-block mb-3">
              {isRecording && (
                <div className="absolute -inset-3 rounded-full bg-red-400/40 animate-ping"></div>
              )}
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-lg transition-all cursor-pointer ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 scale-110 ring-4 ring-red-200' 
                    : 'bg-[#0F2A4A] hover:bg-[#183d6a] hover:scale-105'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>

            <p className="text-sm font-bold text-slate-800">
              {isRecording ? (
                <span className="text-red-600 flex items-center justify-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span>Listening... Bolte Rahiye ({formatSeconds(recordingSeconds)})</span>
                </span>
              ) : (
                'Tap to Speak'
              )}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isRecording ? 'Capturing live audio from your microphone' : 'Hindi, Malwi, Bundeli & English supported'}
            </p>

            {/* Mic Error Notice if permission denied */}
            {micError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-left flex items-start space-x-2">
                <VolumeX className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{micError}</span>
              </div>
            )}

            {/* Real-time Waveform & Live Interim Transcript while Recording */}
            {isRecording && (
              <div className="mt-4 bg-white rounded-xl p-3.5 border border-red-200 text-left shadow-2xs">
                <div className="flex items-center justify-between text-[11px] mb-2 text-red-600 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>Live Microphone Stream</span>
                  </span>
                  <span className="font-mono text-xs">{formatSeconds(recordingSeconds)}</span>
                </div>

                {/* Live Real-time Waveform */}
                <div className="flex items-center justify-center space-x-1.5 py-2">
                  {volumeBars.map((height, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-red-500 rounded-full transition-all duration-75"
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>

                {/* Live text transcript appearing in real time */}
                <div className="mt-2 min-h-[36px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  {liveTranscript ? (
                    <p className="font-semibold text-slate-900 leading-relaxed">
                      "{liveTranscript}"
                      <span className="inline-block w-1.5 h-3 bg-red-500 ml-1 animate-pulse"></span>
                    </p>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">
                      Listening... say e.g. "हैंडपंप से पानी नहीं आ रहा है" or "Road has deep pothole"...
                    </p>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={stopRealtimeRecording}
                    className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-xs"
                  >
                    Done Speaking (Stop)
                  </button>
                </div>
              </div>
            )}

            {/* Recorded Audio Result Box (ONLY shown after real recording completes!) */}
            {hasRecordedAudio && !isRecording && (
              <div className="mt-4 bg-white rounded-xl p-3.5 border border-slate-200 text-left shadow-2xs">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="flex items-center space-x-1.5 font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Real Microphone Recording</span>
                  </span>
                  <span className="font-mono text-slate-400">
                    {formatSeconds(recordingSeconds)}
                  </span>
                </div>

                {/* The real spoken transcript */}
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                    "{liveTranscript || finalTranscript}"
                  </p>
                </div>

                {/* Audio Playback of the actual microphone recording */}
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      className="w-8 h-8 rounded-full bg-[#0F2A4A] hover:bg-[#183d6a] flex items-center justify-center text-white cursor-pointer shadow-xs"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <span className="text-xs font-bold text-slate-700">
                      {isPlayingAudio ? 'Playing your voice recording...' : 'Play your voice recording'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={startRealtimeRecording}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                    title="Record again"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-record</span>
                  </button>
                </div>

                {/* Actions for the Real Recorded Voice */}
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  <button
                    type="button"
                    onClick={() => setCitizenTab('report')}
                    className="py-2 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleVoiceSubmit}
                    className="py-2 px-3 rounded-lg bg-[#0F2A4A] hover:bg-[#1a4474] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>Submit Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setCitizenTab('report')}
              className="text-xs font-semibold text-[#0F2A4A] hover:underline inline-flex items-center space-x-1 cursor-pointer"
            >
              <span>Or type your report manually</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MY CIVIC TRACKER - Ward 3 Overview */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            MY CIVIC TRACKER
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Ward 3 Overview</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">TOTAL FILED</span>
              <span className="text-2xl font-black text-slate-900">05</span>
            </div>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">RESOLVED</span>
              <span className="text-2xl font-black text-emerald-700">03</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide block">IN PROGRESS</span>
              <span className="text-2xl font-black text-[#0F2A4A]">01</span>
            </div>
            <Hourglass className="w-5 h-5 text-blue-600" />
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">PENDING REVIEW</span>
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
                COMMUNITY MAP
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">Live issues near your location • Rampur & Sehore</p>
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
                Street
              </button>
              <button
                type="button"
                onClick={() => setHomeMapLayer('satellite')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  homeMapLayer === 'satellite' ? 'bg-[#0F2A4A] text-white' : 'text-slate-600'
                }`}
              >
                Satellite
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
              <span>{isLocatingHomeGps ? 'Locating...' : 'GPS'}</span>
            </button>

            <button 
              onClick={() => setCitizenTab('map')}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              title="Expand full map"
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
                    <span>Your GPS</span>
                  </div>
                `,
                iconSize: [75, 20],
                iconAnchor: [37, 20]
              })}
            >
              <Popup>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Your Ground Location</span>
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
                    ⚠️ Handpump Issue
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
                <div className="text-xs font-bold">#GS-1248: Handpump Failure</div>
                <div className="text-[11px] text-slate-700 font-semibold mt-0.5">Ward 3 • Rampur Gram Panchayat</div>
                <div className="text-[10px] text-slate-500">17 citizens reported</div>
              </Popup>
            </Marker>

            {/* Sector 15 Pothole Pin */}
            <Marker
              position={[23.2018, 77.0895]}
              icon={L.divIcon({
                className: 'pothole-pin',
                html: `
                  <div style="background-color: #F59E0B; color: white; padding: 3px 6px; border-radius: 6px; font-weight: bold; font-size: 9px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1.5px solid white; white-space: nowrap;">
                    ⚠️ Pothole #1245
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
                <div className="text-xs font-bold">#GS-1245: Main Road Pothole</div>
                <div className="text-[11px] text-slate-700 font-semibold mt-0.5">Sector 15 Central Road • Sehore Town</div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* Floating Bottom Card */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between shadow-xs z-[500]">
            <span className="text-slate-700 font-semibold flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              Handpump failure at Ward 3 (500m)
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedIssueId('#GS-1248');
                setCitizenTab('activity');
              }}
              className="text-[11px] font-bold text-[#0F2A4A] hover:underline cursor-pointer"
            >
              Track Issue
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
            <span>Open Full Interactive Community Map</span>
          </button>
        </div>
      </div>

      {/* NEARBY COMMUNITY MATTERS - View All */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            NEARBY COMMUNITY MATTERS
          </h2>
          <button 
            onClick={() => setCitizenTab('activity')}
            className="text-[11px] font-bold text-[#0F2A4A] hover:underline cursor-pointer"
          >
            View All
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
                  <h3 className="text-xs font-bold text-slate-900">Broken Streetlight</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 text-slate-700">OPEN</span>
                </div>
                <p className="text-[11px] text-slate-500">Sector 12 Market Road</p>
                <p className="text-[10px] text-slate-400">Reported 2 hrs ago by Sanjay V.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedIssueId('#GS-1248');
                setCitizenTab('activity');
              }}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-[#0F2A4A] rounded-lg text-xs font-bold cursor-pointer"
            >
              Track
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
                  <h3 className="text-xs font-bold text-slate-900">Village Handpump</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">IN PROGRESS</span>
                </div>
                <p className="text-[11px] text-slate-500">Ward 3 Rampur</p>
                <p className="text-[10px] text-slate-400">Reported Yesterday • Assigned to PHED</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedIssueId('#GS-1248');
                setCitizenTab('activity');
              }}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-[#0F2A4A] rounded-lg text-xs font-bold cursor-pointer"
            >
              Track
            </button>
          </div>

          {/* Resolved Announcement */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 border-l-4 border-l-emerald-600">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Redressal Completed</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-snug">
              Panchayat sanitation vehicle cleared garbage accumulation at Galla Mandi crossing within 18h.
            </p>
            <p className="text-[10px] text-emerald-800 font-medium mt-1">
              Verified by Ward Member • 4h ago
            </p>
          </div>
        </div>
      </div>

      {/* SIMILAR COMMUNITY ISSUE FOUND MODAL (AI CONSOLIDATION FLOW) */}
      {showClusterModal && (
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
                <strong className="text-slate-800">17 citizens</strong> have already reported this issue near Ward 3.
              </p>
            </div>

            {/* Cluster Stats */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 grid grid-cols-3 gap-2 text-center mb-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">CITIZENS</span>
                <span className="text-sm font-extrabold text-slate-800">31</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">PHOTOS</span>
                <span className="text-sm font-extrabold text-slate-800">12</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">VOICE LOGS</span>
                <span className="text-sm font-extrabold text-slate-800">5</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-normal text-center">
              Joining this community cluster will combine your petition with your neighbors and increase the priority of repair!
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  joinCluster('cluster-handpump-1', liveTranscript);
                  setShowClusterModal(false);
                  setSelectedIssueId('#GS-1248');
                  setCitizenTab('activity');
                }}
                className="w-full py-2.5 bg-[#0F2A4A] hover:bg-[#183d6a] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                JOIN & ENDORSE COMMUNITY ISSUE
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowClusterModal(false);
                  setSelectedIssueId(createdIssueId);
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
