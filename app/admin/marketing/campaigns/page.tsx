'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import { PageHeader, DataTable, Alert, ActionButton, Modal, FormInput, LoadingSpinner } from '@/components/admin/AdminComponents';
import { TrendingUp, Plus, Search, Mail, Instagram, Facebook, Globe, Link as LinkIcon, Copy } from 'lucide-react';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    utmSource: '',
    utmMedium: 'social',
    utmCampaign: '',
    redirectUrl: 'https://mokshasewa.org'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await marketingAPI.getCampaigns();
      setCampaigns(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await marketingAPI.createCampaign(formData);
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign');
    }
  };

  const generateUTM = (cam: any) => {
    const url = new URL(cam.redirectUrl);
    url.searchParams.set('utm_source', cam.utmSource);
    url.searchParams.set('utm_medium', cam.utmMedium);
    url.searchParams.set('utm_campaign', cam.utmCampaign);
    return url.toString();
  };

  const columns = [
    {
      key: 'utmSource',
      label: 'Channel',
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-navy-50 text-navy-950`}>
            {val === 'facebook' ? <Facebook className="w-3.5 h-3.5" /> :
              val === 'instagram' ? <Instagram className="w-3.5 h-3.5" /> :
                val === 'email' ? <Mail className="w-3.5 h-3.5" /> :
                  <Globe className="w-3.5 h-3.5" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{val}</span>
        </div>
      )
    },
    { key: 'name', label: 'Campaign Title' },
    {
      key: 'utmCampaign',
      label: 'ID (UTM)',
      render: (val: string) => <code className="bg-navy-50 px-3 py-1 rounded-lg text-navy-600 text-[10px] font-black">{val}</code>
    },
    {
      key: 'totalClicks',
      label: 'Traffic Score',
      render: (val: number) => (
        <div className="flex flex-col gap-1">
          <span className="text-xl font-black text-navy-950 italic tracking-tighter leading-none">{val || 0}</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Node Hits</span>
        </div>
      )
    },
    {
      key: 'action',
      label: 'Operational Controls',
      render: (val: any, row: any) => (
        <button
          onClick={() => {
            navigator.clipboard.writeText(generateUTM(row));
            alert('Target sequence copied to clipboard.');
          }}
          className="flex items-center gap-3 px-6 py-2.5 bg-navy-950 text-gold-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 hover:text-navy-950 transition-all active:scale-95 shadow-lg group">
          <Copy className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Copy UTM Sequence
        </button>
      )
    }
  ];

  if (loading && campaigns.length === 0) return <LoadingSpinner message="Initializing Propaganda Intelligence..." />;

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <PageHeader
        title="Propagation Management"
        description="High-fidelity link tracking and UTM generation for multi-platform outreach."
        icon={<TrendingUp className="w-7 h-7" />}
      >
        <ActionButton onClick={() => setModalOpen(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
          New Campaign
        </ActionButton>
      </PageHeader>

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 gap-12">
        <DataTable columns={columns} data={campaigns} loading={loading} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Initialize New Intelligence Chain"
        size="lg"
      >
        <div className="space-y-8 p-4">
          <FormInput
            label="Campaign Designation"
            value={formData.name}
            onChange={v => setFormData({ ...formData, name: v })}
            placeholder="e.g. Summer Donation Drive 2026"
          />

          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="UTM Source (Origin)"
              value={formData.utmSource}
              onChange={v => setFormData({ ...formData, utmSource: v.toLowerCase() })}
              placeholder="facebook, google, newsletter"
            />
            <FormInput
              label="UTM Medium (Channel)"
              value={formData.utmMedium}
              onChange={v => setFormData({ ...formData, utmMedium: v.toLowerCase() })}
              placeholder="social, cpc, email"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="UTM Campaign ID"
              value={formData.utmCampaign}
              onChange={v => setFormData({ ...formData, utmCampaign: v.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="donation_main_link"
            />
            <FormInput
              label="Redirect Target (Node)"
              value={formData.redirectUrl}
              onChange={v => setFormData({ ...formData, redirectUrl: v })}
              placeholder="https://mokshasewa.org..."
            />
          </div>

          <div className="bg-navy-50 p-6 rounded-3xl border border-navy-100">
            <div className="flex items-center gap-3 mb-4">
              <LinkIcon className="w-4 h-4 text-gold-600" />
              <p className="text-[10px] font-black text-navy-700 uppercase tracking-widest italic">Generated Uplink Sequence Preview</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-navy-100 text-[10px] sm:text-xs font-mono text-navy-950 break-all select-all shadow-sm">
              {formData.redirectUrl}?utm_source={formData.utmSource || 'source'}&utm_medium={formData.utmMedium || 'medium'}&utm_campaign={formData.utmCampaign || 'campaign'}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <ActionButton onClick={handleCreate} size="lg" className="flex-1">Deploy Campaign</ActionButton>
            <ActionButton onClick={() => setModalOpen(false)} variant="secondary" size="lg" className="flex-1">Abort Link</ActionButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
