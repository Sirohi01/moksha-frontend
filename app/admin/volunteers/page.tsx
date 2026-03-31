"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { PageHeader, DataTable, LoadingSpinner, ActionButton } from "@/components/admin/AdminComponents";
import { 
  UserCheck, 
  RotateCcw, 
  X, 
  Mail, 
  Loader2, 
  Printer, 
  Camera, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  User,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Clock,
  Heart,
  Fingerprint,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Activity,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";

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
  photo?: string;
  status: string;
  createdAt: string;
  occupation: string;
  skills?: string;
  experience?: string;
  whyVolunteer?: string;
  agreeToTerms?: boolean;
  agreeToBackgroundCheck?: boolean;
  groupMembers?: Array<{
    name: string;
    role: string;
    contact: string;
    photo?: string;
  }>;
}

export default function VolunteersManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    registrationType: "",
    city: "",
    state: ""
  });

  useEffect(() => {
    fetchVolunteers();
  }, [currentPage, filters]);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers?${queryParams}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  // ANALYTICS DATA CALCULATION
  const stats = useMemo(() => {
    const cityData: Record<string, number> = {};
    const statusData: Record<string, number> = {};
    let activeUnits = 0;
    let pendingUnits = 0;
    let groupUnits = 0;

    volunteers.forEach(v => {
      cityData[v.city] = (cityData[v.city] || 0) + 1;
      statusData[v.status] = (statusData[v.status] || 0) + 1;
      if (v.status === 'active') activeUnits++;
      if (v.status === 'pending') pendingUnits++;
      if (v.registrationType === 'group') groupUnits++;
    });

    const cityChart = Object.entries(cityData).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
    const statusChart = Object.entries(statusData).map(([name, value]) => ({ name, value }));

    return { cityChart, statusChart, activeUnits, pendingUnits, groupUnits, total: volunteers.length };
  }, [volunteers]);

  const STATUS_COLORS = {
    pending: '#d97706',
    approved: '#10b981',
    active: '#6366f1',
    inactive: '#78716c',
    rejected: '#e11d48'
  };

  const updateVolunteerStatus = async (volunteerId: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers/${volunteerId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchVolunteers();
        if (showProfile && selectedVolunteer?._id === volunteerId) {
          setSelectedVolunteer({ ...selectedVolunteer, status });
        }
      }
    } catch (error) {
      console.error("Failed to update volunteer status:", error);
    }
  };

  const viewVolunteer = async (volunteerId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers/${volunteerId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedVolunteer(data.data);
        setShowProfile(true);
      }
    } catch (error) {
      console.error("Failed to fetch volunteer details:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      active: "bg-indigo-50 text-indigo-600 border-indigo-100",
      inactive: "bg-stone-100 text-stone-500 border-stone-200",
      rejected: "bg-rose-50 text-rose-600 border-rose-100"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handlePrintICard = (name: string, role: string, photo?: string, vId?: string, hub?: string, mobile?: string) => {
    const w = window.open('', '_blank');
    if(!w) return;
    w.document.write(`
      <html>
        <head>
          <title>MOKSHA SEWA ID - ${name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');
            body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fafafa; margin: 0; }
            .card-container { padding: 40px; }
            .card { 
               width: 450px; 
               height: 700px; 
               background: #ffffff; 
               border-radius: 40px; 
               overflow: hidden; 
               position: relative; 
               box-shadow: 0 40px 100px rgba(0,0,0,0.1); 
               border: 12px solid #09090b;
               display: flex;
               flex-direction: column;
            }
            .header { 
               background: #09090b; 
               padding: 50px 20px 70px; 
               text-align: center; 
               clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);
            }
            .header h1 { 
               color: #f59e0b; 
               margin: 0; 
               font-size: 28px; 
               letter-spacing: 12px; 
               font-weight: 900; 
               text-shadow: 0 4px 10px rgba(0,0,0,0.3);
               text-transform: uppercase;
               font-style: italic;
            }
            .header p {
               color: #555;
               font-size: 8px;
               font-weight: 900;
               letter-spacing: 4px;
               margin-top: 10px;
               text-transform: uppercase;
            }
            .photo-section {
               margin-top: -60px;
               display: flex;
               justify-content: center;
               position: relative;
               z-index: 10;
            }
            .photo-box { 
               height: 220px; 
               width: 180px; 
               background: #eee; 
               border: 8px solid #fff; 
               border-radius: 30px; 
               overflow: hidden; 
               box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .photo-box img { width: 100%; height: 100%; object-fit: cover; }
            .details { 
               flex: 1;
               text-align: center; 
               padding: 10px 40px 40px; 
               display: flex;
               flex-direction: column;
               justify-content: space-between;
            }
            .name { 
               font-size: 24px; 
               font-weight: 900; 
               color: #09090b; 
               text-transform: uppercase; 
               margin-top: 10px;
               letter-spacing: -0.5px;
               font-style: italic;
               height: 60px;
               display: flex;
               align-items: center;
               justify-content: center;
               border-bottom: 2px solid #f2f2f2;
            }
            .role-badge { 
               color: #fff; 
               font-size: 10px; 
               font-weight: 900; 
               letter-spacing: 3px; 
               background: #f59e0b; 
               display: inline-block; 
               padding: 8px 24px; 
               border-radius: 50px; 
               margin: 20px auto; 
               text-transform: uppercase;
               box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2);
            }
            .info-grid {
               text-align: left;
               background: #fafafa;
               padding: 20px;
               border-radius: 20px;
               border: 1px solid #f0f0f0;
            }
            .info-row { margin-bottom: 12px; }
            .info-row:last-child { margin-bottom: 0; }
            .lbl { font-size: 8px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
            .val { font-size: 12px; font-weight: 900; color: #09090b; text-transform: uppercase; letter-spacing: 1px; }
            .footer { 
               width: 100%; 
               height: 70px; 
               background: #09090b; 
               display: flex; 
               align-items: center; 
               justify-content: center; 
               color: #f59e0b; 
               font-size: 10px; 
               font-weight: 900; 
               letter-spacing: 6px; 
               text-transform: uppercase;
            }
            @media print { 
               body { background: white; }
               .card { border: 12px solid #000; -webkit-print-color-adjust: exact; } 
               .header { background: #000 !important; }
               .footer { background: #000 !important; }
            }
          </style>
        </head>
        <body>
          <div class="card-container">
            <div class="card">
               <div class="header">
                  <h1>MOKSHA SEWA</h1>
                  <p>Regional Authorization manifest</p>
               </div>
               <div class="photo-section">
                  <div class="photo-box"><img src="${photo || ''}" /></div>
               </div>
               <div class="details">
                  <div class="name">${name}</div>
                  <div class="role-badge">${role}</div>
                  <div class="info-grid">
                     <div class="info-row">
                        <div class="lbl">Identification No_</div>
                        <div class="val">${vId}</div>
                     </div>
                     <div class="info-row">
                        <div class="lbl">Regional Hub Coordinate_</div>
                        <div class="val">${hub}</div>
                     </div>
                     <div class="info-row">
                        <div class="lbl">Operational Signal_</div>
                        <div class="val">${mobile}</div>
                     </div>
                  </div>
               </div>
               <div class="footer">MISSION_AGENT</div>
            </div>
          </div>
          <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  const columns = [
    {
      key: "volunteer",
      label: "Identity & Formation",
      render: (_: any, v: Volunteer) => (
        <div className="flex items-center gap-4">
           {v.photo ? (
             <img src={v.photo} className="w-10 h-10 rounded-xl object-cover grayscale border border-stone-100 shadow-sm" />
           ) : (
             <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-300 border border-stone-200">
                {v.registrationType === 'group' ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
             </div>
           )}
           <div>
              <div className="text-sm font-black text-zinc-950 uppercase italic leading-none mb-1">{v.name}</div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{v.volunteerId}</span>
                 <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border", v.registrationType === 'group' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-stone-50 text-stone-600 border-stone-100")}>{v.registrationType}</span>
              </div>
           </div>
        </div>
      )
    },
    {
      key: "contact",
      label: "HUB Coordinate",
      render: (_: any, v: Volunteer) => (
        <div>
           <div className="text-xs font-bold text-zinc-700 leading-tight mb-1">{v.city}</div>
           <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic">{v.state}</div>
        </div>
      )
    },
    {
      key: "status",
      label: "Tactical Status",
      render: (_: any, v: Volunteer) => (
        <span className={cn("px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border shadow-sm", getStatusBadge(v.status))}>
           {v.status}
        </span>
      )
    },
    {
      key: "actions",
      label: "Operational Link",
      render: (_: any, v: Volunteer) => (
        <div className="flex items-center gap-2">
           <button 
             onClick={() => viewVolunteer(v._id)}
             className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-all border border-zinc-900 shadow-xl"
           >
             Open Dossier
           </button>
           <button 
             onClick={() => window.open(`mailto:${v.email}`)}
             className="w-10 h-10 flex items-center justify-center bg-stone-50 text-zinc-400 rounded-xl hover:bg-zinc-950 hover:text-gold-500 transition-all border border-stone-100"
           >
             <Mail className="w-4 h-4" />
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-[1800px] mx-auto pb-40 selection:bg-gold-50">
       {!showProfile ? (
         <>
           <PageHeader
             title="Volunteer Command Center"
             description="Tactical management of regional recruitment protocols, unit deployments, and institutional taskforces."
             icon={<UserCheck className="w-10 h-10 text-gold-600" />}
           >
              <div className="flex items-center gap-6">
                 <button 
                  onClick={() => setShowAnalytics(!showAnalytics)} 
                  className={cn("px-8 py-5 rounded-2xl shadow-3xl transition-all border border-zinc-100 flex items-center gap-4 group/ana", showAnalytics ? "bg-gold-500 text-white border-gold-400" : "bg-white text-zinc-950")}
                 >
                    <BarChart3 className={cn("w-5 h-5", showAnalytics ? "text-white" : "text-gold-600")} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{showAnalytics ? 'Close Telemetry' : 'Strategic Analytics'}</span>
                 </button>
                 <ActionButton
                    onClick={fetchVolunteers}
                    className="px-8 py-5 bg-zinc-950 text-gold-500 rounded-2xl shadow-3xl hover:bg-black transition-all border border-zinc-800"
                    icon={<RotateCcw className="w-5 h-5" />}
                 >
                    Registry Sync
                 </ActionButton>
              </div>
           </PageHeader>

           {/* STRATEGIC TELEMETRY DASHBOARD */}
           {showAnalytics && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-top-10 duration-1000">
                {/* Metric Grid */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Asset Manifests', value: stats.total, icon: Activity, color: 'text-zinc-950', bg: 'bg-white' },
                     { label: 'Active Deployment', value: stats.activeUnits, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50/30' },
                     { label: 'Activation Pending', value: stats.pendingUnits, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50/30' },
                     { label: 'Taskforce Units', value: stats.groupUnits, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50/30' }
                   ].map((m, i) => (
                     <div key={i} className={cn("p-10 rounded-[2.5rem] border border-stone-100 shadow-xl flex items-center justify-between group", m.bg)}>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2 italic">{m.label}</p>
                           <h4 className={cn("text-5xl font-black italic tracking-tighter leading-none", m.color)}>{m.value}</h4>
                        </div>
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700", m.bg === 'bg-white' ? 'bg-zinc-50' : 'bg-white shadow-md')}>
                           <m.icon className={cn("w-6 h-6", m.color === 'text-zinc-950' ? 'text-gold-500' : m.color)} />
                        </div>
                     </div>
                   ))}
                </div>

                {/* Charts Area */}
                <div className="lg:col-span-8 bg-white rounded-[3.5rem] p-12 border border-stone-100 shadow-3xl relative overflow-hidden">
                   <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-4">
                         <div className="w-1 h-6 bg-zinc-950 rounded-full"></div>
                         <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-950 italic">Strategic Hub Deployment (Top Cities)</h4>
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={stats.cityChart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 900 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 900 }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', textTransform: 'uppercase', fontSize: '10px', fontWeight: '900' }} />
                            <Bar dataKey="value" fill="#09090b" radius={[12, 12, 0, 0]} barSize={60} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 bg-zinc-950 rounded-[3.5rem] p-12 border border-zinc-800 shadow-3xl text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 blur-[100px] rounded-full"></div>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-gold-500 italic mb-12 relative z-10">Unit Activation Matrix</h4>
                   <div className="h-64 w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={stats.statusChart}
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={10}
                               dataKey="value"
                            >
                               {stats.statusChart.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#666'} />
                               ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px', fontWeight: '900' }} />
                            <Legend wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', marginTop: '20px' }} iconType="circle" />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
           )}

           {/* Deployment Filter Deck */}
           <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_40px_120px_rgba(0,0,0,0.05)] border border-stone-100 relative overflow-hidden group">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                 {['status', 'registrationType'].map((k) => (
                    <div key={k} className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400 ml-4">{k === 'status' ? 'Operational Status' : 'Unit Formation'}</label>
                       <select 
                         value={filters[k as keyof typeof filters]} 
                         onChange={(e) => setFilters({...filters, [k]: e.target.value})}
                         className="w-full h-14 px-8 bg-stone-50 border-2 border-stone-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-950 focus:outline-none focus:border-zinc-950 transition-all appearance-none cursor-pointer"
                       >
                         <option value="">{k === 'status' ? 'All Operations' : 'All Manifests'}</option>
                         <option value="pending">Activation Pending</option>
                         <option value="approved">Authorized</option>
                         <option value="active">Active Deployment</option>
                         <option value="inactive">Deactivated</option>
                         <option value="rejected">Terminated</option>
                       </select>
                    </div>
                 ))}
                 {['city', 'state'].map((k) => (
                    <div key={k} className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400 ml-4">{k === 'city' ? 'HUB CITY' : 'REGIONAL STATE'}</label>
                       <input 
                         type="text" 
                         value={filters[k as keyof typeof filters]} 
                         onChange={(e) => setFilters({...filters, [k]: e.target.value})}
                         className="w-full h-14 px-8 bg-white border-2 border-stone-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-950 focus:outline-none focus:border-zinc-950 transition-all placeholder:text-stone-300"
                         placeholder="SEARCH..."
                       />
                    </div>
                 ))}
              </div>
           </div>

           {/* Tactical Data Terminal */}
           <div className="bg-white rounded-[3.5rem] shadow-4xl border border-stone-100 overflow-hidden">
              <div className="p-8 border-b border-stone-50 flex items-center justify-between bg-stone-50/20">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-950 italic">Operational Registry Synchronized</span>
                 </div>
                 <div className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest italic">Phase 1 Data Stream Active</div>
              </div>
              <div className="p-4">
                 <DataTable 
                   columns={columns} 
                   data={volunteers} 
                   loading={loading} 
                   pagination={{ currentPage, totalPages }} 
                   onPageChange={setCurrentPage} 
                 />
              </div>
           </div>
         </>
       ) : (
         /* ENROLLMENT DOSSIER - IMMERSIVE PROFILE VIEW */
         <div className="animate-in slide-in-from-right-20 duration-1000 space-y-10">
            {/* Dossier Header Component */}
            <div className="flex items-center justify-between bg-white p-6 rounded-[3.5rem] border border-stone-100 shadow-3xl relative overflow-hidden group/dossier">
               <div className="absolute inset-0 bg-stone-50 opacity-0 group-hover/dossier:opacity-100 transition-opacity duration-1000"></div>
               <div className="flex items-center gap-10 relative z-10">
                  <button 
                    onClick={() => setShowProfile(false)}
                    className="w-16 h-16 bg-zinc-950 text-white rounded-[1.8rem] flex items-center justify-center hover:bg-gold-500 transition-all shadow-2xl group/close"
                  >
                    <X className="w-8 h-8 group-hover/close:rotate-90 transition-transform duration-500" />
                  </button>
                  <div>
                    <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.6em] italic mb-1">Personnel Authorization Dossier</p>
                    <h2 className="text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tighter italic leading-none">{selectedVolunteer?.name}</h2>
                  </div>
               </div>
               <div className="hidden lg:flex items-center gap-12 relative z-10">
                  <div className="text-right">
                     <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] leading-none mb-2 italic">Registry Identification</p>
                     <p className="text-2xl font-black text-zinc-950 tracking-tighter leading-none italic uppercase">{selectedVolunteer?.volunteerId}</p>
                  </div>
                  <div className={cn("px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] border shadow-2xl bg-white", getStatusBadge(selectedVolunteer?.status || ''))}>
                     {selectedVolunteer?.status} Manifest
                  </div>
               </div>
            </div>

            {/* Main Information Dossier Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               {/* PRIMARY ASSET LOGISTICS (Col 8) */}
               <div className="lg:col-span-8 space-y-10">
                  <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-6 md:p-16 border border-stone-100 shadow-[0_60px_120px_rgba(0,0,0,0.06)] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-50 blur-[120px] rounded-full -mr-64 -mt-64"></div>
                     <div className="relative z-10 space-y-12 md:space-y-20">
                        {/* Profile Matrix Row */}
                        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start pt-4">
                           <div className="w-48 h-64 md:w-64 md:h-80 rounded-[2rem] md:rounded-[3rem] bg-stone-50 border border-stone-100 shadow-inner overflow-hidden relative group/photo flex-shrink-0">
                              {selectedVolunteer?.photo ? (
                                <img src={selectedVolunteer.photo} className="w-full h-full object-cover grayscale group-hover/photo:grayscale-0 transition-all duration-1000" />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-stone-200">
                                   <Camera className="w-10 h-10 md:w-14 md:h-14 mb-3" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">No Signal Visual</span>
                                </div>
                              )}
                           </div>

                           <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-12 md:border-l-4 md:border-stone-100 md:pl-12 h-full py-2 w-full">
                              <div>
                                 <label className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-2 md:mb-3 block italic">Operational Signal</label>
                                 <p className="text-xl md:text-2xl font-black text-zinc-950 tracking-widest italic">{selectedVolunteer?.phone}</p>
                              </div>
                              <div>
                                 <label className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-2 md:mb-3 block italic">Digital Uplink</label>
                                 <p className="text-base md:text-xl font-black text-zinc-800 tracking-tight lowercase italic line-clamp-1">{selectedVolunteer?.email}</p>
                              </div>
                              <div>
                                 <label className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-2 md:mb-3 block italic">Hub Coordinates</label>
                                 <p className="text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-tighter italic leading-none">{selectedVolunteer?.city}</p>
                              </div>
                              <div>
                                 <label className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-2 md:mb-3 block italic">Sector Jurisdiction</label>
                                 <p className="text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-tighter italic leading-none">{selectedVolunteer?.state}</p>
                              </div>
                           </div>
                        </div>

                        {/* Detailed Dossier Attributes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-12 md:pt-20 border-t border-stone-50">
                           <div className="space-y-4">
                              <label className="flex items-center gap-3 text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] italic mb-2 md:mb-4">
                                 <Briefcase className="w-4 h-4 text-gold-600" /> Strategic Background
                              </label>
                              <div className="p-6 md:p-8 bg-stone-50 rounded-[2rem] border border-stone-100 shadow-inner hover:bg-white hover:shadow-xl transition-all">
                                 <p className="text-sm md:text-base font-black text-zinc-950 leading-tight uppercase italic">{selectedVolunteer?.occupation}</p>
                                 <p className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase mt-2 tracking-widest italic">{selectedVolunteer?.experience?.replace('_', ' ')} Experience</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="flex items-center gap-3 text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] italic mb-2 md:mb-4">
                                 <Clock className="w-4 h-4 text-gold-600" /> Operational Window
                              </label>
                              <div className="p-6 md:p-8 bg-stone-50 rounded-[2rem] border border-stone-100 shadow-inner hover:bg-white hover:shadow-xl transition-all">
                                 <p className="text-sm md:text-base font-black text-zinc-950 leading-tight italic uppercase tracking-widest leading-none">{selectedVolunteer?.availability?.replace('_', ' ')}</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="flex items-center gap-3 text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] italic mb-2 md:mb-4">
                                 <ShieldCheck className="w-4 h-4 text-gold-600" /> Specializations
                              </label>
                              <div className="p-6 md:p-8 bg-stone-50 rounded-[2rem] border border-stone-100 flex flex-wrap gap-2 md:gap-3">
                                 {selectedVolunteer?.volunteerTypes.map((t, i) => (
                                   <span key={i} className="px-3 md:px-4 py-1.5 bg-zinc-950 text-gold-500 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic border border-zinc-900">{t.replace('_', ' ')}</span>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Motivation Briefing */}
                        <div className="pt-10 md:pt-12 space-y-6 md:space-y-8">
                           <label className="flex items-center gap-3 text-[10px] md:text-[11px] font-black text-stone-500 uppercase tracking-[0.5em] italic leading-none mb-4 md:mb-6">
                              <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-500" /> Mission Purpose Briefing
                           </label>
                           <div className="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-stone-50 shadow-inner italic relative">
                              <p className="text-lg md:text-xl font-bold text-zinc-800 leading-relaxed normal-case line-clamp-6">{selectedVolunteer?.whyVolunteer || "No briefing documented for this unit manifest."}</p>
                           </div>
                        </div>

                        {/* Institutional Taskforce Manifest (Groups) */}
                        {selectedVolunteer?.registrationType === 'group' && selectedVolunteer.groupMembers && selectedVolunteer.groupMembers.length > 0 && (
                          <div className="pt-16 md:pt-20 border-t border-stone-100 space-y-8 md:space-y-12">
                             <div className="flex items-center justify-between">
                                <h4 className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-black text-stone-500 uppercase tracking-[0.5em] italic">
                                   <Users className="w-5 h-5 md:w-6 md:h-6 text-gold-600" /> Taskforce Agent Registry
                                </h4>
                                <span className="text-[10px] md:text-[11px] font-black text-emerald-500 uppercase tracking-widest italic">{selectedVolunteer.groupMembers.length} Units Online</span>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                                {selectedVolunteer.groupMembers.map((m, i) => (
                                  <div key={i} className="p-6 md:p-8 bg-stone-50 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 flex items-center gap-6 md:gap-8 group/member hover:bg-white hover:shadow-xl transition-all duration-700 relative overflow-hidden">
                                     <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl border border-stone-200 overflow-hidden shadow-xl flex-shrink-0 group-hover/member:border-gold-300">
                                        {m.photo ? <img src={m.photo} className="w-full h-full object-cover grayscale" /> : <User className="w-6 h-6 md:w-8 md:h-8 text-stone-100 m-auto mt-4" />}
                                     </div>
                                     <div className="flex-1">
                                        <h5 className="text-[14px] md:text-base font-black text-zinc-950 uppercase italic leading-none mb-1 md:mb-1.5">{m.name}</h5>
                                        <p className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest">{m.role}</p>
                                     </div>
                                     <button 
                                        onClick={() => handlePrintICard(m.name, m.role, m.photo, `${selectedVolunteer.volunteerId}-${i+1}`, selectedVolunteer.city, m.contact)}
                                        className="w-10 h-10 md:w-12 md:h-12 bg-zinc-950 text-gold-500 rounded-xl md:rounded-2xl flex items-center justify-center opacity-0 group-hover/member:opacity-100 transition-all hover:bg-gold-500 hover:text-white"
                                     >
                                        <Printer className="w-5 h-5 md:w-6 md:h-6" />
                                     </button>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* TACTICAL COMMAND DOCK (Col 4) */}
               <div className="lg:col-span-4 space-y-10">
                  
                  {/* Status Activation Interface */}
                  <div className="bg-zinc-950 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-4xl relative overflow-hidden border border-zinc-800">
                     <div className="relative z-10 space-y-8 md:space-y-10">
                        <div className="text-center pb-8 border-b border-zinc-800">
                           <Activity className="w-10 h-10 md:w-12 md:h-12 text-gold-600 mx-auto mb-4 md:mb-6" />
                           <p className="text-[10px] md:text-[11px] font-black text-gold-600 uppercase tracking-[0.5em] italic">Operational Controls_</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                           {selectedVolunteer?.status === 'pending' && (
                             <>
                               <button 
                                 onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'approved'); setShowProfile(false); }}
                                 className="w-full py-5 md:py-6 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-emerald-400 transition-all font-bold italic"
                               >
                                 Authorize Asset
                               </button>
                               <button 
                                 onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'rejected'); setShowProfile(false); }}
                                 className="w-full py-4 md:py-5 rounded-2xl bg-zinc-900 border border-rose-500/40 text-rose-500 font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all italic"
                               >
                                 Terminate Manifest
                               </button>
                             </>
                           )}
                           {(selectedVolunteer?.status === 'inactive' || selectedVolunteer?.status === 'rejected') && (
                              <button 
                                onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'approved'); setShowProfile(false); }}
                                className="w-full py-5 md:py-6 rounded-2xl bg-gold-500 text-zinc-950 font-black text-xs uppercase tracking-[0.4em] hover:bg-white hover:shadow-2xl transition-all italic flex items-center justify-center gap-4"
                              >
                                <RotateCcw className="w-4 h-4" /> Restore Manifest
                              </button>
                           )}

                           {selectedVolunteer?.status === 'approved' && (
                             <button 
                               onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'active'); setShowProfile(false); }}
                               className="w-full py-6 md:py-7 rounded-2xl bg-gold-600 text-zinc-950 font-black text-xs md:text-sm uppercase tracking-[0.4em] md:tracking-[0.5em] hover:bg-white transition-all shadow-3xl italic"
                             >
                               Activate Deployment
                             </button>
                           )}

                           {selectedVolunteer?.status === 'active' && (
                              <button 
                                onClick={() => { updateVolunteerStatus(selectedVolunteer?._id || '', 'inactive'); setShowProfile(false); }}
                                className="w-full py-5 md:py-6 rounded-2xl bg-zinc-800 border border-zinc-700 text-stone-400 font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-zinc-950 transition-all font-bold italic"
                              >
                                Deactivate Unit
                              </button>
                           )}

                           <button 
                              onClick={() => window.open(`mailto:${selectedVolunteer?.email}`)}
                              className="w-full py-4 md:py-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-4 md:gap-6"
                           >
                              <Mail className="w-4 h-4 md:w-5 md:h-5" /> Protocol Message
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Identification Card Trigger */}
                  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-stone-100 flex flex-col items-center gap-6 md:gap-8 hover:border-gold-300 relative overflow-hidden transition-all">
                     <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
                     <div className="w-20 h-20 md:w-24 md:h-24 bg-stone-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-stone-200">
                        <Printer className="w-8 h-8 md:w-10 md:h-10 text-stone-300" />
                     </div>
                     <button 
                        onClick={() => {
                          if (selectedVolunteer) {
                            handlePrintICard(
                              selectedVolunteer.name, 
                              selectedVolunteer.registrationType === 'group' ? 'TASKFORCE LEADER' : 'AUTHORISED AGENT',
                              selectedVolunteer.photo,
                              selectedVolunteer.volunteerId,
                              selectedVolunteer.city,
                              selectedVolunteer.phone
                            );
                          }
                        }}
                        className="w-full py-4 md:py-5 bg-zinc-950 text-white rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-gold-500 transition-all shadow-xl italic"
                      >
                        Print Master Card
                     </button>
                  </div>

                  {/* Metadata Sidebar Archive */}
                  <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-stone-100 space-y-8 md:space-y-10 italic shadow-inner">
                     <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gold-600" />
                     </div>
                     <div className="space-y-8">
                        <div className="flex justify-between border-b pb-6 border-stone-200">
                           <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-none">Registry Entry</span>
                           <span className="text-xs font-black text-zinc-950 leading-none">{new Date(selectedVolunteer?.createdAt || '').toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b pb-6 border-stone-200">
                           <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-none">Security Gate</span>
                           <span className="text-xs font-black text-emerald-600 leading-none uppercase italic">VERIFIED_</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] leading-none">BG Consented</span>
                           <div className={cn("px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", selectedVolunteer?.agreeToBackgroundCheck ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm" : "bg-rose-50 text-rose-500 border-rose-100")}>
                              {selectedVolunteer?.agreeToBackgroundCheck ? 'AUTHORIZED' : 'PENDING'}
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
       )}
    </div>
  );
}