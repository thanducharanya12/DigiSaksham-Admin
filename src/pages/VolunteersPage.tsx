import React from 'react';
import { Users, Star, MapPin, CheckCircle, Shield } from 'lucide-react';
import { Volunteer } from '../types';

interface VolunteersPageProps {
  volunteers: Volunteer[];
}

export const VolunteersPage: React.FC<VolunteersPageProps> = ({ volunteers }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Community Volunteer Network</h2>
          <p className="text-xs text-slate-500">Trained local digital coordinators assisting villagers in Tenali Mandal</p>
        </div>

        <button
          onClick={() => alert('Volunteer Verification Protocol initiated.')}
          className="bg-brand-primary hover:bg-brand-dark text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Verify New Volunteer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {volunteers.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{v.full_name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.village}, {v.mandal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-700 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{v.rating}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <p className="font-semibold text-slate-700">Specialization:</p>
                <p className="text-slate-600">{v.specialization}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {v.completed_requests} Requests Resolved
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                v.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {v.is_available ? 'Available' : 'Busy'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
