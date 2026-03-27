'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCcw, 
  Eye, 
  MoreVertical,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  X,
  Calendar,
  Phone,
  Mail,
  Activity,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Report {
  _id: string;
  caseNumber: string;
  reportType?: string;
  reporterName?: string;
  reporterPhone: string;
  reporterEmail?: string;
  reporterAddress?: string;
  reporterRelation?: string;
  exactLocation: string;
  landmark?: string;
  area: string;
  city: string;
  state: string;
  pincode?: string;
  locationType: string;
  gpsCoordinates?: string;
  dateFound: string;
  timeFound: string;
  approximateDeathTime?: string;
  gender: string;
  approximateAge?: string;
  bodyCondition: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  notes?: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [currentPage, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/reports?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        throw new Error('Failed to fetch reports');
      }
    } catch (error: any) {
      console.error('Failed to fetch reports:', error);
      setError(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setReports(reports.map(report =>
          report._id === reportId
            ? { ...report, status: newStatus as Report['status'] }
            : report
        ));

        // Close modal if open
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport({ ...selectedReport, status: newStatus as Report['status'] });
        }
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error: any) {
      console.error('Failed to update report status:', error);
      alert('Failed to update status: ' + error.message);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock3, label: 'PENDING VERIFICATION' };
      case 'in_progress': return { color: 'text-sky-500', bg: 'bg-sky-500/10', icon: Activity, label: 'ACTIVE RESPONSE' };
      case 'resolved': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'TASK RESOLVED' };
      case 'closed': return { color: 'text-navy-400', bg: 'bg-navy-400/10', icon: ShieldCheck, label: 'CASE CLOSED' };
      default: return { color: 'text-zinc-400', bg: 'bg-zinc-500/10', icon: Clock3, label: 'UNKNOWN' };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low': return { color: 'text-zinc-400', bg: 'bg-zinc-500/10' };
      case 'medium': return { color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'high': return { color: 'text-orange-500', bg: 'bg-orange-500/10' };
      case 'urgent': return { color: 'text-rose-500', bg: 'bg-rose-500/10' };
      default: return { color: 'text-zinc-400', bg: 'bg-zinc-500/10' };
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {selectedReport ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Detail View Header */}
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-600/20 to-navy-600/20 rounded-[2rem] blur-xl opacity-50"></div>
            <div className="relative bg-white border border-navy-50 rounded-[2rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-navy-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedReport(null)}
                      className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center hover:bg-navy-950 hover:text-gold-500 transition-all shadow-sm group/back"
                    >
                      <X className="w-5 h-5 group-hover/back:rotate-90 transition-transform" />
                    </button>
                    <div className="h-px w-8 bg-navy-100"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-400">Response Terminal / Case Intelligence</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-navy-950 uppercase tracking-tighter italic leading-none">
                    Incident #<span className="text-gold-600">{selectedReport.caseNumber}</span>
                  </h1>
                  <p className="text-navy-600 font-medium max-w-xl">
                    Operational command for case {selectedReport.caseNumber}. Currently in {selectedReport.status.replace('_', ' ')} phase.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={selectedReport.status}
                    onChange={(e) => handleStatusUpdate(selectedReport._id, e.target.value)}
                    className="px-8 py-5 bg-navy-950 text-gold-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl focus:ring-2 focus:ring-gold-500/50 appearance-none cursor-pointer outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="px-8 py-5 bg-white border border-navy-100 text-navy-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-navy-50 transition-all"
                  >
                    Back to Grid
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detail View Content */}
          <div className="bg-white border border-navy-50 rounded-[3rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
            
            <div className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Visual Metadata Section */}
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <MapPin className="w-4 h-4" />
                      Critical Coordinates
                    </h3>
                    <div className="p-8 bg-navy-50/50 rounded-[2rem] border border-navy-100 flex items-start gap-6">
                      <div className="p-4 rounded-2xl bg-white shadow-xl text-gold-600">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-black text-navy-950 uppercase">{selectedReport.exactLocation}</p>
                        <p className="text-xs font-medium text-navy-500 uppercase tracking-widest leading-relaxed">
                          {selectedReport.area}, {selectedReport.city}, {selectedReport.state} - {selectedReport.pincode}
                        </p>
                        {selectedReport.landmark && (
                          <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-navy-400 uppercase tracking-widest">
                            <ChevronRight className="w-3 h-3 text-gold-500" />
                            Ref: {selectedReport.landmark}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <User className="w-4 h-4" />
                      Constituent Registry
                    </h3>
                    <div className="p-8 bg-navy-50/50 rounded-[2rem] border border-navy-100 space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center font-black text-xl text-gold-600">
                          {selectedReport.reporterName?.[0] || 'A'}
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-navy-950 uppercase tracking-tight">{selectedReport.reporterName || 'Anonymous Constituent'}</p>
                          <p className="text-xs font-medium text-navy-400 uppercase tracking-widest">{selectedReport.reporterRelation || 'Primary Reporter'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-navy-100/50">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-navy-300 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gold-500" />
                            Transmission
                          </p>
                          <p className="text-xs font-black text-navy-950">{selectedReport.reporterPhone}</p>
                        </div>
                        {selectedReport.reporterEmail && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-navy-300 uppercase tracking-widest flex items-center gap-2">
                              <Mail className="w-3 h-3 text-gold-500" />
                              Correspondence
                            </p>
                            <p className="text-xs font-black text-navy-950 truncate">{selectedReport.reporterEmail}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tactical Status Section */}
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Activity className="w-4 h-4" />
                      Biological Diagnostics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Identified Gender', value: selectedReport.gender, icon: ShieldCheck },
                        { label: 'Approximate Age', value: selectedReport.approximateAge || 'Undetermined', icon: User },
                        { label: 'Body Condition', value: selectedReport.bodyCondition, icon: Activity },
                        { label: 'Response Urgency', value: selectedReport.priority, icon: AlertTriangle, color: 'text-rose-500' }
                      ].map((item, i) => (
                        <div key={i} className="p-6 bg-navy-50/50 rounded-2xl border border-navy-100 space-y-2 group hover:border-gold-500/20 transition-all">
                          <item.icon className={cn("w-4 h-4 text-navy-300 group-hover:text-gold-500 transition-colors", item.color)} />
                          <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest">{item.label}</p>
                          <p className="text-xs font-black text-navy-950 uppercase">{item.value.replace('_', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Calendar className="w-4 h-4" />
                      Chronological Log
                    </h3>
                    <div className="p-8 bg-navy-950 border border-gold-900/20 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="flex justify-between items-start pt-2">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-gold-500 uppercase tracking-widest">Entry Date</p>
                          <p className="text-white text-xl font-black uppercase tracking-tight italic">
                            {new Date(selectedReport.dateFound).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            SEQUENCE: {selectedReport.timeFound}
                          </p>
                        </div>
                      </div>
                      <div className="h-px w-full bg-white/5"></div>
                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Incident Logline</p>
                        <p className="text-xs font-medium text-white/70 leading-relaxed italic">
                          "{selectedReport.description || 'No detailed tactical description established for this entry sequence.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* View Action Bar */}
            <div className="px-12 py-10 bg-navy-50/30 border-t border-navy-50 flex justify-end items-center gap-6">
              <span className="text-[10px] font-black text-navy-300 uppercase tracking-[0.3em]">Operational Authority: Administrator</span>
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-10 py-5 bg-navy-950 text-gold-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-gold-600 hover:text-white transition-all duration-500"
              >
                Return to Operational Grid
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Premium Header Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-600/20 to-navy-600/20 rounded-[2rem] blur-xl opacity-50"></div>
            <div className="relative bg-white border border-navy-50 rounded-[2rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-navy-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-navy-950 flex items-center justify-center shadow-xl">
                      <FileText className="w-6 h-6 text-gold-500" />
                    </div>
                    <div className="h-px w-8 bg-navy-100"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-400">Response Terminal</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-navy-950 uppercase tracking-tighter italic leading-none">
                    Incident <span className="text-gold-600">Operations</span>
                  </h1>
                  <p className="text-navy-600 font-medium max-w-xl">
                    Dispatch and manage critical response units. Synchronizing humanitarian efforts across the global grid.
                  </p>
                </div>
                
                <button 
                  onClick={fetchReports}
                  className="group relative px-8 py-5 bg-navy-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gold-600 transition-all duration-500 flex items-center gap-4"
                >
                  <RefreshCcw className="w-4 h-4 text-gold-500 group-hover:rotate-180 transition-transform duration-700" />
                  Sync Base
                </button>
              </div>
            </div>
          </div>

          {/* Intelligence Filters */}
          <div className="bg-white border border-navy-50 p-6 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input
                type="text"
                placeholder="FILTER INCIDENTS BY CASE ID OR LOCATION..."
                className="w-full pl-14 pr-6 py-4 bg-navy-50/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 placeholder-navy-300 focus:ring-2 focus:ring-gold-500/20 transition-all"
              />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative group min-w-[200px]">
                <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-14 pr-10 py-4 bg-navy-50/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-navy-950 focus:ring-2 focus:ring-gold-500/20 appearance-none pointer-events-auto cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Operations Log Table */}
          <div className="bg-white border border-navy-50 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-navy-950 border-b border-navy-900">
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/70">Operation Details</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/70">Grid Location</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/70">Constituent</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/70">Priority</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/70">Condition</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {reports.map((report) => {
                    const status = getStatusConfig(report.status);
                    const priority = getPriorityConfig(report.priority);
                    
                    return (
                      <tr key={report._id} className="group hover:bg-navy-50/30 transition-colors duration-300">
                        <td className="px-8 py-8">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-navy-950 uppercase tracking-widest italic flex items-center gap-2">
                                <Activity className="w-3 h-3 text-gold-600" />
                                Case #{report.caseNumber}
                              </span>
                              <span className={cn("px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase", status.bg, status.color)}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-navy-400 text-[10px] font-medium uppercase tracking-widest flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              Logged: {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-8 py-8">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-navy-50 text-navy-400 group-hover:bg-white group-hover:text-gold-600 transition-all">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-black text-navy-950 uppercase">{report.city}, {report.state}</p>
                              <p className="text-[10px] font-medium text-navy-400 uppercase tracking-widest">{report.area}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 font-black text-[10px]">
                              {report.reporterName?.[0] || 'A'}
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-black text-navy-950 uppercase">{report.reporterName || 'Anonymous'}</p>
                              <p className="text-[10px] font-medium text-navy-400">{report.reporterPhone}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-8">
                          <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest", priority.bg, priority.color, "border-current/10")}>
                            <AlertTriangle className="w-3 h-3" />
                            {report.priority}
                          </div>
                        </td>

                        <td className="px-8 py-8">
                          <span className="text-[10px] font-black text-navy-950 uppercase tracking-widest opacity-60">
                            {report.bodyCondition.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="px-8 py-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => setSelectedReport(report)}
                              className="p-3 rounded-xl bg-navy-50 text-navy-400 hover:bg-navy-950 hover:text-gold-500 transition-all shadow-sm"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <select
                              value={report.status}
                              onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                              className="px-4 py-3 bg-navy-50 border-none rounded-xl text-[9px] font-black uppercase tracking-widest text-navy-950 focus:ring-2 focus:ring-gold-500/20 appearance-none min-w-[140px] cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {reports.length === 0 && !loading && (
              <div className="py-32 text-center space-y-6">
                <div className="w-24 h-24 bg-navy-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                  <ShieldCheck className="w-12 h-12 text-navy-200" />
                </div>
                <h3 className="text-2xl font-black text-navy-950 uppercase tracking-tighter italic">No Active Incidents</h3>
                <p className="text-navy-400 font-medium max-w-sm mx-auto text-sm italic">The humanitarian response grid is currently clear of reported incidents.</p>
              </div>
            )}
          </div>

          {/* Pagination Command */}
          {totalPages > 1 && (
            <div className="bg-white border border-navy-50 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-navy-300 uppercase tracking-widest">Base Operations Ledger</p>
                <p className="text-xs font-black text-navy-950">GRID PAGE {currentPage} OF {totalPages}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-8 py-4 bg-navy-50 text-navy-950 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-navy-950 hover:text-gold-500 disabled:opacity-20 transition-all border border-navy-100/50"
                >
                  PREVIOUS
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-8 py-4 bg-navy-950 text-gold-500 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gold-600 hover:text-white disabled:opacity-20 transition-all"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}