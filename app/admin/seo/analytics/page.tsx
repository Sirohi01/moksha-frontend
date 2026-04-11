'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Globe, TrendingUp, Users, MousePointer2, Clock,
  MapPin, Smartphone, Monitor, Tablet, Activity,
  Layers, Search, ChevronLeft, ArrowUpRight, Target,
  Compass, Cpu, Zap, Network, ChevronRight, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGES_PER_PAGE = 5;

export default function SEOAnalyticsIntelligence() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [geoTab, setGeoTab] = useState<'countries' | 'cities'>('countries');
  const [pagesPage, setPagesPage] = useState(1);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  // reset pagination when days change
  useEffect(() => { setPagesPage(1); }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo/analytics/real-time?days=${days}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (e) {
      console.error('Analytics fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const totalDeviceCount = Object.values(stats?.technicalStats?.devices || {}).reduce((a: any, b: any) => a + b, 0) as number;
  const totalOSCount = Object.values(stats?.technicalStats?.os || {}).reduce((a: any, b: any) => a + b, 0) as number;

  const allPages = stats?.popularPages || [];
  const totalPagesCount = allPages.length;
  const totalPagesPages = Math.ceil(totalPagesCount / PAGES_PER_PAGE);
  const pagedPages = allPages.slice((pagesPage - 1) * PAGES_PER_PAGE, pagesPage * PAGES_PER_PAGE);

  if (loading && !stats) return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center gap-4">
      <Zap className="w-10 h-10 text-yellow-500 animate-pulse" />
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Analytics...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/admin/seo'}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all shadow-sm shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SEO Intelligence</p>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900">Site Analytics</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Day filter */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all',
                    days === d ? 'bg-gray-900 text-yellow-400 shadow' : 'text-gray-400 hover:text-gray-700'
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all shadow-sm"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Pageviews', value: stats?.summary?.totalPageviews, icon: MousePointer2, sub: 'Total hits' },
            { label: 'Unique Visitors', value: stats?.summary?.uniqueVisitors, icon: Users, sub: 'Unique IPs', accent: true },
            { label: 'Avg. Duration', value: `${stats?.summary?.avgDuration ?? 0}s`, icon: Clock, sub: 'Time on site' },
            { label: 'Traffic Sources', value: stats?.trafficSources?.length || 0, icon: Network, sub: 'Active channels' },
          ].map((m, i) => (
            <Card key={i} className={cn(
              'p-4 sm:p-5 border-none shadow-sm rounded-2xl relative overflow-hidden',
              m.accent ? 'bg-gray-900 text-white' : 'bg-white'
            )}>
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', m.accent ? 'bg-white/10' : 'bg-gray-50')}>
                <m.icon size={16} className={m.accent ? 'text-yellow-400' : 'text-gray-600'} />
              </div>
              <p className={cn('text-2xl sm:text-3xl font-black tracking-tight', m.accent ? 'text-white' : 'text-gray-900')}>
                {typeof m.value === 'number' ? m.value.toLocaleString() : (m.value || '0')}
              </p>
              <p className={cn('text-[11px] font-bold uppercase tracking-wide mt-0.5', m.accent ? 'text-white/60' : 'text-gray-400')}>{m.label}</p>
              <p className={cn('text-[10px] uppercase tracking-widest', m.accent ? 'text-white/30' : 'text-gray-300')}>{m.sub}</p>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

          {/* Popular Pages - takes 2 cols */}
          <div className="xl:col-span-2">
            <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-2.5">
                  <Layers size={18} className="text-yellow-500" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">Popular Pages</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Top content nodes</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-300 uppercase">{totalPagesCount} pages</span>
              </div>

              <div className="divide-y divide-gray-50">
                {pagedPages.length === 0 && (
                  <div className="py-12 text-center">
                    <Search size={28} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-xs text-gray-300 uppercase tracking-widest">No data yet</p>
                  </div>
                )}
                {pagedPages.map((page: any, i: number) => {
                  const rank = (pagesPage - 1) * PAGES_PER_PAGE + i + 1;
                  const label = page.path === '/' ? 'Home' : page.path.split('/').filter(Boolean).pop() || page.path;
                  return (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group">
                      <span className="text-sm font-black text-gray-200 group-hover:text-yellow-500 transition-colors w-6 shrink-0 text-center">
                        {rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-800 uppercase tracking-tight truncate">{label}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{page.path}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-[13px] font-black text-gray-800">{page.views.toLocaleString()}</p>
                          <p className="text-[9px] text-gray-300 uppercase tracking-widest">Views</p>
                        </div>
                        <div className="text-right hidden md:block">
                          <p className="text-[13px] font-black text-gray-800">{page.uniqueVisitors}</p>
                          <p className="text-[9px] text-gray-300 uppercase tracking-widest">Uniq.</p>
                        </div>
                        <div className="text-right hidden lg:block">
                          <p className="text-[13px] font-black text-gray-800">{page.avgEngagement}s</p>
                          <p className="text-[9px] text-gray-300 uppercase tracking-widest">Avg.</p>
                        </div>
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-gray-900 group-hover:text-yellow-400 group-hover:border-gray-900 transition-all"
                        >
                          <ArrowUpRight size={13} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPagesPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
                  <p className="text-[11px] text-gray-400">
                    Page {pagesPage} of {totalPagesPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPagesPage(p => Math.max(1, p - 1))}
                      disabled={pagesPage === 1}
                      className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    {Array.from({ length: totalPagesPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPagesPage(p)}
                        className={cn(
                          'w-7 h-7 rounded-lg text-[11px] font-bold transition-all',
                          p === pagesPage ? 'bg-gray-900 text-yellow-400' : 'border border-gray-100 text-gray-400 hover:border-gray-300'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPagesPage(p => Math.min(totalPagesPages, p + 1))}
                      disabled={pagesPage === totalPagesPages}
                      className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Traffic Sources */}
            <Card className="bg-gray-900 text-white border-none shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Network size={16} className="text-yellow-400" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">Traffic Sources</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Origin channels</p>
                </div>
              </div>
              <div className="space-y-4">
                {(stats?.trafficSources || []).map((source: any, i: number) => {
                  const total = (stats?.trafficSources || []).reduce((a: any, b: any) => a + b.value, 0);
                  const pct = total > 0 ? Math.round((source.value / total) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
                        <span className="text-white/60 truncate">{source.name}</span>
                        <span className="text-yellow-400 shrink-0 ml-2">{pct}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {(!stats?.trafficSources?.length) && (
                  <p className="text-[11px] text-white/20 uppercase tracking-widest text-center py-4">No data</p>
                )}
              </div>
            </Card>

            {/* Device Profile */}
            <Card className="bg-white border-none shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <Smartphone size={16} className="text-yellow-500" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">Devices</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Platform split</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Desktop', count: stats?.technicalStats?.devices?.desktop, icon: Monitor },
                  { label: 'Mobile', count: stats?.technicalStats?.devices?.mobile, icon: Smartphone },
                  { label: 'Tablet', count: stats?.technicalStats?.devices?.tablet, icon: Tablet },
                ].map((d, i) => {
                  const pct = totalDeviceCount > 0 ? Math.round(((d.count || 0) / totalDeviceCount) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <d.icon size={13} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className="text-gray-700 uppercase">{d.label}</span>
                          <span className="text-gray-400">{pct}%</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-900 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-[12px] font-black text-gray-300 w-8 text-right shrink-0">{d.count || 0}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Geo Intelligence */}
            <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2.5">
                  <Globe size={16} className="text-yellow-500" />
                  <h4 className="text-sm font-black uppercase tracking-tight">Geo Intensity</h4>
                </div>
                <div className="flex bg-gray-50 p-0.5 rounded-lg">
                  {(['countries', 'cities'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setGeoTab(tab)}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all',
                        geoTab === tab ? 'bg-white shadow text-gray-800' : 'text-gray-400'
                      )}
                    >
                      {tab === 'countries' ? 'Country' : 'City'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {(geoTab === 'countries' ? stats?.geoIntensity?.countries : stats?.geoIntensity?.cities)?.slice(0, 6).map((geo: any, i: number) => (
                  <div key={i} className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[11px] font-black text-gray-200 w-4 shrink-0">{i + 1}</span>
                      <span className="text-[12px] font-bold text-gray-700 uppercase tracking-tight truncate">{geo.name || 'Unknown'}</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 shrink-0 ml-2">{geo.count}</span>
                  </div>
                ))}
                {(!stats?.geoIntensity?.[geoTab]?.length) && (
                  <div className="py-8 text-center">
                    <MapPin size={24} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest">No geo data</p>
                  </div>
                )}
              </div>
            </Card>

          </div>
        </div>

        {/* OS Stats - full width bottom row */}
        <Card className="bg-white border-none shadow-sm rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Cpu size={16} className="text-yellow-500" />
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">OS Distribution</h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Operating systems</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(stats?.technicalStats?.os || {}).map(([os, val]: [string, any], i) => {
              const pct = totalOSCount > 0 ? Math.round((val / totalOSCount) * 100) : 0;
              return (
                <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-[12px] font-black text-gray-800 uppercase mb-1">{os}</p>
                  <p className="text-xl font-black text-gray-900">{val}</p>
                  <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">{pct}%</p>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
}
