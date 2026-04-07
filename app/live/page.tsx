'use client';

import React, { useState, useEffect, useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { 
  Send, 
  Users, 
  MessageCircle, 
  Share2, 
  Heart, 
  Info, 
  ShieldCheck, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { apiRequest, API_BASE_URL } from '@/lib/api-base';

const WS_URL = API_BASE_URL.replace(/^http/, 'ws');

export default function PublicLivePage() {
  const [stream, setStream] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const socketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchActiveStream = async () => {
      try {
        const res = await apiRequest(`${API_BASE_URL}/api/live/active`);
        setStream(res.data);
        if (res.data) fetchHistory(res.data._id);
      } catch (err) {
        console.error('Error fetching stream:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveStream();
  }, []);

  const fetchHistory = async (streamId: string) => {
    try {
      const res = await apiRequest(`${API_BASE_URL}/api/live/${streamId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const joinChat = () => {
    if (!userName.trim()) return;
    setIsJoined(true);
    connectSocket();
  };

  const connectSocket = () => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ 
        type: 'live_chat_join', 
        chatId: stream._id 
      }));
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
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.send(JSON.stringify({
      type: 'live_chat_message',
      chatId: stream._id,
      userName,
      content: newMessage,
      isAdmin: false
    }));

    setNewMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#faf9f6]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-gold-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gold-100 rounded"></div>
      </div>
    </div>
  );

  if (!stream) return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mb-10 border border-gold-100">
        <Compass className="w-16 h-16 text-gold-400" />
      </div>
      <h1 className="text-4xl font-black italic tracking-tighter text-stone-800 mb-4">NO ACTIVE TRANSMISSION</h1>
      <p className="max-w-md text-stone-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed italic">The sacred broadcast channel is currently quiet.<br/>Stay connected for future spiritual ceremonies.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans selection:bg-gold-500/30">
      {/* Divine Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-stone-100 z-50 flex items-center justify-between px-8 md:px-12 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-stone-50">
             <div className="w-8 h-8 bg-gold-500 rounded-lg shadow-[0_5px_15px_rgba(244,196,48,0.4)]"></div>
          </div>
          <div>
            <h1 className="text-lg font-black uppercase italic tracking-tighter leading-none">Moksha Live</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gold-600 mt-1">Connecting Souls Globally</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden sm:flex items-center gap-4 px-5 py-2 bg-stone-50 rounded-2xl">
              <Users className="w-4 h-4 text-stone-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">2.4k Joining</span>
           </div>
           <button className="p-3 hover:bg-stone-50 rounded-2xl transition-all">
              <Share2 className="w-5 h-5 text-stone-400" />
           </button>
        </div>
      </header>

      {/* Main Sanctuary Layout */}
      <main className="pt-28 pb-12 px-6 md:px-12 max-w-[1700px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-12 h-[calc(100vh-100px)] lg:h-auto">
        
        {/* Left Column: Visual Transmission */}
        <div className="xl:col-span-8 flex flex-col space-y-8">
          <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gold-500/5 group border border-stone-100">
            {/* Live Badge Overlay */}
            <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
               <div className="px-5 py-2.5 bg-red-500 text-white rounded-2xl flex items-center gap-2.5 shadow-xl shadow-red-500/20">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Sacred Live</span>
               </div>
               <div className="px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-white flex items-center gap-2 group-hover:px-8 transition-all duration-500">
                  <PlayIcon className="w-3.5 h-3.5 text-stone-900 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 line-clamp-1">{stream.title}</span>
               </div>
            </div>

            {/* Video Canvas */}
            <div className="aspect-video bg-stone-50">
              {stream.streamType === 'mux' ? (
                <MuxPlayer
                  playbackId={stream.muxPlaybackId}
                  metadataVideoTitle={stream.title}
                  primaryColor="#f4c430"
                  className="w-full h-full"
                  autoPlay
                />
              ) : stream.streamType === 'youtube' ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${stream.youtubeVideoId}?autoplay=1&rel=0`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-20 text-center space-y-6">
                   <div className="w-24 h-24 bg-white rounded-full shadow-inner flex items-center justify-center border border-stone-50">
                     <ShieldCheck className="w-10 h-10 text-gold-300" />
                   </div>
                   <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">Checking Transmission Bridge...</p>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/20">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-3xl font-black italic tracking-tighter text-stone-800">{stream.title}</h2>
               <button className="flex items-center gap-3 px-6 py-3 bg-stone-50 hover:bg-gold-500 hover:text-white rounded-2xl transition-all border border-stone-100 text-stone-400 group">
                  <Heart className="w-5 h-5 group-hover:fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Compassion</span>
               </button>
             </div>
             <div className="flex gap-4 mb-8">
                {[1,2,3].map(i => <div key={i} className="px-4 py-1.5 bg-gold-50 text-gold-700 text-[8px] font-black uppercase tracking-tighter rounded-lg border border-gold-100 italic">#{['Spiritual', 'Divine', 'Moksha'][i-1]}</div>)}
             </div>
             <p className="text-stone-500 font-bold text-sm leading-relaxed max-w-4xl italic">
               "{stream.description}"
             </p>
          </div>
        </div>

        {/* Right Column: Communion (Chat) */}
        <div className="xl:col-span-4 flex flex-col h-full">
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-stone-50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-stone-900 rounded-2xl text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest italic">Sacred Communion</h3>
                    <p className="text-[8px] font-bold text-gold-600 uppercase tracking-widest mt-0.5">Real-time Blessings</p>
                  </div>
               </div>
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gold-100 flex items-center justify-center text-[8px] font-black text-gold-700 shadow-sm">
                       {String.fromCharCode(64 + i)}
                    </div>
                  ))}
               </div>
            </div>

            {/* Chat Flow */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {!isJoined ? (
                <div className="h-full flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center border border-stone-100">
                    <Users className="w-10 h-10 text-stone-200" />
                  </div>
                  <div className="text-center space-y-3">
                     <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Identify Yourself</h4>
                     <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-relaxed italic">Enter your identifier to join<br/>the global spiritual congregation.</p>
                  </div>
                  <div className="w-full space-y-4">
                    <input 
                      type="text" 
                      placeholder="Nitya Name / Identifier..." 
                      className="w-full p-6 bg-stone-50 border border-stone-100 rounded-3xl text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold-500 focus:bg-white transition-all text-stone-800 placeholder:text-stone-300 shadow-sm italic"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <button 
                      onClick={joinChat}
                      className="w-full bg-[#f4c430] hover:bg-stone-900 text-stone-900 hover:text-[#f4c430] p-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gold-500/20 active:scale-95 flex items-center justify-center gap-3 text-center"
                    >
                      Connect to Temple <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <div key={msg._id || i} className={`p-5 rounded-3xl border ${msg.isAdmin ? 'bg-gold-50/50 border-gold-200/30' : 'bg-stone-50/50 border-stone-100'} animate-in slide-in-from-right-4 duration-300`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest italic ${msg.isAdmin ? 'text-gold-600' : 'text-stone-500'}`}>
                          {msg.userName}
                        </span>
                        {msg.isAdmin && <ShieldCheck className="w-3 h-3 text-gold-500" />}
                      </div>
                      <p className="text-xs font-bold text-stone-700 leading-relaxed italic">{msg.message}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
            {isJoined && (
              <form onSubmit={sendMessage} className="p-8 border-t border-stone-50 shrink-0 bg-stone-50/30">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Whisper a blessing..." 
                    className="w-full p-6 bg-white border border-stone-100 rounded-[2rem] text-xs font-black uppercase tracking-widest focus:outline-none focus:border-gold-500 shadow-lg shadow-stone-200/40 transition-all italic text-stone-800"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-[#f4c430] text-stone-900 rounded-full hover:bg-stone-900 hover:text-[#f4c430] transition-all shadow-xl shadow-gold-500/10 active:scale-90"
                  >
                    <Send className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
   return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M18.8906 12.846L8.85961 18.5977C7.65342 19.3039 6 18.3582 6 16.7517V5.2483C6 3.64177 7.65342 2.6961 8.85961 3.40234L18.8906 9.15403C20.1565 10.0211 20.1565 11.9789 18.8906 12.846Z" fill="currentColor"/>
      </svg>
   )
}
