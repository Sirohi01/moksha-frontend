'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import {
  Users,
  UserPlus,
  Shield,
  Filter,
  Edit3,
  Power,
  ShieldCheck,
  Globe,
  Lock,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  allowedIPs: string[];
  department?: string;
  joiningDate: string;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    role: '',
    isActive: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminAPI.getUsers(currentPage, 10);
      setUsers(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      setError(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (response.ok) fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'super_admin': return 'from-rose-500/20 to-rose-600/20 text-rose-600 border-rose-200';
      case 'manager': return 'from-amber-500/20 to-amber-600/20 text-amber-600 border-amber-200';
      case 'technical_support': return 'from-blue-500/20 to-blue-600/20 text-blue-600 border-blue-200';
      case 'seo_team': return 'from-emerald-500/20 to-emerald-600/20 text-emerald-600 border-emerald-200';
      default: return 'from-slate-500/20 to-slate-600/20 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-gold-600/20 border-t-gold-600 rounded-full animate-spin mb-4 shadow-xl shadow-gold-100"></div>
        <p className="text-navy-700 font-bold uppercase text-[10px] tracking-widest italic animate-pulse text-center">Syncing Node Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white/90 rounded-[2.5rem] border border-navy-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Users size={180} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
              <ShieldCheck className="w-8 h-8 text-gold-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-navy-950 tracking-tighter uppercase italic italic">User Management</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-navy-700 font-black uppercase tracking-widest leading-none">Access Control Central</p>
              </div>
            </div>
          </div>
          <Link
            href="/admin/users/create"
            className="group flex items-center gap-4 px-8 py-5 bg-navy-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl active:scale-95 shadow-navy-200"
          >
            <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Establish New Node
          </Link>
        </div>
      </div>

      {/* Stats Counter (Micro) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Admins', val: users.length, icon: Shield },
          { label: 'Network Nodes', val: users.filter(u => u.isActive).length, icon: Globe },
          { label: 'Clearance Roles', val: new Set(users.map(u => u.role)).size, icon: Lock },
          { label: 'Support Tier', val: users.filter(u => u.role === 'technical_support').length, icon: Calendar }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 border border-navy-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-[20px] font-black text-navy-700 uppercase underline decoration-gold-600/50 underline-offset-4 mb-2">{stat.label}</p>
              <p className="text-xl font-black text-navy-950">{stat.val}</p>
            </div>
            <div className="p-2 bg-navy-50 rounded-xl text-navy-700">
              <stat.icon size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white/90 rounded-[2.5rem] border border-navy-50 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-navy-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-[11px] font-black text-navy-950 uppercase tracking-widest italic flex items-center gap-2">
            <Filter size={14} className="text-gold-600" />
            Active Directories
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fcfcfc] border-b border-navy-50">
              <tr>
                <th className="px-8 py-6 text-left text-[9px] font-black text-navy-700 uppercase tracking-widest italic">Node Identifier</th>
                <th className="px-8 py-6 text-left text-[9px] font-black text-navy-700 uppercase tracking-widest italic">Access Level</th>
                <th className="px-8 py-6 text-left text-[9px] font-black text-navy-700 uppercase tracking-widest italic">Clearance Status</th>
                <th className="px-8 py-6 text-right text-[9px] font-black text-navy-700 uppercase tracking-widest italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {users.map((user) => (
                <tr key={user._id} className="group hover:bg-gold-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-navy-950 rounded-2xl flex items-center justify-center text-gold-500 font-black text-lg shadow-xl shadow-navy-100 group-hover:scale-110 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-black text-navy-950 uppercase tracking-tight">{user.name}</div>
                        <div className="text-[9px] font-medium text-navy-700 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border bg-gradient-to-br",
                      getRoleStyle(user.role)
                    )}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", user.isActive ? "bg-emerald-500" : "bg-rose-500")}></div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        user.isActive ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {user.isActive ? 'Clearance Active' : 'Access Revoked'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/users/edit/${user._id}`}
                        className="p-3 bg-white border border-navy-50 text-navy-950 rounded-xl hover:bg-navy-950 hover:text-gold-500 transition-all shadow-sm active:scale-90"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <button
                        onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                        className={cn(
                          "p-3 rounded-xl transition-all shadow-sm active:scale-90 border",
                          user.isActive
                            ? "bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white"
                            : "bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                        )}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}