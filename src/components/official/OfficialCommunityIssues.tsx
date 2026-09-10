import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  Sparkles, 
  Volume2, 
  Camera, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const OfficialCommunityIssues: React.FC = () => {
  const { clusters, setSelectedIssueId, setOfficialTab } = useApp();
  const [selectedCluster, setSelectedCluster] = useState(clusters[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVoice = (text: string) => {
    setIsPlaying(true);
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2A4A] to-[#1e4d82] text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                AI SIMILARITY DETECTION ENGINE
              </span>
              <span className="text-xs text-blue-200">Dialect Normalization Active</span>
            </div>
            <h1 className="text-2xl font-black mt-2 tracking-tight">
              Community Grievance Clusters
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl mt-1 leading-relaxed">
              GramSetu amalgamates disparate regional voice logs, citizen vernacular messages, and geotagged photographs into singular actionable work orders.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0">
            <span className="text-3xl font-black block text-amber-300">38%</span>
            <span className="text-[11px] text-blue-100 uppercase tracking-wider font-bold">
              Duplicate Work Orders Avoided
            </span>
          </div>
        </div>
      </div>

      {/* Cluster Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Clusters (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            ACTIVE COMMUNITY CLUSTERS ({clusters.length})
          </h2>

          {clusters.map(cl => (
            <div
              key={cl.id}
              onClick={() => setSelectedCluster(cl)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedCluster.id === cl.id
                  ? 'bg-white border-[#0F2A4A] shadow-md ring-2 ring-blue-100'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-blue-100 text-[#0F2A4A]">
                  {cl.category}
                </span>
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {cl.similarityScore}% Match
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {cl.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {cl.locationName}
              </p>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">REPORTS</span>
                  <span className="font-extrabold text-slate-800">{cl.reportsCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">AFFECTED</span>
                  <span className="font-extrabold text-slate-800">{cl.citizensAffected}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">VOICE LOGS</span>
                  <span className="font-extrabold text-slate-800">{cl.voiceReportsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail Pane (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                CLUSTER ID: {selectedCluster.id}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {selectedCluster.title}
              </h2>
              <p className="text-xs text-slate-500 flex items-center mt-0.5">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {selectedCluster.locationName}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedIssueId(selectedCluster.primaryIssueId);
                  setOfficialTab('issues');
                }}
                className="px-4 py-2 bg-[#0F2A4A] hover:bg-[#183d6a] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <span>Open Primary Work Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">CONFIDENCE</span>
              <span className="text-2xl font-black text-emerald-700 block mt-0.5">{selectedCluster.similarityScore}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">TOTAL REPORTS</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">{selectedCluster.reportsCount}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">PHOTOS MERGED</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">{selectedCluster.photosCount}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">DIALECT ENGINE</span>
              <span className="text-xs font-bold text-[#0F2A4A] block mt-2">{selectedCluster.dialectEngine}</span>
            </div>
          </div>

          {/* Consolidated Citizen Input Feed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                ORIGINAL INCOMING CITIZEN PETITIONS (DIALECT AMALGAMATION)
              </h3>
              <span className="text-xs text-slate-400 font-medium">Automatic deduplication</span>
            </div>

            <div className="space-y-2.5">
              {selectedCluster.sampleReports.map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                      {r.type === 'voice' ? <Volume2 className="w-4 h-4 text-blue-600" /> : r.type === 'photo' ? <Camera className="w-4 h-4 text-emerald-600" /> : <Users className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{r.citizen}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{r.time}</span>
                      </div>
                      <p className="italic text-slate-600 mt-0.5">"{r.text}"</p>
                    </div>
                  </div>

                  {r.type === 'voice' && (
                    <button
                      type="button"
                      onClick={() => playVoice(r.text)}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg font-bold text-[11px] text-[#0F2A4A] flex items-center space-x-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Play</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
