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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">Compliance Management</h1>
          <p className="text-stone-500 text-sm font-medium uppercase tracking-widest text-[10px] mt-1">Manage public legal documents and certificates</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 h-12 bg-stone-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Add New Document
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Documents</p>
            <h3 className="text-3xl font-black text-stone-900">{documents.length}</h3>
          </div>
          <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-600">
            <FileText size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Certificates</p>
            <h3 className="text-3xl font-black text-stone-900">{documents.filter(d => d.documentType === 'certificate').length}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <ShieldCheck size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Last Update</p>
            <h3 className="text-xl font-black text-stone-900">Today</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Scale size={24} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="p-8 border-b border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-stone-50/50">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-950 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-4 focus:ring-stone-500/5 focus:border-stone-950 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Document Title</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Validity</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Size</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-stone-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-4 bg-stone-100 rounded-full w-48"></div></td>
                    <td className="px-8 py-6"><div className="h-6 bg-stone-100 rounded-full w-20"></div></td>
                    <td className="px-8 py-6"><div className="h-4 bg-stone-100 rounded-full w-24"></div></td>
                    <td className="px-8 py-6"><div className="h-4 bg-stone-100 rounded-full w-12"></div></td>
                    <td className="px-8 py-6 text-right"><div className="h-8 bg-stone-100 rounded-lg w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredDocs.map((doc) => {
                const Icon = getIcon(doc.documentType);
                return (
                  <tr key={doc._id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-stone-950 group-hover:text-white transition-all">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-950">{doc.title}</p>
                          <p className="text-[10px] text-stone-400 font-medium">Order: {doc.order}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-stone-100 text-[9px] font-black uppercase tracking-widest text-stone-600">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-semibold text-stone-500">{doc.validityDate}</td>
                    <td className="px-8 py-6 text-xs font-semibold text-stone-500">{doc.fileSize}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(doc)}
                          className="p-2 text-stone-400 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc._id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/20 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-8 border-b border-stone-50 flex items-center justify-between bg-stone-50/50">
              <h2 className="text-2xl font-black text-stone-950 uppercase tracking-tighter">
                {editingDoc ? 'Edit Document' : 'Add New Document'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={24} className="text-stone-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Document Title</label>
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
