'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import { PageHeader, DataTable, Alert, ActionButton, Modal, FormInput, LoadingSpinner } from '@/components/admin/AdminComponents';
import { Image, Plus, Bell, Eye, EyeOff, LayoutPanelTop, MoreVertical, X } from 'lucide-react';

export default function BannersPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'banner',
    title: '',
    content: '',
    imageUrl: '',
    targetUrl: '',
    isActive: true
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await marketingAPI.getContent();
      setContent(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch marketing content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await marketingAPI.toggleContentStatus(id);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleCreate = async () => {
    try {
      await marketingAPI.createContent(formData);
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create content');
    }
  };

  const columns = [
    {
      key: 'type',
      label: 'Channel',
      render: (val: string) => (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${val === 'banner' ? 'bg-navy-50 text-navy-600' :
            val === 'popup' ? 'bg-amber-50 text-amber-600' :
              'bg-rose-50 text-rose-600'
          }`}>{val}</span>
      )
    },
    { key: 'title', label: 'Campaign Title' },
    {
      key: 'page',
      label: 'Placement',
      render: (val: string, row: any) => (
        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{row.displayRules?.page || 'ALL PAGES'}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Visibility',
      render: (val: boolean, row: any) => (
        <button
          onClick={() => handleToggle(row._id)}
          className={`group flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${val ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
            }`}>
          {val ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {val ? 'Broadcast Active' : 'Offline'}
        </button>
      )
    },
    {
      key: 'createdAt',
      label: 'Launch Date',
      render: (val: string) => <span className="text-gray-400 font-medium italic">{new Date(val).toLocaleDateString()}</span>
    }
  ];

  if (loading && content.length === 0) return <LoadingSpinner message="Initializing Marketing Deck..." />;

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <PageHeader
        title="Promotional Banners"
        description="Global reach through website banners and emergency pop-up notifications."
        icon={<LayoutPanelTop className="w-7 h-7" />}
      >
        <ActionButton onClick={() => setModalOpen(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
          New Promotion
        </ActionButton>
      </PageHeader>

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3">
          <DataTable columns={columns} data={content} loading={loading} />
        </div>
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-navy-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <Bell className="w-10 h-10 text-gold-500 mb-6 group-hover:rotate-12 transition-transform" />
            <h4 className="text-lg font-black uppercase italic tracking-tighter mb-4">Live Statistics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Links</span>
                <span className="text-xl font-black text-gold-500">{content.filter((c: any) => c.isActive).length}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Impressions</span>
                <span className="text-xl font-black text-white italic tracking-tighter">--</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Configure New Promotion"
        size="lg"
      >
        <div className="space-y-8 p-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-navy-700">Content Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['banner', 'popup'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.type === t ? 'bg-navy-950 text-gold-500 border-navy-950 shadow-xl' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-100'
                      }`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <FormInput
              label="Campaign Title"
              value={formData.title}
              onChange={v => setFormData({ ...formData, title: v })}
              placeholder="e.g. Flood Relief Emergency"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy-700">Content Body (Markdown Supported)</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter promotion details..."
              className="w-full h-40 bg-gray-50 border-2 border-transparent focus:border-gold-500/20 rounded-2xl p-6 text-[11px] font-bold outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="Cover Image URL"
              value={formData.imageUrl}
              onChange={v => setFormData({ ...formData, imageUrl: v })}
              placeholder="https://cloudinary.com/..."
            />
            <FormInput
              label="Redirect Target URL"
              value={formData.targetUrl}
              onChange={v => setFormData({ ...formData, targetUrl: v })}
              placeholder="https://moksha-seva.org/donate/..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <ActionButton onClick={handleCreate} size="lg" className="flex-1">Deploy Promotion</ActionButton>
            <ActionButton onClick={() => setModalOpen(false)} variant="secondary" size="lg" className="flex-1">Cancel Deck</ActionButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
