'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, Search, Globe, Users } from 'lucide-react';

interface SEOAnalyticsProps {
  pageId?: string;
  timeRange?: string;
}

interface AnalyticsData {
  overview: {
    totalPageViews: number;
    organicTraffic: number;
    avgPosition: number;
    clickThroughRate: number;
  };
  trends: {
    pageViews: Array<{ date: string; value: number }>;
    organicTraffic: Array<{ date: string; value: number }>;
    rankings: Array<{ date: string; value: number }>;
  };
  keywords: Array<{
    keyword: string;
    position: number;
    clicks: number;
    impressions: number;
    ctr: number;
  }>;
  topPages: Array<{
    url: string;
    pageViews: number;
    organicTraffic: number;
    bounceRate: number;
  }>;
}

export default function SEOAnalytics({ pageId, timeRange = '30d' }: SEOAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('pageViews');

  useEffect(() => {
    fetchAnalytics();
  }, [pageId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Mock data for now - replace with real API call
      const mockData: AnalyticsData = {
        overview: {
          totalPageViews: 15420,
          organicTraffic: 8930,
          avgPosition: 12.5,
          clickThroughRate: 3.2
        },
        trends: {
          pageViews: generateTrendData(30, 400, 600),
          organicTraffic: generateTrendData(30, 200, 400),
          rankings: generateTrendData(30, 8, 20)
        },
        keywords: [
          { keyword: 'Moksha Sewa', position: 3, clicks: 245, impressions: 8900, ctr: 2.75 },
          { keyword: 'last rites services', position: 8, clicks: 156, impressions: 5600, ctr: 2.79 },
          { keyword: 'funeral services india', position: 12, clicks: 89, impressions: 3400, ctr: 2.62 },
          { keyword: 'dignified funeral', position: 15, clicks: 67, impressions: 2800, ctr: 2.39 },
          { keyword: 'unclaimed bodies', position: 18, clicks: 45, impressions: 2100, ctr: 2.14 }
        ],
        topPages: [
          { url: '/', pageViews: 5420, organicTraffic: 3200, bounceRate: 45.2 },
          { url: '/about', pageViews: 3890, organicTraffic: 2100, bounceRate: 38.7 },
          { url: '/services', pageViews: 2340, organicTraffic: 1800, bounceRate: 42.1 },
          { url: '/volunteer', pageViews: 1890, organicTraffic: 1200, bounceRate: 35.6 },
          { url: '/donate', pageViews: 1880, organicTraffic: 630, bounceRate: 52.3 }
        ]
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrendData = (days: number, min: number, max: number) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * (max - min) + min)
      });
    }
    return data;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;

    return {
      value: Math.abs(change).toFixed(1),
      isPositive,
      icon: isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
      className: isPositive ? 'text-green-600' : 'text-red-600'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.totalPageViews)}</p>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Organic Traffic</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.organicTraffic)}</p>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Globe className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Position</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.avgPosition}</p>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+2.1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Click Through Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.clickThroughRate}%</p>
              <div className="flex items-center mt-1 text-sm text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>-0.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <div className="flex space-x-2">
            {[
              { key: 'pageViews', label: 'Page Views' },
              { key: 'organicTraffic', label: 'Organic Traffic' },
              { key: 'rankings', label: 'Rankings' }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${selectedMetric === metric.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Chart Visualization */}
        <div className="h-64 flex items-end space-x-1">
          {data.trends[selectedMetric as keyof typeof data.trends]?.map((point, index) => {
            const maxValue = Math.max(...data.trends[selectedMetric as keyof typeof data.trends].map(p => p.value));
            const height = (point.value / maxValue) * 100;

            return (
              <div
                key={index}
                className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                style={{ height: `${height}%` }}
                title={`${point.date}: ${point.value}`}
              />
            );
          })}
        </div>
      </div>

      {/* Keywords Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Keywords</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Keyword</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Position</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Impressions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">CTR</th>
              </tr>
            </thead>
            <tbody>
              {data.keywords.map((keyword, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{keyword.keyword}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${keyword.position <= 3 ? 'bg-green-100 text-green-800' :
                        keyword.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      #{keyword.position}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{keyword.clicks}</td>
                  <td className="py-3 px-4 text-gray-600">{formatNumber(keyword.impressions)}</td>
                  <td className="py-3 px-4 text-gray-600">{keyword.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Pages</h3>
        <div className="space-y-4">
          {data.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{page.url}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatNumber(page.pageViews)} views • {formatNumber(page.organicTraffic)} organic • {page.bounceRate}% bounce rate
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">{formatNumber(page.pageViews)}</div>
                  <div className="text-gray-500">Views</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{formatNumber(page.organicTraffic)}</div>
                  <div className="text-gray-500">Organic</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}