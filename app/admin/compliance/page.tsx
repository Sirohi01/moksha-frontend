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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    fetchDocuments();
  }, []);

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
        closeModal();
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

  const openModal = (doc?: Document) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title,
        description: doc.description,
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    <div className="space-y-12 animate-in fade-in duration-700 max-w-[1700px] mx-auto">
      <PageHeader 
        title="Compliance Vault" 
        description="Verify and manage institutional legal documents and regulatory certificates."
        icon={<ShieldCheck className="w-8 h-8" />}
      >
        <ActionButton 
          onClick={() => openModal()}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Document
        </ActionButton>
      </PageHeader>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard 
          title="Archive Size"
          value={documents.length}
          icon={<FileText />}
          gradient=""
        />
        <StatsCard 
          title="Active Credentials"
          value={documents.filter(d => d.documentType === 'certificate').length}
          icon={<ShieldCheck />}
          gradient=""
          change="Verified"
          changeType="positive"
        />
        <StatsCard 
          title="Operational Status"
          value="SECURE"
          icon={<Scale />}
          gradient=""
        />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-navy-50 overflow-hidden">
        <div className="p-8 border-b border-navy-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-navy-50/10">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 group-focus-within:text-navy-950 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl border border-navy-100 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-gold-500/5 focus:border-gold-500 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-navy-950">
                <th className="px-8 py-6 text-left text-[10px] font-black text-gold-500 uppercase tracking-[0.2em]">DOCUMENT</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gold-500 uppercase tracking-[0.2em]">CLASSIFICATION</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gold-500 uppercase tracking-[0.2em]">PERIOD</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gold-500 uppercase tracking-[0.2em]">CAPACITY</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gold-500 uppercase tracking-[0.2em] pr-12">OPERATIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-4 bg-navy-50 rounded-full w-48"></div></td>
                    <td className="px-8 py-6"><div className="h-6 bg-navy-50 rounded-full w-20"></div></td>
                    <td className="px-8 py-6"><div className="h-4 bg-navy-50 rounded-full w-24"></div></td>
                    <td className="px-8 py-6"><div className="h-4 bg-navy-50 rounded-full w-12"></div></td>
                    <td className="px-8 py-6 text-right"><div className="h-8 bg-navy-50 rounded-lg w-20 ml-auto mr-4"></div></td>
                  </tr>
                ))
              ) : filteredDocs.map((doc) => {
                const Icon = getIcon(doc.documentType);
                return (
                  <tr key={doc._id} className="hover:bg-navy-50/50 transition-all group group-hover:px-12">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-400 group-hover:bg-navy-950 group-hover:text-gold-500 transition-all shadow-sm">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-navy-950 uppercase tracking-tight">{doc.title}</p>
                          <p className="text-[9px] text-navy-400 font-black uppercase tracking-widest mt-1 italic">Order {doc.order.toString().padStart(2, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="px-4 py-2 rounded-xl bg-navy-50 text-[9px] font-black uppercase tracking-widest text-navy-600 border border-navy-100 group-hover:bg-navy-950 group-hover:text-gold-500 group-hover:border-transparent transition-colors">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-[10px] font-black text-navy-950 uppercase italic tracking-tighter">{doc.validityDate}</td>
                    <td className="px-8 py-8 text-[10px] font-black text-navy-400 uppercase tracking-widest">{doc.fileSize}</td>
                    <td className="px-8 py-8 text-right pr-12">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openModal(doc)}
                          className="w-10 h-10 flex items-center justify-center bg-navy-50 text-navy-400 hover:bg-navy-950 hover:text-gold-500 rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc._id)}
                          className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <Trash2 size={16} />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-navy-950/20 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-navy-50">
            <div className="p-8 border-b border-navy-50 flex items-center justify-between bg-navy-50/20">
              <h2 className="text-2xl font-black text-navy-950 uppercase tracking-tighter italic">
                {editingDoc ? 'REVISE DOCUMENT' : 'AUTHORIZE NEW ENTRY'}
              </h2>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-navy-400 group">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy-400 ml-2">Protocol Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., 80G Tax Certificate"
                    className="w-full h-14 px-6 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-500/10 focus:border-stone-950 transition-all font-bold text-stone-950"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Type</label>
                  <select 
                    value={formData.documentType}
                    onChange={e => setFormData({...formData, documentType: e.target.value})}
                    className="w-full h-14 px-6 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-500/10 focus:border-stone-950 transition-all font-bold text-stone-950 appearance-none"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="report">Report</option>
                    <option value="legal">Legal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Display Order</label>
                  <input 
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full h-14 px-6 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-500/10 focus:border-stone-950 transition-all font-bold text-stone-950"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">File URL</label>
                  <input 
                    required
                    value={formData.fileUrl}
                    onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                    placeholder="https://cloudinary.com/..."
                    className="w-full h-14 px-6 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-500/10 focus:border-stone-950 transition-all font-bold text-stone-950"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">File Size</label>
                  <input 
                    value={formData.fileSize}
                    onChange={e => setFormData({...formData, fileSize: e.target.value})}
                    placeholder="e.g., 1.2 MB"
                    className="w-full h-14 px-6 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-500/10 focus:border-stone-950 transition-all font-bold text-stone-950"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Validity</label>
                  <input 
                    value={formData.validityDate}
                    onChange={e => setFormData({...formData, validityDate: e.target.value})}
                    placeholder="e.g., 2024-2027"
                    className="w-full h-14 px-6 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-500/10 focus:border-stone-950 transition-all font-bold text-stone-950"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full h-14 px-6 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-500/10 focus:border-stone-950 transition-all font-bold text-stone-950 appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-10 h-14 rounded-2xl bg-[#7ab800] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#6ba100] transition-all shadow-lg active:scale-95"
                >
                  {editingDoc ? 'Update Document' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
