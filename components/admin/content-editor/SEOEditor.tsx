'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  Globe, Layout, Monitor, Hash, RefreshCw,
  Terminal, Twitter, Smartphone, Info, Search
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

interface SEOEditorProps {
  seoData: SEOData;
  setSeoData: React.Dispatch<React.SetStateAction<SEOData>>;
}

const CharCount = ({ current, max }: { current: number; max: number }) => (
  <span className={`text-[10px] font-bold px-2 py-1 rounded ${current > max ? 'text-red-500 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
    {current}/{max} characters
  </span>
);

export default function SEOEditor({ seoData, setSeoData }: SEOEditorProps) {
  const updateField = (field: keyof SEOData, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">Search Engine Excellence</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Control how this page appears on Google and social media.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">SEO Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          {/* Google Appearance Card */}
          <Card className="p-10 rounded-[3rem] border-navy-50 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-navy-950">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-950 uppercase italic tracking-tighter">Google Search Appearance</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">How people see your page on Google</p>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Main Page Title (on Google)</label>
                    <CharCount current={seoData.title?.length || 0} max={65} />
                  </div>
                  <input
                    type="text"
                    value={seoData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all placeholder:text-gray-300"
                    placeholder="Enter the title people will see on Google search..."
                  />
                  <p className="text-[10px] text-gray-400 italic ml-1 flex items-center gap-1.5 font-medium">
                    <Info className="w-3 h-3" /> Tip: Keep it under 65 characters for best results.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Short Description (Snippet)</label>
                    <CharCount current={seoData.description?.length || 0} max={160} />
                  </div>
                  <textarea
                    value={seoData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all min-h-[140px] placeholder:text-gray-300"
                    placeholder="Briefly describe what this page is about to attract visitors..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Keywords for Search</label>
                    <input
                      type="text"
                      value={seoData.keywords}
                      onChange={(e) => updateField('keywords', e.target.value)}
                      className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-xs font-bold transition-all uppercase tracking-widest"
                      placeholder="NGO, MOKSHA, SEVA"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Official Page Link (Canonical)</label>
                    <input
                      type="url"
                      value={seoData.canonical}
                      onChange={(e) => updateField('canonical', e.target.value)}
                      className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-xs font-bold transition-all font-mono"
                      placeholder="https://mokshasewa.org/page-name"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Social Sharing Card */}
          <Card className="p-10 rounded-[3rem] border-navy-50 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-950 uppercase italic tracking-tighter">Social Media Display</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">How this page looks on WhatsApp, Facebook, etc.</p>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Title for Social Sharing</label>
                  <input
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => updateField('ogTitle', e.target.value)}
                    className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all"
                    placeholder="Clear heading for WhatsApp/Facebook shares..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Description for Social Sharing</label>
                  <textarea
                    value={seoData.ogDescription}
                    onChange={(e) => updateField('ogDescription', e.target.value)}
                    className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all min-h-[100px]"
                    placeholder="Attractive sentence to encourage people to click..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Twitter Display Style</label>
                    <select
                      value={seoData.twitterCard}
                      onChange={(e) => updateField('twitterCard', e.target.value)}
                      className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest focus:ring-4 focus:ring-gold-500/10"
                    >
                      <option value="summary">Small Image & Summary</option>
                      <option value="summary_large_image">Large Card with Image</option>
                      <option value="app">Application Card</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Social Preview Image Link</label>
                    <input
                      type="url"
                      value={seoData.ogImage}
                      onChange={(e) => updateField('ogImage', e.target.value)}
                      className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-xs font-bold transition-all"
                      placeholder="Link to your 1200x630 sharing image..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Structure & Hierarchy Card */}
          <Card className="p-10 rounded-[3rem] border-navy-50 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-950 uppercase italic tracking-tighter">Page Structure</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identity and Organization of the page</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Main Page Heading (H1)</label>
                  <input
                    type="text"
                    value={seoData.h1Tag}
                    onChange={(e) => updateField('h1Tag', e.target.value)}
                    className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all"
                    placeholder="The big title at the top of your page..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Website Address (Slug)</label>
                  <input
                    type="text"
                    value={seoData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all lowercase"
                    placeholder="my-page-url"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-navy-800 ml-1">Breadcrumb Name</label>
                <input
                  type="text"
                  value={seoData.breadcrumb}
                  onChange={(e) => updateField('breadcrumb', e.target.value)}
                  className="w-full h-16 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:bg-white focus:border-gold-500 text-sm font-bold transition-all"
                  placeholder="Home > Services > Antim Sanskar"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <Card className="p-8 rounded-[2.5rem] bg-navy-950 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gold-500 mb-6 italic">SEO Health Check</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Mobile Optimized</span>
                <span className="text-[11px] font-black text-emerald-400">READY</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Speed Score</span>
                <span className="text-[11px] font-black text-gold-500 font-mono">92+</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Image Alt Tags</span>
                <span className="text-[11px] font-black text-emerald-400">PASS</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-gold-600 text-navy-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-[0_10px_20px_rgba(244,196,48,0.2)]">
              Perform Detailed Scan
            </button>
          </Card>

          <Card className="p-8 rounded-[2.5rem] bg-white border-navy-50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-navy-950 italic">Structured Data</h3>
              <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center text-navy-950">
                <Code className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-medium">Advanced JSON-LD Schema to help search engines understand your NGO's data precisely.</p>
            <textarea
              value={seoData.schemaMarkup}
              onChange={(e) => updateField('schemaMarkup', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 text-[10px] font-mono transition-all min-h-[350px] leading-relaxed"
              placeholder='{ "@context": "https://schema.org", ... }'
            />
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-3 bg-navy-50 text-navy-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-navy-100 transition-colors">
                NGO Preset
              </button>
              <button className="flex-1 py-3 bg-navy-50 text-navy-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-navy-100 transition-colors">
                Article Preset
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Code({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}
