import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from "@/components/ui/Elements";
import { getAlt, getSafeSrc, cn } from '@/lib/utils';
import {
  ShieldCheck, FileBadge, Calendar, MapPin, Globe,
  ChevronRight, Newspaper, Play, Star, ArrowRight,
  Zap, Share2, Facebook, Twitter, Link as LinkIcon
} from "lucide-react";

async function getPageContent(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const response = await fetch(`${API_BASE_URL}/api/content/${slug}?type=page`, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    const configRes = await fetch(`${API_BASE_URL}/api/page-config/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!configRes.ok) return null;
    const configResult = await configRes.json();
    return configResult.success ? { ...configResult.data.config, isConfig: true, slug, title: configResult.data.pageName } : null;
  }

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
  const content = await getPageContent(params.slug);
  if (!content) return { title: 'Page Not Found' };

  return {
    title: content.metaTitle || content.title || 'Moksha Sewa',
    description: content.metaDescription || content.excerpt || '',
    openGraph: {
      title: content.title,
      description: content.excerpt,
      images: content.featuredImage?.url ? [content.featuredImage.url] : [],
      type: 'website'
    }
  };
}

export default async function DynamicGenericPage({ params }: { params: { slug: string } }) {
  const rawPage = await getPageContent(params.slug);
  const seo = await getSEOData(params.slug);
  if (!rawPage) notFound();
  const isModernConfig = !!rawPage.hero || !!rawPage.sections;

  const page = {
    title: rawPage.hero?.title || rawPage.title || 'Moksha Sewa',
    subtitle: rawPage.hero?.subtitle || '',
    excerpt: rawPage.hero?.subtitle || rawPage.excerpt || '',
    content: rawPage.body?.content || (isModernConfig ? '' : rawPage.content) || '',
    featuredImage: rawPage.hero?.backgroundImage
      ? { url: getSafeSrc(rawPage.hero.backgroundImage) }
      : { url: getSafeSrc(rawPage.featuredImage?.url || rawPage.featuredImage) },
    sections: (rawPage.sections || []).map((s: any) => ({
      ...s,
      image: getSafeSrc(s.image)
    })),
    category: rawPage.category || 'Official',
    updatedAt: rawPage.updatedAt || new Date().toISOString()
  };

  return (
    <main className="min-h-screen bg-white pb-32 selection:bg-gold-500 selection:text-navy-950 font-sans">
      {/* 🔮 Precision 16:4 Hero Section */}
      <section className="relative min-h-[50vh] md:aspect-[16/4] flex items-center overflow-hidden bg-navy-950">
        <div className="absolute inset-0 opacity-40">
          {page.featuredImage?.url ? (
            <Image
              src={page.featuredImage.url}
              alt={getAlt(page.featuredImage.url, seo, page.title)}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        </div>

        <Container className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.95] mb-6 drop-shadow-2xl">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-xl md:text-2xl text-white/80 font-bold uppercase tracking-widest drop-shadow-lg mb-8">
                {page.excerpt}
              </p>
            )}
          </div>
        </Container>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Zap className="text-gold-500 w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Infrastructure Active</span>
          <Zap className="text-gold-500 w-4 h-4 animate-pulse" />
        </div>
      </section>

      {/* 🏛️ Alternating Content Sections */}
      {page.sections && page.sections.length > 0 && (
        <section className="py-24 space-y-32">
          {page.sections.map((section: any, index: number) => {
            const isLeft = section.imagePosition === 'left';
            return (
              <div key={index} className="overflow-hidden">
                <Container>
                  <div className={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
                    !isLeft && "lg:flex-row-reverse"
                  )}>
                    <div className={cn("relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl group", !isLeft && "lg:order-2")}>
                      <Image
                        src={section.image}
                        alt="Section Visual"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className={cn("space-y-8", !isLeft && "lg:order-1")}>
                      <div className="w-20 h-2 bg-gold-500 rounded-full" />
                      <div
                        className="prose prose-2xl prose-stone max-w-none 
                            prose-headings:text-navy-950 prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
                            prose-p:text-navy-750 prose-p:leading-relaxed prose-p:text-xl md:text-2xl"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  </div>
                </Container>
              </div>
            );
          })}
        </section>
      )}

      {/* 📁 Content CORE (Fallback or Additional Information) */}
      <section className="py-20 md:py-32 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8">
              {page.content ? (
                <div
                  className="prose prose-2xl prose-stone max-w-none 
                      prose-headings:text-navy-950 prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:leading-none prose-headings:mb-12
                      prose-p:text-navy-950/80 prose-p:leading-relaxed prose-p:text-2xl prose-p:font-medium prose-p:mb-10"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              ) : !page.sections?.length && (
                <div className="py-20 text-center border-4 border-dashed border-navy-50 rounded-[4rem]">
                  <FileBadge size={80} className="text-navy-100 mx-auto mb-6 opacity-20" />
                  <h3 className="text-2xl font-black text-navy-200 uppercase tracking-widest italic">Node deployment pending.</h3>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-navy-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-gold-500 uppercase tracking-[0.4em] mb-8">Node Repository</h4>
                  <ul className="space-y-8">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-500 shrink-0"><ShieldCheck size={18} /></div>
                      <div><p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Authenticity</p><p className="text-sm font-bold text-white uppercase italic">Verified Protocol</p></div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-500 shrink-0"><Star size={18} /></div>
                      <div><p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Trust Score</p><p className="text-sm font-bold text-white uppercase italic">99.8% Reliability</p></div>
                    </li>
                  </ul>
                  <div className="mt-12 pt-10 border-t border-white/10">
                    <button className="w-full h-16 bg-gold-500 text-navy-950 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:translate-y-[-4px] transition-all">
                      Contact Secretariat <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-[3rem] p-10 hover:shadow-2xl transition-all group">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black text-navy-300 uppercase tracking-widest">Internal Dispatch</span>
                  <Newspaper className="text-navy-100 group-hover:text-gold-500 transition-colors" size={24} strokeWidth={1} />
                </div>
                <h4 className="text-2xl font-black text-navy-950 uppercase italic tracking-tighter leading-tight mb-6">Support Our Mission for Global Peace</h4>
                <a href="/donate" className="text-[11px] font-black text-gold-600 uppercase tracking-widest flex items-center gap-2">
                  Join Movement <ArrowRight size={14} />
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* 🚀 End of Document Accent */}
      <section className="py-32 border-t border-gray-50">
        <Container className="text-center">
          <FileBadge className="relative text-navy-950 w-20 h-20 mx-auto mb-8" strokeWidth={0.5} />
          <p className="text-[11px] font-black uppercase tracking-[0.6em] text-navy-200 mb-4">Official Node Archive Protocol</p>
          <h2 className="text-3xl font-black text-navy-950 uppercase tracking-tighter italic">Secured by Moksha Sewa Network</h2>
        </Container>
      </section>
    </main>
  );
}
