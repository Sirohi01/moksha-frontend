'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactsAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  city?: string;
  state?: string;
  role: string;
  source: string;
  status?: string;
}

interface WALog {
  _id: string;
  recipient: string;
  content: string;
  status: string;
  createdAt: string;
  errorMessage?: string;
}

export default function WhatsAppHub() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [logs, setLogs] = useState<WALog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'directory' | 'logs'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selection
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, debouncedSearch, roleFilter, cityFilter, startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'directory') {
        const res = await contactsAPI.getAll({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          role: roleFilter,
          city: cityFilter
        });
        setContacts(res.data || []);
        setTotalItems(res.total || 0);
        setTotalPages(res.pages || 0);
      } else {
        const res = await contactsAPI.getWAHubLogs({ 
          page: currentPage, 
          limit: itemsPerPage,
          startDate,
          endDate,
          search: debouncedSearch
        });
        setLogs(res.data || []);
        const total = res.pagination?.total || 0;
        setTotalPages(res.pagination?.pages || Math.ceil(total / itemsPerPage) || 1);
      }
    } catch (err: any) {
      toast.error('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToHistory = (phone: string) => {
    router.push(`/admin/whatsapp-hub/history/${phone}`);
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length && contacts.length > 0) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts);
    }
  };

  const toggleSelect = (contact: any) => {
    const exists = selectedContacts.find(c => c.id === contact.id);
    if (exists) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleBroadcastRedirect = () => {
    if (selectedContacts.length === 0) return toast.error('Select recipients first');
    localStorage.setItem('wa_broadcast_recipients', JSON.stringify(selectedContacts));
    router.push('/admin/whatsapp-hub/composer');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 text-gray-900 space-y-6 font-sans relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black">
            WhatsApp <span className="text-emerald-600 italic">Hub</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1.5 uppercase tracking-widest">
            {activeTab === 'directory' ? 'Unified Contact Directory' : 'Transmission Logs'}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => { setActiveTab('directory'); setCurrentPage(1); }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'directory' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => { setActiveTab('logs'); setCurrentPage(1); }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'logs' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
            }`}
          >
            Logs
          </button>
        </div>
      </div>

      {/* Directory View */}
      {activeTab === 'directory' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Search name, phone or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 font-medium shadow-sm"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest text-gray-700 shadow-sm outline-none appearance-none cursor-pointer"
            >
              <option value="all">ALL ROLES</option>
              <option value="admin">ADMINS</option>
              <option value="volunteer">VOLUNTEERS</option>
              <option value="reporter">REPORTERS</option>
              <option value="subscriber">SUBSCRIBERS</option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest text-gray-700 shadow-sm outline-none appearance-none cursor-pointer"
            >
              <option value="">ALL CITIES</option>
              <option value="Bangalore">BANGALORE</option>
              <option value="Mumbai">MUMBAI</option>
              <option value="Delhi">DELHI</option>
              <option value="Chennai">CHENNAI</option>
            </select>

            <button
              onClick={handleBroadcastRedirect}
              disabled={selectedContacts.length === 0}
              className="bg-black hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-white font-bold uppercase tracking-widest px-6 py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-xl"
            >
              <span>BROADCAST</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black">{selectedContacts.length}</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/40">
                    <th className="p-6 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.length === contacts.length && contacts.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4.5 h-4.5 cursor-pointer"
                      />
                    </th>
                    <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Identity</th>
                    <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Contact</th>
                    <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Classification</th>
                    <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Origin</th>
                    <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-24 text-center text-gray-300 font-medium italic animate-pulse">
                        SCANNING SECURE CONTACT DIRECTORY...
                      </td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-24 text-center text-gray-300 font-medium font-sans">
                        NO CONTACTS MATCHING CURRENT FILTERS
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact: any) => (
                      <tr 
                        key={contact.id} 
                        className={`hover:bg-gray-50/80 transition-all group ${selectedContacts.find(c => c.id === contact.id) ? 'bg-emerald-50/40' : ''}`}
                      >
                        <td className="p-5 text-center">
                          <input
                            type="checkbox"
                            checked={!!selectedContacts.find(c => c.id === contact.id)}
                            onChange={() => toggleSelect(contact)}
                            className="rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4.5 h-4.5 cursor-pointer transition-all"
                          />
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[15px] tracking-tight group-hover:text-emerald-700 transition-colors text-black font-sans leading-none">{contact.name}</span>
                            <span className="text-[11px] text-gray-500 font-medium mt-1.5 uppercase tracking-wider">{contact.city || 'NATIONAL'}, {contact.state || 'INDIA'}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-gray-900 tracking-tight">+{contact.phone}</span>
                            <span className="text-[11px] text-gray-400 font-medium mt-1 lowercase truncate max-w-[180px]">{contact.email || 'no-email@foundation.org'}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.05em] border ${
                            contact.role === 'super_admin' ? 'border-red-100 text-red-600 bg-red-50/50' :
                            contact.role === 'admin' ? 'border-amber-100 text-amber-600 bg-amber-50/50' :
                            contact.role === 'volunteer' ? 'border-emerald-100 text-emerald-600 bg-emerald-50/50' :
                            'border-gray-200 text-gray-600 bg-gray-50/50'
                          }`}>
                            {contact.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{contact.source}</span>
                        </td>
                        <td className="p-5">
                          <button 
                            onClick={() => navigateToHistory(contact.phone)}
                            className="p-2.5 bg-white border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm rounded-xl transition-all group/btn text-gray-400"
                            title="View Interaction Archives"
                          >
                            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Showing <span className="text-black">{contacts.length}</span> of <span className="text-black">{totalItems}</span> nodes
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all text-xs font-bold uppercase"
                  >
                    Previous
                  </button>
                  <p className="px-4 text-xs font-black uppercase text-gray-400">Page {currentPage} of {totalPages}</p>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all text-xs font-bold uppercase"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs View */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Date Filtering Controls */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mission Start</label>
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                   className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold uppercase tracking-wider outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mission End</label>
                 <input 
                   type="date" 
                   value={endDate}
                   onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                   className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold uppercase tracking-wider outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                 />
               </div>
            </div>
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); setCurrentPage(1); }}
              className="px-6 py-3.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl self-end mb-1 md:mb-0"
            >
              Reset Archive Filter
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/40">
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">TIMESTAMP</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">RECIPIENT</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">PAYLOAD CONTENT</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={4} className="p-24 text-center animate-pulse italic text-gray-300 font-medium">FETCHING CLOUD LOGS...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={4} className="p-24 text-center italic text-gray-300 font-medium">NO RECENT COMMUNICATIONS RECORDED</td></tr>
                ) : logs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-gray-50/50 transition-all font-sans">
                    <td className="p-5 text-[11px] font-semibold text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-5 text-sm font-bold text-emerald-700">+{log.recipient}</td>
                    <td className="p-5 text-[13px] text-gray-600 max-w-sm truncate font-medium">"{log.content}"</td>
                    <td className="p-5">
                      <span className={`px-2.5 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-[0.1em] border ${
                        log.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                        log.status === 'pending' ? 'bg-orange-50 text-orange-800 border-orange-100' :
                        'bg-red-50 text-red-800 border-red-100'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination for Logs */}
          {totalPages > 1 && (
              <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Displaying latest transmissions
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all text-xs font-bold uppercase"
                  >
                    Previous
                  </button>
                  <p className="px-4 text-xs font-black uppercase text-gray-400">Page {currentPage} of {totalPages}</p>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all text-xs font-bold uppercase"
                  >
                    Next
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
    )}

    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `}</style>
  </div>
);
}
