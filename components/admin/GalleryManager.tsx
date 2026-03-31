'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Trash2, Download, ArrowRight, X, Maximize2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
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
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

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
        searchTerm || undefined,
        true // isAdmin = true
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
    try {
      // Optimistic update
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImages(prev => prev.filter(id => id !== imageId));
      await galleryAPI.deleteImage(imageId);
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      fetchImages(); // Revert on failure
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-navy-400 font-bold uppercase tracking-[0.2em] italic">Fetching Gallery Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-gold-500 pl-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-navy-950 uppercase italic tracking-tighter">Project Gallery</h2>
          <p className="text-navy-500 font-bold text-xs uppercase tracking-[0.2em] italic">
            Manage and curate the visual assets for the project.
          </p>
        </div>

        <Link
          href="/admin/gallery/upload"
          className="flex items-center gap-3 px-10 py-5 bg-navy-950 text-gold-500 rounded-[2rem] hover:bg-gold-600 hover:text-navy-950 transition-all font-black uppercase tracking-widest shadow-2xl active:scale-95 group"
        >
          <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          Upload Asset
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center bg-white p-8 rounded-[3rem] border border-navy-50 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-200" />
            <input
              type="text"
              placeholder="SEARCH BY TITLE..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 pr-6 py-4 bg-navy-50/30 border-2 border-transparent focus:border-gold-500 rounded-2xl text-navy-950 placeholder:text-navy-200 font-bold text-xs uppercase tracking-widest focus:outline-none transition-all w-full sm:w-72"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-8 py-4 bg-navy-50/30 border-2 border-transparent focus:border-gold-500 rounded-2xl font-black text-[10px] text-navy-950 uppercase tracking-[0.2em] focus:outline-none transition-all appearance-none cursor-pointer pr-12 min-w-[200px]"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest italic">{images.length} Assets Found</p>
          <div className="flex bg-navy-50 p-1.5 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-3 rounded-xl transition-all duration-300',
                viewMode === 'grid'
                  ? 'bg-navy-950 text-gold-500 shadow-lg'
                  : 'text-navy-300 hover:text-navy-950'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-3 rounded-xl transition-all duration-300',
                viewMode === 'list'
                  ? 'bg-navy-950 text-gold-500 shadow-lg'
                  : 'text-navy-300 hover:text-navy-950'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(20,20,35,0.02)] border border-navy-50 overflow-hidden group hover:border-gold-500 transition-all duration-500 flex flex-col"
          >
            {/* Uniform Aspect Ratio Container */}
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-navy-50">
              <LazyImage
                src={image.src}
                alt={image.alt}
                width={800}
                height={800}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">

                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="w-14 h-14 bg-white shadow-2xl rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 duration-500 delay-100"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>

              {/* Selection Checkbox */}
              <div className="absolute top-6 left-6">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.id)}
                  onChange={() => handleSelectImage(image.id)}
                  className="w-6 h-6 text-gold-600 bg-white/80 border-none rounded-lg focus:ring-gold-500 cursor-pointer shadow-lg backdrop-blur-sm"
                />
              </div>

              {/* Category Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1 bg-gold-500 text-navy-950 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                  {image.category}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-4 flex-grow">
              <div className="flex items-center gap-2 text-gold-600 mb-1">
                <div className="w-1 h-1 bg-gold-600 rounded-full"></div>
                <p className="text-[9px] font-bold uppercase tracking-widest">Moksha Sewa Project</p>
              </div>
              <h3 className="font-black text-navy-950 text-sm uppercase tracking-tight truncate group-hover:text-gold-600 transition-colors leading-none">
                {image.title}
              </h3>
              <p className="text-[10px] font-bold text-navy-600/60 leading-relaxed line-clamp-2 uppercase tracking-wide">
                {image.description || 'No detailed context available for this project asset.'}
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-navy-50">
                <span className="text-[9px] font-black text-navy-300 uppercase tracking-widest italic">{image.uploadDate ? new Date(image.uploadDate).toLocaleDateString() : 'N/A'}</span>
                <span className="text-[9px] font-black text-gold-600 uppercase tracking-widest">Archive Asset</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-8 bg-white border border-navy-50 rounded-[2.5rem] shadow-sm mt-10">
          <p className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em] italic">
            Displaying Page <span className="text-gold-600 text-lg mx-1">{currentPage}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-8 py-4 border border-navy-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-navy-950 hover:bg-navy-950 hover:text-gold-500 disabled:opacity-20 transition-all shadow-sm"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-8 py-4 bg-navy-950 text-gold-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold-600 hover:text-navy-950 shadow-xl disabled:opacity-20 transition-all shadow-navy-100/20"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !loading && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-navy-50 border-dashed">
          <p className="text-xs font-black text-navy-300 uppercase tracking-[0.4em] italic mb-6">No assets captured in this sector yet.</p>
          <Link href="/admin/gallery/upload" className="inline-flex items-center gap-3 text-gold-600 font-black uppercase text-[10px] tracking-widest hover:text-navy-950 transition-all py-3 px-8 bg-gold-50 rounded-2xl border border-gold-100">
            Initiate First Capture <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* High-Z-Index Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/95 backdrop-blur-2xl animate-in fade-in duration-500 p-4 md:p-12">
          {/* Close Button - Placed well away from navbar corners */}
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-10 right-10 z-[10000] w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-[80vh] flex flex-col md:flex-row bg-white rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 animate-in zoom-in-95 duration-500">
            {/* Image Side */}
            <div className="flex-grow bg-black relative flex items-center justify-center overflow-hidden">
              <img
                src={previewImage.src}
                alt={previewImage.alt}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Side */}
            <div className="w-full md:w-96 p-10 flex flex-col justify-between bg-white border-l border-navy-50">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-gold-100 text-gold-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                    {previewImage.category}
                  </span>
                  <h3 className="text-2xl font-black text-navy-950 uppercase italic tracking-tighter leading-tight">
                    {previewImage.title}
                  </h3>
                </div>

                <p className="text-xs font-bold text-navy-600/80 leading-relaxed uppercase tracking-wide">
                  {previewImage.description || 'No detailed context provided for this archive asset.'}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-navy-50">
                  <div>
                    <p className="text-[8px] font-black text-navy-300 uppercase tracking-widest mb-1">Dimensions</p>
                    <p className="text-[10px] font-black text-navy-950 uppercase">{previewImage.dimensions || 'Fixed Ratio'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-navy-300 uppercase tracking-widest mb-1">File Size</p>
                    <p className="text-[10px] font-black text-navy-950 uppercase">{previewImage.size}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-navy-50 flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black text-navy-300 uppercase tracking-widest mb-1">Sync Date</p>
                  <p className="text-[10px] font-black text-navy-950 uppercase italic">{previewImage.uploadDate ? new Date(previewImage.uploadDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="w-10 h-10 bg-navy-950 rounded-xl flex items-center justify-center text-gold-500 shadow-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}