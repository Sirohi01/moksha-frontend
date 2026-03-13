"use client";
import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, X, Bell, Filter } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  source: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
}

export default function PriorityAlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('active');

  useEffect(() => {
    fetchAlerts();
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'admin_alert') {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: data.priority,
          title: data.title,
          message: data.message,
          source: data.data?.source || 'System',
          timestamp: new Date().toISOString(),
          status: 'active'
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/admin/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const updateAlertStatus = async (alertId: string, status: Alert['status']) => {
    try {
      const response = await fetch(`/api/admin/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, status } : alert
        ));
      }
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  };

  const getPriorityColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <Bell className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesPriority = filter === 'all' || alert.type === filter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const criticalCount = alerts.filter(a => a.type === 'critical' && a.status === 'active').length;
  const highCount = alerts.filter(a => a.type === 'high' && a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Priority Alert System</h2>
          <p className="text-gray-600">Monitor and manage system alerts in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-600">{criticalCount} Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-orange-600">{highCount} High</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Alerts</h3>
            <p className="text-gray-500">All systems are running smoothly!</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`bg-white p-4 rounded-lg border-l-4 shadow-sm ${
              alert.type === 'critical' ? 'border-l-red-500' :
              alert.type === 'high' ? 'border-l-orange-500' :
              alert.type === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getPriorityIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(alert.type)}`}>
                        {alert.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Source: {alert.source}</span>
                      <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.assignedTo && <span>Assigned: {alert.assignedTo}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {alert.status === 'active' && (
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'acknowledged')}
                      className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                    >
                      Acknowledge
                    </button>
                  )}
                  
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}