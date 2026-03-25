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
  AlertTriangle
} from 'lucide-react';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  };

  return (
    <div className="flex h-[750px] bg-white dark:bg-navy-950 rounded-3xl overflow-hidden shadow-2xl border border-navy-100 dark:border-navy-900 font-sans relative">
      
      {/* Call Alert Overlay */}
      {callAlert && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[2000] bg-navy-900 border-2 border-gold-600 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,196,48,0.3)] animate-bounce flex items-center gap-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gold-600 rounded-2xl flex items-center justify-center animate-pulse">
                    <Phone className="w-8 h-8 text-navy-950" />
                </div>
                <div>
                    <h4 className="text-gold-500 font-black uppercase text-[10px] tracking-widest">Incoming {callAlert.type} call</h4>
                    <p className="text-white text-xl font-black uppercase italic tracking-tighter">{callAlert.userName}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => {
                        socket?.send(JSON.stringify({ type: 'chat_call_response', chatId: callAlert.chatId, status: 'accepted', sender: 'admin' }));
                        setCallAlert(null);
                    }}
                    className="px-6 py-3 bg-emerald-600 text-white font-black text-xs uppercase rounded-xl hover:bg-emerald-700 transition-colors"
                >Accept</button>
                <button 
                    onClick={() => {
                        socket?.send(JSON.stringify({ type: 'chat_call_response', chatId: callAlert.chatId, status: 'rejected', sender: 'admin' }));
                        setCallAlert(null);
                    }}
                    className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase rounded-xl hover:bg-red-700 transition-colors"
                >Reject</button>
            </div>
        </div>
      )}

      {/* Session List */}
      <div className="w-[380px] border-r border-navy-50 overflow-hidden flex flex-col bg-stone-50/50">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-navy-950 uppercase italic tracking-tighter flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-600" />
                Live Nodes
            </h2>
            <span className="px-2 py-1 bg-navy-100 rounded text-[9px] font-black text-navy-600 uppercase">{sessions.length} Active</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="FILTER DATA..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white border border-navy-100 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 ring-gold-600/20" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {loading ? (
             <div className="p-10 text-center flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold-600" /></div>
          ) : filteredSessions.map((session) => (
            <button
              key={session._id}
              onClick={() => setSelectedChat(session)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all border-2 ${
                selectedChat?._id === session._id ? 'bg-navy-900 border-gold-600 shadow-xl' : 'bg-white border-transparent'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                    selectedChat?._id === session._id ? 'bg-gold-600 text-navy-900' : 'bg-navy-100 text-navy-600'
                }`}>
                  {session.userName?.[0]}
                </div>
                {session.unreadCount.admin > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">{session.unreadCount.admin}</span>}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`text-sm font-black truncate uppercase tracking-tighter ${selectedChat?._id === session._id ? 'text-white' : 'text-navy-950'}`}>{session.userName}</h4>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedChat?._id === session._id ? 'text-gold-500/60' : 'text-gray-400'}`}>{session.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            <div className="p-6 border-b border-navy-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy-100 rounded-2xl flex items-center justify-center text-navy-600"><User className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-md font-black text-navy-950 uppercase italic tracking-tighter">{selectedChat.userName}</h3>
                  <div className="flex gap-4 text-[9px] text-gray-400 font-black uppercase"><span>{selectedChat.email}</span><span>{selectedChat.phone}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => initiateCall('audio')} className="p-3 bg-stone-50 text-navy-950 rounded-2xl hover:bg-gold-600 hover:text-navy-950 transition-all shadow-sm border border-navy-50"><Phone className="w-4 h-4" /></button>
                <button onClick={() => initiateCall('video')} className="p-3 bg-stone-50 text-navy-950 rounded-2xl hover:bg-gold-600 hover:text-navy-950 transition-all shadow-sm border border-navy-50"><Video className="w-4 h-4" /></button>
                <button onClick={() => setSelectedChat(null)} className="p-3 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-stone-50/10">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : msg.sender === 'system' ? 'items-center' : 'items-start'}`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl text-xs font-bold ${
                    msg.sender === 'admin' ? 'bg-navy-900 text-white rounded-tr-none' : msg.sender === 'system' ? 'bg-gold-600/10 text-gold-600 text-[10px] font-black uppercase px-6 py-2 rounded-full border border-gold-600/20' : 'bg-white border border-navy-50 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.sender === 'admin' && (
                    <div className="flex gap-1 mt-1">
                        {msg.read ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Check className="w-3 h-3 text-stone-200" />}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-8 border-t border-navy-50">
              <div className="relative flex items-center gap-4">
                <textarea 
                  placeholder="TRANSMIT MESSAGE..."
                  rows={2}
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  className="flex-1 bg-stone-50 border-none rounded-3xl py-5 px-8 text-[10px] font-black uppercase outline-none focus:ring-4 ring-gold-600/10 transition-all resize-none"
                />
                <button onClick={sendMessage} className="w-14 h-14 bg-navy-900 text-gold-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95"><Send className="w-6 h-6" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale"><MessageSquare className="w-20 h-20 text-gold-600" /><h3 className="text-xl font-black uppercase italic tracking-tighter">Support Station Active</h3></div>
        )}
      </div>
    </div>
  );
}
