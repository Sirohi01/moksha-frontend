'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Save,
  ArrowLeft,
  Eye,
  Settings,
  Search,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Type,
  ChevronDown,
  ChevronRight,
  Globe,
  Palette,
  Layout,
  Image as ImageIcon,
  Link,
  Hash,
  AlignLeft,
  ToggleLeft,
  List,
  Folder,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  X,
  Camera,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Star,
  Heart,
  Crown,
  Layers,
  Grid,
  Filter,
  Copy,
  ExternalLink,
  RefreshCw,
  Users,
  ShieldCheck,
  Handshake,
  Flame,
  LayoutDashboard,
  History,
  CheckCircle2,
  Clock,
  ArrowRightCircle,
  Menu,
  PanelLeft,
  PanelRight,
  Maximize2,
  Minimize2,
  Settings2,
  Terminal,
  ChevronUp,
  GripVertical,
  PlusCircle,
  XCircle,
  Layers as LayersIcon
} from 'lucide-react';
import { useRef } from 'react';

// Icon mapping for string icon names from backend
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'Heart': Heart,
    'Users': Users,
    'FileText': FileText,
    'User': Users,
    'Globe': Globe,
    'Settings': Settings,
    'Image': Image,
    'Layout': Layout,
    'Sparkles': Sparkles,
    'Edit3': Edit3,
    'Save': Save,
    'Eye': Eye,
    'Plus': Plus,
    'Trash2': Trash2,
    'Upload': Upload,
    'Search': Search,
    'Star': Star,
    'Crown': Crown,
    'Zap': Zap,
    'Flame': Flame,
    'ShieldCheck': ShieldCheck,
    'Handshake': Handshake,
    'Moksha Sewa - Dignified Final Journey': Heart, // Fallback for complex names
    '[object Object]': FileText // Fallback for object values
  };

  const IconComponent = iconMap[iconName] || FileText;
  return <IconComponent className="w-4 h-4" />;
};

// YouTube ID Extraction Utilities
const extractYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
};

interface FieldSchema {
  type: 'text' | 'textarea' | 'number' | 'url' | 'email' | 'array' | 'object' | 'boolean';
  label: string;
  placeholder?: string;
  required?: boolean;
  arrayItemSchema?: FieldSchema;
  objectSchema?: Record<string, FieldSchema>;
}

interface SectionSchema {
  id: string;
  title: string;
  description?: string;
  fields: Record<string, FieldSchema>;
}

