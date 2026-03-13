'use client';

import { useState, useEffect } from 'react';
import { contentAPI } from '@/lib/api';

interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'blog' | 'campaign' | 'press';
  status: 'draft' | 'published' | 'archived';
  lastModified: string;
  author: string;
  views?: number;
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await contentAPI.getContent(
        1, 
        50, 
        filters.type || undefined,
        filters.status || undefined,
        filters.search || undefined
      );
      
      setContent(data.data.content || []);
    } catch (error: any) {
      console.error('Failed to fetch content:', error);
      setError(error.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;

    try {
      await contentAPI.deleteContent(id);
      setContent(prev => prev.filter(item => item.id !== id));
      alert('Content deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content: ' + error.message);
    }
  };

  const filteredContent = content.filter(item => {
    return (
      (filters.type === '' || item.type === filters.type) &&
      (filters.status === '' || item.status === filters.status) &&
      (filters.search === '' || item.title.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return '📄';
      case 'blog': return '📝';
      case 'campaign': return '📢';
      case 'press': return '📰';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Content</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchContent}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">Manage website content, blogs, and campaigns</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            + New Content
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="page">Pages</option>
              <option value="blog">Blog Posts</option>
              <option value="campaign">Campaigns</option>
              <option value="press">Press Releases</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{getTypeIcon(item.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.views?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastModified).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-green-600 hover:text-green-900">View</button>
                      <button 
                        onClick={() => handleDelete(item.id)}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pages</h3>
          <p className="text-sm text-gray-600 mb-4">Manage static pages</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Manage Pages
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog</h3>
          <p className="text-sm text-gray-600 mb-4">Create blog posts</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            New Post
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">📢</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaigns</h3>
          <p className="text-sm text-gray-600 mb-4">Manage campaigns</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            New Campaign
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO</h3>
          <p className="text-sm text-gray-600 mb-4">SEO optimization</p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
            SEO Tools
          </button>
        </div>
      </div>
    </div>
  );
}