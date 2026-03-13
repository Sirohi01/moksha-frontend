'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PressReleaseModal from '@/components/admin/PressReleaseModal';
import MediaKitManager from '@/components/admin/MediaKitManager';
import PressContactManager from '@/components/admin/PressContactManager';

interface PressRelease {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishDate: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  featuredImage?: {
    _id: string;
    url: string;
    title: string;
    altText: string;
  };
  mediaAssets: Array<{
    _id: string;
    url: string;
    title: string;
    type: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  downloadCount: number;
  isBreaking: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export default function PressRoomManagement() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTab, setSelectedTab] = useState('releases');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRelease, setEditingRelease] = useState<PressRelease | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  const tabs = [
    { id: 'releases', name: 'Press Releases', icon: '📰' },
    { id: 'media-kits', name: 'Media Kits', icon: '📦' },
    { id: 'contacts', name: 'Press Contacts', icon: '📞' },
    { id: 'coverage', name: 'Media Coverage', icon: '📊' }
  ];

  const categories = [
    'General News',
    'Service Updates', 
    'Community Impact',
    'Volunteer Stories',
    'Partnerships',
    'Awards & Recognition',
    'Emergency Response',
    'Fundraising',
    'Events'
  ];

  useEffect(() => {
    fetchPressReleases();
  }, [currentPage, filters, selectedTab]);

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      if (selectedTab !== 'all') {
        if (selectedTab === 'breaking') {
          queryParams.append('isBreaking', 'true');
        } else {
          queryParams.append('status', selectedTab);
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/press?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPressReleases(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch press releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPressRelease = async (releaseData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/press`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(releaseData),
      });

      if (response.ok) {
        fetchPressReleases();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create press release:', error);
    }
  };

  const updatePressRelease = async (id: string, releaseData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/press/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(releaseData),
      });

      if (response.ok) {
        fetchPressReleases();
        setEditingRelease(null);
      }
    } catch (error) {
      console.error('Failed to update press release:', error);
    }
  };

  const deletePressRelease = async (id: string) => {
    if (!confirm('Are you sure you want to delete this press release?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/press/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPressReleases();
      }
    } catch (error) {
      console.error('Failed to delete press release:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📰 Press Room Management</h1>
          <p className="text-gray-600">Create, manage, and publish press releases</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Press Release
          </button>
        </div>
      </div>

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
      {selectedTab === 'releases' && (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search press releases..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Press Releases List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Press Release
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pressReleases.map((release) => (
                <tr key={release._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {release.featuredImage && (
                        <Image
                          src={release.featuredImage.url}
                          alt={release.featuredImage.altText}
                          className="w-16 h-12 object-cover rounded"
                          width={64}
                          height={48}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {release.title}
                          </h3>
                          {release.isBreaking && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              🚨 Breaking
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {release.excerpt}
                        </p>
                        <div className="text-xs text-gray-400 mt-1">
                          By {release.author.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{release.category}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {release.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            {tag}
                          </span>
                        ))}
                        {release.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{release.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(release.status)}`}>
                        {release.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(release.priority)}`}>
                        {release.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>👁️ {release.viewCount} views</div>
                      <div>⬇️ {release.downloadCount} downloads</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Created: {new Date(release.createdAt).toLocaleDateString()}</div>
                      {release.publishDate && (
                        <div>Publish: {new Date(release.publishDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingRelease(release)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => window.open(`/press/${release.slug}`, '_blank')}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deletePressRelease(release._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        </div>
      )}
        </>
      )}

      {selectedTab === 'media-kits' && <MediaKitManager />}
      {selectedTab === 'contacts' && <PressContactManager />}
      {selectedTab === 'coverage' && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <span className="text-4xl mb-4 block">📊</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Media Coverage Tracking</h3>
          <p className="text-gray-600">Track and analyze media coverage of your press releases</p>
          <p className="text-sm text-gray-400 mt-2">Coming soon...</p>
        </div>
      )}

      {/* Create/Edit Modal - Only show for releases tab */}
      {selectedTab === 'releases' && (
        <PressReleaseModal
          isOpen={showCreateModal || !!editingRelease}
          onClose={() => {
            setShowCreateModal(false);
            setEditingRelease(null);
          }}
          onSave={(data) => {
            if (editingRelease) {
              updatePressRelease(editingRelease._id, data);
            } else {
              createPressRelease(data);
            }
          }}
          editingRelease={editingRelease}
        />
      )}
    </div>
  );
}