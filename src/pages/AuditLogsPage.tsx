import React from 'react';
import { CheckCircle2, ShieldCheck, History } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const auditLogs = [
    {
      id: 1,
      entity: 'Scheme: PM Kisan Samman Nidhi',
      verified_by: 'DigiSaksham Lead Admin (ID: 1)',
      official_source: 'https://pmkisan.gov.in',
      timestamp: '2026-11-04 18:30:15',
      status: 'Source Verified',
      notes: 'Confirmed 18th installment DBT guidelines and Pattadar passbook criteria.'
    },
    {
      id: 2,
      entity: 'Guide: MeeSeva Income Certificate',
      verified_by: 'DigiSaksham Lead Admin (ID: 1)',
      official_source: 'https://onlineap.meeseva.gov.in',
      timestamp: '2026-11-04 19:10:40',
      status: 'Source Verified',
      notes: 'Audited statutory fee (₹35) and VRO verification timeline (3-7 days).'
    },
    {
      id: 3,
      entity: 'ScamShield Rule: WhatsApp Lucky Draw Trap',
      verified_by: 'Cyber Safety Coordinator',
      official_source: 'https://cybercrime.gov.in',
      timestamp: '2026-11-04 21:00:00',
      status: 'Pattern Updated',
      notes: 'Added regex rule for fake KBC lucky draw APK download shortlinks.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Content Verification & Audit Trail</h2>
        <p className="text-xs text-slate-500">Immutable audit log documenting factual verification against official government sources</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{log.entity}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {log.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{log.notes}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Source: <a href={log.official_source} target="_blank" rel="noreferrer" className="text-blue-600 underline">{log.official_source}</a></span>
                  <span>•</span>
                  <span>Verified by: {log.verified_by}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono flex items-center gap-1 self-end sm:self-center">
                <History className="w-3.5 h-3.5" />
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
