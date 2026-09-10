import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, 
  Info, 
  AlertTriangle, 
  ArrowUpRight, 
  PlusCircle, 
  RotateCw, 
  ShieldCheck, 
  Volume2, 
  ExternalLink,
  MapPin,
  FileText
} from 'lucide-react';

export const OfficialActivity: React.FC = () => {
  const { activities, setSelectedIssueId, setOfficialTab } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'UPDATES' | 'ESCALATIONS' | 'RESOLVED'>('ALL');
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const filtered = activities.filter(act => {
    if (filter === 'NEW') return act.type === 'NEW_REPORT';
    if (filter === 'UPDATES') return act.type === 'UPDATE';
    if (filter === 'ESCALATIONS') return act.type === 'ESCALATED';
    if (filter === 'RESOLVED') return act.type === 'RESOLVED';
    return true;
  });

  const playVoiceSample = () => {
    setIsPlayingSample(!isPlayingSample);
    if (!isPlayingSample && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('हमारे गांव का हैंडपंप तीन दिन से खराब है, पानी नहीं आ रहा');
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlayingSample(false);
      window.speechSynthesis.speak(utterance);
    } else if (isPlayingSample && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Status Strip matching 5.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-extrabold text-slate-800 tracking-wide uppercase text-[11px]">
            SEHORE BLOCK JURISDICTION • FEED LIVE
          </span>
        </div>

        <div className="flex items-center space-x-4 text-slate-500 text-xs font-semibold">
          <span>AUTO-REFRESH: 15s</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1 hover:text-slate-800 cursor-pointer font-bold"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>SYNC LOGS</span>
          </button>
        </div>
      </div>

      {/* Main Header & Audit Stream #SHR-2026 matching 5.png */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            LIVE OFFICIAL ACTIVITY
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
            A real-time, transparent log of all reported infrastructure problems, officer assignments, and administrative resolution updates across Sehore jurisdiction.
          </p>
        </div>

        <div className="shrink-0">
          <span className="px-3 py-1 rounded bg-blue-100/70 text-[#0F2A4A] text-xs font-bold font-mono tracking-wider">
            AUDIT STREAM #SHR-2026
          </span>
        </div>
      </div>

      {/* Filter Buttons matching 5.png */}
      <div className="flex gap-2 flex-wrap text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 font-bold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-[#0F2A4A] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ALL ACTIONS
        </button>
        <button
          onClick={() => setFilter('NEW')}
          className={`px-4 py-2 font-bold transition-all cursor-pointer ${
            filter === 'NEW'
              ? 'bg-[#0F2A4A] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          NEW REPORTS
        </button>
        <button
          onClick={() => setFilter('UPDATES')}
          className={`px-4 py-2 font-bold transition-all cursor-pointer ${
            filter === 'UPDATES'
              ? 'bg-[#0F2A4A] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          UPDATES
        </button>
        <button
          onClick={() => setFilter('ESCALATIONS')}
          className={`px-4 py-2 font-bold transition-all cursor-pointer ${
            filter === 'ESCALATIONS'
              ? 'bg-[#0F2A4A] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ESCALATIONS
        </button>
        <button
          onClick={() => setFilter('RESOLVED')}
          className={`px-4 py-2 font-bold transition-all cursor-pointer ${
            filter === 'RESOLVED'
              ? 'bg-[#0F2A4A] text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          RESOLVED
        </button>
      </div>

      {/* Metric 4-Tile Strip matching 5.png */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            RESOLVED TODAY
          </span>
          <span className="text-4xl font-black text-slate-900 mt-1 block">38</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            IN PROGRESS
          </span>
          <span className="text-4xl font-black text-slate-900 mt-1 block">14</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            VOICE LOGS MERGED
          </span>
          <span className="text-4xl font-black text-slate-900 mt-1 block">62</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            SLA BREACHES
          </span>
          <span className="text-4xl font-black text-red-600 mt-1 block">01</span>
        </div>
      </div>

      {/* Activity Log Feed Cards matching 5.png */}
      <div className="space-y-4">
        {filtered.map(item => {
          return (
            <div
              key={item.id}
              className="bg-white p-5 border border-slate-200 shadow-2xs flex items-start space-x-4"
            >
              {/* Icon Box */}
              <div className="shrink-0 mt-0.5">
                {item.type === 'RESOLVED' && (
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-800">
                    <Check className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'UPDATE' && (
                  <div className="w-10 h-10 bg-blue-50 flex items-center justify-center text-blue-800">
                    <Info className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'CONSOLIDATED' && (
                  <div className="w-10 h-10 bg-amber-50 flex items-center justify-center text-amber-800">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'ESCALATED' && (
                  <div className="w-10 h-10 bg-red-50 flex items-center justify-center text-red-600">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'NEW_REPORT' && (
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-700">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{item.location}</h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {item.timeAgo}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {item.description}
                </p>

                {/* Sub-strip with tags matching 5.png */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className={`px-2.5 py-0.5 text-[11px] font-mono font-bold ${
                    item.type === 'RESOLVED' ? 'bg-blue-100/70 text-[#0F2A4A]' :
                    item.type === 'UPDATE' ? 'bg-blue-100/70 text-[#0F2A4A]' :
                    item.type === 'CONSOLIDATED' ? 'bg-amber-200/80 text-amber-900' :
                    item.type === 'ESCALATED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100/70 text-[#0F2A4A]'
                  }`}>
                    System Log [{item.type}]
                  </span>

                  {item.officerId && (
                    <span className="text-slate-600 font-medium">
                      Officer ID: <strong className="text-slate-800">{item.officerId}</strong>
                    </span>
                  )}

                  {item.hasPhotoProof && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIssueId('#GS-1248');
                        setOfficialTab('issues');
                      }}
                      className="text-slate-800 hover:underline font-medium cursor-pointer"
                    >
                      • View Citizen Verification Photo
                    </button>
                  )}

                  {item.estimatedResolution && (
                    <span className="text-slate-600 font-medium">
                      Estimated Resolution: {item.estimatedResolution}
                    </span>
                  )}

                  {item.type === 'UPDATE' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIssueId(item.issueId);
                        setOfficialTab('issues');
                      }}
                      className="text-slate-800 hover:underline font-medium cursor-pointer"
                    >
                      • Dispatch Route Map
                    </button>
                  )}

                  {item.dialectEngine && (
                    <span className="text-slate-600 font-medium">
                      Dialect: {item.dialectEngine}
                    </span>
                  )}

                  {item.hasAudioSample && (
                    <button
                      type="button"
                      onClick={playVoiceSample}
                      className="text-slate-800 hover:underline font-medium cursor-pointer flex items-center space-x-1"
                    >
                      <span>• Listen to Audio Sample</span>
                      <Volume2 className="w-3 h-3 text-[#0F2A4A]" />
                    </button>
                  )}

                  {item.notes && (
                    <span className="text-slate-600 font-medium">{item.notes}</span>
                  )}

                  {item.memoRef && (
                    <span className="text-red-700 font-bold">
                      • {item.memoRef}
                    </span>
                  )}

                  {item.channel && (
                    <span className="text-slate-600 font-medium">
                      Channel: {item.channel}
                    </span>
                  )}

                  {item.type === 'NEW_REPORT' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIssueId('#GS-1251');
                        setOfficialTab('issues');
                      }}
                      className="text-slate-800 hover:underline font-medium cursor-pointer"
                    >
                      • Inspect Audio Transcript
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Immutable Blockchain Anchor Footer matching 5.png */}
      <div className="p-4 bg-slate-100 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between text-slate-600 gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Immutable blockchain-anchored ledger of Gram Panchayat public complaints.</span>
        </div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
          NODE SHR-04 • 100% UPTIME
        </span>
      </div>
    </div>
  );
};
