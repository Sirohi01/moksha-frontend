'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
    Globe, 
    TrendingUp, 
    Users, 
    MousePointer2, 
    Clock, 
    MapPin, 
    Smartphone, 
    Monitor, 
    Tablet,
    RefreshCcw,
    ChevronLeft,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Activity,
    Layers,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SEOAnalyticsIntelligence() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
        fetchAnalytics();
    }, [days]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo/analytics/real-time?days=${days}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Analytics fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !stats) return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-12 space-y-6">
            <Activity className="w-12 h-12 text-navy-950 animate-pulse" />
            <p className="font-black text-navy-950 uppercase tracking-[0.5em] italic animate-pulse">Decrypting Telemetry Stream...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 p-6 md:p-12 font-sans select-none text-navy-950 overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto space-y-16">
                
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => window.location.href = '/admin/seo'}
                            className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-100 flex items-center justify-center text-navy-950 hover:bg-navy-950 hover:text-white transition-all shadow-sm"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="text-gold-500 w-5 h-5" />
                                <span className="text-[10px] font-black text-navy-950/40 uppercase tracking-[0.4em] italic">Intelligence Hub</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Traffic Intelligence</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border-2 border-stone-100 shadow-sm">
                        {[7, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    days === d ? "bg-navy-950 text-gold-500 shadow-xl" : "text-stone-300 hover:text-navy-950"
                                )}
                            >
                                {d} DAYS
                            </button>
                        ))}
                    </div>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Total Pageviews', value: stats?.summary?.totalPageviews, icon: MousePointer2, color: 'text-navy-950' },
                        { label: 'Unique Visitors', value: stats?.summary?.uniqueVisitors, icon: Users, color: 'text-gold-500' },
                        { label: 'Avg. Engagement', value: `${stats?.summary?.avgDuration}s`, icon: Clock, color: 'text-navy-950' },
                        { label: 'Global Reach', value: stats?.geoStats?.length || 0, icon: Globe, color: 'text-navy-950' }
                    ].map((m, i) => (
                        <Card key={i} className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-1000">
                                <m.icon size={80} />
                            </div>
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-stone-50", m.color)}>
                                    <m.icon size={20} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter mb-1">{m.value?.toLocaleString() || '0'}</h3>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">{m.label}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    
                    {/* Popular Pages High-Performance Table */}
                    <div className="xl:col-span-8">
                        <Card className="p-10 border-none shadow-2xl rounded-[3.5rem] bg-white h-full">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <Layers className="text-navy-950" />
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Top Landing Protocols</h3>
                                </div>
                                <Search className="text-stone-200" size={20} />
                            </div>

                            <div className="space-y-4">
                                {stats?.popularPages?.map((page: any, i: number) => (
                                    <div key={i} className="group p-6 rounded-[2rem] hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <span className="text-2xl font-black text-stone-100 group-hover:text-gold-500 transition-colors">0{i+1}</span>
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-tight text-navy-950 mb-1">{page.path === '/' ? 'HOME PAGE' : page.path.toUpperCase()}</p>
                                                <p className="text-[9px] font-bold text-stone-300 italic uppercase">{page.path}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-12">
                                            <div className="text-right">
                                                <p className="text-[12px] font-black text-navy-950">{page.views.toLocaleString()}</p>
                                                <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Views</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[12px] font-black text-navy-950">{page.uniqueVisitors.toLocaleString()}</p>
                                                <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Visitors</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border-2 border-stone-100 flex items-center justify-center text-stone-200 group-hover:bg-navy-950 group-hover:text-white group-hover:border-navy-950 transition-all">
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Geographic & Device Insights */}
                    <div className="xl:col-span-4 space-y-12">
                        
                        {/* Device Deployment Card */}
                        <Card className="p-10 border-none shadow-2xl rounded-[3.5rem] bg-navy-950 text-white relative overflow-hidden">
                             <div className="absolute -bottom-10 -right-10 opacity-5">
                                 <Monitor size={200} />
                             </div>
                             <h4 className="text-xl font-black uppercase tracking-tighter italic mb-10 flex items-center gap-3">
                                <TrendingUp className="text-gold-500" />
                                Device Profile
                             </h4>

                             <div className="space-y-8 relative z-10">
                                {[
                                    { label: 'Desktop', count: stats?.deviceStats?.desktop, icon: Monitor, color: 'bg-gold-500' },
                                    { label: 'Mobile', count: stats?.deviceStats?.mobile, icon: Smartphone, color: 'bg-white' },
                                    { label: 'Tablet', count: stats?.deviceStats?.tablet, icon: Tablet, color: 'bg-white/20' }
                                ].map((d, i) => {
                                    const total = Object.values(stats?.deviceStats || {}).reduce((a: any, b: any) => a + b, 0) as number;
                                    const percentage = total > 0 ? Math.round((d.count / total) * 100) : 0;
                                    
                                    return (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <d.icon size={14} className="text-gold-500" />
                                                    <span>{d.label}</span>
                                                </div>
                                                <span className="text-white/40">{percentage}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className={cn("h-full rounded-full transition-all duration-1000", d.color)} style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                             </div>
                        </Card>

                        {/* Geographic Intelligence Card */}
                        <Card className="p-10 border-none shadow-2xl rounded-[3.5rem] bg-white space-y-8">
                             <h4 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                                <MapPin className="text-gold-500" />
                                Geo Intelligence
                             </h4>
                             
                             <div className="space-y-6">
                                {stats?.geoStats?.map((geo: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-[10px] font-bold text-navy-950">
                                                {i+1}
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-tight">{geo.country || 'Unknown'}</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-stone-300 italic">{geo.count} SESSIONS</span>
                                    </div>
                                ))}
                                {(!stats?.geoStats || stats?.geoStats.length === 0) && (
                                    <p className="text-[10px] font-bold text-stone-300 text-center uppercase py-8 italic tracking-widest">Scanning Global Nodes...</p>
                                )}
                             </div>
                        </Card>

                    </div>

                </div>

            </div>

             {/* Background Text Decorations */}
             <div className="fixed -bottom-20 -left-20 text-[15rem] font-black text-navy-950/[0.02] pointer-events-none select-none italic tracking-tighter">
                TELEMETRY
            </div>
        </div>
    );
}
