"use client";
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { getSafeSrc } from '@/lib/utils';
import { Upload, Download, Trash2, Eye, Edit, Folder, Image as ImageIcon, FileText, Video } from 'lucide-react';

interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'banner' | 'social' | 'document' | 'video' | 'other';
  category: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  format: string;
  uploadedAt: string;
  lastUsed?: string;
  tags: string[];
  description?: string;
}

interface AssetCategory {
  name: string;
  count: number;
  types: string[];
}

export default function BrandAssetManager() {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchAssets();
    fetchCategories();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/admin/brand-assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/brand-assets/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach((file) => {
      formData.append('assets', file);
    });

    try {
      const response = await fetch('/api/admin/brand-assets/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchAssets();
        await fetchCategories();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await fetch(`/api/admin/brand-assets/${assetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAssets(prev => prev.filter(asset => asset.id !== assetId));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const downloadAsset = (asset: BrandAsset) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'logo':
      case 'banner':
      case 'social':
        return <ImageIcon className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <Folder className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Brand Asset Manager</h2>
          <p className="text-gray-600">Organize and manage your brand assets</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              List
            </button>
          </div>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload Assets
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="logo">Logos</option>
              <option value="banner">Banners</option>
              <option value="social">Social Media</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {filteredAssets.length} of {assets.length} assets
            </div>
          </div>
        </div>
      </div>

      {/* Assets Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                {asset.thumbnailUrl ? (
                  <NextImage src={getSafeSrc(asset.thumbnailUrl)} alt={asset.name} fill className="object-cover" />
                ) : (
                  <div className="text-gray-400">
                    {getAssetIcon(asset.type)}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-medium text-gray-900 truncate">{asset.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{asset.format.toUpperCase()} • {formatFileSize(asset.size)}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {asset.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{asset.tags.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(asset.url, '_blank')}
                      className="p-1 text-gray-600 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadAsset(asset)}
                      className="p-1 text-gray-600 hover:text-green-600"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAsset(asset.id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs rounded ${
                    asset.type === 'logo' ? 'bg-purple-100 text-purple-800' :
                    asset.type === 'banner' ? 'bg-green-100 text-green-800' :
                    asset.type === 'social' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center relative">
                          {asset.thumbnailUrl ? (
                            <NextImage src={getSafeSrc(asset.thumbnailUrl)} alt={asset.name} fill className="object-cover rounded" />
                          ) : (
                            getAssetIcon(asset.type)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-600">{asset.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        asset.type === 'logo' ? 'bg-purple-100 text-purple-800' :
                        asset.type === 'banner' ? 'bg-green-100 text-green-800' :
                        asset.type === 'social' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {asset.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatFileSize(asset.size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(asset.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(asset.url, '_blank')}
                          className="p-1 text-gray-600 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadAsset(asset)}
                          className="p-1 text-gray-600 hover:text-green-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Uploading assets...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}