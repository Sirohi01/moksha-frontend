'use client';

import { useState } from 'react';
import {
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  UserCheck,
  UserX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  skills: string[];
  availability: string;
  experience: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  appliedDate: string;
  approvedDate?: string;
  lastActivity?: string;
  hoursContributed: number;
  tasksCompleted: number;
}

// Mock volunteer data
const mockVolunteers: Volunteer[] = [
  {
    id: 'VOL-2024-001',
    name: 'Amit Sharma',
    email: 'amit.sharma@email.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Sector 15',
    city: 'Mumbai',
    state: 'Maharashtra',
    skills: ['First Aid', 'Counseling', 'Documentation'],
    availability: 'Weekends',
    experience: '2 years in social work',
    motivation: 'Want to help society and make a difference',
    status: 'active',
    appliedDate: '2024-01-15',
    approvedDate: '2024-01-20',
    lastActivity: '2024-03-10',
    hoursContributed: 45,
    tasksCompleted: 12,
  },
  {
    id: 'VOL-2024-002',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 87654 32109',
    address: '456 Park Avenue, Block B',
    city: 'Delhi',
    state: 'Delhi',
    skills: ['Communication', 'Event Management', 'Social Media'],
    availability: 'Flexible',
    experience: 'Fresh graduate, eager to learn',
    motivation: 'Passionate about helping underprivileged communities',
    status: 'pending',
    appliedDate: '2024-03-08',
    hoursContributed: 0,
    tasksCompleted: 0,
  },
  {
    id: 'VOL-2024-003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 76543 21098',
    address: '789 Gandhi Road, Civil Lines',
    city: 'Pune',
    state: 'Maharashtra',
    skills: ['Medical Knowledge', 'Emergency Response', 'Leadership'],
    availability: 'Full-time',
    experience: '5 years as paramedic',
    motivation: 'Retired paramedic wanting to continue serving',
    status: 'approved',
    appliedDate: '2024-02-20',
    approvedDate: '2024-02-25',
    lastActivity: '2024-03-11',
    hoursContributed: 78,
    tasksCompleted: 23,
  },
];

const volunteerStats = [
  {
    title: 'Total Volunteers',
    value: '156',
    change: '+12',
    trend: 'up',
    icon: User,
    period: 'This month',
  },
  {
    title: 'Active Volunteers',
    value: '89',
    change: '+8',
    trend: 'up',
    icon: UserCheck,
    period: 'Currently active',
  },
  {
    title: 'Pending Applications',
    value: '23',
    change: '+5',
    trend: 'up',
    icon: Clock,
    period: 'Awaiting review',
  },
  {
    title: 'Hours Contributed',
    value: '2,340',
    change: '+156',
    trend: 'up',
    icon: Calendar,
    period: 'This month',
  },
];

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'rejected', label: 'Rejected' },
];

export default function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || volunteer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectVolunteer = (volunteerId: string) => {
    setSelectedVolunteers(prev =>
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const handleStatusChange = (volunteerId: string, newStatus: Volunteer['status']) => {
    setVolunteers(prev =>
      prev.map(volunteer =>
        volunteer.id === volunteerId
          ? {
              ...volunteer,
              status: newStatus,
              approvedDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : volunteer.approvedDate
            }
          : volunteer
      )
    );
    alert(`Volunteer status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100 dark:bg-green-900/20';
      case 'approved':
        return 'text-blue-700 bg-blue-100 dark:bg-blue-900/20';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/20';
      case 'inactive':
        return 'text-gray-700 bg-gray-100 dark:bg-gray-900/20';
      case 'rejected':
        return 'text-red-700 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-700 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'pending':
        return Clock;
      default:
        return User;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {volunteerStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <span>+{stat.change}</span>
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
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusFilters.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredVolunteers.length} volunteers
            </span>
          </div>
          {selectedVolunteers.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedVolunteers.length} selected
            </div>
          )}
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Volunteer Applications
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVolunteers.length === filteredVolunteers.length && filteredVolunteers.length > 0}
                    onChange={() => {
                      if (selectedVolunteers.length === filteredVolunteers.length) {
                        setSelectedVolunteers([]);
                      } else {
                        setSelectedVolunteers(filteredVolunteers.map(v => v.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contribution
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVolunteers.map((volunteer) => {
                const StatusIcon = getStatusIcon(volunteer.status);

                return (
                  <tr key={volunteer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVolunteers.includes(volunteer.id)}
                        onChange={() => handleSelectVolunteer(volunteer.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {volunteer.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {volunteer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="w-3 h-3" />
                          {volunteer.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {volunteer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {volunteer.city}, {volunteer.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            {skill}
                          </span>
                        ))}
                        {volunteer.skills.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{volunteer.skills.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        <span
                          className={cn(
                            'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                            getStatusColor(volunteer.status)
                          )}
                        >
                          {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div>{volunteer.hoursContributed}h</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {volunteer.tasksCompleted} tasks
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        {volunteer.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(volunteer.id, 'approved')}
                              className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(volunteer.id, 'rejected')}
                              className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </>
                        )}
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