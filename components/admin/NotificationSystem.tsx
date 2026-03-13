'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  expiresAt?: string;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    system: boolean;
    security: boolean;
    reports: boolean;
    users: boolean;
    donations: boolean;
  };
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    categories: {
      system: true,
      security: true,
      reports: true,
      users: true,
      donations: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
    
    // Set up real-time notifications
    const interval = setInterval(fetchNotifications, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      });

      if (response.ok) {
        setPreferences(newPreferences);
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔔 Notifications</h1>
          <p className="text-gray-600">
            Manage your notifications and preferences
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ⚙️ Preferences
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Methods */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Methods</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={(e) => updatePreferences({ ...preferences, email: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">📧 Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.push}
                    onChange={(e) => updatePreferences({ ...preferences, push: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">🔔 Push Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.sms}
                    onChange={(e) => updatePreferences({ ...preferences, sms: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">📱 SMS Alerts</span>
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2">
                {Object.entries(preferences.categories).map(([category, enabled]) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => updatePreferences({
                        ...preferences,
                        categories: { ...preferences.categories, [category]: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'read' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 p-4 rounded-lg ${getNotificationColor(notification.type)} ${
                !notification.read ? 'shadow-md' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      {notification.expiresAt && (
                        <span>Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {notification.actionUrl && notification.actionText && (
                      <div className="mt-2">
                        <a
                          href={notification.actionUrl}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {notification.actionText} →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🔔</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}