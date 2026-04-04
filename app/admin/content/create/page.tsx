'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@/components/ui/Elements";
import NextImage from 'next/image';
import {
    ArrowLeft,
    Database,
    Shield,
    Globe,
    Zap,
    Torus,
    Loader2,
    CheckCircle2,
    X,
    FileText,
    Type,
    Cpu,
    Layout,
    Layers,
    Power,
    Upload,
    PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CreateDynamicPage() {
    const router = useRouter();
    const [creating, setCreating] = useState(false);
    const [loadingLayout, setLoadingLayout] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [layout, setLayout] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: 'Official Document Archive Protocol',
        content: '<p>Welcome to your new dynamic page node. Start editing to deploy content.</p>',
        featuredImage: '/images/placeholders/hero.jpg',
        sections: [] as any[],
        parentDropdown: '',
        template: 'standard',
        status: 'published'
    });

    useEffect(() => {
        fetchLayout();
    }, []);

    const fetchLayout = async () => {
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/page-config/layout`);
            const result = await response.json();
            if (result.success) setLayout(result.data.config);
        } catch (e) {
            console.error("Failed to load layout context");
        } finally {
            setLoadingLayout(false);
        }
    };

    const dropdowns = layout?.navbar?.navigation?.filter((item: any) => !item.href && item.subLinks) || [];

    const syncSlug = (title: string) => {
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        setFormData({ ...formData, title, slug });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isSection: boolean = false, sectionIndex?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimization: Pre-check file size (e.g., 10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert("MISSION CRITICAL ERROR: Asset payload exceeds the 10MB threshold. Optimize the imagery before injection.");
            return;
        }

        try {
            setUploading(true);
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error("AUTHENTICATION VOID: Admin token not detected. Please re-authenticate.");

            const data = new FormData();
            data.append('file', file);
            data.append('category', 'content_assets'); // Standardizing for DB categorization
            data.append('type', 'image');
            data.append('title', formData.title || 'Moksha Asset');
            data.append('altText', formData.title || 'Sacred Content Visual'); // SEO Fallback

            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/media`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const result = await response.json();
            if (result.success) {
                if (isSection && sectionIndex !== undefined) {
                    const newSections = [...formData.sections];
                    newSections[sectionIndex].image = result.data.url;
                    setFormData({ ...formData, sections: newSections });
                } else {
                    setFormData({ ...formData, featuredImage: result.data.url });
                }
            } else {
                throw new Error(result.message || "Uplink handshake failed");
            }
        } catch (error: any) {
            console.error('Uplink failure:', error);
            setError(`ASSET INJECTION FAILURE: ${error.message}`);
            alert(`ASSET INJECTION FAILURE: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const addSection = () => {
        setFormData({
            ...formData,
            sections: [
                ...formData.sections,
                {
                    image: '/images/placeholders/hero.jpg',
                    content: 'Standardizing the ritual experience for a global audience.',
                    imagePosition: formData.sections.length % 2 === 0 ? 'left' : 'right'
                }
            ]
        });
    };

    const removeSection = (index: number) => {
        const newSections = formData.sections.filter((_, i) => i !== index);
        setFormData({ ...formData, sections: newSections });
    };

    const updateSectionContent = (index: number, content: string) => {
        const newSections = [...formData.sections];
        newSections[index].content = content;
        setFormData({ ...formData, sections: newSections });
    };

    const handleInitialize = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.slug) {
            alert("DEPLOYMENT VOID: Title and Slug parameters must be correctly initialized before hub authorization.");
            return;
        }

        try {
            setCreating(true);
            setError('');
            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            // 1. Initialize the new page node with full content
            const response = await fetch(`${API_BASE_URL}/api/page-config/${formData.slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    config: {
                        template: formData.template,
                        status: formData.status,
                        hero: {
                            title: formData.title,
                            subtitle: formData.excerpt,
                            backgroundImage: formData.featuredImage
                        },
                        sections: formData.sections,
                        body: {
                            content: formData.content
                        }
                    },
                    changeLog: 'Initial deployment with alternating sections'
                })
            });

            const result = await response.json();

            if (result.success) {
                // 2. If dropdown selected, update layout config
                if (formData.parentDropdown) {
                   const updatedLayout = { ...layout };
                   const dropdownIndex = updatedLayout.navbar.navigation.findIndex((n: any) => n.label === formData.parentDropdown);
                   if (dropdownIndex !== -1) {
                      updatedLayout.navbar.navigation[dropdownIndex].subLinks.push({
                         label: formData.title,
                         href: `/p/${formData.slug}`,
                         icon: 'FileText'
                      });
                      
                      await fetch(`${API_BASE_URL}/api/page-config/layout`, {
                         method: 'PUT',
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': `Bearer ${token}`
                         },
                         body: JSON.stringify({ config: updatedLayout, changeLog: `Auto-linked ${formData.slug}` })
                      });
                   }
                }

                // 3. Redirect to editor
                router.push(`/admin/content-editor?page=${formData.slug}`);
            } else {
                setError(result.message || 'Creation protocol failed');
            }
        } catch (err: any) {
            setError(err.message || 'Network failure');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-32 text-slate-900 selection:bg-amber-100">
            {/* 💎 Ultra-Premium Header: Glassmorphism & Precision */}
            <header className="sticky top-0 z-[60] bg-white/70 backdrop-blur-3xl border-b border-slate-200/60 px-8 py-6">
                <div className="max-w-[1700px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link
                            href="/admin/content"
                            className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Core Content Forge</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                                Deploy <span className="text-slate-400 font-light italic">Dynamic Hub</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Authorization Active</span>
                        </div>
                        <Link href="/admin/content">
                            <button className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-colors shadow-2xl">
                                Abort
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <Container className="mt-12 max-w-[1700px]">
                {error && (
                    <div className="mb-12 p-8 bg-white border-l-8 border-rose-500 rounded-3xl flex items-center justify-between shadow-[0_20px_50px_rgba(244,63,94,0.05)] mx-auto max-w-6xl animate-in slide-in-from-top-4">
                        <div className="flex items-center gap-8 text-rose-600">
                            <Shield className="w-10 h-10" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Fault</p>
                                <p className="text-lg font-bold text-slate-900 mt-1">{error}</p>
                            </div>
                        </div>
                        <button onClick={() => setError('')} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
                            <X size={24} />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-12">
                    <form onSubmit={handleInitialize} className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
                        
                        {/* 🛠 SIDEBAR: COMMAND CONTROLS (3 Columns) */}
                        <div className="xl:col-span-3 space-y-8 sticky top-36">
                            <div className="bg-white rounded-[3rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 space-y-12">
                                {/* SYSTEM STATUS */}
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 pb-4 border-b border-slate-50">Global Parameters</h3>
                                    
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Node Slug</label>
                                        <div className="group relative">
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl text-[12px] font-bold text-slate-900 focus:ring-2 focus:ring-slate-950 transition-all outline-none"
                                            />
                                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={16} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Parent Directory</label>
                                        <div className="relative group">
                                            <select 
                                                value={formData.parentDropdown}
                                                onChange={(e) => setFormData({ ...formData, parentDropdown: e.target.value })}
                                                className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-950 focus:ring-2 focus:ring-slate-950 outline-none cursor-pointer appearance-none"
                                            >
                                                <option value="">STANDALONE NODE</option>
                                                {dropdowns.map((d: any) => (
                                                    <option key={d.label} value={d.label}>{d.label.toUpperCase()}</option>
                                                ))}
                                            </select>
                                            <Layers className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-slate-950" size={16} />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-900 uppercase">Live Indexing</p>
                                            <p className="text-[9px] text-slate-400 font-medium">Global Network Access</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: formData.status === 'published' ? 'draft' : 'published' })}
                                            className={cn(
                                                "w-12 h-7 rounded-full flex items-center px-1 transition-all",
                                                formData.status === 'published' ? "bg-slate-950" : "bg-slate-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 bg-white rounded-full transition-transform",
                                                formData.status === 'published' ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    disabled={creating || uploading}
                                    type="submit"
                                    className={cn(
                                        "w-full h-24 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.3em] shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-2 hover:bg-emerald-500 hover:shadow-emerald-500/20 active:scale-95 transition-all group border-b-8 border-slate-800 hover:border-emerald-700",
                                        (creating || uploading) && "opacity-50 grayscale cursor-not-allowed"
                                    )}
                                >
                                    {creating ? <Loader2 className="animate-spin text-white" /> : <Zap className="text-amber-400 group-hover:text-white" />}
                                    CREATE & DEPLOY PAGE
                                </button>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.4em] text-center italic">Biometric Finalization Pending</p>
                            </div>
                        </div>

                        {/* 🏢 CANVAS: LIVE COMPOSITION HUB (9 Columns) */}
                        <div className="xl:col-span-9 space-y-16">
                            {/* 16:4 CINEMATIC HUB SIMULAOR */}
                            <div className="relative group rounded-[4rem] overflow-hidden bg-slate-200 shadow-[0_80px_200px_rgba(0,0,0,0.08)]">
                                <div className="aspect-[16/4] w-full relative">
                                    {formData.featuredImage ? (
                                        <NextImage 
                                            src={formData.featuredImage} 
                                            alt="Hero" 
                                            fill 
                                            sizes="100vw"
                                            className="object-cover opacity-90 transition-transform duration-[4s] group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                            <div className="text-center space-y-6">
                                                <Torus size={64} className="text-slate-200 animate-[spin_20s_linear_infinite] mx-auto" />
                                                <p className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-300 italic">Virtual Infrastructure Pending</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />

                                    {/* SIMULATED OVERLAYS */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center px-10 md:px-20 text-center gap-6">
                                        <div className="space-y-8 w-full max-w-6xl">
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.title}
                                                onChange={(e) => syncSlug(e.target.value)}
                                                placeholder="PRIMARY PAGE HEADLINE..."
                                                className="w-full bg-transparent border-none text-white text-5xl md:text-6xl lg:text-8xl font-black uppercase italic tracking-tighter text-center placeholder:text-white/10 focus:outline-none drop-shadow-2xl"
                                            />
                                            <input 
                                                type="text" 
                                                value={formData.excerpt}
                                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                placeholder="OVERVIEW OF THE HUB MISSION & FLOW..."
                                                className="w-full bg-transparent border-none text-white/50 text-xs md:text-lg font-bold uppercase tracking-[0.5em] text-center focus:text-white transition-colors outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* DIMENSION SPECS & ACTION */}
                                    <div className="absolute top-8 right-8">
                                        <div className="px-6 py-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">1920 x 480 px (Banner Optimized)</div>
                                    </div>
                                    <div className="absolute bottom-8 right-8">
                                        <label className="cursor-pointer bg-white text-slate-950 px-8 py-5 rounded-3xl font-black uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-3xl flex items-center gap-4 group/h-up">
                                            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} className="group-hover/h-up:text-amber-500" />}
                                            Forge Hero Core
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* ALTERNATING NODES GRID */}
                            <div className="space-y-20">
                                <div className="flex items-center justify-between px-10">
                                    <h3 className="text-2xl font-black uppercase italic text-slate-900 tracking-tight flex items-center gap-6">
                                        Alternating Content Segments
                                        <span className="w-20 h-px bg-slate-200" />
                                    </h3>
                                    <button 
                                        type="button"
                                        onClick={addSection}
                                        className="h-14 px-10 bg-slate-50 text-slate-950 hover:bg-slate-950 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-md flex items-center gap-4"
                                    >
                                        <PlusCircle size={16} /> Add Protocol Segment
                                    </button>
                                </div>

                                <div className="space-y-16">
                                    {formData.sections.map((section, idx) => (
                                        <div key={idx} className="relative group/node animate-in zoom-in-95 duration-500">
                                            <div className={cn(
                                                "grid grid-cols-1 lg:grid-cols-2 gap-20 p-12 bg-white rounded-[4rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.02)] items-center",
                                                section.imagePosition === 'right' && "lg:flex-row-reverse"
                                            )}>
                                                {/* SECTION IMAGE */}
                                                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-slate-200 group/img-node">
                                                    <NextImage 
                                                        src={section.image} 
                                                        alt="Segment Visual" 
                                                        fill 
                                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                                        className="object-cover group-hover/img-node:scale-110 transition-transform duration-1000" 
                                                    />
                                                    <div className="absolute inset-0 bg-slate-950/10 group-hover/img-node:bg-transparent transition-colors" />
                                                    
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover/img-node:opacity-100 transition-all backdrop-blur-md">
                                                        <label className="cursor-pointer bg-white text-slate-950 p-6 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-all">
                                                            <Upload size={14} /> Replace Visual Meta
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true, idx)} />
                                                        </label>
                                                    </div>
                                                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/50 backdrop-blur-lg rounded-xl text-[9px] font-black uppercase text-slate-900 border border-white/50 tracking-widest">1200 x 800 px</div>
                                                </div>

                                                {/* SECTION CONTENT */}
                                                <div className="space-y-10 py-10 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center text-[11px] font-black">0{idx + 1}</div>
                                                        <div className="h-0.5 flex-1 bg-slate-50" />
                                                    </div>
                                                    <textarea 
                                                        value={section.content}
                                                        onChange={(e) => updateSectionContent(idx, e.target.value)}
                                                        className="w-full min-h-[250px] bg-transparent text-2xl font-medium leading-relaxed border-none focus:ring-0 outline-none p-0 text-slate-900 placeholder:text-slate-100 italic"
                                                        placeholder="Forge the specific narrative core for this segment..."
                                                    />
                                                </div>

                                                <button 
                                                    type="button"
                                                    onClick={() => removeSection(idx)}
                                                    className="absolute -top-4 -right-4 w-12 h-12 bg-white text-rose-500 rounded-full flex items-center justify-center shadow-xl border border-rose-50 opacity-0 group-hover/node:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!formData.sections.length && (
                                    <div className="bg-white rounded-[4rem] p-32 text-center border-2 border-dashed border-slate-100 group hover:border-slate-300 transition-colors">
                                        <Layers size={64} className="text-slate-100 mx-auto mb-8 group-hover:text-slate-200 transition-colors" />
                                        <h3 className="text-2xl font-black text-slate-200 uppercase tracking-widest italic group-hover:text-slate-300">Composite Pattern Infrastructure Empty</h3>
                                        <p className="text-slate-300 text-[10px] uppercase font-black tracking-widest mt-4">Add segments above to build the narrative hub</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* INFRASTRUCTURE FOOTER METRICS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-t border-slate-200/50">
                        {[
                            { icon: Torus, title: 'Network Vault', desc: 'Secure node encryption' },
                            { icon: Globe, title: 'Global Access', desc: 'Edge distribution active' },
                            { icon: Shield, title: 'Audit verified', desc: 'Protocol validation pass' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-950">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black uppercase text-slate-950 tracking-widest">{item.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
