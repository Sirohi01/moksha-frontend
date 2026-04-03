'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
    Globe, 
    Code2, 
    Save, 
    RefreshCcw, 
    History, 
    Upload, 
    FileText, 
    Trash2, 
    AlertCircle, 
    ChevronRight,
    Terminal,
    HardDrive,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdvancedSEOSettings() {
    const [settings, setSettings] = useState<any>({
        headerScripts: '',
        footerScripts: '',
        robotsTxt: 'User-agent: *\nAllow: /',
        sitemapUrl: '/sitemap.xml'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo/settings`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await response.json();
            if (data.success && data.data) {
                setSettings(data.data);
            }
        } catch (error) {
            console.error("Fetch settings error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(settings)
            });
            const data = await response.json();
            if (data.success) {
                alert("Global SEO Infrastructure Synchronized.");
            }
        } catch (error) {
            alert("Sync Failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center p-12 animate-pulse font-black text-navy-950 uppercase tracking-widest italic">Decrypting Global Protocols...</div>;

    return (
        <div className="min-h-screen bg-stone-50 p-6 md:p-12 font-sans select-none text-navy-900">
            <div className="max-w-[1400px] mx-auto space-y-16">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-navy-950 flex items-center justify-center shadow-xl shadow-navy-950/20">
                                <Code2 className="text-gold-500 w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Advanced SEO Control</h1>
                                <p className="text-navy-950/40 font-black text-[10px] uppercase tracking-[0.4em] mt-3 italic">Global Scripts & Structural Protocol Management</p>
                            </div>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className={cn(
                            "h-16 px-12 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center gap-4 transition-all",
                            saving ? "bg-stone-200 text-stone-400" : "bg-navy-950 text-gold-500 hover:bg-gold-500 hover:text-navy-950 shadow-2xl"
                        )}
                    >
                        {saving ? <RefreshCcw className="animate-spin" /> : <Save />}
                        {saving ? 'SYNCING...' : 'SAVE GLOBAL CORE'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    
                    {/* Left Column: Script Injection */}
                    <div className="xl:col-span-8 space-y-12">
                        <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-white space-y-12">
                            <div className="flex items-center gap-4">
                                <Terminal className="text-navy-950" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Global Script Deployment</h3>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Header Scripts (Inside &lt;head&gt;)</label>
                                        <span className="text-[9px] font-bold text-stone-300 uppercase italic">GTM, GA4, FB Pixel</span>
                                    </div>
                                    <textarea 
                                        rows={8}
                                        value={settings.headerScripts}
                                        onChange={(e) => setSettings({ ...settings, headerScripts: e.target.value })}
                                        placeholder="<!-- Paste <script> tags here -->"
                                        className="w-full bg-navy-950 text-gold-500 font-mono text-[11px] rounded-[3rem] p-12 outline-none resize-none shadow-inner leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-4">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Footer Scripts (Before &lt;/body&gt;)</label>
                                        <span className="text-[9px] font-bold text-stone-300 uppercase italic">Zendesk, Chat Widgets, Heatmaps</span>
                                    </div>
                                    <textarea 
                                        rows={8}
                                        value={settings.footerScripts}
                                        onChange={(e) => setSettings({ ...settings, footerScripts: e.target.value })}
                                        placeholder="<!-- Paste legacy scripts here -->"
                                        className="w-full bg-navy-950 text-gold-500 font-mono text-[11px] rounded-[3rem] p-12 outline-none resize-none shadow-inner leading-relaxed border-t border-white/5"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Site Integrity Files */}
                    <div className="xl:col-span-4 space-y-12">
                        <Card className="p-10 border-none shadow-2xl rounded-[3.5rem] bg-white space-y-10">
                            <div className="flex items-center gap-4 text-navy-950">
                                <HardDrive size={22} />
                                <h4 className="text-xl font-black uppercase tracking-tighter italic">File System Protocols</h4>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-stone-50 border-2 border-dashed border-stone-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 group hover:border-gold-500 transition-all cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-stone-300 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all shadow-sm">
                                        <Upload size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Upload Static Resource</p>
                                        <p className="text-[9px] font-bold text-stone-300 mt-1 uppercase italic italic">Sitemap, Robots, HTML Verification</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Robots.txt Payload</label>
                                    <textarea 
                                        rows={6}
                                        value={settings.robotsTxt}
                                        onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                                        className="w-full bg-stone-50 border border-stone-100 rounded-[2rem] p-8 font-mono text-[10px] font-bold text-navy-950 outline-none focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-stone-50 space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-navy-950">Active Sitemap</p>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase italic">ONLINE</p>
                                </div>
                                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl truncate">
                                    <FileText size={14} className="text-stone-300" />
                                    <span className="text-[10px] font-bold text-navy-950 underline">{settings.sitemapUrl}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Notice Card */}
                        <div className="p-10 bg-gold-500 rounded-[3rem] space-y-5 border border-gold-400/50 shadow-[0_30px_60px_rgba(245,158,11,0.15)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-1000">
                                <ShieldCheck size={48} />
                            </div>
                            <div className="flex items-center gap-3">
                                <AlertCircle size={18} className="text-navy-950" />
                                <h5 className="text-[11px] font-black uppercase tracking-widest italic text-navy-950">Surgical Warning</h5>
                            </div>
                            <p className="text-[10px] font-bold text-navy-950/70 uppercase italic leading-loose">Global scripts affect every page across the entire architecture. Double-check script termination to prevent rendering failures in production.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
