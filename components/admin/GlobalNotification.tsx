'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Phone, X, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CallAlert {
  title: string;
  message: string;
  chatId: string;
  type?: 'audio' | 'video';
}

export default function GlobalNotification({ user }: { user: any }) {
  const [alert, setAlert] = useState<CallAlert | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const connect = useCallback(() => {
    if (!user || (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${window.location.hostname}:5000`;
    
    console.log('[GlobalSocket] Connecting...');
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('[GlobalSocket] Connected as admin');
      ws.send(JSON.stringify({ 
        type: 'auth', 
        userId: user.id, 
        role: user.role, 
        name: user.name 
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'admin_call_alert') {
          setAlert({
            title: data.title,
            message: data.message,
            chatId: data.chatId,
            type: data.callType || 'audio'
          });
        }
        if (data.type === 'chat_call_response' && data.action === 'clear_alert') {
           setAlert(prev => prev?.chatId === data.chatId ? null : prev);
        }
      } catch (err) {
        console.error('[GlobalSocket] Msg Error:', err);
      }
    };

    ws.onclose = () => {
      console.log('[GlobalSocket] Closed. Retrying in 5s...');
      setTimeout(connect, 5000);
    };

    ws.onerror = (e) => console.error('[GlobalSocket] Error:', e);
  }, [user]);

  useEffect(() => {
    connect();
    return () => {
        if (socketRef.current) socketRef.current.close();
    };
  }, [connect]);

  // Auto clear alert
  useEffect(() => {
    if (alert) {
        const timer = setTimeout(() => setAlert(null), 30000);
        return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleResponse = (status: 'accepted' | 'rejected') => {
    console.log(`[GlobalSocket] Responding: ${status} for ${alert?.chatId}`);
    
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        console.warn('[GlobalSocket] Socket not open, retrying action...');
        // Try to connect and then alert user? Or just show error
        return;
    }

    if (!alert) return;
    
    socketRef.current.send(JSON.stringify({
        type: 'chat_call_response',
        chatId: alert.chatId,
        status: status,
        sender: 'admin'
    }));

    if (status === 'accepted') {
        router.push(`/admin/support?chat=${alert.chatId}`);
    }
    setAlert(null);
  };

  if (!alert) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[5000] w-96 animate-in slide-in-from-right-10 duration-500 pointer-events-auto">
      <div className="bg-navy-950 border-2 border-gold-600 rounded-3xl p-6 shadow-[0_0_60px_rgba(244,196,48,0.4)] relative overflow-hidden ring-4 ring-gold-600/10">
        <div className="absolute top-0 left-0 w-2 h-full bg-gold-600 animate-pulse"></div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gold-600 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-gold-600/50">
            {alert.type === 'video' ? <Video className="w-8 h-8 text-navy-950" /> : <Phone className="w-8 h-8 text-navy-950" />}
          </div>
          <div className="flex-1">
            <h4 className="text-gold-500 font-black uppercase text-[10px] tracking-widest mb-1">{alert.title}</h4>
            <p className="text-white text-md font-bold uppercase tracking-tighter leading-none mb-4">{alert.message}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleResponse('accepted')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase py-4 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer relative z-[6000]"
              >
                Accept Call
              </button>
              <button 
                onClick={() => handleResponse('rejected')}
                className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase rounded-xl transition-all active:scale-95 cursor-pointer relative z-[6000]"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
        <button onClick={() => setAlert(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
