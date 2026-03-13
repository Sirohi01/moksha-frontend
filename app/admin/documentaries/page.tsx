'use client';

import { useState, useEffect } from 'react';
import { documentaryAPI } from '@/lib/api';

interface Documentary {
  id: string;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  status: 'planning' | 'production' | 'post_production' | 'completed' | 'published';
  director: string;
  category: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  views: number;
  budget: number;
}

export default function DocumentariesManagement() {
  const [documentaries, setDocumentaries] = useState<Documentary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchDocumentaries();
  }, [filters]);

  const fetchDocumentaries = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await documentaryAPI.getDocumentaries(
        1, 
        50, 
        filters.status || undefined,
        filters.category || undefined,
        filters.search || undefined
      );
      
      setDocumentaries(data.data.documentaries || []);
    } catch (error: any) {
      console.error('Failed to fetch documentaries:', error);
      setError(error.message || 'Failed to load documentaries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this documentary?')) return;

    try {
      await documentaryAPI.deleteDocumentary(id);
      setDocumentaries(prev => prev.filter(doc => doc.id !== id));
      alert('Documentary deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete documentary:', error);
      alert('Failed to delete documentary: ' + error.message);
    }
  };

  const filteredDocumentaries = documentaries.filter(doc => {
    return (
      (filters.status === '' || doc.status === filters.status) &&
      (filters.category === '' || doc.category === filters.category) &&
      (filters.search === '' || doc.title.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'production': return 'bg-blue-100 text-blue-800';
      case 'post_production': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'organizational': return '🏢';
      case 'volunteer_stories': return '🤝';
      case 'expansion': return '🌍';
      case 'partnerships': return '🤝';
      case 'impact_stories': return '💫';
      default: return '🎬';
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
            <h3 className="text-red-800 font-medium">Error Loading Documentaries</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchDocumentaries}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Documentaries Management</h1>
            <p className="text-gray-600">Manage documentary projects and video content</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            + New Documentary
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">🎬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{documentaries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {documentaries.filter(d => d.status === 'completed' || d.status === 'published').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">🎥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Production</p>
              <p className="text-2xl font-bold text-gray-900">
                {documentaries.filter(d => d.status === 'production' || d.status === 'post_production').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {documentaries.reduce((acc, d) => acc + d.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="production">Production</option>
              <option value="post_production">Post Production</option>
              <option value="completed">Completed</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="organizational">Organizational</option>
              <option value="volunteer_stories">Volunteer Stories</option>
              <option value="expansion">Expansion</option>
              <option value="partnerships">Partnerships</option>
              <option value="impact_stories">Impact Stories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search documentaries..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Documentaries List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Director
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocumentaries.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <span className="mr-3 text-xl">{getCategoryIcon(doc.category)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                        <div className="text-sm text-gray-500 mt-1 max-w-md">
                          {doc.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Budget: ₹{doc.budget.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">
                      {doc.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.director}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      {doc.videoUrl && (
                        <button className="text-green-600 hover:text-green-900">View</button>
                      )}
                      <button 
                        onClick={() => handleDelete(doc.id)}
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

      {/* Production Pipeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Production Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-4 mb-2">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-medium text-gray-900">Planning</h3>
            <p className="text-sm text-gray-600">
              {documentaries.filter(d => d.status === 'planning').length} projects
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-4 mb-2">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="font-medium text-gray-900">Production</h3>
            <p className="text-sm text-gray-600">
              {documentaries.filter(d => d.status === 'production').length} projects
            </p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-lg p-4 mb-2">
              <span className="text-2xl">✂️</span>
            </div>
            <h3 className="font-medium text-gray-900">Post Production</h3>
            <p className="text-sm text-gray-600">
              {documentaries.filter(d => d.status === 'post_production').length} projects
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-4 mb-2">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-medium text-gray-900">Completed</h3>
            <p className="text-sm text-gray-600">
              {documentaries.filter(d => d.status === 'completed').length} projects
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-lg p-4 mb-2">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="font-medium text-gray-900">Published</h3>
            <p className="text-sm text-gray-600">
              {documentaries.filter(d => d.status === 'published').length} projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}