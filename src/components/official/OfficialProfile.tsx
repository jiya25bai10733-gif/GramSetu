import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Mail, 
  Building2, 
  MapPin, 
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const OfficialProfile: React.FC = () => {
  const { setSelectedIssueId, setOfficialTab } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols) matching screen.png */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Avatar & Title */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Ramesh Sharma"
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 mx-auto shadow-xs"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <h2 className="text-lg font-black text-slate-900 mt-3">Ramesh Sharma</h2>
            <p className="text-xs text-slate-500">Block Administrator • Sehore District</p>

            <div className="mt-2 inline-block px-3 py-1 rounded bg-blue-100/70 text-[#0F2A4A] text-xs font-mono font-bold">
              OFFICER ID: #MP-SEH-0402
            </div>
          </div>

          {/* Assigned & Resolved Tiles */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-3xl font-black text-slate-900 block">38</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                ASSIGNED
              </span>
            </div>
            <div className="text-center p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-3xl font-black text-emerald-600 block">24</span>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                RESOLVED
              </span>
            </div>
          </div>

          {/* Official Credentials */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              OFFICIAL CREDENTIALS
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Department</span>
              <span className="font-bold text-slate-800 text-right">Rural Dev & Panchayati Raj</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jurisdiction</span>
              <span className="font-bold text-slate-800 text-right">Sehore (42 Panchayats)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Official Email</span>
              <span className="font-mono text-slate-800 text-right text-[11px]">ramesh.sharma@mp.gov.in</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sub-Division</span>
              <span className="font-bold text-slate-800 text-right">Madhya Kshetra Central</span>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              NOTIFICATION PREFERENCES
            </h3>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>Status Alerts on Grievance Updates</span>
            </label>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>Escalation Alerts (SLA Breaches)</span>
            </label>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>High-Priority Incident Warnings</span>
            </label>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>Weekly Administrative Digests</span>
            </label>
          </div>

          {/* Footer badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
              NIC Verified Officer
            </span>
            <button className="font-bold text-[#0F2A4A] hover:underline cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Column (8 cols): Assigned Jurisdiction Issues matching screen.png */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                MY ASSIGNED JURISDICTION ISSUES
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and trace active progress details for specific community complaints logged under your block oversight.
              </p>
            </div>

            {/* Filter Tabs matching screen.png */}
            <div className="inline-flex border border-slate-300 rounded-lg text-xs font-bold divide-x divide-slate-300 overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 cursor-pointer ${filter === 'all' ? 'bg-blue-100 text-[#0F2A4A]' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                All (38)
              </button>
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 cursor-pointer ${filter === 'active' ? 'bg-blue-100 text-[#0F2A4A]' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                Active (14)
              </button>
              <button
                type="button"
                onClick={() => setFilter('resolved')}
                className={`px-3 py-1.5 cursor-pointer ${filter === 'resolved' ? 'bg-blue-100 text-[#0F2A4A]' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                Resolved (24)
              </button>
            </div>
          </div>

          {/* Cards matching screen.png */}
          <div className="space-y-4">
            {/* Card 1: Village Handpump */}
            <div className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    W
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">VILLAGE HANDPUMP NOT WORKING</h3>
                      <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-red-100 text-red-800">
                        URGENT
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ward 3 • Rampur | Category: Water Supply & Sanitation
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      Tracking Token ID: <strong>#1248</strong> • Officer in Charge: <strong>Ramesh Sharma</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Reported: June 18, 2026</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssueId('#GS-1248');
                      setOfficialTab('issues');
                    }}
                    className="mt-2 px-4 py-1 border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50 text-xs font-bold rounded cursor-pointer"
                  >
                    OPEN
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center text-amber-700 font-bold">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Redressal SLA: 24h Remaining
                </span>
                <span>Last Inspection: Field Technician Dispatched (2 hrs ago)</span>
              </div>
            </div>

            {/* Card 2: Large Pothole */}
            <div className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    R
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">LARGE POTHOLE</h3>
                      <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                        ROADS CELL
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Sector 15 Central Road • Sehore Town | Category: Roads & Public Works
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      Tracking Token ID: <strong>#1245</strong> • Field Contractor: <strong>PWD Div 2</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Reported: June 21, 2026</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssueId('#GS-1245');
                      setOfficialTab('issues');
                    }}
                    className="mt-2 px-4 py-1 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded cursor-pointer"
                  >
                    PENDING
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Material Allocation in Progress</span>
                <span>Citizen Follow-ups: 6 Endorsements</span>
              </div>
            </div>

            {/* Card 3: Burnt Distribution Transformer */}
            <div className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    E
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">BURNT DISTRIBUTION TRANSFORMER</h3>
                      <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-blue-100 text-[#0F2A4A]">
                        VERIFIED CLOSED
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Bilkisganj Feeder #4 | Category: Electricity & Power Grid
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      Tracking Token ID: <strong>#1244</strong> • Resolved by: <strong>MPPKVVCL Junior Eng.</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Reported: June 10, 2026</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssueId('#GS-1244');
                      setOfficialTab('issues');
                    }}
                    className="mt-2 px-4 py-1 bg-[#0F2A4A] text-white text-xs font-bold rounded cursor-pointer"
                  >
                    RESOLVED
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-emerald-700 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Replacement unit 63kVA commissioned & verified
                </span>
                <span>Signed off on: June 12, 2026</span>
              </div>
            </div>

            {/* Card 4: Damaged Irrigation Canal Sluice */}
            <div className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    I
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">DAMAGED IRRIGATION CANAL SLUICE</h3>
                      <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase bg-cyan-100 text-cyan-900">
                        WATER RESOURCE
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Rehti Minor Canal Ch. 12+400 • Shyampur | Category: Irrigation Infrastructure
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      Tracking Token ID: <strong>#1239</strong> • Site Inspector: <strong>SDO Irrigation</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Reported: June 05, 2026</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssueId('#GS-1239');
                      setOfficialTab('issues');
                    }}
                    className="mt-2 px-4 py-1 border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50 text-xs font-bold rounded cursor-pointer"
                  >
                    OPEN
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Work Order Issued to M/s Bundelkhand Earthworks</span>
                <span>Gram Panchayat: Shyampur Kalan</span>
              </div>
            </div>
          </div>

          {/* Pagination Footer matching screen.png */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <span>Showing 1-4 of 38 assigned administrative grievances</span>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 border border-slate-300 rounded font-bold hover:bg-slate-50">
                PREV
              </button>
              <button className="px-3 py-1 bg-[#0F2A4A] text-white rounded font-bold">
                1
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded font-bold hover:bg-slate-50">
                2
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded font-bold hover:bg-slate-50">
                3
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded font-bold hover:bg-slate-50">
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
