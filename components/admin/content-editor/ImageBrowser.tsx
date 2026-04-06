'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, Search, Image as ImageIcon, CheckCircle2, 
  Trash2, Upload, ExternalLink, Info, Filter
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface ImageAsset {
  _id: string;
  url: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  createdAt?: string;
}

interface ImageBrowserProps {
  onClose: () => void;
  onSelect: (url: string) => void;
  availableImages: ImageAsset[];
  loadingImages: boolean;
}

export default function ImageBrowser({ 
  onClose, 
  onSelect, 
  availableImages, 
  loadingImages 
}: ImageBrowserProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = availableImages.filter(img => 
    img.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (img.publicId && img.publicId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-500">
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-3xl" 
        onClick={onClose} 
      />
      
      <Card className="relative z-10 w-full max-w-7xl h-[85vh] bg-white rounded-[4rem] shadow-[0_100px_300px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
        {/* Header Area */}
        <div className="p-10 md:p-14 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-navy-950 rounded-[1.5rem] flex items-center justify-center text-gold-500 shadow-2xl rotate-3">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-navy-950 uppercase italic tracking-tight">Your Image Library</h2>
              <div className="flex items-center gap-3 mt-1.5 font-bold uppercase tracking-widest text-gray-400">
                <span className="text-[10px]">{availableImages.length} Photos Found</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Secure Sync
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for photos on server..."
                className="w-full h-16 pl-16 pr-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-bold text-sm focus:ring-4 focus:ring-gold-500/10 transition-all placeholder:text-gray-300"
              />
            </div>
            <button 
              onClick={onClose}
              className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 hover:bg-gold-500 hover:text-white transition-all shadow-sm"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Browser Grid */}
        <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
          {loadingImages ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="w-20 h-20 border-4 border-gray-100 border-t-gold-500 rounded-full animate-spin" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-navy-950 animate-pulse">Accessing Secure Matrix...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-32 h-32 bg-navy-50 rounded-[2.5rem] flex items-center justify-center text-navy-200 mb-4 rotate-3">
                <Filter className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">No Matches Found</h3>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-widest max-w-sm mx-auto">
                No photos match your current search script. Try a wider query parameter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
              {filteredImages.map((img) => {
                const isActive = selectedImage === img.url;
                return (
                  <div 
                    key={img._id}
                    onClick={() => setSelectedImage(img.url)}
                    onDoubleClick={() => onSelect(img.url)}
                    className={`group relative aspect-square rounded-[3rem] overflow-hidden cursor-pointer border-4 transition-all duration-500 ${
                      isActive 
                        ? 'border-gold-500 shadow-3xl translate-y-[-8px]' 
                        : 'border-transparent bg-gray-50 hover:border-gray-100 hover:translate-y-[-4px]'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt="Gallery Asset"
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      className={`object-contain transition-all duration-700 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105 opacity-80 group-hover:opacity-100'
                      }`}
                    />
                    
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end`}>
                      <div className="flex items-center justify-between text-white">
                         <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                           {formatFileSize(img.bytes || 0)}
                         </span>
                         <span className="text-[8px] font-black uppercase tracking-widest bg-gold-600 px-2 py-1 rounded-lg">
                           {img.format || 'PHOTO'}
                         </span>
                      </div>
                    </div>

                    {isActive && (
                      <div className="absolute inset-0 bg-gold-500/20 backdrop-blur-sm flex items-center justify-center scale-in-center">
                        <div className="w-16 h-16 bg-gold-500 text-navy-950 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Area with Meta Info */}
        <div className="p-10 md:p-14 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-6">
             <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm group hover:border-gold-400 transition-colors">
                <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-navy-950 group-hover:bg-navy-950 group-hover:text-white transition-all">
                   <Info className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-navy-950 uppercase tracking-widest">Protocol Tip</p>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic group-hover:text-navy-950">Double-click to select instantly.</p>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
             <button 
                onClick={onClose}
                className="px-8 py-5 bg-navy-50 text-navy-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-navy-100 hover:bg-gray-100 transition-all font-bold"
             >
                Cancel Protocol
             </button>
             <button 
                disabled={!selectedImage}
                onClick={() => selectedImage && onSelect(selectedImage)}
                className={`px-12 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 ${
                  selectedImage 
                    ? 'bg-navy-950 text-gold-500 hover:bg-gold-500 hover:text-navy-950 scale-105' 
                    : 'bg-gray-100 text-gray-300 grayscale cursor-not-allowed'
                }`}
             >
                <CheckCircle2 className="w-4 h-4" />
                Apply Selection
             </button>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        .scale-in-center {
          animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
        @keyframes scale-in-center {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
