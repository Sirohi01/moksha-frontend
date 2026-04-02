'use client';

import React from 'react';
import Image from 'next/image';
import { 
  X, Eye, Copy, Link as LinkIcon, Zap, Upload, Loader2,
  Bold, Italic, Type, List, AlignLeft, Info, PlusCircle,
  GripVertical, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronRight, Settings2
} from 'lucide-react';
import { ASPECT_RATIOS, getRatioRes } from '@/lib/ratios';
import { cn } from '@/lib/utils';

interface FieldSchema {
  type: 'text' | 'textarea' | 'number' | 'url' | 'email' | 'array' | 'object' | 'boolean';
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface FieldRendererProps {
  sectionId: string;
  fieldPath: string;
  fieldSchema: FieldSchema;
  value: any;
  updateFieldValue: (sectionId: string, fieldPath: string, newValue: any) => void;
  uploadingImage: string | null;
  handleImageUpload: (file: File, sectionId: string, fieldPath: string) => Promise<void>;
  setSuccessMessage: (msg: string) => void;
  seoData: any;
  setSeoData: React.Dispatch<React.SetStateAction<any>>;
  getSafeSrc: (src: any) => string;
}

export default function FieldRenderer(props: FieldRendererProps) {
  const {
    sectionId, fieldPath, fieldSchema, value, updateFieldValue,
    uploadingImage, handleImageUpload, setSuccessMessage, 
    seoData, setSeoData, getSafeSrc
  } = props;

  // Track dynamic aspect ratio preference
  const aspectChoice: string = (value as any)?.aspectRatio || '';
  const currentRatioClass = aspectChoice ? (ASPECT_RATIOS as any)[aspectChoice]?.value : '';
  const currentResTarget = aspectChoice ? (ASPECT_RATIOS as any)[aspectChoice]?.res : null;

  const isImageField = (() => {
    const lowerPath = fieldPath.toLowerCase();
    const nameMatches = lowerPath.includes('image') || 
                       lowerPath.includes('img') || 
                       lowerPath.includes('banner') || 
                       lowerPath.includes('avatar') || 
                       lowerPath.includes('photo') || 
                       lowerPath.includes('logo') || 
                       lowerPath.includes('icon') ||
                       lowerPath.includes('slide') ||
                       lowerPath.includes('gallery') ||
                       lowerPath.includes('thumb') ||
                       lowerPath.includes('media');

    const isValidImagePath = (val: any) => {
      if (!val || typeof val !== 'string') return false;
      const lowerVal = val.toLowerCase();
      
      const isProtocolMatch = val.startsWith('/') || val.startsWith('http');
      const isExtensionMatch = lowerVal.endsWith('.png') || lowerVal.endsWith('.jpg') || 
                               lowerVal.endsWith('.jpeg') || lowerVal.endsWith('.svg') || 
                               lowerVal.endsWith('.webp') || lowerVal.endsWith('.gif');
      const isCloudinary = val.includes('cloudinary');

      // Must have protocol AND (must have image extension OR be a cloudinary link)
      return isProtocolMatch && (isExtensionMatch || isCloudinary);
    };

    if (nameMatches) {
      if (!value) return true;
      return isValidImagePath(value);
    }
    return isValidImagePath(value);
  })();

  const getAspectHint = () => {
    if (currentResTarget) return `SEO TASK: ${currentResTarget} (Custom Ratio)`;
    
    const lowerPath = fieldPath.toLowerCase();
    const section = sectionId.toLowerCase();
    
    // Default Heuristics (if no custom ratio chosen)
    if (section.includes('hero') || lowerPath.includes('slide')) return "SEO TASK: 1620 x 700 px (Hero Resolution)";
    if (section.includes('about')) return "SEO TASK: 1000 x 1000 px (Profile Resolution)";
    if (section.includes('service') || section.includes('campaign')) return "SEO TASK: 1200 x 800 px (Service Resolution)";
    if (lowerPath.includes('logo')) return "SEO TASK: 400 x 200 px (Logo/Vector Resolution)";
    if (lowerPath.includes('banner') || section.includes('join')) return "SEO TASK: 1920 x 800 px (Wide Resolution)";
    
    return "SEO TASK: 1200 x 800 px (Standard View)";
  };

  const isIconField = fieldSchema.label.toLowerCase().includes('icon');
  
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const formatLabel = (key: string) => {
    return key.split(/(?=[A-Z])|_/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  // --- RENDERING PRIORITY ---

  // 1. Boolean
  if (fieldSchema.type === 'boolean') {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateFieldValue(sectionId, fieldPath, !value)}
          className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${
            value ? 'bg-gold-500 shadow-[0_0_15px_rgba(244,196,48,0.3)]' : 'bg-gray-200'
          }`}
        >
          <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-all transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-navy-950 italic">
          {value ? 'Active' : 'Disabled'}
        </span>
      </div>
    );
  }

  // 2. Object (Recursive)
  if (fieldSchema.type === 'object' && typeof value === 'object' && value !== null) {
     return (
        <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] space-y-8 animate-in fade-in duration-500">
           {Object.entries(value).map(([childKey, childValue]) => (
              <div key={childKey} className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-navy-700 ml-1">{formatLabel(childKey)}</label>
                 <FieldRenderer 
                   {...props} 
                   fieldPath={`${fieldPath}.${childKey}`} 
                   fieldSchema={{ 
                     type: typeof childValue === 'object' ? (Array.isArray(childValue) ? 'array' : 'object') : (typeof childValue === 'string' && childValue.length > 200 ? 'textarea' : 'text'),
                     label: formatLabel(childKey)
                   }}
                   value={childValue}
                 />
              </div>
           ))}
        </div>
     );
  }

  // 3. Array (List Editor)
  if (fieldSchema.type === 'array' && Array.isArray(value)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gold-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-navy-950 italic">{value.length} Items Listed</span>
           </div>
           <button 
             onClick={() => {
                const newItem = typeof value[0] === 'object' ? JSON.parse(JSON.stringify(value[0])) : '';
                updateFieldValue(sectionId, fieldPath, [...value, newItem]);
             }}
             className="flex items-center gap-2 bg-navy-950 text-gold-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gold-500 hover:text-navy-950 transition-all shadow-lg"
           >
             <PlusCircle className="w-3.5 h-3.5" />
             Add Node
           </button>
        </div>

        <div className="space-y-4">
          {value.map((item, index) => (
            <div key={index} className="relative group/item bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-navy-100 transition-all">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-all flex flex-col gap-1">
                 <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 hover:text-navy-950 cursor-grab">
                    <GripVertical className="w-4 h-4" />
                 </div>
              </div>
              
              <div className="pl-6 pr-12 space-y-4">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-gold-600 bg-gold-50 px-3 py-1 rounded-full uppercase tracking-widest">Node {index + 1}</span>
                    <button 
                      onClick={() => {
                        const newList = [...value];
                        newList.splice(index, 1);
                        updateFieldValue(sectionId, fieldPath, newList);
                      }}
                      className="w-8 h-8 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>

                 <FieldRenderer 
                   {...props} 
                   fieldPath={`${fieldPath}.${index}`} 
                   fieldSchema={{ 
                     type: typeof item === 'object' ? (Array.isArray(item) ? 'array' : 'object') : 'text',
                     label: `Item ${index + 1}`
                   }}
                   value={item}
                 />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getAspectClass = () => {
    const hint = getAspectHint();
    if (hint.includes('1620 x 700')) return "aspect-[1620/700]";
    if (hint.includes('1:1')) return "aspect-square";
    if (hint.includes('3:2')) return "aspect-[3/2]";
    if (hint.includes('10:13')) return "aspect-[10/13]";
    return "aspect-video";
  };

  // 4. Image (Special Case - MUST BE BEFORE TEXTAREA)
  if (isImageField && !isIconField && !fieldPath.toLowerCase().includes('youtubeid')) {
    const src = typeof value === 'string' ? value : (value as any)?.src || '';
    return (
      <div className="space-y-6">
        {/* Adaptive Controls */}
        <div className="flex items-center gap-4 mb-4">
           <div className="flex items-center gap-2 bg-navy-50 px-4 py-2.5 rounded-xl border border-navy-100">
              <Settings2 className="w-3.5 h-3.5 text-navy-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-navy-950">Container Protocol</span>
           </div>
           <div className="flex flex-wrap gap-2">
              {Object.entries(ASPECT_RATIOS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    const newValue = typeof value === 'string' ? { src: value, aspectRatio: key } : { ...value, aspectRatio: key };
                    updateFieldValue(sectionId, fieldPath, newValue);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    aspectChoice === key 
                      ? "bg-gold-500 text-navy-950 shadow-md ring-2 ring-gold-500/20" 
                      : "bg-white text-navy-400 border border-gray-100 hover:bg-gray-50"
                  )}
                >
                  {config.label}
                </button>
              ))}
           </div>
        </div>

        {src && (
          <div className="relative group/image max-w-4xl">
            <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-100 bg-navy-50 shadow-2xl transition-all hover:border-gold-500/20">
              <div className={`${getAspectClass()} relative`}>
                <Image
                  src={src}
                  alt={`Preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain transition-transform duration-700 group-hover/image:scale-105 p-4"
                />
                <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => updateFieldValue(sectionId, fieldPath, '')}
                      className="w-10 h-10 bg-rose-500 rounded-xl hover:bg-rose-600 transition-all transform active:scale-90 flex items-center justify-center shadow-lg"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <a href={src} target="_blank" rel="noopener noreferrer" 
                         className="w-10 h-10 bg-white rounded-xl hover:bg-gold-500 hover:text-white transition-all flex items-center justify-center shadow-lg text-navy-950">
                        <Eye className="w-5 h-5" />
                      </a>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">Cloud Memory Linked</span>
                       <span className="text-[8px] font-bold text-gold-500 uppercase tracking-widest px-2 italic">{getAspectHint()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Search Image Description (Alt Text)</label>
                    <div className="flex items-center gap-1.5 text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                       <Zap className="w-2.5 h-2.5" /> Google Sync
                    </div>
                 </div>
                 <input
                   type="text"
                   value={seoData?.imageAltMappings?.[src] || ''}
                   onChange={(e) => {
                     const newAlt = e.target.value;
                     setSeoData((prev: any) => ({
                       ...prev,
                       imageAltMappings: { ...prev.imageAltMappings, [src]: newAlt }
                     }));
                   }}
                   className="w-full h-12 px-6 bg-white border border-slate-200 rounded-[1.25rem] text-xs font-bold focus:ring-4 focus:ring-gold-500/10 transition-all"
                   placeholder="Describe this image for Google..."
                 />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, sectionId, fieldPath);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={!!uploadingImage}
            />
            <div className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all ${
              uploadingImage === fieldPath ? 'border-gold-400 bg-gold-50' : 'border-slate-200 bg-slate-50 hover:bg-gold-50 hover:border-gold-400 shadow-sm'
            }`}>
              <div className="flex flex-col items-center gap-4">
                {uploadingImage === fieldPath ? (
                  <Loader2 className="w-10 h-10 animate-spin text-gold-600" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-gold-500 transition-colors" />
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase tracking-widest block">Upload New Asset</span>
                       <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest block">Limit: No Limit</span>
                       <span className="text-[8px] font-bold text-navy-400 uppercase tracking-widest block italic">{getAspectHint()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-navy-50 hover:border-navy-200 transition-all">
             <LinkIcon className="w-8 h-8 text-slate-300 group-hover:text-navy-950 transition-colors" />
             <span className="text-[10px] font-black uppercase tracking-widest">Library Search</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Textarea
  if (fieldSchema.type === 'textarea') {
    return (
      <div className="space-y-2">
        <textarea
          value={value || ''}
          onChange={(e) => updateFieldValue(sectionId, fieldPath, e.target.value)}
          className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all min-h-[160px] leading-relaxed"
          placeholder={fieldSchema.placeholder || `Enter Content...`}
        />
        <div className="flex items-center justify-between px-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
           <span>Standard Block Content</span>
           <span className="font-mono">{(value || '').length} CHARS</span>
        </div>
      </div>
    );
  }

  // 6. Generic Text/Number
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type={fieldSchema.type === 'number' ? 'number' : 'text'}
          value={value || ''}
          onChange={(e) => updateFieldValue(sectionId, fieldPath, e.target.value)}
          className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all placeholder:text-gray-300"
          placeholder={fieldSchema.placeholder || `Enter Parameter...`}
        />
        {typeof value === 'string' && value.startsWith('http') && (
           <a href={value} target="_blank" rel="noopener noreferrer" 
              className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-navy-400 hover:text-navy-950 shadow-sm transition-all">
              <ExternalLink className="w-4 h-4" />
           </a>
        )}
      </div>

      {fieldPath.toLowerCase().includes('youtubeid') && value && (
        <div className="mt-4 p-8 bg-navy-950 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between mb-6 relative z-10">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Video Stream Engine</span>
             <span className="text-[10px] font-mono text-red-500">ID: {extractYoutubeId(value)}</span>
          </div>
          <div className="aspect-video relative rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${extractYoutubeId(value)}?rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

function ExternalLink({ className }: { className?: string }) {
   return (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
   );
}
