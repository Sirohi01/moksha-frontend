'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Save, ArrowLeft, Eye, Settings, Search,
  FileText, Plus, HelpCircle, Copy, Link as LinkIcon,
  ChevronDown, ChevronRight, Globe, Layout,
  Image as ImageIcon, Loader2, Upload, X,
  CheckCircle2, Clock, Terminal, PlusCircle, History, Cpu
} from 'lucide-react';
import SEOEditor from '@/components/admin/content-editor/SEOEditor';
import IntelligencePanel from '@/components/admin/content-editor/IntelligencePanel';
import ContentSections from '@/components/admin/content-editor/ContentSections';
import RevisionHistory from '@/components/admin/content-editor/RevisionHistory';
import ImageBrowser from '@/components/admin/content-editor/ImageBrowser';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  canonical: string;
  slug: string;
  robots: string;
  schemaMarkup: string;
  gtmCode: string;
  analyticsCode: string;
  headCode: string;
  bodyCode: string;
  h1Tag: string;
  internalLinks: string;
  breadcrumb: string;
  redirects: string;
  imageAltMappings: Record<string, string>;
}

interface SectionSchema {
  id: string;
  title: string;
  description?: string;
  fields: Record<string, any>;
}

export default function ContentEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageName = searchParams.get('page') || 'homepage';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>({});
  const [pageSchema, setPageSchema] = useState<SectionSchema[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'intelligence' | 'history'>('content');
  const [seoData, setSeoData] = useState<SEOData>({
    title: '', description: '', keywords: '', ogTitle: '', ogDescription: '',
    ogImage: '', twitterCard: 'summary_large_image', canonical: '', slug: '',
    robots: 'index, follow', schemaMarkup: '', gtmCode: '', analyticsCode: '',
    headCode: '', bodyCode: '', h1Tag: '', internalLinks: '', breadcrumb: '',
    redirects: '', imageAltMappings: {}
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [revisionHistory, setRevisionHistory] = useState<any[]>([]);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(-1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();
  }, [pageName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Fetch Page Data from page-config API
      const configRes = await fetch(`${API_BASE_URL}/api/page-config/${pageName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const configData = await configRes.json();

      if (configRes.ok && configData.success) {
        setPageData(configData.data.config);

        // Fetch History separately
        const historyRes = await fetch(`${API_BASE_URL}/api/page-config/${pageName}/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const historyData = await historyRes.json();
        if (historyRes.ok && historyData.success) {
          setRevisionHistory(historyData.data.history || []);
        }

        // Process Schema
        generateSchemaFromData(configData.data.config);
      }

      // Fetch SEO Data from seo API
      const seoRes = await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (seoRes.ok) {
        const seoResult = await seoRes.json();
        if (seoResult.success && seoResult.data) {
          setSeoData({
            title: seoResult.data.metaTitle || '',
            description: seoResult.data.metaDescription || '',
            keywords: seoResult.data.metaKeywords || '',
            ogTitle: seoResult.data.ogTitle || '',
            ogDescription: seoResult.data.ogDescription || '',
            ogImage: seoResult.data.ogImage || '',
            twitterCard: seoResult.data.twitterCard || 'summary_large_image',
            canonical: seoResult.data.canonicalUrl || '',
            slug: seoResult.data.slug || '',
            robots: seoResult.data.robots || 'index, follow',
            schemaMarkup: typeof seoResult.data.schemaMarkup === 'object' ? JSON.stringify(seoResult.data.schemaMarkup, null, 2) : seoResult.data.schemaMarkup || '',
            gtmCode: seoResult.data.gtmCode || '',
            analyticsCode: seoResult.data.analyticsCode || '',
            headCode: seoResult.data.headCode || '',
            bodyCode: seoResult.data.bodyCode || '',
            h1Tag: seoResult.data.h1Tag || '',
            internalLinks: seoResult.data.internalLinks || '',
            breadcrumb: seoResult.data.breadcrumb || '',
            redirects: seoResult.data.redirects || '',
            imageAltMappings: seoResult.data.imageAltMappings || {}
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Connection failure');
    } finally {
      setLoading(false);
    }
  };

  const generateSchemaFromData = (data: any) => {
    const schema: SectionSchema[] = [];
    Object.entries(data).forEach(([key, val]: [string, any]) => {
      schema.push({
        id: key,
        title: key.toUpperCase(),
        fields: generateFieldsSchema(val)
      });
    });
    setPageSchema(schema);
    setExpandedSections(new Set(schema.map(s => s.id)));
  };

  const generateFieldsSchema = (val: any): Record<string, any> => {
    const fields: Record<string, any> = {};
    if (typeof val !== 'object' || val === null) return fields;

    Object.entries(val).forEach(([k, v]) => {
      // Determine Type
      let type: any = 'text';
      if (typeof v === 'boolean') type = 'boolean';
      else if (typeof v === 'number') type = 'number';
      else if (Array.isArray(v)) type = 'array';
      else if (typeof v === 'object' && v !== null) type = 'object';
      else if (typeof v === 'string' && v.length > 100) type = 'textarea';

      fields[k] = {
        type,
        label: k.split(/(?=[A-Z])|_/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
        required: true,
        // If it's an array or object, we might want to store nested schema or just let FieldRenderer handle it by value
      };
    });
    return fields;
  };

  const updateFieldValue = (sectionId: string, fieldPath: string, newValue: any) => {
    setPageData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone for guaranteed reactivity
      const pathParts = fieldPath.split('.');
      let current = newData[sectionId];
      
      if (!current) {
        newData[sectionId] = {};
        current = newData[sectionId];
      }

      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = isNaN(Number(pathParts[i+1])) ? {} : [];
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = newValue;
      return newData;
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Save Page Data to page-config API
      await fetch(`${API_BASE_URL}/api/page-config/${pageName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ config: pageData })
      });

      // Save SEO Data to seo API
      await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          metaTitle: seoData.title,
          metaDescription: seoData.description,
          metaKeywords: seoData.keywords,
          ogTitle: seoData.ogTitle,
          ogDescription: seoData.ogDescription,
          ogImage: seoData.ogImage,
          twitterCard: seoData.twitterCard,
          canonicalUrl: seoData.canonical,
          slug: seoData.slug,
          robots: seoData.robots,
          schemaMarkup: typeof seoData.schemaMarkup === 'string' ? JSON.parse(seoData.schemaMarkup || '{}') : seoData.schemaMarkup,
          h1Tag: seoData.h1Tag,
          breadcrumb: seoData.breadcrumb,
          gtmCode: seoData.gtmCode,
          analyticsCode: seoData.analyticsCode,
          headCode: seoData.headCode,
          bodyCode: seoData.bodyCode,
          redirects: seoData.redirects,
          imageAltMappings: seoData.imageAltMappings,
          status: 'published'
        })
      });

      setSuccessMessage('Successfully saved!');
      setLastSaved(new Date());
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Save operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, sectionId: string, fieldPath: string) => {
    setUploadingImage(fieldPath);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/api/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        updateFieldValue(sectionId, fieldPath, data.data.url);
        setSuccessMessage('Image uploaded!');
      } else {
        setError(data.message || 'Upload protocol failed');
      }
    } catch (err) {
      setError('Upload connection failed');
    } finally {
      setUploadingImage(null);
    }
  };

  const getSafeSrc = (src: any) => {
    if (!src) return '';
    let finalSrc = '';
    if (typeof src === 'string') finalSrc = src;
    else if (typeof src === 'object' && src.src) finalSrc = src.src;
    
    if (!finalSrc) return '';
    // Prevent Next.js image crash if value is not a path/URL
    if (finalSrc.startsWith('/') || finalSrc.startsWith('http') || finalSrc.includes('cloudinary')) {
       return finalSrc;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
        <div className="w-20 h-20 border-4 border-navy-50 border-t-gold-500 rounded-full animate-spin mb-8" />
        <h2 className="text-xl font-black text-navy-950 uppercase italic tracking-tight">Syncing Page Partials...</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 animate-pulse">Initializing Interface Node</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-gray-100 px-6 md:px-12 py-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-navy-400 hover:bg-navy-950 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight flex items-center gap-3">
                {pageName.replace(/-/g, ' ')}
                <div className="px-3 py-1 bg-gold-500 text-navy-950 text-[10px] rounded-lg tracking-widest not-italic">LIVE</div>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Last Updated: {lastSaved ? lastSaved.toLocaleTimeString() : 'N/A'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                 <LinkIcon className="w-3 h-3 text-gold-600" />
                 <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest break-all">
                    Route: /p/{pageName}
                 </span>
                 <button 
                    onClick={() => {
                       navigator.clipboard.writeText(`${window.location.origin}/p/${pageName}`);
                       setSuccessMessage('URL Copied to Clipboard!');
                    }}
                    className="p-1.5 bg-navy-50 text-navy-400 rounded-lg hover:bg-gold-500 hover:text-navy-950 transition-all ml-2"
                    title="Copy for Navigation"
                 >
                    <Copy size={10} />
                 </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 mr-6 pr-6 border-r border-gray-100">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-navy-950">Draft Auto-Saved</p>
                <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Protocol Verified</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <Button
              onClick={() => window.open(`/p/${pageName}`, '_blank')}
              className="bg-white border-2 border-navy-50 text-navy-950 hover:bg-gray-50 px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Live View
            </Button>

            <Button
              disabled={saving}
              onClick={saveChanges}
              className="bg-navy-950 text-gold-500 hover:bg-gold-500 hover:text-navy-950 px-10 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transform active:scale-95 transition-all flex items-center gap-3"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
        {error && (
          <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-between group animate-shake">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Runtime Error Detected</p>
                <p className="text-xs font-bold text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button onClick={() => setError('')} className="w-10 h-10 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-10 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-4 animate-fadeIn">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Protocol Success</p>
              <p className="text-xs font-bold text-emerald-800 mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-16 px-2">
          {[
            { id: 'content', label: 'Page Content', icon: Layout },
            { id: 'seo', label: 'Search Ranking', icon: Globe },
            { id: 'intelligence', label: 'Technical Setup', icon: Cpu },
            { id: 'history', label: 'Version Backup', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all transform active:scale-95 ${isActive
                    ? 'bg-navy-950 text-gold-500 shadow-2xl shadow-navy-950/20 translate-y-[-2px]'
                    : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-navy-100'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-500' : 'text-gray-400'}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="min-h-[60vh]">
          {activeTab === 'content' && (
            <ContentSections
              pageSchema={pageSchema}
              pageData={pageData}
              updateFieldValue={updateFieldValue}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
              sidebarSearch={sidebarSearch}
              uploadingImage={uploadingImage}
              handleImageUpload={handleImageUpload}
              setSuccessMessage={setSuccessMessage}
              seoData={seoData}
              setSeoData={setSeoData}
              getSafeSrc={getSafeSrc}
            />
          )}

          {activeTab === 'seo' && (
            <SEOEditor
              seoData={seoData}
              setSeoData={setSeoData}
            />
          )}

          {activeTab === 'intelligence' && (
            <IntelligencePanel
              seoData={seoData}
              setSeoData={setSeoData}
            />
          )}

          {activeTab === 'history' && (
            <RevisionHistory
              revisions={revisionHistory}
              activeHistoryIndex={activeHistoryIndex}
              setActiveHistoryIndex={setActiveHistoryIndex}
              onRestore={(index) => {
                const restoredConfig = revisionHistory[index].content;
                if (restoredConfig) {
                  try {
                    const parsedConfig = typeof restoredConfig === 'string' ? JSON.parse(restoredConfig) : restoredConfig;
                    setPageData(parsedConfig);
                    setActiveTab('content');
                    setSuccessMessage('Restored temporary draft. Click "Update" to confirm permanently.');
                  } catch (e) {
                    setError('Failed to parse historical version');
                  }
                }
              }}
            />
          )}
        </div>
      </main>

      {showImageBrowser && (
        <ImageBrowser
          onClose={() => setShowImageBrowser(false)}
          onSelect={(url) => {
            // Image selection logic
            setShowImageBrowser(false);
          }}
          availableImages={availableImages}
          loadingImages={loadingImages}
        />
      )}

      {/* Floating Quick Action Button */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4">
        <button className="w-16 h-16 bg-navy-950 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group">
          <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
}