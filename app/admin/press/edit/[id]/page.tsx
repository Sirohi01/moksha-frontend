'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  ShieldCheck,
  Newspaper,
  Save,
  BookOpen,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function EditPressReleasePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'official',
        status: 'draft',
        featuredImage: { url: '', alt: '' },
        youtubeUrl: '',
        reelUrl: '',
        metaTitle: '',
        metaDescription: ''
    });

    useEffect(() => {
        if (params.id) {
            fetchPR(params.id as string);
        }
    }, [params.id]);

    const fetchPR = async (id: string) => {
        try {
            setFetching(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setFormData({
                    title: result.data.title || '',
                    slug: result.data.slug || '',
                    excerpt: result.data.excerpt || '',
                    content: result.data.content || '',
                    category: result.data.category || 'official',
                    status: result.data.status || 'draft',
                    featuredImage: result.data.featuredImage || { url: '', alt: '' },
                    youtubeUrl: result.data.youtubeUrl || '',
                    reelUrl: result.data.reelUrl || '',
                    metaTitle: result.data.metaTitle || '',
                    metaDescription: result.data.metaDescription || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch press release:', error);
        } finally {
            setFetching(false);
        }
    };

    const categories = ['official', 'media-kit', 'statutory', 'mission-log', 'clarification'];
    const statuses = ['draft', 'published', 'scheduled', 'archived'];

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const token = localStorage.getItem('adminToken');
            const data = new FormData();
            data.append('file', file);
            data.append('category', 'press');
            data.append('type', 'image');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });
            const result = await response.json();
            if (result.success) {
                setFormData({ ...formData, featuredImage: { url: result.data.url, alt: formData.title } });
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                router.push('/admin/press');
            }
        } catch (error) {
            console.error('Failed to update press release:', error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-navy-500 mb-4" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 italic">Syncing Official Archives...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-navy-950 font-sans pb-24">
            <div className="bg-white border-b border-stone-100 sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
                <Container>
                    <div className="flex items-center justify-between h-24">
                        <div className="flex items-center gap-6">
                            <Link href="/admin/press" className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 hover:text-navy-950 transition-all group">
                                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <div>
                                <div className="text-navy-600 font-black text-[9px] uppercase tracking-[0.4em]">Modification Sector Omega</div>
                                <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none text-navy-950">Update <span className="text-navy-700">Official Protocol</span></h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-red-500 transition-all">ABORT UPDATE</button>
                            <button disabled={loading || uploading} onClick={handleSave} className="px-10 py-4 bg-navy-950 text-gold-500 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                AUTHORIZE UPDATE
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="mt-12">
                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="bg-white p-10 lg:p-14 rounded-[4rem] border border-stone-100 shadow-sm space-y-10">
                             <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Newspaper size={12} /> Press Title / Headline</label>
                                    <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="ENTER THE OFFICIAL HEADLINE..." className="w-full h-24 px-10 bg-stone-50 rounded-[2.5rem] border-none text-3xl font-black uppercase tracking-tighter italic focus:ring-4 focus:ring-navy-500/10 outline-none text-navy-950 shadow-inner" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Globe size={12} /> Submission Slug</label>
                                        <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="url-friendly-slug" className="w-full h-16 px-8 bg-stone-50 rounded-2xl border-none text-[11px] font-black lowercase tracking-widest outline-none text-navy-950 shadow-inner" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Tag size={12} /> Archive Category</label>
                                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full h-16 px-8 bg-stone-50 rounded-2xl border-none text-[11px] font-black uppercase tracking-widest appearance-none cursor-pointer outline-none shadow-inner">
                                            {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Newspaper size={12} /> Broadcast Video (YouTube)</label>
                                        <input type="text" value={formData.youtubeUrl || ''} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="HTTPS://WWW.YOUTUBE.COM/WATCH?V=..." className="w-full h-16 px-8 bg-stone-50 rounded-2xl border-none text-[11px] font-black tracking-widest outline-none text-navy-950 shadow-inner" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><Play size={12} className="rotate-90 text-navy-950" /> Vertical Reel/Shorts</label>
                                        <input type="text" value={formData.reelUrl || ''} onChange={(e) => setFormData({...formData, reelUrl: e.target.value})} placeholder="HTTPS://WWW.YOUTUBE.COM/SHORTS/..." className="w-full h-16 px-8 bg-stone-50 rounded-2xl border-none text-[11px] font-black tracking-widest outline-none text-navy-950 shadow-inner hover:ring-2 hover:ring-navy-500/20 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><FileText size={12} /> Media Abstract (Excerpt)</label>
                                    <textarea required value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} placeholder="CONCISE SUMMARY..." className="w-full h-36 p-8 bg-stone-50 rounded-[2.5rem] border-none text-[11px] font-black uppercase tracking-[0.15em] outline-none text-navy-950 shadow-inner resize-none" />
                                </div>
                                <div className="space-y-4 pt-6">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-8 flex items-center gap-2"><FileText size={12} /> Official Statement (Content)</label>
                                    <textarea required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="FULL STATEMENT BODY..." className="w-full min-h-[500px] p-12 bg-stone-50 rounded-[3.5rem] border-none text-lg font-medium outline-none text-navy-950 shadow-inner" />
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                        <div className="p-10 bg-navy-950 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                             <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gold-500"><Settings size={18} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Broadcast Protocol</p>
                                </div>
                                <div className="space-y-3">
                                    {statuses.map(s => (
                                        <button key={s} type="button" onClick={() => setFormData({...formData, status: s})} className={cn("w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between px-8 border", formData.status === s ? "bg-gold-600 border-gold-500 text-navy-950 scale-[1.02] shadow-2xl shadow-gold-600/20" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10")}>
                                            <span className="flex items-center gap-3">{s === 'draft' && <Clock size={14} />}{s === 'published' && <Sparkles size={14} />}{s}</span>
                                            {formData.status === s && <CheckCircle size={14} />}
                                        </button>
                                    ))}
                                </div>
                             </div>
                        </div>
                        <div className="p-10 bg-white border border-stone-100 rounded-[3.5rem] shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-navy-600"><ImageIcon size={18} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Official Media</p>
                                </div>
                            </div>
                            <div className="aspect-[16/9] bg-stone-50 rounded-3xl relative overflow-hidden border-2 border-dashed border-stone-100 group/image hover:border-navy-500/30 transition-all flex flex-col items-center justify-center text-stone-300">
                                {uploading ? <Loader2 className="animate-spin text-navy-600" /> : formData.featuredImage.url ? (
                                    <>
                                        <Image src={formData.featuredImage.url} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <label className="cursor-pointer bg-white text-navy-950 p-3 rounded-full"><Upload size={18} /><input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} /></label>
                                            <button onClick={() => setFormData({...formData, featuredImage: {url: '', alt: ''}})} className="bg-red-500 text-white p-3 rounded-full"><X size={18} /></button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                        <Plus size={32} className="mb-2" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Select Media Asset</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </Container>
        </div>
    );
}
