'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { setNestedValue } from '@/lib/editor-utils';
import { 
  FileText, 
  RefreshCcw, 
  ChevronDown,
  Save,
  Globe,
  Settings,
  Search,
  Type,
  AlignLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layout,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EditorialHub() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEditorialData();
  }, []);

  const fetchEditorialData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/page-config?hydrate=true&limit=100`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      
      if (data.success && data.data?.configs) {
        const validPages = data.data.configs;
        setPages(validPages);
        if (validPages.length > 0) setSelectedSlug(validPages[0].slug);
      }
    } catch (error) {
      console.error("Editorial fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentPageData = pages.find(p => p.slug === selectedSlug);

  // RECURSIVE TEXT HARVESTER (Excludes URLs, Images, Colors, etc.)
  const harvestText = (obj: any, path: string = '', section: string = '', keyName: string = ''): any[] => {
    let fields: any[] = [];
    if (!obj) return fields;

    const excludedKeys = ['image', 'img', 'src', 'url', 'href', 'color', 'variant', 'autoSlideInterval', 'icon', 'slug', 'aspectRatio'];

    if (typeof obj === 'string' && obj.length > 1) {
        const isImage = /\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(obj) || obj.startsWith('http') || obj.startsWith('/gallery/') || obj.startsWith('data:');
        const isSpecialKey = excludedKeys.some(k => keyName.toLowerCase().includes(k));

        if (!isImage && !isSpecialKey) {
            fields.push({
                content: obj,
                path: path,
                section: section,
                key: keyName || path.split('.').pop()
            });
        }
        return fields;
    }

    if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
            fields = fields.concat(harvestText(item, `${path}[${idx}]`, section, `${keyName}_${idx}`));
        });
        return fields;
    }

    if (typeof obj === 'object') {
        for (let key in obj) {
            const val = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            const currentSection = section || key;
            fields = fields.concat(harvestText(val, currentPath, currentSection, key));
        }
    }
    
    return fields;
  };

  const allFoundText = currentPageData?.config ? harvestText(currentPageData.config) : [];
  
  const groupedText: Record<string, any[]> = {};
  allFoundText.forEach(field => {
      const sectionName = field.section.toUpperCase();
      if (!groupedText[sectionName]) groupedText[sectionName] = [];
      groupedText[sectionName].push(field);
  });

  const handleUpdateText = async (path: string, value: any) => {
    if (!currentPageData) return;
    
    // Use the robust utility for nested updates
    const newConfig = setNestedValue(currentPageData.config, path, value);

    setSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/page-config/${selectedSlug}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ 
          config: newConfig, 
          changeLog: `Narrative Sync: ${path.split('.').pop() || 'Content node updated'}` 
        })
      });
      const data = await response.json();
      if (data.success) {
        setPages(prev => prev.map(p => p.slug === selectedSlug ? { ...p, config: newConfig } : p));
      } else {
        alert(data.message || "Sync Protocol Rejected.");
      }
    } catch (error) {
      alert("Network Protocol Error: Dynamic Synchronization Failed.");
    } finally {
      setSaving(false);
    }
  };

  const filteredGroupedText = useMemo(() => {
    if (!searchTerm) return groupedText;
    
    const filtered: Record<string, any[]> = {};
    Object.entries(groupedText).forEach(([section, fields]) => {
      const filteredFields = fields.filter(f => 
        f.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.section.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredFields.length > 0) {
        filtered[section] = filteredFields;
      }
    });
    return filtered;
  }, [groupedText, searchTerm]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center p-24 text-center font-black animate-pulse uppercase tracking-widest italic text-navy-950 text-xs">Deciphering Page Narratives...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-8 md:p-16 select-none font-sans text-navy-950">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Editorial Command Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-l-4 border-navy-950 pl-8 py-2">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <FileText className="w-8 h-8 text-navy-950" />
              <h1 className="text-5xl font-black uppercase tracking-tighter italic">Editorial Hub</h1>
            </div>
            <p className="text-navy-500 font-bold text-[10px] uppercase tracking-[0.4em] italic ml-1">Universal Narrative Structure Control</p>
          </div>

          <div className="w-full md:w-[450px]">
            <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mb-3 ml-2 italic">Select Target Page Sector</p>
            <div className="relative group">
                <select 
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="w-full h-14 bg-white border-2 border-navy-50 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest text-navy-950 shadow-sm focus:border-navy-950 outline-none transition-all appearance-none cursor-pointer"
                >
                    {pages.map(page => (
                        <option key={page.slug} value={page.slug}>{page.title.toUpperCase()} (/{page.slug})</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Global Editorial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <StatsCard label="Total Content Nodes" value={allFoundText.length} icon={AlignLeft} />
            <StatsCard label="Active Publisher" value={currentPageData?.title} icon={Globe} />
            <StatsCard label="SEO Health Index" value="Optimal" icon={TrendingUp} color="text-emerald-600" />
        </div>

        {/* Dynamic Editorial Grid */}
        <div className="mb-12 relative group max-w-xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-200 group-focus-within:text-navy-950 transition-colors" />
           <input 
             type="text"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full h-14 bg-white border-2 border-navy-50 rounded-2xl pl-14 pr-12 text-[10px] font-black uppercase tracking-widest text-navy-950 outline-none focus:border-navy-950 transition-all shadow-sm"
             placeholder="Search narrative context or field identifier..."
           />
           {searchTerm && (
             <button onClick={() => setSearchTerm('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-navy-200 hover:text-navy-950">
               <X className="w-4 h-4" />
             </button>
           )}
        </div>

        {Object.entries(filteredGroupedText).length > 0 ? (
          <div className="space-y-24">
            {Object.entries(filteredGroupedText).map(([sectionName, fields]) => (
              <section key={sectionName}>
                <div className="flex items-center gap-6 mb-10 pb-4 border-b border-navy-50 sticky top-[100px] bg-[#fcfcfc]/90 backdrop-blur-md z-10 py-4">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                        <Type className="w-5 h-5 text-navy-950" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-widest italic text-navy-950">{sectionName}</h2>
                    <div className="h-px flex-grow bg-navy-50"></div>
                </div>
                
                <div className="grid grid-cols-1 gap-12">
                   {fields.map((field, idx) => (
                      <EditorialBlock 
                        key={idx}
                        title={field.path.split('.').pop()?.replace(/\[|\]/g, ' ')}
                        path={field.path}
                        content={field.content}
                        onSync={(newVal: string) => handleUpdateText(field.path, newVal)}
                        saving={saving}
                      />
                   ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-navy-50 space-y-4">
              <Search className="w-12 h-12 text-navy-100 mx-auto" />
              <p className="text-xs font-black uppercase tracking-widest text-navy-300 italic">No Matching Content Nodes Found</p>
          </div>
        )}

      </div>
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, color = 'text-navy-950' }: any) {
    return (
        <div className="bg-white border-2 border-navy-50 rounded-[2.5rem] p-8 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-navy-950" />
            </div>
            <div>
                <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mb-1">{label}</p>
                <p className={cn("text-xl font-black tracking-tighter uppercase italic", color)}>{value}</p>
            </div>
        </div>
    );
}

function EditorialBlock({ title, path, content, onSync, saving }: any) {
    const [localValue, setLocalValue] = useState(content);
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
        setLocalValue(content);
        setIsModified(false);
    }, [content]);

    const handleChange = (e: any) => {
        setLocalValue(e.target.value);
        setIsModified(true);
    };

    // Precision Character Metrics (SEO & UI Structural Compliance)
    const isDescription = title.toLowerCase().includes('description') || title.toLowerCase().includes('text') || title.toLowerCase().includes('content');
    const isButton = title.toLowerCase().includes('button') || path.toLowerCase().includes('button') || (title.toLowerCase().includes('label') && !isDescription);
    const isTitle = title.toLowerCase().includes('title');
    const isHeader = title.toLowerCase().includes('heading') || title.toLowerCase().includes('subtitle');

    // 15 for Buttons, 60 for Titles, 80 for Headers, 160 for Descriptions
    const limit = isButton ? 15 : (isTitle ? 60 : (isHeader ? 80 : (isDescription ? 160 : 500)));
    const count = localValue.length;
    const isBreached = count > limit;
    const isIdeal = count > (limit * 0.7) && count <= limit;
    const healthPercent = Math.min((count / limit) * 100, 100);

    return (
        <div className="bg-white border-2 border-stone-100 rounded-[3rem] p-10 md:p-14 hover:border-navy-950 transition-all duration-700 group relative shadow-sm">
            
            <div className="flex flex-col lg:flex-row gap-12 lg:items-center justify-between mb-10 pb-10 border-b-2 border-stone-50">
                <div className="space-y-6 max-w-2xl">
                    <div className="flex items-center gap-4">
                        <h4 className="text-xl font-black uppercase tracking-tight text-navy-950 leading-none italic">{title}</h4>
                        <span className="px-4 py-1.5 rounded-xl bg-navy-950 text-[9px] font-black text-white uppercase tracking-widest">PATH: {path}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className={cn(
                            "flex items-center justify-between gap-4 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md border-2 transition-all",
                            isBreached 
                                ? "bg-rose-50 text-rose-700 border-rose-500 shadow-rose-200/50" 
                                : (isIdeal ? "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-emerald-200/50" : "bg-stone-50 text-navy-500 border-stone-200 shadow-sm")
                        )}>
                            <div className="flex items-center gap-3">
                                {isBreached ? <AlertCircle className="w-4 h-4 animate-bounce" /> : (isIdeal ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />)}
                                <span>{count} / {limit} CHARACTERS</span>
                            </div>
                            <span className="italic">
                                {isBreached ? 'LIMIT BREACHED' : (isIdeal ? 'OPTIMIZED' : 'DRAFTING')}
                            </span>
                        </div>
                        
                        {/* Health Bar Integration */}
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                            <div 
                                className={cn(
                                    "h-full transition-all duration-700",
                                    isBreached ? "bg-rose-500" : (isIdeal ? "bg-emerald-500" : "bg-navy-950")
                                )}
                                style={{ width: `${healthPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Command Button - Elite Visibility Logic */}
                <Button 
                    onClick={() => onSync(localValue)}
                    disabled={saving || !isModified}
                    className={cn(
                        "h-[72px] px-12 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 border-2 shadow-2xl",
                        !isModified 
                            ? "bg-stone-100 text-navy-400 border-stone-200/50 cursor-default" 
                            : "bg-navy-950 text-gold-500 border-navy-950 hover:bg-gold-500 hover:text-black hover:border-gold-500 hover:-translate-y-2 active:translate-y-0"
                    )}
                >
                    {saving ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 font-black" />}
                    {saving ? 'SYNCHRONIZING...' : 'SYNC NARRATIVE'}
                </Button>
            </div>

            <div className="relative">
                <textarea 
                    value={localValue}
                    onChange={handleChange}
                    rows={content.length > 100 ? 5 : 2}
                    className="w-full bg-stone-50/50 border-2 border-stone-100 rounded-[2rem] p-10 text-xl font-bold text-navy-950 focus:border-navy-950 focus:bg-white outline-none transition-all placeholder:text-navy-100 resize-none h-auto shadow-inner leading-relaxed"
                    placeholder="Enter surgical narrative content..."
                />
            </div>
            
            {/* Contextual Guidance */}
            <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-black text-navy-300 uppercase tracking-widest italic">
                <span className="flex items-center gap-2">• Eliminate technical jargon</span>
                <span className="flex items-center gap-2">• Focus on user-centric benefits</span>
                <span className="flex items-center gap-2">• Maintain active power voice</span>
                <span className="flex items-center gap-2">• Lead with core value proposition</span>
            </div>
        </div>
    );
}
