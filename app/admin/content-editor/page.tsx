'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Image,
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
  ImageIcon,
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
  Flame
} from 'lucide-react';

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
    'Moksha Seva - Dignified Final Journey': Heart, // Fallback for complex names
    '[object Object]': FileText // Fallback for object values
  };
  
  const IconComponent = iconMap[iconName] || FileText;
  return <IconComponent className="w-4 h-4" />;
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
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>({});
  const [pageSchema, setPageSchema] = useState<SectionSchema[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
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
  const [selectedImageField, setSelectedImageField] = useState<{sectionId: string, fieldPath: string} | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPageData();
  }, [pageName]);

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

      // Fetch SEO data
      try {
        const seoResponse = await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`);
        if (seoResponse.ok) {
          const seoData = await seoResponse.json();
          if (seoData.success && seoData.data) {
            setSeoData({
              title: seoData.data.metaTitle || '',
              description: seoData.data.metaDescription || '',
              keywords: seoData.data.keywords || '',
              ogImage: seoData.data.ogImage || '',
              canonical: seoData.data.canonicalUrl || ''
            });
          }
        }
      } catch (seoError) {
        console.log('SEO data not found, using defaults');
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
    if (fieldKey.includes('image') || fieldKey.includes('img')) return <Image className="w-4 h-4" />;
    
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
    if (sectionId.includes('gallery') || sectionId.includes('media')) return <Image className="w-5 h-5" />;
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
    !searchQuery || 
    (image.title && image.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (image.tags && image.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
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
        const isImageField = fieldKey.includes('image') || fieldKey.includes('img') || fieldKey.includes('src') || fieldKey.includes('photo') || fieldKey.includes('avatar') || fieldKey.includes('slide') || fieldKey.includes('banner') || fieldKey.includes('background') || fieldKey.includes('hero') || fieldKey.includes('thumbnail') || fieldKey.includes('cover') || fieldKey.includes('poster') || fieldKey.includes('logo') || fieldKey.includes('icon') || 
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
            </label>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  id={fieldId}
                  type={fieldSchema.type}
                  value={value || ''}
                  onChange={(e) => updateFieldValue(sectionId, fieldPath, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={fieldSchema.placeholder}
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
              
              {isImageField && !isIconField && (
                <div className="space-y-4">
                  {value && (
                    <div className="relative group/image">
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm">
                        <div className="aspect-video relative">
                          <img 
                            src={value} 
                            alt={`Preview of ${fieldSchema.label}`}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover/image:scale-105"
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
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        uploadingImage === fieldPath 
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
            <label htmlFor={fieldId} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              {fieldIcon}
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <textarea
                id={fieldId}
                value={value || ''}
                onChange={(e) => updateFieldValue(sectionId, fieldPath, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical min-h-[120px]"
                placeholder={fieldSchema.placeholder}
                required={fieldSchema.required}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md">
                {value ? `${value.length} chars` : '0 chars'}
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
                  className={`w-14 h-7 rounded-full cursor-pointer transition-colors ${
                    value ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div 
                    className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform ${
                      value ? 'translate-x-7' : 'translate-x-0.5'
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
                  if (fieldSchema.arrayItemSchema?.type === 'object') {
                    newArray.push({});
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
                        <img 
                          src={imageUrl} 
                          alt={`${fieldSchema.label} ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
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
                            className={`w-full p-2 text-xs rounded border-2 border-dashed transition-colors ${
                              uploadingImage === `${fieldPath}.${index}`
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
            <div className="space-y-3">
              {(value || []).map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      Item {index + 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newArray = [...value];
                        newArray.splice(index, 1);
                        updateFieldValue(sectionId, fieldPath, newArray);
                      }}
                      className="text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {fieldSchema.arrayItemSchema?.type === 'object' && fieldSchema.arrayItemSchema.objectSchema ? (
                    <div className="space-y-4">
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
  const saveChanges = async () => {
    try {
      setSaving(true);
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
        const errorData = await configResponse.json();
        throw new Error(errorData.message || 'Failed to save page configuration');
      }

      if (seoData.title || seoData.description || seoData.keywords || seoData.ogImage || seoData.canonical) {
        try {
          const seoResponse = await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({
              pageName,
              metaTitle: seoData.title,
              metaDescription: seoData.description,
              keywords: seoData.keywords,
              ogImage: seoData.ogImage,
              canonicalUrl: seoData.canonical,
              status: 'active'
            })
          });

          if (!seoResponse.ok) {
            console.warn('Failed to save SEO data, but page config saved successfully');
          }
        } catch (seoError) {
          console.warn('SEO save failed:', seoError);
        }
      }

      setSuccessMessage('Changes saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error: any) {
      console.error('Save failed:', error);
      setError(error.message || 'Failed to save changes');
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Content Editor</h1>
                  <p className="text-sm text-gray-600">{formatTitle(pageName)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => window.open(`/${pageName}`, '_blank')}
                className="hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
              
              <Button
                onClick={saveChanges}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'content', label: 'Content', icon: FileText, count: pageSchema.length },
                { id: 'seo', label: 'SEO', icon: Globe, count: 5 },
                { id: 'settings', label: 'Settings', icon: Settings, count: 3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{pageSchema.length} Sections</span>
              <span>{availableImages.length} Images</span>
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

      <div className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {pageSchema.map((section, index) => {
              const sectionIcon = getSectionIcon(section.id);
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <div 
                      className="p-6 bg-gray-50 border-b cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {sectionIcon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600">{Object.keys(section.fields).length} fields</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                          {isExpanded ? 'Expanded' : 'Collapsed'}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          isExpanded ? 'bg-green-400' : 'bg-gray-300'
                        }`}></div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-6 space-y-6 bg-white">
                        <div className="grid gap-6">
                          {Object.entries(section.fields).map(([fieldKey, fieldSchema]) =>
                            renderField(section.id, fieldKey, fieldSchema, pageData[section.id]?.[fieldKey])
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
            
            {pageSchema.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">No content sections found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  This page doesn't have any configurable content sections yet.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content Section
                </Button>
              </div>
            )}
          </div>
        )}
        {activeTab === 'seo' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">SEO Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <input
                  type="text"
                  value={seoData.title}
                  onChange={(e) => setSeoData((prev: typeof seoData) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meta title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <textarea
                  value={seoData.description}
                  onChange={(e) => setSeoData((prev: typeof seoData) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Enter meta description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Keywords</label>
                <input
                  type="text"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter keywords separated by commas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">OG Image URL</label>
                <input
                  type="url"
                  value={seoData.ogImage}
                  onChange={(e) => setSeoData(prev => ({ ...prev, ogImage: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OG image URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Canonical URL</label>
                <input
                  type="url"
                  value={seoData.canonical}
                  onChange={(e) => setSeoData(prev => ({ ...prev, canonical: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter canonical URL"
                />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Page Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Page Name</label>
                <input
                  type="text"
                  value={pageName}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-sm text-gray-500 mt-1">Page name cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Last Updated</label>
                <input
                  type="text"
                  value={new Date().toLocaleString()}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </Card>
        )}
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
              
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
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
                        <img 
                          src={image.url} 
                          alt={image.title || `Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
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
                    {searchQuery ? 'No matching images found' : 'No images in gallery'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? `Try adjusting your search for "${searchQuery}"` 
                      : 'Upload some images to your gallery first.'
                    }
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
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
  );
}