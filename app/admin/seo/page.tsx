'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Globe,
  Search,
  Settings,
  History,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Eye,
  Save,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Layout,
  ExternalLink,
  Lock,
  X,
  Plus,
  Trash2,
  Share2,
  Twitter,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  Upload,
  Activity,
  ChevronRight,
  Code2,
  Zap,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tabs for the SEO Hub
type SEOTab = 'ranking' | 'social' | 'technical' | 'backup';

export default function SEOCommandDeck() {
  const [activeTab, setActiveTab] = useState<SEOTab>('ranking');
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState<{ open: boolean; field: string }>({ open: false, field: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pageSearch, setPageSearch] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      if (data.success) {
        const pageList = data.data || [];
        setPages(pageList);
        if (pageList.length > 0) setSelectedPage(pageList[0]);
      }
    } catch (error) {
      console.error("Error fetching SEO pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPage || !selectedPage._id) return;
    setSaving(true);
    try {
      const { _id, ...updatedData } = selectedPage;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      if (data.success) {
        setPages(prev => prev.map(p => p._id === selectedPage._id ? data.data : p));
        setSelectedPage(data.data);
        alert("SEO Evolution Synchronized.");
      }
    } catch (error) {
      alert("Encryption Error.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setSelectedPage((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-12 text-center font-black animate-pulse uppercase tracking-widest italic text-navy-900 bg-stone-50">Syncing Intelligence Hub...</div>;

  if (!selectedPage) return (
     <div className="min-h-screen bg-stone-50 flex items-center justify-center p-12 text-center">
       <Card className="p-12 max-w-md rounded-[3rem] border-none shadow-2xl bg-white space-y-6">
          <Globe className="w-16 h-16 text-stone-200 mx-auto" />
          <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter italic">No Active SEO Nodes</h3>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest leading-loose italic">Verify site structure in Content Central.</p>
          <Button onClick={() => window.location.href = '/admin/content'} className="bg-navy-950 text-gold-500 rounded-2xl w-full py-5">GOTO CONTENT CENTRAL</Button>
       </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 font-sans select-none overflow-x-hidden text-navy-950">
      <div className="max-w-[1600px] mx-auto">

        {/* Global Toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
          {/* Logo & Title */}
          <div className="lg:col-span-12 xl:col-span-4 flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.5rem] bg-navy-950 flex items-center justify-center shadow-xl flex-shrink-0">
              <Globe className="w-6 h-6 md:w-8 md:h-8 text-gold-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none break-words">SEO Command Deck</h1>
              <p className="text-navy-950/40 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] mt-2 italic">Intelligence Center</p>
            </div>
          </div>

          {/* Action Grid */}
          <div className="lg:col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
            {/* Page Selector */}
            <div className="relative w-full">
               <div 
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 className="w-full h-16 bg-white border-2 border-stone-100 rounded-3xl flex items-center justify-between px-6 cursor-pointer hover:border-navy-950 transition-all group shadow-sm overflow-hidden"
               >
                 <div className="flex flex-col min-w-0">
                   <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic">Target Node</span>
                   <span className="text-[12px] font-black text-navy-950 uppercase tracking-tight truncate">
                     {selectedPage?.title || "Select Page"}
                   </span>
                 </div>
                 <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={cn(
                      "hidden sm:inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      selectedPage?.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {selectedPage?.status || 'draft'}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-stone-300 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                 </div>
               </div>

               {isDropdownOpen && (
                 <div className="absolute top-20 left-0 w-full bg-white border-2 border-stone-100 rounded-[2rem] shadow-2xl z-[100] p-4 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                    <div className="relative mb-4">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                      <input 
                        type="text"
                        placeholder="SEARCH NODES..."
                        value={pageSearch}
                        onChange={(e) => setPageSearch(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-stone-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 outline-none border-none placeholder:text-stone-300"
                      />
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1">
                      {pages
                        .filter(p => p.title.toLowerCase().includes(pageSearch.toLowerCase()) || p.slug.toLowerCase().includes(pageSearch.toLowerCase()))
                        .map(page => (
                        <div 
                          key={page._id}
                          onClick={() => {
                            setSelectedPage(page);
                            setIsDropdownOpen(false);
                            setPageSearch("");
                          }}
                          className={cn(
                            "w-full p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:bg-stone-50 group",
                            selectedPage?._id === page._id ? "bg-navy-950 text-white" : "text-navy-950"
                          )}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-black uppercase tracking-tight truncate">{page.title}</span>
                            <span className={cn(
                              "text-[9px] font-medium opacity-40 italic",
                              selectedPage?._id === page._id ? "text-stone-300" : "text-navy-950"
                            )}>/{page.slug}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                             <div className={cn(
                               "w-1.5 h-1.5 rounded-full",
                               page.status === 'published' ? "bg-emerald-500" : "bg-amber-500"
                             )} />
                             <ChevronRight className={cn(
                               "w-3 h-3 transition-all",
                               selectedPage?._id === page._id ? "text-gold-500" : "text-stone-200 group-hover:translate-x-1"
                             )} />
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               )}
            </div>
            
            <Button
              onClick={() => window.location.href = '/admin/seo/advanced'}
              className="w-full h-16 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 bg-white text-navy-950 border-2 border-stone-100 hover:border-navy-950 shadow-sm"
            >
              <Settings size={20} />
              <span className="hidden md:inline">PROTOCOLS</span>
              <span className="md:hidden">GLOBAL</span>
            </Button>
            
            <Button
              onClick={() => window.location.href = '/admin/seo/analytics'}
              className="w-full h-16 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 bg-white text-navy-950 border-2 border-stone-100 hover:border-navy-950 shadow-sm"
            >
              <Activity size={20} />
              COCKPIT
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "w-full h-16 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl",
                saving ? "bg-stone-100 text-stone-400" : "bg-navy-950 text-gold-500 hover:bg-gold-500 hover:text-navy-950 shadow-navy-950/20"
              )}
            >
              {saving ? <RefreshCcw size={20} className="animate-spin" /> : <Save size={20} />}
              COMMIT
            </Button>
          </div>
        </div>

        {/* Global Hub Navigation */}
        <div className="flex flex-wrap items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { id: 'ranking', label: 'Primary Metatags', icon: BarChart3 },
            { id: 'social', label: 'Social Engagement', icon: Share2 },
            { id: 'technical', label: 'Technical SEO', icon: Code2 },
            { id: 'backup', label: 'Audit History', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SEOTab)}
              className={cn(
                "flex items-center gap-4 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-navy-950 text-gold-500 shadow-xl"
                  : "bg-white text-stone-400 hover:text-navy-950 border border-stone-100"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Main Editing Surface */}
          <div className="xl:col-span-8 space-y-12">
            
            {/* PRIMARY METADATA */}
            {activeTab === 'ranking' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-white space-y-12">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                        <TrendingUp className="text-gold-600" /> Primary Indexing Point
                      </h3>
                      <div className="flex items-center gap-6">
                         <span className={cn(
                             "text-[10px] font-black uppercase tracking-widest italic",
                             selectedPage?.status === 'published' ? "text-emerald-500" : "text-stone-300"
                         )}>
                             Status: {selectedPage?.status?.toUpperCase() || 'DRAFT'}
                         </span>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={selectedPage?.status === 'published'}
                              onChange={(e) => updateField('status', e.target.checked ? 'published' : 'draft')}
                            />
                            <div className="w-14 h-8 bg-stone-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 transition-colors shadow-inner"></div>
                         </label>
                      </div>
                   </div>

                   <div className="space-y-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Google Search Title (Meta-Title)</label>
                         <input
                           type="text"
                           value={selectedPage?.metaTitle || ''}
                           onChange={(e) => updateField('metaTitle', e.target.value)}
                           className="w-full h-16 bg-stone-50 border border-stone-50 rounded-3xl px-8 font-bold text-navy-950 focus:bg-white focus:border-gold-500 transition-all outline-none"
                         />
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Primary Focal Keywords (Comma Separated)</label>
                         <input
                           type="text"
                           value={selectedPage?.metaKeywords || ''}
                           onChange={(e) => updateField('metaKeywords', e.target.value)}
                           className="w-full h-16 bg-stone-50 border border-stone-50 rounded-3xl px-8 font-bold text-navy-950 focus:bg-white focus:border-gold-500 transition-all outline-none"
                         />
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Search Snippet Intent (Meta-Description)</label>
                         <textarea
                           rows={6}
                           value={selectedPage?.metaDescription || ''}
                           onChange={(e) => updateField('metaDescription', e.target.value)}
                           className="w-full bg-stone-50 border border-stone-50 rounded-[3rem] p-10 font-bold text-navy-950 focus:bg-white focus:border-gold-500 transition-all outline-none resize-none leading-relaxed"
                         />
                      </div>
                   </div>
                </Card>
              </div>
            )}

            {/* SOCIAL PRESENCE */}
            {activeTab === 'social' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-white space-y-12">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                         <Share2 size={24} />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic">Social Graph Intelligence (OpenGraph)</h3>
                   </div>

                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                      <div className="space-y-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-3">OG Share Title</label>
                            <input 
                              type="text" 
                              value={selectedPage?.ogTitle || ''}
                              onChange={(e) => updateField('ogTitle', e.target.value)}
                              className="w-full h-14 bg-stone-50 border border-stone-100 rounded-2xl px-6 text-xs font-bold text-navy-950 outline-none focus:border-blue-500"
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-3">OG Share Description</label>
                            <textarea 
                              rows={5}
                              value={selectedPage?.ogDescription || ''}
                              onChange={(e) => updateField('ogDescription', e.target.value)}
                              className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-6 text-xs font-bold text-navy-950 outline-none focus:border-blue-500 resize-none leading-relaxed font-medium"
                            />
                         </div>
                      </div>

                      <div className="space-y-6">
                         <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-3">Social Thumbnail Payload (OG Image)</label>
                         <div className="group relative aspect-video bg-stone-50 border-2 border-dashed border-stone-200 rounded-[3rem] overflow-hidden flex items-center justify-center p-2 transition-all hover:border-blue-500">
                            {selectedPage?.ogImage ? (
                               <>
                                  <img src={selectedPage.ogImage} className="w-full h-full object-cover rounded-[2.5rem] shadow-xl" />
                                  <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6">
                                     <button onClick={() => setIsPickerOpen({ open: true, field: 'ogImage' })} className="bg-white text-navy-950 p-5 rounded-2xl shadow-2xl hover:scale-110 transition-transform">
                                        <Layers size={22} />
                                     </button>
                                     <button onClick={() => updateField('ogImage', '')} className="bg-rose-500 text-white p-5 rounded-2xl shadow-2xl hover:scale-110 transition-transform">
                                        <Trash2 size={22} />
                                     </button>
                                  </div>
                               </>
                            ) : (
                               <button 
                                 onClick={() => setIsPickerOpen({ open: true, field: 'ogImage' })}
                                 className="flex flex-col items-center gap-6 text-stone-300 hover:text-blue-500 transition-colors"
                               >
                                  <Plus size={52} className="stroke-[1px]" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Select Visual Asset</span>
                               </button>
                            )}
                         </div>
                      </div>
                   </div>
                </Card>
              </div>
            )}

            {/* TECHNICAL PANEL */}
            {activeTab === 'technical' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-white space-y-12">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                        <Code2 className="text-navy-950" /> Technical Ranking Logic
                      </h3>
                      <button onClick={() => setIsRedirectModalOpen(true)} className="px-6 py-3 rounded-2xl bg-gold-50 text-gold-600 font-black text-[10px] uppercase tracking-widest hover:bg-gold-500 hover:text-navy-950 transition-all flex items-center gap-3">
                         <RefreshCcw size={14} />
                         Routing Overrides
                      </button>
                   </div>

                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                      <div className="space-y-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-3">Canonical Host Link</label>
                            <input
                              type="text"
                              value={selectedPage?.canonicalUrl || ''}
                              onChange={(e) => updateField('canonicalUrl', e.target.value)}
                              className="w-full h-16 bg-stone-50 border border-stone-50 rounded-3xl px-8 font-bold text-navy-950 focus:border-gold-500 transition-all outline-none"
                              placeholder="Original URL Protocol..."
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-3">Crawler Compliance (Robots)</label>
                            <select
                              value={selectedPage?.robots || 'index, follow'}
                              onChange={(e) => updateField('robots', e.target.value)}
                              className="w-full h-16 bg-stone-50 border border-stone-50 rounded-3xl px-8 font-black uppercase text-[11px] tracking-widest text-navy-950 outline-none cursor-pointer"
                            >
                               <option value="index, follow">Public & Indexable</option>
                               <option value="noindex, follow">Private (No-Index)</option>
                               <option value="noindex, nofollow">Exclusion Protocol</option>
                            </select>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-3">JSON-LD Structured Markup</label>
                         <textarea
                          rows={8}
                          value={typeof selectedPage?.schemaMarkup === 'string' ? selectedPage.schemaMarkup : JSON.stringify(selectedPage?.schemaMarkup || {}, null, 2)}
                          onChange={(e) => {
                            const val = e.target.value;
                            try {
                              const json = JSON.parse(val);
                              updateField('schemaMarkup', json);
                              setSchemaError(null);
                            } catch (err: any) {
                              updateField('schemaMarkup', val);
                              setSchemaError("JSON ERROR");
                            }
                          }}
                          className={cn(
                            "w-full bg-navy-950 text-gold-500 font-mono text-[11px] rounded-[3rem] p-10 outline-none resize-none transition-all shadow-xl leading-relaxed",
                            schemaError ? "ring-2 ring-rose-500" : "border-transparent"
                          )}
                        />
                      </div>
                   </div>
                </Card>
              </div>
            )}

            {/* AUDIT HISTORY */}
            {activeTab === 'backup' && (
              <div className="animate-in fade-in duration-500">
                 <Card className="p-12 border-none shadow-2xl rounded-[4rem] bg-white space-y-12">
                    <div className="flex items-center justify-between border-b border-stone-50 pb-8">
                       <div>
                          <h4 className="text-2xl font-black uppercase italic tracking-tighter">Evolution Protocol Log</h4>
                          <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest italic font-mono mt-2">Historical Node Shifts & Visual Calibration</p>
                       </div>
                       <History size={32} className="text-navy-950" />
                    </div>

                    <div className="space-y-6 relative ml-4 border-l-2 border-stone-50 pl-10 py-4">
                       {selectedPage?.notes && selectedPage.notes.length > 0 ? (
                         selectedPage.notes.map((audit: any, idx: number) => (
                           <div key={idx} className="relative group">
                              {/* Timeline Point */}
                              <div className="absolute -left-[45px] top-1 w-2.5 h-2.5 rounded-full bg-stone-100 group-hover:bg-navy-950 transition-all border-2 border-white shadow-sm" />
                              
                               <div className="p-8 rounded-[3rem] bg-stone-50/50 hover:bg-white transition-all border border-transparent hover:border-stone-100 hover:shadow-2xl shadow-sm">
                                  <p className="text-[16px] font-black text-navy-950 mb-3 leading-tight tracking-tight italic">
                                     {audit.note}
                                  </p>
                                  <div className="flex items-center gap-4">
                                     <div className="flex items-center gap-2 px-5 py-2 bg-white rounded-[2rem] border border-stone-100 shadow-md">
                                        <Clock size={12} className="text-navy-400 animate-pulse" />
                                        <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] font-mono italic">
                                           {new Date(audit.addedAt || audit.createdAt).toLocaleString('en-IN', {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                           })}
                                        </p>
                                     </div>
                                  </div>
                               </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-20 space-y-6">
                            <History size={48} className="mx-auto text-stone-100" />
                            <p className="text-[10px] font-black text-stone-200 uppercase tracking-[0.4em] italic">No prior synchronization logs found</p>
                         </div>
                       )}
                    </div>
                 </Card>
              </div>
            )}
          </div>

          {/* Dynamic Radar Sidebar */}
          <div className="xl:col-span-4 space-y-12">
             
             {/* SERP PREVIEW RADAR */}
             <Card className="p-10 bg-white border border-stone-100 shadow-2xl rounded-[3.5rem] space-y-10 overflow-hidden group">
                <div className="space-y-8">
                   <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                      <Search size={14} /> Global Intelligence Preview
                   </h4>

                   <div className="p-10 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-inner group-hover:border-gold-500/30 transition-all duration-1000">
                      <div className="flex items-center gap-3 mb-4 text-[12px] text-blue-800 font-bold tracking-tight overflow-hidden italic">
                         <Globe size={13} className="shrink-0" />
                         <span className="truncate">https://mokshasewa.org/{selectedPage?.slug}</span>
                      </div>
                      <h5 className="text-2xl font-black text-blue-900 group-hover:underline cursor-pointer leading-tight mb-4 lowercase tracking-tighter italic">
                         {selectedPage?.metaTitle || 'UNNAMED_PAGE_PROTOCOL'}
                      </h5>
                      <p className="text-[14px] text-gray-500 line-clamp-4 leading-relaxed font-medium italic opacity-70">
                         {selectedPage?.metaDescription || 'Add metadata for search visibility preview...'}
                      </p>
                   </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-stone-50">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest italic">
                       <span>Score Radar</span>
                       <span className="text-emerald-500">{selectedPage?.seoScore || 0}% SECURE</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-50 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${selectedPage?.seoScore || 0}%` }} />
                    </div>
                </div>
             </Card>

             {/* STATS DECK */}
             <Card className="p-10 bg-navy-950 text-white border-none shadow-2xl rounded-[3.5rem] relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl" />
                
                <div className="space-y-10 relative z-10">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Search Node Analytics</h4>
                   
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Views</p>
                         <p className="text-2xl font-black italic tracking-tighter text-gold-500 font-mono">{selectedPage?.pageViews || 0}</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Organic Flow</p>
                         <p className="text-2xl font-black italic tracking-tighter text-emerald-500 font-mono">{selectedPage?.organicTraffic || 0}</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Bounce Delta</p>
                         <p className="text-2xl font-black italic tracking-tighter text-rose-500 font-mono">{selectedPage?.bounceRate || 0}%</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Avg Pulse (Sec)</p>
                         <p className="text-2xl font-black italic tracking-tighter text-blue-500 font-mono">{selectedPage?.avgTimeOnPage || 0}</p>
                      </div>
                   </div>
                </div>
             </Card>

             {/* TACTICAL SHORTCUTS */}
             <div className="space-y-5">
                <button 
                   onClick={() => window.location.href = `/admin/content?slug=${selectedPage.slug}`}
                   className="w-full flex items-center justify-between p-8 bg-white border border-stone-100 rounded-[2.5rem] shadow-sm hover:border-navy-950 transition-all group"
                >
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all">
                         <Layout size={20} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest italic">Open Architecture</span>
                   </div>
                   <ChevronRight size={18} className="text-stone-200 group-hover:text-navy-950 transform group-hover:translate-x-2 transition-all" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Redirect Authority Modal */}
      {isRedirectModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-navy-950/70 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
              <div className="p-12 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
                 <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter">Routing Authority Override</h4>
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mt-2 italic font-mono leading-none">301_PERMANENT_PROTOCOL</p>
                 </div>
                 <button onClick={() => setIsRedirectModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white text-stone-400 hover:text-navy-950 flex items-center justify-center shadow-lg transition-all border border-stone-100">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-12 space-y-8 bg-white">
                 <div className="p-10 bg-gold-500 text-navy-950 rounded-[3rem] flex gap-6 border border-gold-400/50">
                    <AlertCircle size={28} className="shrink-0" />
                    <div>
                       <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed italic">Redirect Pattern Definition</p>
                       <p className="text-[10px] font-bold mt-2 uppercase italic leading-relaxed opacity-80">Format: /old-path &gt; /new-path (Logic: 301 Permanent)</p>
                    </div>
                 </div>
                 <textarea
                   rows={6}
                   value={selectedPage?.redirects || ''}
                   onChange={(e) => updateField('redirects', e.target.value)}
                   className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2.5rem] p-12 font-mono text-xs font-bold text-navy-950 focus:bg-white focus:border-navy-950 outline-none transition-all placeholder:text-stone-200"
                   placeholder="/old-slug > /new-slug"
                 />
                 <Button onClick={() => setIsRedirectModalOpen(false)} className="w-full h-16 bg-navy-950 text-gold-500 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl">Confirm Patterns</Button>
              </div>
           </div>
        </div>
      )}

      {/* Visual Archive Integration */}
      {isPickerOpen.open && (
        <AssetPickerHub 
           onClose={() => setIsPickerOpen({ open: false, field: '' })}
           onSelect={(url) => {
              updateField(isPickerOpen.field, url);
              setSelectedPage((prev: any) => ({ ...prev, [isPickerOpen.field]: url })); // Force double sync
              setIsPickerOpen({ open: false, field: '' });
           }}
        />
      )}
    </div>
  );
}

function AssetPickerHub({ onClose, onSelect }: { onClose: () => void, onSelect: (url: string) => void }) {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
                const response = await fetch(`${API_BASE_URL}/api/media?limit=100`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = await response.json();
                if (data.success) {
                    setImages(Array.isArray(data.data) ? data.data : (data.data.images || []));
                }
            } catch (error) { console.error("Picker error:", error); } 
            finally { setLoading(false); }
        };
        fetchGallery();
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-stone-50 flex flex-col animate-in slide-in-from-bottom duration-700">
            <div className="bg-white border-b border-stone-200 px-12 py-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-navy-950 rounded-2xl flex items-center justify-center text-gold-500 shadow-xl">
                        <Layers size={22} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-navy-950 leading-none">Visual Archive Deployment</h2>
                        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] italic mt-3 font-mono">Selecting OG_IMAGE_PAYLOAD for Hot-Swap</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-16 h-16 rounded-3xl bg-white border border-stone-200 text-stone-400 hover:text-navy-950 transition-all flex items-center justify-center shadow-sm group">
                    <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-12 bg-stone-50/50">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse">
                        <RefreshCcw size={48} className="text-navy-200 animate-spin" />
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-navy-300">Synchronizing Social Archive...</p>
                    </div>
                ) : (
                    <div className="max-w-[1700px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 pb-32">
                        {images.map((img: any) => (
                            <div
                                key={img._id || img.id}
                                onClick={() => onSelect(img.url)}
                                className="group relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white cursor-pointer hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all border-4 border-white"
                            >
                                <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-10">
                                    <p className="text-[11px] font-black text-gold-500 uppercase tracking-widest italic">{img.title || 'UNNAMED_NODE'}</p>
                                    <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-2">{img.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
