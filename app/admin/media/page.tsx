'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import VideoManager from '@/components/admin/VideoManager';
import SocialMediaScheduler from '@/components/admin/SocialMediaScheduler';
import SocialMediaAnalytics from '@/components/admin/SocialMediaAnalytics';
import BrandAssetManager from '@/components/admin/BrandAssetManager';
import MediaAnalyticsDashboard from '@/components/admin/MediaAnalyticsDashboard';
import ContentApprovalWorkflow from '@/components/admin/ContentApprovalWorkflow';

interface MediaAsset {
  _id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'logo' | 'brand_asset';
  category: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  tags: string[];
  keywords: string[];
  downloadCount: number;
  viewCount: number;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MediaStats {
  totalAssets: number;
  totalViews: number;
  totalDownloads: number;
  totalSize: number;
  typeBreakdown: Array<{
    _id: string;
    count: number;
    views: number;
    downloads: number;
  }>;
  categoryBreakdown: Array<{
    _id: string;
    count: number;
    views: number;
  }>;
}

type TabType = 'overview' | 'gallery' | 'videos' | 'social' | 'brand' | 'analytics' | 'approval';

export default function MediaDashboard() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    search: ''
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const tabs = [
    { id: 'overview' as TabType, name: 'Overview', icon: '📊' },
    { id: 'gallery' as TabType, name: 'Gallery', icon: '🖼️' },
    { id: 'videos' as TabType, name: 'Videos', icon: '🎥' },
    { id: 'social' as TabType, name: 'Social Media', icon: '📱' },
    { id: 'brand' as TabType, name: 'Brand Assets', icon: '🎨' },
    { id: 'analytics' as TabType, name: 'Analytics', icon: '📈' },
    { id: 'approval' as TabType, name: 'Approval', icon: '✅' }
  ];

  const mediaTypes = [
    { value: '', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'document', label: 'Documents' },
    { value: 'audio', label: 'Audio' },
    { value: 'logo', label: 'Logos' },
    { value: 'brand_asset', label: 'Brand Assets' }
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'press', label: 'Press' },
    { value: 'social', label: 'Social Media' },
    { value: 'brand', label: 'Brand' },
    { value: 'events', label: 'Events' },
    { value: 'campaigns', label: 'Campaigns' },
    { value: 'testimonials', label: 'Testimonials' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchAssets();
    fetchStats();
  }, [currentPage, filters]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAssets(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch media assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch media stats:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('category', 'gallery');
    formData.append('isPublic', 'true');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchAssets();
        setUploadModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  const deleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchAssets();
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !assets.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600">Manage your media assets, gallery, and brand materials</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Media
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssets || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {(selectedTab === 'overview' || selectedTab === 'gallery') && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {mediaTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search assets..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <div key={asset._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Media Preview */}
                <div className="aspect-video bg-gray-100 relative">
                  {asset.type === 'image' ? (
                    <Image
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.altText || asset.title}
                      className="w-full h-full object-cover"
                      width={400}
                      height={300}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">{getTypeIcon(asset.type)}</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                      {asset.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {asset.isFeatured && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Asset Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{asset.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{asset.category}</p>
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{formatFileSize(asset.fileSize)}</span>
                    <span>{asset.viewCount} views</span>
                  </div>

                  {/* Tags */}
                  {asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          {tag}
                        </span>
                      ))}
                      {asset.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{asset.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(asset.url, '_blank')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Edit
                      </button>
                    </div>
                    <button
                      onClick={() => deleteAsset(asset._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
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
      )}

      {/* Other Tab Content */}
      {selectedTab === 'videos' && <VideoManager />}
      {selectedTab === 'social' && (
        <div className="space-y-6">
          <SocialMediaScheduler />
          <SocialMediaAnalytics />
        </div>
      )}
      {selectedTab === 'brand' && <BrandAssetManager />}
      {selectedTab === 'analytics' && <MediaAnalyticsDashboard />}
      {selectedTab === 'approval' && <ContentApprovalWorkflow />}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Media</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Files
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}