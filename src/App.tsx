import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CommonLogin } from './components/auth/CommonLogin';
import { CitizenLayout } from './components/citizen/CitizenLayout';
import { OfficialLayout } from './components/official/OfficialLayout';
import { Smartphone, Monitor, ArrowLeftRight } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { role, login, logout } = useApp();
  const [deviceView, setDeviceView] = useState<'mobile' | 'responsive'>('mobile');

  if (!role) {
    return <CommonLogin />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating Demo Control Pill */}
      <div className="fixed top-2 right-2 z-50 bg-[#0F2A4A]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-xl flex items-center space-x-2 text-[11px] font-bold border border-white/20">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span className="capitalize">{role} Mode</span>

        <span className="text-slate-400">|</span>

        <button
          type="button"
          onClick={() => login(role === 'citizen' ? 'official' : 'citizen')}
          className="text-amber-300 hover:text-amber-200 flex items-center space-x-1 cursor-pointer"
          title="Switch between Citizen and Official views"
        >
          <ArrowLeftRight className="w-3 h-3" />
          <span>Switch to {role === 'citizen' ? 'Official' : 'Citizen'}</span>
        </button>

        <span className="text-slate-400">|</span>

        <button
          type="button"
          onClick={logout}
          className="text-red-300 hover:text-red-200 cursor-pointer"
        >
          Logout
        </button>
      </div>

      {role === 'citizen' ? (
        <CitizenLayout />
      ) : (
        <OfficialLayout />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

export default App;
