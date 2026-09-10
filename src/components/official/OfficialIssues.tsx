import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowUpRight,
  Droplet,
  Layers
} from 'lucide-react';
import { IssueStatus, IssuePriority } from '../../types';

export const OfficialIssues: React.FC = () => {
  const { issues, setSelectedIssueId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedPanchayat, setSelectedPanchayat] = useState<string>('ALL');

  const filteredIssues = issues.filter(iss => {
    const matchSearch = iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        iss.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        iss.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = selectedStatus === 'ALL' || iss.status === selectedStatus;
    const matchPriority = selectedPriority === 'ALL' || iss.priority === selectedPriority;
    const matchPanchayat = selectedPanchayat === 'ALL' || iss.panchayat.includes(selectedPanchayat);

    return matchSearch && matchStatus && matchPriority && matchPanchayat;
  });

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Civic Grievances</h1>
          <p className="text-xs text-slate-500">
            Administrative queue across 42 Panchayats of Sehore Jurisdiction
          </p>
        </div>
        <div className="text-xs text-slate-500 font-bold">
          Showing <span className="text-[#0F2A4A]">{filteredIssues.length}</span> of {issues.length} records
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by token (#1245), title, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-semibold focus:bg-white cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open / Pending</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Panchayat Filter */}
          <div>
            <select
              value={selectedPanchayat}
              onChange={(e) => setSelectedPanchayat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-semibold focus:bg-white cursor-pointer"
            >
              <option value="ALL">All Panchayats</option>
              <option value="Rampur">Rampur Panchayat</option>
              <option value="Bilkisganj">Bilkisganj Panchayat</option>
              <option value="Shyampur">Shyampur Panchayat</option>
              <option value="Doraha">Doraha Panchayat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">TOKEN</th>
                <th className="py-3 px-4">CIVIC DEFECT & SUMMARY</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">SLA DUE</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((iss) => {
                const isResolved = iss.status === 'RESOLVED' || iss.status === 'CLOSED';
                const isUrgent = iss.priority === 'URGENT' || iss.slaBreached;

                return (
                  <tr
                    key={iss.id}
                    onClick={() => setSelectedIssueId(iss.id)}
                    className="hover:bg-blue-50/40 transition-all cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F2A4A]">
                      {iss.token}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{iss.title}</div>
                      <div className="text-slate-500 text-[11px] truncate">{iss.summary}</div>
                      {iss.clusterMembersCount && (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-700 mt-0.5">
                          <Layers className="w-3 h-3 mr-1" />
                          Consolidated {iss.clusterMembersCount} petitions
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {iss.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="truncate max-w-[160px]">{iss.locationName}</div>
                      <div className="text-[10px] text-slate-400">{iss.panchayat}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : iss.status === 'IN PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {iss.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {iss.slaBreached ? (
                        <span className="text-red-600 font-bold text-[11px] flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Breached
                        </span>
                      ) : (
                        <span className="text-slate-700 font-mono text-[11px]">
                          {iss.slaRemainingHours}h
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssueId(iss.id);
                        }}
                        className="px-3 py-1 bg-white border border-slate-300 hover:border-[#0F2A4A] text-[#0F2A4A] rounded-lg font-bold text-xs cursor-pointer shadow-2xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
