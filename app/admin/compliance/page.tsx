'use client';

import { useState, useEffect } from 'react';
import { 
    ShieldCheck, Trash2, FileText, Plus, Download, Search, 
    Edit3, X, Loader2, Scale, BarChart3, Settings, 
    Layout, CheckCircle2, Award, Save, Globe, Type,
    ArrowLeft, Upload
} from 'lucide-react';
import { Container } from '@/components/ui/Elements';
import { cn } from '@/lib/utils';
import { PageHeader, StatsCard, ActionButton } from '@/components/admin/AdminComponents';
import NextImage from 'next/image';

interface Document {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  validityDate: string;
  documentType: 'certificate' | 'report' | 'legal' | 'other';
  status: 'active' | 'expired' | 'archived';
  order: number;
}

interface ComplianceConfig {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
  };
  taxExemption: {
    title: string;
    titleHighlight: string;
    description: string;
    registrations: { label: string; value: string }[];
    points: string[];
  };
}

interface Lead {
  _id: string;
  documentTitle: string;
  name: string;
  email: string;
  phone: string;
  pincode: string;
  accessedAt: string;
}

export default function ComplianceAdminPage() {
  // State management
  const [view, setView] = useState<'documents' | 'editorial' | 'leads'>('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [config, setConfig] = useState<ComplianceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [docFormData, setDocFormData] = useState<{
        _id?: string;
        title: string;
        description: string;
        fileUrl: string;
        fileSize: string;
        validityDate: string;
        documentType: 'certificate' | 'report' | 'legal' | 'other';
        order: number;
        status: 'active' | 'expired' | 'archived';
    }>({
    title: '',
    description: '',
    fileUrl: '',
    fileSize: '',
    validityDate: '',
    documentType: 'certificate',
    order: 0,
    status: 'active'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const [docsRes, configRes, leadsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/documents`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/page-config/compliance`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/leads`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const docsData = await docsRes.json();
      const configData = await configRes.json();
      const leadsData = await leadsRes.json();

      if (docsData.success) setDocuments(docsData.data);
      if (configData.success) setConfig(configData.data.config);
      if (leadsData.success) setLeads(leadsData.data);
    } catch (error) {
      console.error('Failed to fetch protocol data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- DOCUMENT LOGIC ---
  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = editingDoc ? 'PUT' : 'POST';
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/documents${editingDoc ? `/${editingDoc._id}` : ''}`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(docFormData)
      });

      if (response.ok) {
        fetchInitialData();
        setShowForm(false);
      }
    } catch (error) { console.error('Doc sync failed:', error); }
  };

  const handleDocDelete = async (id: string) => {
    if (!confirm('Authorize permanent removal of this archival node?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setDocuments(documents.filter(d => d._id !== id));
    } catch (error) { console.error('Deactivation failed:', error); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict PDF enforcement
    if (!file.type.includes('pdf')) {
        alert('MISSION PROTOCOL: Only Archival PDF nodes are permitted for compliance verification.');
        return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('title', docFormData.title || `Compliance_${Date.now()}`);
    uploadData.append('category', 'compliance');
    uploadData.append('type', 'document');
    uploadData.append('altText', `Moksha Seva Compliance Document: ${docFormData.title || 'Untitled'}`);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });

      const data = await response.json();
      if (data.success) {
        setDocFormData(prev => ({
          ...prev,
          fileUrl: data.data.url,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        }));
      }
    } catch (error) { console.error('Uplink failed:', error); }
    finally { setIsUploading(false); }
  };

  // --- CONFIG/EDITORIAL LOGIC ---
  const saveEditorialConfig = async () => {
    if (!config) return;
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/page-config/compliance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ config })
      });
      if (response.ok) alert('Mission Manifest Synchronized Successfully');
    } catch (error) { console.error('Config sync failed:', error); }
    finally { setSaving(false); }
  };

  // Helper functions for dynamic arrays
  const addTaxReg = () => {
    if (!config) return;
    const newConfig = { ...config };
    newConfig.taxExemption.registrations.push({ label: '', value: '' });
    setConfig(newConfig);
  };

  const removeTaxReg = (idx: number) => {
    if (!config) return;
    const newRegs = config.taxExemption.registrations.filter((_, i) => i !== idx);
    setConfig({ ...config, taxExemption: { ...config.taxExemption, registrations: newRegs } });
  };

  const addTaxPoint = () => {
    if (!config) return;
    const newConfig = { ...config };
    newConfig.taxExemption.points.push('');
    setConfig(newConfig);
  };

  const removeTaxPoint = (idx: number) => {
    if (!config) return;
    const newPoints = config.taxExemption.points.filter((_, i) => i !== idx);
    setConfig({ ...config, taxExemption: { ...config.taxExemption, points: newPoints } });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-20 gap-6">
      <Loader2 className="w-16 h-16 text-zinc-950 animate-spin" />
      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-300">Syncing Compliance Matrix...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {!showForm ? (
        <Container className="space-y-16 max-w-[1700px] mx-auto py-12">
          {/* 💎 Header & Toggle Area */}
          <div className="flex flex-col md:flex-row items-end justify-between gap-10">
            <PageHeader
              title="Compliance Vault"
              description="Orchestrate mission legitimacy through archival node management and editorial manifestos."
              icon={<ShieldCheck className="w-10 h-10" />}
            />

            <div className="flex flex-wrap items-center w-full md:w-auto bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <button
                onClick={() => setView('documents')}
                className={cn(
                  "flex-1 md:flex-none px-4 md:px-8 py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all text-nowrap",
                  view === 'documents' ? "bg-zinc-950 text-white shadow-xl" : "text-stone-400 hover:text-stone-600"
                )}
              >
                Archive
              </button>
              <button
                onClick={() => setView('leads')}
                className={cn(
                  "flex-1 md:flex-none px-4 md:px-8 py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all text-nowrap",
                  view === 'leads' ? "bg-zinc-950 text-white shadow-xl" : "text-stone-400 hover:text-stone-600"
                )}
              >
                Leads
              </button>
              <button
                onClick={() => setView('editorial')}
                className={cn(
                  "flex-1 md:flex-none px-4 md:px-8 py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all text-nowrap",
                  view === 'editorial' ? "bg-zinc-950 text-white shadow-xl" : "text-stone-400 hover:text-stone-600"
                )}
              >
                Editorial
              </button>
            </div>
          </div>

          {view === 'documents' ? (
            <>
              {/* 📈 Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StatsCard title="Total Archive" value={documents.length} icon={<FileText size={20} />} gradient="bg-white" />
                <StatsCard title="Legal Certificates" value={documents.filter(d => d.documentType === 'certificate').length} icon={<ShieldCheck size={20} />} gradient="bg-white" />
                <StatsCard title="Tax Declarations" value={documents.filter(d => d.title.toLowerCase().includes('tax')).length} icon={<Scale size={20} />} gradient="bg-white" />
                <ActionButton
                  onClick={() => {
                    setEditingDoc(null);
                    setDocFormData({ title: '', description: '', fileUrl: '', fileSize: '', validityDate: '', documentType: 'certificate', order: documents.length + 1, status: 'active' });
                    setShowForm(true);
                  }}
                  className="bg-zinc-950 text-white rounded-3xl h-full flex items-center justify-center gap-4 hover:bg-stone-800 transition-all shadow-2xl"
                >
                  <Plus /> Secure New Node
                </ActionButton>
              </div>

              {/* 📂 Registry Table */}
              <div className="bg-white rounded-[4rem] border border-stone-100 shadow-[0_60px_150px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-10 border-b border-stone-50 flex items-center justify-between gap-8 bg-stone-50/20">
                  <div className="relative flex-1 max-w-xl group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-zinc-950 transition-colors" />
                    <input
                      placeholder="Search Protocol ID or Title..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full h-16 pl-16 pr-8 bg-white border border-stone-200 rounded-3xl outline-none text-[12px] font-bold text-zinc-950 focus:border-zinc-950 transition-all font-sans"
                    />
                  </div>
                  <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-stone-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Archive Integrity Verified</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="bg-[#fcfcfc] border-b border-stone-100 text-stone-400 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-10 py-8 text-left">Archival Title</th>
                        <th className="px-10 py-8 text-left">Classifier</th>
                        <th className="px-10 py-8 text-left">Validity</th>
                        <th className="px-10 py-8 text-right pr-20">Direct Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {documents.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase())).map((doc) => (
                        <tr key={doc._id} className="group hover:bg-stone-50/50 transition-all">
                          <td className="px-10 py-10">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-inner">
                                <FileText size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-zinc-950 uppercase italic tracking-tight">{doc.title}</p>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1 opacity-60">Status: {doc.status}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-10">
                            <span className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-stone-600 italic">{doc.documentType}</span>
                          </td>
                          <td className="px-10 py-10 text-[11px] font-black text-zinc-950 italic opacity-80">{doc.validityDate}</td>
                          <td className="px-10 py-10 text-right pr-20">
                            <div className="flex items-center justify-end gap-3 translate-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                              <button
                                onClick={() => {
                                  setEditingDoc(doc);
                                  setDocFormData({ ...doc });
                                  setShowForm(true);
                                }}
                                className="w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all shadow-sm"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDocDelete(doc._id)} className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : view === 'leads' ? (
            /* 👥 ACCESS LEADS VIEW */
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatsCard title="Total Access Requests" value={leads.length} icon={<Search size={20} />} gradient="bg-white" />
                  <StatsCard title="Unique Stakeholders" value={new Set(leads.map(l => l.email)).size} icon={<Globe size={20} />} gradient="bg-white" />
                  <StatsCard title="Most Requested Node" value={leads.length > 0 ? Array.from(leads.reduce((acc, l) => acc.set(l.documentTitle, (acc.get(l.documentTitle) || 0) + 1), new Map()).entries()).sort((a,b) => b[1] - a[1])[0][0] : 'None'} icon={<CheckCircle2 size={20} />} gradient="bg-white" />
               </div>

               <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-100 shadow-[0_60px_150px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] md:min-w-[1000px]">
                    <thead className="bg-[#fcfcfc] border-b border-stone-100 text-stone-400 text-[9px] md:text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-6 md:px-10 py-6 md:py-8 text-left">Stakeholder</th>
                        <th className="px-6 md:px-10 py-6 md:py-8 text-left">Target</th>
                        <th className="px-6 md:px-10 py-6 md:py-8 text-left">Metadata</th>
                        <th className="px-6 md:px-10 py-6 md:py-8 text-right pr-10 md:pr-20">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {leads.map((lead) => (
                        <tr key={lead._id} className="group hover:bg-stone-50/50 transition-all">
                          <td className="px-6 md:px-10 py-6 md:py-10">
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                                <CheckCircle2 size={16} />
                              </div>
                              <div>
                                <p className="text-[12px] md:text-sm font-black text-zinc-950 uppercase tracking-tight">{lead.name}</p>
                                <p className="text-[8px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1 opacity-60">ID: {lead._id.slice(-8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-10 py-6 md:py-10">
                            <span className="text-[10px] md:text-[11px] font-black text-zinc-950 uppercase italic tracking-tight">{lead.documentTitle}</span>
                          </td>
                          <td className="px-6 md:px-10 py-6 md:py-10">
                             <div className="space-y-1">
                                <p className="text-[9px] md:text-[10px] font-black text-stone-500 flex items-center gap-2">
                                   <Globe size={10} className="text-[#7ab800]" /> {lead.email}
                                </p>
                                <p className="text-[9px] md:text-[10px] font-black text-stone-500 flex items-center gap-2">
                                   <Type size={10} className="text-[#7ab800]" /> {lead.phone}
                                </p>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-6 md:py-10 text-right pr-10 md:pr-20">
                             <p className="text-[10px] md:text-[11px] font-black text-zinc-950 opacity-60 italic">
                                {new Date(lead.accessedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                             </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
               </div>
            </div>
          ) : (
            /* 📖 EDITORIAL MANIFESTO VIEW */
            <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
              {/* HERO EDIT SECTION */}
              <div className="bg-white rounded-[4rem] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-stone-100 space-y-12">
                <div className="flex items-center justify-between border-b border-stone-50 pb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-stone-950 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl">
                      <Layout size={24} />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">Protocol 01</h3>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-950">Hero Core Context</h2>
                    </div>
                  </div>
                  <button onClick={saveEditorialConfig} disabled={saving} className="px-10 py-5 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl disabled:opacity-50">
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Changes
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-4">Badge Title</label>
                    <input
                      value={config?.hero.badge || ''}
                      onChange={e => setConfig({ ...config!, hero: { ...config!.hero, badge: e.target.value } })}
                      className="w-full h-16 px-10 bg-stone-50 border border-stone-100 rounded-2xl outline-none font-bold text-zinc-950 transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-4">Headline Fragment (Highlight)</label>
                    <input
                      value={config?.hero.titleHighlight || ''}
                      onChange={e => setConfig({ ...config!, hero: { ...config!.hero, titleHighlight: e.target.value } })}
                      className="w-full h-16 px-10 bg-stone-50 border border-stone-100 rounded-2xl outline-none font-black text-rose-500 transition-all font-sans uppercase tracking-widest"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-4">Description Manifesto</label>
                    <textarea
                      value={config?.hero.description || ''}
                      onChange={e => setConfig({ ...config!, hero: { ...config!.hero, description: e.target.value } })}
                      className="w-full min-h-[150px] p-10 bg-stone-50 border border-stone-100 rounded-[2.5rem] outline-none font-medium text-stone-700 leading-relaxed transition-all font-sans text-xl"
                    />
                  </div>
                </div>
              </div>

              {/* TAX EXEMPTION SECTION */}
              <div className="bg-white rounded-[4rem] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-stone-100 space-y-12">
                <div className="flex items-center justify-between border-b border-stone-50 pb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-rose-500 text-white rounded-[1.8rem] flex items-center justify-center shadow-xl">
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">Protocol 02</h3>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-950">Fiscal Proxy Management</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-16">
                  {/* Registrations List */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-950">Static Registration Identifiers</h4>
                      <button onClick={addTaxReg} className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-70">
                        <Plus size={14} /> Add Identifier
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {config?.taxExemption.registrations.map((reg, i) => (
                        <div key={i} className="flex gap-4 p-6 bg-stone-50 border border-stone-100 rounded-3xl relative group">
                          <input
                            placeholder="Label (e.g. CSR)"
                            value={reg.label}
                            onChange={e => {
                              const newRegs = [...config!.taxExemption.registrations];
                              newRegs[i].label = e.target.value;
                              setConfig({ ...config!, taxExemption: { ...config!.taxExemption, registrations: newRegs } });
                            }}
                            className="flex-1 bg-white px-6 py-3 rounded-xl border border-stone-100 outline-none text-[10px] font-black uppercase tracking-widest"
                          />
                          <input
                            placeholder="Value (e.g. ID-99)"
                            value={reg.value}
                            onChange={e => {
                              const newRegs = [...config!.taxExemption.registrations];
                              newRegs[i].value = e.target.value;
                              setConfig({ ...config!, taxExemption: { ...config!.taxExemption, registrations: newRegs } });
                            }}
                            className="flex-1 bg-white px-6 py-3 rounded-xl border border-stone-100 outline-none font-bold text-sm"
                          />
                          <button onClick={() => removeTaxReg(i)} className="p-2 text-stone-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Points Table */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-950">Accountability Bulletins</h4>
                      <button onClick={addTaxPoint} className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-70">
                        <Plus size={14} /> Add Pattern Bulletin
                      </button>
                    </div>
                    <div className="space-y-4">
                      {config?.taxExemption.points.map((point, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-stone-50 border border-stone-100 rounded-[2rem] relative group">
                          <span className="text-xl font-black text-rose-500 opacity-20">0{i + 1}</span>
                          <input
                            value={point}
                            onChange={e => {
                              const newPoints = [...config!.taxExemption.points];
                              newPoints[i] = e.target.value;
                              setConfig({ ...config!, taxExemption: { ...config!.taxExemption, points: newPoints } });
                            }}
                            className="flex-1 bg-transparent border-none outline-none font-bold text-lg text-stone-700"
                            placeholder="Deploy accountability narrative here..."
                          />
                          <button onClick={() => removeTaxPoint(i)} className="p-2 text-stone-300 hover:text-rose-500 opacity-0 group-hover:opacity-100">
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      ) : (
        /* ⚙️ DOCUMENT CONFIGURATION FORGE - ENHANCED LIGHT THEME */
        <div className="min-h-screen bg-[#F8F9FA] overflow-y-auto animate-in fade-in duration-500 pb-40">
          <Container className="max-w-7xl py-24">
            <div className="flex items-center justify-between mb-20 bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-sm">
              <div className="flex items-center gap-10">
                <button 
                  onClick={() => setShowForm(false)} 
                  className="w-16 h-16 bg-zinc-950 text-white rounded-[1.8rem] flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-2xl"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]"></div>
                      <p className="text-[11px] font-black text-gold-600 uppercase tracking-[0.5em] italic">Authorized Archival Protocol</p>
                    </div>
                    <h2 className="text-5xl font-black text-zinc-950 uppercase tracking-tighter italic leading-none">
                        {editingDoc ? 'Synchronize Record' : 'Inject New Establishment'}
                    </h2>
                </div>
              </div>
            </div>

            <form onSubmit={handleDocSubmit} className="space-y-16">
              <div className="bg-white border border-stone-100 p-20 rounded-[5rem] shadow-[0_80px_200px_rgba(0,0,0,0.06)] space-y-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 relative z-10">
                    {/* Identity Slot */}
                    <div className="md:col-span-8 space-y-6">
                        <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 ml-8 flex items-center gap-3">
                            <Type className="w-4 h-4" /> Strategic Protocol Identity
                        </label>
                        <input 
                            required
                            value={docFormData.title}
                            onChange={e => setDocFormData({ ...docFormData, title: e.target.value })}
                            className="w-full h-24 px-12 bg-stone-50 border-2 border-stone-100 focus:border-zinc-950 rounded-[2.5rem] outline-none font-black text-zinc-950 transition-all uppercase tracking-widest text-xl shadow-inner"
                            placeholder="E.G. 80G EXEMPTION 2024..."
                        />
                    </div>

                    <div className="md:col-span-4 space-y-6">
                        <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 ml-8 flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4" /> Classification Hub
                        </label>
                        <select 
                            value={docFormData.documentType}
                            onChange={e => setDocFormData({ ...docFormData, documentType: e.target.value as any })}
                            className="w-full h-24 px-12 bg-stone-50 border-2 border-stone-100 focus:border-zinc-950 rounded-[2.5rem] outline-none font-black text-zinc-950 transition-all uppercase tracking-widest text-[11px] appearance-none cursor-pointer"
                        >
                            <option value="certificate">CERTIFICATE</option>
                            <option value="report">ANNUAL REPORT</option>
                            <option value="legal">LEGAL PROXY</option>
                            <option value="other">MISCELLANEOUS</option>
                        </select>
                    </div>

                    <div className="md:col-span-12 space-y-6">
                        <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 ml-8 flex items-center gap-3">
                            <FileText className="w-4 h-4" /> Operational Summary (Description)
                        </label>
                        <textarea 
                            value={docFormData.description}
                            onChange={e => setDocFormData({ ...docFormData, description: e.target.value })}
                            className="w-full min-h-[150px] p-12 bg-stone-50 border-2 border-stone-100 focus:border-zinc-950 rounded-[3rem] outline-none font-bold text-zinc-950 transition-all text-xl"
                            placeholder="Provide mission-critical context for this node..."
                        />
                    </div>

                    <div className="md:col-span-12 space-y-8 bg-stone-50 p-12 rounded-[4rem] border border-stone-100 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 ml-8">Direct Asset Manifestation</label>
                            {isUploading && (
                                <div className="flex items-center gap-3 px-6 py-2.5 bg-zinc-950 text-gold-500 rounded-full animate-pulse border border-gold-500/20">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Injecting Packet...</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-6">Secure Asset URL</p>
                                <input 
                                    value={docFormData.fileUrl}
                                    readOnly
                                    className="w-full h-16 bg-white border-2 border-stone-200 rounded-[2rem] outline-none px-10 text-stone-400 text-[10px] font-bold italic truncate"
                                />
                            </div>
                            <div className="relative group/upload h-24">
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" accept=".pdf" onChange={handleFileUpload} />
                              <div className="absolute inset-0 bg-white border-2 border-dashed border-stone-200 rounded-[2.5rem] flex items-center justify-center gap-6 group-hover/upload:border-zinc-950 group-hover/upload:bg-stone-50 transition-all">
                                  <Upload className="w-8 h-8 text-stone-300 group-hover/upload:text-zinc-950" />
                                  <div className="text-left">
                                      <p className="text-[11px] font-black text-zinc-950 uppercase tracking-widest leading-none mb-1">Inject Archival Manifest</p>
                                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic">
                                          {docFormData.fileUrl ? `DETECTED: ${docFormData.fileSize}` : 'SECURE PDF FORMAT ONLY'}
                                      </p>
                                  </div>
                              </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="md:col-span-12 space-y-6">
                        <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 ml-8">Validity Spectrum (E.G. 2024 - PERPETUAL)</label>
                        <input 
                            value={docFormData.validityDate}
                            onChange={e => setDocFormData({ ...docFormData, validityDate: e.target.value })}
                            className="w-full h-24 px-12 bg-stone-50 border-2 border-stone-100 focus:border-zinc-950 rounded-[2.5rem] outline-none text-zinc-950 font-black text-xl uppercase tracking-widest"
                            placeholder="E.G. 2024 - PERPETUAL"
                        />
                    </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-10 bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-sm">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest italic max-w-sm">
                    Warning: Archival synchronization is an atomic operation. Authenticate all fields before authorization.
                </p>
                <div className="flex items-center gap-8">
                    <button type="button" onClick={() => setShowForm(false)} className="text-[11px] font-black uppercase tracking-widest text-stone-400 hover:text-rose-500 transition-colors">Abort Protocol</button>
                    <button type="submit" className="px-20 py-8 bg-zinc-950 text-gold-500 rounded-3xl font-black uppercase tracking-[0.4em] text-[12px] hover:bg-black shadow-2xl transition-all hover:translate-y-[-4px] active:translate-y-0">
                        Authorize Synchronization
                    </button>
                </div>
              </div>
            </form>
          </Container>
        </div>
      )}
    </div>
  );
}
