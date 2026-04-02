'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, Search, Download, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Pagination } from '@/components/admin/AdminComponents';

interface Subscriber {
  _id: string;
  email: string;
  status: string;
  subscribedAt: string;
  source: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchSubscribers();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchQuery
      });

      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribers?${query.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data);
        setTotalPages(data.pagination.pages);
        setTotalItems(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">Total Subscribers</p>
            <h3 className="text-3xl font-black text-stone-900">{totalItems}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
            <Users size={28} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">Registry Coverage</p>
            <h3 className="text-3xl font-black text-stone-900">Standard</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
            <TrendingUp size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">Active Rate</p>
            <h3 className="text-3xl font-black text-stone-900">100%</h3>
          </div>
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
            <Mail size={28} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="p-8 border-b border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-stone-50/50 backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tighter">Subscriber Directory</h2>
            <p className="text-stone-500 text-sm font-medium uppercase tracking-widest text-[10px]">Manage and export your newsletter audience</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search emails..." 
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
            <button className="flex items-center gap-2 px-6 h-12 bg-stone-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg active:scale-95">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Email Address</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Signed Up</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-stone-400 uppercase tracking-widest">Source</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-stone-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-4 bg-stone-100 rounded-full w-48"></div></td>
                    <td className="px-8 py-6"><div className="h-6 bg-stone-100 rounded-full w-20"></div></td>
                    <td className="px-8 py-6"><div className="h-4 bg-stone-100 rounded-full w-32"></div></td>
                    <td className="px-8 py-6"><div className="h-4 bg-stone-100 rounded-full w-24"></div></td>
                    <td className="px-8 py-6"><div className="h-8 bg-stone-100 rounded-lg w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : subscribers.length > 0 ? (
                subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black shadow-inner">
                          {subscriber.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-stone-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        subscriber.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-stone-50 text-stone-500 border border-stone-100'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-semibold text-stone-500">
                        {new Date(subscriber.subscribedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-lg">
                        {subscriber.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95 group/btn">
                        <Trash2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                        <Mail size={32} />
                      </div>
                      <h4 className="text-lg font-black text-stone-900 uppercase tracking-tight">No Subscribers Found</h4>
                      <p className="text-stone-400 text-xs font-medium uppercase tracking-widest mt-2 leading-relaxed">
                        No one has subscribed to your newsletter yet or matches your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {subscribers.length > 0 && (
        <div className="mt-8">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            total={totalItems}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
