'use client';

import { useState, useEffect } from 'react';
import { Download, RefreshCw, Globe, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { seoAPI } from '@/lib/api';

interface SitemapData {
  sitemap: string;
  urlCount: number;
  generatedAt: string;
  lastSubmitted?: string;
  status: 'generated' | 'submitted' | 'error';
}

export default function SitemapManager() {
  const [sitemapData, setSitemapData] = useState<SitemapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSitemapData();
  }, []);

  const loadSitemapData = () => {
    // Mock data - replace with actual API call
    const mockData: SitemapData = {
      sitemap: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mokshaseva.org/</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mokshaseva.org/about</loc>
    <lastmod>2024-01-14</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mokshaseva.org/services</loc>
    <lastmod>2024-01-13</lastmod>
    <priority>0.9</priority>
  </url>
</urlset>`,
      urlCount: 25,
      generatedAt: new Date().toISOString(),
      lastSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'submitted'
    };
    
    setSitemapData(mockData);
  };

  const generateSitemap = async () => {
    try {
      setGenerating(true);
      setError('');

      const result = await seoAPI.generateSitemap();
      
      setSitemapData({
        sitemap: result.data.sitemap,
        urlCount: result.data.urlCount,
        generatedAt: result.data.generatedAt,
        status: 'generated'
      });

    } catch (error: any) {
      console.error('Failed to generate sitemap:', error);
      setError(error.message || 'Failed to generate sitemap');
    } finally {
      setGenerating(false);
    }
  };

  const downloadSitemap = () => {
    if (!sitemapData?.sitemap) return;

    const blob = new Blob([sitemapData.sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const submitToSearchEngines = async () => {
    try {
      setLoading(true);
      setError('');

      // Mock submission - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSitemapData(prev => prev ? {
        ...prev,
        lastSubmitted: new Date().toISOString(),
        status: 'submitted'
      } : null);

      alert('Sitemap submitted to search engines successfully!');

    } catch (error: any) {
      console.error('Failed to submit sitemap:', error);
      setError(error.message || 'Failed to submit sitemap');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'submitted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generated':
        return 'Generated';
      case 'submitted':
        return 'Submitted to Search Engines';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sitemap Manager</h2>
            <p className="text-gray-600">Generate and manage XML sitemaps for search engines</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateSitemap}
              disabled={generating}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Generating...' : 'Generate Sitemap'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Status */}
      {sitemapData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sitemap Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total URLs</p>
                <p className="text-2xl font-bold text-gray-900">{sitemapData.urlCount}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Generated</p>
                <p className="text-sm text-gray-900">
                  {new Date(sitemapData.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {getStatusIcon(sitemapData.status)}
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sitemapData.status)}`}>
                  {getStatusText(sitemapData.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadSitemap}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download XML</span>
            </button>

            <button
              onClick={submitToSearchEngines}
              disabled={loading || sitemapData.status === 'submitted'}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit to Search Engines'}</span>
            </button>
          </div>

          {sitemapData.lastSubmitted && (
            <div className="mt-4 text-sm text-gray-600">
              Last submitted: {new Date(sitemapData.lastSubmitted).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Sitemap Preview */}
      {sitemapData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sitemap Preview</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {sitemapData.sitemap}
            </pre>
          </div>
        </div>
      )}

      {/* SEO Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Sitemap Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✅ Do:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Update sitemap when content changes</li>
              <li>• Include only canonical URLs</li>
              <li>• Set appropriate priority values</li>
              <li>• Include lastmod dates</li>
              <li>• Submit to Google Search Console</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">❌ Don't:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include blocked or redirected URLs</li>
              <li>• Exceed 50,000 URLs per sitemap</li>
              <li>• Include non-canonical URLs</li>
              <li>• Forget to update after site changes</li>
              <li>• Include URLs with noindex tags</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Engine Submission Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Engine Submission</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">G</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Google Search Console</div>
                <div className="text-sm text-gray-600">Submit your sitemap to Google</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Submitted
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Status
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Bing Webmaster Tools</div>
                <div className="text-sm text-gray-600">Submit your sitemap to Bing</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Submit Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}