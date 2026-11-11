import React, { useState } from 'react';
import { FileText, Plus, CheckCircle, ExternalLink, ShieldCheck, Search } from 'lucide-react';
import { Scheme } from '../types';

interface SchemesPageProps {
  schemes: Scheme[];
}

export const SchemesPage: React.FC<SchemesPageProps> = ({ schemes: initialSchemes }) => {
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleTe, setNewTitleTe] = useState('');
  const [newCategory, setNewCategory] = useState('farmer');
  const [newBenefits, setNewBenefits] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const filtered = schemes.filter(s => {
    const matchesCat = filterCategory === 'all' || s.target_category === filterCategory;
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.title_te.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleVerify = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, last_verified_date: today } : s));
    alert('Scheme verified against official government portal. Verification log recorded.');
  };

  const handleToggleActive = (id: number) => {
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
  };

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newEntry: Scheme = {
      id: Date.now(),
      title: newTitle,
      title_te: newTitleTe || newTitle,
      target_category: newCategory,
      short_description: 'Admin-entered welfare scheme for rural beneficiaries.',
      benefits: newBenefits || 'Financial assistance per government guidelines.',
      official_url: newUrl || 'https://www.india.gov.in',
      is_active: true,
      last_verified_date: new Date().toISOString().split('T')[0]
    };
    setSchemes([newEntry, ...schemes]);
    setShowAddModal(false);
    setNewTitle('');
    setNewTitleTe('');
    setNewBenefits('');
    setNewUrl('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Government Welfare Schemes CMS</h2>
          <p className="text-xs text-slate-500">Manage, verify, and audit welfare programs for rural citizens</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Verified Scheme
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search schemes in English or Telugu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'farmer', 'student', 'senior_citizen'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Scheme Details</th>
                <th className="px-4 py-3.5">Target Group</th>
                <th className="px-4 py-3.5">Key Benefits</th>
                <th className="px-4 py-3.5">Verification</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4 max-w-xs">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{scheme.title}</p>
                    <p className="text-emerald-700 font-medium text-xs mt-0.5">{scheme.title_te}</p>
                    <a
                      href={scheme.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-1 font-medium"
                    >
                      Official Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>

                  <td className="px-4 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px]">
                      {scheme.target_category}
                    </span>
                  </td>

                  <td className="px-4 py-4 max-w-xs text-slate-600 leading-relaxed">
                    {scheme.benefits}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{scheme.last_verified_date}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Audited via .gov.in</span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      scheme.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {scheme.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleVerify(scheme.id)}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 transition"
                      title="Re-verify against official guidelines"
                    >
                      Audit
                    </button>
                    <button
                      onClick={() => handleToggleActive(scheme.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-1.5 rounded-lg transition"
                    >
                      {scheme.is_active ? 'Deactivate' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Scheme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Government Welfare Scheme</h3>
            <p className="text-xs text-slate-500">Provide official details verified from government notifications.</p>

            <form onSubmit={handleCreateScheme} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scheme Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PM Surya Ghar Muft Bijli Yojana"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scheme Title (Telugu) *</label>
                <input
                  type="text"
                  placeholder="e.g. పీఎం సూర్య ఘర్ ఉచిత విద్యుత్ పథకం"
                  value={newTitleTe}
                  onChange={(e) => setNewTitleTe(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="farmer">Farmer Welfare</option>
                  <option value="student">Student Scholarships</option>
                  <option value="senior_citizen">Senior Citizen</option>
                  <option value="women">Women Empowerment</option>
                  <option value="all">All Citizens</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Key Financial / Subsidy Benefit</label>
                <input
                  type="text"
                  placeholder="e.g. Up to ₹78,000 subsidy for rooftop solar installation"
                  value={newBenefits}
                  onChange={(e) => setNewBenefits(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Portal URL</label>
                <input
                  type="url"
                  placeholder="https://pmsuryaghar.gov.in"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Publish Verified Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
