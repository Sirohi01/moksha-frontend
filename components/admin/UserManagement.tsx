'use client';

import { useState } from 'react';
import {
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Edit,
  Trash2,
  Eye,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin?: string;
  totalDonations: number;
  donationAmount: number;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 'USR-2024-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-03-11',
    totalDonations: 5,
    donationAmount: 25000,
  },
  {
    id: 'USR-2024-002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+91 87654 32109',
    role: 'user',
    status: 'active',
    joinDate: '2024-02-20',
    lastLogin: '2024-03-10',
    totalDonations: 3,
    donationAmount: 15000,
  },
  {
    id: 'USR-2024-003',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    role: 'moderator',
    status: 'inactive',
    joinDate: '2024-01-10',
    lastLogin: '2024-02-28',
    totalDonations: 1,
    donationAmount: 5000,
  },
];

const userStats = [
  {
    title: 'Total Users',
    value: '1,234',
    change: '+45',
    trend: 'up',
    icon: User,
    period: 'This month',
  },
  {
    title: 'Active Users',
    value: '987',
    change: '+32',
    trend: 'up',
    icon: User,
    period: 'Currently active',
  },
  {
    title: 'New Registrations',
    value: '45',
    change: '+12',
    trend: 'up',
    icon: UserPlus,
    period: 'This month',
  },
  {
    title: 'Total Donations',
    value: '₹5,67,890',
    change: '+₹45,000',
    trend: 'up',
    icon: Calendar,
    period: 'From users',
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    alert('User deleted successfully');
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-700 bg-red-100 dark:bg-red-900/20';
      case 'moderator':
        return 'text-blue-700 bg-blue-100 dark:bg-blue-900/20';
      case 'user':
        return 'text-green-700 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-700 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100 dark:bg-green-900/20';
      case 'inactive':
        return 'text-gray-700 bg-gray-100 dark:bg-gray-900/20';
      case 'suspended':
        return 'text-red-700 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-700 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <span>{stat.change}</span>
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

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredUsers.length} users
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Management
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Donations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        getRoleColor(user.role)
                      )}
                    >
                      <Shield className="w-3 h-3" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(user.status)
                      )}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div>₹{user.donationAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {user.totalDonations} donations
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
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