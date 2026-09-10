import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers, 
  Volume2, 
  Camera, 
  ChevronRight,
  Filter
} from 'lucide-react';

export const CitizenActivity: React.FC = () => {
  const { activities, setSelectedIssueId } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEW' | 'UPDATES' | 'RESOLVED'>('ALL');

  const filtered = activities.filter(act => {
    if (activeFilter === 'NEW') return act.type === 'NEW_REPORT';
    if (activeFilter === 'UPDATES') return act.type === 'UPDATE' || act.type === 'CONSOLIDATED' || act.type === 'ESCALATED';
    if (activeFilter === 'RESOLVED') return act.type === 'RESOLVED';
    return true;
  });

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24">
      {/* Activity Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Public Activity Stream</h1>
        <p className="text-xs text-slate-500 mt-0.5 leading-normal">
          Real-time, transparent log of community problem updates and redressals in Sehore Block.
        </p>

        {/* Filter Pills */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {(['ALL', 'NEW', 'UPDATES', 'RESOLVED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeFilter === tab
                  ? 'bg-[#0F2A4A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-2.5">
        {filtered.map(item => {
          const isResolved = item.type === 'RESOLVED';
          const isConsolidated = item.type === 'CONSOLIDATED';
          const isEscalated = item.type === 'ESCALATED';
          const isNew = item.type === 'NEW_REPORT';

          return (
            <div
              key={item.id}
              onClick={() => setSelectedIssueId(item.issueId)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isResolved ? 'bg-emerald-100 text-emerald-800' :
                    isConsolidated ? 'bg-amber-100 text-amber-800' :
                    isEscalated ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-[#0F2A4A]'
                  }`}>
                    {isResolved && <CheckCircle2 className="w-4 h-4" />}
                    {isConsolidated && <Layers className="w-4 h-4" />}
                    {isEscalated && <ArrowUpRight className="w-4 h-4" />}
                    {isNew && <Clock className="w-4 h-4" />}
                    {!isResolved && !isConsolidated && !isEscalated && !isNew && <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.location}</h3>
                    <span className="text-[10px] font-mono text-slate-400">Issue {item.issueId}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{item.timeAgo}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                <div className="flex items-center space-x-2">
                  <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                    isResolved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    isConsolidated ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    isEscalated ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    System Log [{item.type}]
                  </span>
                  {item.officerId && <span className="text-slate-400">Officer: {item.officerId}</span>}
                  {item.dialectEngine && <span className="text-slate-500">Dialect: {item.dialectEngine}</span>}
                </div>
                <span className="text-[#0F2A4A] font-bold flex items-center hover:underline">
                  Track <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
