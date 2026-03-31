'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSafeSrc } from '@/lib/utils';

interface SocialMediaPost {
  _id: string;
  title: string;
  content: string;
  platforms: Array<{
    platform: string;
    content?: string;
    hashtags: string[];
    mentions: string[];
    status: 'draft' | 'scheduled' | 'posted' | 'failed';
    postId?: string;
    postUrl?: string;
    postedAt?: string;
    likes: number;
    shares: number;
    comments: number;
    views: number;
  }>;
  mediaAssets: Array<{
    _id: string;
    url: string;
    title: string;
    type: string;
  }>;
  scheduledFor?: string;
  category: string;
  status: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function SocialMediaScheduler() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialMediaPost | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    category: '',
    search: ''
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-600' }
  ];

  const categories = [
    'Announcement',
    'Event',
    'Campaign',
    'Testimonial',
    'Educational',
    'Behind the Scenes',
    'Other'
  ];

  const tabs = [
    { id: 'all', name: 'All Posts' },
    { id: 'draft', name: 'Drafts' },
    { id: 'scheduled', name: 'Scheduled' },
    { id: 'posted', name: 'Posted' },
    { id: 'failed', name: 'Failed' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [filters, selectedTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      if (selectedTab !== 'all') {
        queryParams.append('status', selectedTab);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social-media?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch social media posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social-media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        fetchPosts();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const updatePost = async (id: string, postData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social-media/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        fetchPosts();
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social-media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const publishNow = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social-media/${id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : '📱';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
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
          <h2 className="text-xl font-bold text-gray-900">📱 Social Media Scheduler</h2>
          <p className="text-gray-600">Schedule and manage social media posts across platforms</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Post
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>{platform.name}</option>
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
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
              <option value="scheduled">Scheduled</option>
              <option value="posted">Posted</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search posts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{post.title || 'Untitled Post'}</h3>
                  <p className="text-sm text-gray-500 mt-1">{post.category}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
              </div>
            </div>

            {/* Post Content Preview */}
            <div className="p-4">
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">{post.content}</p>

              {/* Media Assets */}
              {post.mediaAssets.length > 0 && (
                <div className="flex space-x-2 mb-3">
                  {post.mediaAssets.slice(0, 3).map((asset, index) => (
                    <div key={index} className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {asset.type === 'image' ? (
                        <Image src={getSafeSrc(asset.url)} alt={asset.title} className="w-full h-full object-cover" width={48} height={48} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {asset.type === 'video' ? '🎥' : '📄'}
                        </div>
                      )}
                    </div>
                  ))}
                  {post.mediaAssets.length > 3 && (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                      +{post.mediaAssets.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Platforms */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs text-gray-500">Platforms:</span>
                {post.platforms.map((platform, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <span className="text-sm">{getPlatformIcon(platform.platform)}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(platform.status)}`}>
                      {platform.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Engagement Stats */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500 mb-3">
                <div>
                  <div className="font-medium">
                    {post.platforms.reduce((sum, p) => sum + p.likes, 0)}
                  </div>
                  <div>Likes</div>
                </div>
                <div>
                  <div className="font-medium">
                    {post.platforms.reduce((sum, p) => sum + p.shares, 0)}
                  </div>
                  <div>Shares</div>
                </div>
                <div>
                  <div className="font-medium">
                    {post.platforms.reduce((sum, p) => sum + p.comments, 0)}
                  </div>
                  <div>Comments</div>
                </div>
                <div>
                  <div className="font-medium">
                    {post.platforms.reduce((sum, p) => sum + p.views, 0)}
                  </div>
                  <div>Views</div>
                </div>
              </div>

              {/* Schedule Info */}
              {post.scheduledFor && (
                <div className="text-xs text-gray-500 mb-3">
                  📅 Scheduled: {new Date(post.scheduledFor).toLocaleString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  {post.status === 'draft' && (
                    <button
                      onClick={() => publishNow(post._id)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Publish
                    </button>
                  )}
                </div>
                <button
                  onClick={() => deletePost(post._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPost) && (
        <SocialMediaPostModal
          isOpen={showCreateModal || !!editingPost}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPost(null);
          }}
          onSave={(data: any) => {
            if (editingPost) {
              updatePost(editingPost._id, data);
            } else {
              createPost(data);
            }
          }}
          editingPost={editingPost}
          platforms={platforms}
          categories={categories}
        />
      )}
    </div>
  );
}

// Social Media Post Modal Component
function SocialMediaPostModal({ isOpen, onClose, onSave, editingPost, platforms, categories }: any) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: categories[0],
    scheduledFor: '',
    platforms: [] as any[],
    mediaAssets: [] as string[]
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content,
        category: editingPost.category,
        scheduledFor: editingPost.scheduledFor ? new Date(editingPost.scheduledFor).toISOString().slice(0, 16) : '',
        platforms: editingPost.platforms,
        mediaAssets: editingPost.mediaAssets.map((a: any) => a._id)
      });
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const togglePlatform = (platformId: string) => {
    const existingIndex = formData.platforms.findIndex(p => p.platform === platformId);
    if (existingIndex >= 0) {
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(p => p.platform !== platformId)
      });
    } else {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, {
          platform: platformId,
          content: '',
          hashtags: [],
          mentions: [],
          status: 'draft'
        }]
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {editingPost ? 'Edit Social Media Post' : 'Create Social Media Post'}
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close social media post dialog"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your social media post content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule For
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Platforms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform: any) => (
                  <label
                    key={platform.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.platforms.some(p => p.platform === platform.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.platforms.some(p => p.platform === platform.id)}
                      onChange={() => togglePlatform(platform.id)}
                      className="sr-only"
                    />
                    <span className="text-xl">{platform.icon}</span>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {editingPost ? 'Update' : 'Create'} Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}