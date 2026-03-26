"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { blogConfig } from "@/config/blog.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { cn } from "@/lib/utils";
import { Search, MapPin, ArrowUpRight, TrendingUp, Sparkles, Send } from "lucide-react";

export default function BlogPage() {
  const { config: dynamicConfig, loading, error } = usePageConfig('blog', blogConfig);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const config = dynamicConfig || blogConfig;
  const blogs = config.blogGrid.blogs || [];
  const categories = config.blogGrid.categories || ["All"];

  // Search and Filter Logic
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  const featuredBlog = useMemo(() => {
    return blogs.find(blog => blog.featured) || blogs[0];
  }, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-amber-700/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const ClockIcon = getIcon('Clock');
  const CalendarIcon = getIcon('Calendar');
  const UserIcon = getIcon('User');
  const ArrowRightIcon = getIcon('ArrowRight');

  return (
    <main className="min-h-screen bg-white selection:bg-amber-100 selection:text-amber-900">
      {/* Dynamic Header Section */}
      <section className="bg-stone-950 text-white pt-24 pb-32 relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-700/30 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-teal-700/20 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30-30-30z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
        </div>

        <Container>
          <div className="max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] leading-none">
                {config.hero.badge}
              </p>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 animate-fade-in group">
              {config.hero.title} <br />
              <span className="bg-gradient-to-r from-amber-500 via-amber-200 to-amber-600 bg-clip-text text-transparent group-hover:via-amber-400 transition-all duration-1000">
                {config.hero.highlightText}
              </span>
            </h1>
            <p className="text-stone-400 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {config.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Hero Featured Article */}
      {featuredBlog && (
        <section className="-mt-24 relative z-20 mb-32">
          <Container>
            <Link href={`/blog/${featuredBlog.slug}`} className="group block">
              <div className="bg-white/80 backdrop-blur-3xl rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20 flex flex-col lg:flex-row min-h-[440px] transition-all duration-700 hover:shadow-[0_48px_80px_-16px_rgba(180,120,0,0.15)] ring-1 ring-black/[0.03]">
                <div className="lg:w-[48%] relative min-h-[300px] lg:min-h-full overflow-hidden">
                  <Image 
                    src={featuredBlog.image} 
                    alt={featuredBlog.imageAlt} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Floating Date Badge on Image */}
                  <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl text-center shadow-2xl">
                    <span className="block text-white text-2xl font-black">{featuredBlog.date.split(' ')[1].replace(',', '')}</span>
                    <span className="block text-white/70 text-[10px] font-black uppercase tracking-widest leading-none">{featuredBlog.date.split(' ')[0]}</span>
                  </div>
                </div>
                
                <div className="lg:w-[52%] p-10 md:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-amber-700 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-700/20">
                      {config.featuredBlog.badge}
                    </span>
                    <span className="flex items-center gap-2 text-stone-900 text-[10px] font-black uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                      {featuredBlog.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-950 mb-6 leading-tight group-hover:text-amber-700 transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-stone-500 text-lg font-medium leading-relaxed mb-8">
                    {featuredBlog.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200 shadow-inner group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-100 transition-colors">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-stone-950">{featuredBlog.author}</p>
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{featuredBlog.authorRole}</p>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-stone-950 text-white flex items-center justify-center group-hover:bg-amber-700 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-stone-950/20">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* Navigation and Search Section */}
      <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-y border-stone-100 shadow-sm mb-20">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 h-auto md:h-24 py-6 md:py-0">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    activeCategory === cat 
                      ? "bg-stone-950 text-white shadow-xl shadow-stone-950/20 scale-105" 
                      : "bg-stone-50 text-stone-500 border border-stone-100 hover:bg-stone-100 hover:text-stone-950"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Premium Search Box */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-amber-700 transition-colors" />
              <input 
                type="text" 
                placeholder="Search articles, insights, missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 bg-stone-50 rounded-2xl border border-stone-100 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-amber-700/10 focus:border-amber-700/30 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Improved Blog Grid */}
      <section className="pb-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {filteredBlogs.map((blog, idx) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-stone-50 hover:border-amber-100 transition-all duration-700 animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="aspect-[4/3] relative overflow-hidden rounded-[2.8rem] m-2">
                  <Image 
                    src={blog.image} 
                    alt={blog.imageAlt} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-2xl">
                      <span className="text-[9px] font-black text-stone-950 tracking-[0.2em] uppercase">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-10 pt-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[9px] text-stone-400 font-black uppercase tracking-[0.2em] mb-6">
                    <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full"><CalendarIcon size={12} className="text-amber-600" /> {blog.date}</span>
                    <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full"><ClockIcon size={12} className="text-amber-600" /> {blog.readingTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-950 mb-4 group-hover:text-amber-700 transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-stone-500 text-lg font-medium leading-relaxed mb-10 line-clamp-3 group-hover:text-stone-700 transition-colors">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-8 border-t border-stone-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 group-hover:bg-amber-700 group-hover:text-white transition-all">
                        <UserIcon size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-950">{blog.author}</span>
                    </div>
                    <div className="text-amber-700 group-hover:translate-x-2 transition-transform duration-500">
                      <ArrowRightIcon size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-32 bg-stone-50 rounded-[4rem] border-2 border-dashed border-stone-200">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-stone-300" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-2">No Matching Insights</h3>
              <p className="text-stone-400 font-medium uppercase tracking-widest text-[11px]">We couldn&apos;t find any articles matching your search query.</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("All")}} 
                className="mt-8 text-amber-700 font-black uppercase tracking-widest text-[11px] underline underline-offset-8"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Subscription Section - Ultra Modern */}
      {/* Newsletter Section: Light & Sophisticated Theme */}
      <section className="relative py-32 overflow-hidden bg-stone-50">
        {/* Soft atmospheric accents */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-200/20 blur-[130px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/30 blur-[110px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d6d3d1 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-0">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-32 items-center">
              
              {/* Left Column: Content & Form */}
              <div className="xl:col-span-7">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-stone-200 mb-10 shadow-sm backdrop-blur-md">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full shadow-[0_0_10px_rgba(180,83,9,0.4)] animate-pulse"></span>
                  <span className="text-[11px] font-black text-stone-500 uppercase tracking-[0.3em] leading-none">The Sacred Digest</span>
                </div>
                
                <h2 className="text-6xl md:text-[7.5rem] font-black uppercase tracking-tighter text-stone-950 mb-10 leading-[0.8]">
                  STAY IN THE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900">SACRED LOOP</span>
                </h2>
                
                <p className="text-stone-600 text-xl font-medium leading-relaxed max-w-2xl mb-14">
                  Join a community of souls dedicated to dignity. Get monthly mission updates, legislative breakthroughs, and stories of quiet service delivered to your sanctum.
                </p>
                
                <NewsletterForm />
                
                
              </div>

              {/* Right Column: Key Metrics / Nodes */}
              <div className="xl:col-span-5 relative">
                <div className="space-y-8">
                  {/* Card Node 1 */}
                  <div className="group relative bg-white/80 border border-white p-12 rounded-[4rem] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-700 hover:-translate-y-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] hover:shadow-[0_48px_80px_-16px_rgba(180,120,0,0.12)]">
                    <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mb-8 border border-amber-100 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-stone-950 text-2xl font-black uppercase tracking-tight mb-4 leading-none">Hub Intelligence</h3>
                    <p className="text-stone-500 text-base leading-relaxed font-semibold">
                      Exclusive data on our expansion strategy across India's Tier 2 & 3 cities. See exactly how your support translates into direct service.
                    </p>
                  </div>

                  {/* Card Node 2 */}
                  <div className="group relative bg-white/80 border border-white p-12 rounded-[4rem] backdrop-blur-3xl hover:border-teal-500/30 transition-all duration-700 translate-x-4 md:translate-x-12 hover:-translate-y-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] hover:shadow-[0_48px_80px_-16px_rgba(13,148,136,0.12)]">
                    <div className="w-16 h-16 bg-teal-50 rounded-3xl flex items-center justify-center mb-8 border border-teal-100 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="text-stone-950 text-2xl font-black uppercase tracking-tight mb-4 leading-none">Quiet Reflections</h3>
                    <p className="text-stone-500 text-base leading-relaxed font-semibold">
                      Monthly philosophical insights into the 'Dignity in Departure' mission and the spiritual depth of our collective humanitarian effort.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'blog_page' }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || "THANK YOU FOR SUBSCRIBING!");
        setEmail("");
      } else {
        setStatus('error');
        setMessage(data.message || "SOMETHING WENT WRONG. PLEASE TRY AGAIN.");
      }
    } catch (error) {
      setStatus('error');
      setMessage("CONNECTION ERROR. PLEASE CHECK YOUR INTERNET.");
    }
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-[2.5rem] border border-stone-200 group/form focus-within:border-amber-500/50 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all shadow-sm">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENTER YOUR EMAIL ADDRESS" 
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 h-14 bg-transparent px-8 text-stone-950 text-sm font-medium tracking-widest outline-none border-none placeholder:text-stone-400 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.1em] disabled:opacity-50"
          required
        />
        <button 
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={cn(
            "h-14 px-10 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:pointer-events-none",
            status === 'success' 
              ? "bg-teal-600 text-white" 
              : "bg-stone-950 hover:bg-stone-800 text-white shadow-stone-950/20"
          )}
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : status === 'success' ? (
            "SUBSCRIBED"
          ) : (
            <>SUBSCRIBE <Send className="w-4 h-4" /></>
          )}
        </button>
      </form>
      
      {status !== 'idle' && (
        <div className={cn(
          "mt-6 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fade-in border",
          status === 'success' ? "bg-teal-500/10 border-teal-500/20 text-teal-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          <div className={cn("w-2 h-2 rounded-full", status === 'success' ? "bg-teal-500" : "bg-red-500")}></div>
          <p className="text-[10px] font-black uppercase tracking-widest leading-none">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
