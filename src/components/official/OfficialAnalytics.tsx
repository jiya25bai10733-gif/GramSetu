import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  SlidersHorizontal,
  Download
} from 'lucide-react';

export const OfficialAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Quarter 2 (FY 2026)');

  const categoryBreakdown = [
    { name: 'Water Supply & Sanitation', count: 488, pct: 38, color: 'bg-blue-600' },
    { name: 'Roads & Surface Transit', count: 346, pct: 27, color: 'bg-amber-500' },
    { name: 'Electricity & Power Grid', count: 270, pct: 21, color: 'bg-indigo-600' },
    { name: 'Sanitation & Drainage', count: 180, pct: 14, color: 'bg-emerald-600' }
  ];

  const villagePerformance = [
    { village: 'Rampur Panchayat', filed: 340, resolved: 280, rate: 82.3, avgHours: 32 },
    { village: 'Bilkisganj Substation', filed: 410, resolved: 310, rate: 75.6, avgHours: 44 },
    { village: 'Shyampur Tehsil', filed: 290, resolved: 220, rate: 75.8, avgHours: 38 },
    { village: 'Doraha Panchayat', filed: 244, resolved: 210, rate: 86.0, avgHours: 26 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Grievance Analytics & Redressal Intelligence
          </h1>
          <p className="text-xs text-slate-500">
            Administrative performance diagnostics and citizen sentiment clustering
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 cursor-pointer shadow-2xs"
          >
            <option>Quarter 2 (FY 2026)</option>
            <option>Past 30 Days</option>
            <option>Past 7 Days</option>
            <option>Annual FY 2025-26</option>
          </select>

          <button
            type="button"
            onClick={() => alert('Exporting Analytics Dossier CSV...')}
            className="px-3 py-1.5 bg-[#0F2A4A] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            AVERAGE RESOLUTION TIME
          </span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">34.8 hrs</span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↓ 14% improvement</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            CONSOLIDATION EFFICIENCY
          </span>
          <span className="text-3xl font-black text-[#0F2A4A] mt-1 block">38.2%</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Duplicate petitions saved</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            SLA COMPLIANCE RATE
          </span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">86.4%</span>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">Within 48h mandate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            DIALECT ACCURACY (VOICE)
          </span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">96.8%</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Hindi / Malwi / Bundeli</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            GRIEVANCES BY INFRASTRUCTURE CATEGORY
          </h2>

          <div className="space-y-3">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{cat.name}</span>
                  <span className="font-mono text-slate-500">{cat.count} ({cat.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Village Redressal Heat Table (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            PANCHAYAT PERFORMANCE SCORECARD
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2">PANCHAYAT</th>
                  <th className="py-2">FILED</th>
                  <th className="py-2">RESOLVED</th>
                  <th className="py-2">RATE</th>
                  <th className="py-2">AVG TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {villagePerformance.map((vp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">{vp.village}</td>
                    <td className="py-2.5">{vp.filed}</td>
                    <td className="py-2.5 text-emerald-600 font-bold">{vp.resolved}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                        {vp.rate}%
                      </span>
                    </td>
                    <td className="py-2.5 font-mono">{vp.avgHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
