import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckSquare, 
  PhoneCall, 
  ArrowRight, 
  UserCheck, 
  Building2,
  KeyRound,
  X,
  Sparkles
} from 'lucide-react';

export const CommonLogin: React.FC = () => {
  const { login, language, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState<'citizen' | 'official'>('citizen');
  
  // Citizen form state
  const [citizenMobile, setCitizenMobile] = useState('9876543210');
  const [citizenPassword, setCitizenPassword] = useState('pass1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Official form state
  const [officialId, setOfficialId] = useState('MP-SEH-0402');
  const [officialPassword, setOfficialPassword] = useState('admin1234');

  // Modals
  const [modalType, setModalType] = useState<'otp' | 'forgot' | 'register' | null>(null);
  const [otpValue, setOtpValue] = useState(['5', '8', '2', '9', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPanchayat, setRegPanchayat] = useState('Rampur Panchayat (Ward 3)');

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('citizen');
  };

  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('official');
  };

  const handleQuickOfficial = () => {
    setOfficialId('MP-SEH-0402');
    setOfficialPassword('admin1234');
    login('official');
  };

  const handleQuickCitizen = () => {
    setCitizenMobile('9876543210');
    setCitizenPassword('pass1234');
    login('citizen');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-between selection:bg-amber-100">
      {/* Top Gov Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F2A4A] flex items-center justify-center text-white font-bold shadow-sm">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-[#0F2A4A]">GramSetu</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">NATIONAL PORTAL</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Awaaz se Samadhan • आवाज से समाधान</p>
          </div>
        </div>

        {/* Language selector & direct switch */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200">
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded font-medium transition-all ${language === 'hi' ? 'bg-white shadow-xs text-[#0F2A4A] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              हिंदी
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded font-medium transition-all ${language === 'en' ? 'bg-white shadow-xs text-[#0F2A4A] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('malwi')}
              className={`px-3 py-1.5 rounded font-medium transition-all ${language === 'malwi' ? 'bg-white shadow-xs text-[#0F2A4A] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Malwi
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 md:py-8">
        <div className="w-full max-w-[480px]">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200/80 overflow-hidden">
            {/* National Tricolor Bar */}
            <div className="h-1.5 w-full flex">
              <div className="h-full w-1/3 bg-[#FF9933]"></div>
              <div className="h-full w-1/3 bg-white"></div>
              <div className="h-full w-1/3 bg-[#138808]"></div>
            </div>

            <div className="p-6 md:p-8">
              {/* Brand Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-700 shadow-2xs">
                  <Clock className="w-6 h-6 text-[#0F2A4A]" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GramSetu Portal</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Awaaz se Samadhan • Unified Grievance Platform
                </p>
              </div>

              {/* Login As Selection Tabs */}
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
                  LOGIN AS
                </p>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
                  {/* Citizen Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('citizen')}
                    className={`relative text-left p-3 rounded-lg transition-all ${
                      activeTab === 'citizen'
                        ? 'bg-[#0F2A4A] text-white shadow-md'
                        : 'bg-transparent text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold block">Citizen</span>
                      {activeTab === 'citizen' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      )}
                    </div>
                    <span className={`text-[11px] block mt-0.5 leading-tight ${activeTab === 'citizen' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Report & track community issues
                    </span>
                  </button>

                  {/* Official Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('official')}
                    className={`relative text-left p-3 rounded-lg transition-all ${
                      activeTab === 'official'
                        ? 'bg-[#0F2A4A] text-white shadow-md'
                        : 'bg-transparent text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold block">Official</span>
                      {activeTab === 'official' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      )}
                    </div>
                    <span className={`text-[11px] block mt-0.5 leading-tight ${activeTab === 'official' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Manage & resolve civic matters
                    </span>
                  </button>
                </div>
              </div>

              {/* Citizen Form */}
              {activeTab === 'citizen' && (
                <div>
                  <div className="mb-5">
                    <h2 className="text-base font-bold text-slate-900">Welcome back</h2>
                    <p className="text-xs text-slate-500">Sign in to report and track community issues.</p>
                  </div>

                  <form onSubmit={handleCitizenSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Mobile Number / Aadhaar
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Smartphone className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={citizenMobile}
                          onChange={(e) => setCitizenMobile(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setModalType('forgot')}
                          className="text-xs text-slate-600 hover:text-[#0F2A4A] font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={citizenPassword}
                          onChange={(e) => setCitizenPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A] focus:border-transparent transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-[#0F2A4A] focus:ring-[#0F2A4A]"
                        />
                        <span>Remember me on this device</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#0F2A4A] hover:bg-[#163861] text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="relative my-4 flex items-center justify-center">
                      <div className="border-t border-slate-200 w-full"></div>
                      <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest absolute">
                        OR
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalType('otp')}
                      className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 text-slate-600" />
                      <span>Login with OTP</span>
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-xs text-slate-600">
                        New to GramSetu?{' '}
                        <button
                          type="button"
                          onClick={() => setModalType('register')}
                          className="font-bold text-[#0F2A4A] hover:underline"
                        >
                          Create an account
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              )}

              {/* Official Form */}
              {activeTab === 'official' && (
                <div>
                  <div className="mb-5">
                    <h2 className="text-base font-bold text-slate-900">Official Portal Login</h2>
                    <p className="text-xs text-slate-500">
                      Administrative access for Panchayat, Block & District Officers.
                    </p>
                  </div>

                  <form onSubmit={handleOfficialSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Official ID / Gov Email
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={officialId}
                          onChange={(e) => setOfficialId(e.target.value)}
                          placeholder="e.g. MP-SEH-0402 or official@mp.gov.in"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Password / PIN
                        </label>
                        <button
                          type="button"
                          onClick={() => setModalType('forgot')}
                          className="text-xs text-slate-600 hover:text-[#0F2A4A] font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={officialPassword}
                          onChange={(e) => setOfficialPassword(e.target.value)}
                          placeholder="Enter security password"
                          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F2A4A] focus:border-transparent transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#0F2A4A] hover:bg-[#163861] text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="relative my-3 flex items-center justify-center">
                      <div className="border-t border-slate-200 w-full"></div>
                      <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest absolute">
                        OR
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalType('otp')}
                      className="w-full py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                      <span>Official OTP Login</span>
                    </button>

                    {/* Quick Demo Pre-load */}
                    <div className="pt-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center justify-between">
                        <div className="text-left">
                          <p className="text-[11px] font-bold text-amber-900">Demo Account</p>
                          <p className="text-[10px] text-amber-700">Ramesh Sharma • Block Administrator</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleQuickOfficial}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded shadow-xs cursor-pointer"
                        >
                          Quick Login
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Sub-bar footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Next: {activeTab === 'citizen' ? 'Citizen Grievance Portal' : 'Official Command Dashboard'}</span>
              </div>
              <span className="font-mono text-slate-400">v2.4.0 • SSL 256-BIT</span>
            </div>
          </div>

          {/* Help & Support pill */}
          <div className="mt-4 flex items-center justify-between px-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span>Panchayati Raj Grievance Redressal Network</span>
            </div>
            <div>
              Toll Free Help: <span className="font-bold text-[#0F2A4A]">1800-233-0450</span>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 md:px-8 py-3 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>GramSetu • National Informatics & Civic Redressal Architecture</span>
        </div>
        <div className="flex items-center space-x-6 text-slate-600">
          <button className="hover:underline">Privacy Policy</button>
          <span>•</span>
          <button className="hover:underline">Citizen Charter</button>
          <span>•</span>
          <button className="hover:underline">Official Guidelines</button>
        </div>
      </footer>

      {/* MODAL: Login with OTP */}
      {modalType === 'otp' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0F2A4A] flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Enter OTP Verification</h3>
              <p className="text-xs text-slate-500 mt-1">
                6-digit code sent to registered number <span className="font-semibold text-slate-800">+91 98765-XXXXX</span>
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {['5', '8', '2', '9', '4', '1'].map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  defaultValue={digit}
                  className="w-10 h-12 text-center text-lg font-bold border border-slate-300 rounded-lg focus:border-[#0F2A4A] focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
              <span>Expires in: <strong className="text-slate-800">{otpTimer}s</strong></span>
              <button type="button" className="text-[#0F2A4A] font-semibold hover:underline cursor-pointer">
                Resend OTP
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setModalType(null);
                login(activeTab);
              }}
              className="w-full py-2.5 bg-[#0F2A4A] hover:bg-[#163861] text-white font-semibold rounded-lg text-sm transition-all shadow-md cursor-pointer"
            >
              Verify & Proceed
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Forgot Password */}
      {modalType === 'forgot' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Password Recovery</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered Aadhaar or Mobile to receive a reset OTP.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Identifier
                </label>
                <input
                  type="text"
                  defaultValue="9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="Mobile or Aadhaar number"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalType('otp')}
              className="w-full py-2.5 bg-[#0F2A4A] text-white font-semibold rounded-lg text-sm cursor-pointer"
            >
              Send Reset Code
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Create Account */}
      {modalType === 'register' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Citizen Registration</h3>
              <p className="text-xs text-slate-500 mt-1">
                Join GramSetu to voice community issues with direct Panchayat oversight.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalType(null);
                login('citizen');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  defaultValue="Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  defaultValue="9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gram Panchayat / Ward</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                  <option>Ward 3 • Rampur Gram Panchayat</option>
                  <option>Ward 14 • Sector 15 Central</option>
                  <option>Bilkisganj Substation Ward</option>
                  <option>Shyampur Kalan Ward 2</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Set Password</label>
                <input
                  type="password"
                  required
                  defaultValue="pass1234"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0F2A4A] text-white font-semibold rounded-lg text-sm cursor-pointer shadow-md"
                >
                  Complete Registration & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
