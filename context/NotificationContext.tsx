'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * MOKSHA NOTIFICATION ENGINE (PRO)
 * Real-time WebSocket connection + Persistent API synchronization.
 */

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'donation' | 'chat' | 'form' | 'activity' | 'security' | 'whatsapp';
    status: 'unread' | 'read';
    createdAt: string;
    link?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const WS_URL = API_URL.replace('http', 'ws');

    // 1. Fetch persistent notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const response = await fetch(`${API_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setNotifications(result.data);
                setUnreadCount(result.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        fetchNotifications();

        let socket: WebSocket | null = null;
        let reconnectInterval: any;

        const connectWS = () => {
            socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                socket?.send(JSON.stringify({ type: 'auth', userId: 'admin_dashboard', role: 'admin' }));
                if (reconnectInterval) clearInterval(reconnectInterval);
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'new_signal') {
                    const newNoti = data.notification;

                    setNotifications(prev => {
                        if (prev.some(n => n._id === newNoti._id)) return prev;
                        return [newNoti, ...prev];
                    });

                    setUnreadCount(prev => prev + 1);

                    if (newNoti.priority === 'critical' || newNoti.type === 'donation') {
                        new Audio('/sounds/alert.mp3').play().catch(() => { });
                    }
                }
            };

            socket.onclose = () => {
                console.log('🔌 WebSocket Disconnected. Reconnecting...');
                reconnectInterval = setInterval(connectWS, 5000);
            };
        };

        connectWS();

        return () => {
            if (socket) socket.close();
            if (reconnectInterval) clearInterval(reconnectInterval);
        };
    }, [WS_URL, fetchNotifications]);

    // 3. API Actions
    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.log('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/notifications/read-all`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.log('Failed to mark all as read');
        }
    };

    const clearAll = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/notifications/clear-all`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.log('Failed to clear notifications');
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};
