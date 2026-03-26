'use client';

import { useState, useEffect } from 'react';
import { intelligenceAPI } from '@/lib/api';
import { PageHeader, DataTable, Alert, ActionButton, LoadingSpinner } from '@/components/admin/AdminComponents';
import { Shield, AlertTriangle, Clock, Terminal, Activity, RefreshCw } from 'lucide-react';

export default function SystemLogsPage() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ avgLatency: 0, maxLatency: 0, totalErrors: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsRes, summaryRes] = await Promise.all([
        intelligenceAPI.getErrorLogs(page),
        intelligenceAPI.getPerformanceSummary()
      ]);
      setLogs(logsRes.data);
      setSummary(summaryRes.data);
      setPagination({
        pages: logsRes.pagination?.pages || 1,
        total: logsRes.pagination?.total || 0
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const columns = [
    {
      key: 'method',
      label: 'Method',
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${val === 'GET' ? 'bg-navy-50 text-navy-600' :
            val === 'POST' ? 'bg-emerald-50 text-emerald-600' :
              val === 'DELETE' ? 'bg-rose-50 text-rose-600' :
                'bg-gold-50 text-gold-600'
          }`}>{val}</span>
      )
    },
    { key: 'path', label: 'Endpoint' },
    {
      key: 'statusCode',
      label: 'Status',
      render: (val: number) => (
        <span className={`font-black uppercase tracking-tighter ${val >= 500 ? 'text-rose-600 animate-pulse' : val >= 400 ? 'text-amber-600' : 'text-emerald-500'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'duration',
      label: 'Latency (ms)',
      render: (val: number) => (
        <span className={val > 500 ? 'text-rose-600 font-bold' : 'text-navy-700'}>
          {val ? `${val}ms` : '-'}
        </span>
      )
    },
    { key: 'message', label: 'Issue Description' },
    {
      key: 'createdAt',
      label: 'Timestamp',
      render: (val: string) => <span className="text-gray-400 font-medium">{new Date(val).toLocaleString()}</span>
    }
  ];

  if (loading && page === 1) return <LoadingSpinner message="Decrypting System Telemetry..." />;

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <PageHeader
        title="System Intelligence"
        description="Real-time monitoring of backend bugs, slow API calls, and node performance."
        icon={<Terminal className="w-7 h-7" />}
      >
        <ActionButton onClick={fetchData} variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
          Refresh Feeds
        </ActionButton>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-navy-50 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-950 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gold-600 uppercase tracking-widest">Efficiency</p>
              <h4 className="text-xl font-black text-navy-950 uppercase italic tracking-tighter">Avg Latency</h4>
            </div>
          </div>
          <p className="text-4xl font-black text-navy-950 tracking-tighter italic">{Math.round(summary.avgLatency)}ms</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-navy-50 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Stability</p>
              <h4 className="text-xl font-black text-navy-950 uppercase italic tracking-tighter">Total Errors</h4>
            </div>
          </div>
          <p className="text-4xl font-black text-navy-950 tracking-tighter italic">{summary.totalErrors} <span className="text-[10px] text-gray-300 uppercase italic">Incidents</span></p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-navy-50 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-950 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gold-600 uppercase tracking-widest">Response</p>
              <h4 className="text-xl font-black text-navy-950 uppercase italic tracking-tighter">Max Latency</h4>
            </div>
          </div>
          <p className="text-4xl font-black text-navy-950 tracking-tighter italic">{Math.round(summary.maxLatency)}ms</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="space-y-6">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="text-xs font-black text-navy-950 uppercase tracking-[0.3em]">Live Intelligence Feed</h3>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={logs}
          loading={loading && page !== 1}
          emptyMessage="System parameters within normal range. No bugs detected."
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
