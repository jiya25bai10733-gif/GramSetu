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
  const { issues, escalateIssue, setSelectedIssueId, setOfficialTab, language, t } = useApp();
  const [selectedIssueIdToEscalate, setSelectedIssueIdToEscalate] = useState('');
  const [memoText, setMemoText] = useState('Ground inspection SLA lapsed beyond 48 hours without closure certificate.');

  const escalatedIssues = issues.filter(i => i.administrativeLevel !== 'Gram Panchayat' || i.slaBreached);

  const tiers = [
    { 
      level: language === 'hi' ? 'ग्राम पंचायत स्तर' : 'Gram Panchayat', 
      time: language === 'hi' ? '० – ४८ घंटे' : '0 – 48 Hours', 
      officer: language === 'hi' ? 'सरपंच / ग्राम विकास अधिकारी / स्थानीय जेई' : 'Sarpanch / VDO / Local JE', 
      role: language === 'hi' ? 'प्राथमिक स्थलीय निरीक्षण एवं फील्ड दल प्रेषण' : 'Primary Field Assessment & Dispatch' 
    },
    { 
      level: language === 'hi' ? 'ब्लॉक / जनपद स्तर' : 'Block Level', 
      time: language === 'hi' ? '४८ – ९६ घंटे' : '48 – 96 Hours', 
      officer: language === 'hi' ? 'ब्लॉक समन्वयक (रमेश शर्मा)' : 'Block Administrator (Ramesh Sharma)', 
      role: language === 'hi' ? 'अंतर-पंचायत संसाधन आवंटन व पर्यवेक्षण' : 'Multi-Panchayat Resource Marshalling' 
    },
    { 
      level: language === 'hi' ? 'जिला परिषद स्तर' : 'District Level', 
      time: language === 'hi' ? '९६ – १६८ घंटे' : '96 – 168 Hours', 
      officer: language === 'hi' ? 'जिला दंडाधिकारी / कलेक्टर निवारण प्रकोष्ठ' : 'District Magistrate / Collector Cell', 
      role: language === 'hi' ? 'कार्यकारी निर्देश व विशेष बजट आवंटन' : 'Executive Enforcement & Special Funding' 
    },
    { 
      level: language === 'hi' ? 'राज्य स्तरीय निगरानी' : 'State Oversight', 
      time: language === 'hi' ? '> १६८ घंटे' : '> 168 Hours', 
      officer: language === 'hi' ? 'पंचायती राज संचालनालय, भोपाल' : 'Directorate of Panchayati Raj Bhopal', 
      role: language === 'hi' ? 'वैधानिक प्रशासनिक जांच एवं अनुशासनात्मक कार्रवाई' : 'Statutory Administrative Inquest' 
    }
  ];

  const handleEscalate = (id: string) => {
    escalateIssue(id, memoText);
    alert(language === 'hi' 
      ? `प्रशासनिक अग्रेषण ज्ञापन ${id} हेतु जारी कर दिया गया है।` 
      : `Administrative Escalation Memo generated for ${id}. Dispatched to next tier oversight.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('escalationsTitle', 'Administrative Escalation & SLA Center')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('escalationsSubtitle', 'Four-tier governance hierarchy enforcing prompt public grievance resolution.')}
        </p>
      </div>

      {/* 4-Tier Hierarchy Diagram */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
          {t('adminProgression', 'ADMINISTRATIVE JURISDICTION PROGRESSION')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {tiers.map((tItem, idx) => (
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
                  {language === 'hi' ? `स्तर ०${idx + 1}` : `TIER 0${idx + 1}`}
                </span>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  {tItem.time}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900">{tItem.level}</h3>
              <p className="text-xs font-semibold text-[#0F2A4A] mt-1">{tItem.officer}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{tItem.role}</p>

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
              {t('urgentEscalationsHeader', 'URGENT ESCALATIONS & OVERDUE GRIEVANCES')}
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800">
            {escalatedIssues.length} {t('mattersEscalated', 'Matters Escalated')}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {escalatedIssues.map(iss => (
            <div key={iss.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-extrabold text-[#0F2A4A] text-sm">{iss.token}</span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'hi' 
                      ? (iss.title.includes('Handpump') ? 'ग्राम पंचायत हैंडपंप खराबी एवं पेयजल संकट' :
                         iss.title.includes('Pothole') ? 'मुख्य मार्ग पर गहरा व खतरनाक गड्ढा' :
                         iss.title.includes('Transformer') ? 'विद्युत वितरण ट्रांसफार्मर से तेल रिसाव व चिंगारी' : iss.title)
                      : iss.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-200">
                    {iss.administrativeLevel} {language === 'hi' ? 'निगरानी' : 'Oversight'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl">
                  {language === 'hi'
                    ? (iss.id === '#GS-1248' ? '१७ नागरिकों द्वारा गंदे मटमैले पानी और टूटे हैंडल की रिपोर्ट। तत्काल बोरवेल निरीक्षण आवश्यक।' :
                       iss.id === '#GS-1245' ? 'सेंट्रल पार्क गेट के समीप २-फीट गहरा गड्ढा दोपहिया वाहनों हेतु दुर्घटना का कारण बन रहा है।' : iss.summary)
                    : iss.summary}
                </p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                  <span>{language === 'hi' ? 'पंचायत' : 'Panchayat'}: <strong>{iss.panchayat}</strong></span>
                  <span>{language === 'hi' ? 'प्राधिकरण' : 'Authority'}: <strong>{iss.currentAuthority}</strong></span>
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
                  {t('viewDossier', 'View Dossier')}
                </button>
                <button
                  type="button"
                  onClick={() => handleEscalate(iss.id)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-xs cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{t('escalateFurther', 'Escalate Further')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
