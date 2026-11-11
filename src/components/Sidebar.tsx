import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Briefcase, 
  Users, 
  LifeBuoy, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { adminTranslations } from '../localization/i18n';

export type AdminTab = 
  | 'dashboard' 
  | 'schemes' 
  | 'guides' 
  | 'jobs' 
  | 'volunteers' 
  | 'requests' 
  | 'audit';

interface SidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingRequestsCount?: number;
  t: typeof adminTranslations.en;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab,
  pendingRequestsCount = 3,
  t
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: t.tabs.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'schemes', label: t.tabs.schemes, icon: <FileText className="w-5 h-5" /> },
    { id: 'guides', label: t.tabs.guides, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'jobs', label: t.tabs.jobs, icon: <Briefcase className="w-5 h-5" /> },
    { id: 'volunteers', label: t.tabs.volunteers, icon: <Users className="w-5 h-5" /> },
    { 
      id: 'requests', 
      label: t.tabs.requests, 
      icon: <LifeBuoy className="w-5 h-5" />,
      badge: pendingRequestsCount 
    },
    { id: 'audit', label: t.tabs.audit, icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1">
        <p className="px-3 text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">
          {t.management}
        </p>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="text-left">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full ml-1.5 flex-shrink-0">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/70 rounded-xl p-3 text-xs text-slate-400 border border-slate-700/50">
          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            {t.protocolTitle}
          </p>
          <p className="text-[11px] leading-relaxed">
            {t.protocolText}
          </p>
        </div>
      </div>
    </aside>
  );
};
