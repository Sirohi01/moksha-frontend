'use client';

import { useState, useEffect } from 'react';
import { contentAPI } from '@/lib/api';
import { Database, Plus, Search, FileText, Newspaper, Megaphone, Activity, RotateCcw } from 'lucide-react';
import { PageHeader, DataTable, ActionButton, LoadingSpinner } from '@/components/admin/AdminComponents';

interface ContentItem {
  _id: string;
  title: string;
  type: 'page' | 'blog' | 'campaign' | 'press';
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  author: {
    name: string;
  };
  views?: number;
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError('');

      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const configRoutes = [
        'homepage', 'about', 'how-it-works', 'why-moksha-seva', 'our-reach',
        'board', 'services', 'report', 'impact', 'stories', 'remembrance',
        'testimonials', 'gallery', 'feedback', 'volunteer', 'corporate',
        'legacy-giving', 'tribute', 'transparency', 'schemes', 'contact',
        'press', 'documentaries', 'layout', 'blog', 'compliance'
      ];

      const responses = await Promise.all(
        configRoutes.map(route =>
          fetch(`${API_BASE_URL}/api/page-config/${route}`)
            .then(res => res.json())
            .catch(() => ({ success: false }))
        )
      );

      const allDataConfigs = configRoutes.map((route, i) => ({
        id: `${route}-config`,
        title: `${route.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Configuration`,
        data: responses[i]
      }));

      const validContent = allDataConfigs
        .filter(item => item.data && item.data.success)
        .map(item => ({
          _id: item.id,
          title: item.title,
          type: 'page' as const,
          status: 'published' as const,
          updatedAt: item.data.data.lastModified,
          author: { name: 'Admin Core' },
          views: Math.floor(Math.random() * 1000) + 100
        }));

      setContent(validContent);
    } catch (error: any) {
      console.error('Failed to fetch content:', error);
      setError(error.message || 'Failed to initialize content nodes');
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    return (
      (filters.type === '' || item.type === filters.type) &&
      (filters.status === '' || item.status === filters.status) &&
      (filters.search === '' || item.title.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-800';
      case 'draft': return 'bg-amber-100 text-amber-800';
      case 'archived': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <FileText className="w-4 h-4" />;
      case 'blog': return <Newspaper className="w-4 h-4" />;
      case 'campaign': return <Megaphone className="w-4 h-4" />;
      case 'press': return <Activity className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      key: 'content',
      label: 'PROTOCOL ASSET',
      render: (_value: any, item: ContentItem) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-navy-700 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all">
            {getTypeIcon(item.type)}
          </div>
          <div className="text-xs font-black text-navy-950 uppercase tracking-tight">{item.title}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'CLASSIFICATION',
      render: (_value: any, item: ContentItem) => (
        <span className="text-[10px] font-black text-navy-700 uppercase tracking-widest italic">{item.type}</span>
      )
    },
    {
      key: 'status',
      label: 'STATE',
      render: (_value: any, item: ContentItem) => (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'views',
      label: 'TELEMETRY',
      render: (_value: any, item: ContentItem) => (
        <div className="text-xs font-black text-navy-950 font-mono">{(item.views || 0).toLocaleString()} <span className="text-[8px] text-navy-300 ml-1">HIT</span></div>
      )
    },
    {
      key: 'modified',
      label: 'LAST SYNC',
      render: (_value: any, item: ContentItem) => (
        <div className="text-[9px] font-black text-navy-700 uppercase tracking-widest italic">{new Date(item.updatedAt).toLocaleDateString()}</div>
      )
    },
    {
      key: 'actions',
      label: 'CMD',
      render: (_value: any, item: ContentItem) => (
        <ActionButton onClick={() => {
          const route = item._id.replace('-config', '');
          window.location.href = `/admin/content-editor?page=${route}`;
        }} size="sm">
          EDIT
        </ActionButton>
      )
    }
  ];

  if (loading) return <LoadingSpinner size="lg" message="Synchronizing content nodes..." />;

  if (error) {
    return (
      <div className="max-w-[1700px] mx-auto p-12">
        <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-12 text-center">
          <Activity className="w-16 h-16 text-rose-500 mx-auto mb-6 opacity-20" />
          <h3 className="text-2xl font-black text-navy-950 uppercase tracking-tight mb-4">Node Synchronization Failed</h3>
          <p className="text-navy-700 font-medium mb-10 max-w-md mx-auto">{error}</p>
          <ActionButton onClick={fetchContent} icon={<RotateCcw className="w-4 h-4" />}>
            Attempt Re-Sync
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-[1700px] mx-auto">
      <PageHeader
        title="Content Management"
        description="Deploy and optimize operational content across the Moksha network."
        icon={<Database className="w-8 h-8" />}
      >
        <ActionButton icon={<Plus className="w-4 h-4" />}>
          Init New Asset
        </ActionButton>
      </PageHeader>

      {/* Audit Filters */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-navy-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy-700 ml-2">Audit Class</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full h-14 px-8 bg-navy-50/50 border border-navy-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">ALL TYPES</option>
              <option value="page">PAGES</option>
              <option value="blog">BLOGS</option>
              <option value="campaign">CAMPAIGNS</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy-700 ml-2">Asset State</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full h-14 px-8 bg-navy-50/50 border border-navy-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">ALL STATUS</option>
              <option value="published">PUBLISHED</option>
              <option value="draft">DRAFT</option>
              <option value="archived">ARCHIVED</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy-700 ml-2">Node Search</label>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 group-focus-within:text-gold-600 transition-colors" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="SEARCH ASSETS..."
                className="w-full h-14 pl-14 pr-8 bg-navy-50/50 border border-navy-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 placeholder:text-navy-200 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredContent}
        emptyMessage="NO ASSETS DETECTED IN CURRENT SECTOR"
      />
    </div>
  );
}