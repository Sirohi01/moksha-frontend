'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle2, ArrowLeft, Image as ImageIcon, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { ActionButton } from '@/components/admin/AdminComponents';
import { cn } from '@/lib/utils';
import { galleryAPI } from '@/lib/api';

interface UploadItem {
  id: string;
  file: File;
  preview: string;
  title: string;
  altText: string;
  description: string;
  isPublic: boolean;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function GalleryUploadPage() {
  const router = useRouter();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [globalCategory, setGlobalCategory] = useState('gallery');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newItems: UploadItem[] = selectedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        title: file.name.split('.')[0].replace(/[-_]/g, ' ').toUpperCase(),
        altText: '',
        description: '',
        isPublic: true,
        status: 'idle'
      }));
      setItems(prev => [...prev, ...newItems]);
      setError('');
    }
    // Reset input
    e.target.value = '';
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const updateItem = (id: string, updates: Partial<UploadItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const isFormValid = items.length > 0 && items.every(item => item.altText.trim() && item.title.trim());

  const handleSubmit = async () => {
    if (!isFormValid || isUploading) return;

    try {
      setIsUploading(true);
      setError('');
      let successCount = 0;

      for (const item of items) {
        if (item.status === 'success') continue;

        updateItem(item.id, { status: 'uploading' });
        
        const formData = new FormData();
        formData.append('image', item.file);
        formData.append('title', item.title);
        formData.append('description', item.description);
        formData.append('category', globalCategory);
        formData.append('altText', item.altText);
        formData.append('isPublic', String(item.isPublic));

        try {
          const result = await galleryAPI.uploadImage(formData);
          if (result.success) {
            updateItem(item.id, { status: 'success' });
            successCount++;
          }
        } catch (err: any) {
          updateItem(item.id, { status: 'error', error: err.message });
        }
      }

      if (successCount === items.length) {
        setSuccessMessage(`${successCount} Assets successfully synchronized!`);
        setTimeout(() => router.push('/admin/gallery'), 2000);
      } else {
        setError(`Partial upload completed. ${successCount}/${items.length} successful.`);
      }
    } catch (err: any) {
      setError(err.message || 'Bulk upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-navy-50 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-navy-950 rounded-xl flex items-center justify-center text-gold-500 shadow-lg">
              <Upload className="w-5 h-5" />
            </div>
            <h1 className="text-4xl font-black text-navy-950 uppercase italic tracking-tighter">Bulk Archive Sync</h1>
          </div>
          <p className="text-navy-500 font-bold text-xs uppercase tracking-[0.2em] italic">
            Synchronize multiple visual assets with unique SEO metadata.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/gallery')}
          className="flex items-center gap-2 text-navy-400 hover:text-navy-950 font-black uppercase text-[10px] tracking-widest transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Archive Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-navy-50 shadow-sm space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em] px-1">
                Common Category
              </label>
              <select
                value={globalCategory}
                onChange={(e) => setGlobalCategory(e.target.value)}
                className="w-full px-6 py-5 bg-stone-50 border-2 border-transparent border-b-navy-100 focus:border-gold-500 focus:bg-white transition-all duration-300 text-sm font-black text-navy-950 uppercase tracking-widest cursor-pointer"
              >
                <option value="gallery">General Gallery</option>
                <option value="services">Operational Services</option>
                <option value="community">Social Impact</option>
                <option value="events">Mission Events</option>
                <option value="volunteers">Volunteer Support</option>
              </select>
            </div>

            <div
              onClick={() => document.getElementById('bulk-file-input')?.click()}
              className="w-full py-10 bg-navy-950 text-gold-500 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gold-600 hover:text-navy-950 transition-all active:scale-95 group shadow-2xl"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add New Assets</span>
              <input
                id="bulk-file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Protocol Sync</span>
              </div>
              <p className="text-[9px] font-bold text-rose-500 uppercase leading-relaxed tracking-tight italic">
                All individual assets must contain verified SEO Alt Text before synchronization is permitted.
              </p>
            </div>

            <ActionButton
              variant="primary"
              onClick={handleSubmit}
              loading={isUploading}
              disabled={!isFormValid || isUploading}
              className="w-full py-6 rounded-[2rem] shadow-xl"
            >
              {isUploading ? 'SYNCHRONIZING...' : `SYNC ${items.length} ASSETS`}
            </ActionButton>
          </div>
        </div>

        {/* Assets List */}
        <div className="lg:col-span-8 space-y-6">
          {items.length === 0 ? (
            <div className="h-[400px] bg-navy-50/20 border-2 border-dashed border-navy-100 rounded-[3rem] flex flex-col items-center justify-center text-navy-200">
              <Upload size={40} className="mb-4 stroke-[1px]" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Assets Selected for Staging</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "bg-white p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col md:flex-row gap-8 items-center",
                    item.status === 'success' ? "border-emerald-200 bg-emerald-50/30" : "border-navy-50 hover:border-gold-200"
                  )}
                >
                  <div className="relative w-32 aspect-square rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-white">
                    <Image src={item.preview} fill className="object-cover" alt="Preview" unoptimized />
                    {item.status === 'success' && (
                      <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center text-white">
                        <CheckCircle2 size={32} />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-navy-300 uppercase tracking-widest ml-1">Archive Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(item.id, { title: e.target.value })}
                          className="w-full px-4 py-3 bg-stone-50 border-b-2 border-transparent focus:border-gold-500 rounded-xl text-[10px] font-black text-navy-950 uppercase tracking-widest transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                           <label className="text-[8px] font-black text-navy-300 uppercase tracking-widest">SEO Alt Text *</label>
                           {!item.altText.trim() && <span className="text-[7px] font-black text-rose-500 uppercase tracking-tighter animate-pulse">Required</span>}
                        </div>
                        <input
                          type="text"
                          required
                          value={item.altText}
                          placeholder="DESCRIPTION FOR SEO..."
                          onChange={(e) => updateItem(item.id, { altText: e.target.value })}
                          className={cn(
                            "w-full px-4 py-3 bg-stone-50 border-b-2 rounded-xl text-[10px] font-black text-navy-950 uppercase tracking-widest transition-all",
                            !item.altText.trim() ? "border-rose-200 focus:border-rose-400" : "border-transparent focus:border-gold-500"
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[8px] font-black text-navy-300 uppercase tracking-widest">Narrative Context (Description)</label>
                        <span className={cn(
                          "text-[8px] font-black tracking-widest",
                          item.description.length > 155 ? "text-rose-500" : "text-gold-600"
                        )}>
                          {item.description.length}/155
                        </span>
                      </div>
                      <textarea
                        value={item.description}
                        maxLength={160}
                        onChange={(e) => updateItem(item.id, { description: e.target.value.slice(0, 155) })}
                        rows={2}
                        className="w-full px-4 py-3 bg-stone-50 border-b-2 border-transparent focus:border-gold-500 rounded-xl text-[10px] font-bold text-navy-950 uppercase tracking-tight resize-none leading-relaxed"
                        placeholder="ADD CONTEXT FOR THIS ASSET..."
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isUploading || item.status === 'success'}
                    onClick={() => removeItem(item.id)}
                    className="p-4 text-navy-200 hover:text-rose-500 transition-colors disabled:opacity-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Notifications */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
        {error && (
          <div className="bg-rose-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
            <AlertCircle size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
            <CheckCircle2 size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
