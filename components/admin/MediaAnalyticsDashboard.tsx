'use client';

import { useState, useEffect } from 'react';

interface MediaAnalytics {
  overview: {
    totalAssets: number;
    totalViews: number;
    totalDownloads: number;
    totalSize: number;
    avgEngagement: number;
    topCategory: string;
  };
  assetPerformance: Array<{
    _id: string;
    title: string;
    type: string;
    category: string;
    views: number;
    downloads: number;
    engagement: number;
    url: string;
    createdAt: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    views: number;
    downloads: number;
    avgEngagement: number;
  }>;
  typeBreakdown: Array<{
    type: string;
    count: number;
    views: number;
    downloads: number;
    totalSize: number;
  }>;
  timelineData: Array<{
    date: string;
    uploads: number;
    views: number;
    downloads: number;
  }>;
  downloadStats: Array<{
    asset: string;
    title: string;
    downloads: number;
    lastDownload: string;
  }>;
}

export default function MediaAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<MediaAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedCategory]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        timeRange,
        category: selectedCategory !== 'all' ? selectedCategory : ''
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/analytics?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch media analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'document': return '📄';
      case 'audio': return '🎵';
      case 'logo': return '🏷️';
      case 'brand_asset': return '🎨';
      default: return '📁';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">📊 Media Analytics</h2>
          <p className="text-gray-600">Track media performance and usage statistics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="gallery">Gallery</option>
            <option value="press">Press</option>
            <option value="social">Social Media</option>
            <option value="brand">Brand</option>
            <option value="events">Events</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalViews)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">⬇️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalDownloads)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">💾</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(analytics.overview.totalSize)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.avgEngagement.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">{analytics.overview.topCategory}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Type Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Asset Type Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.typeBreakdown.map((type, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTypeIcon(type.type)}</span>
                    <span className="font-medium text-gray-900 capitalize">{type.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">{type.count} assets</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{formatNumber(type.views)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Downloads</span>
                    <span className="font-medium">{formatNumber(type.downloads)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium">{formatFileSize(type.totalSize)}</span>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((type.views / analytics.overview.totalViews) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Category Performance</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Assets</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Downloads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Engagement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {analytics.categoryBreakdown.map((category, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{category.category}</td>
                    <td className="py-3 px-4 text-gray-600">{category.count}</td>
                    <td className="py-3 px-4 text-gray-600">{formatNumber(category.views)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatNumber(category.downloads)}</td>
                    <td className="py-3 px-4 text-gray-600">{category.avgEngagement.toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(category.avgEngagement, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Performing Assets */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Assets</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.assetPerformance.slice(0, 10).map((asset, index) => (
              <div key={asset._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{asset.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          {getTypeIcon(asset.type)} {asset.type}
                        </span>
                        <span className="text-xs text-gray-500">{asset.category}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="flex space-x-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{formatNumber(asset.views)}</div>
                          <div className="text-xs text-gray-500">views</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{formatNumber(asset.downloads)}</div>
                          <div className="text-xs text-gray-500">downloads</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-600">{asset.engagement.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">engagement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Statistics */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Downloads</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Asset</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Downloads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Download</th>
                </tr>
              </thead>
              <tbody>
                {analytics.downloadStats.slice(0, 10).map((stat, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{stat.title}</td>
                    <td className="py-3 px-4 text-gray-600">{stat.downloads}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(stat.lastDownload).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Timeline Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Usage Timeline</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <span className="text-4xl mb-2 block">📈</span>
              <p className="text-gray-500">Timeline chart visualization</p>
              <p className="text-sm text-gray-400">Shows uploads, views, and downloads over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}