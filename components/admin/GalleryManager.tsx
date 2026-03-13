'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Edit, Trash2, Eye, Download } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';
import { cn } from '@/lib/utils';
import { galleryAPI } from '@/lib/api';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: string;
  uploadDate: string;
  size: string;
  dimensions: string;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'services', label: 'Services' },
  { value: 'community', label: 'Community' },
  { value: 'events', label: 'Events' },
  { value: 'volunteers', label: 'Volunteers' },
];

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await galleryAPI.getImages(
        currentPage, 
        20, 
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchTerm || undefined
      );
      
      setImages(data.data.images || []);
      setTotalPages(data.data.pages || 1);
    } catch (error: any) {
      console.error('Failed to fetch images:', error);
      setError(error.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await galleryAPI.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImages(prev => prev.filter(id => id !== imageId));
      alert('Image deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image: ' + error.message);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const title = prompt('Enter image title:');
    if (!title) return;

    const description = prompt('Enter image description:') || '';
    const category = prompt('Enter category (services, community, events, volunteers):') || 'services';

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('alt', title);

      const result = await galleryAPI.uploadImage(formData);
      
      // Add new image to the beginning of the list
      setImages(prev => [result.data, ...prev]);
      alert('Image uploaded successfully');
      
      // Reset file input
      event.target.value = '';
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your gallery images and media content
          </p>
        </div>
        
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="upload-input"
            disabled={uploading}
          />
          <label
            htmlFor="upload-input"
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer",
              uploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </label>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Images</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchImages}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {images.length} images
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedImages.length > 0 && `${selectedImages.length} selected`}
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative aspect-video">
              <LazyImage
                src={image.src}
                alt={image.alt}
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteImage(image.id)}
                  className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg text-white hover:bg-red-600/80 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.id)}
                  onChange={() => handleSelectImage(image.id)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                {image.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {image.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span className="capitalize">{image.category}</span>
                <span>{image.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {images.length === 0 && !loading && (
        <div className="text-center py-12">
          <span className="text-gray-400 text-4xl">🖼️</span>
          <p className="text-gray-500 mt-2">No images found</p>
        </div>
      )}
    </div>
  );
}