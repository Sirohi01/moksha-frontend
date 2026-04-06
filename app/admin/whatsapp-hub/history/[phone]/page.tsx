'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactsAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function ContactHistoryPage({ params }: { params: { phone: string } }) {
  const router = useRouter();
  const { phone } = params;
  
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, [phone, page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await contactsAPI.getHistory(phone, { page, limit: 10 });
      if (res.success) {
        setHistoryLogs(res.data || []);
        setTotalPages(res.pages || 1);
        setTotalRecords(res.total || 0);
      }
    } catch (err: any) {
      toast.error('Failed to retrieve archives');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-black mb-4 flex items-center text-xs font-bold uppercase tracking-widest gap-2"
          >
            <span>←</span> Operations Hub
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-4">
            +{phone} <span className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest italic tracking-tighter">Interaction Archives</span>
          </h1>
        </div>
        <div className="text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Database Sync</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live Connection</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8 relative max-w-4xl mx-auto">
        <div className="absolute left-[31px] top-0 bottom-0 w-px bg-gray-100 hidden md:block" />
        
        {loading ? (
          <div className="p-20 text-center animate-pulse italic text-gray-300 font-medium tracking-widest">DECRYPTING TRANSMISSION HISTORY...</div>
        ) : historyLogs.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-3xl border border-gray-100 text-gray-400 italic">
            No historical data nodes found for this identity.
          </div>
        ) : (
          historyLogs.map((log: any, i: number) => (
            <div key={i} className="relative flex flex-col md:flex-row gap-8 group animate-fadeIn">
              {/* Date Bubble */}
              <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-white border border-gray-100 rounded-2xl shadow-sm z-10 shrink-0 group-hover:border-emerald-200 transition-all">
                <span className="text-[10px] font-black text-gray-400 uppercase">{new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-lg font-black text-zinc-900 leading-none">{new Date(log.createdAt).getDate()}</span>
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:border-gray-200 transition-all relative overflow-hidden group/card">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    Timestamp: {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    log.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {log.status}
                  </span>
                </div>
                
                <p className="text-[15px] font-medium text-zinc-700 leading-relaxed italic border-l-4 border-gray-50 pl-6 py-2">
                   "{log.content}"
                </p>

                <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-zinc-400 uppercase">Provider:</span>
                        <span className="text-[10px] font-bold text-zinc-600">{log.provider || 'Internal'}</span>
                    </div>
                    <div className="opacity-0 group-hover/card:opacity-100 transition-all">
                         <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter italic">Payload ID: {log._id.substring(18)}</span>
                    </div>
                </div>

                {/* Watermark */}
                <div className="absolute -bottom-4 -right-4 italic font-black text-5xl uppercase tracking-tighter text-gray-400/5 select-none transform rotate-[-5deg]">
                    {log.type}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Container */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 animate-fadeIn py-6 border-y border-gray-50">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-zinc-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
               ←
             </button>
             
             {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Basic logic: show current, first, last, and neighbors
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-12 w-12 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${
                        page === pageNum 
                          ? 'bg-black text-white shadow-xl scale-110' 
                          : 'bg-white text-zinc-400 border border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                   return <span key={pageNum} className="text-zinc-300 font-black">...</span>;
                }
                return null;
             })}

             <button 
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages}
               className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-zinc-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
               →
             </button>
          </div>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
            Archived Page {page} of {totalPages} — Total Nodes: {totalRecords}
          </span>
        </div>
      )}

      {/* Footer Action */}
      <div className="flex justify-center pt-10">
          <button 
            onClick={() => {
               localStorage.setItem('wa_broadcast_recipients', JSON.stringify([{ phone: phone, name: 'Contact' }]));
               router.push('/admin/whatsapp-hub/composer');
            }}
            className="bg-black hover:bg-zinc-800 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl flex items-center gap-3 active:scale-95"
          >
              Initiate New Channel Broadcast <span>→</span>
          </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
