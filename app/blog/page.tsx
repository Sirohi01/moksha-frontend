'use client';

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { blogConfig } from "@/config/blog.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { cn, getSafeSrc } from "@/lib/utils";
import { 
  Search, 
  MapPin, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles, 
  Send, 
  Loader2,
  Calendar,
  Clock,
  User,
  ArrowRight
} from "lucide-react";

export default function BlogPage() {
  const { config: pageConfig, loading: configLoading } = usePageConfig('blog', blogConfig);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const config = pageConfig || blogConfig;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content?type=blog&status=published`);
      const result = await res.json();
      if (result.success) {
        setBlogs(result.data.content);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Categories from available blogs
  const categories = useMemo(() => {
    const cats = blogs.map(b => b.category);
    return ["All", ...Array.from(new Set(cats))];
  }, [blogs]);

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

  if (loading && configLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-gold-600 mb-4" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Syncing Editorial Archives...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white selection:bg-amber-100 selection:text-amber-900">
      {/* Cinematic Header Section */}
      <section className="bg-stone-950 text-white pt-24 pb-32 relative overflow-hidden">
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
                {config.hero?.badge || "MOKSHA INSIGHTS"}
              </p>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 animate-fade-in group">
              {config.hero?.title || "SACRED"} <br />
              <span className="bg-gradient-to-r from-amber-500 via-amber-200 to-amber-600 bg-clip-text text-transparent group-hover:via-amber-400 transition-all duration-1000">
                {config.hero?.highlightText || "REVELATIONS"}
              </span>
            </h1>
            <p className="text-stone-400 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {config.hero?.description || "A curated documentation of our humanitarian impact, legislative progress, and the philosophy of dignity."}
            </p>
          </div>
        </Container>
      </section>

      {/* Featured Insight Section - Commented out as requested */}
      {/* 
      {featuredBlog && (
        <section className="-mt-24 relative z-20 mb-32">
          ... (omitted content) ...
        </section>
      )}
      */}

      {/* Navigation Filter Engine */}
      <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-y border-stone-100 shadow-sm mb-20">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 h-auto md:h-24 py-6 md:py-0">
            {/* Category Control */}
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

            {/* Premium Archive Search */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-amber-700 transition-colors" />
              <input 
                type="text" 
                placeholder="REVEAL ARCHIVED MISSIONS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 bg-stone-50 rounded-2xl border border-stone-100 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-amber-700/10 focus:border-amber-700/30 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Dynamic Blog Grid */}
      <section className="pb-32">
        <Container>
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-32 bg-stone-50 rounded-[4rem] border-2 border-dashed border-stone-200">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-stone-300" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-2">No Matching Data</h3>
              <p className="text-stone-400 font-medium uppercase tracking-widest text-[11px]">We couldn&apos;t identify any logs matching your query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {filteredBlogs.map((blog, idx) => (
                <Link 
                  key={blog._id} 
                  href={`/blog/${blog.slug}`}
                  className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-stone-50 hover:border-amber-100 transition-all duration-700 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="aspect-[16/9] relative overflow-hidden rounded-[2.8rem] m-2">
                    <Image 
                      src={getSafeSrc(blog.featuredImage?.url)} 
                      alt={blog.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-2xl">
                        <span className="text-[9px] font-black text-stone-950 tracking-[0.2em] uppercase italic">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-10 pt-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[9px] text-stone-400 font-black uppercase tracking-[0.2em] mb-6">
                      <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full text-stone-950">
                        <Calendar size={12} className="text-amber-600" /> 
                        {new Date(blog.publishedAt || blog.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full text-stone-950">
                        <Clock size={12} className="text-amber-600" /> 
                        {blog.readingTime || 5} MIN READ
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-950 mb-4 group-hover:text-amber-700 transition-colors line-clamp-2 leading-tight italic">
                      {blog.title}
                    </h3>
                    <p className="text-stone-500 text-lg font-medium leading-relaxed mb-10 line-clamp-3 group-hover:text-stone-700 transition-colors">
                      {blog.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-stone-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 group-hover:bg-amber-700 group-hover:text-white transition-all shadow-inner">
                          <User size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-950 italic">{blog.author?.name || "MOKSHA"}</span>
                      </div>
                      <div className="text-amber-700 group-hover:translate-x-2 transition-transform duration-500 group-hover:scale-110">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Sacred loop subscription */}
      <section className="relative py-32 overflow-hidden bg-stone-50">
        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-0">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-32 items-center">
              <div className="xl:col-span-7">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-stone-200 mb-10 shadow-sm backdrop-blur-md">
                   <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"></span>
                   <span className="text-[11px] font-black text-stone-500 uppercase tracking-[0.3em] leading-none">
                     {config.subscriptionCTA?.badge || "The Sacred Digest"}
                   </span>
                </div>
                <h2 className="text-6xl md:text-[7.5rem] font-black uppercase tracking-tighter text-stone-950 mb-10 leading-[0.8]">
                  {config.subscriptionCTA?.title || "STAY IN THE"} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900">
                    {config.subscriptionCTA?.highlightText || "SACRED LOOP"}
                  </span>
                </h2>
                <p className="text-stone-600 text-xl font-medium leading-relaxed max-w-2xl mb-14">
                   {config.subscriptionCTA?.description || "Join a community of souls dedicated to dignity. Get monthly mission updates delivered to your sanctum."}
                </p>
                <div className="w-full max-w-xl bg-white p-2 rounded-[2.5rem] border border-stone-200 flex flex-col sm:flex-row gap-4 shadow-sm group/form focus-within:ring-4 focus-within:ring-amber-500/10 transition-all">
                  <input type="email" placeholder={config.subscriptionCTA?.inputPlaceholder || "ENTER EMAIL ADDRESS"} className="flex-1 h-14 bg-transparent px-8 text-sm font-black tracking-widest outline-none border-none placeholder:text-stone-300" />
                  <button className="h-14 px-10 bg-stone-950 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all flex items-center gap-3">
                    {config.subscriptionCTA?.buttonText || "SUBSCRIBE"} <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="xl:col-span-5 relative hidden xl:block">
                 <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white/80 p-12 rounded-[4rem] backdrop-blur-3xl shadow-xl border border-white hover:translate-x-4 transition-transform duration-700">
                       <TrendingUp className="text-amber-600 mb-6" size={40} />
                       <h3 className="text-2xl font-black uppercase italic mb-4">Hub Intelligence</h3>
                       <p className="text-stone-500 font-medium leading-relaxed">Exclusive data on our expansion strategy across India's Tier 2 & 3 cities.</p>
                    </div>
                    <div className="bg-white/80 p-12 rounded-[4rem] backdrop-blur-3xl shadow-xl border border-white hover:translate-x-8 transition-transform duration-700">
                       <Sparkles className="text-teal-600 mb-6" size={40} />
                       <h3 className="text-2xl font-black uppercase italic mb-4">Quiet Reflections</h3>
                       <p className="text-stone-500 font-medium leading-relaxed">Philosophical insights into the 'Dignity in Departure' mission.</p>
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
