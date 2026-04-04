'use client';

import { useState, useEffect } from 'react';
import { formsAPI } from '@/lib/api';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  experienceRating: number;
  feedbackType: string;
  serviceUsed?: string;
  suggestions?: string;
  wouldRecommend: string;
  consentToPublish: boolean;
  status: string;
  priority: string;
  tags: string[];
  isPublic: boolean;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackManagement() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    rating: '',
    search: ''
  });

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await formsAPI.getFeedback(currentPage, 10, {
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { feedbackType: filters.category }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.search && { search: filters.search })
      });

      if (response && response.success) {
        setFeedback(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      }
    } catch (error: any) {
      console.error('Failed to fetch feedback:', error);
      setError(error.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await formsAPI.updateFeedbackStatus(id, { status });
      if (response && response.success) {
        fetchFeedback();
      }
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert('Failed to update status: ' + error.message);
    }
  };

  const updatePublicStatus = async (id: string, isPublic: boolean) => {
    try {
      const response = await formsAPI.updateFeedbackStatus(id, { isPublic });
      if (response && response.success) {
        fetchFeedback();
      }
    } catch (error: any) {
      console.error('Failed to update visibility:', error);
      alert('Failed to update visibility: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Feedback</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchFeedback}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-[2rem] shadow-sm p-10 border border-navy-50">
        <h1 className="text-3xl font-black text-navy-950 uppercase italic tracking-tighter mb-2">Testimonials Management</h1>
        <p className="text-sm font-bold text-navy-700 uppercase tracking-widest">Review user feedback and publish them to the live Testimonials page</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-navy-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-black text-navy-950 uppercase tracking-widest mb-3">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-3 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-navy-50/30 text-xs font-bold uppercase"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-navy-950 uppercase tracking-widest mb-3">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-3 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-navy-50/30 text-xs font-bold uppercase"
            >
              <option value="">All Categories</option>
              <option value="service_experience">Service Experience</option>
              <option value="website">Website</option>
              <option value="volunteer">Volunteer</option>
              <option value="donation">Donation</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="appreciation">Appreciation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-navy-950 uppercase tracking-widest mb-3">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full px-4 py-3 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-navy-50/30 text-xs font-bold uppercase"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-navy-950 uppercase tracking-widest mb-3">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search data..."
              className="w-full px-4 py-3 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-navy-50/30 text-xs font-bold uppercase"
            />
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-navy-50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-navy-950">
                <th className="px-8 py-6 text-left text-[12px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5">
                  User Details
                </th>
                <th className="px-8 py-6 text-left text-[12px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5">
                  Subject & Category
                </th>
                <th className="px-8 py-6 text-left text-[12px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5">
                  Rating
                </th>
                <th className="px-8 py-6 text-left text-[12px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5">
                  Status
                </th>
                <th className="px-8 py-6 text-left text-[12px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5">
                  Date
                </th>
                <th className="px-8 py-6 text-left text-[12px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5">
                  Public?
                </th>
                <th className="px-8 py-6 text-left text-[12px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {feedback.map((item) => (
                <tr key={item._id} className="hover:bg-navy-50/50 transition-all duration-300 group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div>
                      <div className="text-[13px] font-black text-navy-950 uppercase tracking-tight">{item.name}</div>
                      <div className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">{item.email}</div>
                      <div className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">{item.phone}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <div className="text-[13px] font-black text-navy-950 uppercase tracking-tight">{item.subject}</div>
                      <div className="text-[11px] font-bold text-gold-600 uppercase tracking-widest">{item.feedbackType}</div>
                      <div className="text-[12px] font-medium text-navy-700 mt-2 max-w-xs truncate italic">
                        "{item.message}"
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm">
                      {getRatingStars(item.experienceRating)}
                    </div>
                    <div className="text-[10px] font-black text-navy-400 uppercase mt-1">{item.experienceRating} / 5.0</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-[12px] font-bold text-navy-600 uppercase">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <button
                      onClick={() => updatePublicStatus(item._id, !item.isPublic)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.isPublic ? 'bg-emerald-500' : 'bg-navy-100'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.isPublic ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                    <span className="ml-3 text-[10px] font-black text-navy-500 uppercase tracking-widest">{item.isPublic ? 'Published' : 'Private'}</span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item._id, e.target.value)}
                      className="text-[11px] font-black uppercase tracking-widest px-3 py-2 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}