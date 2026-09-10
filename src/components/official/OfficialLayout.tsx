import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  UserCheck, 
  Sliders, 
  X,
  ExternalLink
} from 'lucide-react';
import { OfficialDashboard } from './OfficialDashboard';
import { OfficialIssues } from './OfficialIssues';
import { OfficialCommunityIssues } from './OfficialCommunityIssues';
import { OfficialMap } from './OfficialMap';
import { OfficialEscalations } from './OfficialEscalations';
import { OfficialAnalytics } from './OfficialAnalytics';
import { OfficialActivity } from './OfficialActivity';
import { OfficialProfile } from './OfficialProfile';
import { OfficialIssueDetail } from './OfficialIssueDetail';

export const OfficialLayout: React.FC = () => {
  const { 
    officialTab, 
    setOfficialTab, 
    selectedIssueId, 
    setSelectedIssueId, 
    notifications,
    markNotificationRead,
    logout,
    login
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'issues', label: 'Issues' },
    { id: 'community', label: 'Community Issues' },
    { id: 'map', label: 'Map' },
    { id: 'escalations', label: 'Escalations' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'activity', label: 'Activity' }
  ] as const;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setOfficialTab('issues');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-800 flex flex-col justify-between">
      {/* Top Navigation Bar matching screen3.png & screen4.png */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo Brand */}
            <div
              onClick={() => {
                setSelectedIssueId(null);
                setOfficialTab('dashboard');
              }}
              className="flex items-center space-x-3 cursor-pointer shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0F2A4A] flex items-center justify-center text-amber-400 font-black shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-[#0F2A4A]">GRAMSETU</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold leading-none">Awaaz se Samadhan</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((tab) => {
                const isActive = officialTab === tab.id && !selectedIssueId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedIssueId(null);
                      setOfficialTab(tab.id);
                    }}
                    className={`px-3.5 py-2 text-xs font-bold transition-all relative cursor-pointer ${
                      isActive
                        ? 'text-[#0F2A4A]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-[#0F2A4A]"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 lg:w-56 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A]"
                />
              </form>

              {/* Online Pill */}
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#0F2A4A] text-white text-[11px] font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ONLINE</span>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
                </button>

                {/* Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">Official Priority Alerts</span>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setOfficialTab('escalations');
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                            n.read ? 'bg-white text-slate-500' : 'bg-red-50/70 text-slate-800 font-semibold'
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

              {/* Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Ramesh Sharma"
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left hidden lg:block">
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      Ramesh Sharma
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Block Administrator
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 text-xs font-semibold">
                    <button
                      onClick={() => {
                        setSelectedIssueId(null);
                        setOfficialTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Official Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        login('citizen');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Switch to Citizen View</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation bar for smaller screens */}
          <div className="xl:hidden flex items-center space-x-2 overflow-x-auto py-2 border-t border-slate-100 text-xs font-bold">
            {navItems.map((tab) => {
              const isActive = officialTab === tab.id && !selectedIssueId;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedIssueId(null);
                    setOfficialTab(tab.id);
                  }}
                  className={`px-3 py-1 rounded-md shrink-0 cursor-pointer ${
                    isActive ? 'bg-[#0F2A4A] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedIssueId ? (
          <OfficialIssueDetail
            issueId={selectedIssueId}
            onBack={() => setSelectedIssueId(null)}
          />
        ) : (
          <>
            {officialTab === 'dashboard' && <OfficialDashboard />}
            {officialTab === 'issues' && <OfficialIssues />}
            {officialTab === 'community' && <OfficialCommunityIssues />}
            {officialTab === 'map' && <OfficialMap />}
            {officialTab === 'escalations' && <OfficialEscalations />}
            {officialTab === 'analytics' && <OfficialAnalytics />}
            {officialTab === 'activity' && <OfficialActivity />}
            {officialTab === 'profile' && <OfficialProfile />}
          </>
        )}
      </main>

      {/* Footer matching screen3.png & 5.png */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GramSetu Municipal Grievance Redressal Network • Digital Administrative Command</span>
          <span>Public Grievance cell • Ministry of Panchayati Raj • Government of India</span>
        </div>
      </footer>
    </div>
  );
};
