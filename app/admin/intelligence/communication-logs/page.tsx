'use client';

import { useState, useEffect } from 'react';
import { intelligenceAPI } from '@/lib/api';
import { PageHeader, DataTable, Alert, ActionButton, LoadingSpinner } from '@/components/admin/AdminComponents';
import { MessageSquare, Phone, Send, CheckCircle, XCircle, Search, RefreshCw, Smartphone } from 'lucide-react';

export default function CommunicationLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [filters, setFilters] = useState({ type: 'whatsapp', status: '' });
  const [mode, setMode] = useState<'alerts' | 'interactions'>('alerts');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Adjust filters when mode changes
  const handleModeChange = (newMode: 'alerts' | 'interactions') => {
    setMode(newMode);
    setPage(1); // Reset to first page
    if (newMode === 'interactions') {
      setFilters({ type: '', status: '' });
    } else {
      setFilters({ type: 'whatsapp', status: '' });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await intelligenceAPI.getCommunicationLogs(page, 20, filters.type, filters.status, mode, startDate, endDate, searchTerm || undefined);
      setLogs(res.data || []);
      setPagination({
        pages: res.pagination?.pages || 1,
        total: res.pagination?.total || 0
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch communication logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters, mode, startDate, endDate, searchTerm]);

  const columns = mode === 'interactions' ? [
    {
      key: 'platform',
      label: 'Platform',
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-navy-50 text-navy-950`}>
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{val}</span>
        </div>
      )
    },
    {
      key: 'ipAddress',
      label: 'Visitor Node (IP)',
      render: (val: string, row: any) => (
        <div className="flex flex-col">
          <span className="text-navy-950 font-black">{val || 'HIDDEN'}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic">
            {row.location ? `${row.location.city || ''}, ${row.location.country || ''}` : 'Location Decrypting...'}
          </span>
        </div>
      )
    },
    {
      key: 'pageUrl',
      label: 'Source Page',
      render: (val: string) => <p className="truncate max-w-xs text-navy-700 font-bold uppercase text-[9px] tracking-widest italic">{val || '/'}</p>
    },
    {
      key: 'timestamp',
      label: 'Interaction Time',
      render: (val: string) => <span className="text-navy-950 font-black tracking-tight italic">{new Date(val).toLocaleString()}</span>
    },
    {
      key: 'userAgent',
      label: 'Device Signature',
      render: (val: string) => <span className="text-[10px] font-black text-navy-950 italic opacity-40 truncate max-w-[150px] block">{val}</span>
    }
  ] : [
    {
      key: 'type',
      label: 'Channel',
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-navy-50 text-navy-950`}>
            {val === 'whatsapp' ? <MessageSquare className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{val}</span>
        </div>
      )
    },
    { key: 'recipient', label: 'Target Node (Phone)' },
    {
      key: 'content',
      label: 'Message Content',
      render: (val: string) => <p className="truncate max-w-xs text-gray-400 font-bold uppercase text-[9px] tracking-widest">{val}</p>
    },
    {
      key: 'status',
      label: 'Transmission',
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${val === 'delivered' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
              val === 'failed' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                'bg-navy-300 animate-pulse'
            }`}></div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${val === 'delivered' ? 'text-emerald-500' :
              val === 'failed' ? 'text-rose-600' :
                'text-navy-700'
            }`}>{val}</span>
        </div>
      )
    },
    {
      key: 'provider',
      label: 'Uplink Provider',
      render: (val: string) => <span className="text-[10px] font-black text-navy-950 italic opacity-40">{val || 'SYSTEM'}</span>
    },
    {
      key: 'createdAt',
      label: 'Broadcast Time',
      render: (val: string) => <span className="text-gray-400 font-medium">{new Date(val).toLocaleString()}</span>
    }
  ];

  if (loading && page === 1) return <LoadingSpinner message="Decrypting Comm Traffic..." />;

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <PageHeader
        title="Communication Intelligence"
        description="Monitor both automated alerts and public interaction telemetry."
        icon={<Smartphone className="w-7 h-7" />}
      >
        <ActionButton onClick={fetchData} variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
          Synchronize Deck
        </ActionButton>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* WhatsApp Logs Card */}
        <button
          onClick={() => handleModeChange('alerts')}
          className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500 group text-left ${mode === 'alerts'
              ? 'bg-navy-950 border-navy-950 text-white shadow-2xl shadow-emerald-500/20'
              : 'bg-white border-navy-50 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10'
            }`}>
          {/* Background Glass Effect */}
          {mode === 'alerts' && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
          )}

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className={`px-3 py-1 rounded-full border ${mode === 'alerts' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                  Direct Uplink
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${mode === 'alerts' ? 'bg-emerald-500 text-navy-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-emerald-50 text-emerald-600'
                } transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-1">WHATSAPP LOGS</h4>
              <p className={`max-w-[200px] text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-70 ${mode === 'alerts' ? 'text-navy-100' : 'text-navy-900/60'
                }`}>Transmission History & Delivery Intel</p>
            </div>
          </div>
        </button>

        {/* Platform Interactions Card */}
        <button
          onClick={() => handleModeChange('interactions')}
          className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500 group text-left ${mode === 'interactions'
              ? 'bg-navy-950 border-navy-950 text-white shadow-2xl shadow-blue-500/20'
              : 'bg-white border-navy-50 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10'
            }`}>
          {/* Background Glass Effect */}
          {mode === 'interactions' && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
          )}

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className={`px-3 py-1 rounded-full border ${mode === 'interactions' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
                }`}>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                  Visitor Telemetry
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${mode === 'interactions' ? 'bg-blue-500 text-navy-950 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-blue-50 text-blue-600'
                } transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-1">INTERACTIONS</h4>
              <p className={`max-w-[200px] text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-70 ${mode === 'interactions' ? 'text-navy-100' : 'text-navy-900/60'
                }`}>Real-time Platform Engagement Tracking</p>
            </div>
          </div>
        </button>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-3 rounded-[2rem] border border-navy-50 shadow-sm gap-4">
          <div className="flex flex-wrap items-center gap-3 px-4">
             <div className="relative group">
                <input 
                  type="text"
                  placeholder={mode === 'alerts' ? "Search Numbers, Content..." : "Search IPs, Pages..."}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="bg-navy-50/50 border border-navy-100/30 rounded-xl px-10 py-3 text-[10px] font-black uppercase tracking-widest text-navy-950 outline-none focus:ring-2 focus:ring-gold-500/20 transition-all placeholder:text-navy-200"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy-300" />
             </div>

             <div className="flex items-center gap-2 p-1 bg-navy-50 rounded-xl border border-navy-50 shadow-inner">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  className="bg-transparent text-[10px] font-black uppercase tracking-tight text-navy-950 px-3 py-1.5 outline-none border-none focus:ring-0"
                />
                <span className="text-gray-300">→</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  className="bg-transparent text-[10px] font-black uppercase tracking-tight text-navy-950 px-3 py-1.5 outline-none border-none focus:ring-0"
                />
             </div>
             
             <button 
               onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); setPage(1); }}
               className="p-2 bg-navy-950 text-white rounded-xl hover:bg-black transition-all active:scale-95"
               title="Reset Archive Sensors"
             >
               <RefreshCw className="w-3.5 h-3.5" />
             </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-4">
            {mode === 'alerts' && (
              <>
                <select 
                  className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-navy-600 rounded-xl px-4 py-2.5 border-none"
                  value={filters.type}
                  onChange={(e) => { setFilters({...filters, type: e.target.value}); setPage(1); }}
                >
                  <option value="whatsapp">WHATSAPP</option>
                  <option value="sms">SMS</option>
                  <option value="broadcast">BROADCAST</option>
                  <option value="alert">ALERTS</option>
                  <option value="system">SYSTEM</option>
                </select>
                <select 
                  className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-navy-600 rounded-xl px-4 py-2.5 border-none"
                  value={filters.status}
                  onChange={(e) => { setFilters({...filters, status: e.target.value}); setPage(1); }}
                >
                  <option value="">ALL STATUS</option>
                  <option value="delivered">DELIVERED</option>
                  <option value="sent">SENT</option>
                  <option value="failed">FAILED</option>
                  <option value="pending">PENDING</option>
                </select>
              </>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={logs}
          loading={loading && page !== 1}
          pagination={{
            currentPage: page,
            totalPages: pagination.pages,
            total: pagination.total
          }}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
