import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Bot, 
  FileText, 
  BookOpen, 
  ShieldAlert, 
  ScanLine, 
  Briefcase, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Menu, 
  X,
  Volume2,
  Users,
  Award,
  UserPlus
} from 'lucide-react';
import { AdminLanguage, adminTranslations } from '../localization/i18n';
import { LanguageSelector } from './LanguageSelector';
import { FeaturePreviewModal } from './FeaturePreviewModal';

interface LandingPageProps {
  lang: AdminLanguage;
  onSelectLanguage: (lang: AdminLanguage) => void;
  onOpenAuth: (tab: 'citizen-login' | 'citizen-register' | 'admin-login') => void;
  onOpenLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onSelectLanguage,
  onOpenAuth,
  onOpenLogin,
}) => {
  const triggerAuth = (tab: 'citizen-login' | 'citizen-register' | 'admin-login') => {
    if (onOpenAuth) onOpenAuth(tab);
    else if (onOpenLogin) onOpenLogin();
  };

  const t = adminTranslations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const featuresList = [
    {
      id: 'assistant',
      icon: <Bot className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-100/80',
      title: t.landing.features.f1.title,
      desc: t.landing.features.f1.desc,
      tag: t.landing.features.f1.tag,
    },
    {
      id: 'schemes',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100/80',
      title: t.landing.features.f2.title,
      desc: t.landing.features.f2.desc,
      tag: t.landing.features.f2.tag,
    },
    {
      id: 'guides',
      icon: <BookOpen className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-100/80',
      title: t.landing.features.f3.title,
      desc: t.landing.features.f3.desc,
      tag: t.landing.features.f3.tag,
    },
    {
      id: 'scamshield',
      icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-100/80',
      title: t.landing.features.f4.title,
      desc: t.landing.features.f4.desc,
      tag: t.landing.features.f4.tag,
    },
    {
      id: 'documents',
      icon: <ScanLine className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-100/80',
      title: t.landing.features.f5.title,
      desc: t.landing.features.f5.desc,
      tag: t.landing.features.f5.tag,
    },
    {
      id: 'jobs',
      icon: <Briefcase className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50 border-teal-100',
      iconBg: 'bg-teal-100/80',
      title: t.landing.features.f6.title,
      desc: t.landing.features.f6.desc,
      tag: t.landing.features.f6.tag,
    },
  ];

  const helplines = [
    { name: 'National Cyber Financial Helpline', num: '1930', desc: 'Immediate fraud reporting' },
    { name: 'Kisan Call Centre (24x7)', num: '1800-180-1551', desc: 'Ministry of Agriculture' },
    { name: 'Emergency Medical Ambulance', num: '108', desc: 'Free emergency response' },
    { name: 'Health Teleconsultation', num: '104', desc: 'Doctor medical advice' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1. PUBLIC NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo on Left */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/15 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">DigiSaksham AI</span>
                <span className="hidden sm:inline bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  CSP 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Multilingual Digital Empowerment Platform
              </p>
            </div>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#home" className="hover:text-emerald-700 transition">
              {t.landing.nav.home}
            </a>
            <a href="#features" className="hover:text-emerald-700 transition">
              {t.landing.nav.features}
            </a>
            <a href="#about" className="hover:text-emerald-700 transition">
              {t.landing.nav.about}
            </a>
            <a href="#sdgs" className="hover:text-emerald-700 transition">
              {t.landing.nav.csp}
            </a>
          </nav>

          {/* Right: Compact Language Selector, Citizen Login, Register & Admin Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compact Language Selector Dropdown */}
            <LanguageSelector currentLang={lang} onSelectLanguage={onSelectLanguage} />

            {/* New Registration Button */}
            <button
              onClick={() => triggerAuth('citizen-register')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.landing.nav.register}</span>
            </button>

            {/* Citizen Login Button */}
            <button
              onClick={() => triggerAuth('citizen-login')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm hover:shadow transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.landing.nav.citizenLogin}</span>
            </button>

            {/* Admin Login Button */}
            <button
              onClick={() => triggerAuth('admin-login')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm hover:shadow transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.landing.nav.adminLogin}</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs font-semibold text-slate-700 animate-in fade-in duration-150">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              {t.landing.nav.home}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              {t.landing.nav.features}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              {t.landing.nav.about}
            </a>
            <a
              href="#sdgs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              {t.landing.nav.csp}
            </a>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerAuth('citizen-register');
                }}
                className="w-full py-2.5 px-3 bg-emerald-50 text-emerald-800 font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>{t.landing.nav.register}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerAuth('citizen-login');
                }}
                className="w-full py-2.5 px-3 bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>{t.landing.nav.citizenLogin}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerAuth('admin-login');
                }}
                className="w-full py-2.5 px-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.landing.nav.adminLogin}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Soft background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/50 via-teal-50/20 to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.landing.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {t.landing.hero.heading}
              </h1>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.landing.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition transform hover:-translate-y-0.5"
                >
                  <span>{t.landing.hero.exploreFeatures}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => triggerAuth('citizen-login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-sm border border-emerald-200 shadow-sm transition"
                >
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>{t.landing.hero.citizenLoginBtn}</span>
                </button>

                <button
                  onClick={() => triggerAuth('admin-login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm transition"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>{t.landing.hero.adminLoginBtn}</span>
                </button>
              </div>


              {/* 4 Quick Stat Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-xl mx-auto lg:mx-0 text-left">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">24+ Schemes</p>
                  <p className="text-[11px] text-slate-500">{t.landing.hero.stats.schemes}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <p className="font-extrabold text-emerald-700 text-xs sm:text-sm">తెలుగు & Multi</p>
                  <p className="text-[11px] text-slate-500">{t.landing.hero.stats.dialects}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <p className="font-extrabold text-rose-700 text-xs sm:text-sm">1930 Helpline</p>
                  <p className="text-[11px] text-slate-500">{t.landing.hero.stats.fraudDefense}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">Zero Brokers</p>
                  <p className="text-[11px] text-slate-500">{t.landing.hero.stats.satisfaction}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Empowerment Card Stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Digi AI Assistant</h4>
                      <p className="text-[10px] text-slate-400">Tenali Mandal Habitations • Active</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                {/* Simulated Conversational Bubble */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-[11px]">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>నమస్కారం! రైతు సోదరులకు పీఎం కిసాన్ సమ్మాన్ నిధి:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    భూమి ఉన్న రైతులకు ఏడాదికి ₹6,000 నేరుగా బ్యాంక్ ఖాతాలో జమ అవుతుంది. ఆధార్ ఈ-కేవైసీ కోసం గ్రామ సచివాలయాన్ని సంప్రదించండి.
                  </p>
                </div>

                {/* ScamShield Live Risk Badge */}
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <div>
                      <p className="font-bold text-rose-900 text-[11px]">ScamShield AI Protected</p>
                      <p className="text-[10px] text-rose-700">Fake lottery SMS flagged • 1930 Ready</p>
                    </div>
                  </div>
                  <span className="font-bold text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                    SAFE
                  </span>
                </div>

                {/* Citizen Metric Pill */}
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <div>
                      <p className="font-bold text-emerald-950 text-[11px]">Digital Confidence Score</p>
                      <p className="text-[10px] text-emerald-800">Assessed across 150 rural respondents</p>
                    </div>
                  </div>
                  <span className="font-black text-emerald-800 text-xs">78.6%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. APPLICATION FEATURES SECTION (SIX CORE FEATURES) */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
              <span>{t.landing.features.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.landing.features.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.landing.features.subtitle}
            </p>
          </div>

          {/* Six Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((f) => (
              <div
                key={f.id}
                className={`p-6 rounded-3xl border ${f.bg} flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center shadow-sm`}>
                      {f.icon}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-white/90 text-slate-700 rounded-full border border-slate-200 shadow-2xl">
                      {f.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-emerald-800 transition">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setSelectedFeature(f.id)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white font-bold text-xs border border-slate-200 hover:border-slate-900 shadow-sm transition"
                  >
                    <span>{t.landing.features.tryDemo}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT & FIELD RESEARCH (CSP CONTEXT) */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                {t.landing.about.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {t.landing.about.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.landing.about.subtitle}
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{t.landing.about.surveyFact1}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{t.landing.about.surveyFact2}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{t.landing.about.surveyFact3}</p>
                </div>
              </div>
            </div>

            {/* UN Sustainable Development Goals (SDGs) */}
            <div id="sdgs" className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{t.landing.about.sdgTitle}</span>
              </h3>

              <div className="space-y-2.5">
                {t.landing.about.sdgs.map((sdg, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                      {sdg.num}
                    </span>
                    <span className="font-semibold text-slate-800 flex-1 ml-3 text-left">
                      {sdg.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {sdg.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Helplines Row */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-white tracking-tight">
                  {t.landing.about.helplinesTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  Instant one-tap direct dialing integrated across DigiSaksham AI
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full self-start">
                24x7 Verified Numbers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {helplines.map((h, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{h.name}</span>
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-xl font-black text-emerald-400 font-mono">{h.num}</p>
                  <p className="text-[11px] text-slate-400">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PUBLIC FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-slate-800">DigiSaksham AI</span>
            <span>•</span>
            <span>{t.landing.footer.academic}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-slate-900 transition">
              {t.landing.nav.home}
            </a>
            <a href="#features" className="hover:text-slate-900 transition">
              {t.landing.nav.features}
            </a>
            <button
              onClick={onOpenLogin}
              className="text-emerald-700 hover:text-emerald-800 font-bold transition flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>{t.landing.nav.adminLogin}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Feature Demo Modal */}
      <FeaturePreviewModal
        featureId={selectedFeature}
        onClose={() => setSelectedFeature(null)}
        lang={lang}
        t={t}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
};

