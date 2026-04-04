'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/ui/Elements";
import { sopAPI } from '@/lib/api';
import { 
  BookOpen, FileText, Search, 
  ChevronRight, ArrowRight, ShieldAlert,
  Clock, Activity, Terminal
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SOPItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  isCritical: boolean;
  updatedAt: string;
}

export default function SOPServicesPage() {
  const [sops, setSops] = useState<SOPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchSOPs();
  }, []);

  const fetchSOPs = async () => {
    try {
      setLoading(true);
      const res = await sopAPI.getAll({ status: 'published' });
      if (res.success) setSops(res.data);
    } catch (error) {
      console.error('Failed to fetch SOPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(search.toLowerCase()) || 
                         sop.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || sop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(sops.map(s => s.category)))];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-32">
      {/* Hero Header */}
      <section className="relative py-24 bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        
        <Container className="relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold-600 flex items-center justify-center text-navy-950 shadow-2xl">
                <BookOpen size={24} />
              </div>
              <span className="text-gold-500 text-xs font-black uppercase tracking-[0.4em]">Operational Resource Node</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 italic">
              Standard Operating <span className="text-gold-600">Procedures</span>
            </h1>
            
            <p className="text-xl text-navy-200 font-medium leading-relaxed max-w-2xl border-l-4 border-gold-600 pl-8">
              Access the mission-critical documentation and tactical protocols governing the Moksha Sewa operations across the Delhi-NCR network.
            </p>
          </div>
        </Container>
      </section>

      {/* Control Deck */}
      <section className="-mt-12 relative z-20">
        <Container>
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-navy-50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeCategory === cat 
                      ? "bg-navy-950 text-gold-500 shadow-xl shadow-navy-200" 
                      : "bg-navy-50 text-navy-400 hover:bg-navy-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative group w-full md:w-[400px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-200 group-focus-within:text-gold-600 transition-colors" />
              <input
                type="text"
                placeholder="SEARCH PROTOCOLS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-14 pr-8 bg-navy-50/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Manual Library */}
      <section className="py-24">
        <Container>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <div className="w-16 h-16 border-4 border-navy-950 border-t-gold-600 animate-spin rounded-full mb-6" />
              <p className="text-xs font-black uppercase tracking-widest text-navy-950 italic">Synchronizing Tactical Assets...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredSOPs.map((sop) => (
                <Link key={sop._id} href={`/services/sop/${sop.slug}`}>
                  <div className="group bg-white rounded-[2.5rem] border border-navy-50 p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden h-full flex flex-col">
                    {/* Critical Marker */}
                    {sop.isCritical && (
                      <div className="absolute top-6 right-6">
                        <div className="bg-rose-500 text-white p-2 rounded-lg animate-pulse shadow-lg shadow-rose-200">
                          <ShieldAlert size={16} />
                        </div>
                      </div>
                    )}

                    <div className="w-14 h-14 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-950 mb-10 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all duration-500 group-hover:rotate-6">
                      <FileText size={24} />
                    </div>

                    <div className="flex-1 space-y-4">
                      <p className="text-[9px] font-black text-gold-600 uppercase tracking-[0.3em]">{sop.category}</p>
                      <h3 className="text-xl font-black text-navy-950 uppercase tracking-tight group-hover:text-gold-600 transition-colors leading-tight">{sop.title}</h3>
                      <p className="text-xs text-navy-700 font-medium leading-relaxed line-clamp-3 opacity-60">
                        {sop.description || "Comprehensive tactical manual governing field operations and procedural compliance."}
                      </p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-navy-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-300">
                          <Clock size={12} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-navy-300 uppercase tracking-widest leading-none mb-1">Last Update</p>
                          <p className="text-[10px] font-black text-navy-950 uppercase tracking-tight italic">{new Date(sop.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-950 group-hover:bg-gold-600 group-hover:translate-x-2 transition-all duration-500 shadow-sm border border-navy-50">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredSOPs.length === 0 && (
            <div className="py-40 text-center">
              <Terminal size={64} className="mx-auto text-navy-100 mb-8 opacity-20" />
              <h3 className="text-2xl font-black text-navy-950 uppercase tracking-tighter mb-4 italic">No Tactical Assets Located</h3>
              <p className="text-navy-400 font-bold uppercase text-[10px] tracking-widest opacity-50 italic">The selected sector does not contain any published procedures.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Support Footer */}
      <section className="bg-navy-50/50 py-24 rounded-[4rem] mx-8">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white p-12 md:p-20 rounded-[3.5rem] shadow-xl border border-white">
            <div className="max-w-xl">
              <h4 className="text-3xl font-black text-navy-950 uppercase tracking-tighter mb-6 italic">Need <span className="text-gold-600">Clarification?</span></h4>
              <p className="text-lg text-navy-700 font-medium leading-relaxed opacity-60">If you encounter any ambiguities within these protocols or require further operational guidance, our command center is available for support.</p>
            </div>
            <Link href="/contact">
              <button className="px-12 py-6 bg-navy-950 text-gold-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl flex items-center gap-4 group">
                Access Command Center
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
