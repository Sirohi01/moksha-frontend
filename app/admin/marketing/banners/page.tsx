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
    X,
    Settings2,
    Calendar,
    Palette,
    Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BannersPage() {
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    const [formData, setFormData] = useState<any>({
        type: 'popup', 
        title: '',
        content: '',
        imageUrl: '',
        targetUrl: '',
        isActive: true,
        displayRules: {
            page: 'all',
            priority: 0
        },
        appearance: {
            theme: 'navy-gold', // 'navy-gold', 'light', 'dark', 'emergency-red'
            maxWidth: '450px',
            showCloseButton: true
        }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await marketingAPI.getContent();
            setContent(res.data || []);
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
                setFormData((prev: any) => ({ ...prev, imageUrl: res.data.src }));
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
                displayRules: { page: 'all', priority: 0 },
                appearance: {
                    theme: 'navy-gold',
                    maxWidth: '450px',
                    showCloseButton: true
                }
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

    // Helper to get theme styles for preview
    const getThemeStyles = (theme: string) => {
        switch(theme) {
            case 'emergency-red': 
                return { bg: 'bg-white', title: 'text-rose-600', accent: 'bg-rose-600', button: 'bg-rose-600 text-white', border: 'border-rose-100' };
            case 'dark': 
                return { bg: 'bg-navy-950', title: 'text-gold-500', accent: 'bg-gold-500', button: 'bg-gold-500 text-navy-950', border: 'border-white/10' };
            case 'light': 
                return { bg: 'bg-white', title: 'text-navy-950', accent: 'bg-navy-950', button: 'bg-navy-950 text-white', border: 'border-navy-50' };
            default: 
                return { bg: 'bg-white', title: 'text-navy-950', accent: 'bg-gold-600', button: 'bg-navy-950 text-gold-500', border: 'border-navy-50' };
        }
    };

    const currentTheme = getThemeStyles(formData.appearance.theme);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-32 pt-6 px-4">
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
                            <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">Mission Propaganda Control</p>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-navy-950 uppercase italic tracking-tighter leading-none">
                            Pop-up <span className="text-gold-600">Architect</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 text-[10px] font-black uppercase tracking-widest text-navy-400 bg-navy-50/50 px-6 py-3 rounded-full border border-navy-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {content.length} Active Nodes
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                {/* LEFT: CONFIGURATION VAULT */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="bg-white rounded-[3rem] p-8 border border-navy-50 shadow-2xl space-y-8 h-full">
                        {/* Type & Status */}
                        <div className="flex items-center justify-between px-2">
                             <div className="flex gap-2">
                                {['popup', 'banner'].map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => setFormData({...formData, type: t})}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            formData.type === t ? "bg-navy-950 text-gold-500" : "bg-navy-50 text-navy-400 hover:bg-navy-100"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                             </div>
                             <button 
                                onClick={() => setFormData((prev: any) => ({ ...prev, isActive: !prev.isActive }))}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                                    formData.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                )}
                            >
                                {formData.isActive ? 'Active' : 'Offline'}
                            </button>
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-navy-300 uppercase tracking-widest ml-4 flex items-center gap-2 italic">
                                    <Zap className="w-3 h-3" /> Mission Title
                                </label>
                                <input
                                    placeholder="e.g. EMERGENCY DONATION DRIVE..."
                                    className="w-full p-6 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-2xl outline-none font-black text-navy-950 transition-all uppercase tracking-widest text-xs"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-navy-300 uppercase tracking-widest ml-4 flex items-center gap-2 italic">
                                    <Search className="w-3 h-3" /> Core Content
                                </label>
                                <textarea
                                    placeholder="MANIFESTO CONTENT..."
                                    className="w-full p-6 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-2xl outline-none font-bold text-navy-950 transition-all text-xs italic tracking-tight min-h-[100px] resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Visual Config */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-navy-300 uppercase tracking-widest ml-4 flex items-center gap-2">
                                    <Palette className="w-3 h-3" /> Theme
                                </label>
                                <select 
                                    className="w-full p-4 bg-navy-50/50 rounded-xl outline-none text-[10px] font-black uppercase tracking-widest text-navy-800 border-2 border-transparent focus:border-gold-500"
                                    value={formData.appearance.theme}
                                    onChange={(e) => setFormData({...formData, appearance: {...formData.appearance, theme: e.target.value}})}
                                >
                                    <option value="navy-gold">Navy & Gold</option>
                                    <option value="emergency-red">Emergency Red</option>
                                    <option value="light">High Noon (Light)</option>
                                    <option value="dark">Midnight (Dark)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-navy-300 uppercase tracking-widest ml-4 flex items-center gap-2">
                                    <Maximize2 className="w-3 h-3" /> Impact Width
                                </label>
                                <select 
                                    className="w-full p-4 bg-navy-50/50 rounded-xl outline-none text-[10px] font-black uppercase tracking-widest text-navy-800 border-2 border-transparent focus:border-gold-500"
                                    value={formData.appearance.maxWidth}
                                    onChange={(e) => setFormData({...formData, appearance: {...formData.appearance, maxWidth: e.target.value}})}
                                >
                                    <option value="350px">Slim (350px)</option>
                                    <option value="450px">Standard (450px)</option>
                                    <option value="550px">Wide (550px)</option>
                                    <option value="650px">Max (650px)</option>
                                </select>
                            </div>
                        </div>

                        {/* Assets */}
                        <div className="space-y-4 pt-4 border-t border-navy-50">
                             <div className="flex items-center justify-between px-2">
                                <label className="text-[9px] font-black text-navy-300 uppercase tracking-[0.3em]">Asset Payload</label>
                                <label htmlFor="asset-upload" className="flex items-center gap-2 text-[9px] font-black text-gold-600 uppercase tracking-widest cursor-pointer hover:underline bg-gold-50 px-3 py-1 rounded-lg">
                                    <Upload className="w-3 h-3" /> {isUploading ? 'SYNCING...' : 'UPLOAD'}
                                </label>
                                <input type="file" id="asset-upload" className="hidden" onChange={handleFileUpload} accept="image/*" />
                            </div>
                            <input
                                placeholder="ASSET URL..."
                                className="w-full p-4 bg-navy-50/10 border-2 border-dashed border-navy-100 rounded-xl outline-none font-bold text-navy-400 transition-all text-[9px] select-all truncate"
                                value={formData.imageUrl}
                                readOnly
                            />
                            <input
                                placeholder="REDIRECT PROTOCOL (URL)..."
                                className="w-full p-5 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-2xl outline-none font-bold text-navy-700 transition-all text-xs"
                                value={formData.targetUrl}
                                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                            />
                        </div>

                        {/* Deploy */}
                        <button 
                            onClick={handleSubmit}
                            disabled={!formData.title || !formData.imageUrl || status === 'saving'}
                            className={cn(
                                "w-full py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group mt-auto",
                                (!formData.title || !formData.imageUrl || status === 'saving')
                                    ? "bg-navy-50 text-navy-200 cursor-not-allowed"
                                    : "bg-navy-950 text-gold-500 hover:bg-black hover:translate-y-[-4px]"
                            )}
                        >
                            <div className="absolute inset-0 bg-gold-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700"></div>
                            {status === 'saving' ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <Settings2 className="w-5 h-5 relative z-10" />}
                            <span className="relative z-10">{status === 'success' ? 'Synchronized' : 'Initiate Deployment'}</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT: LIVE MATRIX PREVIEW */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="bg-white rounded-[3.5rem] p-10 border border-navy-50 shadow-2xl space-y-8 overflow-hidden relative group h-full flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-navy-300 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                                <Search className="w-4 h-4" /> Live Manifestation
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
                            "relative mx-auto bg-stone-100 border-[14px] border-navy-950 rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center",
                            previewMode === 'desktop' ? "w-full min-h-[600px]" : "w-72 h-[600px]"
                        )}>
                            {!formData.imageUrl ? (
                                <div className="text-center space-y-4 opacity-10">
                                    <ImageIcon className="w-16 h-16 mx-auto animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Manifestation</p>
                                </div>
                            ) : (
                                <div 
                                    className={cn(
                                        "rounded-[2.5rem] shadow-[0_50px_200px_-20px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 border relative group/pop",
                                        currentTheme.bg,
                                        currentTheme.border
                                    )}
                                    style={{ width: previewMode === 'desktop' ? formData.appearance.maxWidth : '240px' }}
                                >
                                    {/* Close Button Preview */}
                                    <div className="absolute top-6 right-6 z-20">
                                        <div className="p-2 bg-black/10 backdrop-blur-md rounded-full text-navy-800 hover:bg-black/20 transition-all cursor-not-allowed border border-white/20">
                                            <X className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="aspect-[16/10] w-full relative overflow-hidden">
                                        <img src={formData.imageUrl} className="w-full h-full object-cover group-hover/pop:scale-105 transition-transform duration-1000" alt="Popup" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        
                                        {/* Dynamic Badge in Preview */}
                                        <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full animate-ping", currentTheme.accent)}></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-lg">Mission Portal</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-10 space-y-8 text-center bg-transparent relative z-10">
                                        <div className="space-y-3">
                                            <h4 className={cn(
                                                "font-black text-3xl uppercase italic tracking-tighter leading-none line-clamp-2 transition-colors",
                                                currentTheme.title
                                            )}>
                                                {formData.title || 'Mission Undefined'}
                                            </h4>
                                            <div className={cn("w-14 h-1 mx-auto rounded-full transition-colors", currentTheme.accent)}></div>
                                        </div>
                                        
                                        <p className={cn(
                                            "text-xs font-bold italic line-clamp-4 leading-relaxed px-2 transition-opacity",
                                            formData.appearance.theme === 'dark' ? "text-white/60" : "text-navy-400/80"
                                        )}>
                                            {formData.content || 'Awaiting transmission protocol... your content will be projected here across the global mission nodes.'}
                                        </p>

                                        <div className="pt-4 space-y-4">
                                            <div className={cn(
                                                "w-full py-5 text-[10px] font-black uppercase tracking-[0.5em] rounded-full flex items-center justify-center gap-3 shadow-xl transition-all",
                                                formData.targetUrl ? "hover:scale-105 active:scale-95" : "opacity-30 cursor-not-allowed",
                                                currentTheme.button
                                            )}>
                                                {formData.targetUrl ? 'Access Protocol' : 'No Action'} <ExternalLink className="w-4 h-4" />
                                            </div>
                                            <div className="text-center">
                                                <button className="text-[10px] font-black text-navy-400 uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity cursor-not-allowed">
                                                    Decline Entry
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
                        <div className="flex items-center justify-between px-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-navy-950 rounded-xl flex items-center justify-center">
                                    <LayoutPanelTop className="w-5 h-5 text-gold-500" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-navy-300 uppercase tracking-[0.4em] mb-1">Mission Inventory</h3>
                                    <p className="text-xl font-black text-navy-950 uppercase italic tracking-tighter">Deployed <span className="text-gold-600">Assets</span></p>
                                </div>
                            </div>
                            <button onClick={fetchData} className="text-[10px] font-black text-gold-600 uppercase tracking-widest hover:underline bg-gold-50 px-4 py-2 rounded-xl border border-gold-100">Synchronize Inventory</button>
                        </div>
                        
                        {loading ? (
                            <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-navy-200" /></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {content.length === 0 && (
                                    <div className="col-span-full py-20 text-center border-4 border-dashed border-navy-50 rounded-[4rem]">
                                        <p className="text-[10px] font-black text-navy-200 uppercase tracking-[0.5em] animate-pulse">Scanning... Zero Assets Detected</p>
                                    </div>
                                )}
                                {content.map((item) => (
                                    <div key={item._id} className="group bg-white p-6 rounded-[3rem] border border-navy-50 shadow-xl hover:shadow-2xl transition-all hover:translate-y-[-8px] relative overflow-hidden flex flex-col justify-between">
                                        <div className="flex items-start gap-5">
                                            <div className="w-24 h-24 rounded-[1.5rem] bg-navy-50 overflow-hidden shadow-inner border border-navy-100/50 flex-shrink-0 relative">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} className="w-full h-full object-cover filter saturate-0 group-hover:saturate-100 transition-all duration-700" alt="Asset" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-navy-200" /></div>
                                                )}
                                                <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors"></div>
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                        item.type === 'popup' ? "bg-gold-50 text-gold-600" : "bg-emerald-50 text-emerald-600"
                                                    )}>
                                                        {item.type}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleToggle(item._id)}
                                                            className={cn("p-2 rounded-xl transition-all shadow-sm", item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}
                                                        >
                                                            {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item._id)}
                                                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <h4 className="text-navy-950 font-black text-base uppercase italic tracking-tighter truncate group-hover:text-gold-600 transition-colors leading-tight">{item.title}</h4>
                                                <div className="flex items-center gap-4 text-[9px] font-black text-navy-300 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 pt-4 border-t border-navy-50 flex items-center justify-between">
                                            <button 
                                                onClick={() => setFormData(item)}
                                                className="text-[9px] font-black text-navy-400 uppercase tracking-widest hover:text-navy-950 transition-colors"
                                            >
                                                Load Parameters
                                            </button>
                                            {item.targetUrl && (
                                                <a href={item.targetUrl} target="_blank" className="p-2 bg-navy-50 rounded-lg text-navy-400 hover:bg-navy-950 hover:text-gold-500 transition-all">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
}
