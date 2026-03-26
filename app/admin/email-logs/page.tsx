'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { PageHeader, DataTable, LoadingSpinner, Alert, ActionButton } from '@/components/admin/AdminComponents';
import { Mail, RefreshCw, Eye, User, Clock, CheckCircle, XCircle } from 'lucide-react';

interface EmailLog {
  _id: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  body: string;
  templateName: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
  messageId?: string;
  createdAt: string;
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getEmailLogs(currentPage, 10);
      if (response.success) {
        setLogs(response.data);
        setTotalPages(response.pagination.pages);
      } else {
        throw new Error(response.message || 'Failed to fetch email logs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch email logs');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'recipient',
      label: 'Recipient',
      render: (_: any, log: EmailLog) => (
        <div className="flex flex-col">
          <span className="font-black text-navy-950">{log.recipientName || 'Unspecified'}</span>
          <span className="text-[10px] text-navy-400 lowercase italic">{log.recipientEmail}</span>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val: string) => <span className="truncate max-w-[200px] inline-block font-bold">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <div className="flex items-center gap-2">
          {val === 'sent' ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-500" />
          )}
          <span className={`text-[10px] font-black uppercase tracking-widest ${val === 'sent' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {val}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Transmitted',
      render: (val: string) => (
        <div className="flex items-center gap-2 text-navy-400 font-bold">
          <Clock className="w-3 h-3" />
          <span>{new Date(val).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Intelligence',
      render: (_: any, log: EmailLog) => (
        <button
          onClick={() => setSelectedLog(log)}
          className="p-2 hover:bg-navy-50 rounded-xl text-navy-950 transition-colors flex items-center gap-2 group border border-transparent hover:border-navy-100"
        >
          <Eye className="w-4 h-4 group-hover:text-gold-600" />
          <span className="text-[9px] font-black uppercase tracking-widest">View Body</span>
        </button>
      )
    }
  ];

  if (selectedLog) {
    return (
      <div className="w-full min-h-screen pb-40 relative block overflow-visible">
        {/* Top Analysis Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-navy-50 shadow-sm mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSelectedLog(null)}
              className="px-8 py-4 bg-navy-950 text-gold-500 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-gold-600 hover:text-navy-950 transition-all flex items-center gap-3 shadow-xl active:scale-95"
            >
              <XCircle className="w-5 h-5" />
              <span>Exit Report</span>
            </button>
            <div className="h-12 w-px bg-navy-100 hidden md:block"></div>
            <div>
              <h2 className="text-3xl font-black text-navy-950 uppercase italic tracking-tighter leading-none mb-1">Transmission Analysis</h2>
              <p className="text-[10px] font-black text-navy-300 uppercase tracking-[0.4em] opacity-80 italic">Audit Packet: {selectedLog._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <p className="text-[9px] font-black text-navy-300 uppercase tracking-widest mb-1">Packet Status</p>
                <div className={`px-6 py-2 rounded-full border flex items-center gap-3 ${selectedLog.status === 'sent' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedLog.status === 'sent' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedLog.status}</span>
                </div>
             </div>
             <button onClick={() => window.print()} className="w-14 h-14 bg-white border-2 border-navy-50 text-navy-950 rounded-2xl flex items-center justify-center hover:bg-navy-50 transition-all shadow-sm">
                <Mail className="w-6 h-6" />
             </button>
          </div>
        </div>

        <div className="space-y-12">
          {/* Metadata Summary Analysis - Now at the Top */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-navy-50 shadow-2xl shadow-navy-100/20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-1 h-1 bg-gold-600 rounded-full"></div>
              <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">Metadata Analysis</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Recipient Node</p>
                <div className="space-y-1">
                  <p className="text-xl font-black text-navy-950 tracking-tight leading-none">{selectedLog.recipientName || 'Unlabeled Entity'}</p>
                  <p className="text-[11px] text-navy-400 font-medium lowercase italic">{selectedLog.recipientEmail}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Protocol Stats</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-navy-950 uppercase tracking-widest">Template:</span>
                    <span className="text-[10px] font-black text-navy-500 bg-navy-50 px-3 py-1 rounded-lg border border-navy-100/20">{selectedLog.templateName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-navy-950 uppercase tracking-widest">Clock:</span>
                    <span className="text-[11px] font-black text-navy-500">{new Date(selectedLog.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Encrypted Trace Key</p>
                <code className="text-[11px] font-mono p-5 bg-navy-50/50 rounded-2xl block break-all border border-navy-100/30 text-navy-950 selection:bg-navy-950 selection:text-gold-500">
                  {selectedLog.messageId || 'CRYPTO_UNAVAILABLE'}
                </code>
              </div>
            </div>

            {selectedLog.errorMessage && (
              <div className="mt-10 pt-10 border-t border-navy-50">
                <div className="flex items-center gap-4 bg-rose-50 p-6 rounded-3xl border border-rose-100/50">
                   <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                      <XCircle className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Failure Signature Detected</p>
                      <p className="text-xs text-rose-700 font-mono font-bold leading-relaxed">{selectedLog.errorMessage}</p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Email Body Payload */}
          <div className="space-y-8">
            <div className="bg-white p-2 sm:p-4 rounded-[4.5rem] border-[16px] border-navy-50/30 shadow-2xl relative overflow-visible">
              <div className="flex items-center gap-3 px-10 py-4 bg-navy-950 text-gold-500 rounded-full w-fit mb-12 translate-x-12 -translate-y-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10">
                <div className="w-3 h-3 rounded-full bg-gold-500 animate-pulse shadow-[0_0_15px_#B88721]"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.5em] italic">Decrypted Transmission Payload</span>
              </div>
              
              <div className="bg-white p-10 sm:p-24 rounded-[3rem] border border-navy-50 overflow-visible min-h-[600px] selection:bg-navy-950 selection:text-gold-500">
                <div 
                  className="prose prose-navy max-w-none prose-p:leading-relaxed prose-strong:text-navy-950"
                  dangerouslySetInnerHTML={{ __html: selectedLog.body }}
                />
              </div>
            </div>

            <div className="flex justify-center py-20">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-24 py-10 bg-white border-2 border-navy-100 rounded-[3rem] text-[14px] font-black uppercase tracking-[0.3em] text-navy-950 hover:bg-navy-950 hover:text-gold-500 hover:border-navy-950 transition-all active:scale-95 shadow-[0_40px_80px_-20px_rgba(0,0,128,0.15)] mb-32"
                >
                  Terminate Analysis & Close Report
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <PageHeader 
        title="Communication Logs" 
        description="Encrypted history of all SMTP outgoing transmissions and delivery integrity reports."
        icon={<Mail className="w-7 h-7" />}
      >
        <ActionButton 
          onClick={fetchLogs}
          variant="secondary"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Sync Records
        </ActionButton>
      </PageHeader>

      {error && <Alert type="error" message={error} />}

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-navy-50 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={logs} 
          loading={loading} 
          emptyMessage="No email transmissions recorded in terminal history."
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-8 py-4 bg-white border-2 border-navy-50 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:border-gold-500 hover:text-gold-600 transition-all shadow-sm active:scale-95"
            >
                Previous Deck
            </button>
            <div className="bg-navy-50 px-6 py-3 rounded-xl">
                <span className="text-[10px] font-black text-navy-950 uppercase tracking-widest">
                    Page <span className="text-gold-600">{currentPage}</span> / {totalPages}
                </span>
            </div>
            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-8 py-4 bg-white border-2 border-navy-50 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:border-gold-500 hover:text-gold-600 transition-all shadow-sm active:scale-95"
            >
                Next Deck
            </button>
        </div>
      )}
    </div>
  );
}
