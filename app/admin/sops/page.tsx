'use client';

import { useState, useEffect } from 'react';
import { sopAPI } from '@/lib/api';
import { 
  FileText, Search, PlusCircle, 
  Filter, BookOpen, AlertCircle, 
  MoreVertical, Edit3, Trash2, 
  ExternalLink, CheckCircle2, Clock, 
  ShieldAlert, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import { PageHeader, LoadingSpinner, ActionButton } from '@/components/admin/AdminComponents';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SOPItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  description: string;
  isCritical: boolean;
  version: number;
  updatedAt: string;
  views: number;
}

export default function SOPManagement() {
  const [sops, setSops] = useState<SOPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchSOPs();
  }, []);

  const fetchSOPs = async () => {
    try {
      setLoading(true);
      const res = await sopAPI.getAll();
      if (res.success) setSops(res.data);
    } catch (error) {
      console.error('Failed to fetch SOPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`AUTHORIZED PERSONNEL ONLY: Are you sure you want to terminate SOP "${title}"? This action is irreversible.`)) return;
    try {
      setDeleting(id);
      await sopAPI.delete(id);
      setSops(sops.filter(s => s._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(search.toLowerCase()) || 
                         sop.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || sop.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(sops.map(s => s.category)))];

  if (loading) return <LoadingSpinner size="lg" message="Synchronizing procedural manuals..." />;

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-32">
      <PageHeader
        title="Standard Operating Procedures"
        description="Manage mission-critical documentation and operational protocols across the Moksha network."
        icon={<BookOpen className="w-8 h-8 text-gold-500" />}
      >
        <Link href="/admin/sops/create">
          <button className="flex items-center gap-3 px-8 py-4 bg-navy-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 hover:text-navy-950 transition-all shadow-xl active:scale-95 group">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Establish New Protocol
          </button>
        </Link>
      </PageHeader>

      {/* Logic Deck: Filters & View Switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-navy-50 shadow-xl">
        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 group-focus-within:text-gold-600 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH PROTOCOLS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-14 pr-8 bg-white border border-navy-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all shadow-inner"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  categoryFilter === cat 
                    ? "bg-navy-950 text-gold-500 shadow-lg shadow-navy-200" 
                    : "bg-navy-50 text-navy-700 hover:bg-navy-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center bg-navy-50 p-1.5 rounded-2xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-3 rounded-xl transition-all", viewMode === 'grid' ? "bg-white text-navy-950 shadow-md" : "text-navy-400 hover:text-navy-700")}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-3 rounded-xl transition-all", viewMode === 'list' ? "bg-white text-navy-950 shadow-md" : "text-navy-400 hover:text-navy-700")}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSOPs.map((sop) => (
            <div key={sop._id} className="group relative bg-white rounded-[2.5rem] border border-navy-50 p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden">
              {/* Critical Indicator */}
              {sop.isCritical && (
                <div className="absolute top-0 right-0 p-8">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 animate-pulse">
                    <ShieldAlert size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest italic">Critical Protocol</span>
                  </div>
                </div>
              )}

              {/* Status & Version */}
              <div className="flex items-center justify-between mb-8">
                <div className={cn(
                  "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                  sop.status === 'published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gold-50 text-gold-600 border-gold-100"
                )}>
                  {sop.status}
                </div>
                <div className="text-[10px] font-black text-navy-300 uppercase tracking-widest">v{sop.version}.0</div>
              </div>

              {/* Icon & Category */}
              <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-950 mb-8 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all duration-500 shadow-inner group-hover:rotate-12">
                <FileText size={32} />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-navy-950 uppercase tracking-tight group-hover:text-gold-600 transition-colors">{sop.title}</h3>
                <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest border-l-2 border-navy-50 pl-4">{sop.category}</p>
                <p className="text-xs text-navy-700 leading-relaxed line-clamp-3 font-medium opacity-80">{sop.description || "No baseline information established for this protocol."}</p>
              </div>

              <div className="mt-10 pt-8 border-t border-navy-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-400">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-navy-300 uppercase tracking-widest leading-none mb-1">Updated</p>
                    <p className="text-[10px] font-black text-navy-950 uppercase tracking-tight italic">{new Date(sop.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/sops/edit/${sop._id}`}>
                    <button className="p-3 rounded-xl bg-navy-50 text-navy-950 hover:bg-navy-950 hover:text-gold-500 transition-all active:scale-90">
                      <Edit3 size={16} />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(sop._id, sop.title)}
                    disabled={deleting === sop._id}
                    className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    {deleting === sop._id ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-navy-50 overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest text-left">Manual Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest text-left">Sector</th>
                <th className="px-10 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest text-left">Clearance</th>
                <th className="px-10 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest text-left">Sync Stat</th>
                <th className="px-10 py-6 text-[10px] font-black text-navy-400 uppercase tracking-widest text-right">Cmd Deck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filteredSOPs.map(sop => (
                <tr key={sop._id} className="hover:bg-navy-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-navy-950 rounded-xl flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-navy-950 uppercase tracking-tight">{sop.title}</p>
                        <p className="text-[9px] text-navy-400 font-bold uppercase tracking-widest mt-1 italic">/p/docs/sop/{sop.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[11px] font-black text-navy-950 uppercase tracking-widest italic">{sop.category}</td>
                  <td className="px-10 py-8">
                    <div className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit border",
                      sop.status === 'published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gold-50 text-gold-600 border-gold-100"
                    )}>
                      {sop.status}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[11px] font-black text-navy-950 font-mono tracking-tighter">
                    {new Date(sop.updatedAt).toLocaleTimeString()} <span className="text-navy-300 ml-2 font-sans italic opacity-50 text-[9px]">G-SYNC</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <Link href={`/admin/sops/edit/${sop._id}`}>
                        <button className="px-6 py-2.5 bg-navy-950 text-gold-500 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl active:scale-95">Configure</button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(sop._id, sop.title)}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredSOPs.length === 0 && (
        <div className="bg-navy-50/50 rounded-[3rem] p-24 text-center border-2 border-dashed border-navy-100">
          <BookOpen size={64} className="mx-auto text-navy-200 mb-8 opacity-20" />
          <h3 className="text-2xl font-black text-navy-950 uppercase tracking-tighter mb-4 italic">No Protocol Assets Detected</h3>
          <p className="text-navy-700 font-bold uppercase text-[10px] tracking-widest mb-10 opacity-50 italic">Sector documentation is currently empty or offline.</p>
          <Link href="/admin/sops/create">
            <button className="px-10 py-5 bg-navy-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl italic">Initialize New Asset Node</button>
          </Link>
        </div>
      )}
    </div>
  );
}

function RotateCcw({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M3.51 15C4.69018 17.5847 6.81232 19.5694 9.42152 20.5262C12.0307 21.4831 14.9388 21.345 17.5235 20.1417C20.1082 18.9383 22.1834 16.7469 23.2996 14.0416C24.4158 11.3362 24.4955 8.31825 23.52 5.54999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
