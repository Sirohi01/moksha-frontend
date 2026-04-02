'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/ui/Elements";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ImageIcon,
  FileText,
  Loader2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Newspaper,
  BookOpen
} from 'lucide-react';
import { Pagination } from '@/components/admin/AdminComponents';

export default function AdminPressHub() {
    const [releases, setReleases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, views: 0 });

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReleases();
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, activeFilter, searchTerm]);

    const fetchReleases = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const query = new URLSearchParams({
                type: 'press',
                page: currentPage.toString(),
                limit: '10',
                status: activeFilter,
                search: searchTerm
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content?${query.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setReleases(result.data.content);
                setTotalPages(result.data.pages);
                setTotalItems(result.data.total);
            }

            // Fetch stats
            const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsResult = await statsResponse.json();
            if (statsResult.success) {
                setStats({
                    total: statsResult.data.byType.press || 0,
                    published: statsResult.data.published || 0,
                    drafts: statsResult.data.draft || 0,
                    views: statsResult.data.totalViews || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch press releases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this press release?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) fetchReleases();
        } catch (error) {
            console.error('Failed to delete press release:', error);
        }
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-navy-950 font-sans p-6 md:p-12">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-navy-600">
                            <ShieldCheck size={18} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-400">Media Sector</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                            Official <span className="text-navy-700">Press Archives</span>
                        </h1>
                    </div>

                    <Link 
                        href="/admin/press/create"
                        className="flex items-center gap-3 bg-navy-950 text-gold-500 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl active:scale-95 group"
                    >
                        <Plus className="group-hover:rotate-90 transition-transform" />
                        Draft Official Protocol
                    </Link>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Archives', value: stats.total, icon: BookOpen, color: 'text-navy-950', bg: 'bg-navy-50' },
                        { label: 'Broadcasted', value: stats.published, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'In Drafting', value: stats.drafts, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Public Reach', value: stats.views, icon: Newspaper, color: 'text-gold-600', bg: 'bg-gold-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm flex items-center justify-between group hover:border-navy-500/30 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className={cn("text-4xl font-black italic", stat.color)}>{stat.value}</p>
                            </div>
                            <div className={cn("w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-inner", stat.bg, stat.color)}>
                                <stat.icon size={28} strokeWidth={2.5} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-[2.5rem] border border-stone-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-navy-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY RELEASE TITLE OR ISSUING OFFICER..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full h-16 pl-20 pr-8 bg-stone-50 rounded-[2rem] border-none text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-navy-500/10 focus:bg-white transition-all outline-none shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                        {['all', 'published', 'draft'].map((f) => (
                            <button
                                key={f}
                                onClick={() => handleFilterChange(f)}
                                className={cn(
                                    "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeFilter === f 
                                        ? "bg-navy-950 text-gold-500 shadow-xl scale-[1.03]" 
                                        : "bg-white text-stone-400 hover:text-navy-950 border border-stone-100"
                                )}
                            >
                                {f === 'published' ? 'BROADCASTED' : f === 'draft' ? 'IN DRAFTING' : f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Press List */}
                <div className="grid grid-cols-1 gap-6">
                    {loading && releases.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-stone-200">
                            <Loader2 className="animate-spin mb-6" size={64} />
                            <p className="font-black uppercase tracking-[0.5em] text-xs">Syncing Official Archives...</p>
                        </div>
                    ) : (
                        releases.map((pr) => (
                            <div key={pr._id} className="group bg-white p-8 rounded-[3.5rem] border border-stone-100 shadow-sm hover:border-navy-500/20 transition-all flex flex-col md:flex-row items-center gap-10">
                                <div className="w-full md:w-64 aspect-[16/10] relative rounded-[2.5rem] overflow-hidden bg-navy-50 shadow-inner">
                                    {pr.featuredImage?.url ? (
                                        <Image src={pr.featuredImage.url} alt={pr.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-navy-100">
                                            <Newspaper size={64} strokeWidth={1} />
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 bg-navy-950 text-gold-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                                        {pr.category}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                                            pr.status === 'published' ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-amber-50 border-amber-100 text-amber-600"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", pr.status === 'published' ? "bg-emerald-500 animate-pulse" : "bg-amber-500")}></div>
                                            {pr.status === 'published' ? 'BROADCASTED' : 'IN DRAFTING'}
                                        </div>
                                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest flex items-center gap-2.5">
                                            <Calendar size={14} /> {new Date(pr.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-navy-950 group-hover:text-navy-700 transition-colors italic leading-[0.9]">{pr.title}</h2>
                                    <p className="text-stone-400 text-sm font-medium line-clamp-1 italic">{pr.excerpt}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Link 
                                        href={`/admin/press/edit/${pr._id}`}
                                        className="w-16 h-16 bg-stone-50 rounded-[1.8rem] flex items-center justify-center text-navy-950 hover:bg-navy-950 hover:text-white transition-all shadow-sm border border-stone-100"
                                    >
                                        <Edit3 size={24} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(pr._id)}
                                        className="w-16 h-16 bg-stone-50 rounded-[1.8rem] flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-stone-100"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                    <a 
                                        href={`/press/${pr.slug}`} 
                                        target="_blank" 
                                        className="w-20 h-20 bg-navy-950 rounded-[2rem] flex items-center justify-center text-gold-500 hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl group/view"
                                    >
                                        <ArrowRight size={32} />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Section */}
                <div className="mt-12 pb-12">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        total={totalItems}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </Container>
        </div>
    );
}