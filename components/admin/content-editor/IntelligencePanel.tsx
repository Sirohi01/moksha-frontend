'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Monitor, Globe, Lock, Bell, SkipForward, ArrowRight,
  Shield, Zap, Activity, Cpu, Code
} from 'lucide-react';

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

interface IntelligencePanelProps {
  seoData: SEOData;
  setSeoData: React.Dispatch<React.SetStateAction<SEOData>>;
}

export default function IntelligencePanel({ seoData, setSeoData }: IntelligencePanelProps) {
  const updateField = (field: keyof SEOData, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">Technical Intelligence</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage tracking, analytics, and advanced website behavior.</p>
        </div>
        <div className="flex items-center gap-3 bg-amber-50 text-amber-700 px-5 py-2.5 rounded-2xl border border-amber-100">
          <Cpu className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Protocol Engine Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Tracking Scripts Card */}
        <Card className="p-10 rounded-[3rem] border-navy-50 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="space-y-10">
             <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-950 uppercase italic tracking-tighter">Analytics & Tracking</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect with Google and other services</p>
                </div>
              </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Google Analytics Identifier (GA4)</label>
                <textarea
                  value={seoData.analyticsCode}
                  onChange={(e) => updateField('analyticsCode', e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-[11px] focus:ring-4 focus:ring-gold-500/10 min-h-[120px] transition-all"
                  placeholder="Paste your <!-- Google tag (gtag.js) --> here..."
                />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-1">Used for tracking website visitors and behavior.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Google Tag Manager (GTM)</label>
                <textarea
                  value={seoData.gtmCode}
                  onChange={(e) => updateField('gtmCode', e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-[11px] focus:ring-4 focus:ring-gold-500/10 min-h-[120px] transition-all"
                  placeholder="Paste your <!-- Google Tag Manager --> code here..."
                />
              </div>

              <div className="pt-4 border-t border-gray-50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-950 mb-4 flex items-center gap-2">
                   <Code className="w-3 h-3 text-gold-600" /> Advanced Code Injections
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Inject into Head</label>
                      <textarea
                        value={seoData.headCode}
                        onChange={(e) => updateField('headCode', e.target.value)}
                        className="w-full p-3 bg-gray-50/50 border border-gray-100 rounded-xl font-mono text-[10px] focus:ring-2 focus:ring-gold-500/10 min-h-[80px]"
                        placeholder="Head script..."
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Inject into Body</label>
                      <textarea
                        value={seoData.bodyCode}
                        onChange={(e) => updateField('bodyCode', e.target.value)}
                        className="w-full p-3 bg-gray-50/50 border border-gray-100 rounded-xl font-mono text-[10px] focus:ring-2 focus:ring-gold-500/10 min-h-[80px]"
                        placeholder="Body script..."
                      />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-10">
          {/* Redirects & Visibility Card */}
          <Card className="p-10 rounded-[3rem] border-navy-50 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
             <div className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <SkipForward className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-navy-950 uppercase italic tracking-tighter">Automatic Redirects</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Forward old pages to new ones</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">301 Redirect List (Old Link &gt; New Link)</label>
                   <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
                      <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-[11px] font-black text-amber-900 uppercase">Warning: Permanent Redirects</p>
                         <p className="text-[10px] text-amber-700/80 mt-1 leading-relaxed">Changes take effect immediately globally. Use one per line.</p>
                      </div>
                   </div>
                   <textarea
                     value={seoData.redirects}
                     onChange={(e) => updateField('redirects', e.target.value)}
                     className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-[11px] focus:ring-4 focus:ring-gold-500/10 min-h-[140px] transition-all"
                     placeholder="/old-page-link > /new-page-link"
                   />
                </div>

                <div className="pt-6">
                  <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1 mb-4 block">Search Engine Visibility Policy</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                        { id: 'index, follow', label: 'Publicly Visible', desc: 'Allow Google to index this page' },
                        { id: 'noindex, follow', label: 'Internal Only', desc: 'Hide from search results' },
                     ].map((policy) => (
                        <button
                          key={policy.id}
                          onClick={() => updateField('robots', policy.id)}
                          className={`p-5 rounded-2xl border transition-all text-left group ${
                            seoData.robots === policy.id 
                            ? 'bg-navy-950 border-navy-950 text-white shadow-xl' 
                            : 'bg-white border-gray-100 text-navy-950 hover:border-navy-200'
                          }`}
                        >
                           <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-black uppercase tracking-widest">{policy.label}</span>
                              <div className={`w-3 h-3 rounded-full border-2 border-current transition-all ${seoData.robots === policy.id ? 'bg-gold-500 border-gold-500' : 'opacity-20'}`} />
                           </div>
                           <p className={`text-[9px] font-bold uppercase tracking-widest ${seoData.robots === policy.id ? 'text-gray-400' : 'text-gray-400'}`}>
                              {policy.desc}
                           </p>
                        </button>
                     ))}
                  </div>
                </div>
             </div>
          </Card>

          {/* Infrastructure Health Sidebar */}
          <Card className="p-8 rounded-[2.5rem] bg-navy-50/50 border border-navy-100 shadow-sm">
             <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center text-gold-500 mb-6 shadow-2xl rotate-3">
                   <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-black text-navy-950 uppercase italic tracking-tight mb-2">Protocol Shield Active</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
                   Your website is protected by our advanced SEO architecture. All changes are encrypted and deployed to the edge.
                </p>
                <div className="w-full h-1 bg-navy-100 mt-10 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-gold-500 rounded-full" />
                </div>
                <div className="flex justify-between w-full mt-3">
                   <span className="text-[8px] font-black text-navy-400 uppercase tracking-widest">Load Speed</span>
                   <span className="text-[8px] font-black text-navy-950 uppercase tracking-widest">Very Fast</span>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
