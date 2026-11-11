import React from 'react';
import { Users, FileText, ShieldAlert, Award, HeartHandshake, PhoneCall } from 'lucide-react';
import { AdminStats } from '../types';
import { StatsCard } from '../components/StatsCard';
import { CategoryChart, VillageChart, ServiceDemandRanking } from '../components/Charts';

interface DashboardPageProps {
  stats: AdminStats;
  onNavigateTab: (tab: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ stats, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-primary rounded-3xl p-6 text-white shadow-xl shadow-brand-dark/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-400/20 text-emerald-300 font-semibold text-xs px-3 py-1 rounded-full border border-emerald-400/30">
            Community Service Project (CSP) Active Deployment
          </span>
          <h2 className="text-2xl font-black mt-2 tracking-tight">Village Digital Empowerment Control Center</h2>
          <p className="text-emerald-100 text-sm max-w-2xl mt-1">
            Monitoring rural digital literacy, scam detections, scheme discovery, and volunteer dispatch across Tenali Mandal villages.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('requests')}
            className="bg-white text-brand-dark font-bold text-xs px-4 py-2.5 rounded-xl shadow hover:bg-emerald-50 transition flex items-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            Dispatch Volunteers ({stats.pending_help_requests} Pending)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Registered Villagers"
          value={stats.total_registered_users}
          trend="+18% this month"
          subtitle="4 rural villages in Tenali"
          icon={<Users className="w-5 h-5" />}
          color="emerald"
        />
        <StatsCard
          title="Verified Welfare Schemes"
          value={stats.active_schemes_count}
          subtitle="100% source-verified"
          icon={<FileText className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="ScamShield Scans"
          value={stats.scam_scans_performed}
          trend="8 high-risk blocked"
          subtitle="Lottery & power cut traps"
          icon={<ShieldAlert className="w-5 h-5" />}
          color="amber"
        />
        <StatsCard
          title="Avg Digital Confidence"
          value={`${stats.average_digital_confidence_score}%`}
          subtitle="Assessed via quizzes & guides"
          icon={<Award className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={stats.category_distribution} />
        <VillageChart data={stats.village_distribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServiceDemandRanking data={stats.top_demanded_services} />
        </div>

        {/* Quick Emergency Status Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Rural Support Helplines</h3>
            <p className="text-xs text-slate-500 mb-4">Official emergency response hotlines</p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-900">1930 - Cyber Fraud</p>
                  <p className="text-[11px] text-rose-600">Immediate financial cyber fraud freeze</p>
                </div>
                <PhoneCall className="w-4 h-4 text-rose-700" />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-900">1800-180-1551 - Kisan Call</p>
                  <p className="text-[11px] text-emerald-600">Free Telugu agricultural guidance</p>
                </div>
                <PhoneCall className="w-4 h-4 text-emerald-700" />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-900">108 / 104 - Health & Ambulance</p>
                  <p className="text-[11px] text-blue-600">24/7 emergency response & Arogya Vani</p>
                </div>
                <PhoneCall className="w-4 h-4 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-500">
              Verified Volunteers Active: <strong>{stats.verified_volunteers_count} in service</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
