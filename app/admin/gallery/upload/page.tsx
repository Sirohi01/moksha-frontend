'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle2, ArrowLeft, Image as ImageIcon, Eye, Copy, Loader2 } from 'lucide-react';
import { ActionButton } from '@/components/admin/AdminComponents';
import { cn } from '@/lib/utils';
import { galleryAPI } from '@/lib/api';

export default function GalleryUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('gallery');
  const [isPublic, setIsPublic] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setIsUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('altText', altText);
      formData.append('isPublic', String(isPublic));

      const result = await galleryAPI.uploadImage(formData);

      if (result.success) {
        setSuccessMessage('Asset successfully synchronized with the archive!');
        setTimeout(() => {
          router.push('/admin/gallery');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-navy-50 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-navy-950 rounded-xl flex items-center justify-center text-gold-500 shadow-lg">
              <Upload className="w-5 h-5" />
            </div>
            <h1 className="text-4xl font-black text-navy-950 uppercase italic tracking-tighter">Upload Assets</h1>
          </div>
          <p className="text-navy-500 font-bold text-xs uppercase tracking-[0.2em] italic max-w-md">
            Manage and synchronize visual assets to the project gallery archive.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/gallery')}
          className="flex items-center gap-2 text-navy-400 hover:text-navy-950 font-black uppercase text-[10px] tracking-widest transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-6 text-rose-700 animate-shake">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center font-black">!</span>
            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 text-emerald-700 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <p className="text-xs font-black uppercase tracking-widest">{successMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: Image Selection */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-navy-50 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em]">Visual Archive</label>
              {file && (
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Validated</span>
              )}
            </div>

            <div
              onClick={() => document.getElementById('gallery-file-input')?.click()}
              className={cn(
                "relative aspect-video sm:aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden group shadow-inner",
                preview
                  ? "border-gold-500 bg-stone-50"
                  : "border-navy-100 bg-navy-50/20 hover:border-gold-400 hover:bg-stone-50"
              )}
            >
              {preview ? (
                <>
                  <Image 
                    src={preview} 
                    alt="Current preview" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                    <span className="text-white text-[9px] font-black uppercase tracking-[0.3em] bg-gold-600 px-6 py-3 rounded-full shadow-2xl">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-lg border border-navy-50 group-hover:scale-110 transition-transform duration-500">
                    <ImageIcon className="w-8 h-8 text-navy-950" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-navy-950 uppercase tracking-widest">Select Asset</p>
                    <p className="text-[9px] text-navy-400 font-bold uppercase tracking-widest">JPG, PNG, WEBP | Performance Optimized</p>
                    <p className="text-[8px] text-gold-600 font-black uppercase tracking-widest mt-1 italic">Recommended: 800x800px (1:1 Ratio)</p>
                  </div>
                </div>
              )}
              <input
                id="gallery-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="pt-4 border-t border-navy-50">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 rounded bg-gold-500 flex items-center justify-center text-navy-950 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <p className="text-[10px] font-bold text-navy-500 leading-relaxed uppercase tracking-tight italic">
                  Ensure high-resolution assets for better visual impact across all digital segments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border-2 border-navy-50 shadow-sm space-y-8">

            {/* Title Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em] px-1">
                Asset Title *
              </label>
              <input
                type="text"
                required
                placeholder="E.G. COMMUNITY SUPPORT OPERATION"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-5 bg-stone-50 border-2 border-transparent border-b-navy-100 focus:border-gold-500 focus:bg-white transition-all duration-300 text-sm font-black text-navy-950 placeholder:text-navy-200 uppercase tracking-tight"
              />
            </div>

            {/* Alt Text Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em] px-1">
                  SEO Alt Text *
                </label>
                <span className="text-[8px] text-rose-600 font-black uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 flex items-center gap-1.5 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
                  Strictly Required for SEO Protocol
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="DESCRIBE IMAGE FOR SEARCH ENGINES..."
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-6 py-5 bg-stone-50 border-2 border-transparent border-b-navy-100 focus:border-amber-500 focus:bg-white transition-all duration-300 text-sm font-black text-navy-950 placeholder:text-navy-200 uppercase tracking-tight"
              />
            </div>

            {/* Category Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em] px-1">
                Project Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-6 py-5 bg-stone-50 border-2 border-transparent border-b-navy-100 focus:border-gold-500 focus:bg-white transition-all duration-300 text-sm font-black text-navy-950 appearance-none uppercase tracking-widest cursor-pointer"
                >
                  <option value="gallery">General Gallery</option>
                  <option value="services">Operational Services</option>
                  <option value="community">Social Impact</option>
                  <option value="events">Mission Events</option>
                  <option value="volunteers">Volunteer Support</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gold-600">
                  <ArrowLeft className="w-5 h-5 -rotate-90" />
                </div>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="p-6 bg-navy-50/30 rounded-3xl border-2 border-navy-50 flex items-center justify-between group hover:bg-white hover:border-gold-200 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                  isPublic ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-stone-200 text-stone-500"
                )}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-navy-950 uppercase tracking-widest">Public Visibility</p>
                  <p className="text-[8px] font-bold text-navy-400 uppercase tracking-tighter italic">If enabled, this asset will be live on the public archive.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={cn(
                  "relative w-14 h-8 rounded-full transition-all duration-500",
                  isPublic ? "bg-emerald-500" : "bg-stone-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-md",
                  isPublic ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em] px-1">
                Detailed Context
              </label>
              <textarea
                placeholder="PROVIDE ADDITIONAL CONTEXT FOR THIS ASSET..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-6 py-6 bg-stone-50 border-2 border-transparent border-b-navy-100 focus:border-gold-500 focus:bg-white transition-all duration-300 text-sm font-black text-navy-950 placeholder:text-navy-200 uppercase tracking-widest resize-none leading-relaxed"
              />
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-8 border-t border-navy-50">
              <button
                type="button"
                onClick={() => router.push('/admin/gallery')}
                disabled={isUploading}
                className="text-[10px] font-black text-navy-400 uppercase tracking-widest hover:text-navy-950 transition-colors"
              >
                Abort Sync
              </button>
              <ActionButton
                variant="primary"
                type="submit"
                loading={isUploading}
                disabled={!file || !title}
                size="lg"
                className="w-full sm:w-auto shadow-xl"
              >
                {isUploading ? 'SYNCHRONIZING...' : 'SYNC TO ARCHIVE'}
              </ActionButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
