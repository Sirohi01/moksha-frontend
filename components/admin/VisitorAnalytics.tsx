'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analyticsAPI } from '@/lib/api';
import {
  Users,
  Activity,
  MousePointer2,
  Eye,
  Clock,
  ChevronRight,
  CircleDot,
  ArrowUpRight,
  Monitor,
  Calendar,
  Search,
  Hash,
  Layout,
  Globe,
  Zap
} from 'lucide-react';

const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-IN', options || {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
};

interface VisitorActivity {
  _id: string;
  sessionId: string;
  ipAddress: string;
  path: string;
  duration: number;
  startTime: string;
  events: Array<{
    type: string;
    targetText: string;
    timestamp: string;
  }>;
  location: {
    city: string;
    country: string;
  };
}

interface AnalyticsData {
  stats: {
    totalViews: number;
    uniqueIPs: number;
    uniqueSessions: number;
  };
  recentActivities: VisitorActivity[];
  popularPages: Array<{ _id: string; count: number }>;
  topButtons: Array<{ _id: string; count: number }>;
  totalVisitors: number;
  commonPaths: Array<{ _id: string; count: number }>;
}

export default function VisitorAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeRange, customStart, customEnd]);

  const fetchData = async () => {
    try {
      const response = await analyticsAPI.getVisitorStats(timeRange, customStart, customEnd);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch visitor analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCustomFilter = () => {
    if (customStart && customEnd) {
      setTimeRange('custom');
      fetchData();
    }
  };

  const handleViewDetails = (ip: string) => {
    router.push(`/admin/visitor-analytics/${ip}`);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-6 h-6 text-gold-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Dashboard Control Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-8 p-8 bg-white dark:bg-navy-950 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-navy-900/10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-600 border border-gold-500/20 shadow-inner">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-navy-950 dark:text-white tracking-tight leading-none mb-1.5 uppercase italic">Live Intel Feed</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] opacity-80">Stream Reconstruction · {timeRange === 'custom' ? 'Custom Filter Active' : `Last ${timeRange}`}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full xl:w-auto">
          {/* Quick Presets */}
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setCustomStart('');
                  setCustomEnd('');
                }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${timeRange === range
                    ? 'bg-navy-950 dark:bg-gold-500 text-white dark:text-navy-950 shadow-xl'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="h-10 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

          {/* Custom Picker */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-1 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-600 transition-transform group-focus-within:scale-110" />
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-tight text-navy-950 dark:text-navy-100 pl-10 pr-4 py-2.5 focus:outline-none w-36"
                />
              </div>
              <div className="w-2 h-0.5 bg-gray-300 dark:bg-white/20"></div>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-600 transition-transform group-focus-within:scale-110" />
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-tight text-navy-950 dark:text-navy-100 pl-10 pr-4 py-2.5 focus:outline-none w-36"
                />
              </div>
            </div>

            <button
              onClick={handleApplyCustomFilter}
              disabled={!customStart || !customEnd}
              className="px-6 py-3.5 bg-gold-600 hover:bg-gold-500 disabled:bg-gray-200 dark:disabled:bg-white/5 disabled:text-gray-400 text-navy-950 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-gold-900/10 active:scale-95 flex items-center gap-3 group"
            >
              <span>Filter Intel</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>



      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Page Views', value: data.stats.totalViews, icon: Eye, color: 'blue', detail: 'Gross site traffic' },
          { label: 'Unique Explorers', value: data.stats.uniqueIPs, icon: Users, color: 'emerald', detail: 'Distinct IP footprints' },
          { label: 'Active Sessions', value: data.stats.uniqueSessions, icon: Activity, color: 'gold', detail: 'Live engagement flows' },
        ].map((stat, i) => (
          <div key={i} className="group relative bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 hover:border-gold-500/50 transition-all duration-500 overflow-hidden text-navy-950 dark:text-white">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color === 'gold' ? 'yellow-50' : stat.color + '-50'} dark:bg-${stat.color === 'gold' ? 'yellow-900/10' : stat.color + '-900/10'} rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative">
              <div className={`w-14 h-14 bg-${stat.color === 'gold' ? 'yellow-50' : stat.color + '-50'} dark:bg-${stat.color === 'gold' ? 'yellow-900/40' : stat.color + '-900/40'} rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-${stat.color === 'gold' ? 'yellow-100' : stat.color + '-100'} dark:border-${stat.color === 'gold' ? 'yellow-800' : stat.color + '-800'}/30`}>
                <stat.icon className={`w-7 h-7 text-${stat.color === 'gold' ? 'yellow-600' : stat.color + '-600'}`} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-5xl font-black text-navy-950 dark:text-white font-mono tracking-tighter">{stat.value.toLocaleString()}</p>
                <div className={`w-2 h-2 rounded-full bg-${stat.color === 'gold' ? 'yellow-500' : stat.color + '-500'} animate-pulse`}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">{stat.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Popular Pages Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-3xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
              <Layout className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-widest">Top Target Vectors</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Most engaged destinations</p>
            </div>
          </div>
          <div className="space-y-4">
            {data.popularPages?.map((page, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group">
                <span className="text-xs font-black text-gray-900 dark:text-navy-100 italic truncate max-w-[150px]">{page._id}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden hidden md:block">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min((page.count / (data.popularPages?.[0]?.count || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="font-black text-blue-600 dark:text-blue-400 px-5 py-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl text-[10px] whitespace-nowrap border border-blue-100 dark:border-blue-800/30">
                    {page.count} VISITS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction Hotspots Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-3xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold-50 dark:bg-gold-900/20 rounded-2xl flex items-center justify-center">
              <MousePointer2 className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-widest">Interaction Hotspots</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Conversion triggers</p>
            </div>
          </div>
          <div className="space-y-4">
            {data.topButtons?.map((btn, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-gold-600 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-gray-900 dark:text-navy-100 truncate italic" title={btn._id}>{btn._id || 'Primary CTA'}</span>
                </div>
                <span className="font-black text-gold-700 dark:text-gold-400 px-5 py-2 bg-gold-100/50 dark:bg-gold-900/30 rounded-2xl text-[10px] whitespace-nowrap border border-gold-100 dark:border-gold-800/30">
                  {btn.count} INTERACTS
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Stream Table Section */}
      <div className="bg-navy-950 rounded-[3.5rem] shadow-3xl shadow-navy-900/20 overflow-hidden border border-navy-900/20">
        <div className="p-6 sm:p-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-black">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-black text-[10px] uppercase tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              System: Live Stream
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tighter italic uppercase">CHRONOLOGICAL FEED</h3>
            <p className="text-gray-400 font-medium text-[10px] sm:text-sm">Sequential reconstruction of visitor events</p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[8px] sm:text-[10px] text-navy-300 font-black uppercase tracking-widest">Feed Status</span>
              <span className="text-emerald-400 font-black text-xs sm:text-sm flex items-center gap-2">
                <Hash className="w-3 h-3" />
                BUFFERING ACTIVE
              </span>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/10 hidden md:block"></div>
            <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 sm:px-6 py-2 sm:py-4 rounded-[1.5rem] sm:rounded-3xl border border-white/20">
              <Calendar className="w-4 h-4 sm:w-5 h-5 text-gold-400" />
              <span className="text-white font-bold text-[10px] sm:text-xs text-nowrap">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar bg-white">
          <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-[1000px]">
            <thead className="text-gold-500 uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em] h-16 sm:h-20 border-b border-navy-50 bg-navy-950">
              <tr>
                <th className="px-6 sm:px-12">Capture Time</th>
                <th className="px-6 sm:px-12">Explorer IP</th>
                <th className="px-6 sm:px-12">Entry Page</th>
                <th className="px-6 sm:px-12 text-center">Engagement</th>
                <th className="px-6 sm:px-12">Event Capture</th>
                <th className="px-6 sm:px-12 text-right pr-10 sm:pr-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {data.recentActivities.map((activity) => (
                <tr key={activity._id} className="hover:bg-navy-50/50 transition-all group h-28 border-b border-navy-50 bg-white">
                  <td className="px-6 sm:px-12 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-navy-700" />
                      <span className="text-sm font-black text-navy-950">
                        {formatDate(activity.startTime)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 sm:px-12 whitespace-nowrap">
                    <div className="px-4 sm:px-5 py-2 sm:py-3 bg-navy-50/50 border border-navy-50 rounded-2xl">
                      <span className="font-mono text-[10px] sm:text-[11px] font-black text-gold-600">
                        {activity.ipAddress}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 sm:px-12 text-sm italic">
                    <div className="max-w-[150px] sm:max-w-[180px]">
                      <p className="truncate font-black text-navy-950 bg-navy-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] border border-navy-50 shadow-inner" title={activity.path}>
                        {activity.path}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 sm:px-12 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gold-600/10 text-gold-600 rounded-full border border-gold-600/20 text-xs font-black italic">
                      <Activity className="w-3 h-3" />
                      {activity.duration}s
                    </div>
                  </td>
                  <td className="px-6 sm:px-12">
                    <div className="flex -space-x-3 items-center">
                      {activity.events.slice(0, 3).map((e, i) => (
                        <div key={i} className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[2px] sm:border-[3px] border-white flex items-center justify-center shadow-lg transition-all group-hover:-translate-y-1 relative z-${30 - i} ${e.type === 'click' ? 'bg-navy-950 text-gold-500' : 'bg-gold-600 text-navy-950'
                          }`} title={e.targetText}>
                          {e.type === 'click' ? <MousePointer2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </div>
                      ))}
                      {activity.events.length > 3 && (
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[2px] sm:border-[3px] border-white bg-navy-100 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-navy-700 relative z-0">
                          +{activity.events.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 sm:px-12 text-right pr-10 sm:pr-20">
                    <button
                      onClick={() => handleViewDetails(activity.ipAddress)}
                      className="inline-flex items-center gap-2 sm:gap-4 px-5 sm:px-8 py-3 sm:py-4 bg-navy-950 hover:bg-gold-600 text-gold-500 hover:text-navy-950 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 group-active:scale-95"
                    >
                      <span className="hidden xs:inline">PROFILE</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
