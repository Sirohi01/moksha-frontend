'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  databaseQueryTime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  cacheHitRate: number;
  activeConnections: number;
}

interface OptimizationTask {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  lastRun?: string;
}

export default function PerformanceOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    databaseQueryTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    diskUsage: 0,
    cacheHitRate: 0,
    activeConnections: 0
  });
  const [optimizationTasks, setOptimizationTasks] = useState<OptimizationTask[]>([
    {
      id: '1',
      name: 'Database Index Optimization',
      description: 'Analyze and optimize database indexes for better query performance',
      status: 'pending',
      progress: 0,
      estimatedTime: 300
    },
    {
      id: '2',
      name: 'Image Compression',
      description: 'Compress and optimize images to reduce load times',
      status: 'pending',
      progress: 0,
      estimatedTime: 180
    },
    {
      id: '3',
      name: 'Cache Optimization',
      description: 'Clear expired cache and optimize cache strategies',
      status: 'pending',
      progress: 0,
      estimatedTime: 120
    },
    {
      id: '4',
      name: 'Bundle Size Optimization',
      description: 'Analyze and reduce JavaScript bundle sizes',
      status: 'pending',
      progress: 0,
      estimatedTime: 240
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('metrics');

  useEffect(() => {
    fetchPerformanceMetrics();
    const interval = setInterval(fetchPerformanceMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceMetrics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/performance/metrics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.data);
      } else {
        // Mock data for demo
        setMetrics({
          pageLoadTime: Math.random() * 2000 + 500,
          apiResponseTime: Math.random() * 200 + 50,
          databaseQueryTime: Math.random() * 100 + 20,
          memoryUsage: Math.random() * 30 + 40,
          cpuUsage: Math.random() * 20 + 10,
          diskUsage: Math.random() * 20 + 60,
          cacheHitRate: Math.random() * 20 + 75,
          activeConnections: Math.floor(Math.random() * 50 + 10)
        });
      }
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const runOptimizationTask = async (taskId: string) => {
    const task = optimizationTasks.find(t => t.id === taskId);
    if (!task || task.status === 'running') return;

    // Update task status to running
    setOptimizationTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'running', progress: 0 } : t
    ));

    // Simulate progress
    const progressInterval = setInterval(() => {
      setOptimizationTasks(prev => prev.map(t => {
        if (t.id === taskId && t.status === 'running') {
          const newProgress = Math.min(t.progress + Math.random() * 15 + 5, 100);
          return { ...t, progress: newProgress };
        }
        return t;
      }));
    }, 500);

    // Simulate completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setOptimizationTasks(prev => prev.map(t => 
        t.id === taskId ? { 
          ...t, 
          status: 'completed', 
          progress: 100, 
          lastRun: new Date().toISOString() 
        } : t
      ));
    }, task.estimatedTime * 10); // Reduced time for demo
  };

  const getMetricColor = (value: number, type: string) => {
    switch (type) {
      case 'time':
        return value > 1000 ? 'text-red-600' : value > 500 ? 'text-yellow-600' : 'text-green-600';
      case 'percentage':
        return value > 80 ? 'text-red-600' : value > 60 ? 'text-yellow-600' : 'text-green-600';
      case 'cache':
        return value < 70 ? 'text-red-600' : value < 85 ? 'text-yellow-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '⏳';
      case 'failed': return '❌';
      default: return '⏸️';
    }
  };
  const tabs = [
    { id: 'metrics', label: 'Performance Metrics', icon: '📊' },
    { id: 'optimization', label: 'Optimization Tasks', icon: '🚀' },
    { id: 'caching', label: 'Cache Management', icon: '💾' },
    { id: 'monitoring', label: 'Real-time Monitoring', icon: '📈' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">⚡ Performance Optimization</h2>
        <p className="text-gray-600 mt-1">Monitor and optimize system performance</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Performance Metrics */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Page Load Time</p>
                    <p className={`text-2xl font-bold ${getMetricColor(metrics.pageLoadTime, 'time')}`}>
                      {metrics.pageLoadTime.toFixed(0)}ms
                    </p>
                  </div>
                  <span className="text-blue-500 text-2xl">⏱️</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">API Response</p>
                    <p className={`text-2xl font-bold ${getMetricColor(metrics.apiResponseTime, 'time')}`}>
                      {metrics.apiResponseTime.toFixed(0)}ms
                    </p>
                  </div>
                  <span className="text-green-500 text-2xl">🚀</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Memory Usage</p>
                    <p className={`text-2xl font-bold ${getMetricColor(metrics.memoryUsage, 'percentage')}`}>
                      {metrics.memoryUsage.toFixed(1)}%
                    </p>
                  </div>
                  <span className="text-purple-500 text-2xl">🧠</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Cache Hit Rate</p>
                    <p className={`text-2xl font-bold ${getMetricColor(metrics.cacheHitRate, 'cache')}`}>
                      {metrics.cacheHitRate.toFixed(1)}%
                    </p>
                  </div>
                  <span className="text-orange-500 text-2xl">💾</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">System Resources</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{metrics.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${metrics.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Disk Usage</span>
                      <span>{metrics.diskUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${metrics.diskUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Database Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Query Time</span>
                    <span className="text-sm font-medium">{metrics.databaseQueryTime.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Connections</span>
                    <span className="text-sm font-medium">{metrics.activeConnections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Connection Pool</span>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tasks */}
        {activeTab === 'optimization' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Optimization Tasks</h3>
              <button
                onClick={() => optimizationTasks.forEach(task => {
                  if (task.status === 'pending') runOptimizationTask(task.id);
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🚀 Run All Tasks
              </button>
            </div>

            <div className="space-y-3">
              {optimizationTasks.map(task => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getStatusIcon(task.status)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{task.name}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {task.status === 'pending' && (
                        <button
                          onClick={() => runOptimizationTask(task.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                        >
                          Run
                        </button>
                      )}
                    </div>
                  </div>

                  {task.status === 'running' && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{task.progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Estimated time: {task.estimatedTime}s</span>
                    {task.lastRun && (
                      <span>Last run: {new Date(task.lastRun).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cache Management */}
        {activeTab === 'caching' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-800 font-medium mb-2">Application Cache</h3>
                <p className="text-2xl font-bold text-blue-600">2.4 GB</p>
                <p className="text-sm text-blue-600">Hit rate: {metrics.cacheHitRate.toFixed(1)}%</p>
                <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                  Clear Cache
                </button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-800 font-medium mb-2">Database Cache</h3>
                <p className="text-2xl font-bold text-green-600">1.8 GB</p>
                <p className="text-sm text-green-600">Query cache: 89.2%</p>
                <button className="mt-3 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                  Optimize
                </button>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-purple-800 font-medium mb-2">CDN Cache</h3>
                <p className="text-2xl font-bold text-purple-600">5.2 GB</p>
                <p className="text-sm text-purple-600">Edge locations: 12</p>
                <button className="mt-3 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                  Purge CDN
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-medium mb-2">⚠️ Cache Recommendations</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Consider increasing cache TTL for static assets</li>
                <li>• Database query cache could be optimized</li>
                <li>• Enable compression for API responses</li>
                <li>• Implement browser caching headers</li>
              </ul>
            </div>
          </div>
        )}

        {/* Real-time Monitoring */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Real-time Performance Chart</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📊</span>
                  <p className="text-gray-600">Performance chart would be displayed here</p>
                  <p className="text-sm text-gray-500">Integration with monitoring service required</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">🚨 Performance Alerts</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <span className="text-sm text-red-800">High memory usage detected</span>
                    <span className="text-xs text-red-600">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md">
                    <span className="text-sm text-yellow-800">Slow database queries</span>
                    <span className="text-xs text-yellow-600">5 min ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">⚡ Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    🔄 Restart Application
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    🗑️ Clear All Caches
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    📊 Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}