import React, { useState } from 'react';
import { LifeBuoy, CheckCircle2, Clock, MapPin, User, ArrowRight } from 'lucide-react';
import { HelpRequest, Volunteer } from '../types';

interface HelpRequestsPageProps {
  requests: HelpRequest[];
  volunteers: Volunteer[];
}

export const HelpRequestsPage: React.FC<HelpRequestsPageProps> = ({ 
  requests: initialRequests,
  volunteers 
}) => {
  const [requests, setRequests] = useState<HelpRequest[]>(initialRequests);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = requests.filter(r => filterStatus === 'all' || r.status === filterStatus);

  const handleAssign = (requestId: number) => {
    const volunteerName = volunteers[0]?.full_name || 'Swathi Reddy';
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'assigned', assigned_volunteer_name: volunteerName } : r));
    alert(`Request #${requestId} assigned to volunteer: ${volunteerName}`);
  };

  const handleComplete = (requestId: number) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'completed', resolved_at: 'Just now', user_rating: 5 } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Help Requests & Dispatch Tracker</h2>
          <p className="text-xs text-slate-500">Connecting rural community members with verified local digital volunteers</p>
        </div>

        <div className="flex items-center space-x-2">
          {['all', 'pending', 'assigned', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((req) => (
          <div key={req.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  req.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : req.status === 'assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {req.status}
                </span>
                <span className="text-xs text-slate-400">Request #{req.id}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {req.created_at}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{req.title}</h3>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{req.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {req.village}, {req.mandal}
                </span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                  Phone: {req.contact_phone_masked} (Masked)
                </span>
                {req.assigned_volunteer_name ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Assigned: {req.assigned_volunteer_name}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-center">
              {req.status === 'pending' && (
                <button
                  onClick={() => handleAssign(req.id)}
                  className="bg-brand-primary hover:bg-brand-dark text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  Dispatch Volunteer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {req.status === 'assigned' && (
                <button
                  onClick={() => handleComplete(req.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                </button>
              )}

              {req.status === 'completed' && (
                <div className="text-right">
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-4 h-4" /> Resolved
                  </span>
                  <span className="text-[11px] text-amber-600 font-bold">Rating: ★★★★★</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
