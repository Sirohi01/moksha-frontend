'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Bell, 
    X, 
    CheckCheck, 
    Trash2, 
    MessageCircle, 
    Heart, 
    FileText, 
    Newspaper, 
    Shield, 
    Zap,
    ExternalLink,
    Play
} from 'lucide-react';
import { useNotifications, Notification } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNotificationHub() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'donation': return <Heart className="text-rose-500" size={16} />;
            case 'chat': return <MessageCircle className="text-sky-500" size={16} />;
            case 'form': return <FileText className="text-amber-500" size={16} />;
            case 'activity': return <Zap className="text-emerald-500" size={16} />;
            case 'security': return <Shield className="text-red-500" size={16} />;
            case 'whatsapp': return <Play className="text-green-500 rotate-90" size={16} fill="currentColor" />;
            default: return <Bell className="text-stone-400" size={16} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-3 rounded-2xl transition-all duration-300 group",
                    isOpen ? "bg-gold-500 text-navy-950 scale-95" : "bg-white text-stone-400 hover:text-navy-950 hover:bg-stone-50 border border-stone-200/60"
                )}
            >
                <Bell size={22} className={cn(unreadCount > 0 && "animate-pulse")} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-[420px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-stone-100 overflow-hidden z-[1000] animate-in fade-in zoom-in duration-300 origin-top-right">
                    {/* Header */}
                    <div className="bg-white px-6 py-5 border-b border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-600">Moksha Dashboard</span>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-stone-100 rounded-lg transition-colors text-stone-400 hover:text-stone-900">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight leading-none">Notifications</h2>
                                <p className="text-[10px] text-stone-400 font-bold uppercase mt-1 tracking-wider">{unreadCount} New signals detected</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={markAllAsRead}
                                    className="w-10 h-10 flex items-center justify-center bg-stone-50 hover:bg-gold-50 text-stone-400 hover:text-gold-600 rounded-xl transition-all border border-stone-100"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={16} />
                                </button>
                                <button 
                                    onClick={clearAll}
                                    className="w-10 h-10 flex items-center justify-center bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-all border border-stone-100"
                                    title="Clear all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-stone-50/10">
                        {notifications.filter(n => n.status === 'unread').length > 0 ? (
                            <div className="divide-y divide-stone-100">
                                {notifications.filter(n => n.status === 'unread').map((noti) => (
                                    <div 
                                        key={noti._id}
                                        className={cn(
                                            "p-6 hover:bg-stone-50/50 transition-all group relative cursor-pointer",
                                            noti.status === 'unread' ? "bg-white" : "bg-stone-50/30 opacity-70"
                                        )}
                                        onClick={() => markAsRead(noti._id)}
                                    >
                                        {noti.status === 'unread' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500"></div>
                                        )}
                                        <div className="flex gap-4">
                                            <div className="shrink-0 w-11 h-11 bg-stone-100 rounded-xl flex items-center justify-center border border-stone-200/50 group-hover:scale-105 transition-transform shadow-sm">
                                                {getTypeIcon(noti.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gold-600/70">{noti.type}</span>
                                                    <span className="text-[9px] font-bold text-stone-400 uppercase">
                                                        {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <h4 className="text-[15px] font-black text-stone-900 uppercase tracking-tight leading-tight mb-1 truncate">{noti.title}</h4>
                                                <p className="text-xs font-medium text-stone-500 leading-normal line-clamp-2">{noti.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                                    <Bell size={32} />
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-300">Silence in the Hub</h4>
                                <p className="text-[9px] font-bold text-stone-200 uppercase mt-2 tracking-widest">NO ACTIVE SIGNALS DETECTED</p>
                            </div>
                        )}
                    </div>


                </div>
            )}
        </div>
    );
}
