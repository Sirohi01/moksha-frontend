'use client';

import { useState, useEffect } from 'react';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface HealthMetrics {
  api: {
    status: 'healthy' | 'warning' | 'error';
    responseTime: number;
    uptime: number;
  };
  database: {
    status: 'healthy' | 'warning' | 'error';
    connections: number;
    queryTime: number;
  };
  server: {
    status: 'healthy' | 'warning' | 'error';
    cpu: number;
    memory: number;
    disk: number;
  };
  services: {
    email: 'healthy' | 'warning' | 'error';
    cloudinary: 'healthy' | 'warning' | 'error';
    websocket: 'healthy' | 'warning' | 'error';
  };
}

export default function SystemHealthMonitor() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchHealthMetrics();
    const interval = setInterval(fetchHealthMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      const response = await fetch('/api/admin/health', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-stone-800">System Health</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-stone-200 rounded w-3/4"></div>
          <div className="h-4 bg-stone-200 rounded w-1/2"></div>
          <div className="h-4 bg-stone-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-stone-800">System Health</h3>
        </div>
        <p className="text-red-600">Unable to fetch system health metrics</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-stone-800">System Health</h3>
        </div>
        <div className="text-sm text-stone-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* API Health */}
        <div className={`p-4 rounded-lg border ${getStatusColor(metrics.api.status)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span className="font-medium">API</span>
            </div>
            {getStatusIcon(metrics.api.status)}
          </div>
          <div className="text-sm space-y-1">
            <div>Response: {metrics.api.responseTime}ms</div>
            <div>Uptime: {metrics.api.uptime.toFixed(1)}%</div>
          </div>
        </div>

        {/* Database Health */}
        <div className={`p-4 rounded-lg border ${getStatusColor(metrics.database.status)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="font-medium">Database</span>
            </div>
            {getStatusIcon(metrics.database.status)}
          </div>
          <div className="text-sm space-y-1">
            <div>Connections: {metrics.database.connections}</div>
            <div>Query Time: {metrics.database.queryTime}ms</div>
          </div>
        </div>

        {/* Server Health */}
        <div className={`p-4 rounded-lg border ${getStatusColor(metrics.server.status)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span className="font-medium">Server</span>
            </div>
            {getStatusIcon(metrics.server.status)}
          </div>
          <div className="text-sm space-y-1">
            <div>CPU: {metrics.server.cpu}%</div>
            <div>Memory: {metrics.server.memory}%</div>
            <div>Disk: {metrics.server.disk}%</div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="mt-6 pt-4 border-t border-stone-200">
        <h4 className="font-medium text-stone-800 mb-3">Services</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Email Service</span>
            {getStatusIcon(metrics.services.email)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Cloudinary</span>
            {getStatusIcon(metrics.services.cloudinary)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">WebSocket</span>
            {getStatusIcon(metrics.services.websocket)}
          </div>
        </div>
      </div>
    </div>
  );
}