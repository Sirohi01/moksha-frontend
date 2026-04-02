'use client';

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { cn, getSafeSrc } from "@/lib/utils";
import { 
  Search, 
  Play, 
  ArrowUpRight, 
  Calendar,
  Film,
  Sparkles,
  Award,
  Video
} from "lucide-react";

export default function DocumentariesPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content?type=documentary&status=published`);
      const result = await res.json();
      if (result.success) {
        setDocs(result.data.content);
      }
    } catch (error) {
      console.error('Failed to fetch documentaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = docs.map(d => d.category);
    return ["All", ...Array.from(new Set(cats.filter(Boolean)))];
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchesCategory = activeCategory === "All" || doc.category === activeCategory;
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [docs, activeCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center">
        <Film className="animate-bounce text-amber-600 mb-6" size={48} />
        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-900/40 italic">Syncing Visual Archives...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-900 font-sans selection:bg-amber-600 selection:text-white">
      {/* 🎬 Majestic Hero - REFINED AMBER PALETTE */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-52 bg-white overflow-hidden border-b border-amber-100/50">
        <div className="absolute inset-0 z-0 opacity-[0.03] md:opacity-[0.07] pointer-events-none">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#d97706 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="absolute -top-40 -left-20 w-full h-[600px] md:h-[1000px] bg-gradient-to-br from-amber-100/40 via-amber-50/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-stone-50/50 to-transparent pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-6xl">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-amber-100 mb-8 md:mb-14 animate-fade-in shadow-[0_10px_30px_rgba(217,119,6,0.05)]">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <p className="text-amber-800 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em] leading-none text-center">Theatrical Collection . Prime</p>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.8rem] font-black uppercase tracking-tighter leading-[0.88] mb-12 md:mb-16 animate-fade-in italic text-stone-950 break-words drop-shadow-sm">
              CINEMA <br />
              <span className="text-amber-600 drop-shadow-[0_10px_20px_rgba(217,119,6,0.15)]">MANIFESTO</span>
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-12 md:pt-16 border-t-[4px] md:border-t-[6px] border-stone-950 max-w-5xl">
                <div className="w-full">
                   <p className="text-stone-700 text-xl md:text-3xl font-medium tracking-tight leading-snug md:leading-snug max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Documenting high-integrity narratives of <span className="text-amber-600 font-black italic underline decoration-amber-200 underline-offset-8">human dignity</span> and institutional impact across the globe.
                   </p>
                </div>
                <div className="flex items-center gap-10 opacity-30 grayscale saturate-0 self-start md:self-auto border-l-2 border-amber-100 pl-10 hidden md:flex">
                   <div className="flex flex-col gap-2.5">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900">Archives</span>
                       <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-700" />
                   </div>
                   <div className="flex flex-col gap-2.5">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900">Protocol</span>
                       <Video className="w-8 h-8 md:w-10 md:h-10 text-amber-700" />
                   </div>
                </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 🧭 Control Deck - REFINED AMBER/STONE CONTRAST */}
      <section className="sticky top-16 z-[100] py-6 md:py-10 bg-white/95 backdrop-blur-3xl border-y border-amber-50 shadow-[0_20px_40px_rgba(217,119,6,0.03)]">
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
                        ? "bg-amber-600 border-amber-600 text-white shadow-[0_15px_40px_rgba(217,119,6,0.2)] scale-105" 
                        : "bg-white border-amber-50 text-stone-400 hover:border-amber-600 hover:text-amber-600"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-[450px] group shadow-2xl shadow-amber-900/5 rounded-[2.2rem]">
              <Search className="absolute left-6 md:left-9 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-amber-600 transition-colors w-5 h-5 md:w-6 md:h-6" />
              <input 
                type="text" 
                placeholder="SEARCH PRODUCTIONS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 md:h-20 pl-16 md:pl-24 pr-10 bg-white rounded-[2.2rem] border-2 border-amber-50 text-[11px] md:text-[13px] font-black uppercase tracking-widest focus:ring-8 focus:ring-amber-500/5 focus:border-amber-600 transition-all outline-none placeholder:text-stone-200 shadow-sm"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 🎞️ Collection - THEATRICAL GRID */}
      <section className="py-20 md:py-32 relative bg-[#fafafa]">
        <Container>
          {filteredDocs.length === 0 ? (
            <div className="py-40 md:py-72 text-center bg-white rounded-[3rem] md:rounded-[5rem] border-2 border-dashed border-amber-100 px-6 shadow-sm">
              <Film className="mx-auto text-amber-50 mb-10 w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
              <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-amber-100 mb-6">Archive Synchronized</h2>
              <p className="text-amber-900/30 font-bold uppercase tracking-widest text-xs md:text-sm italic">No entries for this visual frequency.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
              {filteredDocs.map((doc) => (
                <Link key={doc._id} href={`/documentaries/${doc.slug}`} className="group relative block w-full h-full">
                  <div className="bg-white rounded-[3rem] p-6 border border-amber-50 shadow-[0_20px_60px_rgba(0,0,0,0.02)] hover:shadow-[0_45px_100px_rgba(217,119,6,0.08)] transition-all duration-700 translate-y-0 hover:translate-y-[-12px] flex flex-col h-full overflow-hidden">
                    
                    <div className="aspect-[16/10] relative overflow-hidden rounded-[2.2rem] bg-stone-100 shadow-inner mb-8">
                      <Image 
                        src={getSafeSrc(doc.featuredImage?.url)} 
                        alt={doc.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-[6000ms]"
                      />
                      <div className="absolute inset-0 bg-stone-950/15 group-hover:bg-transparent transition-colors duration-1000" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-75 group-hover:scale-100">
                        <div className="w-20 h-20 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(217,119,6,0.4)]">
                          <Play className="fill-white translate-x-1 w-9 h-9" />
                        </div>
                      </div>

                      <div className="absolute top-6 left-6">
                         <div className="px-6 py-2 bg-white/95 backdrop-blur-3xl rounded-full text-[10px] font-black uppercase tracking-widest text-amber-700 shadow-2xl border border-amber-50/50">
                             {doc.category || 'CINEMA_DEPT'}
                         </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                         <span className="text-[11px] font-black text-amber-600 uppercase tracking-[0.15em] flex items-center gap-2">
                            <Award className="w-5 h-5" /> GRAND_CINEMA
                         </span>
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-100" />
                         <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest font-sans italic">
                            ARCHIVE_{new Date(doc.publishedAt || doc.createdAt).getFullYear()}
                         </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black text-stone-900 uppercase italic tracking-tighter leading-tight group-hover:text-amber-600 transition-colors duration-700 mb-6 line-clamp-3">
                        {doc.title}
                      </h3>
                      
                      <p className="text-stone-500 text-lg font-medium leading-relaxed line-clamp-3 italic mb-10 border-l-4 border-amber-50 pl-6 group-hover:border-amber-400 transition-all duration-700">
                        "{doc.excerpt}"
                      </p>

                      <div className="mt-auto pt-8 border-t border-stone-50 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[1.2rem] bg-stone-50 border border-stone-100 flex items-center justify-center text-amber-600 text-sm font-black shadow-inner group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                               {doc.author?.name?.charAt(0) || 'M'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-widest text-stone-950 line-clamp-1">{doc.author?.name || 'Moksha Editorial'}</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600/40">OFFICIAL CREW</span>
                            </div>
                         </div>
                         
                         <div className="w-14 h-14 bg-stone-950 rounded-2xl flex items-center justify-center text-amber-500 hover:bg-amber-600 hover:text-white transition-all duration-700 shadow-xl group-hover:scale-105">
                             <ArrowUpRight className="w-7 h-7" strokeWidth={3} />
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

      {/* 🏛️ Cinema Footer - REFINED CONTRAST */}
      <section className="py-24 md:py-32 bg-white border-t-2 border-stone-100">
          <Container className="text-center">
              <Film className="text-amber-600/10 mx-auto mb-14 w-16 h-16 md:w-20 md:h-20" />
              <h2 className="text-5xl md:text-[10rem] font-black uppercase italic tracking-tighter text-stone-100 mb-20 md:mb-24 overflow-hidden drop-shadow-sm">THEATER_OF_DIGNITY</h2>
              <div className="flex flex-wrap justify-center gap-10 md:gap-16 pt-16 md:pt-20 border-t border-amber-50 px-6">
                  {['VARANASI', 'NEW DELHI', 'NEW YORK', 'GENEVA'].map(city => (
                      <div key={city} className="flex flex-col gap-2">
                          <span className="text-[9px] font-black text-amber-600/30 uppercase tracking-[0.2em]">HUB</span>
                          <span className="text-[11px] md:text-[12px] font-black text-stone-400 uppercase tracking-[0.5em] hover:text-amber-600 transition-colors cursor-default">{city}</span>
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