export default function ContentEditor() {
  const searchParams = useSearchParams();
  const pageName = searchParams.get('page') || 'homepage';

  // Robust Image Source Resolver for safe previews
  const getSafeSrc = (imgSource: any) => {
    if (!imgSource) return '';
    if (typeof imgSource === 'string') return imgSource;
    if (typeof imgSource === 'object') {
      if (typeof imgSource.src === 'string') return imgSource.src;
      // Handle deeper nesting if it occurs during recursive mapping
      if (typeof imgSource.src === 'object') return getSafeSrc(imgSource.src);
    }
    return '';
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>({});
  const [pageSchema, setPageSchema] = useState<SectionSchema[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'history'>('content');
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    canonical: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImageField, setSelectedImageField] = useState<{ sectionId: string, fieldPath: string } | null>(null);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(-1);
  const [revisionHistory, setRevisionHistory] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'draft' | 'published' | 'edited'>>({});
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [draggedItem, setDraggedItem] = useState<{ sectionId: string, fieldPath: string, index: number } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchPageData();
  }, [pageName]);

  // Auto-save logic
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(pageData).length > 0) {
        saveChanges(true); // Silent save
      }
    }, 30000); // 30 seconds
    return () => clearInterval(autoSaveInterval);
  }, [pageData]);

  // History tracking
  useEffect(() => {
    if (pageData && Object.keys(pageData).length > 0) {
      const historyEntry = JSON.stringify(pageData);
      setRevisionHistory(prev => {
        if (prev.length > 0 && prev[prev.length - 1] === historyEntry) return prev;
        const newHistory = [...prev, historyEntry].slice(-10); // Keep last 10
        return newHistory;
      });
    }
  }, [pageData]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError('');
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      // Fetch page configuration and schema
      const [configResponse, schemaResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/page-config/${pageName}`),
        fetch(`${API_BASE_URL}/api/page-config/${pageName}/schema`)
      ]);

      let configData = null;
      if (configResponse.ok) {
        configData = await configResponse.json();
        setPageData(configData.data.config);
      } else {
        const errorData = await configResponse.json();
        setError(errorData.message || `Failed to load ${pageName} configuration`);
        return;
      }

      // If schema endpoint exists, use it; otherwise generate from data
      if (schemaResponse.ok) {
        const schemaData = await schemaResponse.json();
        if (schemaData.success && schemaData.data.schemaAvailable) {
          setPageSchema(schemaData.data.schema);
        } else {
          generateSchemaFromData(configData.data.config);
        }
      } else {
        generateSchemaFromData(configData.data.config);
      }

      // Fetch SEO data (optional)
      try {
        const token = localStorage.getItem('adminToken');
        const seoResponse = await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (seoResponse.ok) {
          const seoResult = await seoResponse.json();
          if (seoResult.success && seoResult.data) {
            setSeoData({
              title: seoResult.data.metaTitle || '',
              description: seoResult.data.metaDescription || '',
              keywords: seoResult.data.metaKeywords || '',
              ogImage: seoResult.data.ogImage || '',
              canonical: seoResult.data.canonicalUrl || ''
            });
          }
        }
      } catch (seoError) {
        // SEO data is optional - continue without it
        setSeoData({
          title: '',
          description: '',
          keywords: '',
          ogImage: '',
          canonical: ''
        });
      }

    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError(error.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const generateSchemaFromData = (data: any) => {
    const schema: SectionSchema[] = [];

    Object.entries(data).forEach(([sectionKey, sectionValue]: [string, any]) => {
      const sectionSchema: SectionSchema = {
        id: sectionKey,
        title: formatTitle(sectionKey),
        fields: generateFieldsSchema(sectionValue)
      };
      schema.push(sectionSchema);
    });

    setPageSchema(schema);
    // Auto-expand all sections so user can edit immediately
    setExpandedSections(new Set(schema.map(s => s.id)));
  };

  const generateFieldsSchema = (obj: any): Record<string, FieldSchema> => {
    const fields: Record<string, FieldSchema> = {};

    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'string') {
        fields[key] = {
          type: key.includes('email') ? 'email' :
            key.includes('url') || key.includes('href') || key.includes('src') ? 'url' :
              key.includes('description') || key.includes('content') ? 'textarea' : 'text',
          label: formatTitle(key),
          placeholder: `Enter ${formatTitle(key).toLowerCase()}`
        };
      } else if (typeof value === 'number') {
        fields[key] = {
          type: 'number',
          label: formatTitle(key),
          placeholder: `Enter ${formatTitle(key).toLowerCase()}`
        };
      } else if (typeof value === 'boolean') {
        fields[key] = {
          type: 'boolean',
          label: formatTitle(key)
        };
      } else if (Array.isArray(value) && value.length > 0) {
        fields[key] = {
          type: 'array',
          label: formatTitle(key),
          arrayItemSchema: typeof value[0] === 'object' ? {
            type: 'object',
            label: 'Item',
            objectSchema: generateFieldsSchema(value[0])
          } : {
            type: 'text',
            label: 'Item',
            placeholder: 'Enter item'
          }
        };
      } else if (typeof value === 'object' && value !== null) {
        fields[key] = {
          type: 'object',
          label: formatTitle(key),
          objectSchema: generateFieldsSchema(value)
        };
      }
    });

    return fields;
  };

  const formatTitle = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const updateFieldValue = (sectionId: string, fieldPath: string, value: any) => {
    console.log('🔧 Updating field:', { sectionId, fieldPath, value });
    setPageData((prev: any) => {
      const newData = { ...prev };

      // Ensure section exists
      if (!newData[sectionId]) {
        newData[sectionId] = {};
      }

      const pathParts = fieldPath.split('.');

      // Start from the section, not from root
      let current = newData[sectionId];
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = value;
      console.log('✅ Updated pageData:', newData);
      return newData;
    });
  };

  const getFieldIcon = (fieldType: string, fieldKey: string) => {
    if (fieldKey.includes('email')) return <Hash className="w-4 h-4" />;
    if (fieldKey.includes('url') || fieldKey.includes('href') || fieldKey.includes('src')) return <Link className="w-4 h-4" />;
    if (fieldKey.includes('image') || fieldKey.includes('img')) return <ImageIcon className="w-4 h-4" />;

    switch (fieldType) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'textarea': return <AlignLeft className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'email': return <Hash className="w-4 h-4" />;
      case 'url': return <Link className="w-4 h-4" />;
      case 'boolean': return <ToggleLeft className="w-4 h-4" />;
      case 'array': return <List className="w-4 h-4" />;
      case 'object': return <Folder className="w-4 h-4" />;
      default: return <Edit3 className="w-4 h-4" />;
    }
  };

  const getSectionIcon = (sectionId: string) => {
    if (sectionId.includes('hero')) return <Sparkles className="w-5 h-5" />;
    if (sectionId.includes('navbar') || sectionId.includes('nav')) return <Layout className="w-5 h-5" />;
    if (sectionId.includes('footer')) return <Layout className="w-5 h-5" />;
    if (sectionId.includes('social')) return <Globe className="w-5 h-5" />;
    if (sectionId.includes('stats') || sectionId.includes('analytics')) return <FileText className="w-5 h-5" />;
    if (sectionId.includes('gallery') || sectionId.includes('media')) return <ImageIcon className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const fetchAvailableImages = async () => {
    try {
      setLoadingImages(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/gallery`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAvailableImages(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const selectImageFromGallery = (imageUrl: string, sectionId: string, fieldPath: string) => {
    updateFieldValue(sectionId, fieldPath, imageUrl);
    setShowImageBrowser(false);
    setSelectedImageField(null);
    setSuccessMessage('Image selected successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredImages = availableImages.filter(image =>
    !assetSearchQuery ||
    (image.title && image.title.toLowerCase().includes(assetSearchQuery.toLowerCase())) ||
    (image.tags && image.tags.some((tag: string) => tag.toLowerCase().includes(assetSearchQuery.toLowerCase())))
  );

  const uploadImageToCloudinary = async (file: File, fieldPath: string) => {
    try {
      setUploadingImage(fieldPath);
      const formData = new FormData();
      formData.append('image', file);

      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      return result.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageUpload = async (file: File, sectionId: string, fieldPath: string) => {
    try {
      const imageUrl = await uploadImageToCloudinary(file, fieldPath);
      updateFieldValue(sectionId, fieldPath, imageUrl);
      setSuccessMessage('Image uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };
  const renderField = (
    sectionId: string,
    fieldKey: string,
    fieldSchema: FieldSchema,
    value: any,
    fieldPath: string = fieldKey
  ) => {
    const fieldId = `${sectionId}-${fieldPath}`;
    const fieldIcon = getFieldIcon(fieldSchema.type, fieldKey);

    switch (fieldSchema.type) {
      case 'text':
      case 'email':
      case 'url':
        const isImageField = ((fieldKey.includes('image') || fieldKey.includes('img') || fieldKey.includes('src') || fieldKey.includes('photo') || fieldKey.includes('avatar') || fieldKey.includes('slide') || fieldKey.includes('banner') || fieldKey.includes('background') || fieldKey.includes('hero') || fieldKey.includes('thumbnail') || fieldKey.includes('cover') || fieldKey.includes('poster') || fieldKey.includes('logo') || fieldKey.includes('icon')) && !fieldKey.toLowerCase().includes('alt')) ||
          (typeof value === 'string' && (
            value.includes('cloudinary.com') ||
            value.includes('unsplash.com') ||
            value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) ||
            value.startsWith('/gallery/') ||
            value.startsWith('./images/') ||
            value.startsWith('../images/')
          ));

        const isIconField = fieldKey.toLowerCase() === 'icon';

        return (
          <div key={fieldId} className="group">
            <label htmlFor={fieldId} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              {fieldIcon}
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-500">*</span>}
              {isImageField && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Image Field</span>
              )}
              {isIconField && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Icon Field</span>
              )}
              {fieldKey.toLowerCase().includes('youtubeid') && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  YouTube ID
                </span>
              )}
            </label>

            <div className="space-y-3">
              <div className="relative">
                <input
                  id={fieldId}
                  type={fieldSchema.type}
                  value={value || ''}
                  onChange={(e) => updateFieldValue(sectionId, fieldPath, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={fieldKey.toLowerCase().includes('youtubeid') ? "Enter YouTube Video ID (e.g. dQw4w9WgXcQ)" : fieldSchema.placeholder}
                  required={fieldSchema.required}
                />
                {fieldSchema.type === 'url' && value && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                  >
                    <Link className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Icon Preview for Icon Fields */}
              {isIconField && value && (
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-700">Icon Preview:</div>
                    {getIconComponent(value)}
                    <span className="text-sm text-gray-600">{value}</span>
                  </div>
                </div>
              )}

              {/* YouTube Preview */}
              {fieldKey.toLowerCase().includes('youtubeid') && value && (
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-white">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Video Preview</span>
                    </div>
                    <span className="text-xs text-gray-400">ID: {value}</span>
                  </div>
                  <div className="aspect-video relative rounded-md overflow-hidden bg-black border border-white/10">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(value)}?rel=0&modestbranding=1`}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {isImageField && !isIconField && !fieldKey.toLowerCase().includes('youtubeid') && (
                <div className="space-y-4">
                  {value && (
                    <div className="relative group/image">
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm">
                        <div className="aspect-video relative">
                          <Image
                            src={getSafeSrc(value)}
                            alt={`Preview of ${fieldSchema.label}`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover/image:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iI2Q1ZDdkYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                            }}
                          />

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => updateFieldValue(sectionId, fieldPath, '')}
                                className="p-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                                title="Remove image"
                              >
                                <X className="w-4 h-4 text-white" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-white/90 rounded hover:bg-white transition-colors"
                                  title="View full size"
                                >
                                  <Eye className="w-4 h-4 text-gray-700" />
                                </a>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(value);
                                    setSuccessMessage('Image URL copied!');
                                    setTimeout(() => setSuccessMessage(''), 2000);
                                  }}
                                  className="p-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                                  title="Copy URL"
                                >
                                  <Copy className="w-4 h-4 text-white" />
                                </button>
                              </div>

                              <div className="text-white text-xs bg-black/60 rounded px-2 py-1">
                                {typeof value === 'string' && value.includes('cloudinary.com') ? 'CDN' : 'External'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Active Image</span>
                            <span className="text-xs text-gray-500">
                              {typeof value === 'string' && value.includes('cloudinary.com') ? 'Cloudinary CDN' : 'External URL'}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-600 font-mono">
                            {value.length > 60 ? `${value.substring(0, 60)}...` : value}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, sectionId, fieldPath);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingImage === fieldPath}
                      />
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploadingImage === fieldPath
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}>
                        <div className="flex flex-col items-center gap-3">
                          {uploadingImage === fieldPath ? (
                            <>
                              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                              <p className="font-medium text-blue-600">Uploading...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gray-400" />
                              <p className="font-medium text-gray-700">Upload New Image</p>
                              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImageField({ sectionId, fieldPath });
                        setShowImageBrowser(true);
                        fetchAvailableImages();
                      }}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <p className="font-medium text-gray-700">Browse Gallery</p>
                        <p className="text-sm text-gray-500">{availableImages.length} images available</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div key={fieldId} className="group">
            <label htmlFor={fieldId} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy-700 mb-4">
              {fieldIcon}
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative bg-white border border-navy-50 rounded-[1.5rem] overflow-hidden focus-within:ring-4 focus-within:ring-gold-500/10 focus-within:border-gold-500 transition-all">
              {/* Rich Text Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-navy-50/50 border-b border-navy-50">
                <button
                  onClick={() => document.execCommand('bold', false)}
                  className="p-1.5 hover:bg-white rounded transition-colors text-navy-900" title="Bold"
                >
                  <span className="font-bold text-xs">B</span>
                </button>
                <button
                  onClick={() => document.execCommand('italic', false)}
                  className="p-1.5 hover:bg-white rounded transition-colors text-navy-900 italic px-2" title="Italic"
                >
                  <span className="text-xs">I</span>
                </button>
                <button
                  onClick={() => document.execCommand('underline', false)}
                  className="p-1.5 hover:bg-white rounded transition-colors text-navy-900 underline px-2" title="Underline"
                >
                  <span className="text-xs">U</span>
                </button>
                <div className="w-px h-4 bg-navy-100 mx-1" />
                <button
                  onClick={() => document.execCommand('insertUnorderedList', false)}
                  className="p-1.5 hover:bg-white rounded transition-colors text-navy-900" title="Bullet List"
                >
                  <List className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) document.execCommand('createLink', false, url);
                  }}
                  className="p-1.5 hover:bg-white rounded transition-colors text-navy-900" title="Add Link"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>

              <div
                id={fieldId}
                contentEditable
                onBlur={(e) => updateFieldValue(sectionId, fieldPath, e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: value || '' }}
                className="w-full p-5 min-h-[150px] focus:outline-none text-sm text-navy-900 leading-relaxed"
              />

              <div className="absolute bottom-3 right-3 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-md border border-navy-50">
                {value ? `${value.replace(/<[^>]*>/g, '').length} glyphs` : '0 glyphs'}
              </div>
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={fieldId} className="group">
            <label htmlFor={fieldId} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              {fieldIcon}
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={fieldId}
              type="number"
              value={value || ''}
              onChange={(e) => updateFieldValue(sectionId, fieldPath, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={fieldSchema.placeholder}
              required={fieldSchema.required}
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={fieldId} className="group">
            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3">
                {fieldIcon}
                <div>
                  <label htmlFor={fieldId} className="text-sm font-medium text-gray-700 cursor-pointer">
                    {fieldSchema.label}
                  </label>
                  <p className="text-xs text-gray-500">Toggle to enable/disable this feature</p>
                </div>
              </div>
              <div className="relative">
                <input
                  id={fieldId}
                  type="checkbox"
                  checked={value || false}
                  onChange={(e) => updateFieldValue(sectionId, fieldPath, e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => updateFieldValue(sectionId, fieldPath, !value)}
                  className={`w-14 h-7 rounded-full cursor-pointer transition-colors ${value ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform ${value ? 'translate-x-7' : 'translate-x-0.5'
                      } mt-0.5 flex items-center justify-center`}
                  >
                    {value && <CheckCircle className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'array':
        const isImageArray = fieldKey.includes('slide') || fieldKey.includes('image') || fieldKey.includes('gallery') || fieldKey.includes('banner') || fieldKey.includes('photo') ||
          (value && Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' && (
            value[0].includes('cloudinary.com') ||
            value[0].includes('unsplash.com') ||
            value[0].match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) ||
            value[0].startsWith('/gallery/') ||
            value[0].startsWith('./images/')
          ));

        return (
          <div key={fieldId} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {fieldIcon}
                {fieldSchema.label}
                {fieldSchema.required && <span className="text-red-500">*</span>}
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {(value || []).length} items
                </span>
                {isImageArray && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Image Array</span>
                )}
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newArray = [...(value || [])];

                  // Handle empty objects by providing a template based on other items
                  if (fieldSchema.arrayItemSchema?.type === 'object') {
                    if (newArray.length > 0) {
                      // Clone structure of first item but with empty values
                      const template = { ...newArray[0] };
                      Object.keys(template).forEach(k => {
                        if (typeof template[k] === 'string') template[k] = '';
                        else if (typeof template[k] === 'number') template[k] = 0;
                        else if (typeof template[k] === 'boolean') template[k] = false;
                        else if (Array.isArray(template[k])) template[k] = [];
                        else if (typeof template[k] === 'object') template[k] = {};
                      });
                      newArray.push(template);
                    } else {
                      // Hardcoded templates for common page sections if array is empty
                      const commonTemplates: Record<string, any> = {
                        'items': { title: '', duration: '', type: '', year: '', desc: '', image: '', youtubeId: '' },
                        'videos': { title: '', duration: '', thumbnail: '', alt: '', youtubeId: '' },
                        'stories': { title: '', duration: '', type: '', description: '', image: '', imageAlt: '', youtubeId: '' },
                        'festivals': { name: '', subtitle: '', year: '' },
                        'slides': { title: '', image: '', description: '' },
                        'buttons': { text: '', href: '', variant: 'primary' }
                      };

                      const templateKey = Object.keys(commonTemplates).find(tk => fieldPath.includes(tk)) || 'items';
                      newArray.push(commonTemplates[templateKey] || {});
                    }
                  } else {
                    newArray.push('');
                  }
                  updateFieldValue(sectionId, fieldPath, newArray);
                }}
                className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            {isImageArray && (
              <div className="mb-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(value || []).map((imageUrl: string, index: number) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm">
                        <Image
                          src={getSafeSrc(imageUrl)}
                          alt={`${fieldSchema.label} ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iI2Q1ZDdkYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                          }}
                        />

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                          <div className="flex justify-between">
                            <div className="text-white text-sm font-medium bg-black/60 rounded px-2 py-1">
                              #{index + 1}
                            </div>
                            <button
                              onClick={() => {
                                const newArray = [...value];
                                newArray.splice(index, 1);
                                updateFieldValue(sectionId, fieldPath, newArray);
                              }}
                              className="p-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                              title="Remove image"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <a
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 rounded hover:bg-white transition-colors"
                                title="View full size"
                              >
                                <Eye className="w-4 h-4 text-gray-700" />
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(imageUrl);
                                  setSuccessMessage('Image URL copied!');
                                  setTimeout(() => setSuccessMessage(''), 2000);
                                }}
                                className="p-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                                title="Copy URL"
                              >
                                <Copy className="w-4 h-4 text-white" />
                              </button>
                            </div>

                            <div className="text-white text-xs bg-black/60 rounded px-2 py-1">
                              {typeof imageUrl === 'string' && imageUrl.includes('cloudinary.com') ? 'CDN' : 'External'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => {
                            const newArray = [...value];
                            newArray[index] = e.target.value;
                            updateFieldValue(sectionId, fieldPath, newArray);
                          }}
                          className="w-full p-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Image URL"
                        />
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, sectionId, `${fieldPath}.${index}`);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploadingImage === `${fieldPath}.${index}`}
                          />
                          <button
                            type="button"
                            className={`w-full p-2 text-xs rounded border-2 border-dashed transition-colors ${uploadingImage === `${fieldPath}.${index}`
                              ? 'border-blue-400 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600'
                              }`}
                          >
                            {uploadingImage === `${fieldPath}.${index}` ? (
                              <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mx-auto" />
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImageField({ sectionId, fieldPath: `${fieldPath}.${index}` });
                            setShowImageBrowser(true);
                            fetchAvailableImages();
                          }}
                          className="p-2 text-xs border-2 border-dashed border-gray-300 rounded hover:border-blue-400 hover:bg-blue-50 text-gray-600 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {(value || []).map((item: any, index: number) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', index.toString());
                    setDraggedItem({ sectionId, fieldPath, index });
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    const toIndex = index;
                    if (fromIndex === toIndex) return;

                    const newArray = [...value];
                    const [movedItem] = newArray.splice(fromIndex, 1);
                    newArray.splice(toIndex, 0, movedItem);
                    updateFieldValue(sectionId, fieldPath, newArray);
                    setDraggedItem(null);
                  }}
                  className={`group/item border rounded-[2rem] p-6 transition-all duration-300 ${draggedItem?.index === index ? 'opacity-30 border-dashed border-gold-500 bg-gold-50' : 'bg-gray-50/50 border-navy-50 hover:border-gold-500/30 hover:bg-white shadow-sm hover:shadow-xl'
                    }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="cursor-move p-2 text-gray-300 hover:text-navy-950 transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="w-10 h-10 bg-navy-950 text-gold-500 rounded-xl flex items-center justify-center text-xs font-black shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em]">Sequence Member {index + 1}</span>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Component Matrix Segment</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newArray = [...value];
                          newArray.splice(index, 1);
                          updateFieldValue(sectionId, fieldPath, newArray);
                        }}
                        className="text-rose-500 hover:bg-rose-50 border-transparent text-[9px] font-black scale-90"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        TERMINATE
                      </Button>
                    </div>
                  </div>

                  <div className="pl-14">
                    {fieldSchema.arrayItemSchema?.type === 'object' && fieldSchema.arrayItemSchema.objectSchema ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(fieldSchema.arrayItemSchema.objectSchema).map(([subKey, subSchema]) =>
                          renderField(
                            sectionId,
                            subKey,
                            subSchema,
                            item[subKey],
                            `${fieldPath}.${index}.${subKey}`
                          )
                        )}
                      </div>
                    ) : (
                      renderField(
                        sectionId,
                        `item-${index}`,
                        fieldSchema.arrayItemSchema || { type: 'text', label: 'Item' },
                        item,
                        `${fieldPath}.${index}`
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(!value || value.length === 0) && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No items added yet</p>
                <p className="text-sm">Click "Add Item" to get started</p>
              </div>
            )}
          </div>
        );

      case 'object':
        return (
          <div key={fieldId} className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              {fieldIcon}
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-500">*</span>}
            </label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="space-y-4">
                {fieldSchema.objectSchema && Object.entries(fieldSchema.objectSchema).map(([subKey, subSchema]) =>
                  renderField(
                    sectionId,
                    subKey,
                    subSchema,
                    value?.[subKey],
                    `${fieldPath}.${subKey}`
                  )
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };


  const saveChanges = async (isSilent = false) => {
    try {
      if (!isSilent) setSaving(true);
      if (isSilent) setIsAutoSaving(true);
      setError('');

      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const configResponse = await fetch(`${API_BASE_URL}/api/page-config/${pageName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          config: pageData,
          changeLog: `Updated via content editor at ${new Date().toISOString()}`
        })
      });

      if (!configResponse.ok) {
        if (!isSilent) {
          const errorData = await configResponse.json();
          throw new Error(errorData.message || 'Failed to save page configuration');
        }
      }

      // Save SEO data if provided
      if (seoData.title || seoData.description || seoData.keywords || seoData.ogImage || seoData.canonical) {
        try {
          const seoResponse = await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({
              metaTitle: seoData.title,
              metaDescription: seoData.description,
              metaKeywords: seoData.keywords,
              ogImage: seoData.ogImage,
              canonicalUrl: seoData.canonical,
              status: 'published'
            })
          });
        } catch (seoError) {
          console.warn('SEO save error:', seoError);
        }
      }

      setLastSaved(new Date());
      if (!isSilent) {
        setSuccessMessage('Changes saved to protocol successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }

    } catch (error: any) {
      console.error('Save failed:', error);
      if (!isSilent) setError(error.message || 'Failed to save changes');
    } finally {
      if (!isSilent) setSaving(false);
      setIsAutoSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading page configuration...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your content</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      {/* Protocol Master Header */}
      <div className="bg-white border-b border-navy-50/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-50 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="hover:bg-gray-50 bg-white border-navy-100 text-navy-950 font-bold text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-navy-950 uppercase italic tracking-tight">Content Editor</h1>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pageName.replace(/-/g, ' ')} node active</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-50 border border-navy-50 rounded-xl p-1 mr-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`p-2.5 rounded-lg transition-all ${showSidebar ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-navy-950'}`}
                  title="Toggle Sidebar"
                >
                  <PanelLeft className="w-4.5 h-4.5" />
                </button>
              </div>

              <Button
                variant="outline"
                onClick={() => window.open(`/${pageName}`, '_blank')}
                className="bg-white border-navy-50 text-navy-950 hover:bg-navy-50 text-[10px] font-black uppercase tracking-widest h-11"
              >
                <Eye className="w-4 h-4 mr-2" />
                LIVE SITE
                <ExternalLink className="w-3 h-3 ml-2 opacity-30" />
              </Button>

              <Button
                onClick={() => saveChanges()}
                disabled={saving}
                className="bg-navy-950 text-gold-500 hover:bg-gold-600 hover:text-navy-950 font-black text-[10px] uppercase tracking-[0.2em] px-8 h-11 shadow-2xl shadow-navy-950/20 border-t border-white/10"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    SYNCING...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    SAVE PROTOCOL
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sub-Header Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy-50/50">
            <div className="flex items-center gap-12">
              <div className="flex gap-1 p-1 bg-gray-50 border border-navy-50 rounded-2xl">
                {[
                  { id: 'content', label: 'Content', icon: FileText, count: pageSchema.length },
                  { id: 'seo', label: 'SEO', icon: Globe, count: 5 },
                  { id: 'history', label: 'Revisions', icon: History, count: revisionHistory.length }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === (tab.id as any);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive
                        ? 'bg-navy-950 text-gold-500 shadow-2xl scale-105'
                        : 'text-gray-400 hover:text-navy-950 hover:bg-white'
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-gold-500' : 'text-gray-300'}`} />
                      {tab.label}
                      <span className={`text-[8px] px-2 py-0.5 rounded-md ${isActive ? 'bg-gold-500/20 text-gold-500' : 'bg-gray-200 text-gray-500'}`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-4 bg-white/50 px-5 py-2.5 rounded-2xl border border-navy-50/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isAutoSaving ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse shadow-[0_0_10px] ${isAutoSaving ? 'shadow-amber-500/50' : 'shadow-emerald-500/50'}`} />
                  <span className="text-[10px] font-black text-navy-950 uppercase tracking-widest leading-none">
                    {isAutoSaving ? 'SYNCING MATRIX...' : 'SYSTEM SECURE'}
                  </span>
                </div>
                <div className="w-px h-4 bg-navy-50 mx-1" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {lastSaved ? `LAST SYNC: ${lastSaved.toLocaleTimeString()}` : 'WAITING FOR DATA'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-gold-600 transition-colors" />
                <input
                  type="text"
                  placeholder="SEARCH MODULES..."
                  className="pl-12 pr-6 py-3 bg-white border border-navy-50 rounded-2xl text-[10px] font-black tracking-[0.2em] focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all w-80 shadow-sm"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="mx-6 mt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-800">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mx-6 mt-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800">Success</h4>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Glassmorphic Sidebar Navigation */}
        {showSidebar && (
          <div className="w-80 h-full border-r bg-white/40 backdrop-blur-xl flex flex-col animate-slideRight">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <PanelLeft className="w-5 h-5 text-gray-400" />
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Module Index</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {pageSchema
                .filter(s => !sidebarSearch || s.title.toLowerCase().includes(sidebarSearch.toLowerCase()))
                .map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full group text-left p-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${activeSection === section.id
                      ? 'bg-navy-950 text-gold-500 shadow-2xl scale-[1.02] border border-white/10'
                      : 'hover:bg-navy-50 text-gray-600'
                      }`}
                  >
                    {activeSection === section.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-600" />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeSection === section.id ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-white'}`}>
                        {getSectionIcon(section.id)}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-widest truncate ${activeSection === section.id ? 'text-gold-500' : 'text-navy-950'}`}>
                          {section.title}
                        </p>
                        <p className={`text-[8px] font-bold uppercase tracking-widest opacity-60 mt-0.5 ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`}>
                          {Object.keys(section.fields).length} FIELDS ACTIVE
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Main Editor Canvas */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-gray-50/30 relative">
          {/* Scroll Progress Bar */}
          <div className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none">
            <div
              className="h-full bg-gold-600 shadow-[0_0_10px_rgba(184,135,33,0.5)] transition-all duration-300"
              style={{ width: `${(pageSchema.indexOf(pageSchema.find(s => s.id === activeSection)!) + 1) / pageSchema.length * 100}%` }}
            />
          </div>

          <div className="max-w-5xl mx-auto pb-32">
            {activeTab === 'content' && (
              <div className="space-y-12 pb-16">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">Main Protocol Interface</h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Configure your primary data matrix modules below.</p>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: 'HERO', fields: { title: 'text', subtitle: 'text', image: 'url', buttonText: 'text' } },
                      { label: 'FEATURES', fields: { items: 'array' } },
                      { label: 'TESTIMONIALS', fields: { reviews: 'array' } }
                    ].map(template => (
                      <Button
                        key={template.label}
                        size="sm"
                        onClick={() => {
                          const newSectionId = `${template.label.toLowerCase()}_${Date.now()}`;
                          const fields: any = {};
                          Object.entries(template.fields).forEach(([k, v]) => {
                            fields[k] = { type: v, label: formatTitle(k) };
                          });

                          setPageSchema((prev: SectionSchema[]) => [...prev, {
                            id: newSectionId,
                            title: `${template.label} MODULE`,
                            fields: fields
                          }]);

                          const initialData: any = {};
                          Object.keys(template.fields).forEach(k => {
                            initialData[k] = template.fields[k as keyof typeof template.fields] === 'array' ? [] : '';
                          });

                          setPageData((prev: any) => ({ ...prev, [newSectionId]: initialData }));
                          setTimeout(() => scrollToSection(newSectionId), 100);
                        }}
                        className="bg-navy-50 text-navy-950 border border-navy-100 hover:border-gold-500 hover:text-gold-600 text-[9px] font-black"
                      >
                        <PlusCircle className="w-3 h-3 mr-1" />
                        {template.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {pageSchema.map((section, index) => {
                  const sectionIcon = getSectionIcon(section.id);
                  const isExpanded = expandedSections.has(section.id);

                  return (
                    <div key={section.id} ref={el => { sectionRefs.current[section.id] = el }} className="scroll-mt-32">
                      <div className="group relative">
                        <div className="absolute -left-12 top-8 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                          <button className="p-2 bg-white rounded-lg shadow-lg border border-gray-100 hover:text-blue-600">
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white rounded-lg shadow-lg border border-gray-100 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className={`bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border transition-all duration-500 overflow-hidden ${activeSection === section.id ? 'border-gold-500 ring-4 ring-gold-500/10' : 'border-navy-50'
                          }`}>
                          <div
                            className={`p-8 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-navy-950' : 'hover:bg-navy-50'
                              }`}
                            onClick={() => toggleSection(section.id)}
                          >
                            <div className="flex items-center space-x-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border w-12 h-12 ${isExpanded
                                  ? 'bg-gold-500 text-navy-950 rotate-3 border-gold-400'
                                  : 'bg-navy-950 text-gold-500 border-white/10'
                                }`}>
                                {sectionIcon}
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3 className={`text-xl font-black uppercase italic tracking-tight ${isExpanded ? 'text-gold-500' : 'text-navy-950'}`}>
                                    {section.title}
                                  </h3>
                                  <div className="flex gap-1.5">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sectionStatus[section.id] === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                                        sectionStatus[section.id] === 'draft' ? 'bg-orange-500/10 text-orange-500' :
                                          'bg-blue-500/10 text-blue-500'
                                      }`}>
                                      {sectionStatus[section.id] || 'PUBLISHED'}
                                    </span>
                                  </div>
                                </div>
                                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-60 ${isExpanded ? 'text-white' : 'text-gray-400'}`}>
                                  NODE INFRASTRUCTURE: {Object.keys(section.fields).length} CONFIGURABLE HANDLERS
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="hidden md:flex flex-col items-end">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isExpanded ? 'text-gold-500' : 'text-gray-300'}`}>Last Edit</span>
                                <span className={`text-[10px] font-bold ${isExpanded ? 'text-white/60' : 'text-gray-400'}`}>T-MINUS 12M</span>
                              </div>
                              <div className={`transform transition-all duration-500 w-10 h-10 rounded-xl flex items-center justify-center ${isExpanded ? 'rotate-180 bg-white/10 text-white' : 'text-gray-400 bg-gray-100'}`}>
                                <ChevronDown className="w-5 h-5" />
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-10 space-y-10 bg-white animate-fadeInUp">
                              <div className="grid gap-8">
                                {Object.entries(section.fields)
                                  .filter(([key]) => !sidebarSearch || key.toLowerCase().includes(sidebarSearch.toLowerCase()))
                                  .map(([fieldKey, fieldSchema]) =>
                                    renderField(section.id, fieldKey, fieldSchema, pageData[section.id]?.[fieldKey])
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {pageSchema.length === 0 && (
                  <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-navy-100">
                    <div className="w-24 h-24 bg-navy-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Terminal className="w-12 h-12 text-navy-300" />
                    </div>
                    <h3 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight mb-4">No Matrix Modules Detected</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">
                      Initialize the system by adding a new configuration module to the current dataset index.
                    </p>
                    <Button
                      onClick={() => { }}
                      className="bg-navy-950 text-gold-500 hover:bg-gold-600 hover:text-navy-950 font-bold px-10 py-5 rounded-2xl"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      BOOTSTRAP MODULE
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="pb-32 animate-fadeIn">
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">Signal Optimization (SEO)</h2>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Configure global meta parameters for maximum crawler visibility.</p>
                </div>

                <Card className="p-10 rounded-[3rem] shadow-2xl border-navy-50">
                  <div className="space-y-10">
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-navy-700">
                        <Terminal className="w-3.5 h-3.5 text-gold-600" />
                        Protocol Meta Title
                      </label>
                      <input
                        type="text"
                        value={seoData.title}
                        onChange={(e) => setSeoData((prev: typeof seoData) => ({ ...prev, title: e.target.value }))}
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all"
                        placeholder="Moksha Platform | Secure Digital Architecture"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-navy-700">
                        <Terminal className="w-3.5 h-3.5 text-gold-600" />
                        Transmission Meta Description
                      </label>
                      <textarea
                        value={seoData.description}
                        onChange={(e) => setSeoData((prev: typeof seoData) => ({ ...prev, description: e.target.value }))}
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all min-h-[150px]"
                        placeholder="Describe the content matrix for signal optimization..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-navy-700">
                          <Globe className="w-3.5 h-3.5 text-gold-600" />
                          Indexing Keywords
                        </label>
                        <input
                          type="text"
                          value={seoData.keywords}
                          onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
                          className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all"
                          placeholder="MOKSHA, ARCHITECTURE, SECURE"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-navy-700">
                          <Link className="w-3.5 h-3.5 text-gold-600" />
                          Canonical Endpoint
                        </label>
                        <input
                          type="url"
                          value={seoData.canonical}
                          onChange={(e) => setSeoData(prev => ({ ...prev, canonical: e.target.value }))}
                          className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all"
                          placeholder="https://moksha.app/protocol"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="pb-32 animate-fadeIn">
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">Temporal Registry (Revision History)</h2>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Review and restore previous system states from the local packet journal.</p>
                </div>

                <div className="space-y-4">
                  {revisionHistory.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-navy-50">
                      <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">No previous system snapshots available.</p>
                    </div>
                  ) : (
                    revisionHistory.map((entry, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPageData(JSON.parse(entry));
                          setActiveHistoryIndex(idx);
                          setSuccessMessage(`System state restored to T-Index ${idx + 1}`);
                        }}
                        className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${activeHistoryIndex === idx ? 'bg-navy-950 border-gold-500 shadow-2xl translate-x-3' : 'bg-white border-navy-50 hover:bg-navy-50'}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${activeHistoryIndex === idx ? 'bg-gold-500 text-navy-950 shadow-lg' : 'bg-navy-50 text-navy-950'}`}>
                            {idx + 1}
                          </div>
                          <div className="text-left">
                            <p className={`text-[11px] font-black uppercase tracking-widest ${activeHistoryIndex === idx ? 'text-gold-500' : 'text-navy-950'}`}>Snapshot Sequence ID-{8492 + idx}</p>
                            <p className={`text-[9px] font-bold uppercase tracking-widest ${activeHistoryIndex === idx ? 'text-white/60' : 'text-gray-400'}`}>Protocol Sync Recorded via {idx === revisionHistory.length - 1 ? 'ACTIVE SESSION' : 'AUTO-REGISTRY'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${activeHistoryIndex === idx ? 'text-emerald-400' : 'text-gray-300'}`}>System Status</span>
                            <span className={`text-[10px] font-bold ${activeHistoryIndex === idx ? 'text-white' : 'text-navy-700'}`}>{idx === revisionHistory.length - 1 ? 'STABLE' : 'ARCHIVED'}</span>
                          </div>
                          <ArrowRightCircle className={`w-5 h-5 ${activeHistoryIndex === idx ? 'text-gold-500' : 'text-gray-300'}`} />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>



        {showImageBrowser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Browse Gallery</h3>
                  <button
                    onClick={() => setShowImageBrowser(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
                <div className="flex gap-2">
                  {['all', 'assets', 'hero', 'team', 'gallery'].map(folder => (
                    <button
                      key={folder}
                      onClick={() => setSidebarSearch(folder === 'all' ? '' : folder)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sidebarSearch === folder ? 'bg-navy-950 text-gold-500 shadow-lg' : 'bg-white text-gray-400 hover:text-navy-950 hover:bg-white border border-navy-50'}`}
                    >
                      {folder}
                    </button>
                  ))}
                </div>
                <div className="w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-navy-50 rounded-xl text-xs focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                {loadingImages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading images...</span>
                  </div>
                ) : filteredImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => selectedImageField && selectImageFromGallery(image.url, selectedImageField.sectionId, selectedImageField.fieldPath)}
                      >
                        <div className="aspect-video relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors">
                          <Image
                            src={getSafeSrc(image.url)}
                            alt={image.title || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="text-white text-sm font-bold truncate mb-1">
                              {image.title || `Image ${index + 1}`}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-white/80 text-xs">
                                {typeof image.url === 'string' && image.url.includes('cloudinary.com') ? 'CDN' : 'External'}
                              </div>
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {assetSearchQuery ? 'No matching images found' : 'No images in gallery'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {assetSearchQuery
                        ? `Try adjusting your search for "${assetSearchQuery}"`
                        : 'Upload some images to your gallery first.'
                      }
                    </p>
                    {assetSearchQuery && (
                      <button
                        onClick={() => setAssetSearchQuery('')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}