'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
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
    Activity,
    Layers,
    Search,
    ChevronLeft,
    ArrowUpRight,
    Target,
    Compass,
    Cpu,
    Zap,
    Network
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SEOAnalyticsIntelligence() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [geoTab, setGeoTab] = useState<'countries' | 'cities'>('countries');

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
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-12 space-y-6">
            <Zap className="w-16 h-16 text-gold-500 animate-pulse" />
            <p className="font-black text-white uppercase tracking-[0.8em] italic animate-pulse text-xs">Synchronizing Telemetry Frequency...</p>
        </div>
    );

    const totalDeviceCount = Object.values(stats?.technicalStats?.devices || {}).reduce((a: any, b: any) => a + b, 0) as number;
    const totalOSCount = Object.values(stats?.technicalStats?.os || {}).reduce((a: any, b: any) => a + b, 0) as number;

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 md:p-12 font-sans select-none text-navy-950 overflow-x-hidden">
            <div className="max-w-[1700px] mx-auto space-y-16">
                
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => window.location.href = '/admin/seo'}
                            className="w-16 h-16 rounded-[2rem] bg-white border border-stone-200 flex items-center justify-center text-navy-950 hover:bg-navy-950 hover:text-white transition-all shadow-xl hover:shadow-gold-500/10"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="text-gold-600 w-5 h-5 animate-pulse" />
                                <span className="text-[10px] font-black text-navy-950/40 uppercase tracking-[0.5em] italic">Intelligence Command Hub</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-navy-950">Site Telemetry</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2.5 rounded-[3rem] border border-stone-100 shadow-2xl">
                        {[7, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={cn(
                                    "px-10 py-4 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                                    days === d ? "bg-navy-950 text-gold-500 shadow-2xl scale-105" : "text-stone-300 hover:text-navy-950"
                                )}
                            >
                                {d} DAYS
                            </button>
                        ))}
                    </div>
                </div>

                {/* Primary Metrics Cluster */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        { label: 'Total Pageviews', value: stats?.summary?.totalPageviews, icon: MousePointer2, color: 'text-navy-950', sub: 'Gross Traffic' },
                        { label: 'Unique Visitors', value: stats?.summary?.uniqueVisitors, icon: Users, color: 'text-gold-600', sub: 'Unique Explorers' },
                        { label: 'Avg. Engagement', value: `${stats?.summary?.avgDuration}s`, icon: Activity, color: 'text-navy-950', sub: 'Time On Node' },
                        { label: 'Traffic DNA', value: stats?.trafficSources?.length || 0, icon: Network, color: 'text-navy-950', sub: 'Active Channels' }
                    ].map((m, i) => (
                        <Card key={i} className="p-10 border-none shadow-2xl rounded-[4rem] bg-white relative overflow-hidden group hover:-translate-y-3 transition-all duration-700">
                             <div className="absolute -bottom-10 -right-10 p-6 opacity-5 group-hover:scale-150 group-hover:rotate-12 transition-all duration-[2s]">
                                <m.icon size={180} />
                            </div>
                            <div className="flex justify-between items-start mb-10">
                                <div className={cn("w-14 h-14 rounded-[1.5rem] flex items-center justify-center bg-stone-50 border border-stone-100 shadow-inner", m.color)}>
                                    <m.icon size={22} />
                                </div>
                                <ArrowUpRight size={16} className="text-stone-200 group-hover:text-gold-500 transition-colors" />
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter mb-2 italic">{m.value?.toLocaleString() || '0'}</h3>
                            <div className="flex flex-col">
                                <p className="text-[12px] font-black text-navy-950 uppercase tracking-tight italic">{m.label}</p>
                                <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">{m.sub}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    
                    {/* Landing Protocol Intelligence */}
                    <div className="xl:col-span-8 space-y-12">
                        <Card className="p-12 border-none shadow-2xl rounded-[4.5rem] bg-white">
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex items-center gap-5">
                                    <Layers className="text-gold-600 w-8 h-8" />
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">Landing Protocols</h3>
                                        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] mt-1 italic">High-Engagement Content Nodes</p>
                                    </div>
                                </div>
                                <Search className="text-stone-200" size={24} />
                            </div>

                            <div className="space-y-6">
                                {stats?.popularPages?.map((page: any, i: number) => (
                                    <div key={i} className="group p-8 rounded-[3rem] hover:bg-stone-50/50 transition-all border border-transparent hover:border-stone-100 flex items-center justify-between">
                                        <div className="flex items-center gap-8">
                                            <span className="text-3xl font-black text-stone-100 group-hover:text-gold-600 transition-all duration-500 italic">0{i+1}</span>
                                            <div>
                                                <p className="text-[14px] font-black uppercase tracking-tight text-navy-950 mb-1 group-hover:translate-x-1 transition-transform">{page.path === '/' ? 'CORE COMMAND (HOME)' : page.path.split('/').pop().toUpperCase()}</p>
                                                <p className="text-[10px] font-bold text-stone-300 italic uppercase font-mono tracking-tight">{page.path}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-16">
                                            <div className="text-right">
                                                <p className="text-[13px] font-black text-navy-950 italic">{page.views.toLocaleString()}</p>
                                                <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic">Hits</p>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[13px] font-black text-navy-950 italic">{page.avgEngagement}s</p>
                                                <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic">Avg Eng.</p>
                                            </div>
                                            <a 
                                                href={page.path} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 rounded-[1.5rem] border export border-stone-200 flex items-center justify-center text-stone-300 group-hover:bg-navy-950 group-hover:text-gold-500 group-hover:border-navy-950 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-500 cursor-pointer"
                                            >
                                                <ArrowUpRight size={20} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Traffic DNA Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-navy-950 text-white overflow-hidden relative">
                                <div className="absolute -top-10 -right-10 opacity-10">
                                    <Compass size={180} />
                                </div>
                                <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-12 flex items-center gap-4">
                                   <Network className="text-gold-500" />
                                   Traffic Sources
                                </h4>
                                <div className="space-y-8 relative z-10">
                                    {stats?.trafficSources?.map((source: any, i: number) => {
                                        const total = stats.trafficSources.reduce((a: any, b: any) => a + b.value, 0);
                                        const pct = total > 0 ? Math.round((source.value / total) * 100) : 0;
                                        return (
                                            <div key={i} className="space-y-3">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <span className="text-white/60">{source.name}</span>
                                                    <span className="text-gold-500">{pct}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gold-600 rounded-full transition-all duration-[1.5s]" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                             </Card>

                             <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-white space-y-12">
                                <div className="flex items-center gap-4">
                                    <Cpu className="text-gold-600" />
                                    <div>
                                        <h4 className="text-2xl font-black uppercase tracking-tighter italic">Process Tech</h4>
                                        <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">OS Intelligence</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    {Object.entries(stats?.technicalStats?.os || {}).filter(([_, val]) => (val as number) > 0).map(([os, val]: [string, any], i: number) => (
                                        <div key={i} className="p-6 rounded-[2rem] bg-stone-50/50 border border-stone-100">
                                            <p className="text-[14px] font-black text-navy-950 uppercase italic mb-1">{os}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-stone-400">{val} HITS</span>
                                                <div className="flex-1 h-1 bg-stone-200/50 rounded-full">
                                                    <div className="h-full bg-navy-950 rounded-full" style={{ width: `${(val / totalOSCount) * 100}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </Card>
                        </div>
                    </div>

                    {/* Operational Insights Column */}
                    <div className="xl:col-span-4 space-y-12">
                        
                        {/* Technical Profile */}
                        <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-white relative overflow-hidden group">
                             <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-12 flex items-center gap-4">
                                <Smartphone className="text-gold-600" />
                                Device Profile
                             </h4>

                             <div className="space-y-10 relative z-10">
                                {[
                                    { label: 'Desktop', count: stats?.technicalStats?.devices?.desktop, icon: Monitor, color: 'bg-navy-950' },
                                    { label: 'Mobile', count: stats?.technicalStats?.devices?.mobile, icon: Smartphone, color: 'bg-gold-500' },
                                    { label: 'Tablet', count: stats?.technicalStats?.devices?.tablet, icon: Tablet, color: 'bg-stone-200' }
                                ].map((d, i) => {
                                    const percentage = totalDeviceCount > 0 ? Math.round((d.count / totalDeviceCount) * 100) : 0;
                                    return (
                                        <div key={i} className="flex items-center justify-between group/dev">
                                            <div className="flex items-center gap-5">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", d.color, d.label === 'Desktop' ? 'text-white' : 'text-navy-950')}>
                                                    <d.icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-black text-navy-950 uppercase tracking-tight">{d.label}</p>
                                                    <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">{percentage}% DISTRO</p>
                                                </div>
                                            </div>
                                            <span className="text-2xl font-black italic text-stone-100 group-hover/dev:text-navy-950 transition-colors">{d.count}</span>
                                        </div>
                                    );
                                })}
                             </div>
                        </Card>

                        {/* Geographic Intelligence Hub */}
                        <Card className="p-12 border-none shadow-2xl rounded-[4.5rem] bg-white space-y-12">
                             <div className="flex items-center justify-between">
                                <h4 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                                   <Globe className="text-gold-600" />
                                   Geo Intensity
                                </h4>
                                <div className="flex bg-stone-50 p-1.5 rounded-2xl">
                                    <button 
                                        onClick={() => setGeoTab('countries')}
                                        className={cn("px-4 py-2 rounded-xl text-[9px] font-black transition-all", geoTab === 'countries' ? "bg-white shadow text-navy-950" : "text-stone-300")}
                                    >
                                        COUNTR
                                    </button>
                                    <button 
                                        onClick={() => setGeoTab('cities')}
                                        className={cn("px-4 py-2 rounded-xl text-[9px] font-black transition-all", geoTab === 'cities' ? "bg-white shadow text-navy-950" : "text-stone-300")}
                                    >
                                        CITY
                                    </button>
                                </div>
                             </div>
                             
                             <div className="space-y-6">
                                {(geoTab === 'countries' ? stats?.geoIntensity?.countries : stats?.geoIntensity?.cities)?.map((geo: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between group/geo">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-stone-50 group-hover/geo:bg-navy-950 group-hover/geo:text-gold-500 transition-all flex items-center justify-center text-[11px] font-black text-navy-950 italic shadow-inner">
                                                {i+1}
                                            </div>
                                            <span className="text-[12px] font-black uppercase tracking-tight text-navy-900">{geo.name || 'Unknown'}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-stone-300 italic uppercase">{geo.count} SESSIONS</span>
                                    </div>
                                ))}
                                {(!stats?.geoIntensity?.[geoTab] || stats?.geoIntensity?.[geoTab].length === 0) && (
                                    <div className="text-center py-16 space-y-4">
                                        <MapPin className="mx-auto text-stone-100" size={40} />
                                        <p className="text-[10px] font-bold text-stone-200 text-center uppercase italic tracking-[0.3em]">Mapping Nodes...</p>
                                    </div>
                                )}
                             </div>
                        </Card>

                    </div>

                </div>

            </div>

             {/* Dynamic Background Overlays */}
             <div className="fixed -bottom-40 -left-40 text-[20rem] font-black text-navy-950/[0.015] pointer-events-none select-none italic tracking-tighter uppercase">
                Protocol
            </div>
        </div>
    );
}
