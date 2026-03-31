'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSafeSrc } from '@/lib/utils';

interface MediaKit {
  _id: string;
  title: string;
  description: string;
  assets: Array<{
    _id: string;
    title: string;
    type: string;
    url: string;
    thumbnailUrl?: string;
    fileSize: number;
  }>;
  category: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function MediaKitManager() {
  const [mediaKits, setMediaKits] = useState<MediaKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKit, setEditingKit] = useState<MediaKit | null>(null);

  useEffect(() => {
    fetchMediaKits();
  }, []);

  const fetchMediaKits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/kits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMediaKits(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch media kits:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMediaKit = async (kitData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/kits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kitData),
      });

      if (response.ok) {
        fetchMediaKits();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create media kit:', error);
    }
  };

  const deleteMediaKit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media kit?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/kits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchMediaKits();
      }
    } catch (error) {
      console.error('Failed to delete media kit:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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
          <h2 className="text-xl font-bold text-gray-900">📦 Media Kit Management</h2>
          <p className="text-gray-600">Create and manage downloadable media kits</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Media Kit
        </button>
      </div>

      {/* Media Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaKits.map((kit) => (
          <div key={kit._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Kit Preview */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{kit.title}</h3>
                    <p className="text-sm text-gray-500">{kit.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{kit.assets.length}</div>
                  <div className="text-xs text-gray-500">assets</div>
                </div>
              </div>
            </div>

            {/* Kit Details */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{kit.description}</p>

              {/* Asset Preview */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Included Assets
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {kit.assets.slice(0, 5).map((asset, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">
                        {asset.type === 'image' ? '🖼️' : 
                         asset.type === 'video' ? '🎥' : 
                         asset.type === 'document' ? '📄' : '📁'}
                      </span>
                      <span className="flex-1 truncate">{asset.title}</span>
                      <span className="text-xs text-gray-400">{formatFileSize(asset.fileSize)}</span>
                    </div>
                  ))}
                  {kit.assets.length > 5 && (
                    <div className="text-xs text-gray-400 text-center">
                      +{kit.assets.length - 5} more assets
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>⬇️ {kit.downloadCount} downloads</span>
                <span>{kit.isPublic ? '🌐 Public' : '🔒 Private'}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingKit(kit)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/kits/${kit._id}/download`, '_blank')}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Download
                  </button>
                </div>
                <button
                  onClick={() => deleteMediaKit(kit._id)}
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
      {(showCreateModal || editingKit) && (
        <MediaKitModal
          isOpen={showCreateModal || !!editingKit}
          onClose={() => {
            setShowCreateModal(false);
            setEditingKit(null);
          }}
          onSave={createMediaKit}
          editingKit={editingKit}
        />
      )}
    </div>
  );
}

// Media Kit Modal Component
function MediaKitModal({ isOpen, onClose, onSave, editingKit }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Press Kit',
    isPublic: true,
    assets: [] as string[]
  });
  const [availableAssets, setAvailableAssets] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableAssets();
      if (editingKit) {
        setFormData({
          title: editingKit.title,
          description: editingKit.description,
          category: editingKit.category,
          isPublic: editingKit.isPublic,
          assets: editingKit.assets.map((a: any) => a._id)
        });
      }
    }
  }, [isOpen, editingKit]);

  const fetchAvailableAssets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableAssets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleAsset = (assetId: string) => {
    setFormData({
      ...formData,
      assets: formData.assets.includes(assetId)
        ? formData.assets.filter(id => id !== assetId)
        : [...formData.assets, assetId]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {editingKit ? 'Edit Media Kit' : 'Create Media Kit'}
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close media kit dialog"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
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
                  <option value="Press Kit">Press Kit</option>
                  <option value="Brand Assets">Brand Assets</option>
                  <option value="Event Materials">Event Materials</option>
                  <option value="Campaign Assets">Campaign Assets</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Make publicly available</span>
              </label>
            </div>

            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Assets ({formData.assets.length} selected)
              </label>
              <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                {availableAssets.map((asset: any) => (
                  <div
                    key={asset._id}
                    className={`flex items-center space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      formData.assets.includes(asset._id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleAsset(asset._id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.assets.includes(asset._id)}
                      onChange={() => toggleAsset(asset._id)}
                      className="mr-2"
                    />
                    {asset.thumbnailUrl && (
                      <Image
                        src={getSafeSrc(asset.thumbnailUrl)}
                        alt={asset.title}
                        className="w-12 h-12 object-cover rounded"
                        width={48}
                        height={48}
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{asset.title}</div>
                      <div className="text-xs text-gray-500">{asset.type} • {asset.category}</div>
                    </div>
                  </div>
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
                {editingKit ? 'Update' : 'Create'} Media Kit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}