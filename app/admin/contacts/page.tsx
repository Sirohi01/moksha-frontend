'use client';

import { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingSpinner, ActionButton } from '@/components/admin/AdminComponents';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
  status: string;
  createdAt: string;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    inquiryType: '',
    search: ''
  });

  useEffect(() => {
    fetchContacts();
  }, [currentPage, filters]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.data);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchContacts();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInquiryTypeIcon = (type: string) => {
    switch (type) {
      case 'general': return '💬';
      case 'support': return '🛠️';
      case 'partnership': return '🤝';
      case 'media': return '📰';
      case 'volunteer': return '🙋';
      case 'donation': return '💰';
      default: return '📧';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading contacts..." />;
  }

  const columns = [
    {
      key: 'contact',
      label: 'Contact Details',
      render: (_value: any, contact: Contact) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
          <div className="text-sm text-gray-500">{contact.email}</div>
          <div className="text-sm text-gray-500">{contact.phone}</div>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject & Type',
      render: (_value: any, contact: Contact) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{contact.subject}</div>
          <div className="flex items-center mt-1">
            <span className="mr-2">{getInquiryTypeIcon(contact.inquiryType)}</span>
            <span className="text-sm text-gray-500 capitalize">{contact.inquiryType}</span>
          </div>
        </div>
      )
    },
    {
      key: 'message',
      label: 'Message',
      render: (_value: any, contact: Contact) => (
        <div className="text-sm text-gray-500 max-w-xs">
          <div className="truncate" title={contact.message}>{contact.message}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, contact: Contact) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
          {contact.status.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (_value: any, contact: Contact) => (
        <div className="text-sm text-gray-500">
          {new Date(contact.createdAt).toLocaleDateString('en-IN')}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, contact: Contact) => (
        <div className="flex space-x-2">
          <select
            value={contact.status}
            onChange={(e) => updateStatus(contact._id, e.target.value)}
            className="text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Reply via Email"
          >
            📧
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="Contact Management" 
        description="Manage contact inquiries and support requests"
        icon="📞"
      >
        <ActionButton 
          onClick={fetchContacts}
          variant="secondary"
          icon="🔄"
        >
          Refresh
        </ActionButton>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
            <select
              value={filters.inquiryType}
              onChange={(e) => setFilters({ ...filters, inquiryType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Types</option>
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership</option>
              <option value="media">Media</option>
              <option value="volunteer">Volunteer</option>
              <option value="donation">Donation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name or email..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <DataTable 
        columns={columns}
        data={contacts}
        loading={loading}
        emptyMessage="No contacts found"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex space-x-2">
              <ActionButton
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="secondary"
                size="sm"
              >
                Previous
              </ActionButton>
              <ActionButton
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="secondary"
                size="sm"
              >
                Next
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}