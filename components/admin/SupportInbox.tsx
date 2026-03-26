'use client';

import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '@/lib/api';
import { 
  Search, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Video,
  Clock, 
  MessageSquare,
  Shield,
  Check,
  CheckCheck,
  MoreVertical,
  X,
  Loader2,
  AlertTriangle,
  Mic,
  Square,
  Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSession {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  status: 'active' | 'closed' | 'archived';
  unreadCount: { admin: number; user: number };
  lastMessageAt: string;
  updatedAt: string;
}

interface Message {
  _id?: string;
  sender: 'user' | 'admin' | 'system';
  content: string;
  type?: 'text' | 'image' | 'file' | 'audio';
  timestamp?: string;
  read?: boolean;
}

export default function SupportInbox() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [callAlert, setCallAlert] = useState<{ type: string; chatId: string; userName: string } | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch initial sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await chatAPI.getAllChats();
        setSessions(response.data);
      } catch (err) {
        console.error('Error fetching chat sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000); 
    return () => clearInterval(interval);
  }, []);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const fetchHistory = async () => {
        try {
          const response = await chatAPI.getHistory(selectedChat._id);
          setMessages(response.data);
          await chatAPI.markAsRead(selectedChat._id);
        } catch (err) {
          console.error('Error fetching chat history:', err);
        }
      };
      fetchHistory();
    }
  }, [selectedChat]);

  // Handle Socket Connection when chat is selected
  useEffect(() => {
    if (selectedChat && (!socket || socket.readyState >= 2)) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${window.location.hostname}:5000`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'chat_join', chatId: selectedChat._id, isAdmin: true }));
        ws.send(JSON.stringify({ type: 'chat_read', chatId: selectedChat._id, sender: 'admin' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat_message' && data.chatId === selectedChat._id) {
            setMessages(prev => [...prev, data.message]);
            if (data.message.sender === 'user') {
                ws.send(JSON.stringify({ type: 'chat_read', chatId: selectedChat._id, sender: 'admin' }));
            }
          }
          if (data.type === 'chat_read_update' && data.chatId === selectedChat._id) {
            setMessages(prev => prev.map(m => m.sender === 'admin' ? { ...m, read: true } : m));
          }
          if (data.type === 'chat_typing' && data.chatId === selectedChat._id) {
            if (data.sender === 'user') setIsUserTyping(data.isTyping);
          }
          if (data.type === 'chat_call_response' && data.chatId === selectedChat._id) {
             if (data.message) {
                 setMessages(prev => [...prev, data.message]);
             }
             setCallAlert(null);
          }
          if (data.type === 'chat_call_request' && data.chatId === selectedChat._id) {
             if (data.sender === 'user') {
                 setCallAlert({ type: data.callType, chatId: data.chatId, userName: selectedChat.userName });
                 setTimeout(() => setCallAlert(null), 15000);
             }
          }
        } catch (err) {
          console.error('[AdminChat] Parse Error:', err);
        }
      };

      ws.onclose = () => {
        if (selectedChat) setTimeout(() => setSocket(null), 3000); // Trigger reconnect
      };

      setSocket(ws);
      return () => ws.close();
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initiateCall = (type: 'audio' | 'video') => {
    if (!socket || !selectedChat) return;
    socket.send(JSON.stringify({
        type: 'chat_call_request',
        chatId: selectedChat._id,
        callType: type,
        sender: 'admin'
    }));
    setMessages(prev => [...prev, { 
        sender: 'system', 
        content: `Requested an ${type} call.` 
    }]);
  };

  const filteredSessions = sessions.filter(s => 
    (s.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !selectedChat) return;
    socket.send(JSON.stringify({
      type: 'chat_message',
      chatId: selectedChat._id,
      sender: 'admin',
      content: inputMessage
    }));
    setInputMessage('');
    socket.send(JSON.stringify({ type: 'chat_typing', chatId: selectedChat._id, sender: 'admin', isTyping: false }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setTimeout(async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            await handleAudioUpload(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        }, 200);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording Error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    if (!selectedChat || !socket) return;
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'voice-note.webm');
      formData.append('chatId', selectedChat._id);
      formData.append('sender', 'admin');
      
      const adminStr = localStorage.getItem('admin');
      if (adminStr) {
          const admin = JSON.parse(adminStr);
          if (admin._id) formData.append('adminId', admin._id);
      }

      const res = await chatAPI.uploadAudio(formData);
      if (res.success) {
        setMessages(prev => [...prev, res.data]);
        socket.send(JSON.stringify({ 
          type: 'chat_message', 
          chatId: selectedChat._id, 
          message: res.data 
        }));
      }
    } catch (err) {
      console.error('Audio Upload Error:', err);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (!socket || !selectedChat) return;

    socket.send(JSON.stringify({ type: 'chat_typing', chatId: selectedChat._id, sender: 'admin', isTyping: true }));
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
        socket?.send(JSON.stringify({ type: 'chat_typing', chatId: selectedChat._id, sender: 'admin', isTyping: false }));
    }, 3000);
  };

  // Filter out the welcome message for the admin
  const displayMessages = messages.filter(msg => 
    !(msg.sender === 'system' && msg.content.toUpperCase().includes('WELCOME'))
  );

  return (
    <div className="flex bg-white rounded-3xl overflow-hidden shadow-2xl border border-navy-100/50 font-sans relative h-[800px] max-h-[calc(100vh-12rem)] animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* Call Alert Overlay */}
      {callAlert && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[2000] bg-navy-950 border border-gold-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl border-t-2 border-t-gold-500 animate-in zoom-in duration-300 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 backdrop-blur-2xl mx-4">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(244,196,48,0.3)]">
                    <Phone className="w-8 h-8 text-navy-950" />
                </div>
                <div>
                    <h4 className="text-gold-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-1">Secure Call Invitation</h4>
                    <p className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter italic">{callAlert.userName}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        socket?.send(JSON.stringify({ type: 'chat_call_response', chatId: callAlert.chatId, status: 'accepted', sender: 'admin' }));
                        setCallAlert(null);
                    }}
                    className="px-8 py-4 bg-gold-500 text-navy-950 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold-400 transition-all shadow-lg active:scale-95"
                >Accept</button>
                <button 
                    onClick={() => {
                        socket?.send(JSON.stringify({ type: 'chat_call_response', chatId: callAlert.chatId, status: 'rejected', sender: 'admin' }));
                        setCallAlert(null);
                    }}
                    className="px-8 py-4 bg-white/5 text-gray-400 border border-white/10 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                >Decline</button>
            </div>
        </div>
      )}

      {/* Session List */}
      <div className={cn(
          "w-full lg:w-[380px] border-r border-navy-50 overflow-hidden flex flex-col bg-navy-50/20 transition-all",
          selectedChat ? "hidden lg:flex" : "flex"
      )}>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-[9px] font-bold text-gold-600 uppercase tracking-[0.4em]">Active Channels</p>
                <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tighter">Support Hub</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 group-focus-within:text-gold-600 transition-colors" />
            <input 
                placeholder="SEARCH TRANSMISSIONS..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full bg-white border border-navy-100 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:ring-4 ring-gold-500/10 focus:border-gold-500/30 transition-all shadow-sm" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8 space-y-3">
          {loading ? (
             <div className="p-20 flex flex-col items-center gap-4">
                 <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
                 <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest animate-pulse">Synchronizing Node Data...</p>
             </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-10 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto border border-navy-50 text-navy-200">
                    <Search className="w-8 h-8" />
                </div>
                <p className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">No Active Nodes Found</p>
            </div>
          ) : filteredSessions.map((session) => (
            <button
              key={session._id}
              onClick={() => setSelectedChat(session)}
              className={cn(
                  "w-full group flex items-center gap-5 p-4 rounded-3xl transition-all relative overflow-hidden border-2",
                  selectedChat?._id === session._id 
                    ? 'bg-navy-950 border-navy-950 shadow-xl shadow-navy-900/10' 
                    : 'bg-white border-transparent hover:border-navy-100 hover:shadow-lg'
              )}
            >
              <div className="relative flex-shrink-0">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transform group-active:scale-95 transition-all shadow-sm",
                    selectedChat?._id === session._id 
                        ? 'bg-gold-500 text-navy-950' 
                        : 'bg-navy-50 text-navy-400 group-hover:bg-navy-900 group-hover:text-gold-400'
                )}>
                  {session.userName?.[0]?.toUpperCase()}
                </div>
                {session.unreadCount.admin > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-400 text-navy-950 text-[9px] font-black flex items-center justify-center rounded-xl border-2 border-white shadow-lg animate-bounce">
                        {session.unreadCount.admin}
                    </span>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className={cn(
                    "text-[11px] sm:text-xs font-black truncate uppercase tracking-tight",
                    selectedChat?._id === session._id ? 'text-white' : 'text-navy-900'
                )}>
                    {session.userName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                    <div className={cn(
                        "w-1 h-1 rounded-full",
                        selectedChat?._id === session._id ? 'bg-gold-500/50' : 'bg-emerald-500'
                    )}></div>
                    <p className={cn(
                        "text-[9px] font-bold uppercase tracking-widest opacity-60 truncate",
                        selectedChat?._id === session._id ? 'text-gold-200' : 'text-navy-400'
                    )}>
                        {session.email.split('@')[0]}
                    </p>
                </div>
              </div>
              {selectedChat?._id === session._id && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold-500 rounded-l-full shadow-[0_0_15px_rgba(244,196,48,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
          "flex-1 flex flex-col bg-white",
          !selectedChat ? "hidden lg:flex items-center justify-center" : "flex"
      )}>
        {selectedChat ? (
          <>
            <div className="px-6 py-6 sm:px-10 border-b border-navy-50 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <button 
                    onClick={() => setSelectedChat(null)}
                    className="lg:hidden p-3 text-navy-400 hover:text-navy-950 bg-navy-50 rounded-2xl mr-2"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-navy-950 rounded-2xl sm:rounded-3xl flex items-center justify-center text-gold-500 shadow-2xl border border-white/5 relative group cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gold-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <User className="w-6 h-6 sm:w-8 sm:h-8 relative z-10 transform group-hover:scale-110 transition-transform" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-2xl font-black text-navy-950 uppercase italic tracking-tighter leading-none truncate">{selectedChat.userName}</h3>
                      <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[8px] font-black uppercase tracking-[0.1em]">Active Node</span>
                      </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
                       <div className="flex items-center gap-2 group cursor-pointer">
                           <div className="w-5 h-5 rounded-lg bg-navy-50 flex items-center justify-center group-hover:bg-gold-100 transition-colors">
                               <Mail className="w-2.5 h-2.5 text-navy-400 group-hover:text-gold-600" />
                           </div>
                           <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">{selectedChat.email}</span>
                       </div>
                       <div className="flex items-center gap-2 group cursor-pointer">
                           <div className="w-5 h-5 rounded-lg bg-navy-50 flex items-center justify-center group-hover:bg-gold-100 transition-colors">
                               <Phone className="w-2.5 h-2.5 text-navy-400 group-hover:text-gold-600" />
                           </div>
                           <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">{selectedChat.phone}</span>
                       </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => initiateCall('audio')} 
                  title="Initialize Audio Uplink"
                  className="p-4 bg-navy-50 text-navy-900 rounded-2xl hover:bg-navy-950 hover:text-gold-400 transition-all shadow-sm border border-navy-100 group active:scale-95"
                >
                    <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
                <div className="w-px h-10 bg-navy-100 mx-1"></div>
                <button 
                    onClick={() => setSelectedChat(null)} 
                    className="hidden lg:flex p-4 text-navy-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                >
                    <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar bg-stone-50/30">
              {displayMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : msg.sender === 'system' ? 'items-center' : 'items-start'} group/msg animate-in fade-in duration-500 slide-in-from-bottom-2`}>
                  <div className={cn(
                      "max-w-[85%] sm:max-w-[75%] p-5 sm:p-7 rounded-3xl text-[12px] sm:text-sm font-bold shadow-sm transition-all relative",
                      msg.sender === 'admin' 
                        ? 'bg-navy-950 text-white rounded-tr-none shadow-xl shadow-navy-900/10' 
                        : msg.sender === 'system' 
                        ? 'bg-gold-100/50 text-gold-700 text-[9px] font-black uppercase px-8 py-3 rounded-full border border-gold-200' 
                        : 'bg-white border border-navy-100 rounded-tl-none text-navy-950'
                  )}>
                    {msg.type === 'audio' ? (
                      <div className="flex flex-col gap-4 min-w-[220px] sm:min-w-[280px]">
                        <div className="flex items-center justify-between opacity-60">
                          <div className="flex items-center gap-2">
                              <Mic className="w-4 h-4" />
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Voice Transmission</p>
                          </div>
                          <Clock className="w-3 h-3" />
                        </div>
                        <a 
                          href={msg.content} 
                          target="_blank" 
                          className={cn(
                              "flex items-center justify-center gap-4 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 group/play border",
                               msg.sender === 'admin' 
                                ? 'bg-gold-500 text-navy-950 border-gold-400 hover:bg-white hover:text-gold-600 hover:border-white' 
                                : 'bg-navy-950 text-gold-400 border-white/5 hover:bg-gold-500 hover:text-navy-950 hover:border-gold-400'
                          )}
                        >
                          <Headphones className="w-5 h-5 group-hover/play:scale-110 transition-transform" />
                          Initialize Connection
                        </a>
                      </div>
                    ) : (
                      <p className="leading-relaxed tracking-tight whitespace-pre-wrap">{msg.content}</p>
                    )}
                    
                    {/* Timestamp Bubble - visible on hover or mobile */}
                    <div className={cn(
                        "absolute -bottom-6 flex items-center gap-1.5 opacity-0 group-hover/msg:opacity-100 transition-opacity",
                        msg.sender === 'admin' ? "right-2" : "left-2"
                    )}>
                        <p className="text-[8px] font-bold text-navy-300 uppercase tracking-widest">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'NEW CHANNEL'}</p>
                    </div>
                  </div>
                  
                  {msg.sender === 'admin' && (
                    <div className="flex items-center gap-2 mt-2 px-1">
                        <span className="text-[8px] font-black text-navy-300 uppercase tracking-[0.2em] italic">Delivered</span>
                        <div className="flex items-center">
                            {msg.read ? (
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-500 drop-shadow-sm" />
                            ) : (
                                <Check className="w-3.5 h-3.5 text-navy-100" />
                            )}
                        </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isUserTyping && (
                <div className="flex justify-start animate-in slide-in-from-left-4 duration-500">
                  <div className="bg-white border border-navy-100 px-6 py-4 rounded-3xl text-[9px] font-black text-navy-500 uppercase tracking-[0.3em] flex items-center gap-4 shadow-sm">
                    <div className="flex gap-1">
                        <span className="w-1 h-1 bg-gold-500 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-gold-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-gold-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    Remote User is Synchronizing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 sm:p-10 border-t border-navy-50 bg-white/50 backdrop-blur-md">
              <div className="relative flex items-center gap-4 sm:gap-6 max-w-5xl mx-auto">
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  title={isRecording ? "Terminate Recording" : "Initialize Audio Link"}
                  className={cn(
                      "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 shadow-lg border-2",
                      isRecording 
                        ? 'bg-rose-600 text-white border-rose-500 animate-pulse scale-110' 
                        : 'bg-white text-navy-400 hover:bg-navy-950 hover:text-gold-500 border-navy-50 hover:border-navy-950'
                  )}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div className="flex-1 relative flex items-center group">
                    <textarea 
                      placeholder={isRecording ? "CAPTURING AUDIO TRANSMISSION..." : "ENCRYPT MESSAGE..."}
                      rows={1}
                      value={inputMessage}
                      disabled={isRecording}
                      onChange={handleTyping}
                      onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                      className="w-full bg-navy-50/30 border border-navy-100 rounded-3xl py-5 px-10 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-4 ring-gold-500/10 focus:bg-white focus:border-gold-500/40 transition-all resize-none shadow-inner"
                    />
                    <div className="absolute right-4 sm:right-6 flex items-center gap-3">
                        <button 
                            onClick={sendMessage} 
                            disabled={isRecording || !inputMessage.trim()} 
                            className="w-12 h-12 bg-navy-950 text-gold-500 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-gold-500 hover:text-navy-950 transition-all active:scale-90 disabled:opacity-20 disabled:grayscale group/send border border-white/5"
                        >
                            <Send className="w-5 h-5 group-hover/send:translate-x-1 group-active:translate-y-[-2px] transition-transform" />
                        </button>
                    </div>
                </div>
              </div>
              <p className="mt-4 text-center text-[8px] font-black text-navy-200 uppercase tracking-[0.5em]">Secure Administrative Channel • End-to-End Encryption Enabled</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10 sm:p-20 max-w-md animate-in fade-in zoom-in duration-1000">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-navy-50 rounded-[3rem] flex items-center justify-center mb-10 border border-navy-100 relative group">
                  <div className="absolute inset-0 bg-gold-200 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gold-600 relative z-10 animate-pulse" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter text-navy-950 mb-4 px-4">Administrative Service Interface</h3>
              <div className="w-20 h-1 bg-gold-500 rounded-full mb-6"></div>
              <p className="text-[10px] font-black text-navy-400 uppercase tracking-[0.4em] leading-relaxed">System in high-readiness state. Select an active communication node from the directory to initialize uplink.</p>
              
              <div className="mt-12 grid grid-cols-2 gap-4 w-full opacity-60">
                  <div className="p-4 bg-navy-50 rounded-2xl border border-navy-100">
                      <Clock className="w-4 h-4 text-navy-300 mx-auto mb-2" />
                      <p className="text-[7px] font-black uppercase text-navy-400 tracking-widest">Real-time Sync</p>
                  </div>
                  <div className="p-4 bg-navy-50 rounded-2xl border border-navy-100">
                      <Shield className="w-4 h-4 text-navy-300 mx-auto mb-2" />
                      <p className="text-[7px] font-black uppercase text-navy-400 tracking-widest">Encrypted Port</p>
                  </div>
              </div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f4c430;
        }
      `}</style>
    </div>
  );
}
