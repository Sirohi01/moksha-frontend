'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Video, 
  Trash2, 
  Settings, 
  ChevronRight, 
  Activity,
  Loader2,
  Zap,
  ShieldCheck,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { apiRequest, API_BASE_URL } from '@/lib/api-base';

export default function AdminLiveStreamingPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStreams = async () => {
    try {
      const res = await apiRequest(`${API_BASE_URL}/api/live/all`);
      setStreams(res.data);
    } catch (err) {
      console.error('Error fetching streams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`${API_BASE_URL}/api/live/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchStreams();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to PERMANENTLY delete this broadcast node? This action is irreversible.')) return;
    try {
      await apiRequest(`${API_BASE_URL}/api/live/${id}`, {
        method: 'DELETE'
      });
      fetchStreams();
    } catch (err) {
      console.error('Error deleting stream:', err);
      alert('Failed to delete stream. Signal still active.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans p-8 md:p-12 selection:bg-gold-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Dynamic Command Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-stone-100">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-stone-50">
               <div className="w-10 h-10 bg-gold-500 rounded-2xl shadow-[0_5px_15px_rgba(244,196,48,0.4)] flex items-center justify-center text-white">
                  <Activity className="w-6 h-6" />
               </div>
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900 leading-none">Broadcast HQ</h1>
              <p className="text-gold-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic shadow-sm">Mission Control • Global Outreach Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-3 px-6 py-4 bg-white border border-stone-100 rounded-2xl shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">All Nodes Operational</span>
             </div>
             <Link 
               href="/admin/live-streaming/create"
               className="bg-stone-950 hover:bg-gold-500 text-gold-500 hover:text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center gap-3 italic"
             >
               <Plus className="w-5 h-5" /> Initialize Signal
             </Link>
          </div>
        </header>

        {/* Dashboard Intelligence Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-white/50 rounded-[3rem] border-2 border-dashed border-gold-100 animate-pulse">
             <Loader2 className="w-16 h-16 text-gold-500 animate-spin mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 italic">Syncing Transmission Logs...</p>
          </div>
        ) : streams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white border border-stone-100 rounded-[3.5rem] shadow-2xl shadow-stone-200/20 text-center">
            <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-10 border-2 border-dashed border-stone-100 p-8 grayscale opacity-20">
              <Compass className="w-full h-full text-stone-300" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-stone-400 mb-2">No Active Broadcast Paths Established</h3>
            <p className="text-stone-300 text-[10px] font-black uppercase tracking-[0.4em] italic leading-relaxed">System is awaiting the first spiritual signal uplink.<br/>Initiate a node to begin global dissemination.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {streams.map((stream) => (
              <div key={stream._id} className="bg-white border border-stone-100 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.03)] flex flex-col xl:flex-row group transition-all hover:border-gold-500/20 hover:shadow-gold-500/10 hover:translate-y-[-4px]">
                
                {/* Visual Intercept Box */}
                <div className="w-full xl:w-[450px] bg-stone-900 h-72 xl:h-auto relative flex items-center justify-center overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                     <div className="w-20 h-20 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 duration-700">
                        <Video className="w-10 h-10 text-gold-500 shadow-2xl" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500/40 mt-6 animate-pulse">Live Intercept Active</span>
                  </div>

                  <div className="absolute top-8 left-8 flex gap-3">
                    <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/10 ${stream.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-800 text-stone-400'}`}>
                      {stream.status}
                    </span>
                    <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-widest rounded-2xl border border-white/10">
                      {stream.streamType}
                    </span>
                  </div>
                </div>

                {/* Tactical Analytics & Control */}
                <div className="flex-1 p-12 flex flex-col justify-between space-y-12">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 leading-none">{stream.title}</h2>
                       <div className="flex items-center gap-4">
                          <button className="p-4 bg-stone-50 rounded-[1.5rem] text-stone-300 hover:text-stone-900 hover:bg-stone-100 transition-all border border-stone-100 shadow-sm"><Settings className="w-5 h-5" /></button>
                          <button 
                            onClick={() => handleDelete(stream._id)}
                            className="p-4 bg-stone-50 rounded-[1.5rem] text-stone-300 hover:bg-red-500 hover:text-white transition-all border border-stone-100 shadow-xl shadow-stone-200/20 active:scale-90"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                    <p className="text-stone-400 font-bold text-sm mb-10 leading-relaxed max-w-3xl italic">"{stream.description}"</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Node ID</span>
                          <p className="text-[10px] font-black text-stone-900 uppercase truncate">#{stream._id.slice(-8)}</p>
                       </div>
                       <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Encryption</span>
                          <p className="text-[10px] font-black text-emerald-500 uppercase">Secured</p>
                       </div>
                       <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Visual Source</span>
                          <p className="text-[10px] font-black text-gold-600 uppercase italic underline underline-offset-4">{stream.streamType}</p>
                       </div>
                    </div>
                  </div>

                  {/* Actions Deck */}
                  <div className="flex flex-wrap items-center gap-6 pt-10 border-t border-stone-100">
                    {stream.status === 'scheduled' && (
                      <button 
                        onClick={() => updateStatus(stream._id, 'live')}
                        className="bg-gold-500 hover:bg-stone-900 text-stone-900 hover:text-gold-500 px-10 py-5 rounded-[2rem] flex items-center gap-4 font-black text-[12px] uppercase tracking-widest transition-all active:scale-95 shadow-[0_20px_40px_rgba(244,196,48,0.2)] italic"
                      >
                         Initialize Signal <Zap className="w-5 h-5 fill-current" />
                      </button>
                    )}
                    {stream.status === 'live' && (
                      <button 
                        onClick={() => updateStatus(stream._id, 'ended')}
                        className="bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-[2rem] flex items-center gap-4 font-black text-[12px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-red-500/20 italic"
                      >
                         Terminate Signal <Zap className="w-5 h-5 fill-current rotate-180" />
                      </button>
                    )}
                    <Link 
                      href={`/admin/live-streaming/monitor/${stream._id}`}
                      className="bg-stone-900 hover:bg-stone-800 text-white px-10 py-5 rounded-[2rem] flex items-center gap-4 font-black text-[12px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl italic border border-white/5"
                    >
                       Control Room <ArrowUpRight className="w-5 h-5" />
                    </Link>
                    <a 
                      href="/live" 
                      target="_blank"
                      className="bg-stone-50 text-stone-400 hover:text-stone-900 px-10 py-5 rounded-[2rem] flex items-center gap-4 font-black text-[12px] uppercase tracking-widest transition-all active:scale-95 border border-stone-100"
                    >
                       Public Portal <ChevronRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
