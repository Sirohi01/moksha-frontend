'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Video, 
  Youtube, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Command,
  Plus,
  Play,
  Loader2
} from 'lucide-react';
import { apiRequest, API_BASE_URL } from '@/lib/api-base';

export default function CreateBroadcastPage() {
  const router = useRouter();
  const [streamType, setStreamType] = useState('mux');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeVideoId: '',
    externalUrl: ''
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(`${API_BASE_URL}/api/live/create`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, streamType })
      });
      router.push('/admin/live-streaming');
    } catch (err: any) {
      console.error('Error creating stream:', err);
      alert(err.message || 'Transmission failed to initialize.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans p-8 md:p-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Divine Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.back()} 
              className="p-4 bg-white border border-stone-100 rounded-2xl hover:bg-gold-500 hover:text-white transition-all shadow-sm active:scale-90 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-col">
               <h1 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 leading-none">Schedule Broadcast</h1>
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                  <Zap className="w-3 h-3 text-gold-500" /> MISSION CONTROL • NODE INITIALIZATION
               </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-white border border-stone-100 rounded-2xl shadow-sm">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Secured Uplink Active</span>
          </div>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Manifest (Left) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-gold-500/5 space-y-10">
              
              {/* Metadata Cluster */}
              <div className="space-y-8">
                <div className="relative group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-600 mb-3 block px-1">Broadcast Title</label>
                  <div className="relative">
                     <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-gold-500 transition-colors" />
                     <input 
                       type="text" 
                       required
                       placeholder="CEREMONY OF LIGHTS..."
                       className="w-full p-6 pl-16 bg-stone-50 border border-stone-100 rounded-3xl text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold-500 focus:bg-white transition-all shadow-inner italic"
                       value={formData.title}
                       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-600 mb-3 block px-1">Spiritual Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide a deep manifestation of this broadcast content..."
                    className="w-full p-6 bg-stone-50 border border-stone-100 rounded-[2rem] text-sm font-bold leading-relaxed focus:outline-none focus:border-gold-500 focus:bg-white transition-all shadow-inner italic text-stone-600 placeholder:text-stone-300"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="h-px bg-gold-100 opacity-50"></div>

              {/* Advanced Signal Options */}
              {streamType === 'youtube' && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="p-8 bg-red-50/30 border border-red-100 rounded-3xl space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                           <Youtube className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600 italic">YouTube Protocol Active</span>
                     </div>
                     <input 
                       type="text" 
                       placeholder="YOUTUBE_VIDEO_ID (e.g., dQw4w9WgXcQ)"
                       className="w-full p-5 bg-white border border-red-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-red-400 placeholder:text-red-200 text-red-700 italic"
                       value={formData.youtubeVideoId}
                       onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                     />
                     <p className="text-[9px] font-bold text-red-400 uppercase italic">Past the unique ID from your YouTube Live control panel.</p>
                  </div>
                </div>
              )}

              {streamType === 'external' && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="p-8 bg-stone-50 border border-stone-100 rounded-3xl space-y-4">
                     <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-stone-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 italic">External Transmission URL</span>
                     </div>
                     <input 
                       type="url" 
                       placeholder="https://your-custom-stream.com/live"
                       className="w-full p-5 bg-white border border-stone-200 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-gold-500 italic"
                       value={formData.externalUrl}
                       onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                     />
                  </div>
                </div>
              )}
              
              {streamType === 'mux' && (
                <div className="p-8 bg-gold-50/50 border border-gold-100 rounded-3xl space-y-4 animate-in slide-in-from-top-4 duration-500">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                         <Play className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gold-700 italic">Mux Professional Protocol</span>
                   </div>
                   <p className="text-[9px] font-bold text-gold-500 uppercase leading-relaxed italic tracking-widest">System will automatically provision a global CDN node<br/>upon initialization. Native RTMP support active.</p>
                </div>
              )}
            </div>

            {/* Launchpad */}
            <div className="flex items-center gap-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-stone-900 hover:bg-gold-500 text-white p-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-stone-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 italic"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING...</>
                  ) : (
                    <><Plus className="w-5 h-5" /> INITIALIZE BROADCAST</>
                  )}
                </button>
            </div>
          </div>

          {/* Protocol Selector (Right) */}
          <aside className="lg:col-span-5 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-gold-500/5 space-y-8">
               <div className="flex items-center gap-4 mb-4">
                  <Command className="w-6 h-6 text-gold-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Transmission Protocol</h3>
               </div>
               
               <div className="space-y-4">
                  {[
                    { id: 'mux', name: 'Mux Native', desc: 'Global CDN, Zero Latency, Premium', icon: Video, color: 'gold' },
                    { id: 'youtube', name: 'YouTube Live', desc: 'Global Free Broadcaster', icon: Youtube, color: 'red' },
                    { id: 'external', name: 'Other Source', desc: 'Custom HLS/RTMP Overlays', icon: Globe, color: 'stone' }
                  ].map((type) => (
                    <div 
                      key={type.id}
                      onClick={() => setStreamType(type.id)}
                      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden group ${streamType === type.id ? 'border-gold-500 bg-gold-50/30' : 'border-stone-50 bg-white hover:border-gold-100'}`}
                    >
                      <div className="flex items-center gap-5 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${streamType === type.id ? 'bg-gold-500 text-white shadow-xl shadow-gold-500/20' : 'bg-stone-50 text-stone-300'}`}>
                           <type.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                           <span className={`text-[12px] font-black uppercase tracking-widest italic ${streamType === type.id ? 'text-stone-900' : 'text-stone-400'}`}>{type.name}</span>
                           <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter mt-1">{type.desc}</span>
                        </div>
                      </div>
                      {streamType === type.id && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>}
                    </div>
                  ))}
               </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-stone-900 p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden group shadow-2xl shadow-stone-950">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500 opacity-10 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
               <div className="flex items-center gap-3 relative z-10 underline decoration-gold-500 underline-offset-8">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest italic text-gold-500">Live Manifest Summary</h4>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="flex justify-between border-b border-white/5 pb-3">
                     <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Status</span>
                     <span className="text-[9px] font-black uppercase text-emerald-500">Scheduled for Immediate Sync</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                     <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Encryption</span>
                     <span className="text-[9px] font-black uppercase text-gold-500 italic">AES-256 Enabled</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Protocol</span>
                     <span className="text-[9px] font-black uppercase text-white font-black italic">{streamType.toUpperCase()}</span>
                  </div>
               </div>
            </div>
          </aside>

        </form>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { font-style: italic; opacity: 0.4; }
      `}</style>
    </div>
  );
}
