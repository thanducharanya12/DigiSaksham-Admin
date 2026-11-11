import React from 'react';
import { Briefcase, ExternalLink, Calendar, MapPin, Plus } from 'lucide-react';
import { JobOpportunity } from '../types';

export const JobsPage: React.FC = () => {
  const jobs: JobOpportunity[] = [
    {
      id: 1,
      title: 'APSSDC Free Digital & Technical Skills Training',
      organization: 'Andhra Pradesh State Skill Development Corporation (APSSDC)',
      category: 'Skill Training',
      qualification: '10th Pass / Intermediate / ITI',
      location: 'Tenali & Guntur Skill Hubs',
      application_deadline: '2026-12-15',
      is_active: true
    },
    {
      id: 2,
      title: 'National Apprenticeship Promotion Scheme (NAPS)',
      organization: 'Ministry of Skill Development & Entrepreneurship',
      category: 'Apprenticeship',
      qualification: 'ITI / Diploma / Any Graduate',
      location: 'Vijayawada & Guntur Industrial Estates',
      application_deadline: '2026-12-31',
      is_active: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Rural Jobs & Skill Opportunities CMS</h2>
          <p className="text-xs text-slate-500">Curate verified apprenticeships, free skill development, and employment openings</p>
        </div>

        <button
          onClick={() => alert('New Job Opportunity authoring modal')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Post Verified Opportunity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-blue-50 text-blue-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border border-blue-200">
                  {job.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{job.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{job.organization}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p><strong>Qualification:</strong> {job.qualification}</p>
              <div className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Deadline: {job.application_deadline}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">Active</span>
              <a href="https://apssdc.in" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                Portal Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
