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

import { CreditCard, RotateCcw, TrendingUp, BarChart3, Wallet } from 'lucide-react';

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
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-rose-100 text-rose-800';
      case 'refunded':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
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
    return <LoadingSpinner size="lg" message="Reading ledger data..." />;
  }

  const columns = [
    {
      key: 'donation',
      label: 'TRANSACTION ID',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-xs font-black text-navy-950 uppercase tracking-tight">{donation.donationId}</div>
          <div className="text-[9px] text-navy-700 font-black uppercase tracking-widest mt-1 italic">RCPT: {donation.receiptNumber}</div>
        </div>
      )
    },
    {
      key: 'donor',
      label: 'BENEFACTOR',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-xs font-black text-navy-950 uppercase tracking-tight">{donation.name}</div>
          <div className="text-[9px] text-navy-700 font-black uppercase tracking-widest mt-1">{donation.email}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'CAPITAL FLUX',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-xs font-black text-navy-950">₹{donation.amount.toLocaleString('en-IN')}</div>
          <div className="text-[9px] text-gold-600 font-black uppercase tracking-[0.2em] mt-1 italic">{donation.paymentMethod.toUpperCase()}</div>
        </div>
      )
    },
    {
      key: 'purpose',
      label: 'ALLOCATION',
      render: (_value: any, donation: Donation) => (
        <div>
          <div className="text-[9px] font-black text-navy-950 uppercase tracking-widest">{donation.purpose.replace('_', ' ')}</div>
          <div className="text-[8px] text-navy-700 font-black uppercase mt-1 italic">{donation.donationType.replace('_', ' ')}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'VERIFICATION',
      render: (_value: any, donation: Donation) => (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusColor(donation.paymentStatus)}`}>
          {donation.paymentStatus}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'OPERATIONS',
      render: (_value: any, donation: Donation) => (
        <div className="flex gap-2">
          <ActionButton onClick={() => viewReceipt(donation)} size="sm">
            RECEIPT
          </ActionButton>
          {donation.paymentStatus === 'completed' && (
            <ActionButton
              onClick={() => refundDonation(donation._id)}
              variant="danger"
              size="sm"
            >
              REFUND
            </ActionButton>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-[1700px] mx-auto">
      <PageHeader
        title="Financial Ledger"
        description="Monitor global contributions, benefactor transactions, and resource allocations."
        icon={<Wallet className="w-8 h-8" />}
      >
        <ActionButton
          onClick={fetchDonations}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Re-Sync
        </ActionButton>
      </PageHeader>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard
          title="Gross Accumulation"
          value={`₹${stats.totalAmount.toLocaleString('en-IN')}`}
          icon={<CreditCard />}
          change="+12.4%"
          changeType="positive"
        />
        <StatsCard
          title="Transaction Volume"
          value={stats.totalDonations}
          icon={<BarChart3 />}
          change="+8.2%"
          changeType="positive"
        />
        <StatsCard
          title="Mean Contribution"
          value={`₹${Math.round(stats.avgDonation).toLocaleString('en-IN')}`}
          icon={<TrendingUp />}
          change="+5.1%"
          changeType="positive"
        />
      </div>

      {/* Ledger Filters */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-navy-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy-700 ml-2">Audit Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full h-14 px-8 bg-navy-50/50 border border-navy-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">ALL STATUS</option>
              <option value="completed">COMPLETED</option>
              <option value="pending">PENDING</option>
              <option value="failed">FAILED</option>
              <option value="refunded">REFUNDED</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy-700 ml-2">Contribution Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full h-14 px-8 bg-navy-50/50 border border-navy-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">ALL TYPES</option>
              <option value="one_time">ONE TIME</option>
              <option value="monthly">MONTHLY</option>
              <option value="yearly">YEARLY</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy-700 ml-2">Resource Endpoint</label>
            <select
              value={filters.purpose}
              onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
              className="w-full h-14 px-8 bg-navy-50/50 border border-navy-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy-950 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">ALL ENDPOINTS</option>
              <option value="general">GENERAL</option>
              <option value="cremation_services">CREMATION SERVICES</option>
              <option value="volunteer_support">VOLUNTEER SUPPORT</option>
              <option value="infrastructure">INFRASTRUCTURE</option>
              <option value="emergency_fund">EMERGENCY FUND</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={donations}
        loading={loading}
        emptyMessage="NO FINANCIAL DATA DETECTED IN CURRENT SECTOR"
        pagination={{
          currentPage: currentPage,
          totalPages: totalPages
        }}
        onPageChange={setCurrentPage}
      />

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