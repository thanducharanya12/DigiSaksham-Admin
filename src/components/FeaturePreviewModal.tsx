import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  FileText, 
  BookOpen, 
  ShieldAlert, 
  ScanLine, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Send, 
  Volume2, 
  AlertTriangle,
  Clock,
  Banknote,
  PhoneCall
} from 'lucide-react';
import { AdminLanguage, adminTranslations } from '../localization/i18n';

interface FeaturePreviewModalProps {
  featureId: string | null;
  onClose: () => void;
  lang: AdminLanguage;
  t: typeof adminTranslations.en;
  onOpenLogin: () => void;
}

export const FeaturePreviewModal: React.FC<FeaturePreviewModalProps> = ({
  featureId,
  onClose,
  lang,
  t,
  onOpenLogin,
}) => {
  if (!featureId) return null;

  // State for interactive ScamShield simulator
  const [scamInput, setScamInput] = useState('Congratulations! You won Rs 5,00,000 lottery in PM Kisan. Scan QR code and enter UPI PIN immediately to claim.');
  const [scamResult, setScamResult] = useState<any>(null);

  // State for AI Assistant simulator
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: lang === 'te' 
        ? 'నమస్కారం! నేను మీ డిజి AI సహాయకుడిని. ప్రభుత్వ పథకాలు, ధ్రువీకరణ పత్రాలు లేదా సైబర్ భద్రతపై ప్రశ్నలు అడగవచ్చు.'
        : (lang === 'hi' 
            ? 'नमस्ते! मैं डिजी एआई सहायक हूँ। सरकारी योजनाओं, प्रमाणपत्रों या साइबर सुरक्षा पर कोई भी सवाल पूछें।'
            : 'Hello! I am Digi AI. Ask me about government welfare schemes, MeeSeva certificates, or cyber safety.')
    }
  ]);

  const runScamCheck = (customText?: string) => {
    const textToAnalyze = customText || scamInput;
    const isHigh = /pin|otp|lottery|won|winner|blocked|disconnected/i.test(textToAnalyze);
    setScamResult({
      risk: isHigh ? 'High Risk Threat (తీవ్రమైన ప్రమాదం)' : 'Low Risk Indicators (సురక్షితం)',
      score: isHigh ? 85 : 12,
      isHigh,
      points: isHigh ? [
        'Unexpected lottery / cash prize promise (ఊహించని నగదు బహుమతి ఎర)',
        'Solicits UPI PIN or OTP (డబ్బు రావడానికి రహస్య పిన్ అడగడం)',
        'Urgency threat urging immediate action (తక్షణమే చేయాలని ఒత్తిడి)'
      ] : [
        'No immediate credential harvesting patterns detected.',
        'Always verify with official .gov.in portals.'
      ],
      helpline: '1930'
    });
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userQuery = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setChatInput('');

    setTimeout(() => {
      let reply = '';
      if (/kisan|farmer|రైతు|किसान/i.test(userQuery)) {
        reply = lang === 'te' 
          ? 'పీఎం కిసాన్ సమ్మాన్ నిధి: సాగుభూమి ఉన్న రైతులకు ఏటా ₹6,000 ఆర్థిక సహాయం 3 విడతల్లో నేరుగా బ్యాంకు ఖాతాలో జమ అవుతుంది. ఆధార్ ఈ-కేవైసీ తప్పనిసరి.'
          : (lang === 'hi' 
              ? 'पीएम किसान योजना: भूमिधारक किसानों को हर साल ₹6,000 की वित्तीय सहायता 3 किस्तों में सीधे बैंक खाते में दी जाती है। ई-केवाईसी आवश्यक है।'
              : 'PM-Kisan Scheme: ₹6,000/year in 3 installments of ₹2,000 credited directly to verified landholding farmers via DBT. e-KYC is mandatory.');
      } else if (/income|certificate|ఆదాయ|आय/i.test(userQuery)) {
        reply = lang === 'te'
          ? 'ఆదాయ ధ్రువీకరణ పత్రం: ఆధార్, తెల్ల రేషన్ కార్డు, మరియు తాజా కరెంట్ బిల్లుతో గ్రామ సచివాలయంలో దరఖాస్తు చేసుకోండి. అధికారిక రుసుము ₹35-₹45 మాత్రమే.'
          : (lang === 'hi'
              ? 'आय प्रमाण पत्र: आधार, राशन कार्ड और बिजली बिल के साथ ग्राम सचिवालय में आवेदन करें। आधिकारिक शुल्क केवल ₹35-₹45 है।'
              : 'Income Certificate: Submit Aadhaar, Ration Card, and electricity bill at Grama Sachivalayam. Statutory fee is ₹35-₹45 only.');
      } else {
        reply = lang === 'te'
          ? 'ధ్రువీకరించిన ప్రభుత్వ డేటాబేస్ ఆధారంగా వివరణ: మీరు సంక్షేమ పథకాలు, మీసేవ గైడ్లు మరియు 1930 సైబర్ హెల్ప్‌లైన్ గురించి అడగవచ్చు.'
          : (lang === 'hi'
              ? 'सत्यापित सरकारी जानकारी: आप योजनाओं, आवेदन प्रक्रियाओं और 1930 साइबर हेल्पलाइन के बारे में पूछ सकते हैं।'
              : 'Verified government guidance: You can ask about welfare schemes, MeeSeva application checklists, and 1930 cyber fraud reporting.');
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              {featureId === 'assistant' && <Bot className="w-5 h-5" />}
              {featureId === 'schemes' && <FileText className="w-5 h-5" />}
              {featureId === 'guides' && <BookOpen className="w-5 h-5" />}
              {featureId === 'scamshield' && <ShieldAlert className="w-5 h-5" />}
              {featureId === 'documents' && <ScanLine className="w-5 h-5" />}
              {featureId === 'jobs' && <Briefcase className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                {featureId === 'assistant' && t.landing.features.f1.title}
                {featureId === 'schemes' && t.landing.features.f2.title}
                {featureId === 'guides' && t.landing.features.f3.title}
                {featureId === 'scamshield' && t.landing.features.f4.title}
                {featureId === 'documents' && t.landing.features.f5.title}
                {featureId === 'jobs' && t.landing.features.f6.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                DigiSaksham AI • Interactive Public Preview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 flex-1">
          {/* 1. Telugu AI Assistant Preview */}
          {featureId === 'assistant' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <p className="text-emerald-900 leading-relaxed font-medium">
                  {lang === 'te' 
                    ? 'గ్రామీణ పౌరులు తమ మాతృభాషలో మాట్లాడి లేదా టైప్ చేసి సులభంగా సమాధానాలు పొందవచ్చు.'
                    : (lang === 'hi'
                        ? 'ग्रामीण नागरिक अपनी भाषा में सवाल पूछकर चरणबद्ध सरकारी मार्गदर्शन प्राप्त कर सकते हैं।'
                        : 'Rural citizens can ask in their native language and receive simple, step-by-step verified guidance.')}
                </p>
              </div>

              {/* Chat Simulation Box */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 min-h-[180px] max-h-[220px] overflow-y-auto">
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-slate-900 text-white font-medium'
                          : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  lang === 'te' ? 'పీఎం కిసాన్ ఎలా దరఖాస్తు చేయాలి?' : (lang === 'hi' ? 'पीएम किसान योजना विवरण' : 'How to apply for PM-Kisan?'),
                  lang === 'te' ? 'ఆదాయ సర్టిఫికెట్ రుసుము ఎంత?' : (lang === 'hi' ? 'आय प्रमाण पत्र शुल्क' : 'Income certificate fee?'),
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatInput(chip);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium text-[11px] transition"
                  >
                    💡 {chip}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={lang === 'te' ? 'ప్రశ్న టైప్ చేయండి...' : (lang === 'hi' ? 'सवाल यहाँ लिखें...' : 'Type a question...')}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
                <button
                  onClick={handleSendChat}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. Government Scheme Finder Preview */}
          {featureId === 'schemes' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                {lang === 'te' 
                  ? 'ధ్రువీకరించిన సంక్షేమ పథకాల జాబితా మరియు అధికారిక అర్హత నిబంధనలు:' 
                  : (lang === 'hi' 
                      ? 'सत्यापित सरकारी योजनाओं की सूची और आधिकारिक पात्रता नियम:' 
                      : 'Verified welfare schemes catalog with transparent eligibility guidelines:')}
              </p>

              <div className="grid gap-3">
                {[
                  {
                    name: 'PM Kisan Samman Nidhi',
                    name_te: 'పీఎం కిసాన్ సమ్మాన్ నిధి',
                    benefit: '₹6,000 / year via direct benefit transfer in 3 installments',
                    category: 'Farmer Welfare',
                    url: 'https://pmkisan.gov.in',
                  },
                  {
                    name: 'Dr. YSR Aarogyasri / Ayushman Bharat',
                    name_te: 'డాక్టర్ వైఎస్సార్ ఆరోగ్యశ్రీ పథకం',
                    benefit: 'Cashless hospital treatment up to ₹25 Lakhs per family per year',
                    category: 'Universal Health',
                    url: 'https://aarogyasri.ap.gov.in',
                  },
                  {
                    name: 'YSR Pension Kanuka (Old-Age Pension)',
                    name_te: 'వైఎస్సార్ పింఛన్ కానుక (వృద్ధాప్య పింఛన్)',
                    benefit: '₹3,000 monthly direct doorstep delivery for senior citizens (60+)',
                    category: 'Senior Citizens',
                    url: 'https://sspensions.ap.gov.in',
                  }
                ].map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 hover:border-emerald-300 transition">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">
                        {lang === 'te' ? s.name_te : s.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {s.benefit}
                    </p>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-[11px]"
                    >
                      <span>Official Portal: {s.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Step-by-Step Guide Preview */}
          {featureId === 'guides' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-900 text-xs">MeeSeva Income Certificate Guide</h4>
                  <p className="text-[11px] text-amber-800">Statutory Fee: ₹35 - ₹45 • Timeline: 3 to 7 working days</p>
                </div>
                <Banknote className="w-6 h-6 text-amber-600" />
              </div>

              <div className="space-y-2.5">
                {[
                  { step: 1, title: 'Gather Documents', desc: 'Aadhaar Card, White Ration Card, and recent electricity bill.' },
                  { step: 2, title: 'Visit Sachivalayam / MeeSeva', desc: 'Submit with Digital Assistant. Pay official ₹35-₹45 statutory fee only.' },
                  { step: 3, title: 'VRO Verification', desc: 'Village Revenue Officer verifies family details and forwards digital approval.' },
                  { step: 4, title: 'Download Signed Certificate', desc: 'Collect authorized printout with QR verification code.' }
                ].map((st) => (
                  <div key={st.step} className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {st.step}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800">{st.title}</h5>
                      <p className="text-slate-600 text-[11px] mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ScamShield AI Fraud Detector Simulator */}
          {featureId === 'scamshield' && (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-rose-900 text-xs">National Cyber Financial Helpline: 1930</h4>
                  <p className="text-[11px] text-rose-800">Golden rule: Receiving money NEVER requires entering your UPI PIN!</p>
                </div>
                <PhoneCall className="w-6 h-6 text-rose-600" />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Test a Suspicious Message or SMS:
                </label>
                <textarea
                  rows={3}
                  value={scamInput}
                  onChange={(e) => setScamInput(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => runScamCheck()}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Scan for Fraud</span>
                </button>
                <button
                  onClick={() => {
                    const sample = 'Electricity power cut tonight at 9:30 PM due to unpaid bill. Call 9876543210 immediately to avoid disconnection.';
                    setScamInput(sample);
                    runScamCheck(sample);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-[11px]"
                >
                  Load Fake Bill SMS
                </button>
              </div>

              {scamResult && (
                <div className={`p-4 rounded-2xl border ${scamResult.isHigh ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'} space-y-2 animate-in fade-in`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${scamResult.isHigh ? 'text-rose-800' : 'text-emerald-800'}`}>
                      {scamResult.risk}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white border">
                      Threat Score: {scamResult.score}%
                    </span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {scamResult.points.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${scamResult.isHigh ? 'text-rose-600' : 'text-emerald-600'}`} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] font-bold text-rose-700 pt-1">
                    Emergency: If money was deducted, immediately call 1930.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 5. Smart Document Assistant Preview */}
          {featureId === 'documents' && (
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                {lang === 'te'
                  ? 'ఇంగ్లీషు అధికారిక నోటీసులు, గెజిట్లు మరియు సర్టిఫికెట్ల నుండి ముఖ్యమైన తేదీలను గుర్తించి సరళమైన తెలుగులోకి అనువదిస్తుంది.'
                  : (lang === 'hi'
                      ? 'सरकारी नोटिस और प्रमाणपत्रों से महत्वपूर्ण तिथियों को पहचानकर सरल भाषा में समझाता है।'
                      : 'Extracts critical deadlines, required actions, and translates English bureaucratic notices into plain language.')}
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sample Official Notice</span>
                <p className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">
                  "REVENUE DEPARTMENT NOTIFICATION: All landholding beneficiaries must submit self-declaration affidavit before 15th December 2026."
                </p>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1 text-[11px]">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Extracted Deadline: 15th December 2026</span>
                  </p>
                  <p>
                    {lang === 'te' 
                      ? 'తెలుగు వివరణ: రైతులు తమ భూమి రికార్డుల ధ్రువీకరణకు అఫిడవిట్ ను డిసెంబర్ 15 లోపు సచివాలయంలో అందజేయాలి.'
                      : 'Explanation: Submit notarized self-declaration affidavit at Village Secretariat before the deadline.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. Job and Skill Finder Preview */}
          {featureId === 'jobs' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                {lang === 'te'
                  ? 'గ్రామీణ యువతకు ఉచిత నైపుణ్య శిక్షణ మరియు ప్రభుత్వ గుర్తింపు పొందిన అప్రెంటిస్‌షిప్ అవకాశాలు:'
                  : (lang === 'hi'
                      ? 'ग्रामीण युवाओं के लिए निःशुल्क कौशल विकास और सरकारी शिक्षुता (Apprenticeship) के अवसर:'
                      : 'Verified skill development courses and government-recognized apprenticeship openings:')}
              </p>

              <div className="grid gap-2.5">
                {[
                  {
                    title: 'Solar Panel Technician Training & Placement',
                    org: 'APSSDC (Andhra Pradesh State Skill Development Corporation)',
                    stipend: 'Free training + ₹8,000/mo stipend',
                    deadline: '15th December 2026',
                  },
                  {
                    title: 'National Apprenticeship Promotion Scheme (NAPS)',
                    org: 'Ministry of Skill Development & Entrepreneurship',
                    stipend: '₹10,500/month',
                    deadline: '30th November 2026',
                  }
                ].map((j, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <h5 className="font-bold text-slate-800 text-xs">{j.title}</h5>
                    <p className="text-slate-500 text-[11px]">{j.org}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-700">
                      <span className="font-semibold text-emerald-700">{j.stipend}</span>
                      <span className="text-slate-400">Deadline: {j.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition text-xs"
          >
            {t.close}
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs flex items-center gap-1.5 shadow-sm"
          >
            <span>Administrator Access</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

