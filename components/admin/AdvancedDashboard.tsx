'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  totalUsers: number;
  totalReports: number;
  totalDonations: number;
  totalVolunteers: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    user: string;
  }>;
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: string;
    responseTime: number;
    errorRate: number;
  };
  performanceMetrics: {
    pageLoadTime: number;
    apiResponseTime: number;
    databaseQueries: number;
    memoryUsage: number;
  };
}

interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'metric';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  visible: boolean;
}

export default function AdvancedDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [customizing, setCustomizing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const defaultWidgets: Widget[] = [
    { id: 'stats-overview', title: 'Statistics Overview', type: 'stat', size: 'large', position: { x: 0, y: 0 }, visible: true },
    { id: 'recent-activity', title: 'Recent Activity', type: 'list', size: 'medium', position: { x: 1, y: 0 }, visible: true },
    { id: 'system-health', title: 'System Health', type: 'metric', size: 'medium', position: { x: 0, y: 1 }, visible: true },
    { id: 'performance', title: 'Performance Metrics', type: 'chart', size: 'medium', position: { x: 1, y: 1 }, visible: true },
    { id: 'quick-actions', title: 'Quick Actions', type: 'list', size: 'small', position: { x: 2, y: 0 }, visible: true },
    { id: 'notifications', title: 'Notifications', type: 'list', size: 'small', position: { x: 2, y: 1 }, visible: true }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
    loadWidgetConfiguration();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchNotifications();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/advanced`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications?limit=5`, {
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
    }
  };

  const loadWidgetConfiguration = () => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(defaultWidgets);
    }
  };

  const saveWidgetConfiguration = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(newWidgets));
  };

  const toggleWidget = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    saveWidgetConfiguration(updatedWidgets);
  };

  const resetWidgets = () => {
    saveWidgetConfiguration(defaultWidgets);
  };

  const getSystemHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_login': return '👤';
      case 'report_created': return '📝';
      case 'donation_received': return '💰';
      case 'volunteer_registered': return '🤝';
      case 'system_alert': return '⚠️';
      default: return '📋';
    }
  };

  const formatUptime = (uptime: string) => {
    const days = Math.floor(parseFloat(uptime) / (24 * 60 * 60));
    const hours = Math.floor((parseFloat(uptime) % (24 * 60 * 60)) / (60 * 60));
    return `${days}d ${hours}h`;
  };

  if (loading && !stats) {
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
          <h1 className="text-2xl font-bold text-gray-900">📊 Advanced Dashboard</h1>
          <p className="text-gray-600">Real-time system overview and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setCustomizing(!customizing)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              customizing 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {customizing ? 'Done' : 'Customize'}
          </button>
          <button
            onClick={resetWidgets}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset Layout
          </button>
        </div>
      </div>

      {/* Customization Panel */}
      {customizing && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {widgets.map((widget) => (
              <label key={widget.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widget.visible}
                  onChange={() => toggleWidget(widget.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{widget.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistics Overview Widget */}
        {widgets.find(w => w.id === 'stats-overview')?.visible && stats && (
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Statistics Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalReports}</div>
                <div className="text-sm text-gray-500">Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalDonations}</div>
                <div className="text-sm text-gray-500">Donations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalVolunteers}</div>
                <div className="text-sm text-gray-500">Volunteers</div>
              </div>
            </div>
          </div>
        )}

        {/* System Health Widget */}
        {widgets.find(w => w.id === 'system-health')?.visible && stats && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🏥 System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSystemHealthColor(stats.systemHealth.status)}`}>
                  {stats.systemHealth.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium">{formatUptime(stats.systemHealth.uptime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium">{stats.systemHealth.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-medium">{stats.systemHealth.errorRate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics Widget */}
        {widgets.find(w => w.id === 'performance')?.visible && stats && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">⚡ Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Page Load Time</span>
                <span className="text-sm font-medium">{stats.performanceMetrics.pageLoadTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response</span>
                <span className="text-sm font-medium">{stats.performanceMetrics.apiResponseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">DB Queries</span>
                <span className="text-sm font-medium">{stats.performanceMetrics.databaseQueries}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium">{stats.performanceMetrics.memoryUsage}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Widget */}
        {widgets.find(w => w.id === 'recent-activity')?.visible && stats && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🕒 Recent Activity</h3>
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Widget */}
        {widgets.find(w => w.id === 'quick-actions')?.visible && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href = '/admin/gallery'}
                className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gold-50 hover:text-gold-900 rounded-md transition-colors font-bold"
              >
                🖼️ Gallery Management
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                📝 Create New Report
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                👥 Add New User
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                📊 Generate Report
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                🔧 System Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                📤 Export Data
              </button>
            </div>
          </div>
        )}

        {/* Notifications Widget */}
        {widgets.find(w => w.id === 'notifications')?.visible && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🔔 Notifications</h3>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No new notifications</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}