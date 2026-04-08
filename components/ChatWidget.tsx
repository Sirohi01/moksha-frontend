'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  User,
  Mail,
  Phone,
  Video,
  ShieldCheck,
  Loader2,
  ChevronRight,
  Headphones,
  Check,
  CheckCheck,
  Clock,
  Mic,
  Square
} from 'lucide-react';
import { authAPI, chatAPI } from '@/lib/api';

interface Message {
  _id?: string;
  sender: 'user' | 'admin' | 'system';
  content: string;
  type?: 'text' | 'image' | 'file' | 'audio';
  timestamp?: string;
  read?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'info' | 'verify' | 'chat'>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [callAlert, setCallAlert] = useState<{ type: string; sender: string } | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const connectSocket = useCallback((id: string) => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${window.location.hostname}:5000`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'chat_join', chatId: id }));
      ws.send(JSON.stringify({ type: 'chat_read', chatId: id, sender: 'user' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message' && data.chatId === id) {
          setMessages(prev => [...prev, data.message]);
          if (isOpen) {
            ws.send(JSON.stringify({ type: 'chat_read', chatId: id, sender: 'user' }));
          }
        }
        if (data.type === 'chat_read_update' && data.chatId === id) {
          setMessages(prev => prev.map(m => m.sender === 'user' ? { ...m, read: true } : m));
        }
        if (data.type === 'chat_call_response' && data.chatId === id) {
          if (data.message) {
            setMessages(prev => [...prev, data.message]);
          }
          setCallAlert(null);
        }
        if (data.type === 'chat_typing' && data.chatId === id) {
          if (data.sender === 'admin') setIsAgentTyping(data.isTyping);
        }
        if (data.type === 'chat_call_request' && data.chatId === id) {
          if (data.sender === 'admin') {
            setCallAlert({ type: data.callType, sender: 'Admin' });
            // Automatically close alert after a while
            setTimeout(() => setCallAlert(null), 15000);
          }
        }
      } catch (err) {
        console.error('[ChatWidget] Parse Error:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (id) setTimeout(() => connectSocket(id), 3000);
    };

    socketRef.current = ws;
  }, [isOpen]);

  useEffect(() => {
    if (step === 'chat' && chatId) {
      connectSocket(chatId);
    }
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [step, chatId, connectSocket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const requestCall = (type: 'audio' | 'video') => {
    if (!socketRef.current || !chatId) return;
    socketRef.current.send(JSON.stringify({
      type: 'chat_call_request',
      chatId,
      callType: type,
      sender: 'user'
    }));
    setMessages(prev => [...prev, {
      sender: 'system',
      content: `Requested an ${type} call.`
    }]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !chatId || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    socketRef.current.send(JSON.stringify({
      type: 'chat_message',
      chatId,
      sender: 'user',
      userName: name,
      content: inputMessage
    }));
    setInputMessage('');
    if (socketRef.current) {
        socketRef.current.send(JSON.stringify({ type: 'chat_typing', chatId, sender: 'user', isTyping: false }));
    }
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
        // Small delay to ensure last chunks are pushed
        setTimeout(async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            await handleAudioUpload(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        }, 200);
      };

      mediaRecorder.start(100); // Record in 100ms chunks for better reliability
      setIsRecording(true);
    } catch (err) {
      console.error('Recording Error:', err);
      setError('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    if (!chatId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'voice-note.webm');
      formData.append('chatId', chatId);
      formData.append('sender', 'user');

      const res = await chatAPI.uploadAudio(formData);
      if (res.success) {
        setMessages(prev => [...prev, res.data]);
        socketRef.current?.send(JSON.stringify({ 
          type: 'chat_message', 
          chatId, 
          message: res.data 
        }));
      }
    } catch (err) {
      console.error('Audio Upload Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (e: any) => {
    setInputMessage(e.target.value);
    if (!socketRef.current || !chatId) return;

    socketRef.current.send(JSON.stringify({ type: 'chat_typing', chatId, sender: 'user', isTyping: true }));
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.send(JSON.stringify({ type: 'chat_typing', chatId, sender: 'user', isTyping: false }));
    }, 3000);
  };

  return (
    <div className="fixed bottom-24 left-6 z-[1100] font-sans print:hidden">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-fadeIn">
          {/* Incoming Call Alert */}
          {callAlert && (
            <div className="absolute top-16 left-4 right-4 z-50 p-4 bg-navy-900 border border-gold-600 rounded-2xl shadow-2xl animate-bounce flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-600 rounded-xl flex items-center justify-center animate-pulse">
                  <Phone className="w-5 h-5 text-navy-950" />
                </div>
                <div>
                  <p className="text-[10px] text-gold-500 font-black uppercase">Incoming {callAlert.type} call</p>
                  <p className="text-xs text-white font-bold uppercase tracking-tighter">Support Agent Call Request....</p>
                </div>
              </div>
              <button onClick={() => setCallAlert(null)} className="text-white hover:text-red-500" aria-label="Dismiss call alert"><X className="w-5 h-5" /></button>
            </div>
          )}

          <div className="bg-[#f4c430] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white relative">
                <Headphones className="w-5 h-5" />
                {isConnected && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#f4c430]"></span>}
              </div>
              <div>
                <h1 className="text-white font-black text-xs uppercase tracking-widest italic">Live Support</h1>
                <p className="text-white/80 text-[9px] font-bold uppercase">{isConnected ? 'Online' : 'Reconnecting...'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {step === 'chat' && isConnected && (
                <>
                   <button onClick={() => requestCall('audio')} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Request audio call"><Phone className="w-4 h-4" /></button>
                   <button onClick={() => requestCall('video')} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Request video call"><Video className="w-4 h-4" /></button>
                </>
              )}
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-2" aria-label="Close support chat"><X className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-stone-50 custom-scrollbar">
            {step === 'intro' && (
              <div className="h-full flex flex-col justify-center text-center space-y-6">
                <h2 className="text-2xl font-black text-stone-900 uppercase italic tracking-tighter">Namaste!</h2>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest px-8">Verify identity to start secure chat.</p>
                <button onClick={() => setStep('info')} className="mx-auto px-8 py-3 bg-stone-900 text-[#f4c430] font-black text-[10px] uppercase tracking-widest rounded-xl">Start Chat</button>
              </div>
            )}

            {step === 'info' && (
              <div className="space-y-4">
                <input placeholder="NAME" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-stone-100 rounded-xl py-4 px-4 text-[10px] font-black uppercase outline-none" />
                <input placeholder="EMAIL" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-stone-100 rounded-xl py-4 px-4 text-[10px] font-black uppercase outline-none" />
                <input placeholder="PHONE" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white border border-stone-100 rounded-xl py-4 px-4 text-[10px] font-black uppercase outline-none" />
                <button onClick={async () => {
                  setLoading(true);
                  try {
                    await authAPI.sendOTP(email);
                    await authAPI.sendMobileOTP(phone);
                    setStep('verify');
                  } catch (e: any) { setError(e.message); }
                  setLoading(false);
                }} className="w-full py-4 bg-stone-900 text-[#f4c430] font-black text-[10px] uppercase rounded-xl">{loading ? 'Requesting...' : 'Get OTP'}</button>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-4">
                <input placeholder="EMAIL OTP" value={emailOtp} onChange={e => setEmailOtp(e.target.value)} className="w-full bg-white border border-stone-100 rounded-xl py-4 text-center font-black tracking-widest" />
                <input placeholder="MOBILE OTP" value={phoneOtp} onChange={e => setPhoneOtp(e.target.value)} className="w-full bg-white border border-stone-100 rounded-xl py-4 text-center font-black tracking-widest" />
                <button onClick={async () => {
                  setLoading(true);
                  try {
                    await authAPI.verifyOTP(email, emailOtp);
                    await authAPI.verifyMobileOTP(phone, phoneOtp);
                    const res = await chatAPI.initiateChat({ name, email, phone });
                    setChatId(res.data._id);
                    const hist = await chatAPI.getHistory(res.data._id);
                    setMessages(hist.data);
                    setStep('chat');
                  } catch (e: any) { setError(e.message); }
                  setLoading(false);
                }} className="w-full py-4 bg-[#f4c430] text-white font-black text-[10px] uppercase rounded-xl">Verify</button>
              </div>
            )}

            {step === 'chat' && (
              <div className="h-full flex flex-col space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[80%] flex flex-col">
                      <div className={`p-4 rounded-2xl text-[11px] font-bold shadow-sm ${msg.sender === 'user' ? 'bg-stone-900 text-[#f4c430] rounded-tr-none' : msg.sender === 'system' ? 'bg-[#f4c430]/10 text-[#f4c430] text-[9px] uppercase font-black tracking-tighter text-center py-2 border border-[#f4c430]/20' : 'bg-white text-stone-800 rounded-tl-none'
                        }`}>
                        {msg.type === 'audio' ? (
                          <div className="flex flex-col gap-3 min-w-[200px]">
                            <div className="flex items-center gap-2 opacity-50">
                                <Mic className="w-4 h-4" />
                                <p className="text-[10px] uppercase font-black tracking-widest">Voice Recording</p>
                            </div>
                            <a 
                                href={msg.content} 
                                target="_blank" 
                                className="bg-stone-800 text-[#f4c430] py-3 px-4 rounded-xl text-[9px] font-black uppercase text-center hover:bg-[#f4c430] hover:text-stone-900 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Headphones className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                Listen to Voice Note
                            </a>
                            <p className="text-[7px] opacity-30 text-center uppercase font-bold">Opens in new tab</p>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.sender === 'user' && (
                        <div className="flex justify-end mt-1 items-center gap-1">
                          {msg.read ? (
                            <CheckCheck className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Check className="w-3 h-3 text-stone-300" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/50 px-4 py-2 rounded-full text-[9px] font-black text-stone-400 uppercase tracking-widest animate-pulse border border-stone-100 italic">
                      Agent is typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {step === 'chat' && (
            <div className="p-4 bg-white border-t border-stone-100 flex items-center gap-2">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? "Stop recording voice note" : "Start recording voice note"}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-50 text-stone-400 hover:text-stone-900'
                }`}
              >
                {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input 
                placeholder={isRecording ? "RECORDING..." : "Type..."}
                value={inputMessage} 
                onChange={handleTyping} 
                disabled={isRecording}
                onKeyPress={e => e.key === 'Enter' && sendMessage()} 
                className="flex-1 bg-stone-50 rounded-xl py-3 px-4 text-xs font-bold outline-none" 
              />
              <button onClick={sendMessage} className="w-10 h-10 bg-stone-900 text-[#f4c430] rounded-xl flex items-center justify-center" aria-label="Send message"><Send className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        className="w-14 h-14 bg-stone-900 text-[#f4c430] rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
      >
        <div className="absolute inset-0 bg-[#f4c430] rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageCircle className="w-6 h-6 relative z-10" />}
      </button>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dcdcdc; border-radius: 10px; }
      `}</style>
    </div>
  );
}
