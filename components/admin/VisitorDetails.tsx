'use client';

import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  MousePointer2,
  Eye,
  Activity,
  Cpu,
  Compass,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  History,
  Navigation,
  ExternalLink,
  Smartphone,
  Globe,
  Monitor,
  Zap
} from 'lucide-react';

const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-IN', options || {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
};

const formatFullDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

interface VisitorActivity {
  _id: string;
  sessionId: string;
  ipAddress: string;
  path: string;
  duration: number;
  startTime: string;
  referer?: string;
  events: Array<{
    type: string;
    targetText: string;
    targetId: string;
    timestamp: string;
    pageUrl: string;
  }>;
  location: {
    city: string;
    region: string;
    country: string;
  };
  userAgent: string;
}

export default function VisitorDetails({ ip }: { ip: string }) {
  const [activities, setActivities] = useState<VisitorActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [ip]);

  const fetchData = async () => {
    try {
      const response = await analyticsAPI.getVisitorDetailsByIP(ip);
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to fetch visitor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceType = (ua: string) => {
    if (/mobile/i.test(ua)) return { icon: Smartphone, label: 'Mobile' };
    if (/tablet/i.test(ua)) return { icon: Smartphone, label: 'Tablet' };
    return { icon: Monitor, label: 'Desktop' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
          <Activity className="absolute inset-0 m-auto w-6 h-6 text-gold-500 animate-pulse" />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0B1120] p-12 rounded-[2.5rem] text-center shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-white/10 rotate-12">
          <Compass className="w-8 h-8 text-gray-300 dark:text-gray-600 animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-black text-navy-950 dark:text-white mb-2">Data Missing</h2>
        <p className="text-gray-500 dark:text-navy-700 max-w-sm mx-auto mb-8 text-sm">No activity logs found for this IP.</p>
        <Link
          href="/admin/visitor-analytics"
          className="bg-navy-950 dark:bg-gold-500 text-white dark:text-navy-950 px-8 py-3 rounded-xl font-black tracking-widest text-[10px] uppercase transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>
    );
  }

  const latestSession = activities[0];
  const device = getDeviceType(latestSession.userAgent);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Navigation Command Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/visitor-analytics"
          className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#0F172A] text-navy-950 dark:text-navy-100 rounded-xl shadow-lg border border-gray-100 dark:border-white/5 hover:border-gold-500/50 transition-all font-black text-[9px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-gold-600" />
          <span>Operations Terminal</span>
        </Link>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          Live Surveillance
        </div>
      </div>

      {/* Visitor Dashboard Header - Full Width Top */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
            {/* Identity Center */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left min-w-[240px]">
              <div className="w-20 h-20 bg-gradient-to-tr from-navy-950 to-navy-900 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white dark:border-navy-900 group-hover:scale-110 mb-5">
                <ShieldCheck className="w-10 h-10 text-gold-500" />
              </div>
              <span className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em] mb-1">Target Identity</span>
              <h3 className="text-3xl font-black text-navy-950 dark:text-white font-mono tracking-tighter mb-2 italic">{ip}</h3>
              <div className="flex items-center gap-2 text-[11px] font-bold text-navy-700 italic">
                <Globe className="w-4 h-4" />
                <span>
                  {latestSession.location.city !== 'Unknown'
                    ? `${latestSession.location.city}, ${latestSession.location.country}`
                    : 'System Origin Encrypted'}
                </span>
              </div>
            </div>

            {/* Performance Matrix */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-gold-500/20 transition-all">
                <div className="flex items-center gap-2 text-gold-600 font-black text-[9px] uppercase tracking-widest mb-2 opacity-50">
                  <History className="w-3 h-3" />
                  Total Sessions
                </div>
                <p className="text-3xl font-black text-navy-950 dark:text-white italic">{activities.length}</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-gold-500/20 transition-all">
                <div className="flex items-center gap-2 text-gold-600 font-black text-[9px] uppercase tracking-widest mb-2 opacity-50">
                  <Activity className="w-3 h-3" />
                  Avg Stay Time
                </div>
                <p className="text-3xl font-black text-navy-950 dark:text-white italic">
                  {Math.round(activities.reduce((acc, curr) => acc + curr.duration, 0) / activities.length)}<span className="text-sm font-bold ml-1">S</span>
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-gold-500/20 transition-all">
                <div className="flex items-center gap-2 text-gold-600 font-black text-[9px] uppercase tracking-widest mb-2 opacity-50">
                  <Calendar className="w-3 h-3" />
                  First Activity
                </div>
                <p className="text-sm font-black text-navy-950 dark:text-white uppercase leading-tight mt-2">
                  {formatDate(activities[activities.length - 1].startTime, { month: 'short', day: '2-digit', year: 'numeric' })}
                  <br />
                  <span className="text-navy-700 font-bold">{formatDate(activities[activities.length - 1].startTime, { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-gold-500/20 transition-all">
                <div className="flex items-center gap-2 text-gold-600 font-black text-[9px] uppercase tracking-widest mb-2 opacity-50">
                  {device.icon === Monitor ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                  Device OS
                </div>
                <p className="text-lg font-black text-navy-950 dark:text-white italic mt-2 uppercase">{device.label}</p>
                <p className="text-[10px] text-navy-700 font-mono mt-1 opacity-50 truncate" title={latestSession.userAgent}>
                  {latestSession.userAgent.substring(0, 30)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Replay Timeline */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-3xl font-black text-navy-950 dark:text-white tracking-tighter uppercase italic">
            Exploration <span className="text-gold-600">Reconstructed</span>
          </h4>
          <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-navy-700 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 text-gold-500" />
              Sequential Logic Flow
            </div>
          </div>
        </div>

        <div className="space-y-12 relative">
          <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-gold-500/30 via-gray-200 dark:via-white/5 to-transparent rounded-full"></div>

          {activities.map((session, sIdx) => (
            <div key={session._id} className="relative group/session pl-24">
              {/* Visual Anchor Node */}
              <div className="absolute left-0 top-6 w-20 h-20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-navy-950 border-2 border-gold-500 shadow-xl z-10 transition-all group-hover/session:scale-125"></div>
                <div className="absolute w-16 h-[2px] bg-gold-500/20 left-10"></div>
              </div>

              {/* Session Interaction Card */}
              <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 transition-all duration-500 hover:border-gold-500/20 relative overflow-hidden">
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-gold-500/20 text-gold-600">
                          <Navigation className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em] mb-1">
                            Navigation Node #{activities.length - sIdx}
                          </p>
                          <h5 className="text-2xl font-black text-navy-950 dark:text-white tracking-tight italic">
                            {session.path}
                          </h5>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-2xl text-[11px] font-bold text-navy-500 dark:text-navy-700 border border-transparent hover:border-gray-100 transition-all">
                          <Calendar className="w-4 h-4 text-navy-300" />
                          {formatFullDate(session.startTime)}
                        </div>
                        {session.referer && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-2xl text-[11px] font-bold text-navy-500 dark:text-navy-700 border border-transparent hover:border-gray-100 transition-all">
                            <ExternalLink className="w-4 h-4 text-navy-300" />
                            Ref: {session.referer.length > 30 ? session.referer.substring(0, 30) + '...' : session.referer}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative shrink-0 pt-4 md:pt-0">
                      <div className="relative flex flex-col items-center justify-center w-28 h-28 border-[6px] border-gold-500/10 rounded-full bg-navy-950 shadow-2xl transition-all group-hover/session:scale-105">
                        <span className="text-[9px] text-gold-500 font-black uppercase tracking-[0.3em] mb-1">Stay Time</span>
                        <span className="text-3xl font-black text-white font-mono">
                          {session.duration}<span className="text-sm font-bold text-gold-600 ml-0.5">S</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interaction Log Detail */}
                  <div className="space-y-6 pt-10 border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <h6 className="text-[10px] font-black text-navy-950 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
                        <Activity className="w-4 h-4 text-gold-500" />
                        Interaction Payload
                      </h6>
                      <span className="px-4 py-1 bg-gold-500/10 text-gold-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-gold-500/20">
                        {session.events.length} Points Detected
                      </span>
                    </div>

                    {session.events.length === 0 ? (
                      <div className="py-12 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-white/5 text-center">
                        <Eye className="w-10 h-10 text-gray-200 dark:text-navy-900 mx-auto mb-3" />
                        <p className="text-[11px] text-navy-300 font-bold uppercase tracking-[0.2em] italic">Passive Session Observation Mode</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {session.events.map((event, eIdx) => (
                          <div key={eIdx} className="group/event bg-gray-50 dark:bg-white/5 p-5 rounded-3xl border border-transparent hover:border-gold-500/30 hover:bg-white dark:hover:bg-navy-900 transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover/event:rotate-6 transition-all ${event.type === 'click' ? 'bg-gold-500 text-navy-950' : 'bg-navy-900 text-gold-500'
                                }`}>
                                {event.type === 'click' ? <MousePointer2 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1 gap-2">
                                  <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${event.type === 'click' ? 'text-gold-600' : 'text-navy-700'}`}>
                                    {event.type} detected
                                  </span>
                                  <span className="text-[9px] text-navy-300 font-bold">
                                    {formatDate(event.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm font-black text-navy-950 dark:text-white truncate tracking-tight uppercase group-hover/event:text-gold-600">
                                  {event.targetText || 'Observer Event'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



