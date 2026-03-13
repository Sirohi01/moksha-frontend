"use client";
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, Search, Globe, BarChart3 } from 'lucide-react';

interface SEOMetrics {
  organicTraffic: {
    current: number;
    previous: number;
    change: number;
  };
  keywordRankings: {
    topKeywords: Array<{
      keyword: string;
      position: number;
      change: number;
      searchVolume: number;
    }>;
  };
  pagePerformance: {
    topPages: Array<{
      url: string;
      views: number;
      clicks: number;
      impressions: number;
      ctr: number;
    }>;
  };
  technicalSEO: {
    pageSpeed: number;
    mobileUsability: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
  };
}

export default function SEOPerformanceTracker() {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    organicTraffic: { current: 0, previous: 0, change: 0 },
    keywordRankings: { topKeywords: [] },
    pagePerformance: { topPages: [] },
    technicalSEO: {
      pageSpeed: 0,
      mobileUsability: 0,
      coreWebVitals: { lcp: 0, fid: 0, cls: 0 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchSEOMetrics();
  }, [timeRange]);

  const fetchSEOMetrics = async () => {
    try {
      const response = await fetch(`/api/admin/seo/metrics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch SEO metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">SEO Performance Tracker</h2>
          <p className="text-gray-600">Monitor your website's search engine performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Organic Traffic</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.organicTraffic.current.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className={`mt-4 flex items-center ${getChangeColor(metrics.organicTraffic.change)}`}>
            {getChangeIcon(metrics.organicTraffic.change)}
            <span className="text-sm ml-1">
              {metrics.organicTraffic.change > 0 ? '+' : ''}{metrics.organicTraffic.change}% vs previous period
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Speed Score</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.technicalSEO.pageSpeed}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreColor(metrics.technicalSEO.pageSpeed)}`}>
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Google PageSpeed Insights</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile Usability</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.technicalSEO.mobileUsability}%</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreColor(metrics.technicalSEO.mobileUsability)}`}>
              <Globe className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Mobile-friendly test</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Keywords Tracked</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.keywordRankings.topKeywords.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Active monitoring</span>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
              metrics.technicalSEO.coreWebVitals.lcp <= 2.5 ? 'bg-green-100 text-green-600' :
              metrics.technicalSEO.coreWebVitals.lcp <= 4 ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {metrics.technicalSEO.coreWebVitals.lcp.toFixed(1)}s
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">LCP</p>
            <p className="text-xs text-gray-600">Largest Contentful Paint</p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
              metrics.technicalSEO.coreWebVitals.fid <= 100 ? 'bg-green-100 text-green-600' :
              metrics.technicalSEO.coreWebVitals.fid <= 300 ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {metrics.technicalSEO.coreWebVitals.fid}ms
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">FID</p>
            <p className="text-xs text-gray-600">First Input Delay</p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
              metrics.technicalSEO.coreWebVitals.cls <= 0.1 ? 'bg-green-100 text-green-600' :
              metrics.technicalSEO.coreWebVitals.cls <= 0.25 ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {metrics.technicalSEO.coreWebVitals.cls.toFixed(2)}
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2">CLS</p>
            <p className="text-xs text-gray-600">Cumulative Layout Shift</p>
          </div>
        </div>
      </div>

      {/* Top Keywords & Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keywords */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Keywords</h3>
          <div className="space-y-3">
            {metrics.keywordRankings.topKeywords.slice(0, 5).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{keyword.keyword}</p>
                  <p className="text-sm text-gray-600">{keyword.searchVolume.toLocaleString()} searches/month</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">#{keyword.position}</p>
                  <div className={`flex items-center text-sm ${getChangeColor(keyword.change)}`}>
                    {getChangeIcon(keyword.change)}
                    <span className="ml-1">{keyword.change > 0 ? '+' : ''}{keyword.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
          <div className="space-y-3">
            {metrics.pagePerformance.topPages.slice(0, 5).map((page, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 truncate">{page.url}</p>
                <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-600">Views</p>
                    <p className="font-medium">{page.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Clicks</p>
                    <p className="font-medium">{page.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CTR</p>
                    <p className="font-medium">{page.ctr.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}