'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MuxPlayer from '@mux/mux-player-react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Users, 
  ShieldAlert, 
  Settings, 
  Play, 
  Loader2, 
  User, 
  Trash2,
  Terminal,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import { apiRequest, API_BASE_URL } from '@/lib/api-base';

const WS_URL = API_BASE_URL.replace(/^http/, 'ws');

export default function AdminMonitorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [stream, setStream] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const res = await apiRequest(`${API_BASE_URL}/api/live/all`);
        const currentStream = res.data.find((s: any) => s._id === id);
        setStream(currentStream);
        
        if (currentStream) {
          fetchHistory(currentStream._id);
          connectSocket(currentStream._id);
        }
      } catch (err) {
        console.error('Error fetching stream:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreamData();
    
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [id]);

  const fetchHistory = async (streamId: string) => {
    try {
      const res = await apiRequest(`${API_BASE_URL}/api/live/${streamId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const connectSocket = (streamId: string) => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ type: 'live_chat_join', chatId: streamId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'live_chat_message') {
        setMessages(prev => {
          if (prev.some(m => m._id === data.message._id)) return prev;
          return [...prev, data.message];
        });
      }
    };

    socket.onclose = () => setIsConnected(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Redact this specific transmission segment?')) return;
    try {
      await apiRequest(`${API_BASE_URL}/api/live/message/${messageId}`, {
        method: 'DELETE'
      });
      setMessages(prev => prev.filter(m => m._id !== messageId));
    } catch (err) {
      console.error('Redaction failed:', err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#faf9f6]">
      <Loader2 className="w-12 h-12 animate-spin text-gold-500 mb-4" />
      <p className="font-black uppercase tracking-widest text-[10px] text-stone-400 italic">Syncing Control Room Data...</p>
    </div>
  );

  if (!stream) return (
     <div className="h-screen flex flex-col items-center justify-center bg-[#faf9f6]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black italic tracking-tighter">SIGNAL LOST: NODE NOT FOUND</h1>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 flex flex-col overflow-hidden font-sans">
      {/* Premium Admin Header */}
      <header className="h-24 bg-white border-b border-stone-100 px-10 flex items-center justify-between shrink-0 relative z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.back()} 
            className="p-4 bg-stone-50 hover:bg-gold-500 hover:text-white rounded-2xl transition-all active:scale-90 border border-stone-100 group shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-stone-900">{stream.title}</h1>
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${stream.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-100 text-stone-400'}`}>
                {stream.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
               <Globe className="w-3 h-3 text-gold-500" />
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest italic">Mission Control Center • Live Intercept Channel</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
           {/* WebSocket Status Indicator */}
           <div className="flex items-center gap-3 px-5 py-3 bg-stone-50 rounded-2xl border border-stone-100 shadow-inner">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 italic">COMMS: {isConnected ? 'SECURED' : 'DISCONNECTED'}</span>
           </div>
           
           <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black uppercase text-gold-600 tracking-widest mb-1.5">Signal Strength</span>
              <div className="flex items-center gap-1.5">
                 {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-4 rounded-full ${i <= 4 ? 'bg-gold-500 shadow-[0_0_8px_rgba(244,196,48,0.3)]' : 'bg-stone-200'}`}></div>)}
              </div>
           </div>
        </div>
      </header>

      {/* Main Monitoring Deck */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Visual Feed Section */}
        <section className="flex-1 relative bg-stone-50 flex items-center justify-center p-12 overflow-hidden border-r border-stone-100">
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(244,196,48,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(244,196,48,0.1)_2px,transparent_1px)] bg-[size:60px_60px]"></div>
          </div>

          <div className="w-full max-w-6xl aspect-video relative z-10 shadow-[0_50px_100px_rgba(244,196,48,0.08)] border-4 border-white rounded-[3.5rem] overflow-hidden group bg-white p-4">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-inner">
               {stream.streamType === 'mux' ? (
                 <MuxPlayer
                   playbackId={stream.muxPlaybackId}
                   metadataVideoTitle={stream.title}
                   theme="minimal"
                   primaryColor="#f4c430"
                   className="w-full h-full shadow-2xl"
                   autoPlay
                   muted
                 />
               ) : stream.streamType === 'youtube' ? (
                 <iframe
                   width="100%"
                   height="100%"
                   src={`https://www.youtube.com/embed/${stream.youtubeVideoId}?autoplay=1&mute=1`}
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   className="w-full h-full"
                 ></iframe>
               ) : (
                 <div className="w-full h-full bg-stone-800 flex flex-col items-center justify-center gap-8">
                   <Zap className="w-24 h-24 text-gold-500 opacity-10 animate-pulse" />
                   <p className="text-stone-500 font-black uppercase text-xs tracking-[0.3em] italic">Awaiting Visual Signal Uplink...</p>
                 </div>
               )}
            </div>
            
            {/* Control Room Watermark */}
            <div className="absolute top-12 left-12 flex gap-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700">
               <div className="px-6 py-3 bg-stone-900/90 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                  <Activity className="w-4 h-4 text-gold-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold-500">Live Intercept Preview</span>
               </div>
            </div>
          </div>

          {/* Telemetry Overlay Panel */}
          <div className="absolute bottom-12 left-12 right-12 flex items-center justify-center pointer-events-none">
             <div className="bg-white/90 backdrop-blur-3xl border border-gold-200/50 p-8 rounded-[2.5rem] flex items-center gap-16 shadow-[0_30px_60px_rgba(244,196,48,0.1)] pointer-events-auto">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gold-500" />
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Global Audience</span>
                   </div>
                   <span className="text-4xl font-black italic tracking-tighter text-stone-800">4,128</span>
                </div>
                <div className="w-px h-12 bg-gold-100"></div>
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-gold-500" />
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Signal Delay</span>
                   </div>
                   <span className="text-4xl font-black italic tracking-tighter text-emerald-500">24ms</span>
                </div>
                <div className="w-px h-12 bg-gold-100"></div>
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-gold-500" />
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Stream Mode</span>
                   </div>
                   <span className="text-4xl font-black italic tracking-tighter text-gold-500 uppercase">{stream.streamType}</span>
                </div>
             </div>
          </div>
        </section>

        {/* Live Chat Intercept (Sidebar) */}
        <aside className="w-full lg:w-[500px] bg-white flex flex-col shrink-0 shadow-2xl relative z-40 border-l border-stone-100">
          <div className="p-10 border-b border-stone-50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-5">
               <div className="p-4 bg-stone-900 rounded-[2rem] text-white shadow-xl shadow-stone-900/10">
                  <MessageCircle className="w-6 h-6 fill-current" />
               </div>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter italic text-stone-800">User Intercept</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic">Signal Monitoring Active</span>
                  </div>
               </div>
            </div>
            <button className="p-3 text-stone-300 hover:text-stone-900 transition-all border border-stone-100 rounded-2xl hover:bg-stone-50 shadow-sm">
               <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide custom-chat-view bg-gradient-to-b from-transparent to-stone-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 grayscale">
                 <MessageCircle className="w-24 h-24 mb-6" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center italic leading-relaxed">No real-time transmission detected<br/>waiting for users to join node.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="flex gap-6 animate-slideIn">
                  <div className="shrink-0 pt-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-gold-500 shadow-sm relative group overflow-hidden">
                       <div className="absolute inset-0 bg-gold-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      {msg.isAdmin ? <ShieldAlert className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`text-[11px] font-black uppercase tracking-widest italic ${msg.isAdmin ? 'text-gold-600' : 'text-stone-950 font-black'}`}>
                        {msg.userName}
                      </span>
                      <span className="text-[9px] font-bold text-stone-300 uppercase italic tracking-tighter">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      {msg.isAdmin && <span className="px-2.5 py-1 bg-gold-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">ADMIN</span>}
                    </div>
                    <div className={`p-6 border rounded-[2rem] rounded-tl-none relative group transition-all shadow-sm ${msg.isAdmin ? 'bg-gold-50 border-gold-200/50' : 'bg-white border-stone-100 hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5'}`}>
                      <p className="text-xs font-bold text-stone-600 leading-relaxed italic">"{msg.message}"</p>
                      
                      {/* Tactical Redundancy Actions */}
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hidden sm:flex">
                         <button 
                           onClick={() => handleDeleteMessage(msg._id)}
                           className="p-3 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/20 active:scale-90" 
                           title="REDACT SIGNAL"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-10 border-t border-stone-50 bg-white">
             <div className="p-8 bg-[#faf9f6] rounded-[2.5rem] border-2 border-dashed border-stone-100 text-center group cursor-pointer hover:border-gold-500/30 transition-all">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] italic group-hover:text-gold-600 transition-colors">Global Intercept Protocol Active</p>
                <div className="w-1 h-1 bg-gold-400 rounded-full mx-auto mt-4 animate-bounce"></div>
             </div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
