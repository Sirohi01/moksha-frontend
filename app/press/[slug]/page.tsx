import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from "@/components/ui/Elements";
import { getAlt } from '@/lib/utils';
import { ShieldCheck, FileBadge, Calendar, MapPin, Globe, ChevronRight, Newspaper, Play } from "lucide-react";

async function getPressRelease(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const response = await fetch(`${API_BASE_URL}/api/content/${slug}?type=press`, {
    next: { revalidate: 0 }
  });
  
  if (!response.ok) return null;
  const result = await response.json();
  return result.success ? result.data : null;
}

async function getSEOData(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${API_BASE_URL}/api/seo/page/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pr = await getPressRelease(params.slug);
  if (!pr) return { title: 'Press Release Not Found' };
  
  return {
    title: pr.metaTitle || pr.title,
    description: pr.metaDescription || pr.excerpt,
    openGraph: {
      title: pr.title,
      description: pr.excerpt,
      images: pr.featuredImage?.url ? [pr.featuredImage.url] : [],
      type: 'article'
    }
  };
}

export default async function PressReleaseDetailPage({ params }: { params: { slug: string } }) {
  const pr = await getPressRelease(params.slug);
  const seo = await getSEOData(params.slug);
  if (!pr) notFound();

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getReelId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = pr.youtubeUrl ? getYoutubeId(pr.youtubeUrl) : null;
  const reelId = pr.reelUrl ? getReelId(pr.reelUrl) : null;

  return (
    <article className="min-h-screen bg-[#fafbfc] pb-24 font-sans selection:bg-gold-500 selection:text-navy-950">
      {/* 🏛️ Official Header Breadcrumb */}
      <div className="bg-white border-b border-navy-50 py-4 pt-20 md:pt-24">
        <Container>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy-200">
            <span className="hover:text-navy-950 cursor-default">Archive</span>
            <ChevronRight size={12} className="text-navy-50" />
            <span className="hover:text-navy-950 cursor-default">Press Room</span>
            <ChevronRight size={12} className="text-gold-500" />
            <span className="text-gold-600">Official Report</span>
          </div>
        </Container>
      </div>

      {/* 🖼️ Hero Section - FIXED IMAGE SCALING & MAJESTIC FRAME */}
      <section className="bg-white py-12 md:py-20 border-b border-navy-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-navy-50/10 to-transparent pointer-events-none" />
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
            {/* Title & Stats */}
            <div className="lg:col-span-12">
               <div className="flex flex-wrap items-center gap-4 mb-8 md:mb-12">
                  <span className="px-6 py-2 bg-navy-950 text-gold-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl flex items-center gap-3">
                    <ShieldCheck size={14} className="text-gold-500" /> OFFICIAL_RELEASE
                  </span>
                  <div className="w-2 h-2 rounded-full bg-navy-50" />
                  <span className="text-navy-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} /> GLOBAL_SYNDICATE
                  </span>
               </div>

               <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-navy-950 uppercase italic tracking-tighter leading-tight mb-8 drop-shadow-sm max-w-4xl">
                 {pr.title}
               </h1>
               
               <div className="flex flex-wrap items-center justify-between gap-10 pt-10 border-t-2 border-navy-950 max-w-5xl">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-navy-50 border border-navy-100 flex items-center justify-center text-gold-600 text-xl font-black shadow-inner">
                         {pr.author?.name?.charAt(0) || 'M'}
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest leading-none mb-2">AUTHENTICATOR</p>
                         <p className="text-xl font-black text-navy-950 uppercase italic leading-none">{pr.author?.name || 'Moksha Secretariat'}</p>
                      </div>
                   </div>

                   <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest leading-none mb-2">RECORDED DATE</p>
                      <p className="text-2xl font-black text-navy-950 uppercase tracking-tighter italic">
                         {new Date(pr.publishedAt || pr.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                   </div>
               </div>
            </div>

            {/* Feature Image Frame - FIXED NO-CUT LOGIC */}
            <div className="lg:col-span-12 mt-12 md:mt-20">
                <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[850px] rounded-[3rem] overflow-hidden bg-navy-950 shadow-[0_50px_100px_rgba(26,46,74,0.15)] group">
                   {youtubeId ? (
                     <iframe
                       src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                       className="absolute inset-0 w-full h-full"
                       frameBorder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                       title={pr.title}
                     />
                   ) : pr.featuredImage?.url ? (
                     <Image 
                       src={pr.featuredImage.url} 
                       alt={getAlt(pr.featuredImage.url, seo, pr.featuredImage.alt || pr.title)}
                       fill
                       className="object-contain group-hover:scale-105 transition-transform duration-[8s]"
                       priority
                     />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-navy-100/10">
                        <FileBadge size={120} strokeWidth={0.5} />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors duration-1000 peer-hover:opacity-0" />
                  
                  {/* Digital Signature Overlay */}
                  <div className="absolute bottom-10 right-10 flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20">
                     <ShieldCheck className="text-gold-500 w-5 h-5" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">ENCRYPTED_ARCHIVE_VERIFIED</span>
                  </div>
               </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 📁 Content Core */}
      <div className="relative z-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 pb-10 border-b border-navy-50 flex items-center justify-between gap-6">
            <div>
               <p className="text-xl md:text-2xl font-black text-navy-950 uppercase italic tracking-tighter leading-none mb-3">FOR IMMEDIATE RELEASE</p>
               <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-gold-600" />
                  <p className="text-[11px] font-bold text-navy-400 uppercase tracking-widest">VARANASI SYNDICATE — {new Date(pr.publishedAt || pr.createdAt).getFullYear()}</p>
               </div>
            </div>
            <Newspaper className="text-navy-100 hidden md:block" size={48} strokeWidth={1} />
        </div>

        {/* 📱 Vertical Reel Archive Frame */}
        {reelId && (
          <div className="bg-navy-50/20 py-24 border-y border-navy-50 overflow-hidden mb-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-16">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-navy-950 flex items-center justify-center text-gold-500 shadow-xl shadow-navy-950/20">
                       <Play size={20} fill="currentColor" className="rotate-90 ml-1" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-navy-400">Archival Motion Report</span>
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic text-navy-950 leading-[0.85]">
                    Visual <span className="text-gold-600">Dispatches</span>
                  </h2>
                  <p className="text-navy-400 text-xl font-medium mt-8 leading-relaxed italic max-w-2xl">"Verified ground-level intelligence captured through modern social broadcasting protocols."</p>
                </div>
              </div>

              <div className="flex justify-center">
                 <div className="w-full max-w-[420px] aspect-[9/16] bg-navy-950 rounded-[4rem] overflow-hidden shadow-[0_60px_120px_rgba(26,46,74,0.25)] border-[10px] border-white/5 relative group">
                    <iframe
                      src={`https://www.youtube.com/embed/${reelId}?autoplay=0&rel=0&modestbranding=1&loop=1`}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Official Press Reel"
                    />
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-navy-950/20 rounded-[3.2rem] z-10" />
                 </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6">
          <div 
            className="prose prose-xl prose-stone max-w-none 
              prose-headings:text-navy-950 prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:leading-none
              prose-p:text-navy-950/70 prose-p:leading-relaxed prose-p:text-2xl prose-p:font-medium prose-p:mb-12
              prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:border prose-img:border-navy-50
              prose-blockquote:border-l-4 prose-blockquote:border-gold-600 prose-blockquote:bg-navy-50/30 prose-blockquote:p-12 prose-blockquote:rounded-[3rem] prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: pr.content }}
          />
        </div>
      </div>
      </div>

      {/* Institution Footer Accent */}
      <div className="py-24 border-t border-navy-50 bg-white">
        <Container className="text-center">
           <FileBadge className="text-navy-100/20 mx-auto mb-10 w-16 h-16" strokeWidth={1} />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-navy-200">End of Official Document Archive</p>
        </Container>
      </div>
    </article>
  );
}
