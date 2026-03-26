'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Trash2, Shield, Upload, Loader2, Globe, Users, CheckCircle2, AlertCircle, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewsletterDispatchPage() {
    const [asset, setAsset] = useState<string | null>(null);
    const [assetType, setAssetType] = useState<'image' | 'html'>('image');
    const [isUploading, setIsUploading] = useState(false);
    const [showDeploy, setShowDeploy] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    
    const [config, setConfig] = useState({
        campaignName: 'Marketing Intel',
        subject: '',
        segment: 'all'
    });
    
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [subscriberCount, setSubscriberCount] = useState(0);

    // Fetch live subscriber directory
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
                const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribers`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = await response.json();
                if (data.success) {
                    setSubscribers(data.data);
                    setSubscriberCount(data.data.length);
                }
            } catch (e) {
                setSubscriberCount(0);
            }
        };
        fetchMeta();
    }, []);

    const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setAsset(content);
            setAssetType(file.type.includes('html') ? 'html' : 'image');
            setIsUploading(false);
        };
        
        if (file.type.includes('html')) {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    };

    const handleDeploy = async () => {
        if (!asset || !config.subject) return;
        
        setShowDeploy(true);
        setStatus('sending');
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            
            let finalHtml = asset;
            if (assetType === 'image') {
                finalHtml = `<img src="${asset}" style="width: 100%; display: block; border: none;" alt="Newsletter Content" />`;
            }

            const response = await fetch(`${API_BASE_URL}/api/newsletter/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    subject: config.subject,
                    html: finalHtml,
                    segment: config.segment
                })
            });
            
            const data = await response.json();
            if (data.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Transmission fault:', error);
            setStatus('error');
        } finally {
            setTimeout(() => {
                setShowDeploy(false);
                setStatus('idle');
            }, 3000);
        }
    };

    const filteredSubscribers = subscribers.filter(sub => {
        if (!sub.status || sub.status === 'active') {
            if (config.segment === 'all') return true;
            return sub.source === config.segment;
        }
        return false;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-32 pt-6">
            {/* COMPACT HUB HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-3xl p-6 rounded-3xl border border-navy-50 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 p-2 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                        <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" style={{ filter: 'none' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-gold-600 animate-pulse"></span>
                            <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">Administrative Channel Active</p>
                        </div>
                        <h1 className="text-3xl font-black text-navy-950 uppercase italic tracking-tighter leading-none">
                            Broadcast <span className="text-gold-600">Intelligence</span>
                        </h1>
                    </div>
                </div>
                
                <button 
                    onClick={handleDeploy}
                    disabled={!asset || !config.subject || showDeploy}
                    className={cn(
                        "group px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center gap-4 shadow-2xl active:scale-95 overflow-hidden relative",
                        (!asset || !config.subject || showDeploy) 
                            ? "bg-navy-50 text-navy-200 cursor-not-allowed" 
                            : "bg-navy-950 text-gold-500 hover:bg-black hover:translate-y-[-4px]"
                    )}
                >
                    <div className="absolute inset-0 bg-gold-600/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700"></div>
                    {showDeploy ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <Send className="w-5 h-5 relative z-10" />}
                    <span className="relative z-10">Initiate Broadcast</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* LEFT: TRANSMISSION PARAMS */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-navy-50 shadow-2xl space-y-10 sticky top-6">
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-navy-400 uppercase tracking-[0.4em] ml-2">Transmission Identity</label>
                            <input
                                className="w-full p-5 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-2xl outline-none font-black text-navy-950 transition-all uppercase tracking-widest text-xs h-16"
                                value={config.campaignName}
                                onChange={(e) => setConfig({ ...config, campaignName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-navy-400 uppercase tracking-[0.4em] ml-2">Email Header (Subject)</label>
                            <textarea
                                className="w-full p-6 bg-navy-50/50 border-2 border-transparent focus:border-gold-500 rounded-3xl outline-none font-bold text-navy-950 transition-all text-sm italic tracking-tight min-h-[140px] resize-none"
                                placeholder="What will they see in their inbox?..."
                                value={config.subject}
                                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-navy-400 uppercase tracking-[0.4em] ml-2">Routing Segment</label>
                                <select
                                    className="w-full p-4 bg-navy-50 border-2 border-transparent focus:border-gold-500 rounded-xl outline-none font-black text-navy-950 transition-all uppercase tracking-widest text-[9px] h-14 appearance-none shadow-sm cursor-pointer"
                                    value={config.segment}
                                    onChange={(e) => setConfig({ ...config, segment: e.target.value })}
                                >
                                    <option value="all">Global Matrix ({subscriberCount})</option>
                                    <option value="newsletter">Email List</option>
                                    <option value="blog_page">Blog Subs</option>
                                </select>
                            </div>
                        </div>

                        {/* LIVE NODE LIST */}
                        <div className="pt-8 border-t border-navy-50 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-navy-300 uppercase tracking-[0.4em] flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Live Destination Vault
                                </h4>
                                <span className="text-[9px] font-black text-gold-600 bg-gold-50 px-2 py-1 rounded-full">{filteredSubscribers.length} Nodes</span>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto scrollbar-none space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                                {filteredSubscribers.map((sub, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-navy-50/50 rounded-xl border border-transparent hover:border-navy-100 transition-all group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                        <span className="text-[10px] font-bold text-navy-950 truncate flex-1">{sub.email}</span>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ASSET DESIGN HUB */}
                <div className="lg:col-span-8 space-y-8">
                    {!asset ? (
                        <div className="bg-white rounded-[3rem] p-40 border-4 border-dashed border-navy-50 flex flex-col items-center justify-center text-center space-y-12 transition-all min-h-[750px] shadow-sm hover:border-gold-500/30 group">
                            <div className="w-28 h-28 rounded-full bg-navy-50 flex items-center justify-center transform group-hover:scale-110 transition-all duration-700 shadow-inner p-8">
                                <Upload className="w-full h-full text-navy-200 group-hover:text-gold-600" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-5xl font-black text-navy-950 uppercase italic tracking-tighter leading-none">Uplink <span className="text-gold-600">Asset</span></h3>
                                <p className="text-navy-400 font-bold text-xs uppercase tracking-[0.4em] max-w-sm mx-auto opacity-70">Inject a pre-designed Marketing Image or HTML file for direct broadcast.</p>
                            </div>
                            <input 
                                type="file" 
                                onChange={handleAssetUpload}
                                className="hidden" 
                                id="master-uplink"
                                accept="image/*,.html"
                            />
                            <label 
                                htmlFor="master-uplink"
                                className="px-14 py-6 bg-navy-950 text-gold-500 rounded-full font-black text-[11px] uppercase tracking-[0.4em] cursor-pointer shadow-2xl hover:translate-y-[-5px] transition-all active:scale-95"
                            >
                                Select Design Source
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-1000">
                            <div className="flex items-center justify-between bg-white px-8 py-4 rounded-3xl border border-navy-50 shadow-xl">
                                <div className="flex items-center gap-6">
                                    <span className="px-4 py-2 bg-navy-950 text-gold-500 text-[10px] font-black rounded-xl tracking-widest">{assetType.toUpperCase()} FRAGMENT</span>
                                </div>
                                <button 
                                    onClick={() => setAsset(null)}
                                    className="p-3 bg-white text-rose-500 rounded-2xl shadow-xl border border-navy-50 hover:bg-rose-500 hover:text-white transition-all transform active:scale-90"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>

                            <div 
                                className="rounded-[4rem] bg-white border border-navy-50 shadow-[0_60px_100px_rgba(0,0,0,0.1)] overflow-hidden relative min-h-[600px] flex items-center justify-center p-0"
                            >
                                {assetType === 'image' ? (
                                    <img src={asset} className="w-full h-auto object-contain animate-in zoom-in-95 duration-1000" alt="Broadcast Preview" />
                                ) : (
                                    <div className="bg-white w-full h-[600px] overflow-hidden">
                                        <iframe 
                                            srcDoc={asset}
                                            className="w-full h-full border-none"
                                            title="Transmission Matrix Preview"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* TRANSMISSION HUD OVERLAY */}
            {showDeploy && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-navy-950/95 backdrop-blur-3xl animate-in fade-in duration-500">
                    <div className="max-w-md w-full bg-white rounded-[4rem] p-20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] space-y-12 border-4 border-gold-500 relative overflow-hidden text-center group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                        
                        <div className="relative">
                            {status === 'sending' ? (
                                <div className="w-32 h-32 rounded-[3.5rem] border-[10px] border-navy-50 border-t-gold-500 animate-spin mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(217,119,6,0.1)]">
                                    <Globe className="w-14 h-14 text-gold-500" />
                                </div>
                            ) : status === 'success' ? (
                                <div className="w-32 h-32 bg-emerald-500 rounded-[3.5rem] mx-auto flex items-center justify-center shadow-[0_20px_60px_rgba(16,185,129,0.3)] animate-in zoom-in duration-700">
                                    <CheckCircle2 className="w-16 h-16 text-white" />
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-rose-500 rounded-[3.5rem] mx-auto flex items-center justify-center shadow-[0_20px_60px_rgba(244,63,94,0.3)] animate-in zoom-in duration-700">
                                    <AlertCircle className="w-16 h-16 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-navy-950 uppercase italic tracking-tighter">
                                {status === 'sending' ? 'Broadcasting' : status === 'success' ? 'Transmission Complete' : 'Relay Failure'}
                            </h3>
                            <p className="text-navy-400 text-[10px] font-black uppercase tracking-[0.4em] italic leading-relaxed">
                                {status === 'sending' 
                                    ? `Directing Intel to ${filteredSubscribers.length} Nodes across the matrix` 
                                    : status === 'success' 
                                        ? 'All assets successfully synchronized and delivered' 
                                        : 'Critical fault in SMTP relay protocols'}
                            </p>
                        </div>

                        {status === 'sending' && (
                            <div className="h-2 bg-navy-50 rounded-full overflow-hidden shadow-inner w-full">
                                <div className="h-full bg-gold-500 animate-[progress_3s_ease-in-out_infinite]"></div>
                            </div>
                        )}

                        <button 
                            onClick={() => setShowDeploy(false)}
                            className="px-12 py-5 bg-navy-950 text-gold-500 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all active:scale-95 shadow-xl"
                        >
                            {status === 'sending' ? 'Abort Protocol' : 'Dismiss Terminal'}
                        </button>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; transform: translateX(-100%); }
                    50% { width: 80%; transform: translateX(0%); }
                    100% { width: 100%; transform: translateX(100%); }
                }
                .scrollbar-none::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
