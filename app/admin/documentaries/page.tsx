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

export default function AdminDocumentaryHub() {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content?type=documentary`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setDocs(result.data.content);
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

    const filteredDocs = docs.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' || doc.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-navy-950 font-sans p-6 md:p-12">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-amber-600">
                            <Film size={18} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Cinematic Sector</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                            Cinema <span className="text-amber-600">Manifesto</span>
                        </h1>
                    </div>

                    <Link 
                        href="/admin/documentaries/create"
                        className="flex items-center gap-3 bg-stone-950 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 hover:text-white transition-all shadow-2xl shadow-stone-950/20 active:scale-95 group"
                    >
                        <Plus className="group-hover:rotate-90 transition-transform" />
                        Initialize New Production
                    </Link>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Productions', value: docs.length, icon: Film, color: 'text-stone-950', bg: 'bg-stone-50' },
                        { label: 'Released', value: docs.filter(b => b.status === 'published').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'In Production', value: docs.filter(b => b.status === 'draft').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Box Office (Views)', value: docs.reduce((acc, b) => acc + (b.views || 0), 0), icon: Eye, color: 'text-amber-500', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm flex items-center justify-between group hover:border-amber-500/30 transition-all">
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
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-amber-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY FILM TITLE OR DIRECTOR..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-16 pl-20 pr-8 bg-stone-50 rounded-[2rem] border-none text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all outline-none shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {['all', 'published', 'draft'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
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
                        filteredDocs.map((doc) => (
                            <div key={doc._id} className="group bg-white p-8 rounded-[3.5rem] border border-stone-100 shadow-sm hover:border-amber-500/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.03)] transition-all flex flex-col md:flex-row items-center gap-10">
                                <div className="w-full md:w-64 aspect-[16/10] relative rounded-[2.5rem] overflow-hidden bg-stone-50 shadow-inner">
                                    {doc.featuredImage?.url ? (
                                        <Image src={doc.featuredImage.url} alt={doc.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-stone-100">
                                            <ImageIcon size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-100 text-[9px] font-black uppercase text-amber-600 tracking-[0.2em]">
                                        {doc.category}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                                            doc.status === 'published' ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-amber-50 border-amber-100 text-amber-600"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", doc.status === 'published' ? "bg-emerald-500 animate-pulse" : "bg-amber-500")}></div>
                                            {doc.status === 'published' ? 'RELEASED' : 'IN PRODUCTION'}
                                        </div>
                                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest flex items-center gap-2.5">
                                            <Calendar size={14} /> {new Date(doc.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-navy-950 group-hover:text-amber-600 transition-colors italic leading-[0.9]">{doc.title}</h2>
                                    <p className="text-stone-400 text-sm font-medium line-clamp-1 italic">{doc.excerpt}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Link 
                                        href={`/admin/documentaries/edit/${doc._id}`}
                                        className="w-16 h-16 bg-stone-50 rounded-[1.8rem] flex items-center justify-center text-navy-950 hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-stone-100 group/edit"
                                    >
                                        <Edit3 size={24} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(doc._id)}
                                        className="w-16 h-16 bg-stone-50 rounded-[1.8rem] flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-stone-100 group/del"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                    <a 
                                        href={`/documentaries/${doc.slug}`} 
                                        target="_blank" 
                                        className="w-20 h-20 bg-stone-950 rounded-[2rem] flex items-center justify-center text-amber-500 hover:bg-amber-600 hover:text-white transition-all shadow-2xl group/view"
                                    >
                                        <ArrowRight size={32} />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
}