'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import { PageHeader, DataTable, Alert, ActionButton, Modal, FormInput, LoadingSpinner } from '@/components/admin/AdminComponents';
import { Users, Filter, Plus, PieChart, TrendingUp, Search, UserCheck, Heart } from 'lucide-react';

export default function SegmentsPage() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
     name: '',
     description: '',
     filterCriteria: { role: 'all' }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await marketingAPI.getSegments();
      setSegments(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch segments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
        await marketingAPI.createSegment(formData);
        setModalOpen(false);
        fetchData();
    } catch (err: any) {
        setError(err.message || 'Failed to create segment');
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Segment Identity',
      render: (val: string) => (
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center font-black shadow-xl border border-gold-200`}>
                {val[0].toUpperCase()}
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight">{val}</span>
        </div>
      )
    },
    { key: 'description', label: 'Tactical Description' },
    { 
      key: 'memberCount', 
      label: 'Core Population',
      render: (val: number) => (
        <span className="text-xl font-black text-navy-950 italic tracking-tighter leading-none">{val || 0} <span className="text-[10px] text-gray-400 not-italic ml-1">Nodes</span></span>
      )
    },
    { 
       key: 'updatedAt', 
       label: 'Intelligence Snapshot',
       render: (val: string) => <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">{new Date(val).toLocaleDateString()}</span>
    },
    { 
       key: 'action', 
       label: 'Sector Actions',
       render: (val: any, row: any) => (
         <button 
           onClick={() => alert('Broadcasting targeted message to ' + row.name)}
           className="px-6 py-2 bg-navy-50 text-navy-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-950 hover:text-gold-500 transition-all active:scale-95 shadow-sm">
             Deploy Message
         </button>
       )
    }
  ];

  if (loading && segments.length === 0) return <LoadingSpinner message="Calculating User Demographics..." />;

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <PageHeader 
        title="Tactical Segmentation" 
        description="Grouping users by behavioral traits for high-impact communication targeting."
        icon={<Users className="w-7 h-7" />}
      >
        <ActionButton onClick={() => setModalOpen(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
          New Segment
        </ActionButton>
      </PageHeader>

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
              { label: 'Total Donors', count: '1,240', icon: <Heart className="text-gold-500" /> },
              { label: 'Active Volunteers', count: '458', icon: <UserCheck className="text-emerald-500" /> },
              { label: 'Subscribers', count: '3,892', icon: <PieChart className="text-navy-400" /> },
              { label: 'Untapped Potential', count: '12%', icon: <TrendingUp className="text-rose-400" /> }
          ].map(stat => (
              <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-navy-50 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center group-hover:bg-navy-950 group-hover:text-gold-500 transition-all">
                          {stat.icon}
                      </div>
                      <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                  <p className="text-3xl font-black text-navy-950 tracking-tighter italic">{stat.count}</p>
              </div>
          ))}
      </div>

      <div className="space-y-6">
          <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></div>
                  <h3 className="text-xs font-black text-navy-950 uppercase tracking-[0.3em]">Sector Distribution Table</h3>
              </div>
          </div>
          <DataTable columns={columns} data={segments} loading={loading} />
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Define New Strategic Sector"
        size="lg"
      >
        <div className="space-y-8 p-4">
            <FormInput 
                label="Sector Designation" 
                value={formData.name} 
                onChange={v => setFormData({...formData, name: v})} 
                placeholder="e.g. High Value Donors (India)"
            />

            <FormInput 
                label="Description & Rationale" 
                value={formData.description} 
                onChange={v => setFormData({...formData, description: v})} 
                placeholder="Users with multiple donations in last 6 months..."
            />

            <div className="bg-navy-50 p-10 rounded-[2.5rem] border border-navy-100 flex flex-col items-center justify-center text-center gap-6">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-navy-100 text-gold-600">
                    <Filter className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-navy-950 uppercase tracking-widest">Target Criteria Intelligence</h5>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">System is calculating dynamic filter strings based on current node data. High correlation expected.</p>
                </div>
                <div className="flex gap-4">
                    {['Donors', 'Volunteers', 'Newsletter'].map(f => (
                        <button key={f} className="px-6 py-3 bg-white border border-navy-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gold-500 hover:text-navy-950 hover:border-gold-500 transition-all shadow-sm">
                            Add {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <ActionButton onClick={handleCreate} size="lg" className="flex-1">Calculate & Deploy Sector</ActionButton>
                <ActionButton onClick={() => setModalOpen(false)} variant="secondary" size="lg" className="flex-1">Discard Deck</ActionButton>
            </div>
        </div>
      </Modal>
    </div>
  );
}
