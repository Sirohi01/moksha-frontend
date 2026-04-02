'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { 
  Activity, 
  User, 
  Calendar, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Search,
  ShieldCheck,
  Globe,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Settings,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityLog {
  _id: string;
  adminId: string;
  adminName: string;
  adminEmail?: string;
  adminRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'error';
}

const timeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatFullDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const ACTION_MAP: Record<string, { label: string, color: string, icon: any }> = {
  'login': { label: 'Auth: Login', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: LogIn },
  'logout': { label: 'Auth: Logout', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: LogOut },
  'update_content': { label: 'Editor: Update', color: 'bg-gold-50 text-gold-700 border-gold-100', icon: Edit },
  'delete_content': { label: 'Editor: Delete', color: 'bg-red-50 text-red-600 border-red-100', icon: Trash2 },
  'create_content': { label: 'Editor: Create', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Plus },
  'page_visit': { label: 'Navigation', color: 'bg-navy-50 text-navy-600 border-navy-100', icon: ExternalLink },
  'system': { label: 'System', color: 'bg-stone-50 text-stone-600 border-stone-100', icon: Settings },
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getActivities(page, 20);
      setLogs(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getActionConfig = (action: string) => {
    return ACTION_MAP[action] || { label: action.replace('_', ' '), color: 'bg-stone-50 text-stone-600 border-stone-100', icon: Activity };
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-navy-50 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.03)]">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gold-600 mb-1">
             <Activity className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administrative Telemetry</span>
          </div>
          <h1 className="text-4xl font-black text-navy-950 tracking-tighter uppercase italic py-1 leading-none">
            Operation Logs
          </h1>
          <p className="text-stone-400 text-sm font-medium italic">
            "Real-time monitoring of all administrative command vectors and mission protocols."
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={fetchLogs}
             className="p-4 bg-white text-navy-950 rounded-2xl border border-navy-50 hover:border-gold-500 hover:shadow-xl transition-all active:scale-95 group"
           >
             <RefreshCw className={cn("w-5 h-5 group-hover:rotate-180 transition-transform duration-700", loading && "animate-spin")} />
           </button>
           
           <div className="flex items-center gap-4 bg-navy-50/50 p-2 rounded-[1.5rem] border border-navy-50/50">
             <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-navy-50 shadow-sm">
               <User className="w-4 h-4 text-gold-600" />
               <span className="text-[10px] font-black uppercase tracking-widest text-navy-950">User Filter</span>
             </div>
             <select 
               className="bg-transparent text-[10px] font-black uppercase tracking-widest text-navy-600 pr-4 outline-none border-none focus:ring-0"
               value={filterAction}
               onChange={(e) => setFilterAction(e.target.value)}
             >
               <option value="">All Actions</option>
               <option value="login">Logins</option>
               <option value="update_content">Content Updates</option>
               <option value="delete_content">Deletions</option>
             </select>
           </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
         <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-stone-300 group-focus-within:text-gold-600 transition-colors" />
         </div>
         <input 
           type="text" 
           placeholder="Search identifiers, actions, or IP addresses..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full bg-white border-2 border-transparent focus:border-gold-500/30 rounded-[1.8rem] py-6 pl-20 pr-10 text-navy-950 font-bold placeholder:text-stone-300 shadow-sm group-hover:shadow-md transition-all outline-none"
         />
      </div>

      {/* LOGS GRID/TABLE */}
      <div className="bg-white rounded-[3rem] border border-navy-50 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-50/50 border-b border-navy-100">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-navy-950">Tactical User</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-navy-950">Action Protocol</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-navy-950">Telemetry Details</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-navy-950 text-right">Mission Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading && logs.length === 0 ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-10 py-8"><div className="h-12 bg-navy-50 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <ShieldCheck className="w-20 h-20 text-navy-950" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">No operational telemetry detected_</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const config = getActionConfig(log.action);
                  const Icon = config.icon;
                  
                  return (
                    <tr key={log._id} className="group hover:bg-navy-50/30 transition-all duration-300">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-navy-950 flex items-center justify-center text-gold-500 font-black text-sm border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                            {log.adminName.charAt(0)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-navy-950 uppercase tracking-tighter group-hover:text-gold-600 transition-colors leading-none">{log.adminName}</p>
                            <div className="flex items-center gap-2 mt-2">
                               <Globe className="w-3.5 h-3.5 text-navy-300" />
                               <p className="text-[11px] font-bold text-navy-400 font-mono tracking-tighter uppercase">{log.ipAddress}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={cn(
                          "inline-flex items-center gap-3 px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest leading-none shadow-sm",
                          config.color
                        )}>
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </div>
                      </td>
                      <td className="px-10 py-8 max-w-md">
                        <div className="space-y-2">
                          <p className="text-[13px] font-bold text-navy-900 leading-relaxed italic">{log.details}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-navy-300 italic">Resource_</span>
                            <span className="text-[10px] font-black uppercase tracking-tight text-white bg-navy-900 px-3 py-1 rounded-lg leading-none shadow-sm">{log.resource} ({log.resourceId || 'N/A'})</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-xl border border-navy-100 group-hover:bg-white transition-colors shadow-sm">
                             <Clock className="w-4 h-4 text-gold-600" />
                             <span className="text-xs font-black text-navy-950 uppercase tracking-tighter">
                               {timeAgo(log.timestamp)}
                             </span>
                          </div>
                          <p className="text-[10px] font-bold text-navy-300 tracking-widest uppercase italic">
                            {formatFullDate(log.timestamp)}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION DECK */}
        <div className="bg-navy-50/50 border-t border-navy-100 px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase text-navy-400 tracking-[0.2em] leading-none">Telemetry Node</p>
                <p className="text-[14px] font-black text-navy-950 uppercase tracking-tighter mt-1.5">Page {page} <span className="text-gold-600 mx-1">/</span> {totalPages}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-gold-600 shadow-[0_0_12px_rgba(184,135,33,0.6)]"></div>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-16 h-16 rounded-2xl bg-white border border-navy-50 flex items-center justify-center text-navy-950 hover:bg-navy-950 hover:text-white disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-16 h-16 rounded-2xl bg-white border border-navy-50 flex items-center justify-center text-navy-950 hover:bg-navy-950 hover:text-white disabled:opacity-20 transition-all active:scale-90 shadow-xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>

      {/* FOOTER METRICS */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 bg-white p-8 rounded-[2rem] border border-navy-50 flex items-center justify-between group overflow-hidden relative">
           <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Protocol Status</p>
              <h4 className="text-xl font-black text-navy-950 italic">ACTIVE_UPLINK</h4>
           </div>
           <CheckCircle2 className="w-16 h-16 text-emerald-500/10 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-700" />
        </div>
        
        <div className="flex-1 bg-white p-8 rounded-[2rem] border border-navy-50 flex items-center justify-between group overflow-hidden relative text-right">
           <AlertCircle className="w-16 h-16 text-rose-500/10 absolute -left-4 -bottom-4 group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10 space-y-2 w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Privacy Standard</p>
              <h4 className="text-xl font-black text-navy-950 italic">ENCRYPTED_TELEMETRY</h4>
           </div>
        </div>
      </div>
    </div>
  );
}
