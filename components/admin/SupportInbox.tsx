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

  return (
    <div className="flex bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-navy-50 font-sans relative h-[800px] max-h-[calc(100vh-12rem)]">
      
      {/* Call Alert Overlay */}
      {callAlert && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[2000] bg-navy-950 border border-gold-600/30 rounded-[2rem] p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-fadeIn flex flex-col sm:flex-row items-center gap-6 sm:gap-12 backdrop-blur-xl mx-4">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gold-600 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(184,135,33,0.4)]">
                    <Phone className="w-8 h-8 text-navy-950" />
                </div>
                <div>
                    <h4 className="text-gold-500 font-black uppercase text-[10px] tracking-[0.2em] mb-1">Incoming {callAlert.type}</h4>
                    <p className="text-white text-xl sm:text-2xl font-black uppercase italic tracking-tighter">{callAlert.userName}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        socket?.send(JSON.stringify({ type: 'chat_call_response', chatId: callAlert.chatId, status: 'accepted', sender: 'admin' }));
                        setCallAlert(null);
                    }}
                    className="px-6 sm:px-8 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                >Establish</button>
                <button 
                    onClick={() => {
                        socket?.send(JSON.stringify({ type: 'chat_call_response', chatId: callAlert.chatId, status: 'rejected', sender: 'admin' }));
                        setCallAlert(null);
                    }}
                    className="px-6 sm:px-8 py-4 bg-white/10 text-rose-500 border border-rose-500/30 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                >Terminate</button>
            </div>
        </div>
      )}

      {/* Session List */}
      <div className={cn(
          "w-full lg:w-[400px] border-r border-navy-50 overflow-hidden flex flex-col bg-[#fcfcfc] transition-all",
          selectedChat ? "hidden lg:flex" : "flex"
      )}>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-[9px] font-black text-gold-600 uppercase tracking-[0.3em]">Support Nodes</p>
                <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tighter">Live Traffic</h2>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input 
                placeholder="FILTER NODES..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full bg-navy-50/30 border border-navy-50 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:ring-4 ring-gold-600/10 transition-all" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8 space-y-3">
          {loading ? (
             <div className="p-20 flex flex-col items-center gap-4">
                 <Loader2 className="w-10 h-10 animate-spin text-gold-600" />
                 <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest animate-pulse">Syncing Streams...</p>
             </div>
          ) : filteredSessions.map((session) => (
            <button
              key={session._id}
              onClick={() => setSelectedChat(session)}
              className={cn(
                  "w-full group flex items-center gap-5 p-4 sm:p-6 rounded-[2rem] transition-all relative overflow-hidden",
                  selectedChat?._id === session._id 
                    ? 'bg-navy-950 text-white shadow-2xl shadow-navy-200 border-2 border-gold-600' 
                    : 'bg-white border-2 border-transparent hover:border-navy-50 hover:bg-navy-50/20'
              )}
            >
              <div className="relative flex-shrink-0">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transform group-hover:-rotate-6 transition-transform",
                    selectedChat?._id === session._id ? 'bg-gold-600 text-navy-950 shadow-lg' : 'bg-navy-50 text-navy-400 group-hover:bg-navy-950 group-hover:text-gold-500'
                )}>
                  {session.userName?.[0]?.toUpperCase()}
                </div>
                {session.unreadCount.admin > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-600 text-navy-950 text-[9px] font-black flex items-center justify-center rounded-xl border-2 border-white shadow-lg animate-bounce">
                        {session.unreadCount.admin}
                    </span>
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className={cn(
                    "text-xs sm:text-sm font-black truncate uppercase tracking-tighter",
                    selectedChat?._id === session._id ? 'text-white' : 'text-navy-950'
                )}>
                    {session.userName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                    <div className={cn(
                        "w-1 h-1 rounded-full",
                        selectedChat?._id === session._id ? 'bg-gold-500/40' : 'bg-emerald-500'
                    )}></div>
                    <p className={cn(
                        "text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60",
                        selectedChat?._id === session._id ? 'text-gold-500' : 'text-navy-400'
                    )}>
                        {session.email.split('@')[0]}
                    </p>
                </div>
              </div>
              {selectedChat?._id === session._id && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-gold-600 rounded-l-full shadow-[0_0_15px_rgba(184,135,33,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
          "flex-1 flex flex-col bg-white",
          !selectedChat ? "hidden lg:flex" : "flex"
      )}>
        {selectedChat ? (
          <>
            <div className="p-4 sm:p-8 border-b border-navy-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-3 sm:gap-6">
                <button 
                    onClick={() => setSelectedChat(null)}
                    className="lg:hidden p-2 text-navy-400 hover:text-navy-950 bg-navy-50 rounded-xl mr-2"
                >
                    <X className="w-5 h-5 rotate-90" />
                </button>
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-navy-950 rounded-xl sm:rounded-2xl flex items-center justify-center text-gold-500 shadow-xl border border-white/10 flex-shrink-0">
                    <User className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-xl font-black text-navy-950 uppercase italic tracking-tighter leading-none truncate">{selectedChat.userName}</h3>
                  <div className="flex gap-2 sm:gap-4 text-[7px] sm:text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1 sm:mt-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-navy-50 rounded-lg w-fit border border-navy-100/50 truncate">
                      <span className="truncate max-w-[80px] sm:max-w-none">{selectedChat.email}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 self-center hidden xs:block"></span>
                      <span className="hidden xs:block">{selectedChat.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={() => initiateCall('audio')} className="p-3 sm:p-4 bg-[#fcfcfc] text-navy-950 rounded-xl sm:rounded-2xl hover:bg-navy-950 hover:text-gold-500 transition-all shadow-sm border border-navy-50 group">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                </button>
                <div className="w-px h-6 sm:h-8 bg-navy-50 mx-1"></div>
                <button onClick={() => setSelectedChat(null)} className="hidden lg:block p-4 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 custom-scrollbar bg-[#fcfcfc]/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : msg.sender === 'system' ? 'items-center' : 'items-start'} group/msg animate-fadeIn`}>
                  <div className={cn(
                      "max-w-[85%] sm:max-w-[70%] p-4 sm:p-6 rounded-[1.2rem] sm:rounded-[1.5rem] text-[11px] sm:text-sm font-bold shadow-sm transition-all",
                      msg.sender === 'admin' 
                        ? 'bg-navy-950 text-white rounded-tr-none' 
                        : msg.sender === 'system' 
                        ? 'bg-gold-600/5 text-gold-600 text-[8px] sm:text-[10px] font-black uppercase px-6 sm:px-8 py-2 sm:py-3 rounded-full border border-gold-600/20' 
                        : 'bg-white border border-navy-100 rounded-tl-none text-navy-950'
                  )}>
                    {msg.type === 'audio' ? (
                      <div className="flex flex-col gap-3 sm:gap-4 min-w-[200px] sm:min-w-[240px]">
                        <div className="flex items-center gap-3 opacity-60">
                          <Mic className="w-4 h-4" />
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] italic">Encrypted Transmission</p>
                        </div>
                        <a 
                          href={msg.content} 
                          target="_blank" 
                          className={cn(
                              "flex items-center justify-center gap-3 sm:gap-4 py-4 sm:py-5 rounded-[1rem] sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 group/play",
                               msg.sender === 'admin' 
                                ? 'bg-gold-600 text-navy-950 hover:bg-white hover:text-gold-600' 
                                : 'bg-navy-950 text-gold-500 hover:bg-gold-600 hover:text-navy-950'
                          )}
                        >
                          <Headphones className="w-4 h-4 sm:w-5 sm:h-5 group-hover/play:animate-bounce" />
                          Initialize
                        </a>
                      </div>
                    ) : (
                      <p className="leading-relaxed tracking-tight">{msg.content}</p>
                    )}
                  </div>
                  {msg.sender === 'admin' && (
                    <div className="flex items-center gap-1.5 mt-2 px-2">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">{msg.type === 'audio' ? 'TRANS' : 'ACK'}</p>
                        {msg.read ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Check className="w-3 h-3 text-gray-200" />}
                    </div>
                  )}
                </div>
              ))}
              {isUserTyping && (
                <div className="flex justify-start">
                  <div className="bg-navy-100/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[8px] font-black text-navy-400 uppercase tracking-[0.2em] animate-pulse border border-navy-50/50 italic flex items-center gap-2 sm:gap-3">
                    <span className="w-1 h-1 bg-navy-400 rounded-full animate-bounce"></span>
                    <span className="hidden sm:inline">Remote Intelligence</span> typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 sm:p-10 border-t border-navy-50 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
              <div className="relative flex items-center gap-3 sm:gap-6">
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                      "w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center transition-all flex-shrink-0",
                      isRecording 
                        ? 'bg-rose-600 text-white animate-pulse shadow-lg rotate-45' 
                        : 'bg-navy-50 text-navy-400 hover:bg-navy-950 hover:text-gold-500 border border-navy-50'
                  )}
                >
                  {isRecording ? <Square className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
                <div className="flex-1 relative flex items-center">
                    <textarea 
                      placeholder={isRecording ? "RECORDING..." : "MESSAGE..."}
                      rows={1}
                      value={inputMessage}
                      disabled={isRecording}
                      onChange={handleTyping}
                      onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                      className="w-full bg-[#fcfcfc] border border-navy-50 rounded-xl sm:rounded-[1.5rem] py-4 sm:py-6 px-6 sm:px-10 text-[10px] sm:text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-gold-600/5 transition-all resize-none shadow-inner"
                    />
                    <div className="absolute right-4 sm:right-6 flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:block w-px h-6 bg-navy-100 mx-1"></div>
                        <button onClick={sendMessage} disabled={isRecording} className="w-10 h-10 sm:w-12 sm:h-12 bg-navy-950 text-gold-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl hover:bg-gold-600 hover:text-navy-950 transition-all active:scale-90 group/send">
                            <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover/send:translate-x-1" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 sm:p-20 opacity-40">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-navy-50 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mb-6 sm:mb-8 border border-navy-100">
                  <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gold-600" />
              </div>
              <h3 className="text-xl sm:text-3xl font-black uppercase italic tracking-tighter text-navy-950 mb-2">Command Center standby</h3>
              <p className="text-[8px] sm:text-[10px] font-black text-navy-400 uppercase tracking-[0.4em]">Awaiting secure node connection</p>
          </div>
        )}
      </div>
    </div>
  );
}
