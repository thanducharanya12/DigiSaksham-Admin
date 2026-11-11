import React, { useState } from 'react';
import { 
  Bot, 
  FileText, 
  BookOpen, 
  ShieldAlert, 
  ScanLine, 
  Briefcase, 
  HelpCircle, 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  Volume2, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  PhoneCall, 
  MapPin, 
  Award,
  ChevronRight,
  PlusCircle,
  Clock,
  ThumbsUp,
  ShieldCheck
} from 'lucide-react';
import { User, Scheme, ApplicationGuide, JobOpportunity, HelpRequest } from '../types';
import { AdminLanguage, adminTranslations } from '../localization/i18n';
import { LanguageSelector } from './LanguageSelector';
import { adminApi } from '../services/api';

interface CitizenPortalProps {
  user: User;
  lang: AdminLanguage;
  onSelectLanguage: (lang: AdminLanguage) => void;
  onLogout: () => void;
}

export type CitizenTab = 
  | 'assistant' 
  | 'schemes' 
  | 'guides' 
  | 'scamshield' 
  | 'documents' 
  | 'jobs' 
  | 'volunteer' 
  | 'profile';

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  user,
  lang,
  onSelectLanguage,
  onLogout
}) => {
  const t = adminTranslations[lang];
  const [activeTab, setActiveTab] = useState<CitizenTab>('assistant');

  // State for AI Assistant Chat
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; audioPlaying?: boolean }>>([
    {
      sender: 'bot',
      text: lang === 'te' 
        ? `నమస్కారం ${user.full_name}! నేను మీ డిజి AI సహాయకుడిని. ప్రభుత్వ పథకాలు, మీసేవ దరఖాస్తులు లేదా సైబర్ మోసాల గురించి మీ ప్రశ్నలను అడగండి.`
        : lang === 'hi'
        ? `नमस्ते ${user.full_name}! मैं आपका डिजी एआई सहायक हूँ। सरकारी योजनाओं, मीसेवा या साइबर सुरक्षा के बारे में मुझसे पूछें।`
        : `Hello ${user.full_name}! I am your Digi AI assistant. Ask me anything about government schemes, MeeSeva applications, or cyber fraud checks.`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // State for ScamShield
  const [scamText, setScamText] = useState('');
  const [scamResult, setScamResult] = useState<{
    score: number;
    verdict: 'safe' | 'suspicious' | 'high_risk';
    indicators: string[];
    advice: string;
  } | null>(null);

  // State for Schemes Filter
  const [schemeCategoryFilter, setSchemeCategoryFilter] = useState<string>('all');
  const [schemesList, setSchemesList] = useState<Scheme[]>([
    {
      id: 1,
      title: 'PM Kisan Samman Nidhi',
      title_te: 'పీఎం కిసాన్ సమ్మాన్ నిధి',
      target_category: 'farmer',
      short_description: '₹6,000 per year income support to landholding farmers in 3 equal installments.',
      benefits: '₹6,000 / year deposited directly via DBT into Aadhaar-linked bank accounts.',
      official_url: 'https://pmkisan.gov.in',
      is_active: true,
      last_verified_date: '2026-11-01'
    },
    {
      id: 2,
      title: 'Post-Matric Scholarship & Fee Reimbursement',
      title_te: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్',
      target_category: 'student',
      short_description: 'Full tuition fee reimbursement and hostel maintenance allowance for rural students.',
      benefits: '100% Tuition Fee + ₹10,000 yearly maintenance allowance.',
      official_url: 'https://scholarships.gov.in',
      is_active: true,
      last_verified_date: '2026-11-01'
    },
    {
      id: 3,
      title: 'Dr. YSR Aarogyasri / Ayushman Bharat (PM-JAY)',
      title_te: 'డాక్టర్ వైఎస్సార్ ఆరోగ్యశ్రీ',
      target_category: 'all',
      short_description: 'Cashless hospital treatment up to ₹25 Lakhs per family per year.',
      benefits: 'Cashless inpatient treatment across 2,400+ empanelled network hospitals.',
      official_url: 'https://aarogyasri.ap.gov.in',
      is_active: true,
      last_verified_date: '2026-11-01'
    },
    {
      id: 4,
      title: 'YSR Pension Kanuka - Senior Citizen & Widow Pension',
      title_te: 'వైఎస్సార్ పింఛన్ కానుక',
      target_category: 'senior_citizen',
      short_description: 'Monthly social security pension of ₹3,000 delivered directly to citizen doorstep.',
      benefits: '₹3,000 / month delivered on the 1st of every month by Village Volunteers.',
      official_url: 'https://sspensions.ap.gov.in',
      is_active: true,
      last_verified_date: '2026-11-01'
    }
  ]);

  // State for Volunteer Help Requests
  const [userRequests, setUserRequests] = useState<HelpRequest[]>([
    {
      id: 101,
      title: 'Assistance for PM-Kisan biometric e-KYC mismatch',
      description: 'Fingerprint failed at local CSC; need assistance checking OTP option.',
      category: 'scheme_guidance',
      status: 'pending',
      village: user.profile?.village || 'Kollipara',
      mandal: 'Tenali',
      contact_phone_masked: `${user.phone.slice(0, 5)}XXXXX`,
      created_at: '2026-11-08 14:30'
    }
  ]);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqCat, setReqCat] = useState('scheme_guidance');
  const [reqSuccessMsg, setReqSuccessMsg] = useState(false);

  // Digital Confidence Quiz state
  const [confidenceScore, setConfidenceScore] = useState(user.profile?.digital_confidence_score || 75);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Speech synthesis helper
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Assistant Send
  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: q }];
    setMessages(newMsgs);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = q.toLowerCase();

      if (lower.includes('రైతు') || lower.includes('kisan') || lower.includes('farmer') || lower.includes('పథకం')) {
        botResponse = lang === 'te'
          ? 'పీఎం కిసాన్ సమ్మాన్ నిధి పథకం ద్వారా అర్హులైన రైతులకు సంవత్సరానికి ₹6,000 మూడు విడతలలో లభిస్తుంది.\n1. కావలసిన పత్రాలు: పట్టాదారు పాస్‌బుక్, ఆధార్ కార్డు, బ్యాంక్ ఖాతా.\n2. మీ ఆధార్‌కు మొబైల్ నంబర్ లింక్ చేసి ఉంటే pmkisan.gov.in లో ఉచితంగా e-KYC పూర్తి చేయవచ్చు.\n3. సందేహాలు ఉంటే మీ గ్రామ వాలంటీర్ సహాయం తీసుకోండి.'
          : 'Under PM-Kisan, eligible landholding farmers receive ₹6,000 per year in 3 installments of ₹2,000 directly via DBT. Required: Pattadar Passbook, Aadhaar, and bank account. You can complete biometric e-KYC at your local Grama Sachivalayam.';
      } else if (lower.includes('ఆదాయ') || lower.includes('income') || lower.includes('meeseva') || lower.includes('మీసేవ')) {
        botResponse = lang === 'te'
          ? 'మీసేవలో ఆదాయ ధ్రువీకరణ పత్రం (Income Certificate) దరఖాస్తు విధానం:\n1. అవసరమైన పత్రాలు: రేషన్ కార్డు లేదా ఆధార్ కార్డు, అఫిడవిట్.\n2. అధికారిక ప్రభుత్వ ఫీజు: ₹45 మాత్రమే.\n3. గడువు: దరఖాస్తు చేసిన 7 రోజులలో తహశీల్దార్ ఆమోదంతో సర్టిఫికెట్ అందుతుంది.'
          : 'To apply for an Income Certificate in MeeSeva / Grama Sachivalayam:\n1. Required docs: Ration card or Aadhaar, self-declaration affidavit.\n2. Statutory government fee: ₹45 only.\n3. Delivery timeline: 7 business days following Tahsildar verification.';
      } else if (lower.includes('sms') || lower.includes('నకిలీ') || lower.includes('మోసం') || lower.includes('scam') || lower.includes('లాటరీ')) {
        botResponse = lang === 'te'
          ? 'హెచ్చరిక! గుర్తుంచుకోండి:\n1. మీ బ్యాంక్ ఖాతాలోకి డబ్బులు జమ కావడానికి UPI PIN లేదా OTP ఎప్పుడూ అవసరం లేదు.\n2. కరెంట్ కట్ అవుతుందని వచ్చే మెసేజ్లలో ఇచ్చిన నంబర్లకు ఫోన్ చేయకండి.\n3. సైబర్ మోసం జరిగితే వెంటనే 1930 జాతీయ హెల్ప్‌లైన్‌కు కాల్ చేయండి.'
          : 'Warning! Remember: You NEVER need to enter your UPI PIN or OTP to receive money. Official electricity and bank departments never send personal mobile numbers for disconnection threats. If trapped in fraud, call 1930 immediately.';
      } else {
        botResponse = lang === 'te'
          ? `మీ ప్రశ్నకు ధన్యవాదాలు! తెనాలి మండల పౌరులకు DigiSaksham AI 24x7 ఉచిత మార్గదర్శనం అందిస్తుంది. మరిన్ని వివరాల కోసం ప్రభుత్వ పథకాలు లేదా గైడ్ల ట్యాబ్‌ను చూడండి.`
          : `Thank you for your question. DigiSaksham AI is configured to assist rural citizens across Tenali Mandal with verified government services. Please check the Schemes or Guides tabs for detailed checklists.`;
      }

      setMessages([...newMsgs, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
      handleSpeak(botResponse);
    }, 600);
  };

  // Scam Analyzer
  const handleAnalyzeScam = () => {
    if (!scamText.trim()) return;

    const lower = scamText.toLowerCase();
    const hasPin = lower.includes('pin') || lower.includes('పిన్') || lower.includes('otp');
    const hasLottery = lower.includes('win') || lower.includes('lakh') || lower.includes('lottery') || lower.includes('లాటరీ') || lower.includes('car');
    const hasUrgent = lower.includes('tonight') || lower.includes('cut') || lower.includes('suspend') || lower.includes('block') || lower.includes('విద్యుత్');

    if (hasPin || hasLottery || hasUrgent) {
      setScamResult({
        score: 85,
        verdict: 'high_risk',
        indicators: [
          lang === 'te' ? 'రహస్య UPI PIN లేదా OTP అడగడం' : 'Soliciting secret UPI PIN or OTP',
          lang === 'te' ? 'అత్యవసర విద్యుత్ సరఫరా నిలిపివేత బెదిరింపు' : 'Urgent threat of service disconnection',
          lang === 'te' ? 'అధికారికం కాని మొబైల్ నంబర్ లేదా లింక్' : 'Unofficial contact number / unverified link'
        ],
        advice: lang === 'te' 
          ? 'ఈ మెసేజ్‌ను వెంటనే తొలగించండి. లింక్‌లను క్లిక్ చేయవద్దు. ఎవరితోనూ పిన్ నంబర్ పంచుకోవద్దు. ఆర్థిక నష్టం జరిగితే 1930 కి కాల్ చేయండి.'
          : 'Delete this message immediately. Do not click links or share PINs. If money was lost, report to 1930 within golden hours.'
      });
    } else {
      setScamResult({
        score: 15,
        verdict: 'safe',
        indicators: [
          lang === 'te' ? 'ఎటువంటి రహస్య సమాచారం లేదా బ్యాంకింగ్ పిన్ కోరబడలేదు' : 'No banking credentials requested',
          lang === 'te' ? 'హెచ్చరికలు లేవు' : 'Standard informational pattern'
        ],
        advice: lang === 'te'
          ? 'ఈ సందేశం సాధారణ సమాచారంగా కనిపిస్తోంది. అయినప్పటికీ ఎవరికీ ఓటీపీ చెప్పకండి.'
          : 'This message appears normal. However, never disclose OTP or banking passwords to callers.'
      });
    }
  };

  // Help Request Submit
  const handleHelpRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    const newReq = await adminApi.createHelpRequest({
      title: reqTitle,
      description: reqDesc || reqTitle,
      category: reqCat,
      village: user.profile?.village || 'Kollipara',
      contact_phone: user.phone
    });

    setUserRequests([newReq, ...userRequests]);
    setReqTitle('');
    setReqDesc('');
    setReqSuccessMsg(true);
    setTimeout(() => setReqSuccessMsg(false), 5000);
  };

  const filteredSchemes = schemeCategoryFilter === 'all' 
    ? schemesList 
    : schemesList.filter(s => s.target_category === schemeCategoryFilter || s.target_category === 'all');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. CITIZEN NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Citizen Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  {t.portalTitle}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {t.citizenBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {user.full_name} • <span className="font-semibold text-emerald-700 capitalize">{user.profile?.category || 'Citizen'}</span> ({user.profile?.village || 'Kollipara'}, {user.profile?.district || 'Guntur'})
              </p>
            </div>
          </div>

          {/* Right: Confidence Score, Language, Logout */}
          <div className="flex items-center gap-3">
            {/* Confidence Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Score: {confidenceScore}/100</span>
            </div>

            {/* Language Dropdown */}
            <LanguageSelector currentLang={lang} onSelectLanguage={onSelectLanguage} />

            {/* Logout */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold border border-slate-200 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>

        {/* Emergency Ticker */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-emerald-100 text-[11px] py-1 px-4 text-center font-medium">
          <span>{t.citizenPortal.emergencyAlert}</span>
        </div>
      </header>

      {/* 2. CITIZEN DASHBOARD BODY */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar for Citizen */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          
          {/* User Profile Mini Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-lg">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{user.full_name}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{user.phone}</p>
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.profile?.village || 'Kollipara'}</span>
                </div>
              </div>
            </div>

            {/* Digital Confidence Progress */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-600">{t.citizenPortal.confidenceTitle}</span>
                <span className="text-emerald-700">{confidenceScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {t.citizenPortal.confidenceTier}
              </p>
            </div>
          </div>

          {/* Tab Navigation List */}
          <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'assistant'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-4 h-4 flex-shrink-0" />
              <span>{t.citizenPortal.tabs.assistant}</span>
            </button>

            <button
              onClick={() => setActiveTab('schemes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'schemes'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>{t.citizenPortal.tabs.schemes}</span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'guides'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span>{t.citizenPortal.tabs.guides}</span>
            </button>

            <button
              onClick={() => setActiveTab('scamshield')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'scamshield'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-500 group-hover:text-rose-600" />
              <span>{t.citizenPortal.tabs.scamshield}</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'documents'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ScanLine className="w-4 h-4 flex-shrink-0" />
              <span>{t.citizenPortal.tabs.documents}</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'jobs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span>{t.citizenPortal.tabs.jobs}</span>
            </button>

            <button
              onClick={() => setActiveTab('volunteer')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'volunteer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t.citizenPortal.tabs.requestHelp}</span>
              {userRequests.length > 0 && (
                <span className="ml-auto bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {userRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-left ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserIcon className="w-4 h-4 flex-shrink-0" />
              <span>{t.citizenPortal.tabs.profile}</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[550px] overflow-hidden">
          
          {/* TAB 1: DIGI AI ASSISTANT */}
          {activeTab === 'assistant' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {lang === 'te' ? 'డిజి ఏఐ తెలుగు సహాయకుడు' : lang === 'hi' ? 'डिजी एआई सहायक' : 'Digi AI Citizen Assistant'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === 'te' ? 'వాయిస్ మరియు టెక్స్ట్ ద్వారా ప్రభుత్వ సేవల మార్గదర్శనం' : 'Voice & text guidance for welfare and digital services'}
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active AI
                </span>
              </div>

              {/* Suggested Prompt Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: 'పీఎం కిసాన్ e-KYC ఎలా చేయాలి?', q: 'పీఎం కిసాన్ e-KYC ఎలా చేయాలి?' },
                  { label: 'ఆదాయ సర్టిఫికెట్ ప్రభుత్వ ఫీజు?', q: 'ఆదాయ సర్టిఫికెట్ ప్రభుత్వ ఫీజు ఎంత?' },
                  { label: 'లాటరీ SMS వచ్చింది, నకిలీదా?', q: 'లాటరీ SMS వచ్చింది, నకిలీదా?' },
                  { label: 'APSSDC ఉచిత శిక్షణ వివరాలు', q: 'APSSDC ఉచిత శిక్షణ వివరాలు తెలపండి' }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.q)}
                    className="text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition"
                  >
                    💡 {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 bg-slate-50/70 rounded-2xl p-4 overflow-y-auto space-y-3 min-h-[300px] border border-slate-100">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        m.sender === 'user'
                          ? 'bg-emerald-700 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none whitespace-pre-line'
                      }`}
                    >
                      <p>{m.text}</p>
                      {m.sender === 'bot' && (
                        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Digi AI Verified Response</span>
                          <button
                            onClick={() => handleSpeak(m.text)}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold transition"
                            title="Listen to audio readout"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{lang === 'te' ? 'వినండి' : 'Listen'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200"></span>
                      <span>{lang === 'te' ? 'సమాధానం సిద్ధం చేస్తోంది...' : 'Digi AI is typing...'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder={
                    lang === 'te' 
                      ? 'మీ ప్రశ్నను ఇక్కడ అడగండి (ఉదా: రేషన్ కార్డు కొత్త పేరు చేర్చడం)...' 
                      : 'Ask your question here (e.g. How to apply for MeeSeva certificate)...'
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GOVERNMENT SCHEMES */}
          {activeTab === 'schemes' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {lang === 'te' ? 'ప్రభుత్వ సంక్షేమ పథకాలు' : 'Verified Government Schemes'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'te' ? 'అర్హత నిబంధనలు, అవసరమైన పత్రాలు మరియు అధికారిక పోర్టల్స్' : 'Check eligibility, benefits, and verified official portals'}
                  </p>
                </div>

                {/* Filter */}
                <select
                  value={schemeCategoryFilter}
                  onChange={(e) => setSchemeCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="all">All Categories</option>
                  <option value="farmer">🌾 Farmer Schemes</option>
                  <option value="student">🎓 Student Scholarships</option>
                  <option value="senior_citizen">👴 Senior Citizen</option>
                </select>
              </div>

              {/* Schemes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchemes.map((scheme) => (
                  <div 
                    key={scheme.id} 
                    className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {scheme.target_category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">
                          {lang === 'te' ? scheme.title_te : scheme.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {scheme.short_description}
                    </p>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 text-xs">
                      <strong className="text-emerald-800 block text-[11px]">Benefits:</strong>
                      <span className="text-slate-700">{scheme.benefits}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[10px] text-slate-400">Verified: {scheme.last_verified_date}</span>
                      <a
                        href={scheme.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP GUIDES */}
          {activeTab === 'guides' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {lang === 'te' ? 'ఆన్‌లైన్ దరఖాస్తు గైడ్లు (మీసేవ / గ్రామ సచివాలయం)' : 'Step-by-Step Online Application Guides'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'te' ? 'దళారులు లేకుండా స్వతంత్రంగా దరఖాస్తు చేసుకునే అధికారిక విధానం' : 'Official checklists, fees, and timelines to avoid broker fees'}
                </p>
              </div>

              {/* Guide Card */}
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      MeeSeva Revenue Service
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1">
                      {lang === 'te' ? 'ఆదాయ ధ్రువీకరణ పత్రం దరఖాస్తు (Income Certificate)' : 'How to Apply for an Income Certificate'}
                    </h4>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-mono font-bold text-emerald-800">Fee: ₹45</p>
                    <p className="text-slate-500 text-[11px]">Time: 7 Days</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-slate-800">Application Steps:</h5>
                  <div className="space-y-1.5">
                    {[
                      { step: '1', title: 'Collect Required Documents', desc: 'Ration card or Aadhaar card, employer salary slip or self-declaration affidavit on non-judicial stamp paper.' },
                      { step: '2', title: 'Submit at Village Secretariate / MeeSeva', desc: 'Hand over application with ₹45 official statutory challan receipt.' },
                      { step: '3', title: 'Village Revenue Officer (VRO) Verification', desc: 'Field verification conducted within 3 business days.' },
                      { step: '4', title: 'Tahsildar Digital Signature & Download', desc: 'Download digitally signed certificate from MeeSeva portal or collect physical copy.' }
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-amber-100">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {s.step}
                        </span>
                        <div>
                          <strong className="text-slate-800 block text-xs">{s.title}</strong>
                          <span className="text-slate-500 text-[11px]">{s.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCAMSHIELD AI */}
          {activeTab === 'scamshield' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {lang === 'te' ? 'స్కామ్‌షీల్డ్ AI - ఆన్‌లైన్ మోసాల రక్షణ' : 'ScamShield AI - Fraud & Scam Detection'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'te' ? 'మీకు వచ్చిన అనుమానాస్పద SMS లేదా లింక్‌ను ఇక్కడ తనిఖీ చేయండి' : 'Check suspicious SMS, WhatsApp messages, or links for cyber fraud'}
                </p>
              </div>

              {/* Scanner Box */}
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={scamText}
                  onChange={(e) => setScamText(e.target.value)}
                  placeholder={
                    lang === 'te'
                      ? 'మీకు వచ్చిన మెసేజ్ ఇక్కడ పేస్ట్ చేయండి (ఉదా: Dear Customer, electricity disconnected tonight. Call 9876543210)...'
                      : 'Paste suspicious SMS here (e.g. Your electricity bill unpaid, connection will be disconnected tonight)...'
                  }
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-slate-800"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAnalyzeScam}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{lang === 'te' ? 'మెసేజ్ తనిఖీ చేయండి' : 'Scan Message for Scam'}</span>
                  </button>

                  <button
                    onClick={() => setScamText('Dear consumer, Your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Please immediately contact our electricity officer at 9848011223 to verify UPI payment.')}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Paste Sample Scam SMS
                  </button>
                </div>
              </div>

              {/* Analysis Result Card */}
              {scamResult && (
                <div className={`p-4 rounded-2xl border text-xs space-y-3 animate-in fade-in duration-200 ${
                  scamResult.verdict === 'high_risk' 
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900' 
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-sm">
                      {scamResult.verdict === 'high_risk' ? (
                        <>
                          <AlertTriangle className="w-5 h-5 text-rose-600" />
                          <span>HIGH RISK SCAM DETECTED (Score: {scamResult.score}/100)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>SAFE MESSAGE PATTERN (Score: {scamResult.score}/100)</span>
                        </>
                      )}
                    </span>
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-full bg-white shadow-sm">
                      Verdict: {scamResult.verdict.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <strong className="block mb-1">Detected Indicators:</strong>
                    <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90">
                      {scamResult.indicators.map((ind, i) => (
                        <li key={i}>{ind}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-current/10">
                    <strong className="block mb-0.5">Recommended Safety Action:</strong>
                    <p className="text-[11px]">{scamResult.advice}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SMART DOCUMENT OCR */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {lang === 'te' ? 'స్మార్ట్ డాక్యుమెంట్ స్కానర్ & అనువాదం' : 'Smart Document OCR & Notice Explainer'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'te' ? 'అధికారిక ఉత్తర్వులలో ముఖ్యమైన గడువులు మరియు నిబంధనలను అర్థం చేసుకోండి' : 'Extract deadlines and legal points from government revenue notices'}
                </p>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Sample Revenue Notice (Tahsildar Tenali)
                  </h4>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                    Sample Analyzed
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs font-mono text-slate-700">
                  "Notice is hereby given to landholders in Kollipara village to submit updated 1-B records for resurvey by 20th November 2026. Failure to report may delay Rythu Bharosa disbursement."
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                    <strong className="block text-[11px]">Extracted Deadline:</strong>
                    <span>20th November 2026</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                    <strong className="block text-[11px]">Telugu Translation & Summary:</strong>
                    <span>ఈ నోటీసు ప్రకారం కొల్లిపర గ్రామ రైతులు భూమి రీ-సర్వే కోసం 1-B రికార్డులను నవంబర్ 20 లోగా గ్రామ సచివాలయంలో సమర్పించాలి.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RURAL JOBS & TRAINING */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {lang === 'te' ? 'గ్రామీణ ఉపాధి & ఉచిత నైపుణ్య శిక్షణ' : 'Rural Employment & Skill Development'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'te' ? 'APSSDC మరియు జాతీయ అప్రెంటిస్‌షిప్ ద్వారా ఉచిత శిక్షణ అవకాశాలు' : 'Verified APSSDC and National Apprenticeship programs'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    APSSDC Government Training
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Solar Panel Installation & Maintenance
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    Free 30-day technical certificate course with daily stipend at Tenali Polytechnic College.
                  </p>
                  <p className="text-slate-500 text-[10px]">Eligibility: 10th / ITI Pass | Free Course</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    Grama Sachivalayam
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Digital Assistant & Data Entry Operator
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    Local village secretariat citizen services coordinator position in Kollipara.
                  </p>
                  <p className="text-slate-500 text-[10px]">Eligibility: Degree / Diploma with Computer Skills</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REQUEST VILLAGE VOLUNTEER HELP */}
          {activeTab === 'volunteer' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t.citizenPortal.requestModal.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.citizenPortal.requestModal.sub}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleHelpRequestSubmit} className="space-y-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {reqSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.citizenPortal.requestModal.successMsg}</span>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.citizenPortal.requestModal.issueTitle}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.citizenPortal.requestModal.issueTitlePlaceholder}
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.citizenPortal.requestModal.categoryLabel}
                    </label>
                    <select
                      value={reqCat}
                      onChange={(e) => setReqCat(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800 font-medium"
                    >
                      <option value="scheme_guidance">Scheme Guidance & KYC (పథకాల సలహా)</option>
                      <option value="fraud_help">Cyber Fraud / Suspicious SMS (సైబర్ మోసం)</option>
                      <option value="certificate_application">MeeSeva Certificate (మీసేవ సర్టిఫికెట్)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.citizenPortal.requestModal.villageLabel}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.profile?.village || 'Kollipara'}
                      className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.citizenPortal.requestModal.descLabel}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.citizenPortal.requestModal.descPlaceholder}
                    value={reqDesc}
                    onChange={(e) => setReqDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.citizenPortal.requestModal.submitBtn}</span>
                </button>
              </form>

              {/* Past Requests List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">
                  Your Active Volunteer Requests ({userRequests.length})
                </h4>
                {userRequests.map((req) => (
                  <div key={req.id} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between text-xs">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        req.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : req.status === 'assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                      <h5 className="font-bold text-slate-900 mt-1">{req.title}</h5>
                      <p className="text-[11px] text-slate-500">{req.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">Date: {req.created_at}</p>
                    </div>
                    {req.assigned_volunteer_name && (
                      <div className="text-right text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Assigned Volunteer:</span>
                        <strong className="text-slate-800">{req.assigned_volunteer_name}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MY PROFILE & LITERACY QUIZ */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {lang === 'te' ? 'నా ప్రొఫైల్ & డిజిటల్ అక్షరాస్యత' : 'Citizen Profile & Digital Confidence'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'te' ? 'మీ వివరాలు మరియు ధ్రువీకరించిన డిజిటల్ స్థాయి' : 'Your registered details and verified digital champion status'}
                </p>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Full Name:</span>
                  <strong className="text-slate-900 text-sm">{user.full_name}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Mobile Number:</span>
                  <strong className="text-slate-900 text-sm font-mono">{user.phone}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Category:</span>
                  <strong className="text-emerald-800 text-sm capitalize">{user.profile?.category || 'Farmer'}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Village & District:</span>
                  <strong className="text-slate-900 text-sm">{user.profile?.village || 'Kollipara'}, {user.profile?.district || 'Guntur'}</strong>
                </div>
              </div>

              {/* Interactive Literacy Boost Quiz */}
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Quick Cyber Safety Check (Earn +25 Points)</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    {confidenceScore}/100 PTS
                  </span>
                </div>

                <p className="text-slate-700">
                  Question: When receiving money into your Google Pay / PhonePe from a government scheme, do you ever need to enter your UPI PIN?
                </p>

                {!quizAnswered ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setQuizAnswered(true);
                        setConfidenceScore(100);
                      }}
                      className="flex-1 py-2 px-3 bg-white hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl border border-emerald-300 transition text-center"
                    >
                      ❌ No, NEVER enter PIN to receive money
                    </button>
                    <button
                      onClick={() => alert('Remember: You NEVER need to enter UPI PIN to receive money!')}
                      className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 text-slate-700 font-medium rounded-xl border border-slate-200 transition text-center"
                    >
                      Yes, PIN is required
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct! You achieved 100/100 score! You are a certified Digital Champion!</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <span>DigiSaksham AI • B.Tech CSE Community Service Project • Tenali Mandal Implementation</span>
      </footer>

    </div>
  );
};

