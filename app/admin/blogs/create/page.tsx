'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@/components/ui/Elements";
import Image from 'next/image';
import {
    CheckCircle,
    X,
    Image as ImageIcon,
    Type,
    FileText,
    Tag,
    Globe,
    Loader2,
    ArrowLeft,
    Settings,
    Shield,
    Clock,
    Sparkles,
    Plus,
    Upload,
    Torus
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function CreateBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'general',
        status: 'draft',
        featuredImage: { url: '', alt: '' },
        metaTitle: '',
        metaDescription: ''
    });

    const categories = ['general', 'services', 'about', 'news', 'resources', 'help'];
    const statuses = ['draft', 'published', 'scheduled', 'archived'];

    const handleTitleChange = (title: string) => {
        // Auto-generate slug: lowercase, replace spaces/special chars with hyphens
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // remove non-word chars
            .replace(/\s+/g, '-') // replace spaces with hyphens
            .replace(/-+/g, '-') // remove double hyphens
            .trim();

        setFormData({
            ...formData,
            title,
            slug,
            metaTitle: title // Auto-fill meta title too
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const token = localStorage.getItem('adminToken');
            const data = new FormData();
            data.append('file', file);
            data.append('category', 'blog');
            data.append('type', 'image');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await response.json();
            if (result.success) {
                setFormData({
                    ...formData,
                    featuredImage: {
                        url: result.data.url,
                        alt: ''
                    }
                });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    type: 'blog'
                })
            });

            const result = await response.json();
            if (result.success) {
                router.push('/admin/blogs');
            }
        } catch (error) {
            console.error('Failed to create blog:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-navy-950 font-sans pb-24">
            {/* Ultra-Premium Header */}
            <div className="bg-white border-b border-stone-100 sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
                <Container>
                    <div className="flex items-center justify-between h-24">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/admin/blogs"
                                className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 hover:text-navy-950 hover:bg-stone-100 transition-all group"
                            >
                                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Sparkles size={12} className="text-gold-600 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold-600">Editorial Sector Alpha</span>
                                </div>
                                <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-3">
                                    Initialize <span className="text-gold-600">Mission Log</span>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-red-500 transition-all font-sans"
                            >
                                ABORT LOG
                            </button>
                            <button
                                disabled={loading || uploading}
                                onClick={handleSave}
                                className="px-10 py-4 bg-navy-950 text-gold-500 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50 active:scale-95 group"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />}
                                AUTHORIZE BROADCAST
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="mt-12">
                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Primary Composition Sector */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="bg-white p-10 lg:p-14 rounded-[4rem] border border-stone-100 shadow-sm space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Type size={12} /> Narrative Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="ENTER THE VISIONARY TITLE..."
                                        className="w-full h-24 px-10 bg-stone-50 rounded-[2.5rem] border-none text-3xl font-black uppercase tracking-tighter italic focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none text-navy-950 shadow-inner"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Globe size={12} /> URL Segment (Slug)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                placeholder="url-friendly-name"
                                                className="w-full h-16 px-8 bg-stone-50 rounded-2xl border-none text-[11px] font-black lowercase tracking-widest focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none text-navy-950 shadow-inner"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase text-stone-300">Auto-Slugging Active</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Tag size={12} /> Category Sector</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full h-16 px-8 bg-stone-50 rounded-2xl border-none text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none text-navy-950 shadow-inner appearance-none cursor-pointer"
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><FileText size={12} /> Executive Summary (Excerpt)</label>
                                    <textarea
                                        required
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="BRIEF OVERVIEW FOR ARCHIVE CARDS..."
                                        className="w-full h-36 p-8 bg-stone-50 rounded-[2.5rem] border-none text-[11px] font-black uppercase tracking-[0.15em] leading-relaxed focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none text-navy-950 shadow-inner resize-none"
                                    />
                                </div>

                                <div className="space-y-4 pt-6">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2">
                                        <FileText size={12} /> Narrative Body (Advanced Editor)
                                    </label>
                                    <RichTextEditor
                                        content={formData.content}
                                        onChange={(content: string) => setFormData({ ...formData, content })}
                                        placeholder="WRITE THE SACRED REVELATION HERE..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Intelligence Sector */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Protocol Guard (Status) */}
                        <div className="p-10 bg-navy-950 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-600/5 group-hover:bg-gold-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 transition-colors duration-1000" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gold-500">
                                        <Settings size={18} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Launch Protocol</p>
                                </div>
                                <div className="space-y-3">
                                    {statuses.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: s })}
                                            className={cn(
                                                "w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between px-8 border",
                                                formData.status === s
                                                    ? "bg-gold-600 border-gold-500 text-navy-950 scale-[1.02] shadow-2xl shadow-gold-600/20"
                                                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                            )}
                                        >
                                            <span className="flex items-center gap-3">
                                                {s === 'draft' && <Clock size={14} />}
                                                {s === 'published' && <Sparkles size={14} />}
                                                {s}
                                            </span>
                                            {formData.status === s && <CheckCircle size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Visual Asset Identity (UPLOAD SYSTEM) */}
                        <div className="p-10 bg-white border border-stone-100 rounded-[3.5rem] shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-gold-600">
                                        <ImageIcon size={18} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Visual Identity</p>
                                </div>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Device Bridge Active</span>
                            </div>

                            <div className="space-y-4">
                                <div className="aspect-[16/9] bg-stone-50 rounded-3xl relative overflow-hidden border-2 border-dashed border-stone-100 group/image hover:border-gold-500/30 transition-all flex flex-col items-center justify-center text-stone-300">
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-gold-600" size={32} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Injecting Asset...</span>
                                        </div>
                                    ) : formData.featuredImage.url ? (
                                        <>
                                            <Image src={formData.featuredImage.url} alt="Preview" fill className="object-contain" />
                                            <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <label className="cursor-pointer bg-white text-navy-950 p-3 rounded-full hover:scale-110 transition-transform">
                                                    <Upload size={18} />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                </label>
                                                <button onClick={() => setFormData({ ...formData, featuredImage: { url: '', alt: '' } })} className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100/50 transition-colors">
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-stone-200">
                                                <Plus size={32} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest mb-1">Pick From Device</span>
                                            <span className="text-[7px] font-bold text-stone-300 uppercase tracking-[0.2em]">Recommended: 1620 x 700 px (16:9)</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest pl-4 flex items-center gap-1.5">
                                    Visual Alt Text (SEO Mandatory) *
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="DESCRIBE THIS IMAGE FOR SEO..."
                                    value={formData.featuredImage.alt}
                                    onChange={(e) => setFormData({ ...formData, featuredImage: { ...formData.featuredImage, alt: e.target.value } })}
                                    className={cn(
                                        "w-full h-14 px-6 bg-stone-50 rounded-xl border-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none shadow-inner",
                                        !formData.featuredImage.alt ? "ring-2 ring-rose-100" : ""
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest pl-4">Manual Remote URL (Fallback)</label>
                                <input
                                    type="text"
                                    placeholder="HTTP://...GIRDR.COM/ASSET.JPG"
                                    value={formData.featuredImage.url}
                                    onChange={(e) => setFormData({ ...formData, featuredImage: { ...formData.featuredImage, url: e.target.value } })}
                                    className="w-full h-14 px-6 bg-stone-50 rounded-xl border-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Search Intelligence (SEO) */}
                        <div className="p-10 bg-white border border-stone-100 rounded-[3.5rem] shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-navy-300">
                                    <Shield size={18} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">SEO Intelligence</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest pl-4">Meta Title Marker</label>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        placeholder="SEARCH ENGINE DISPLAY TITLE"
                                        className="w-full h-14 px-6 bg-stone-50 rounded-xl border-none text-[10px] font-bold tracking-widest focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none shadow-inner"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest pl-4">Meta Narrative</label>
                                    <textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        placeholder="SEARCH ENGINE SNIPPET..."
                                        className="w-full h-40 p-6 bg-stone-50 rounded-xl border-none text-[10px] font-bold tracking-widest focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none shadow-inner resize-none overflow-y-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Container>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
}
