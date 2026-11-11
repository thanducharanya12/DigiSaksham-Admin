import React from 'react';
import { ShieldCheck, LogOut, Bell, UserCircle2 } from 'lucide-react';
import { AdminLanguage, adminTranslations } from '../localization/i18n';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  onLogout: () => void;
  lang: AdminLanguage;
  onSelectLanguage: (lang: AdminLanguage) => void;
  t: typeof adminTranslations.en;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onLogout, 
  lang, 
  onSelectLanguage, 
  t 
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/20">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg text-slate-900 tracking-tight">{t.portalTitle}</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
              {t.adminBadge}
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            {t.portalSubtitle.split('•')[1]?.trim() || t.portalSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Compact Language Selector dropdown in top-right */}
        <LanguageSelector currentLang={lang} onSelectLanguage={onSelectLanguage} />

        <div className="hidden xl:flex items-center space-x-2 text-xs bg-slate-100 py-1.5 px-3 rounded-full text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t.targetArea}</span>
        </div>

        <button 
          title="Notifications"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <UserCircle2 className="w-8 h-8 text-emerald-700" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">{t.adminLead}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.subLead}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title={t.logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">{t.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
