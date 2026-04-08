'use client';

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { cn, getSafeSrc } from "@/lib/utils";
import { 
  Search, 
  MapPin, 
  ArrowUpRight, 
  Calendar,
  ShieldCheck,
  FileBadge,
  Globe,
  Share2,
  Newspaper
} from "lucide-react";
import { usePageConfig } from "@/hooks/usePageConfig";
import { pressConfig } from "@/config/press.config";

export default function PressRoomPage() {
  const { config: pageConfig, loading: configLoading } = usePageConfig('press', pressConfig);
  const activeConfig = pageConfig || pressConfig;

  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content?type=press&status=published`);
      const result = await res.json();
      if (result.success) {
        setReleases(result.data.content);
      }
    } catch (error) {
      console.error('Failed to fetch press releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = releases.map(d => d.category);
    return ["All", ...Array.from(new Set(cats.filter(Boolean)))];
  }, [releases]);

  const filteredReleases = useMemo(() => {
    return releases.filter((pr) => {
      const matchesCategory = activeCategory === "All" || pr.category === activeCategory;
      const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pr.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [releases, activeCategory, searchQuery]);

  if (loading || configLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center">
        <Newspaper className="animate-pulse text-navy-900 mb-6" size={48} />
        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-navy-400 italic">Syncing Official Archives...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] text-navy-950 font-sans selection:bg-gold-500 selection:text-navy-950">
      {/* 🏙️ Authoritative Hero - REFINED NAVY & GOLD PALETTE */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-52 bg-white overflow-hidden border-b border-navy-100/50">
        <div className="absolute inset-0 z-0 opacity-[0.04] md:opacity-[0.08] pointer-events-none">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#1a2e4a 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="absolute -top-40 -right-20 w-full h-[600px] md:h-[1000px] bg-gradient-to-l from-navy-50/40 via-navy-100/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-navy-50/30 to-transparent pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-6xl">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-navy-100 mb-8 md:mb-14 animate-fade-in shadow-[0_10px_30px_rgba(26,46,74,0.05)]">
              <div className="w-2.5 h-2.5 rounded-full bg-gold-600 animate-pulse" />
              <p className="text-navy-600 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em] leading-none text-center">
                {activeConfig.hero?.badge || "Official Media Syndicate . Prime"}
              </p>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.8rem] font-black uppercase tracking-tighter leading-[0.88] mb-12 md:mb-16 animate-fade-in italic text-navy-950 break-words drop-shadow-sm">
              {activeConfig.hero?.title || "GLOBAL"} <br />
              <span className="text-gold-600 drop-shadow-[0_10px_20px_rgba(217,119,6,0.1)]">
                {activeConfig.hero?.subtitle || "PRESS ROOM"}
              </span>
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-12 md:pt-16 border-t-[4px] md:border-t-[6px] border-navy-950 max-w-5xl">
                <div className="w-full">
                   <p className="text-navy-700 text-xl md:text-3xl font-medium tracking-tight leading-snug md:leading-snug max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {activeConfig.hero?.description || "The centralized depository for authorized statements, media protocols, and official institutional announcements."}
                   </p>
                </div>
                <div className="flex items-center gap-10 opacity-30 grayscale self-start md:self-auto border-l-2 border-navy-100 pl-10 hidden md:flex">
                   <div className="flex flex-col gap-2.5">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-navy-900">Integrity</span>
                       <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-navy-700" />
                   </div>
                   <div className="flex flex-col gap-2.5">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-navy-900">Network</span>
                       <Globe className="w-8 h-8 md:w-10 md:h-10 text-navy-700" />
                   </div>
                </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 🧭 Control Deck - REFINED NAVY/GOLD CONTRAST */}
      <section className="sticky top-16 z-[100] py-6 md:py-10 bg-white/95 backdrop-blur-3xl border-y border-navy-50 shadow-[0_20px_40px_rgba(26,46,74,0.03)]">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="w-full lg:w-auto overflow-x-auto scrollbar-none -mx-6 lg:mx-0 px-6 lg:px-0">
              <div className="flex items-center gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-10 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-700 whitespace-nowrap border-2",
                      activeCategory === cat 
                        ? "bg-navy-950 border-navy-950 text-gold-500 shadow-[0_15px_40px_rgba(26,46,74,0.2)] scale-105" 
                        : "bg-white border-navy-50 text-navy-400 hover:border-navy-950 hover:text-navy-950"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-[450px] group shadow-2xl shadow-navy-900/5 rounded-[2.2rem]">
              <Search className="absolute left-6 md:left-9 top-1/2 -translate-y-1/2 text-navy-300 group-focus-within:text-navy-950 transition-colors w-5 h-5 md:w-6 md:h-6" />
              <input 
                type="text" 
                placeholder="SEARCH ARCHIVES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 md:h-20 pl-16 md:pl-24 pr-10 bg-white rounded-[2.2rem] border-2 border-navy-50 text-[11px] md:text-[13px] font-black uppercase tracking-widest focus:ring-8 focus:ring-navy-900/5 focus:border-navy-950 transition-all outline-none placeholder:text-navy-50 shadow-sm"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 📁 Protocol Grid - REFINED GRID COLOR */}
      <section className="py-20 md:py-32 relative bg-[#fafafa]">
        <Container>
          {filteredReleases.length === 0 ? (
            <div className="py-40 md:py-72 text-center bg-white rounded-[3rem] md:rounded-[5rem] border-2 border-dashed border-navy-100 px-6 shadow-sm">
              <FileBadge className="mx-auto text-navy-100 mb-10 w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
              <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-navy-100 mb-6">Archive Empty</h2>
              <p className="text-navy-900/30 font-bold uppercase tracking-widest text-xs md:text-sm italic">System synchronized. No statements found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
              {filteredReleases.map((pr) => (
                <Link key={pr._id} href={`/press/${pr.slug}`} className="group relative block w-full h-full">
                  <div className="bg-white rounded-[3rem] p-6 border border-navy-50 shadow-[0_20px_60px_rgba(26,46,74,0.02)] hover:shadow-[0_45px_100px_rgba(26,46,74,0.08)] transition-all duration-700 translate-y-0 hover:translate-y-[-12px] flex flex-col h-full overflow-hidden">
                    
                    <div className="w-full aspect-[2/1] relative rounded-[2.2rem] overflow-hidden bg-navy-50 shadow-inner mb-8">
                      <Image 
                        src={getSafeSrc(pr.featuredImage?.url)} 
                        alt={pr.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-[5000ms]"
                      />
                      <div className="absolute inset-0 bg-navy-950/15 group-hover:bg-transparent transition-colors duration-1000" />
                      <div className="absolute top-6 left-6">
                         <div className="px-6 py-2 bg-white/95 backdrop-blur-3xl rounded-full text-[10px] font-black uppercase tracking-widest text-gold-600 shadow-2xl border border-gold-50/50">
                             {pr.category || 'PRESS_DEPT'}
                         </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                         <span className="text-[11px] font-black text-gold-600 uppercase tracking-[0.15em] flex items-center gap-2">
                            <FileBadge className="w-5 h-5" /> GRAND_RELEASE
                         </span>
                         <div className="w-1.5 h-1.5 rounded-full bg-navy-100" />
                         <span className="text-[11px] font-black text-navy-400 uppercase tracking-widest font-sans italic">
                             ARCHIVE_{new Date(pr.publishedAt || pr.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                         </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black text-navy-950 uppercase italic tracking-tighter leading-tight group-hover:text-gold-600 transition-colors duration-700 mb-6 line-clamp-3">
                        {pr.title}
                      </h3>
                      
                      <p className="text-navy-600/60 text-lg font-medium leading-relaxed line-clamp-3 italic mb-10 border-l-4 border-navy-50 pl-6 group-hover:border-gold-400 transition-all duration-700">
                        "{pr.excerpt}"
                      </p>

                      <div className="mt-auto pt-8 border-t border-navy-50 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-widest text-navy-950 line-clamp-1">{pr.author?.name || 'Moksha Secretariat'}</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold-600/40">AUTHENTICATOR</span>
                         </div>
                         
                         <div className="flex items-center gap-3">
                             <div className="w-14 h-14 bg-navy-950 rounded-2xl flex items-center justify-center text-gold-500 hover:bg-gold-600 hover:text-navy-950 transition-all duration-700 shadow-xl group-hover:scale-105">
                                <ArrowUpRight className="w-7 h-7" strokeWidth={3} />
                             </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 🏛️ Official Footer - REFINED CONTRAST */}
      <section className="py-24 md:py-32 bg-white border-t-2 border-navy-100">
          <Container className="text-center">
              <ShieldCheck className="text-gold-600/10 mx-auto mb-14 w-16 h-16 md:w-20 md:h-20" />
              <h2 className="text-5xl md:text-[10rem] font-black uppercase italic tracking-tighter text-navy-100 mb-20 md:mb-24 overflow-hidden drop-shadow-sm">
                {activeConfig.footer?.title || "REPOSITORY_ALPHA"}
              </h2>
              <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 pt-16 md:pt-20 border-t border-navy-50 px-6">
                  {(activeConfig.footer?.categories || ['INTEGRITY', 'JURISDICTION', 'SYSTEM', 'ACCESS']).map(cat => (
                      <div key={cat} className="flex flex-col gap-2">
                          <span className="text-[9px] font-black text-gold-600/30 uppercase tracking-[0.2em]">{activeConfig.footer?.protocolLabel || "PROTOCOL"}</span>
                          <span className="text-[11px] md:text-[12px] font-black text-navy-400 uppercase tracking-[0.5em] hover:text-gold-600 transition-colors cursor-default">{cat}</span>
                      </div>
                  ))}
              </div>
          </Container>
      </section>

      <style jsx global>{`
        .animate-fade-in {
            animation: fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
