import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { AdminLanguage } from '../localization/i18n';

interface LanguageSelectorProps {
  currentLang: AdminLanguage;
  onSelectLanguage: (lang: AdminLanguage) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLanguage,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { id: AdminLanguage; label: string; abbr: string }[] = [
    { id: 'en', label: 'English', abbr: 'EN' },
    { id: 'te', label: 'తెలుగు', abbr: 'TE' },
    { id: 'hi', label: 'हिंदी', abbr: 'HI' },
  ];

  const currentOption = options.find((o) => o.id === currentLang) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langId: AdminLanguage) => {
    onSelectLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span className="font-medium text-slate-800">
          {currentOption.label} <span className="text-slate-400 font-mono text-[11px]">({currentOption.abbr})</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white shadow-xl border border-slate-100 py-1 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50">
            Select Language
          </div>
          {options.map((option) => {
            const isSelected = option.id === currentLang;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <span>
                  {option.label} <span className="text-slate-400 text-[11px]">({option.abbr})</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

