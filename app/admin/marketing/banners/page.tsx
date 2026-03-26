'use client';

import { useState, useEffect } from 'react';
import { marketingAPI, galleryAPI } from '@/lib/api';
import { 
    Image as ImageIcon, 
    Plus, 
    Eye, 
    EyeOff, 
    LayoutPanelTop, 
    Trash2, 
    Upload, 
    Loader2, 
    Zap, 
    CheckCircle2, 
    ExternalLink,
    Search,
    Monitor,
    Smartphone,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BannersPage() {
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    const [formData, setFormData] = useState({
        type: 'popup', // Default and focused on popup
        title: '',
        content: '',
        imageUrl: '',
        targetUrl: '',
        isActive: true,
        displayRules: {
            page: 'all'
        }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await marketingAPI.getContent();
            // Filter only popups if user wants only popups visible here
            const popups = res.data.filter((item: any) => item.type === 'popup');
            setContent(popups);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch marketing content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const data = new FormData();
            data.append('image', file);
            
            const res = await galleryAPI.uploadImage(data);
            if (res.success) {
                setFormData(prev => ({ ...prev, imageUrl: res.data.src }));
            }
        } catch (err) {
            console.error('Asset uplink failure:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.imageUrl) return;
        
        setStatus('saving');
        try {
            await marketingAPI.createContent(formData);
            setStatus('success');
            setFormData({
                type: 'popup',
                title: '',
                content: '',
                imageUrl: '',
                targetUrl: '',
                isActive: true,
                displayRules: { page: 'all' }
            });
            fetchData();
        } catch (err: any) {
            setStatus('error');
            setError(err.message);
        } finally {
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await marketingAPI.toggleContentStatus(id);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanent deletion requested. Confirm protocol?')) return;
        try {
            await marketingAPI.deleteContent(id);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-32 pt-6">
            {/* HUB HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-navy-50 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 p-3 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <Zap className="w-full h-full text-gold-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-gold-600 animate-pulse"></span>
                            <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">Propaganda Matrix Active</p>
                        </div>
                        <h1 className="text-3xl font-black text-navy-950 uppercase italic tracking-tighter leading-none">
                            Popup <span className="text-gold-600">Intel Hub</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 text-[10px] font-black uppercase tracking-widest text-navy-400 bg-navy-50/50 px-6 py-3 rounded-full border border-navy-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {content.length} Popups Synchronized
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                {/* LEFT: CONFIGURATION VAULT */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="bg-white rounded-[3rem] p-10 border border-navy-50 shadow-2xl space-y-10 h-full flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.4em]">Popup Parameters</label>
                                <button 
                                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                                        formData.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                    )}
                                >
                                    {formData.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {formData.isActive ? 'Active' : 'Inactive'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <input
                                    placeholder="POPUP TITLE (e.g. Emergency Alert)..."
                                    className="w-full p-6 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-[1.5rem] outline-none font-black text-navy-950 transition-all uppercase tracking-widest text-xs h-16"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <textarea
                                    placeholder="DESCRIPTION CONTENT..."
                                    className="w-full p-6 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-[2rem] outline-none font-bold text-navy-950 transition-all text-xs italic tracking-tight min-h-[120px] resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-navy-50">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[9px] font-black text-navy-300 uppercase tracking-[0.3em]">Visual Asset</label>
                                    <label htmlFor="asset-upload" className="flex items-center gap-2 text-[9px] font-black text-gold-600 uppercase tracking-widest cursor-pointer hover:underline">
                                        <Upload className="w-3 h-3" /> {isUploading ? 'Uploading...' : 'Upload Image'}
                                    </label>
                                    <input type="file" id="asset-upload" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                </div>
                                <input
                                    placeholder="ASSET URL (AUTO-POPULATED)..."
                                    className="w-full p-5 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-2xl outline-none font-bold text-navy-700 transition-all text-[10px] select-all"
                                    value={formData.imageUrl}
                                    readOnly={isUploading}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                                <input
                                    placeholder="REDIRECTION PAYLOAD (URL)..."
                                    className="w-full p-5 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-2xl outline-none font-bold text-navy-700 transition-all text-[10px] select-all"
                                    value={formData.targetUrl}
                                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                                />
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={!formData.title || !formData.imageUrl || status === 'saving'}
                                className={cn(
                                    "w-full py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group",
                                    (!formData.title || !formData.imageUrl || status === 'saving')
                                        ? "bg-navy-50 text-navy-200 cursor-not-allowed"
                                        : "bg-navy-950 text-gold-500 hover:bg-black hover:translate-y-[-4px]"
                                )}
                            >
                                <div className="absolute inset-0 bg-gold-600/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700"></div>
                                {status === 'saving' ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <Plus className="w-5 h-5 relative z-10" />}
                                <span className="relative z-10">{status === 'success' ? 'Deployed Successfully' : 'Deploy Popup'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: LIVE MATRIX PREVIEW */}
                <div className="lg:col-span-7 flex flex-col">
                    {/* ASSET VISUALIZER */}
                    <div className="bg-white rounded-[3.5rem] p-10 border border-navy-50 shadow-2xl space-y-8 overflow-hidden relative group h-full flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-navy-300 uppercase tracking-[0.4em] flex items-center gap-2">
                                <Search className="w-4 h-4" /> Live Popup Visualizer
                            </h3>
                            <div className="flex items-center gap-6">
                                <div className="flex p-1 bg-navy-50 rounded-xl">
                                    <button 
                                        onClick={() => setPreviewMode('desktop')}
                                        className={cn("p-2 rounded-lg transition-all", previewMode === 'desktop' ? "bg-white text-navy-950 shadow-sm" : "text-navy-300 hover:text-navy-950")}
                                    >
                                        <Monitor className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setPreviewMode('mobile')}
                                        className={cn("p-2 rounded-lg transition-all", previewMode === 'mobile' ? "bg-white text-navy-950 shadow-sm" : "text-navy-300 hover:text-navy-950")}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "relative mx-auto bg-[#f1f5f9] border-[12px] border-navy-950 rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center",
                            previewMode === 'desktop' ? "w-full min-h-[700px]" : "w-80 h-[700px]"
                        )}>
                            {!formData.imageUrl ? (
                                <div className="text-center space-y-4 opacity-20">
                                    <ImageIcon className="w-16 h-16 mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Asset Injection</p>
                                </div>
                            ) : (
                                <div className={cn(
                                    "bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-500 border border-navy-50 relative",
                                    previewMode === 'desktop' ? "w-[450px]" : "w-[240px]"
                                )}>
                                    {/* Cancel Option for Preview */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white cursor-not-allowed">
                                            <X className="w-3 h-3" />
                                        </div>
                                    </div>

                                    <div className="aspect-video w-full relative">
                                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Popup" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-10 space-y-6 text-center">
                                        <div className="space-y-3">
                                            <h4 className="text-navy-950 font-black text-2xl uppercase italic tracking-tighter leading-none line-clamp-2">
                                                {formData.title || 'Untitled Campaign'}
                                            </h4>
                                            <div className="w-10 h-1 bg-gold-600 mx-auto rounded-full"></div>
                                        </div>
                                        
                                        <p className="text-navy-400 text-[11px] font-bold italic line-clamp-3 leading-relaxed px-4">
                                            {formData.content || 'Your promotional description will manifest here...'}
                                        </p>

                                        <div className="pt-4 flex flex-col gap-4">
                                            <div className={cn(
                                                "w-full py-4 bg-navy-950 text-gold-500 text-[9px] font-black uppercase tracking-[0.4em] rounded-full flex items-center justify-center gap-2",
                                                !formData.targetUrl && "opacity-50"
                                            )}>
                                                {formData.targetUrl ? 'Initiate Protocol' : 'No Action Defined'} <ExternalLink className="w-3 h-3" />
                                            </div>
                                            <div className="text-center">
                                                <button 
                                                    className="text-[10px] font-black text-rose-600 uppercase tracking-widest opacity-40 cursor-not-allowed"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CAMPAIGN INVENTORY SECTION */}
            <div className="space-y-10 pt-10">
                        <div className="flex items-center justify-between px-6">
                            <h3 className="text-[10px] font-black text-navy-300 uppercase tracking-[0.4em] flex items-center gap-2">
                                <LayoutPanelTop className="w-4 h-4" /> Popup Inventory
                            </h3>
                            <button onClick={fetchData} className="text-[9px] font-black text-gold-600 uppercase tracking-widest hover:underline">Refresh List</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.length === 0 && !loading && (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-navy-50 rounded-[3rem]">
                                    <p className="text-[10px] font-black text-navy-200 uppercase tracking-[0.5em]">No Active Popups</p>
                                </div>
                            )}
                            {content.map((item) => (
                                <div key={item._id} className="group bg-white p-6 rounded-[2.5rem] border border-navy-50 shadow-xl hover:shadow-2xl transition-all hover:translate-y-[-4px] relative overflow-hidden">
                                    <div className="flex items-start gap-5">
                                        <div className="w-20 h-20 rounded-2xl bg-navy-50 overflow-hidden shadow-inner border border-navy-100/50 flex-shrink-0">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all" alt="Thumb" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-navy-200" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="px-3 py-1 bg-gold-50 text-gold-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                    POPUP
                                                </span>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            handleToggle(item._id);
                                                            setFormData(item);
                                                        }}
                                                        className={cn("p-2 rounded-xl transition-all", item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}
                                                    >
                                                        {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="text-navy-950 font-black text-sm uppercase italic tracking-tighter truncate group-hover:text-gold-600 transition-colors">{item.title}</h4>
                                            <p className="text-navy-400 text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">ID: {item._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
}
