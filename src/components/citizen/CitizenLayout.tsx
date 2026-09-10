import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Bell, 
  User, 
  Home, 
  Compass, 
  Plus, 
  Clock, 
  UserCircle,
  X
} from 'lucide-react';
import { CitizenHome } from './CitizenHome';
import { CitizenReportIssue } from './CitizenReportIssue';
import { CitizenMap } from './CitizenMap';
import { CitizenActivity } from './CitizenActivity';
import { CitizenProfile } from './CitizenProfile';
import { CitizenIssueTracking } from './CitizenIssueTracking';

export const CitizenLayout: React.FC = () => {
  const { 
    citizenTab, 
    setCitizenTab, 
    language, 
    setLanguage, 
    selectedIssueId, 
    setSelectedIssueId,
    notifications,
    markNotificationRead,
    login
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 flex flex-col justify-between">
      {/* Top Header matching screenww.png */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F2A4A] flex items-center justify-center text-amber-400 font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-[#0F2A4A] tracking-tight block leading-tight">
                GramSetu
              </span>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center">
                <MapPin className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                Rampur, Ward 3
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs">
              <button
                onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                className="px-2 py-1 font-bold text-[#0F2A4A] cursor-pointer"
              >
                {language === 'hi' ? 'हिंदी / ENG' : 'ENG / हिंदी'}
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2 rounded-lg text-xs cursor-pointer transition-all ${
                          n.read ? 'bg-white text-slate-500' : 'bg-blue-50/70 text-slate-800 font-semibold'
                        }`}
                      >
                        <p className="leading-snug">{n.title}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => {
                setSelectedIssueId(null);
                setCitizenTab('profile');
              }}
              className="w-8 h-8 rounded-full bg-[#0F2A4A] text-white font-bold text-xs flex items-center justify-center border border-white shadow-xs cursor-pointer"
            >
              RK
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4">
        {selectedIssueId ? (
          <CitizenIssueTracking
            issueId={selectedIssueId}
            onBack={() => setSelectedIssueId(null)}
          />
        ) : (
          <>
            {citizenTab === 'home' && <CitizenHome />}
            {citizenTab === 'report' && <CitizenReportIssue />}
            {citizenTab === 'map' && <CitizenMap />}
            {citizenTab === 'activity' && <CitizenActivity />}
            {citizenTab === 'profile' && <CitizenProfile />}
          </>
        )}
      </main>

      {/* Bottom Navigation matching screenww.png */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 py-2 shadow-lg">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between relative">
          {/* Home */}
          <button
            type="button"
            onClick={() => {
              setSelectedIssueId(null);
              setCitizenTab('home');
            }}
            className={`flex flex-col items-center justify-center w-12 py-1 transition-all cursor-pointer ${
              citizenTab === 'home' && !selectedIssueId ? 'text-[#0F2A4A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Home</span>
          </button>

          {/* Map */}
          <button
            type="button"
            onClick={() => {
              setSelectedIssueId(null);
              setCitizenTab('map');
            }}
            className={`flex flex-col items-center justify-center w-12 py-1 transition-all cursor-pointer ${
              citizenTab === 'map' && !selectedIssueId ? 'text-[#0F2A4A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Map</span>
          </button>

          {/* Center Floating FAB (+) Report */}
          <div className="-mt-7">
            <button
              type="button"
              onClick={() => {
                setSelectedIssueId(null);
                setCitizenTab('report');
              }}
              className="w-13 h-13 rounded-full bg-[#0F2A4A] hover:bg-[#183d6a] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-4 border-[#F7F9FC]"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* Activity */}
          <button
            type="button"
            onClick={() => {
              setSelectedIssueId(null);
              setCitizenTab('activity');
            }}
            className={`flex flex-col items-center justify-center w-12 py-1 transition-all cursor-pointer ${
              citizenTab === 'activity' && !selectedIssueId ? 'text-[#0F2A4A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Activity</span>
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() => {
              setSelectedIssueId(null);
              setCitizenTab('profile');
            }}
            className={`flex flex-col items-center justify-center w-12 py-1 transition-all cursor-pointer ${
              citizenTab === 'profile' && !selectedIssueId ? 'text-[#0F2A4A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
