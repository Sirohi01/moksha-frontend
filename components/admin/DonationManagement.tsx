'use client';

import { useState } from 'react';
import {
  Search,
  Download,
  Receipt,
  Mail,
  TrendingUp,
  TrendingDown,
  Heart,
  CreditCard,
  Banknote,
  Smartphone,
  Globe,
  Eye,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  method: 'card' | 'upi' | 'netbanking' | 'cash' | 'cheque';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  campaign?: string;
  receiptSent: boolean;
  taxExemption: boolean;
  notes?: string;
  transactionId?: string;
}

// Mock donation data
const mockDonations: Donation[] = [
  {
    id: 'DON-2024-001',
    donorName: 'Rajesh Kumar',
    donorEmail: 'rajesh.kumar@email.com',
    amount: 5000,
    currency: 'INR',
    method: 'upi',
    status: 'completed',
    date: '2024-03-11T10:30:00Z',
    campaign: 'Emergency Services',
    receiptSent: true,
    taxExemption: true,
    transactionId: 'TXN123456789',
  },
  {
    id: 'DON-2024-002',
    donorName: 'Priya Sharma',
    donorEmail: 'priya.sharma@email.com',
    amount: 10000,
    currency: 'INR',
    method: 'card',
    status: 'completed',
    date: '2024-03-10T15:45:00Z',
    campaign: 'Adopt a City',
    receiptSent: true,
    taxExemption: true,
    transactionId: 'TXN123456790',
  },
  {
    id: 'DON-2024-003',
    donorName: 'Anonymous',
    donorEmail: 'anonymous@donor.com',
    amount: 2500,
    currency: 'INR',
    method: 'netbanking',
    status: 'completed',
    date: '2024-03-09T09:15:00Z',
    receiptSent: false,
    taxExemption: false,
    transactionId: 'TXN123456791',
  },
];

const donationStats = [
  {
    title: 'Total Donations',
    value: '₹2,45,678',
    change: '+12.5%',
    trend: 'up',
    icon: Heart,
    period: 'This month',
  },
  {
    title: 'Total Donors',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: Globe,
    period: 'This month',
  },
  {
    title: 'Average Donation',
    value: '₹3,456',
    change: '+5.1%',
    trend: 'up',
    icon: TrendingUp,
    period: 'This month',
  },
  {
    title: 'Pending Receipts',
    value: '23',
    change: '-15.3%',
    trend: 'down',
    icon: Receipt,
    period: 'This month',
  },
];

export default function DonationManagement() {
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSendReceipt = (donationId: string) => {
    setDonations((prev) =>
      prev.map((donation) =>
        donation.id === donationId ? { ...donation, receiptSent: true } : donation
      )
    );
    alert('Receipt sent successfully');
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return CreditCard;
      case 'upi':
        return Smartphone;
      case 'netbanking':
        return Globe;
      case 'cash':
        return Banknote;
      case 'cheque':
        return Receipt;
      default:
        return CreditCard;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-700 bg-red-100 dark:bg-red-900/20';
      case 'refunded':
        return 'text-purple-700 bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'text-gray-700 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const totalAmount = filteredDonations
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {donationStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.period}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredDonations.length} donations
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
            Total: ₹{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Donations
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Donation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDonations.map((donation) => {
                const MethodIcon = getMethodIcon(donation.method);

                return (
                  <tr
                    key={donation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {donation.id}
                      </div>
                      {donation.transactionId && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {donation.transactionId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {donation.donorName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {donation.donorEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        ₹{donation.amount.toLocaleString()}
                      </div>
                      {donation.campaign && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {donation.campaign}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MethodIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {donation.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(donation.status)
                        )}
                      >
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {donation.receiptSent ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Receipt className="w-3 h-3" />
                          Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendReceipt(donation.id)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Send className="w-3 h-3" />
                          Send
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}