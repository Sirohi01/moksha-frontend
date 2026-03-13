'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  overview: {
    totalPosts: number;
    totalEngagement: number;
    totalReach: number;
    totalImpressions: number;
    engagementRate: number;
    topPerformingPlatform: string;
  };
  platformBreakdown: Array<{
    platform: string;
    posts: number;
    engagement: number;
    reach: number;
    engagementRate: number;
  }>;
  contentPerformance: Array<{
    _id: string;
    title: string;
    content: string;
    platforms: string[];
    totalEngagement: number;
    engagementRate: number;
    createdAt: string;
  }>;
  timelineData: Array<{
    date: string;
    posts: number;
    engagement: number;
    reach: number;
  }>;
  hashtagPerformance: Array<{
    hashtag: string;
    usage: number;
    avgEngagement: number;
  }>;
}

export default function SocialMediaAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '📱' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'youtube', name: 'YouTube', icon: '📺' }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedPlatform]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        timeRange,
        platform: selectedPlatform !== 'all' ? selectedPlatform : ''
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social-media/analytics?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch social media analytics:', error);
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

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData ? platformData.icon : '📱';
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
          <h2 className="text-xl font-bold text-gray-900">📊 Social Media Analytics</h2>
          <p className="text-gray-600">Track performance across all social media platforms</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>{platform.name}</option>
            ))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalEngagement)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalReach)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Impressions</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalImpressions)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.engagementRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Platform Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.platformBreakdown.map((platform, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getPlatformIcon(platform.platform)}</span>
                    <span className="font-medium text-gray-900 capitalize">{platform.platform}</span>
                  </div>
                  <span className="text-sm text-gray-500">{platform.posts} posts</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">{formatNumber(platform.engagement)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reach</span>
                    <span className="font-medium">{formatNumber(platform.reach)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className="font-medium">{platform.engagementRate.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Engagement Rate Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(platform.engagementRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Content</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.contentPerformance.slice(0, 5).map((content, index) => (
              <div key={content._id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {content.title || 'Untitled Post'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content.content}</p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex space-x-1">
                          {content.platforms.map((platform, idx) => (
                            <span key={idx} className="text-sm">{getPlatformIcon(platform)}</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatNumber(content.totalEngagement)}
                      </div>
                      <div className="text-xs text-gray-500">engagement</div>
                      <div className="text-xs text-blue-600 font-medium">
                        {content.engagementRate.toFixed(1)}% rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hashtag Performance */}
      {analytics.hashtagPerformance.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Hashtags</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.hashtagPerformance.slice(0, 9).map((hashtag, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">#{hashtag.hashtag}</div>
                    <div className="text-sm text-gray-500">{hashtag.usage} uses</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">
                      {formatNumber(hashtag.avgEngagement)}
                    </div>
                    <div className="text-xs text-gray-500">avg engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Performance Timeline</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <span className="text-4xl mb-2 block">📈</span>
              <p className="text-gray-500">Timeline chart visualization</p>
              <p className="text-sm text-gray-400">Shows engagement trends over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}