import React from 'react';

interface CategoryData {
  category: string;
  count: number;
}

interface VillageData {
  village: string;
  user_count: number;
  active_requests: number;
}

interface ServiceData {
  name: string;
  usage: number;
}

export const CategoryChart: React.FC<{ data: CategoryData[] }> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const colors = ['#2d6a4f', '#1d3557', '#e76f51', '#f4a261'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <h3 className="font-bold text-slate-900 text-base mb-1">Rural Beneficiary Demographics</h3>
      <p className="text-xs text-slate-500 mb-5">Distribution of registered users across community categories</p>
      
      <div className="space-y-3.5">
        {data.map((item, idx) => {
          const pct = Math.round((item.count / total) * 100);
          return (
            <div key={item.category}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">{item.category}</span>
                <span className="text-slate-500">{item.count} users ({pct}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${pct}%`, backgroundColor: colors[idx % colors.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const VillageChart: React.FC<{ data: VillageData[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.user_count), 25);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <h3 className="font-bold text-slate-900 text-base mb-1">Village-Wise Penetration & Active Cases</h3>
      <p className="text-xs text-slate-500 mb-5">Tenali Mandal field engagement metrics</p>

      <div className="space-y-4">
        {data.map((item) => {
          const widthPct = Math.round((item.user_count / max) * 100);
          return (
            <div key={item.village} className="flex items-center space-x-3 text-xs">
              <span className="w-28 font-semibold text-slate-700 truncate">{item.village}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span className="w-16 font-bold text-slate-900 text-right">{item.user_count} users</span>
              {item.active_requests > 0 ? (
                <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                  {item.active_requests} req
                </span>
              ) : (
                <span className="text-slate-400 text-[11px]">0 active</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ServiceDemandRanking: React.FC<{ data: ServiceData[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.usage), 50);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <h3 className="font-bold text-slate-900 text-base mb-1">Most Utilized Digital Services</h3>
      <p className="text-xs text-slate-500 mb-5">Ranked by citizen inquiries, scheme queries, and fraud scans</p>

      <div className="space-y-3">
        {data.map((item, idx) => {
          const widthPct = Math.round((item.usage / max) * 100);
          return (
            <div key={item.name} className="flex items-center space-x-3">
              <span className="w-6 text-xs font-bold text-slate-400">#{idx + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-800">
                  <span>{item.name}</span>
                  <span className="text-emerald-700 font-bold">{item.usage} interactions</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-brand-primary h-full rounded-full" 
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
