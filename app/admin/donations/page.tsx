'use client';

import { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingSpinner, ActionButton, StatsCard } from '@/components/admin/AdminComponents';
import ReceiptModal from '@/components/ReceiptModal';

interface Donation {
  _id: string;
  donationId: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  donationType: string;
  purpose: string;
  receiptNumber: string;
  createdAt: string;
}

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    avgDonation: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    purpose: ''
  });

  useEffect(() => {
    fetchDonations();
  }, [currentPage, filters]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data.data);
        setTotalPages(data.pagination.pages);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewReceipt = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowReceiptModal(true);
  };

  const refundDonation = async (donationId: string) => {
    if (!confirm('Are you sure you want to process a refund for this donation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/${donationId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Refund processed successfully!');
        fetchDonations();
      } else {
        const error = await response.json();
        alert(`Failed to process refund: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to process refund:', error);
      alert('Failed to process refund. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading donations..." />;
  }

  const columns = [
    {
      key: 'donation',
      label: 'Donation Details',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{donation.donationId}</div>
          <div className="text-sm text-gray-500">Receipt: {donation.receiptNumber}</div>
          <div className="text-sm text-gray-500">{new Date(donation.createdAt).toLocaleDateString('en-IN')}</div>
        </div>
      )
    },
    {
      key: 'donor',
      label: 'Donor Information',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{donation.name}</div>
          <div className="text-sm text-gray-500">{donation.email}</div>
          <div className="text-sm text-gray-500">{donation.phone}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount & Payment',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-sm font-medium text-gray-900">₹{donation.amount.toLocaleString('en-IN')}</div>
          <div className="text-sm text-gray-500">{donation.paymentMethod.toUpperCase()}</div>
        </div>
      )
    },
    {
      key: 'purpose',
      label: 'Purpose & Type',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-sm text-gray-900">{donation.purpose.replace('_', ' ').toUpperCase()}</div>
          <div className="text-sm text-gray-500">{donation.donationType.replace('_', ' ').toUpperCase()}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, donation: Donation) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.paymentStatus)}`}>
          {donation.paymentStatus}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, donation: Donation) => (
        <div className="flex space-x-2">
          <ActionButton
            onClick={() => viewReceipt(donation)}
            variant="primary"
            size="sm"
          >
            View Receipt
          </ActionButton>
          <ActionButton
            onClick={() => viewReceipt(donation)}
            variant="success"
            size="sm"
          >
            Print
          </ActionButton>
          {donation.paymentStatus === 'completed' && (
            <ActionButton
              onClick={() => refundDonation(donation._id)}
              variant="danger"
              size="sm"
            >
              Refund
            </ActionButton>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="Donations Management" 
        description="Track and manage donations"
        icon="💰"
      >
        <ActionButton 
          onClick={fetchDonations}
          variant="secondary"
          icon="🔄"
        >
          Refresh
        </ActionButton>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Amount"
          value={`₹${stats.totalAmount.toLocaleString('en-IN')}`}
          icon="💰"
          gradient="from-green-500 to-emerald-600"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Total Donations"
          value={stats.totalDonations}
          icon="📊"
          gradient="from-blue-500 to-blue-600"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Average Donation"
          value={`₹${Math.round(stats.avgDonation).toLocaleString('en-IN')}`}
          icon="📈"
          gradient="from-purple-500 to-purple-600"
          change="+5%"
          changeType="positive"
        />
      </div>

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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Types</option>
              <option value="one_time">One Time</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
            <select
              value={filters.purpose}
              onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Purposes</option>
              <option value="general">General</option>
              <option value="cremation_services">Cremation Services</option>
              <option value="volunteer_support">Volunteer Support</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="emergency_fund">Emergency Fund</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <DataTable 
        columns={columns}
        data={donations}
        loading={loading}
        emptyMessage="No donations found"
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

      {/* Receipt Modal */}
      {selectedDonation && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false);
            setSelectedDonation(null);
          }}
          donation={selectedDonation}
        />
      )}
    </div>
  );
}