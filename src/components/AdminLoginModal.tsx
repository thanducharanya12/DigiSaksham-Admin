import React, { useState } from 'react';
import { ShieldCheck, Lock, Phone, ArrowRight, X, Sparkles, AlertCircle } from 'lucide-react';
import { AdminLanguage, adminTranslations } from '../localization/i18n';
import { LanguageSelector } from './LanguageSelector';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AdminLanguage;
  onSelectLanguage: (lang: AdminLanguage) => void;
  onLoginSuccess: (phone: string, pass: string) => Promise<void>;
  loginError: string;
  isLoggingIn: boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectLanguage,
  onLoginSuccess,
  loginError,
  isLoggingIn,
}) => {
  if (!isOpen) return null;

  const t = adminTranslations[lang];
  const [phone, setPhone] = useState('9999999999');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(phone, password);
  };

  const handleFillOnly = () => {
    setPhone('9999999999');
    setPassword('admin123');
  };

  const handleQuickSignIn = () => {
    setPhone('9999999999');
    setPassword('admin123');
    onLoginSuccess('9999999999', 'admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150">
        {/* Top Bar with Language Selector and Close Button */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
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

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-slate-900/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {t.modalTitle}
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {t.adminBadge}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {t.modalSubtitle}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">{t.phoneLabel}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">{t.passwordLabel}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              <span>{isLoggingIn ? t.authenticating : t.signInBtn}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>

          {/* Demonstration Credentials Card */}
          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {t.demoBannerTitle}
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                DEMO
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between font-mono text-slate-700 text-[11px]">
              <div>
                <span className="text-slate-400">Phone: </span>
                <strong className="text-emerald-800">9999999999</strong>
              </div>
              <div className="h-3 w-px bg-slate-200"></div>
              <div>
                <span className="text-slate-400">Pass: </span>
                <strong className="text-emerald-800">admin123</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleFillOnly}
                className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold border border-slate-200 text-[11px] transition text-center"
              >
                {t.fillCredentialsBtn}
              </button>
              <button
                type="button"
                onClick={handleQuickSignIn}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition shadow-sm flex items-center justify-center gap-1"
              >
                <span>{t.quickSignInBtn}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            {t.academicFooter}
          </p>
        </div>
      </div>
    </div>
  );
};

