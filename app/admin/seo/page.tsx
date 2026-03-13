'use client';

import { useState, useEffect } from 'react';
import { seoAPI } from '@/lib/api';
import ContentEditor from '@/components/seo/ContentEditor';
import MetaTagsManager from '@/components/seo/MetaTagsManager';
import SEOAnalytics from '@/components/seo/SEOAnalytics';
import SitemapManager from '@/components/seo/SitemapManager';
import { Search, Plus, FileText, BarChart3, Globe, Settings, Target, TrendingUp, AlertCircle } from 'lucide-react';

interface SEOData {
  _id: string;
  title: string;
  slug: string;
  url: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  seoScore: number;
  status: 'draft' | 'published' | 'archived' | 'under_review';
  targetKeywords: Array<{
    keyword: string;
    difficulty: number;
    searchVolume: number;
    currentRank: number;
    targetRank: number;
  }>;
  lastOptimized: string;
  createdAt: string;
  updatedAt: string;
}

interface SEOStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  avgSEOScore: number;
  pagesWithIssues: number;
  highPriorityIssues: number;
  recentOptimizations: number;
}

export default function SEOTools() {
  const [activeTab, setActiveTab] = useState('overview');
  const [seoData, setSeoData] = useState<SEOData[]>([]);
  const [seoStats, setSeoStats] = useState<SEOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPage, setSelectedPage] = useState<SEOData | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showMetaEditor, setShowMetaEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSEOData();
    fetchSEOStats();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await seoAPI.getSEOData(
        currentPage, 
        10, 
        statusFilter === 'all' ? undefined : statusFilter,
        searchTerm || undefined
      );
      
      setSeoData(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error: any) {
      console.error('Failed to fetch SEO data:', error);
      setError(error.message || 'Failed to load SEO data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSEOStats = async () => {
    try {
      const response = await seoAPI.getStats();
      setSeoStats(response.data);
    } catch (error: any) {
      console.error('Failed to fetch SEO stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SEO page data?')) return;

    try {
      await seoAPI.deleteSEOPage(id);
      setSeoData(prev => prev.filter(item => item._id !== id));
      alert('SEO page data deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete SEO data:', error);
      alert('Failed to delete SEO data: ' + error.message);
    }
  };

  const handleRunAudit = async (id: string) => {
    try {
      await seoAPI.runAudit(id);
      alert('SEO audit completed successfully');
      fetchSEOData(); // Refresh data
    } catch (error: any) {
      console.error('Failed to run SEO audit:', error);
      alert('Failed to run SEO audit: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleEditSEO = (page: SEOData) => {
    setSelectedPage(page);
    setShowEditor(true);
  };

  const handleEditMeta = (page: SEOData) => {
    setSelectedPage(page);
    setShowMetaEditor(true);
  };

  const handleSaveSEO = async () => {
    if (!selectedPage) return;
    
    try {
      await seoAPI.updateSEOPage(selectedPage._id, {
        title: selectedPage.title,
        metaTitle: selectedPage.metaTitle,
        metaDescription: selectedPage.metaDescription,
        metaKeywords: selectedPage.metaKeywords
      });
      
      fetchSEOData();
      setShowEditor(false);
      setShowMetaEditor(false);
      setSelectedPage(null);
      alert('SEO data updated successfully');
    } catch (error: any) {
      console.error('Failed to update SEO data:', error);
      alert('Failed to update SEO data: ' + error.message);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'pages', name: 'Pages', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'sitemap', name: 'Sitemap', icon: <Globe className="w-4 h-4" /> },
    { id: 'tools', name: 'Tools', icon: <Settings className="w-4 h-4" /> },
  ];

  if (loading && !seoData.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">SEO Management</h1>
            <p className="text-gray-600">Optimize website content for search engines</p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add SEO Page</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading SEO Data</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchSEOData}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* SEO Overview Stats */}
              {seoStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 mr-4" />
                      <div>
                        <p className="text-blue-100">Total Pages</p>
                        <p className="text-3xl font-bold">{seoStats.totalPages}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <Target className="w-8 h-8 mr-4" />
                      <div>
                        <p className="text-green-100">Avg SEO Score</p>
                        <p className="text-3xl font-bold">{seoStats.avgSEOScore}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <AlertCircle className="w-8 h-8 mr-4" />
                      <div>
                        <p className="text-yellow-100">Issues Found</p>
                        <p className="text-3xl font-bold">{seoStats.pagesWithIssues}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 mr-4" />
                      <div>
                        <p className="text-purple-100">Recent Optimizations</p>
                        <p className="text-3xl font-bold">{seoStats.recentOptimizations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Research</h3>
                  <p className="text-sm text-gray-600 mb-4">Find relevant keywords for your content</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Research Keywords
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Audit</h3>
                  <p className="text-sm text-gray-600 mb-4">Comprehensive SEO audit of your website</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Run Audit
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                  <p className="text-sm text-gray-600 mb-4">Monitor search rankings and traffic</p>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="under_review">Under Review</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* SEO Pages Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Page
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SEO Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keywords
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {seoData.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.url}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-bold ${getScoreColor(item.seoScore)}`}>
                              {item.seoScore}/100
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {item.targetKeywords?.slice(0, 2).map((keyword, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {keyword.keyword}
                                </span>
                              ))}
                              {item.targetKeywords?.length > 2 && (
                                <span className="text-xs text-gray-400">+{item.targetKeywords.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditMeta(item)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Edit Meta
                            </button>
                            <button 
                              onClick={() => handleRunAudit(item._id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Audit
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <SEOAnalytics />
          )}

          {/* Sitemap Tab */}
          {activeTab === 'sitemap' && (
            <SitemapManager />
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Meta Tags Update</h3>
                  <p className="text-sm text-gray-600 mb-4">Update meta tags for multiple pages at once</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Bulk Update
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Report</h3>
                  <p className="text-sm text-gray-600 mb-4">Generate comprehensive SEO performance report</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Meta Tags Editor Modal */}
      {showMetaEditor && selectedPage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Meta Tags for {selectedPage.title}
              </h3>
              
              <MetaTagsManager
                data={{
                  metaTitle: selectedPage.metaTitle,
                  metaDescription: selectedPage.metaDescription,
                  metaKeywords: selectedPage.metaKeywords,
                  canonicalUrl: selectedPage.url,
                }}
                onChange={(data) => {
                  setSelectedPage({
                    ...selectedPage,
                    metaTitle: data.metaTitle || '',
                    metaDescription: data.metaDescription || '',
                    metaKeywords: data.metaKeywords || '',
                  });
                }}
                onSave={handleSaveSEO}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowMetaEditor(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedPage ? 'Edit SEO Page' : 'Add New SEO Page'}
              </h3>
              
              <ContentEditor
                content={selectedPage?.title || ''}
                onChange={(content) => {
                  if (selectedPage) {
                    setSelectedPage({ ...selectedPage, title: content });
                  }
                }}
                onSave={handleSaveSEO}
                placeholder="Enter page content..."
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}