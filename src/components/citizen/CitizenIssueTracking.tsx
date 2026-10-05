import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { playAudioWithFallback } from '../../utils/audioPlayback';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Play, 
  Pause, 
  ThumbsUp, 
  Share2, 
  ShieldCheck, 
  ChevronRight, 
  UserCheck, 
  Check 
} from 'lucide-react';

export const CitizenIssueTracking: React.FC<{ issueId: string; onBack: () => void }> = ({ issueId, onBack }) => {
  const { issues, upvoteIssue, language } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasConfirmedResolution, setHasConfirmedResolution] = useState(false);

  const issue = issues.find(i => i.id === issueId || i.token === issueId) || issues[0];
  const playbackControllerRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => {
      if (playbackControllerRef.current) {
        playbackControllerRef.current.stop();
        playbackControllerRef.current = null;
      }
    };
  }, [issue]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (playbackControllerRef.current) {
        playbackControllerRef.current.stop();
        playbackControllerRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }

    const fallbackText = issue.voiceReport?.transcriptHindi || issue.title || 'शिकायत का विवरण दर्ज किया गया है।';

    const effectiveUrl = (issue.voiceReport?.audioUrl && !issue.voiceReport.audioUrl.startsWith('data:audio/mp3;base64,//Nkx'))
      ? issue.voiceReport.audioUrl
      : undefined;

    playbackControllerRef.current = playAudioWithFallback(
      effectiveUrl,
      fallbackText,
      () => setIsPlayingAudio(true),
      () => {
        setIsPlayingAudio(false);
        playbackControllerRef.current = null;
      }
    );
  };

  const steps = [
    { 
      key: 'OPEN', 
      label: language === 'hi' ? 'शिकायत दर्ज की गई' : 'Report Submitted', 
      desc: language === 'hi' ? 'ग्रामसेतु नागरिक इंजन द्वारा सत्यापित' : 'Verified by GramSetu Citizen Engine', 
      completed: true 
    },
    { 
      key: 'VERIFIED', 
      label: language === 'hi' ? 'ग्राम पंचायत द्वारा सत्यापित' : 'Verified by Gram Panchayat', 
      desc: language === 'hi' ? 'भू-टैग व स्थानिक डुप्लिकेट जांच पूर्ण' : 'Geotag & spatial duplicate check passed', 
      completed: true 
    },
    { 
      key: 'ASSIGNED', 
      label: language === 'hi' ? 'विभाग को सौंपा गया' : 'Assigned to Department', 
      desc: issue.assignedOfficer 
        ? `${issue.assignedOfficer.department} (${issue.assignedOfficer.name})` 
        : (language === 'hi' ? 'अधिकारी आवंटन प्रतीक्षारत' : 'Awaiting officer dispatch'), 
      completed: issue.status !== 'OPEN' 
    },
    { 
      key: 'IN PROGRESS', 
      label: language === 'hi' ? 'प्रगति पर / टीम रवाना' : 'In Progress / Crew Dispatched', 
      desc: language === 'hi' ? 'स्थल पर मरम्मत कार्य शुरू हो गया है' : 'Field repair work commenced on site', 
      completed: issue.status === 'IN PROGRESS' || issue.status === 'REPAIR SCHEDULED' || issue.status === 'RESOLVED' || issue.status === 'CLOSED' 
    },
    { 
      key: 'REPAIR SCHEDULED', 
      label: language === 'hi' ? 'मरम्मत निर्धारित व गुणवत्ता जांच' : 'Repair Scheduled & Quality Check', 
      desc: language === 'hi' ? 'सामग्री वितरण एवं रखरखाव निरीक्षण' : 'Civil parts delivery & maintenance inspection', 
      completed: issue.status === 'REPAIR SCHEDULED' || issue.status === 'RESOLVED' || issue.status === 'CLOSED' 
    },
    { 
      key: 'RESOLVED', 
      label: language === 'hi' ? 'समाधान पूर्ण एवं सत्यापित' : 'Resolved & Citizen Verified', 
      desc: issue.resolutionDetails?.notes || (language === 'hi' ? 'फोटो प्रमाण के साथ स्थल सत्यापन पूर्ण' : 'Ground verification completed with photographic evidence'), 
      completed: issue.status === 'RESOLVED' || issue.status === 'CLOSED' 
    }
  ];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">
              {language === 'hi' ? 'शिकायत ट्रैकिंग' : 'Issue Tracking'}
            </h1>
            <span className="text-[10px] font-mono text-slate-500">{issue.id}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => upvoteIssue(issue.id)}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0F2A4A] hover:bg-blue-100 text-xs font-bold flex items-center space-x-1 cursor-pointer"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{issue.upvotes}</span>
          </button>
        </div>
      </div>

      {/* Primary Issue Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900">
              {issue.category}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-1.5 leading-snug">
              {issue.title}
            </h2>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
            issue.status === 'RESOLVED' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : issue.status === 'IN PROGRESS'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {issue.status === 'RESOLVED' ? (language === 'hi' ? 'समाधान हुआ' : 'RESOLVED') : issue.status === 'IN PROGRESS' ? (language === 'hi' ? 'प्रगति पर' : 'IN PROGRESS') : (language === 'hi' ? 'लंबित' : 'OPEN')}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {issue.summary}
        </p>

        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{issue.locationName}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {language === 'hi' ? `SLA: ${issue.slaRemainingHours} घंटे शेष` : `SLA: ${issue.slaRemainingHours}h remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Transcript & Evidence */}
      {issue.voiceReport && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
              <span>
                {language === 'hi' ? `वॉइस रिपोर्ट (${issue.voiceReport.dialect})` : `Voice Report (${issue.voiceReport.dialect})`}
              </span>
              {issue.voiceReport.audioUrl && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                  {language === 'hi' ? '🎙️ सहेजा गया ऑडियो' : '🎙️ Saved Audio'}
                </span>
              )}
            </span>
            <div className="flex items-center space-x-2">
              {isPlayingAudio && (
                <div className="flex items-center space-x-1 text-red-600 font-bold text-[10px]">
                  <span className="w-1 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="w-1 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
              )}
              <button
                type="button"
                onClick={toggleAudio}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-[#0F2A4A] hover:bg-blue-100'
                }`}
                title="Play recorded voice audio"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5 text-red-600" /> : <Play className="w-3.5 h-3.5 text-[#0F2A4A]" />}
                <span>
                  {isPlayingAudio 
                    ? (language === 'hi' ? 'रोकें' : 'Pause') 
                    : (language === 'hi' ? 'ऑडियो सुनें' : 'Play Audio')}
                </span>
              </button>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
            <p className="font-semibold text-slate-900">"{issue.voiceReport.transcriptHindi}"</p>
            <p className="italic text-slate-500 mt-1">"{issue.voiceReport.transcriptEnglish}"</p>
          </div>
        </div>
      )}

      {/* Photos attached */}
      {issue.photos.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 mb-2">
            {language === 'hi' ? 'तस्वीर साक्ष्य (फ़ोटो)' : 'Photographic Evidence'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {issue.photos.map((p, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden h-28 border border-slate-200">
                <img src={p} alt="Evidence" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  {language === 'hi' ? 'भू-टैग' : 'Geotagged'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assigned Officer Contact Card */}
      {issue.assignedOfficer && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            {language === 'hi' ? 'नियुक्त नोडल अधिकारी' : 'ASSIGNED NODAL OFFICER'}
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F2A4A] font-bold flex items-center justify-center">
                {issue.assignedOfficer.name.substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{issue.assignedOfficer.name}</h4>
                <p className="text-[11px] text-slate-500">{issue.assignedOfficer.role} • {issue.assignedOfficer.unit}</p>
              </div>
            </div>
            <a
              href={`tel:${issue.assignedOfficer.phone}`}
              className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Resolution Stepper Timeline */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
          {language === 'hi' ? 'समाधान समयरेखा एवं विवरण' : 'Resolution Timeline & Logistics'}
        </h3>

        <div className="space-y-4 relative pl-6 border-l-2 border-slate-200 ml-3">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Node dot */}
              <div className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                step.completed ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-500'
              }`}>
                {step.completed ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </div>

              <div>
                <span className={`text-xs font-bold block ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Citizen Verification Confirmation */}
        {issue.status === 'RESOLVED' && (
          <div className="mt-5 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <h4 className="text-xs font-bold text-emerald-900">
              {language === 'hi' ? 'वार्ड समाधान सत्यापन' : 'Ward Redressal Verification'}
            </h4>
            <p className="text-xs text-slate-700 mt-1">
              {language === 'hi' 
                ? 'कर्मचारी ने मरम्मत कार्य पूरा कर लिया है। क्या आप समाधान से संतुष्ट हैं?' 
                : 'Field technician has completed the repair. Are you satisfied with the water supply flow?'}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setHasConfirmedResolution(true)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hasConfirmedResolution ? 'bg-emerald-700 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {hasConfirmedResolution 
                  ? (language === 'hi' ? '✓ आपके द्वारा सत्यापित' : '✓ Verified by You') 
                  : (language === 'hi' ? 'समाधान की पुष्टि करें' : 'Confirm Resolution')}
              </button>
              <button
                type="button"
                onClick={() => alert(language === 'hi' ? 'पुनः खोलने का अनुरोध जिला निगरानी सेल को भेजा गया।' : 'Re-open request submitted to District Oversight Cell.')}
                className="py-1.5 px-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {language === 'hi' ? 'पुनः खोलें' : 'Re-open'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
