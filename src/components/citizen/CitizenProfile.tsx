import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageSquare, 
  SlidersHorizontal, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Edit3, 
  LogOut, 
  Droplet, 
  Wrench, 
  Home, 
  Lightbulb, 
  PhoneCall, 
  BellRing
} from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const { issues, setSelectedIssueId, setCitizenTab, logout, language, setLanguage, login } = useApp();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [clusterAlerts, setClusterAlerts] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredIssues = issues.filter(iss => {
    if (filterType === 'open') return iss.status !== 'RESOLVED' && iss.status !== 'CLOSED';
    if (filterType === 'resolved') return iss.status === 'RESOLVED' || iss.status === 'CLOSED';
    return true;
  });

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24">
      {/* Citizen ID Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-[#0F2A4A] text-white font-extrabold text-lg flex items-center justify-center border-2 border-white shadow-md">
                RK
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base font-extrabold text-slate-900">Ramesh Kumar</h1>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Rampur Resident • Ward 3, Sehore
              </p>
              <div className="inline-flex items-center mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#0F2A4A] text-[10px] font-bold border border-blue-200">
                <span>ID: #CIT-SEH-402</span>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                REPORTED
              </span>
              <span className="text-2xl font-black text-slate-900">4</span>
              <span className="text-[10px] text-slate-400 block">Logged grievances</span>
            </div>
            <BellRing className="w-5 h-5 text-slate-400" />
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
                RESOLVED
              </span>
              <span className="text-2xl font-black text-emerald-700">2</span>
              <span className="text-[10px] text-emerald-600 block">Completed 100%</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Communication & Alerts Accordion */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0F2A4A]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Communication & Alerts
            </h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active
          </span>
        </div>

        <label className="flex items-start justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">SMS Status Alerts</span>
              <span className="text-[10px] text-slate-500">Dispatch updates to +91 98765-XXXXX</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={smsAlerts}
            onChange={(e) => setSmsAlerts(e.target.checked)}
            className="w-4 h-4 rounded text-[#0F2A4A] focus:ring-[#0F2A4A] mt-1"
          />
        </label>

        <label className="flex items-start justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">WhatsApp Resolution Updates</span>
              <span className="text-[10px] text-slate-500">Instant audio & photo proofs</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={whatsappAlerts}
            onChange={(e) => setWhatsappAlerts(e.target.checked)}
            className="w-4 h-4 rounded text-[#0F2A4A] focus:ring-[#0F2A4A] mt-1"
          />
        </label>

        <label className="flex items-start justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Community Cluster Alerts</span>
              <span className="text-[10px] text-slate-500">Ward 3 panchayat public notices</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={clusterAlerts}
            onChange={(e) => setClusterAlerts(e.target.checked)}
            className="w-4 h-4 rounded text-[#0F2A4A] focus:ring-[#0F2A4A] mt-1"
          />
        </label>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Interface Dialect</span>
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                language === 'hi' ? 'bg-white text-[#0F2A4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                language === 'en' ? 'bg-white text-[#0F2A4A] shadow-xs' : 'text-slate-600'
              }`}
            >
              ENG
            </button>
          </div>
        </div>
      </div>

      {/* GRAM PANCHAYAT HELPLINE CARD */}
      <div className="bg-[#0F2A4A] text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-28 h-28 bg-white/5 rounded-full -mr-6 -mb-6 pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  GRAM PANCHAYAT HELPLINE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white">
                  Active 24/7
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Toll Free 1800-233-0450
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Immediate assistance for water, roads, & civic safety
              </p>
            </div>
          </div>
          <a
            href="tel:18002330450"
            className="w-10 h-10 rounded-full bg-white text-[#0F2A4A] flex items-center justify-center hover:bg-amber-400 transition-all shadow-md shrink-0"
          >
            <PhoneCall className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* MY REPORTED ISSUES LIST */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-3 bg-[#0F2A4A] rounded-full"></span>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                MY REPORTED ISSUES
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Review and trace active progress details for complaints logged by your account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFilterType(filterType === 'all' ? 'open' : filterType === 'open' ? 'resolved' : 'all')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center space-x-1 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="capitalize">{filterType}</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Issue 1: Handpump */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F2A4A] flex items-center justify-center shrink-0 mt-0.5">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-900">VILLAGE HANDPUMP NOT WORKING</h3>
                    <span className="px-2 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-800">
                      OPEN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Ward 3 Rampur | Water Supply</p>
                  <p className="text-[10px] text-slate-400 font-mono">Token: #GS-1248</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
              <span className="text-[11px] text-slate-500 flex items-center">
                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                Logged 4h ago
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedIssueId('#GS-1248');
                  setCitizenTab('activity');
                }}
                className="px-3 py-1 bg-[#0F2A4A] text-white hover:bg-[#183d6a] rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>TRACK</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Issue 2: Pothole */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-900">LARGE POTHOLE NEAR SCHOOL</h3>
                    <span className="px-2 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800">
                      IN PROGRESS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Sector 15 Central Road | Roads</p>
                  <p className="text-[10px] text-slate-400 font-mono">Token: #GS-1245</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-[#0F2A4A] h-full w-2/3"></div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
              <span className="text-[11px] text-slate-600 font-medium">
                Work Order Issued
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedIssueId('#GS-1245');
                  setCitizenTab('activity');
                }}
                className="px-3 py-1 bg-[#0F2A4A] text-white hover:bg-[#183d6a] rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>TRACK</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Issue 3: Damaged Drainage */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-900">DAMAGED DRAINAGE SLUICE</h3>
                    <span className="px-2 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
                      RESOLVED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Mathura Road Market | Sanitation</p>
                  <p className="text-[10px] text-slate-400 font-mono">Token: #GS-1244</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified by Ward Overseer
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedIssueId('#GS-1244');
                  setCitizenTab('activity');
                }}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0F2A4A] rounded-lg text-xs font-bold cursor-pointer"
              >
                VIEW SUMMARY
              </button>
            </div>
          </div>

          {/* Issue 4: Streetlight */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-900">BROKEN STREETLIGHT POLE</h3>
                    <span className="px-2 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
                      RESOLVED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Main Chowk | Utilities</p>
                  <p className="text-[10px] text-slate-400 font-mono">Token: #GS-1239</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified by Ward Overseer
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedIssueId('#GS-1239');
                  setCitizenTab('activity');
                }}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0F2A4A] rounded-lg text-xs font-bold cursor-pointer"
              >
                VIEW SUMMARY
              </button>
            </div>
          </div>
        </div>

        {/* Sync stamp */}
        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400">Showing 4 of 4 complaints</p>
          <div className="mt-2 py-1.5 px-3 bg-blue-50/50 rounded-lg border border-blue-100 inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Records Synced</span>
          </div>
        </div>
      </div>

      {/* Switch to Official Portal & Logout */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={() => login('official')}
          className="text-xs font-bold text-[#0F2A4A] hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>Switch to Official View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={logout}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
