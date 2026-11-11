import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle, ExternalLink, Headphones } from 'lucide-react';
import { ApplicationGuide } from '../types';

export const GuidesPage: React.FC = () => {
  const [guides] = useState<ApplicationGuide[]>([
    {
      id: 1,
      title: 'How to Apply for an Income Certificate (MeeSeva / Sachivalayam)',
      title_te: 'ఆదాయ ధ్రువీకరణ పత్రం (Income Certificate) ఎలా పొందాలి?',
      service_category: 'certificate',
      official_portal_url: 'https://onlineap.meeseva.gov.in',
      steps_count: 4,
      last_verified_date: '2026-11-01'
    },
    {
      id: 2,
      title: 'How to Setup and Use DigiLocker for Official Certificates',
      title_te: 'డిజిలాకర్ (DigiLocker) ఉపయోగించి ప్రభుత్వ పత్రాలు భద్రపరుచుకోవడం ఎలా?',
      service_category: 'digilocker',
      official_portal_url: 'https://www.digilocker.gov.in',
      steps_count: 3,
      last_verified_date: '2026-11-01'
    },
    {
      id: 3,
      title: 'Integrated Caste & Community Certificate Online Procedure',
      title_te: 'మీసేవ ద్వారా కుల ధ్రువీకరణ పత్రం దరఖాస్తు విధానం',
      service_category: 'certificate',
      official_portal_url: 'https://onlineap.meeseva.gov.in',
      steps_count: 4,
      last_verified_date: '2026-11-01'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Application Guides CMS</h2>
          <p className="text-xs text-slate-500">Step-by-step digital service walk-throughs and audio narratives</p>
        </div>

        <button
          onClick={() => alert('New Guide Authoring Form opened')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Guide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {guides.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border border-emerald-200">
                  {g.service_category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">{g.title}</h3>
              <p className="text-xs text-emerald-700 font-medium mt-1">{g.title_te}</p>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Headphones className="w-4 h-4 text-slate-400" />
                <span>Telugu voice audio available</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">{g.steps_count} ordered steps</span>
              <a
                href={g.official_portal_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Portal Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
