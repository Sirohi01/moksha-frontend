import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Play } from 'lucide-react';

async function getDocumentary(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const response = await fetch(`${API_BASE_URL}/api/content/${slug}?type=documentary`, {
    next: { revalidate: 0 }
  });
  
  if (!response.ok) return null;
  const result = await response.json();
  return result.success ? result.data : null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = await getDocumentary(params.slug);
  if (!doc) return { title: 'Documentary Not Found' };
  
  return {
    title: doc.metaTitle || doc.title,
    description: doc.metaDescription || doc.excerpt,
    openGraph: {
      title: doc.title,
      description: doc.excerpt,
      images: doc.featuredImage?.url ? [doc.featuredImage.url] : [],
      type: 'video.movie'
    }
  };
}

export default async function DocumentaryDetailPage({ params }: { params: { slug: string } }) {
  const doc = await getDocumentary(params.slug);
  if (!doc) notFound();

  // Extract YouTube ID from URL
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = doc.youtubeUrl ? getYoutubeId(doc.youtubeUrl) : null;

  const getReelId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const reelId = doc.reelUrl ? getReelId(doc.reelUrl) : null;

  return (
    <article className="min-h-screen bg-stone-50 pb-24 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Cinematic Theater Section */}
      <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[800px] bg-black overflow-hidden shadow-2xl">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={doc.title}
          />
        ) : doc.featuredImage?.url ? (
          <Image 
            src={doc.featuredImage.url} 
            alt={doc.featuredImage.alt || doc.title}
            fill
            className="object-contain opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
             <p className="text-sm font-black uppercase tracking-[0.5em]">No Visual Asset Available</p>
          </div>
        )}
      </div>

      {/* Editorial Content Core */}
      <div className="w-full bg-white relative z-10 animate-fade-in border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-b border-stone-50">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="px-5 py-1.5 bg-amber-600 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full italic shadow-lg shadow-amber-600/20">
              {doc.category || 'CINEMATIC_LOG'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">{doc.type || 'DOCUMENTARY'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-stone-950 uppercase italic tracking-tighter leading-[0.85] md:leading-[0.8] mb-10 md:mb-12">
            {doc.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-8 pt-12 border-t border-stone-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400">
                <span className="text-xl font-black">{doc.author?.name?.charAt(0) || 'M'}</span>
              </div>
              <div>
                <p className="text-[11px] font-black text-stone-950 uppercase tracking-widest leading-none mb-1.5">
                  DIRECTED BY: <span className="text-amber-700">{doc.author?.name || 'Moksha Editorial'}</span>
                </p>
                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{doc.author?.role || 'Mission Director'}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-black text-stone-950 uppercase tracking-widest leading-none mb-1.5">PRODUCTION DATE:</p>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                {new Date(doc.publishedAt || doc.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* 📱 Vertical Reel Content Channel */}
        {reelId && (
          <div className="bg-stone-50 py-20 border-b border-stone-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white -rotate-12 group-hover:rotate-0 transition-transform">
                       <Play size={16} fill="currentColor" className="rotate-90" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Cinematic Reel</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-stone-950 leading-none">
                    Sacred <span className="text-stone-400">Shorts</span>
                  </h2>
                  <p className="text-stone-500 text-lg font-medium mt-6 leading-relaxed italic">"Dignity captured in vertical frames — a perspective on the ground."</p>
                </div>
              </div>

              <div className="flex justify-center">
                 <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-[8px] border-stone-950 relative group">
                    <iframe
                      src={`https://www.youtube.com/embed/${reelId}?autoplay=0&rel=0&modestbranding=1&loop=1`}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Documentary Reel"
                    />
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-stone-950/20 rounded-[2.8rem] z-10" />
                 </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
          <div 
            className="prose prose-xl prose-stone max-w-none 
              prose-headings:text-stone-950 prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:leading-none prose-headings:mb-8 prose-headings:mt-12
              prose-p:text-stone-600 prose-p:leading-relaxed prose-p:text-xl md:prose-p:text-2xl prose-p:font-medium prose-p:mb-8
              prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:border prose-img:border-stone-50
              prose-ul:list-disc prose-ul:marker:text-amber-600 prose-ul:space-y-4 prose-li:text-xl md:prose-li:text-2xl prose-li:leading-relaxed
              prose-a:text-amber-700 prose-a:font-black prose-a:uppercase prose-a:tracking-widest prose-a:no-underline hover:prose-a:text-stone-950 transition-colors
              prose-strong:text-stone-950 prose-strong:font-black
              prose-blockquote:border-l-[8px] prose-blockquote:border-amber-600 prose-blockquote:bg-stone-50 prose-blockquote:p-10 prose-blockquote:rounded-[3rem] prose-blockquote:italic prose-blockquote:text-stone-950 prose-blockquote:font-black prose-blockquote:text-3xl md:prose-blockquote:text-4xl"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        </div>
      </div>
    </article>
  );
}
