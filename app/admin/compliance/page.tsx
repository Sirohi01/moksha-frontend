'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Trash2, FileText, Plus, Download, Search, Edit3, X, Loader2, Scale, BarChart3 } from 'lucide-react';

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

import { PageHeader, StatsCard, ActionButton } from '@/components/admin/AdminComponents';

export default function ComplianceAdminPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileSize: '',
    validityDate: '',
    documentType: 'certificate',
    order: 0,
    status: 'active'
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('title', `Compliance_${Date.now()}`);
    formDataUpload.append('category', 'compliance');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          fileUrl: data.data.url,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/documents`);
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = editingDoc ? 'PUT' : 'POST';
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/documents${editingDoc ? `/${editingDoc._id}` : ''}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchDocuments();
        closeForm();
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setDocuments(documents.filter(d => d._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const openForm = (doc?: Document) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title,
        description: doc.description || '',
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        validityDate: doc.validityDate,
        documentType: doc.documentType,
        order: doc.order,
        status: doc.status
      });
    } else {
      setEditingDoc(null);
      setFormData({
        title: '',
        description: '',
        fileUrl: '',
        fileSize: '',
        validityDate: '',
        documentType: 'certificate',
        order: documents.length + 1,
        status: 'active'
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDoc(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'certificate': return ShieldCheck;
      case 'report': return BarChart3;
      case 'legal': return Scale;
      default: return FileText;
    }
  };

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-[1800px] mx-auto pb-32">
      {!showForm ? (
        <div className="space-y-12">
          <PageHeader
            title="Institutional Compliance"
            description="Access and manage the global repository of legal certificates and regulatory manifestos."
            icon={<ShieldCheck className="w-10 h-10 text-gold-600" />}
          >
            <ActionButton
              onClick={() => openForm()}
              icon={<Plus className="w-5 h-5" />}
              className="px-10 py-5 bg-zinc-950 text-gold-500 rounded-2xl shadow-2xl hover:bg-black transition-all"
            >
              Secure New Document
            </ActionButton>
          </PageHeader>

          {/* Grid Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StatsCard
              title="Global Archive"
              value={documents.length}
              icon={<FileText className="text-stone-600" />}
              gradient="bg-white border border-stone-100 shadow-xl"
            />
            <StatsCard
              title="Verified Protocol"
              value={documents.filter(d => d.documentType === 'certificate').length}
              icon={<ShieldCheck className="text-stone-600" />}
              gradient="bg-white border border-stone-100 shadow-xl"
              change="Verified"
              changeType="positive"
            />
            <StatsCard
              title="Registry Integrity"
              value="SECURE"
              icon={<Scale className="text-stone-600" />}
              gradient="bg-white border border-stone-100 shadow-xl"
            />
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.08)] border border-stone-100 overflow-hidden">
            <div className="p-10 border-b border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-stone-50/30">
              <div className="relative w-full md:w-[500px] group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-gold-600 transition-colors" />
                <input
                  type="text"
                  placeholder="SEARCH COMPLIANCE REGISTRY..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-16 pr-8 bg-white rounded-3xl border border-stone-200 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-8 focus:ring-gold-500/5 focus:border-gold-500 transition-all shadow-inner"
                />
              </div>
              <div className="flex items-center gap-4 px-6 py-3 bg-stone-100 rounded-full border border-stone-200">
                <div className="w-2 h-2 rounded-full bg-gold-600 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-700">Live Database Connection Active</span>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-zinc-950">
                    <th className="px-10 py-8 text-left text-[11px] font-black text-gold-500 uppercase tracking-[0.3em]">MISSION DOCUMENT</th>
                    <th className="px-10 py-8 text-left text-[11px] font-black text-gold-500 uppercase tracking-[0.3em]">CLASSIFICATION</th>
                    <th className="px-10 py-8 text-left text-[11px] font-black text-gold-500 uppercase tracking-[0.3em]">VALIDITY PERIOD</th>
                    <th className="px-10 py-8 text-left text-[11px] font-black text-gold-500 uppercase tracking-[0.3em]">PAYLOAD</th>
                    <th className="px-10 py-8 text-right text-[11px] font-black text-gold-500 uppercase tracking-[0.3em] pr-16">MASTER CONTROLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-10 py-8"><div className="h-5 bg-stone-50 rounded-full w-64"></div></td>
                        <td className="px-10 py-8"><div className="h-8 bg-stone-50 rounded-full w-24"></div></td>
                        <td className="px-10 py-8"><div className="h-5 bg-stone-50 rounded-full w-32"></div></td>
                        <td className="px-10 py-8"><div className="h-5 bg-stone-50 rounded-full w-16"></div></td>
                        <td className="px-10 py-8 text-right"><div className="h-10 bg-stone-50 rounded-2xl w-24 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : filteredDocs.map((doc) => {
                    const Icon = getIcon(doc.documentType);
                    return (
                      <tr key={doc._id} className="hover:bg-stone-50/50 transition-all group">
                        <td className="px-10 py-10">
                          <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-stone-50 flex items-center justify-center text-stone-500 group-hover:bg-zinc-950 group-hover:text-gold-500 transition-all shadow-inner border border-stone-100">
                              <Icon size={24} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-zinc-950 uppercase tracking-tight leading-none mb-2">{doc.title}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] text-stone-600 font-bold uppercase tracking-[0.2em] italic">Sequence Order: {doc.order.toString().padStart(2, '0')}</span>
                                <div className="w-1 h-1 rounded-full bg-stone-200"></div>
                                <span className="text-[9px] text-gold-600 font-black uppercase tracking-widest">{doc.status}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-10">
                          <span className="px-6 py-2.5 rounded-2xl bg-zinc-50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-800 border border-stone-200 group-hover:bg-zinc-950 group-hover:text-gold-500 group-hover:border-transparent transition-all shadow-sm">
                            {doc.documentType}
                          </span>
                        </td>
                        <td className="px-10 py-10">
                            <p className="text-[11px] font-black text-zinc-950 uppercase italic tracking-tighter">{doc.validityDate || 'N/A'}</p>
                        </td>
                        <td className="px-10 py-10">
                            <p className="text-[10px] font-black text-stone-700 uppercase tracking-widest">{doc.fileSize || 'FILE UNKNOWN'}</p>
                        </td>
                        <td className="px-10 py-10 text-right pr-16">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => openForm(doc)}
                              className="w-12 h-12 flex items-center justify-center bg-stone-50 text-stone-700 hover:bg-zinc-950 hover:text-gold-500 rounded-2xl transition-all shadow-sm active:scale-90 border border-stone-100"
                              title="Update Records"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(doc._id)}
                              className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-300 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm active:scale-90 border border-rose-100/50"
                              title="Delete Permanent"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ENHANCED FULL PAGE EDITING VIEW */
        <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-right-20 duration-1000">
          <div className="flex items-center justify-between bg-white p-10 rounded-[4rem] border border-stone-100 shadow-[0_40px_100px_rgba(0,0,0,0.06)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-stone-50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="flex items-center gap-10 relative z-10">
              <button 
                onClick={closeForm}
                className="w-16 h-16 bg-zinc-950 text-white rounded-[1.8rem] flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-2xl group/back overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gold-600 translate-y-full group-hover/back:translate-y-0 transition-transform"></div>
                <X className="w-8 h-8 relative z-10 group-hover/back:rotate-90 transition-transform duration-500" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-600 shadow-[0_0_15px_rgba(217,119,6,0.5)]"></div>
                    <p className="text-[11px] font-black text-gold-600 uppercase tracking-[0.5em] italic">Authorized Entry Matrix</p>
                </div>
                <h2 className="text-5xl font-black text-zinc-950 uppercase tracking-tighter italic leading-none drop-shadow-sm">
                  {editingDoc ? (
                    <>Sync <span className="text-stone-700">Credentials</span></>
                  ) : (
                    <>Secure <span className="text-stone-700">Establishment</span></>
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.1)] border border-stone-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-50 blur-[120px] rounded-full -mr-64 -mt-64 transition-all duration-1000 group-hover:bg-gold-500/5"></div>
            <form onSubmit={handleSubmit} className="p-20 space-y-16 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                
                {/* Title & Category Focus row */}
                <div className="md:col-span-8 space-y-6">
                  <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8 flex items-center gap-3">
                    <FileText className="w-4 h-4" /> Strategic Protocol Identity
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.G. TAX EXEMPTION RULING 2024..."
                    className="w-full h-24 px-12 bg-white border-2 border-stone-100 focus:border-zinc-950 rounded-[2.5rem] outline-none font-black text-zinc-950 transition-all uppercase tracking-widest text-lg shadow-xl shadow-stone-100/50"
                  />
                </div>

                <div className="md:col-span-4 space-y-6">
                  <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8 flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" /> Classification
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={e => setFormData({ ...formData, documentType: e.target.value as any })}
                    className="w-full h-20 px-10 bg-stone-50 border-2 border-transparent focus:border-zinc-950 rounded-[2rem] outline-none font-black text-zinc-950 transition-all uppercase tracking-widest text-[11px] appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="certificate">Legal Certificate</option>
                    <option value="report">Operational Report</option>
                    <option value="legal">Constitutional Proxy</option>
                    <option value="other">Fragmentary Item</option>
                  </select>
                </div>

                <div className="md:col-span-12 space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8 flex items-center gap-3">
                        <FileText className="w-4 h-4" /> Operational Summary (Description)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="PROVIDE SECURE CONTEXT FOR THIS DOCUMENT..."
                        className="w-full min-h-[150px] p-10 bg-stone-50/50 border-2 border-stone-100 focus:border-zinc-950 rounded-[2.5rem] outline-none font-black text-zinc-950 transition-all uppercase tracking-widest text-[11px] resize-none"
                    />
                </div>

                <div className="md:col-span-12 space-y-8 bg-stone-50/50 p-12 rounded-[3.5rem] border border-stone-100 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8">Direct Asset Manifestation</label>
                        {isUploading && (
                             <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-gold-500 rounded-full animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Uploading Asset...</span>
                             </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest ml-4">Secure Uplink URL</p>
                            <input
                                required
                                value={formData.fileUrl}
                                onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                                placeholder="HTTPS://ASSETS.MOKSHASEVA.ORG/..."
                                className="w-full h-16 px-10 bg-white border-2 border-stone-200 focus:border-zinc-950 rounded-2xl outline-none font-black text-stone-700 transition-all text-[10px] tracking-widest italic truncate"
                            />
                        </div>

                        <div className="relative group/upload h-24">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />
                            <div className="absolute inset-0 bg-white border-2 border-dashed border-stone-200 rounded-[2rem] flex items-center justify-center gap-4 group-hover/upload:border-zinc-950 group-hover/upload:bg-stone-50 transition-all">
                                <Plus className="w-6 h-6 text-stone-400 group-hover/upload:text-zinc-950" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-zinc-950 uppercase tracking-widest leading-none mb-1 text-center">Authorization Upload</p>
                                    <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest text-center">Click or Drag strategic asset</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Meta Row */}
                <div className="md:col-span-4 space-y-6">
                  <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8">Validity Spectrum</label>
                  <input
                    value={formData.validityDate}
                    onChange={e => setFormData({ ...formData, validityDate: e.target.value })}
                    placeholder="2024 - PERPETUAL"
                    className="w-full h-20 px-10 bg-stone-50 border-2 border-stone-100/50 focus:border-zinc-950 rounded-2xl outline-none font-black text-zinc-950 transition-all uppercase tracking-widest text-xs shadow-sm"
                  />
                </div>

                <div className="md:col-span-4 space-y-6">
                  <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8">Payload Size</label>
                  <input
                    value={formData.fileSize}
                    onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="E.G. 15.2 MB"
                    className="w-full h-20 px-10 bg-stone-50 border-2 border-stone-100/50 focus:border-zinc-950 rounded-2xl outline-none font-black text-zinc-950 transition-all uppercase tracking-widest text-xs shadow-sm"
                  />
                </div>

                <div className="md:col-span-4 space-y-6">
                  <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8">Matrix Sequence</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full h-20 px-10 bg-stone-50 border-2 border-stone-100/50 focus:border-zinc-950 rounded-2xl outline-none font-black text-zinc-950 transition-all text-xs shadow-sm"
                  />
                </div>

                <div className="md:col-span-12 space-y-6">
                  <label className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-700 ml-8">Deployment Status Protocol</label>
                  <div className="grid grid-cols-3 gap-8">
                    {(['active', 'expired', 'archived'] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setFormData({ ...formData, status: s })}
                            className={`py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all border-2 ${
                                formData.status === s 
                                    ? "bg-zinc-950 text-gold-500 border-zinc-950 shadow-2xl scale-105" 
                                    : "bg-stone-50 text-stone-400 border-transparent opacity-60 hover:opacity-100"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-10 pt-16 border-t border-stone-100">
                 <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest italic max-w-sm">
                    Warning: All changes in the Compliance Vault are logged and manifest immediately across mission nodes.
                 </p>
                 <div className="flex gap-8">
                    <button
                        type="button"
                        onClick={closeForm}
                        className="px-12 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] text-stone-600 hover:text-zinc-950 transition-all"
                    >
                        Abort Protocol
                    </button>
                    <button
                        type="submit"
                        className="px-20 py-6 rounded-3xl bg-zinc-950 text-gold-500 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-black transition-all shadow-3xl hover:translate-y-[-5px] active:scale-95"
                    >
                        {editingDoc ? 'Synchronize Record' : 'Authorize Deployment'}
                    </button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
