'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Clock, 
  ShieldAlert, 
  Terminal, 
  FileText, 
  Activity,
  User,
  MapPin,
  Calendar,
  Lock,
  Download,
  AlertOctagon,
  CheckCircle2,
  Bookmark,
  Scale,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { sopService, SOP } from '@/lib/services/sopService';
import { cn } from '@/lib/utils';

import { layoutConfig } from '@/config/layout.config';
import Image from 'next/image';

export default function SOPDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const [sop, setSop] = useState<SOP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSOP = async () => {
      try {
        setLoading(true);
        const res = await sopService.getBySlug(slug);
        if (res && res.success && res.data) {
          setSop(res.data);
        } else {
          setError('Protocol not found in the mission registry.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to establish uplink with documentation hub.');
      } finally {
        setLoading(false);
      }
    };
    fetchSOP();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-8">
        <div className="relative">
           <div className="w-24 h-24 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin shadow-[0_0_50px_rgba(244,196,48,0.2)]"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-gold-500 animate-pulse" size={32} />
           </div>
        </div>
        <p className="mt-8 text-gold-500 font-black uppercase tracking-[0.6em] animate-pulse text-[10px]">Synchronizing Intelligence...</p>
      </div>
    );
  }

  if (error || !sop) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,_#f8f9fa_0%,_#ffffff_100%)]">
        <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8 border border-rose-100 shadow-xl shadow-rose-500/10 rotate-12">
          <AlertOctagon size={48} />
        </div>
        <h1 className="text-5xl font-black text-navy-950 uppercase tracking-tighter italic mb-4">ACCESS DENIED</h1>
        <p className="text-stone-400 max-w-md font-medium uppercase tracking-widest text-[10px] mb-12 leading-loose">
          {error || 'The encryption key provided did not match any operational protocol in our secure repository.'}
        </p>
        <button onClick={() => router.push('/services/sop')} className="px-12 py-5 bg-navy-950 text-gold-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all flex items-center gap-4 group">
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
           Return to Deployment Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans pb-40 select-none print:bg-white print:pb-0 print:text-black">
      
      {/* 🛡️ MASTER PRINT TEMPLATE (Hidden on Screen) */}
      <div className="hidden print:block w-full max-w-[850px] mx-auto p-12 bg-white">
          <div className="flex items-center justify-between mb-6 border-b-2 border-stone-100 pb-2">
             <p className="text-[10px] font-black tracking-[0.4em] text-navy-400">OFFICIAL DOCUMENT: MSF_OPERATIONS_CMD</p>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-600 rounded-full"></div>
                <p className="text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase">Class: Restricted</p>
             </div>
          </div>


          <div className="border-b-[8px] border-navy-950 pb-8 mb-12 flex justify-between items-start">
             <div className="flex items-center gap-8">
                <Image 
                  src={layoutConfig.navbar.logo.src} 
                  alt="Organization Logo" 
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
                <div>
                   <h1 className="text-5xl font-black text-navy-950 uppercase tracking-tighter leading-none mb-2 italic">MOKSHA SEWA</h1>
                   <div className="flex items-center gap-4">
                      <div className="h-[2px] w-10 bg-gold-600"></div>
                      <p className="text-[14px] font-black uppercase tracking-[0.5em] text-navy-400 font-sans">OPERATIONAL MANUAL</p>
                   </div>
                </div>
             </div>
             <div className="text-right space-y-1 pt-2">
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none italic font-sans">Logic ID: MSF_{slug.toUpperCase()}</p>
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none italic font-sans">Revision: v{sop.version || 1}.0</p>
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none italic font-sans">Node: DELHI-NCR_HQ</p>
             </div>
          </div>

          <div className="space-y-6">
             <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-navy-950 mb-3">{sop.title}</h2>
                <p className="text-lg font-bold text-navy-600/80 italic border-l-4 border-gold-600 pl-6 mb-10">{sop.description}</p>
             </div>

             <div className="grid grid-cols-2 gap-8 border-y-2 border-stone-100 py-6 mb-10 font-sans">
                <div>
                   <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2 italic">Protocol Category</p>
                   <p className="text-sm font-black text-navy-950 uppercase">{sop.category} Sector Operations</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2 italic">Criticality Rating</p>
                   <p className={cn("text-sm font-black uppercase", sop.isCritical ? "text-rose-600" : "text-emerald-600")}>
                      {sop.isCritical ? "LEVEL 1: CRITICAL ASSET" : "LEVEL 3: STANDARD ASSET"}
                   </p>
                </div>
             </div>

             <article 
               className="prose prose-lg prose-navy max-w-none 
                 prose-h2:text-xl prose-h2:font-black prose-h2:uppercase prose-h2:mt-12 prose-h2:border-b-2 prose-h2:border-stone-100 prose-h2:pb-2
                 prose-p:text-sm prose-p:leading-relaxed prose-p:text-navy-900
                 prose-li:text-sm prose-li:font-semibold prose-li:text-navy-900
                 prose-strong:font-black prose-strong:text-gold-600"
               dangerouslySetInnerHTML={{ __html: sop.content }}
             />

             <div className="pt-12 mt-12 border-t-2 border-stone-100 font-sans">
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest leading-loose">
                   © {new Date().getFullYear()} MOKSHA SEWA FOUNDATION. ALL RIGHTS RESERVED.<br/>
                   CONFIDENTIAL OPERATIONAL INTELLIGENCE. UNAUTHORIZED REPRODUCTION IS PROHIBITED.
                </p>
             </div>
          </div>
      </div>

      {/* 🎬 CINEMATIC HERO (Hidden on Print) */}
      <div className="print:hidden">
         <section className="relative pt-20 pb-24 bg-navy-950 overflow-hidden">
            {/* Background Assets */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-navy-950 to-transparent" />
            
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
               <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  
                  {/* Tactical Path Navigation */}
                  <div className="flex flex-wrap justify-center items-center gap-6">
                    <button 
                      onClick={() => router.back()}
                      className="flex items-center gap-2 text-white/30 hover:text-gold-500 text-[9px] font-black uppercase tracking-[0.4em] transition-all group"
                    >
                      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                      Repository
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 text-gold-500 hover:text-white text-[9px] font-black uppercase tracking-[0.4em] transition-all group"
                    >
                      <Printer size={14} className="group-hover:rotate-12 transition-transform" />
                      Print Protocol
                    </button>
                  </div>

                  <div className="space-y-4 max-w-5xl">
                     <div className="flex justify-center flex-wrap items-center gap-3">
                        <span className="px-5 py-1.5 bg-gold-600 text-navy-950 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-xl">
                          {sop.category} OPS
                        </span>
                        {sop.isCritical && (
                           <span className="px-5 py-1.5 bg-rose-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic animate-pulse flex items-center gap-2">
                              <ShieldAlert size={12} />
                              CRITICAL
                           </span>
                        )}
                        <span className="px-5 py-1.5 bg-white/5 border border-white/10 text-white/40 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                           v{sop.version || 1}.0 STABLE
                        </span>
                     </div>

                     <h1 className="flex flex-col items-center -space-y-3 sm:-space-y-5 md:-space-y-8 lg:-space-y-12 text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl">
                        {sop.title.split(' ').map((word: string, i: number) => (
                           <span key={i} className={cn((i % 2 !== 0) && "text-transparent stroke-white stroke-[1.5px] opacity-40")}>
                              {word}
                           </span>
                        ))}
                     </h1>

                     <p className="text-base md:text-xl text-white/30 font-medium italic max-w-xl mx-auto leading-relaxed pt-6 border-t border-white/5 mt-6">
                        {sop.description}
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* 🛠️ INTELLIGENCE CONSOLE */}
         <section className="-mt-16 relative z-50">
            <div className="max-w-[1400px] mx-auto px-6">
               <div className="flex flex-col gap-12 max-w-5xl mx-auto">
                  
                  {/* Quick Metadata Node */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-stone-100 p-8 rounded-[3rem] shadow-2xl shadow-navy-900/5">
                    <div className="flex items-center gap-4 px-4 sm:border-r border-stone-100">
                      <div className="w-10 h-10 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-950">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Authority</p>
                        <p className="text-xs font-black text-navy-950 uppercase italic tracking-tight">MSF_COMMAND_HUB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-4 sm:border-r border-stone-100">
                      <div className="w-10 h-10 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-950">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Sector</p>
                        <p className="text-xs font-black text-navy-950 uppercase italic tracking-tight">DELHI-T1_NODE</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-4">
                      <div className="w-10 h-10 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-950">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Last Intelligence</p>
                        <p className="text-xs font-black text-navy-950 uppercase italic tracking-tight">{new Date(sop.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* 📂 PRIMARY MANIFEST - Full Width Now */}
                  <div className="space-y-12 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                     <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_100px_150px_rgba(30,58,138,0.06)] border border-stone-100 relative overflow-hidden group/container">
                        
                        {/* Digital Watermark */}
                        <div className="absolute top-12 right-12 opacity-[0.02] select-none pointer-events-none">
                           <FileText size={400} className="text-navy-950" />
                        </div>

                        <div className="relative z-10">
                           <div className="flex items-center gap-6 mb-16 pb-8 border-b border-stone-100">
                              <div className="w-14 h-14 bg-navy-50 rounded-3xl flex items-center justify-center text-navy-950">
                                 <Terminal size={28} />
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter italic leading-none">Operational Protocol</h3>
                                 <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">Log: MSF_{slug.toUpperCase()}</p>
                              </div>
                           </div>

                           <article 
                             className="prose prose-2xl prose-navy max-w-none 
                               prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:italic prose-h2:border-l-[10px] prose-h2:border-gold-600 prose-h2:pl-10 prose-h2:mt-24 prose-h2:mb-12
                               prose-p:text-navy-900/70 prose-p:font-medium prose-p:leading-[1.8] prose-p:text-base md:prose-p:text-[1.15rem]
                               prose-li:text-navy-900/70 prose-li:font-bold prose-li:text-base md:prose-li:text-[1.1rem] prose-li:mb-4
                               prose-strong:text-navy-950 prose-strong:font-black
                               prose-img:rounded-[3rem] prose-img:shadow-2xl
                               prose-hr:border-stone-100"
                             dangerouslySetInnerHTML={{ __html: sop.content }}
                           />

                           {/* Warning Protocol (Inline) */}
                           <div className="mt-20 p-8 bg-rose-50 border-2 border-dashed border-rose-200 rounded-[2.5rem] flex items-center gap-6">
                              <ShieldAlert className="text-rose-600 shrink-0" size={32} />
                              <div>
                                <p className="text-xs font-black text-rose-950 uppercase tracking-tighter italic">Strict Compliance Mandatory</p>
                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1 italic">Deviations without command authorization are prohibited.</p>
                              </div>
                           </div>

                           {/* Sign-off Block */}
                           <div className="mt-24 pt-12 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-8 py-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                              <div className="flex items-center gap-4">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                                <div>
                                  <p className="text-[10px] font-black text-navy-950 uppercase tracking-widest">Integrity Verified</p>
                                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em]">MSF_GLOBAL_RECORDS_001</p>
                                </div>
                              </div>
                              <p className="text-[10px] font-black text-navy-950 uppercase tracking-widest italic">© MOKSHA SEWA FOUNDATION</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>

      {/* 🧭 TACTICAL NAVIGATION (Float remains for easy Print access) */}
      <div className="fixed bottom-12 left-0 right-0 z-[100] flex justify-center print:hidden no-print">
         <div className="bg-navy-950/90 shadow-2xl shadow-navy-900 border border-white/10 px-10 py-5 rounded-full flex items-center gap-10 group hover:scale-105 transition-all duration-700 backdrop-blur-2xl pointer-events-auto">
            <button onClick={() => window.print()} className="flex items-center gap-3 text-gold-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
               <Printer size={18} />
               Print Manual
            </button>
            <div className="w-[1px] h-6 bg-white/10" />
            <button 
               onClick={() => router.push('/services/sop')}
               className="flex items-center gap-3 text-white/50 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
            >
               <Terminal size={18} />
               Manual Repository
            </button>
         </div>
      </div>
    </div>
  );
}
