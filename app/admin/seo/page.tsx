'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { setNestedValue } from '@/lib/editor-utils';
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
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tabs for the SEO Hub
type SEOTab = 'ranking' | 'technical' | 'backup';

export default function SEOCommandDeck() {
  const [activeTab, setActiveTab] = useState<SEOTab>('ranking');
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
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
    if (!selectedPage) return;
    setSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seo/${selectedPage._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(selectedPage)
      });
      const data = await response.json();
      if (data.success) {
        alert("SEO Configuration Saved Successfully!");
      }
    } catch (error) {
      alert("Failed to save SEO config.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-12 text-center font-black animate-pulse uppercase tracking-widest italic text-navy-900 bg-stone-50">Syncing Intelligence Hub...</div>;

  if (!selectedPage) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-12">
      <Card className="p-12 text-center max-w-md rounded-[3rem] border-none shadow-2xl">
        <Globe className="w-16 h-16 text-navy-200 mx-auto mb-6" />
        <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter mb-4">No SEO Nodes Detected</h3>
        <p className="text-navy-950/60 font-medium mb-8">Begin by initializing your site's core structure in 'Content Central'.</p>
        <Button 
          onClick={() => window.location.href = '/admin/content'} 
          className="bg-navy-950 text-gold-500 rounded-2xl px-8"
        >
          GO TO CONTENT CENTRAL
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12 font-sans select-none">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-navy-950 flex items-center justify-center shadow-xl">
                <Globe className="w-5 h-5 text-gold-500" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-navy-950 italic">SEO Command Deck</h1>
            </div>
            <p className="text-navy-950/60 font-black text-xs uppercase tracking-[0.2em]">Surgical Search Intelligence & Technical Indexing Portal</p>
          </div>

          <div className="flex items-center gap-4">
            {pages && Array.isArray(pages) && pages.length > 0 && (
              <select 
                value={selectedPage?._id}
                onChange={(e) => setSelectedPage(pages.find(p => p._id === e.target.value))}
                className="bg-white border-2 border-navy-50 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-navy-950 shadow-sm focus:border-gold-500 outline-none transition-all"
              >
                {pages.map(page => (
                  <option key={page._id} value={page._id}>{page.title} (/{page.slug})</option>
                ))}
              </select>
            )}
            <Button 
                onClick={handleSave} 
                disabled={saving || !selectedPage}
                className="bg-navy-950 text-gold-500 shadow-xl px-10 py-5 rounded-3xl hover:bg-gold-600 hover:text-navy-950 transition-all"
            >
              {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{saving ? 'SAVING...' : 'COMMIT SEO HUB'}</span>
            </Button>
          </div>
        </div>

        {/* Intelligence Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'ranking', label: 'Search Ranking', icon: BarChart3 },
            { id: 'technical', label: 'Technical Setup', icon: Settings },
            { id: 'backup', label: 'Version Backup', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SEOTab)}
              className={cn(
                "flex items-center gap-3 px-8 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-navy-950 text-gold-500 shadow-xl scale-105" 
                  : "bg-white text-navy-400 hover:text-navy-950 hover:bg-navy-50 border border-navy-50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Control Panel (Left/Center) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SEARCH RANKING WORKFLOW */}
            {activeTab === 'ranking' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white">
                  <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter mb-8 italic flex items-center gap-3">
                    <TrendingUp className="text-gold-600" /> SERP Presence Intelligence
                  </h3>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest block mb-3">Google Search Metatitle (Max 60)</label>
                      <input 
                        type="text" 
                        value={selectedPage?.metaTitle || ''}
                        onChange={(e) => setSelectedPage({...selectedPage, metaTitle: e.target.value})}
                        className="w-full bg-navy-50/30 border-2 border-navy-50 rounded-2xl px-6 py-5 font-bold text-navy-950 focus:border-navy-950 outline-none transition-all"
                        placeholder="Premium Moksha Sewa Services | Dignity for All"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest block mb-3">SERP Snippet Description (Max 160)</label>
                      <textarea 
                        rows={4}
                        value={selectedPage?.metaDescription || ''}
                        onChange={(e) => setSelectedPage({...selectedPage, metaDescription: e.target.value})}
                        className="w-full bg-navy-50/30 border-2 border-navy-50 rounded-2xl px-6 py-5 font-bold text-navy-950 focus:border-navy-950 outline-none transition-all resize-none"
                        placeholder="Providing dignified burials and cremation services for unclaimed souls across Kashi, Haridwar, and Prayagraj..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest block mb-3">Primary Focus Keyword</label>
                            <input 
                                type="text"
                                value={selectedPage?.focusKeyword || ''}
                                onChange={(e) => setSelectedPage({...selectedPage, focusKeyword: e.target.value})}
                                className="w-full bg-navy-50/30 border-2 border-navy-50 rounded-2xl px-6 py-5 font-bold text-navy-950 focus:border-navy-950 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest block mb-3">Current Global Ranking</label>
                            <div className="flex items-center gap-4 bg-navy-50/30 rounded-2xl px-6 py-5 font-black text-navy-950 border-2 border-navy-50">
                                <span className="text-xl italic">#{selectedPage?.seoRanking?.currentRank || 'N/A'}</span>
                                <span className="text-[10px] text-green-600">▲ 12 positions globally</span>
                            </div>
                        </div>
                    </div>
                  </div>
                </Card>

                {/* Ranking Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-8 bg-gold-500 text-navy-950 border-none shadow-xl rounded-[2.5rem]">
                        <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">SEO Momentum</p>
                        <p className="text-3xl font-black tracking-tighter">84.2%</p>
                        <p className="text-[9px] font-bold mt-2 uppercase opacity-80">Highly Optimized</p>
                    </Card>
                    <Card className="p-8 bg-white border-2 border-navy-50 shadow-xl rounded-[2.5rem]">
                        <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mb-2">Organic Reach</p>
                        <p className="text-3xl font-black text-navy-950 tracking-tighter">12.5k</p>
                        <p className="text-[9px] font-bold mt-2 text-green-600 uppercase">Weekly View Growth</p>
                    </Card>
                    <Card className="p-8 bg-navy-950 text-white border-none shadow-xl rounded-[2.5rem]">
                        <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">Competitor Gap</p>
                        <p className="text-3xl font-black tracking-tighter text-gold-500">+14%</p>
                        <p className="text-[9px] font-bold mt-2 uppercase opacity-80">Superior Ranking</p>
                    </Card>
                </div>
              </div>
            )}

            {/* TECHNICAL SETUP WORKFLOW */}
            {activeTab === 'technical' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white">
                  <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter mb-8 italic flex items-center gap-3">
                    <ShieldCheck className="text-navy-900" /> Infrastructure & Indexing Logic
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest block mb-3">Canonical Redirection URL</label>
                            <input 
                                type="text"
                                value={selectedPage?.seoTechnical?.canonicalUrl || ''}
                                onChange={(e) => setSelectedPage({...selectedPage, seoTechnical: {...selectedPage.seoTechnical, canonicalUrl: e.target.value}})}
                                className="w-full bg-navy-50/30 border-2 border-navy-50 rounded-2xl px-6 py-4 font-bold text-navy-950"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest block mb-3">Robots.txt Directives</label>
                            <select 
                                value={selectedPage?.seoTechnical?.robots || 'index, follow'}
                                onChange={(e) => setSelectedPage({...selectedPage, seoTechnical: {...selectedPage.seoTechnical, robots: e.target.value}})}
                                className="w-full bg-navy-50/30 border-2 border-navy-50 rounded-2xl px-6 py-4 font-bold text-navy-950"
                            >
                                <option value="index, follow">Index, Follow (Standard)</option>
                                <option value="noindex, nofollow">No-Index, No-Follow (Private)</option>
                                <option value="index, nofollow">Index, No-Follow</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest block mb-3">Schema Markup (Advanced JSON-LD)</label>
                            <textarea 
                                rows={8}
                                value={typeof selectedPage?.schemaMarkup === 'string' ? selectedPage.schemaMarkup : JSON.stringify(selectedPage?.schemaMarkup || {}, null, 2)}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    try {
                                        const json = JSON.parse(val);
                                        setSelectedPage({...selectedPage, schemaMarkup: json});
                                        setSchemaError(null);
                                    } catch(err: any) {
                                        setSelectedPage({...selectedPage, schemaMarkup: val}); // Keep as string while typing
                                        setSchemaError("Invalid JSON structure");
                                    }
                                }}
                                className={cn(
                                    "w-full bg-navy-950 text-gold-500 font-mono text-[10px] rounded-2xl px-6 py-5 outline-none resize-none transition-all",
                                    schemaError ? "border-2 border-rose-500" : "border-2 border-transparent"
                                )}
                            />
                            {schemaError && <p className="text-[9px] font-black text-rose-500 mt-2 uppercase tracking-widest">{schemaError}</p>}
                        </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-navy-950 text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <Lock className="w-6 h-6 text-gold-500" />
                        <h4 className="text-lg font-black uppercase tracking-tighter">Security & Redirection</h4>
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10">
                        <div>
                            <p className="font-bold text-sm mb-1">Automatic 301 Redirect Hub</p>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">
                                {selectedPage?.redirects ? `${selectedPage.redirects.split('\n').filter((l:string) => l.includes('>')).length} Active Rules` : 'No Active Redirect Rules'}
                            </p>
                        </div>
                        <Button 
                            onClick={() => setIsRedirectModalOpen(true)}
                            className="bg-gold-500 text-navy-950 font-black text-[9px] uppercase tracking-widest px-6 py-2 rounded-xl"
                        >
                            Edit Routing
                        </Button>
                    </div>
                </Card>
              </div>
            )}

            {/* VERSION BACKUP WORKFLOW */}
            {activeTab === 'backup' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white h-[600px] flex flex-col">
                  <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter mb-8 italic flex items-center gap-3">
                    <History className="text-navy-950" /> System State Backup Engine
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-none text-center">
                    {(selectedPage?.previousVersions?.length || 0) === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full opacity-30 italic font-black uppercase text-[10px] tracking-widest">
                        <Database className="w-12 h-12 mb-4" />
                        No previous versions recorded for intelligence restoration.
                      </div>
                    ) : (
                      selectedPage?.previousVersions?.map((v: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-stone-50 border border-stone-100 group hover:border-gold-500 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-navy-950 border border-navy-50">
                                    V{v.version}
                                </div>
                                <div className="text-left">
                                    <p className="text-navy-950 font-black text-[11px] uppercase tracking-widest truncate max-w-[200px]">RESTORE STATE ALPHA-{v.version}</p>
                                    <p className="text-navy-950/40 font-bold text-[9px] uppercase mt-1">{new Date(v.modifiedAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <Button className="bg-transparent border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Restore State</Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar Analytics & Live Preview (Right) */}
          <div className="space-y-8">
            
            {/* GOOGLE PREVIEW (REALTIME) */}
            <Card className="p-8 bg-white border-2 border-navy-50 shadow-xl rounded-[2.5rem]">
              <h4 className="text-[10px] font-black text-navy-950/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Search className="w-4 h-4" /> Real-time SERP Preview
              </h4>
              
              <div className="p-6 bg-navy-50/20 rounded-3xl border border-navy-50">
                <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-3 h-3 text-navy-400 font-black" />
                    <span className="text-xs text-blue-800 font-bold tracking-tight">https://mokshasewa.org/{selectedPage?.slug}</span>
                </div>
                <h5 className="text-xl font-bold text-blue-900 font-sans leading-tight hover:underline cursor-pointer mb-2">
                  {selectedPage?.metaTitle || 'Default Page Title | Moksha Sewa'}
                </h5>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  <span className="text-[10px] font-black text-gray-400 mr-2 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — </span>
                  {selectedPage?.metaDescription || 'Add a meta description to see how this page will appear in human searches. A good description improves visibility and trust...'}
                </p>
              </div>
              <div className="mt-8 flex justify-between items-center text-[9px] font-black text-navy-950/40 uppercase tracking-widest">
                  <span>Intelligence Match</span>
                  <span className="text-green-600">92% Optimal</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-navy-100 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-green-500 animate-pulse"></div>
              </div>
            </Card>

            {/* QUICK ACTIONS */}
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-6 bg-white border-2 border-navy-50 rounded-3xl group hover:border-navy-950 transition-all text-left">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-navy-50 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all">
                        <Layout className="w-5 h-5" />
                    </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-navy-950">Structural Audit</div>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </button>
              
              <button className="w-full flex items-center justify-between p-6 bg-white border-2 border-navy-50 rounded-3xl group hover:border-navy-950 transition-all text-left">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-navy-50 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all">
                        <ExternalLink className="w-5 h-5" />
                    </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-navy-950">Social Cloud Sync</div>
                </div>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </button>
            </div>

            {/* PERFORMANCE RADAR */}
            <Card className="p-8 bg-navy-950 text-white border-none shadow-2xl rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-60">Technical Intelligence Radar</h4>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                            <span>Index Latency</span>
                            <span>Critical Fast</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-gold-500"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                            <span>Human Readability</span>
                            <span>A+ Elite</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[88%] h-full bg-gold-500"></div>
                        </div>
                    </div>
                </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Redirect Management Modal */}
      {isRedirectModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-2xl bg-navy-950/60 animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-10 border-b border-navy-50 flex justify-between items-center bg-navy-50/50">
                    <div>
                        <h4 className="text-xl font-black text-navy-950 uppercase italic tracking-tighter">Redirect Authority</h4>
                        <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mt-1 italic">301 Permanent Protocol Management</p>
                    </div>
                    <button onClick={() => setIsRedirectModalOpen(false)} className="w-10 h-10 rounded-full bg-white text-navy-400 hover:text-navy-950 flex items-center justify-center shadow-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <p className="text-[10px] font-bold text-amber-900 uppercase leading-relaxed tracking-wider">
                            Format: <code className="bg-amber-100 px-1 rounded">/old-path &gt; /new-path</code>. One rule per line. These rules are used to preserve SEO ranking for moved content.
                        </p>
                    </div>
                    <textarea 
                        rows={10}
                        value={selectedPage?.redirects || ''}
                        onChange={(e) => setSelectedPage({...selectedPage, redirects: e.target.value})}
                        className="w-full bg-navy-50/30 border-2 border-navy-50 rounded-[2rem] p-8 font-mono text-xs text-navy-950 focus:border-navy-950 outline-none transition-all placeholder:text-navy-200"
                        placeholder="/old-slug &gt; /new-slug&#10;/about-us &gt; /about"
                    />
                </div>
                <div className="p-8 bg-navy-50/50 flex justify-center">
                    <Button onClick={() => setIsRedirectModalOpen(false)} className="bg-navy-950 text-gold-500 px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Confirm Logic</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}