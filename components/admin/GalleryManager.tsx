'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Trash2, Maximize2, CheckCircle2, Eye, EyeOff, Globe, ArrowRight, Filter, Box } from 'lucide-react';
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
  isPublic: boolean;
  status: string;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'services', label: 'Services' },
  { value: 'community', label: 'Community' },
  { value: 'events', label: 'Events' },
  { value: 'volunteers', label: 'Volunteers' },
  { value: 'gallery', label: 'Gallery' },
];

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'live' | 'hidden'>('live');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, [currentPage, selectedCategory, searchTerm, visibilityFilter]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await galleryAPI.getImages(
        currentPage,
        20,
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchTerm || undefined,
        true, // isAdmin = true
        visibilityFilter === 'all' ? undefined : (visibilityFilter === 'live' ? true : false)
      );
      setImages(data.data.images || []);
      setTotalPages(data.data.total ? Math.ceil(data.data.total / 20) : 1);
    } catch (error: any) {
      console.error('Failed to fetch images:', error);
      setError(error.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (image: GalleryImage) => {
    try {
      const newStatus = !image.isPublic;
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, isPublic: newStatus } : img
      ));
      await galleryAPI.updateImage(image.id, { isPublic: newStatus });
    } catch (error: any) {
      console.error('Failed to update visibility:', error);
      fetchImages();
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this asset?')) return;
    try {
      setImages(prev => prev.filter(img => img.id !== imageId));
      await galleryAPI.deleteImage(imageId);
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      fetchImages();
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-20 bg-navy-50/10 rounded-[3rem] border-2 border-dashed border-navy-100">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-t-gold-500 border-navy-100 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="mt-8 text-navy-400 font-black uppercase tracking-[0.3em] italic animate-pulse">Syncing Visual Archive...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Surgical Control Header */}
      <div className="relative group overflow-hidden bg-navy-950 p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all duration-700">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-navy-800/20 blur-[50px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20">
                <Box size={16} />
              </div>
              <span className="text-[10px] font-black text-gold-500 uppercase tracking-[0.4em] italic opacity-80">Archive Terminal</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                Visual <span className="text-gold-500">Infrastructure</span>
              </h1>
              <p className="text-[11px] font-bold text-navy-300 uppercase tracking-widest opacity-60">
                Archival Asset Control & Deployment Node • Project Alpha
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/gallery/upload"
              className="flex items-center gap-3 px-8 py-4 bg-gold-500 text-navy-950 rounded-2xl hover:bg-white hover:scale-105 transition-all font-black uppercase tracking-wider text-[11px] shadow-2xl group active:scale-95"
            >
              <Upload size={18} />
              Capture Asset
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Advanced Control Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sticky top-6 z-40">
        {/* Search & Filter Terminal */}
        <div className="xl:col-span-8 flex flex-col md:flex-row gap-4 p-4 bg-white/80 backdrop-blur-3xl border border-navy-50 rounded-[3rem] shadow-2xl">
          <div className="flex-grow relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-200 group-focus-within:text-gold-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH BY TITLE..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-16 pr-8 py-5 bg-navy-50/30 border-2 border-transparent focus:border-gold-500 rounded-[2rem] text-navy-950 placeholder:text-navy-200 font-bold text-[10px] uppercase tracking-[0.2em] focus:outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative group min-w-[220px]">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-200 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full pl-16 pr-12 py-5 bg-navy-50/30 border-2 border-transparent focus:border-gold-500 rounded-[2rem] font-black text-[9px] text-navy-950 uppercase tracking-[0.2em] focus:outline-none transition-all appearance-none cursor-pointer shadow-inner"
              >
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* View & Visibility Control */}
        <div className="xl:col-span-4 flex items-center justify-between p-4 bg-white/80 backdrop-blur-3xl border border-navy-50 rounded-[3rem] shadow-2xl">
          <div className="flex bg-navy-50/50 p-1.5 rounded-[2rem] border border-navy-100 shadow-inner">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-4 rounded-[1.5rem] transition-all duration-300',
                viewMode === 'grid' ? 'bg-navy-950 text-gold-500 shadow-xl scale-105' : 'text-navy-300 hover:text-navy-950'
              )}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-4 rounded-[1.5rem] transition-all duration-300',
                viewMode === 'list' ? 'bg-navy-950 text-gold-500 shadow-xl scale-105' : 'text-navy-300 hover:text-navy-950'
              )}
            >
              <List size={18} />
            </button>
          </div>

          <div className="flex bg-navy-50/50 p-1.5 rounded-[2.5rem] border border-navy-100 shadow-inner overflow-hidden">
            {[
              { id: 'live', icon: Globe, label: 'Live' },
              { id: 'hidden', icon: EyeOff, label: 'Hidden' },
              { id: 'all', icon: Filter, label: 'All' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => { setVisibilityFilter(btn.id as any); setCurrentPage(1); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest transition-all",
                  visibilityFilter === btn.id ? "bg-navy-950 text-gold-500 shadow-lg scale-105" : "text-navy-300 hover:text-navy-950"
                )}
              >
                <btn.icon size={12} />
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-Density Asset Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group bg-white rounded-[1.8rem] shadow-[0_10px_30px_rgba(20,20,35,0.02)] border border-navy-50 overflow-hidden hover:border-gold-500/50 hover:shadow-[0_25px_50px_rgba(251,191,36,0.08)] transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-navy-50/50">
                <LazyImage
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute top-3 left-3">
                   <div className={cn("w-2 h-2 rounded-full ring-2 ring-white shadow-lg animate-pulse", image.isPublic ? "bg-emerald-500" : "bg-rose-500")} />
                </div>

                <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-[1px]">
                  <button onClick={(e) => { e.stopPropagation(); handleToggleVisibility(image); }} className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95", image.isPublic ? "bg-emerald-500 text-white" : "bg-white text-navy-400")}>
                    <Eye size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteImage(image.id); }} className="w-10 h-10 bg-white text-rose-600 rounded-xl flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 hover:bg-rose-600 hover:text-white">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-black text-navy-950 text-[10px] uppercase tracking-tight line-clamp-1 group-hover:text-gold-600 transition-colors">
                  {image.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-navy-50">
                   <div className="space-y-0">
                      <p className="text-[6px] font-black text-navy-200 uppercase tracking-widest leading-none">DIM</p>
                      <p className="text-[8px] font-black text-navy-900 uppercase tracking-tighter whitespace-nowrap">{image.dimensions || 'Opt'}</p>
                   </div>
                   <div className="space-y-0 text-right">
                      <p className="text-[6px] font-black text-navy-200 uppercase tracking-widest leading-none">SIZE</p>
                      <p className="text-[8px] font-black text-gold-600 uppercase tracking-tighter whitespace-nowrap">{image.size}</p>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-navy-50 rounded-[4rem] overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-700">
          <table className="w-full text-left border-collapse">
            <thead className="bg-navy-50/30">
              <tr>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-navy-400">File Payload Identity</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-navy-400">Classification</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-navy-400">Archival Metrics</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-navy-400 text-right">Control Registry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {images.map((image) => (
                <tr key={image.id} className="group hover:bg-navy-50/20 transition-all">
                  <td className="p-8">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-[2rem] bg-navy-50 overflow-hidden flex-shrink-0 border-4 border-white shadow-2xl group-hover:scale-105 transition-transform">
                        <img src={image.src} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-navy-950 uppercase italic text-sm tracking-tight">{image.title}</p>
                        <p className="text-[9px] font-black text-navy-300 uppercase tracking-widest">Sync: {new Date(image.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="px-5 py-2 bg-white text-navy-950 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 border-navy-50 shadow-sm group-hover:border-gold-500/30 transition-colors">
                      {image.category}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-black text-navy-950 uppercase tracking-tighter">{image.dimensions || 'Calculated'}</p>
                      <p className="text-[9px] font-bold text-gold-600 uppercase tracking-widest">{image.size}</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center justify-end gap-4">
                       <button onClick={() => handleToggleVisibility(image)} className={cn("p-4 rounded-2xl border-2 transition-all hover:scale-110", image.isPublic ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-navy-300 border-navy-50")}>
                         {image.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                       </button>
                       <button onClick={() => handleDeleteImage(image.id)} className="p-4 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl border-2 border-rose-100 shadow-sm transition-all hover:scale-110"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Command Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-12 py-10 bg-navy-950 rounded-[3rem] text-white shadow-3xl mt-12">
          <div className="space-y-1">
             <p className="text-[9px] font-black text-navy-400 uppercase tracking-[0.4em]">Archival Page Registry</p>
             <p className="text-xl font-black text-white italic tracking-tighter">DISPLAYING SECTOR <span className="text-gold-500">{currentPage}</span> / {totalPages}</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-10 py-5 border-2 border-navy-800 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-navy-200 hover:bg-white hover:text-navy-950 disabled:opacity-10 transition-all"
            >
              Previous Sector
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-10 py-5 bg-gold-500 text-navy-950 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_15px_40px_rgba(251,191,36,0.2)] disabled:opacity-10"
            >
              Next Sector
            </button>
          </div>
        </div>
      )}

      {/* Empty State Registry */}
      {images.length === 0 && !loading && (
        <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-navy-50 border-dashed animate-in fade-in duration-1000">
          <div className="w-24 h-24 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-2xl">
            <Filter size={40} className="text-navy-200" />
          </div>
          <p className="text-xs font-black text-navy-300 uppercase tracking-[0.5em] italic mb-10">No archival signatures detected in this sector.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setVisibilityFilter('all'); }} className="px-12 py-6 bg-navy-950 text-gold-500 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-gold-500 hover:text-navy-950 transition-all shadow-2xl">
            Reset All Uplink Sensors
          </button>
        </div>
      )}

      {/* High-Contrast Preview Stage */}
      {previewImage && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-navy-950/98 backdrop-blur-3xl animate-in fade-in duration-500 p-4 md:p-12">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-10 right-10 z-[2010] w-14 h-14 bg-white/10 hover:bg-gold-500 text-white hover:text-navy-950 rounded-2xl flex items-center justify-center transition-all hover:rotate-90 active:scale-95 border border-white/10 shadow-2xl"
          >
            <X size={28} />
          </button>

          <div className="relative w-full max-w-7xl h-full max-h-[85vh] flex flex-col lg:flex-row bg-navy-900 rounded-[4rem] overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] border border-white/5 animate-in zoom-in-95 duration-500">
            <div className="flex-grow bg-black/60 relative flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_70%)] opacity-30" />
              <img src={previewImage.src} alt={previewImage.alt} className="relative z-10 w-full h-full object-contain p-8 md:p-20 select-none pointer-events-none" />
            </div>

            <div className="w-full lg:w-[450px] bg-navy-950 p-10 md:p-16 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-gold-600/20 text-gold-500 text-[11px] font-black uppercase tracking-widest rounded-xl border border-gold-600/30">{previewImage.category || 'General Asset'}</span>
                    <span className={cn("px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl border", previewImage.isPublic ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30")}>
                      {previewImage.isPublic ? 'Archive Active' : 'Restricted Access'}
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.85] break-words">{previewImage.title || 'Untitled Asset'}</h3>
                </div>
                <div className="space-y-6">
                  <p className="text-[11px] font-black text-gold-500 uppercase tracking-widest border-l-3 border-gold-600 pl-5 py-1">Mission Context</p>
                  <p className="text-sm font-bold text-navy-200/50 leading-relaxed uppercase tracking-wide">{previewImage.description || 'No detailed mission context provided for this visual archive entry.'}</p>
                </div>
                <div className="grid grid-cols-2 gap-10 pt-12 border-t border-white/10">
                  <div className="space-y-2"><p className="text-[9px] font-black text-navy-500 uppercase tracking-[0.2em]">Metric: Resolution</p><p className="text-xs font-black text-white uppercase tracking-widest">{previewImage.dimensions && previewImage.dimensions !== 'undefinedxundefined' ? previewImage.dimensions : 'Optimized Ratio'}</p></div>
                  <div className="space-y-2"><p className="text-[9px] font-black text-navy-500 uppercase tracking-[0.2em]">Metric: Payload</p><p className="text-xs font-black text-white uppercase tracking-widest">{previewImage.size || 'Fixed Weight'}</p></div>
                </div>
              </div>
              <div className="pt-12 mt-12 border-t border-white/10 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-navy-500 uppercase tracking-[0.3em]">Sync Timestamp</p>
                  <p className="text-xs font-black text-gold-500 uppercase italic tracking-widest bg-gold-500/5 px-4 py-2 rounded-lg inline-block border border-gold-500/10">{previewImage.uploadDate ? new Date(previewImage.uploadDate).toLocaleDateString() : 'Historical Asset'}</p>
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center text-gold-500 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"><CheckCircle2 size={32} /></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>; }