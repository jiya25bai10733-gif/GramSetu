import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowUpRight, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  Building2, 
  FileText,
  UserCheck
} from 'lucide-react';

export const OfficialEscalations: React.FC = () => {
  const { issues, escalateIssue, setSelectedIssueId, setOfficialTab } = useApp();
  const [selectedIssueIdToEscalate, setSelectedIssueIdToEscalate] = useState('');
  const [memoText, setMemoText] = useState('Ground inspection SLA lapsed beyond 48 hours without closure certificate.');

  const escalatedIssues = issues.filter(i => i.administrativeLevel !== 'Gram Panchayat' || i.slaBreached);

  const tiers = [
    { level: 'Gram Panchayat', time: '0 – 48 Hours', officer: 'Sarpanch / VDO / Local JE', role: 'Primary Field Assessment & Dispatch' },
    { level: 'Block Level', time: '48 – 96 Hours', officer: 'Block Administrator (Ramesh Sharma)', role: 'Multi-Panchayat Resource Marshalling' },
    { level: 'District Level', time: '96 – 168 Hours', officer: 'District Magistrate / Collector Cell', role: 'Executive Enforcement & Special Funding' },
    { level: 'State Oversight', time: '> 168 Hours', officer: 'Directorate of Panchayati Raj Bhopal', role: 'Statutory Administrative Inquest' }
  ];

  const handleEscalate = (id: string) => {
    escalateIssue(id, memoText);
    alert(`Administrative Escalation Memo generated for ${id}. Dispatched to next tier oversight.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Administrative Escalation & SLA Center
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Four-tier governance hierarchy enforcing prompt public grievance resolution.
        </p>
      </div>

      {/* 4-Tier Hierarchy Diagram */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
          ADMINISTRATIVE JURISDICTION PROGRESSION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border relative ${
                idx === 1
                  ? 'bg-blue-50/70 border-[#0F2A4A] ring-2 ring-blue-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  TIER 0{idx + 1}
                </span>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  {t.time}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900">{t.level}</h3>
              <p className="text-xs font-semibold text-[#0F2A4A] mt-1">{t.officer}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t.role}</p>

              {idx < 3 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-slate-300 rounded-full p-1 shadow-xs">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Escalated & SLA Breached List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              URGENT ESCALATIONS & OVERDUE GRIEVANCES
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800">
            {escalatedIssues.length} Matters Escalated
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {escalatedIssues.map(iss => (
            <div key={iss.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-extrabold text-[#0F2A4A] text-sm">{iss.token}</span>
                  <h3 className="text-sm font-bold text-slate-900">{iss.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-200">
                    {iss.administrativeLevel} Oversight
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl">{iss.summary}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                  <span>Panchayat: <strong>{iss.panchayat}</strong></span>
                  <span>Authority: <strong>{iss.currentAuthority}</strong></span>
                  {iss.slaBreachedTime && <span className="text-red-600 font-bold">• {iss.slaBreachedTime}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssueId(iss.id);
                    setOfficialTab('issues');
                  }}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  View Dossier
                </button>
                <button
                  type="button"
                  onClick={() => handleEscalate(iss.id)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-xs cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Escalate Further</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
