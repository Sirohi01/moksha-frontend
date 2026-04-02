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
    Play,
    Eye,
    CheckCircle,
    Clock,
    ImageIcon,
    FileText,
    Loader2,
    Calendar,
    Sparkles,
    ArrowRight,
    Film
} from 'lucide-react';
import { Pagination } from '@/components/admin/AdminComponents';

export default function AdminDocumentaryHub() {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, views: 0 });

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDocs();
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, activeFilter, searchTerm]);

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const query = new URLSearchParams({
                type: 'documentary',
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
                setDocs(result.data.content);
                setTotalPages(result.data.pages);
                setTotalItems(result.data.total);
            }
            const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/stats?type=documentary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsResult = await statsResponse.json();
            if (statsResult.success) {
                setStats({
                    total: statsResult.data.totalContent || 0,
                    published: statsResult.data.published || 0,
                    drafts: statsResult.data.draft || 0,
                    views: statsResult.data.totalViews || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch documentaries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this documentary?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) fetchDocs();
        } catch (error) {
            console.error('Failed to delete documentary:', error);
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
        <div className="min-h-screen bg-[#fcfcfc] text-navy-950 font-sans p-4 md:p-12">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-4 md:mt-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-amber-600">
                            <Film size={18} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Cinematic Sector</span>
                        </div>
                        <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                            Cinema <span className="text-amber-600">Manifesto</span>
                        </h1>
                    </div>

                    <Link
                        href="/admin/documentaries/create"
                        className="flex items-center justify-center gap-3 bg-stone-950 text-white px-6 md:px-10 py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 hover:text-white transition-all shadow-2xl shadow-stone-950/20 active:scale-95 group"
                    >
                        <Plus className="group-hover:rotate-90 transition-transform" />
                        Initialize New Production
                    </Link>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {[
                        { label: 'Total Productions', value: stats.total, icon: Film, color: 'text-stone-950', bg: 'bg-stone-50' },
                        { label: 'Released', value: stats.published, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'In Production', value: stats.drafts, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Box Office (Views)', value: stats.views, icon: Eye, color: 'text-amber-400', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-stone-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 group hover:border-amber-500/30 transition-all">
                            <div className="text-center md:text-left">
                                <p className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className={cn("text-2xl md:text-4xl font-black italic", stat.color)}>{stat.value}</p>
                            </div>
                            <div className={cn("w-10 h-10 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.8rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-inner shrink-0", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 md:left-7 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-amber-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH PRODUCTIONS..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full h-14 md:h-16 pl-16 md:pl-20 pr-8 bg-stone-50 rounded-[1.5rem] md:rounded-[2rem] border-none text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all outline-none shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                        {['all', 'published', 'draft'].map((f) => (
                            <button
                                key={f}
                                onClick={() => handleFilterChange(f)}
                                className={cn(
                                    "px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                    activeFilter === f
                                        ? "bg-stone-950 text-white shadow-xl scale-[1.03]"
                                        : "bg-white text-stone-400 hover:text-stone-950 border border-stone-100"
                                )}
                            >
                                {f === 'published' ? 'RELEASED' : f === 'draft' ? 'IN PRODUCTION' : f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid List */}
                <div className="grid grid-cols-1 gap-6">
                    {loading && docs.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-stone-200">
                            <Loader2 className="animate-spin mb-6" size={64} />
                            <p className="font-black uppercase tracking-[0.5em] text-xs italic">Loading Cinema Archives...</p>
                        </div>
                    ) : (
                        docs.map((doc) => (
                            <div key={doc._id} className="group bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-100 shadow-sm hover:border-amber-500/20 transition-all flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                <div className="w-full md:w-64 aspect-video md:aspect-[16/10] relative rounded-[2rem] overflow-hidden bg-stone-50 shadow-inner">
                                    {doc.featuredImage?.url ? (
                                        <Image src={doc.featuredImage.url} alt={doc.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-stone-100">
                                            <ImageIcon size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-100 text-[9px] font-black uppercase text-amber-600 tracking-[0.2em]">
                                        {doc.category}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 md:space-y-6 w-full">
                                    <div className="flex flex-wrap items-center gap-3 md:gap-6">
                                        <div className={cn(
                                            "px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                                            doc.status === 'published' ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-amber-50 border-amber-100 text-amber-600"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", doc.status === 'published' ? "bg-emerald-500 animate-pulse" : "bg-amber-500")}></div>
                                            {doc.status === 'published' ? 'RELEASED' : 'IN PRODUCTION'}
                                        </div>
                                        <span className="text-[9px] md:text-[10px] font-black text-stone-300 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={14} /> {new Date(doc.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-navy-950 group-hover:text-amber-600 transition-colors italic leading-[0.95]">{doc.title}</h2>
                                    <p className="text-stone-400 text-sm md:text-base font-medium line-clamp-2 md:line-clamp-1 italic">{doc.excerpt}</p>
                                </div>

                                <div className="flex items-center justify-center gap-3 md:gap-4 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-50">
                                    <Link
                                        href={`/admin/documentaries/edit/${doc._id}`}
                                        className="w-14 h-14 md:w-16 md:h-16 bg-stone-50 rounded-[1.25rem] md:rounded-[1.8rem] flex items-center justify-center text-navy-950 hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-stone-100 group/edit"
                                    >
                                        <Edit3 size={20} className="md:w-6 md:h-6" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(doc._id)}
                                        className="w-14 h-14 md:w-16 md:h-16 bg-stone-50 rounded-[1.25rem] md:rounded-[1.8rem] flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-stone-100 group/del"
                                    >
                                        <Trash2 size={20} className="md:w-6 md:h-6" />
                                    </button>
                                    <a
                                        href={`/documentaries/${doc.slug}`}
                                        target="_blank"
                                        className="w-16 h-16 md:w-20 md:h-20 bg-stone-950 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-amber-500 hover:bg-amber-600 hover:text-white transition-all shadow-2xl group/view ml-auto md:ml-0"
                                    >
                                        <ArrowRight size={28} className="md:w-8 md:h-8" />
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