import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  ArrowRight, 
  X, 
  Sparkles, 
  AlertCircle, 
  UserPlus, 
  User as UserIcon,
  MapPin, 
  Globe2, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { AdminLanguage, adminTranslations } from '../localization/i18n';
import { LanguageSelector } from './LanguageSelector';
import { UserRegisterPayload } from '../types';

export type AuthModalTab = 'citizen-login' | 'citizen-register' | 'admin-login';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: AuthModalTab;
  onClose: () => void;
  lang: AdminLanguage;
  onSelectLanguage: (lang: AdminLanguage) => void;
  onLoginSuccess: (phone: string, pass: string) => Promise<void>;
  onRegisterSuccess: (payload: UserRegisterPayload) => Promise<void>;
  authError: string;
  isSubmitting: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'citizen-login',
  onClose,
  lang,
  onSelectLanguage,
  onLoginSuccess,
  onRegisterSuccess,
  authError,
  isSubmitting,
}) => {
  const [activeTab, setActiveTab] = useState<AuthModalTab>(initialTab);

  // Sync tab with prop on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form states
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('user123');

  // Registration Form states
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCategory, setRegCategory] = useState<string>('farmer');
  const [regVillage, setRegVillage] = useState('Kollipara');
  const [regDistrict, setRegDistrict] = useState('Guntur');
  const [regLang, setRegLang] = useState<'te' | 'en' | 'hi'>('te');

  if (!isOpen) return null;

  const t = adminTranslations[lang];

  // Submit Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(phone, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSuccess({
      full_name: regFullName,
      phone: regPhone,
      password: regPassword,
      category: regCategory,
      village: regVillage,
      district: regDistrict,
      mandal: 'Tenali',
      preferred_language: regLang
    });
  };

  // Pre-fill demo buttons
  const handleCitizenDemoFill = () => {
    setPhone('9876543210');
    setPassword('user123');
  };

  const handleCitizenQuickSignIn = () => {
    setPhone('9876543210');
    setPassword('user123');
    onLoginSuccess('9876543210', 'user123');
  };

  const handleAdminDemoFill = () => {
    setPhone('9999999999');
    setPassword('admin123');
  };

  const handleAdminQuickSignIn = () => {
    setPhone('9999999999');
    setPassword('admin123');
    onLoginSuccess('9999999999', 'admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150 my-6">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Language:
            </span>
            <LanguageSelector currentLang={lang} onSelectLanguage={onSelectLanguage} />
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (Citizen Login | New Registration | Admin Portal) */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('citizen-login');
              setPhone('9876543210');
              setPassword('user123');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'citizen-login'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.auth.citizenTab}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('citizen-register');
              if (!regPhone) setRegPhone('98' + Math.floor(10000000 + Math.random() * 90000000));
              if (!regFullName) setRegFullName('Rama Rao Kollipara');
              if (!regPassword) setRegPassword('securePass123');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'citizen-register'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.auth.registerTab}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin-login');
              setPhone('9999999999');
              setPassword('admin123');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'admin-login'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>{t.auth.adminTab}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Error Banner */}
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center font-medium flex items-center justify-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* TAB 1: CITIZEN SIGN IN */}
          {activeTab === 'citizen-login' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl mx-auto flex items-center justify-center text-emerald-700 shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {t.auth.citizenSignInTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t.auth.citizenSignInSub}
                </p>
              </div>

              {/* Citizen Demo Credentials */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {t.auth.demoCitizenBanner}
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    DEMO USER
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-100 flex items-center justify-between font-mono text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-400">Phone: </span>
                    <strong className="text-emerald-800">9876543210</strong>
                  </div>
                  <div className="h-3 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-slate-400">Pass: </span>
                    <strong className="text-emerald-800">user123</strong>
                  </div>
                </div>
                <div className="flex gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleCitizenDemoFill}
                    className="flex-1 py-1 px-2 text-[10px] bg-white hover:bg-emerald-100/50 text-slate-700 font-bold rounded-lg border border-emerald-200 transition"
                  >
                    {t.fillCredentialsBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleCitizenQuickSignIn}
                    disabled={isSubmitting}
                    className="flex-1 py-1 px-2 text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    {t.quickSignInBtn}
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.auth.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={t.auth.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.auth.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder={t.auth.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? t.auth.signingIn : t.auth.signInBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Toggle to Register */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('citizen-register')}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2"
                >
                  {t.auth.dontHaveAccount}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: NEW CITIZEN REGISTRATION */}
          {activeTab === 'citizen-register' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl mx-auto flex items-center justify-center text-emerald-700 shadow-sm">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {t.auth.registerTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t.auth.registerSub}
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                {/* Full Name */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.auth.fullNameLabel}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder={t.auth.fullNamePlaceholder}
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Mobile & Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.auth.phoneLabel}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        maxLength={10}
                        placeholder={t.auth.phonePlaceholder}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.auth.passwordLabel}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        placeholder={t.auth.passwordPlaceholder}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Preferred Language Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.auth.categoryLabel}
                    </label>
                    <select
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800 font-medium"
                    >
                      <option value="farmer">{t.auth.categories.farmer}</option>
                      <option value="student">{t.auth.categories.student}</option>
                      <option value="homemaker">{t.auth.categories.homemaker}</option>
                      <option value="senior_citizen">{t.auth.categories.senior_citizen}</option>
                      <option value="general">{t.auth.categories.general}</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.auth.languageLabel}
                    </label>
                    <div className="relative">
                      <Globe2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <select
                        value={regLang}
                        onChange={(e) => setRegLang(e.target.value as any)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800 font-medium"
                      >
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Village and District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.auth.villageLabel}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder={t.auth.villagePlaceholder}
                        value={regVillage}
                        onChange={(e) => setRegVillage(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.auth.districtLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Privacy and Zero Credentials notice */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Privacy Protected: No Aadhaar number, bank credentials, or UPI PINs are ever asked or stored.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? t.auth.registering : t.auth.registerBtn}</span>
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('citizen-login')}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2"
                >
                  {t.auth.alreadyHaveAccount}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ADMINISTRATOR SIGN IN */}
          {activeTab === 'admin-login' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-emerald-400 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {t.auth.adminSignInTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t.auth.adminSignInSub}
                </p>
              </div>

              {/* Admin Demo Credentials */}
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {t.auth.demoAdminBanner}
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                    LEAD ADMIN
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-400">Phone: </span>
                    <strong className="text-slate-900">9999999999</strong>
                  </div>
                  <div className="h-3 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-slate-400">Pass: </span>
                    <strong className="text-slate-900">admin123</strong>
                  </div>
                </div>
                <div className="flex gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleAdminDemoFill}
                    className="flex-1 py-1 px-2 text-[10px] bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-300 transition"
                  >
                    {t.fillCredentialsBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminQuickSignIn}
                    disabled={isSubmitting}
                    className="flex-1 py-1 px-2 text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    {t.quickSignInBtn}
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.auth.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="9999999999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.auth.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isSubmitting ? t.auth.signingIn : t.auth.adminSignInTitle}</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

