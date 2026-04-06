import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAlt } from '@/lib/utils';

async function getBlogPost(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const response = await fetch(`${API_BASE_URL}/api/content/${slug}`, {
    next: { revalidate: 3600 }
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
  const post = await getBlogPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: `https://mokshaseva.org/blog/${params.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage?.url ? [post.featuredImage.url] : [],
      type: 'article',
      publishedTime: post.publishedAt
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  const seo = await getSEOData(params.slug);
  if (!post) notFound();

  return (
    <article className="min-h-screen bg-stone-50 pb-24 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Cinematic Image Anchor */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[700px] overflow-hidden shadow-2xl">
        {post.featuredImage?.url && (
          <Image 
            src={post.featuredImage.url} 
            alt={getAlt(post.featuredImage.url, seo, post.featuredImage.alt || post.title)}
            fill
            className="object-contain"
            priority
          />
        )}
      </div>

      {/* Editorial Content Core */}
      <div className="w-full bg-white relative z-10 animate-fade-in border-t border-stone-100">
        {/* Full-width Meta Header */}
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-b border-stone-50">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="px-6 py-2 bg-stone-950 text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.25em] rounded-full shadow-lg shadow-stone-950/20 italic transition-all hover:scale-105 cursor-default">
              {post.category || 'humanitarian_log'}
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse border border-amber-600/20" />
            <span className="text-stone-400 text-[12px] md:text-[14px] font-black uppercase tracking-widest">{post.type || 'MISSION_LOG'}</span>
          </div>

          <h1 className="text-4xl md:text-8xl font-black text-stone-950 uppercase italic tracking-tighter leading-[0.8] mb-12 animate-fade-in">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-8 pt-12 border-t border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400">
                  <span className="text-xl font-black">{post.author?.name?.charAt(0) || 'M'}</span>
                </div>
                <div>
                  <p className="text-[13px] md:text-[15px] font-black text-stone-950 uppercase tracking-widest leading-none mb-2">
                    WRITTEN BY: <span className="text-amber-700">{post.author?.name || 'Moksha Editorial'}</span>
                  </p>
                  <p className="text-[11px] md:text-[13px] text-stone-400 font-bold uppercase tracking-widest">{post.author?.role || 'Mission Director'}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[13px] md:text-[15px] font-black text-stone-950 uppercase tracking-widest leading-none mb-2">PUBLISHED ON:</p>
                  <p className="text-[11px] md:text-[13px] text-stone-400 font-bold uppercase tracking-widest">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Narrative Layer */}
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
            <div 
              className="prose prose-2xl prose-stone max-w-none 
                prose-headings:text-stone-950 prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:leading-none prose-headings:mb-12 prose-headings:mt-24
                prose-h2:text-4xl md:prose-h2:text-6xl prose-h3:text-3xl md:prose-h3:text-5xl
                prose-p:text-stone-600 prose-p:leading-relaxed prose-p:text-2xl md:prose-p:text-[2.25rem] prose-p:font-medium prose-p:mb-16
                prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:border prose-img:border-stone-50
                prose-ul:list-disc prose-ul:marker:text-amber-600 prose-ul:space-y-8 prose-li:text-2xl md:prose-li:text-[2.25rem] prose-li:leading-relaxed
                prose-a:text-amber-700 prose-a:font-black prose-a:uppercase prose-a:tracking-widest prose-a:no-underline hover:prose-a:text-stone-950 transition-colors
                prose-strong:text-stone-950 prose-strong:font-black
                prose-blockquote:border-l-[12px] prose-blockquote:border-amber-600 prose-blockquote:bg-stone-50 prose-blockquote:p-14 prose-blockquote:rounded-[4rem] prose-blockquote:italic prose-blockquote:text-stone-950 prose-blockquote:font-black prose-blockquote:text-4xl md:prose-blockquote:text-5xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>
    );
  }
