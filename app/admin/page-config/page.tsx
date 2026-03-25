'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Search, 
  Edit, 
  Save, 
  X, 
  Clock, 
  FileText, 
  Settings, 
  Globe, 
  Smartphone, 
  Users, 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Briefcase, 
  Shield, 
  Layout, 
  Eye, 
  Code,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';
import VisualConfigEditor from '@/components/admin/VisualConfigEditor';

interface PageConfig {
  pageName: string;
  config: any;
  lastModified: string;
  version: number;
}

export default function PageConfigManagement() {
  const { success: showSuccess, error: showError } = useToast();
  const [configs, setConfigs] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [editMode, setEditMode] = useState<'visual' | 'json'>('visual');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const pages = ['homepage', 'about', 'how-it-works', 'why-moksha-seva', 'our-reach', 'board', 'services', 'report', 'impact', 'stories', 'remembrance', 'testimonials', 'gallery', 'feedback', 'volunteer', 'corporate', 'legacy-giving', 'tribute', 'transparency', 'schemes', 'contact', 'press', 'documentaries', 'layout', 'blog', 'compliance'];
      
      const configPromises = pages.map(async (pageName) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/page-config/${pageName}`);
          if (response.ok) {
            const data = await response.json();
            return {
              pageName,
              config: data.data.config,
              lastModified: data.data.lastModified,
              version: data.data.version
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(configPromises);
      setConfigs(results.filter(Boolean) as PageConfig[]);
    } catch (error: any) {
      showError('Failed to load page configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pageConfig: PageConfig) => {
    setEditingConfig(pageConfig.pageName);
    setEditData(JSON.parse(JSON.stringify(pageConfig.config))); // Deep clone
    setEditMode('visual');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!editingConfig) return;
    
    try {
      setIsSaving(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/page-config/${editingConfig}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          config: editData,
          changeLog: 'Updated via Visual Content Editor'
        })
      });

      if (response.ok) {
        showSuccess(`${editingConfig} configuration updated successfully!`);
        setEditingConfig(null);
        setEditData(null);
        fetchConfigs();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update configuration');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setEditData(null);
  };

  const filteredConfigs = configs.filter(config =>
    config.pageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPageIcon = (pageName: string) => {
    switch (pageName) {
      case 'homepage': return <Globe className="w-5 h-5 text-blue-600" />;
      case 'about': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'services': return <Heart className="w-5 h-5 text-red-600" />;
      case 'volunteer': return <Users className="w-5 h-5 text-emerald-600" />;
      case 'transparency': return <Shield className="w-5 h-5 text-indigo-600" />;
      default: return <Settings className="w-5 h-5 text-stone-400" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-20 bg-stone-100 rounded-3xl animate-pulse" />
        <div className="grid gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-stone-50 rounded-3xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  // EDIT VIEW
  if (editingConfig && editData) {
    const pageTitle = editingConfig.charAt(0).toUpperCase() + editingConfig.slice(1);
    
    return (
      <div className="min-h-screen bg-stone-50 pb-20">
        {/* Editor Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button onClick={handleCancel} className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
                <X className="w-6 h-6 text-stone-400" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-stone-900">{pageTitle} Editor</h1>
                  <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold text-stone-500 uppercase tracking-widest leading-none">Config</span>
                </div>
                <p className="text-xs text-stone-500 font-medium">Drafting changes for live website</p>
              </div>
            </div>

            <div className="flex items-center bg-stone-100 p-1 rounded-xl">
               <button 
                 onClick={() => setEditMode('visual')}
                 className={cn(
                   "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                   editMode === 'visual' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                 )}
               >
                 <Eye className="w-4 h-4" />
                 Visual
               </button>
               <button 
                 onClick={() => setEditMode('json')}
                 className={cn(
                   "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                   editMode === 'json' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                 )}
               >
                 <Code className="w-4 h-4" />
                 JSON
               </button>
            </div>

            <div className="flex items-center gap-3">
               <Button onClick={handleSave} loading={isSaving} className="bg-[#000080] hover:bg-black text-white px-8 py-2.5 rounded-xl shadow-xl shadow-blue-900/10 transition-all hover:scale-105 active:scale-95 border-b-4 border-amber-900">
                 <Save className="w-4 h-4 mr-2" />
                 PUBLISH CHANGES
               </Button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-8">
           {editMode === 'visual' ? (
             <VisualConfigEditor value={editData} onChange={setEditData} />
           ) : (
             <div className="bg-stone-900 rounded-3xl p-6 shadow-2xl relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-4">raw_config.json</label>
                <textarea
                  value={JSON.stringify(editData, null, 2)}
                  onChange={(e) => {
                    try {
                      setEditData(JSON.parse(e.target.value));
                    } catch(err) {} // Allow invalid JSON while typing
                  }}
                  className="w-full h-[600px] bg-transparent text-emerald-400 font-mono text-sm focus:outline-none resize-none selection:bg-emerald-500/20"
                />
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-saffron-600 uppercase tracking-[0.3em]">Infrastructure Control</span>
            <h1 className="text-4xl font-serif font-black text-stone-900">Page CMS</h1>
            <p className="text-stone-500 font-medium">Manage dynamic content for {configs.length} platform nodes</p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 group-focus-within:text-saffron-600 transition-colors" />
            <input
              type="text"
              placeholder="Search page context..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-saffron-500/10 focus:border-saffron-500 transition-all shadow-sm font-medium text-sm text-stone-900"
            />
          </div>
        </div>

        {/* Config Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConfigs.map((pageConfig) => (
            <Card key={pageConfig.pageName} className="group relative overflow-hidden bg-white border-none shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 p-0 rounded-3xl">
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-stone-900 transition-colors duration-500">
                       <span className="group-hover:scale-110 transition-transform duration-500">
                        {getPageIcon(pageConfig.pageName)}
                       </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg tracking-tight">
                        {pageConfig.pageName.charAt(0).toUpperCase() + pageConfig.pageName.slice(1)}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                        <Clock className="w-3 h-3" />
                        Updated {new Date(pageConfig.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-[10px] font-black text-stone-600">
                    V{pageConfig.version}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                  {Object.keys(pageConfig.config).slice(0, 4).map(key => (
                    <span key={key} className="px-2 py-1 bg-stone-50 text-stone-500 text-[9px] font-bold uppercase tracking-wider rounded border border-stone-100">
                      {key}
                    </span>
                  ))}
                  {Object.keys(pageConfig.config).length > 4 && (
                    <span className="px-2 py-1 bg-stone-50 text-stone-400 text-[9px] font-bold rounded border border-stone-100">
                      +{Object.keys(pageConfig.config).length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    onClick={() => handleEdit(pageConfig)}
                    className="flex-1 bg-stone-900 hover:bg-black text-white h-11 rounded-xl font-bold shadow-lg shadow-stone-900/10"
                  >
                    Manage Content
                  </Button>
                  <button className="w-11 h-11 border border-stone-100 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-100 group-hover:bg-saffron-500 transition-colors duration-500" />
            </Card>
          ))}
        </div>

        {filteredConfigs.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-stone-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">No nodes found</h3>
              <p className="text-stone-500 max-w-xs mx-auto">Try searching for a specific page name or module identifier.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}