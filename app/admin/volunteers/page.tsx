'use client';

import { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingSpinner, ActionButton } from '@/components/admin/AdminComponents';
import { UserCheck, RotateCcw, X, Mail, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Volunteer {
  _id: string;
  volunteerId: string;
  name: string;
  email: string;
  phone: string;
  registrationType: string;
  city: string;
  state: string;
  volunteerTypes: string[];
  availability: string;
  status: string;
  createdAt: string;
}

export default function VolunteersManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    registrationType: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    fetchVolunteers();
  }, [currentPage, filters]);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteerStatus = async (volunteerId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers/${volunteerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh the volunteers list
        fetchVolunteers();
        alert(`Volunteer ${status} successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to update volunteer: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to update volunteer status:', error);
      alert('Failed to update volunteer status. Please try again.');
    }
  };

  const viewVolunteer = async (volunteerId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers/${volunteerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedVolunteer(data.data);
        setShowProfile(true);
      } else {
        alert('Failed to fetch volunteer details');
      }
    } catch (error) {
      console.error('Failed to fetch volunteer details:', error);
      alert('Failed to fetch volunteer details');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading volunteers..." />;
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'volunteer',
      label: 'Volunteer Details',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
          <div className="text-sm text-gray-500">ID: {volunteer.volunteerId}</div>
          <div className="text-sm text-gray-500 capitalize">{volunteer.registrationType}</div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm text-gray-900">{volunteer.email}</div>
          <div className="text-sm text-gray-500">{volunteer.phone}</div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm text-gray-900">{volunteer.city}</div>
          <div className="text-sm text-gray-500">{volunteer.state}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type & Availability',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm text-gray-900">
            {volunteer.volunteerTypes?.join(', ') || 'Not specified'}
          </div>
          <div className="text-sm text-gray-500">{volunteer.availability}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, volunteer: Volunteer) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(volunteer.status)}`}>
          {volunteer.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, volunteer: Volunteer) => (
        <div className="flex space-x-2">
          <ActionButton
            onClick={() => viewVolunteer(volunteer._id)}
            variant="secondary"
            size="sm"
          >
            View
          </ActionButton>
          <button
            onClick={() => window.open(`mailto:${volunteer.email}?subject=Volunteer Application - ${volunteer.volunteerId}`)}
            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-200"
            title="Send Email"
          >
            📧
          </button>
          {volunteer.status === 'pending' && (
            <>
              <ActionButton
                onClick={() => updateVolunteerStatus(volunteer._id, 'approved')}
                variant="success"
                size="sm"
              >
                Approve
              </ActionButton>
              <ActionButton
                onClick={() => updateVolunteerStatus(volunteer._id, 'rejected')}
                variant="danger"
                size="sm"
              >
                Reject
              </ActionButton>
            </>
          )}
          {volunteer.status === 'approved' && (
            <ActionButton
              onClick={() => updateVolunteerStatus(volunteer._id, 'active')}
              variant="primary"
              size="sm"
            >
              Activate
            </ActionButton>
          )}
          {volunteer.status === 'active' && (
            <ActionButton
              onClick={() => updateVolunteerStatus(volunteer._id, 'inactive')}
              variant="secondary"
              size="sm"
            >
              Deactivate
            </ActionButton>
          )}
          {volunteer.status === 'inactive' && (
            <ActionButton
              onClick={() => updateVolunteerStatus(volunteer._id, 'active')}
              variant="success"
              size="sm"
            >
              Reactivate
            </ActionButton>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 max-w-[1800px] mx-auto pb-32">
      {!showProfile ? (
        <>
          <PageHeader
            title="Volunteer Intelligence"
            description="Operational command for regional recruitment, unit deployment, and service logistics."
            icon={<UserCheck className="w-10 h-10 text-gold-600" />}
          >
            <div className="flex items-center gap-6">
                 <div className="hidden md:flex flex-col items-end opacity-40">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Active Network</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">{volunteers.length} Units Online</span>
                 </div>
                 <ActionButton
                    onClick={fetchVolunteers}
                    icon={<RotateCcw className="w-5 h-5" />}
                    className="px-8 py-5 bg-zinc-950 text-gold-500 rounded-2xl shadow-2xl hover:bg-black transition-all"
                 >
                    Sync Registry
                </ActionButton>
            </div>
          </PageHeader>

          {/* Operations Filter Deck */}
          <div className="bg-white rounded-[4rem] p-12 shadow-[0_40px_120px_rgba(0,0,0,0.06)] border border-stone-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-stone-50 blur-[100px] rounded-full -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-gold-500/5"></div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-2.5 h-7 bg-zinc-950 rounded-full"></div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-950 italic">Deployment Telemetry Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 ml-4">Strategic Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full h-16 px-8 bg-stone-50 border-2 border-stone-100/50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-950 focus:outline-none focus:border-zinc-950 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="">ALL STATUS QUO</option>
                  <option value="pending">PENDING ACTIVATION</option>
                  <option value="approved">AUTHORIZED</option>
                  <option value="active">ACTIVE DEPLOYMENT</option>
                  <option value="inactive">DEACTIVATED</option>
                  <option value="rejected">TERMINATED</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 ml-4">Unit Classification</label>
                <select
                  value={filters.registrationType}
                  onChange={(e) => setFilters({ ...filters, registrationType: e.target.value })}
                  className="w-full h-16 px-8 bg-stone-50 border-2 border-stone-100/50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-950 focus:outline-none focus:border-zinc-950 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="">ALL FORMATIONS</option>
                  <option value="individual">SINGLE AGENT</option>
                  <option value="group">COLLECTIVE UNIT</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 ml-4">City Hub</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  placeholder="SEARCH CITY GEOMETRY..."
                  className="w-full h-16 px-8 bg-white border-2 border-stone-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-950 placeholder:text-stone-300 focus:outline-none focus:border-zinc-950 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 ml-4">Regional Jurisdiction</label>
                <input
                  type="text"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  placeholder="SEARCH STATE DOMAIN..."
                  className="w-full h-16 px-8 bg-white border-2 border-stone-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-950 placeholder:text-stone-300 focus:outline-none focus:border-zinc-950 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.08)] border border-stone-100 overflow-hidden">
             <div className="p-10 border-b border-stone-50 flex items-center justify-between bg-stone-50/30">
                <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-700 italic">Global Volunteer Registry Synchronized</span>
                </div>
                <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic">Phase 1 Data Stream Active</div>
             </div>
             
             <div className="p-6">
                <DataTable
                    columns={columns}
                    data={volunteers}
                    loading={loading}
                    emptyMessage="NO ASSET SIGNATURES DETECTED"
                    pagination={{
                    currentPage: currentPage,
                    totalPages: totalPages
                    }}
                    onPageChange={setCurrentPage}
                />
             </div>
          </div>
        </>
      ) : (
        /* VOLUNTEER TACTICAL DOSSIER - FULL PAGE */
        <div className="animate-in slide-in-from-right-20 duration-1000 space-y-12">
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-white p-10 rounded-[4rem] border border-stone-100 shadow-[0_40px_100px_rgba(0,0,0,0.06)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-stone-50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="flex items-center gap-10 relative z-10">
              <button 
                onClick={() => setShowProfile(false)}
                className="w-16 h-16 bg-zinc-950 text-white rounded-[1.8rem] flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-2xl group/back overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gold-600 translate-y-full group-hover/back:translate-y-0 transition-transform"></div>
                <X className="w-8 h-8 relative z-10 group-hover/back:rotate-90 transition-transform duration-500" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-600 shadow-[0_0_15px_rgba(217,119,6,0.5)]"></div>
                    <p className="text-[11px] font-black text-gold-600 uppercase tracking-[0.5em] italic text-center">Tactical Asset Dossier</p>
                </div>
                <h2 className="text-5xl font-black text-zinc-950 uppercase tracking-tighter italic leading-none drop-shadow-sm">
                  {selectedVolunteer?.name} <span className="text-stone-400">Profile</span>
                </h2>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-8 relative z-10">
                <div className="text-right">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1 italic">Registry Identification</p>
                    <p className="text-lg font-black text-zinc-950 tracking-tighter uppercase italic">{selectedVolunteer?.volunteerId}</p>
                </div>
                <div className={cn(
                    "px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl border-2",
                    selectedVolunteer?.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    selectedVolunteer?.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                    "bg-zinc-950 text-gold-500 border-zinc-950"
                )}>
                    {selectedVolunteer?.status} Manifest
                </div>
            </div>
          </div>

          {/* Dossier Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Core Identity and Summary */}
            <div className="lg:col-span-8 space-y-12">
                
                {/* Identity Matrix Card */}
                <div className="bg-white rounded-[5rem] p-20 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.1)] border border-stone-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-stone-50 blur-[120px] rounded-full -mr-80 -mt-80"></div>
                    <div className="relative z-10 space-y-20">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            <div className="space-y-10 border-l-4 border-stone-100 pl-10">
                                <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-[0.5em] italic">Identity Manifest</h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">Asset Legal Name</label>
                                        <p className="text-2xl font-black text-zinc-950 uppercase tracking-tighter italic">{selectedVolunteer?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">Digital Uplink (Email)</label>
                                        <p className="text-xl font-black text-zinc-800 tracking-tight lowercase italic">{selectedVolunteer?.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">Signal Channel (Phone)</label>
                                        <p className="text-xl font-black text-zinc-800 tracking-widest italic">{selectedVolunteer?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10 border-l-4 border-stone-100 pl-10">
                                <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-[0.5em] italic">Stationary Coordinates</h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">Operational Hub (City)</label>
                                        <p className="text-2xl font-black text-zinc-950 uppercase tracking-tighter italic">{selectedVolunteer?.city}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">Sector Jurisdiction (State)</label>
                                        <p className="text-2xl font-black text-zinc-950 uppercase tracking-tighter italic">{selectedVolunteer?.state}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">Asset Formulation</label>
                                        <p className="text-xl font-black text-zinc-800 uppercase tracking-widest italic">{selectedVolunteer?.registrationType}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specializations & Availability */}
                        <div className="pt-20 border-t border-stone-100">
                             <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-[0.5em] mb-12 italic text-center">Skill Manifest & Operational Availability</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-6">
                                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-2">Selected Specializations</label>
                                    <div className="flex flex-wrap gap-4">
                                        {selectedVolunteer?.volunteerTypes?.map((type, i) => (
                                            <span key={i} className="px-6 py-3 rounded-2xl bg-zinc-950 text-gold-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl italic border border-zinc-950">
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-2">Availability Protocol</label>
                                    <div className="p-8 rounded-[2.5rem] bg-stone-50 border-2 border-stone-100 shadow-inner">
                                        <p className="text-sm font-black text-zinc-950 uppercase tracking-widest italic leading-relaxed">
                                            {selectedVolunteer?.availability}
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Actions and Metadata */}
            <div className="lg:col-span-4 space-y-12">
                
                {/* Tactical Actions Card */}
                <div className="bg-zinc-950 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group/actions">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover/actions:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative z-10 flex flex-col gap-6">
                         <div className="text-center mb-6">
                             <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.5em] italic mb-1">Operational Control</p>
                             <div className="w-12 h-1 bg-gold-600 mx-auto rounded-full"></div>
                         </div>

                         <button 
                            onClick={() => window.open(`mailto:${selectedVolunteer?.email}?subject=Volunteer Application Status - ${selectedVolunteer?.volunteerId}`)}
                            className="w-full py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-zinc-950 transition-all flex items-center justify-center gap-4 group/btn"
                         >
                            <Mail className="w-5 h-5 group-hover/btn:scale-125 transition-transform" /> Contact Asset
                         </button>

                         <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/5">
                            {selectedVolunteer?.status === 'pending' && (
                                <>
                                <button 
                                    onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'approved'); setShowProfile(false); }}
                                    className="w-full py-6 rounded-[2rem] bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950"
                                >
                                    Authorize Asset
                                </button>
                                <button 
                                    onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'rejected'); setShowProfile(false); }}
                                    className="w-full py-6 rounded-[2rem] bg-rose-600/20 border border-rose-600/30 text-rose-500 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all"
                                >
                                    Terminate Application
                                </button>
                                </>
                            )}

                            {selectedVolunteer?.status === 'approved' && (
                                <button 
                                    onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'active'); setShowProfile(false); }}
                                    className="w-full py-6 rounded-[2rem] bg-gold-600 text-zinc-950 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gold-500 transition-all shadow-xl"
                                >
                                    Activate Deployment
                                </button>
                            )}

                            {selectedVolunteer?.status === 'active' && (
                                <button 
                                    onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'inactive'); setShowProfile(false); }}
                                    className="w-full py-6 rounded-[2rem] bg-stone-800 text-stone-400 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-stone-700 hover:text-white transition-all border border-stone-700"
                                >
                                    Deactivate Unit
                                </button>
                            )}

                            {selectedVolunteer?.status === 'inactive' && (
                                <button 
                                    onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'active'); setShowProfile(false); }}
                                    className="w-full py-6 rounded-[2rem] bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-xl"
                                >
                                    Re-Authorize Unit
                                </button>
                            )}
                         </div>
                    </div>
                </div>

                {/* Registry Metadata Card */}
                <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-stone-100 space-y-10 shadow-inner">
                    <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.4em] italic mb-6">Phase 1 Chronology</h4>
                    <div className="space-y-8">
                        <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic">Entry Date</span>
                            <span className="text-[11px] font-black text-zinc-950 tracking-tighter uppercase italic">{new Date(selectedVolunteer?.createdAt || '').toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic">Manifest Type</span>
                            <span className="text-[11px] font-black text-zinc-950 tracking-tighter uppercase italic">{selectedVolunteer?.registrationType} Formation</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic">Network Security</span>
                            <span className="text-[11px] font-black text-emerald-500 tracking-tighter uppercase italic">ENCRYPTED</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-stone-50 rounded-3xl border border-stone-100 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                             <RotateCcw className="w-4 h-4" />
                        </div>
                        <p className="text-[8px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-relaxed italic">
                            All profile modifications and status shifts are audited in real-time.
                        </p>
                    </div>
                </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}