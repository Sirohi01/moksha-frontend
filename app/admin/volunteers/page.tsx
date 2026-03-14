'use client';

import { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingSpinner, ActionButton, Modal } from '@/components/admin/AdminComponents';

interface Volunteer {
  _id: string;
  volunteerId: string;
  name: string;
  email: string;
  phone: string;
  registrationType: string;
  city: string;
  state: string;
  volunteerTypes: string[];
  availability: string;
  status: string;
  createdAt: string;
}

export default function VolunteersManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    registrationType: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    fetchVolunteers();
  }, [currentPage, filters]);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteerStatus = async (volunteerId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers/${volunteerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh the volunteers list
        fetchVolunteers();
        alert(`Volunteer ${status} successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to update volunteer: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to update volunteer status:', error);
      alert('Failed to update volunteer status. Please try again.');
    }
  };

  const viewVolunteer = async (volunteerId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers/${volunteerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedVolunteer(data.data);
        setShowViewDialog(true);
      } else {
        alert('Failed to fetch volunteer details');
      }
    } catch (error) {
      console.error('Failed to fetch volunteer details:', error);
      alert('Failed to fetch volunteer details');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading volunteers..." />;
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'volunteer',
      label: 'Volunteer Details',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
          <div className="text-sm text-gray-500">ID: {volunteer.volunteerId}</div>
          <div className="text-sm text-gray-500 capitalize">{volunteer.registrationType}</div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm text-gray-900">{volunteer.email}</div>
          <div className="text-sm text-gray-500">{volunteer.phone}</div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm text-gray-900">{volunteer.city}</div>
          <div className="text-sm text-gray-500">{volunteer.state}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type & Availability',
      render: (_value: any, volunteer: Volunteer) => (
        <div>
          <div className="text-sm text-gray-900">
            {volunteer.volunteerTypes?.join(', ') || 'Not specified'}
          </div>
          <div className="text-sm text-gray-500">{volunteer.availability}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, volunteer: Volunteer) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(volunteer.status)}`}>
          {volunteer.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, volunteer: Volunteer) => (
        <div className="flex space-x-2">
          <ActionButton
            onClick={() => viewVolunteer(volunteer._id)}
            variant="secondary"
            size="sm"
          >
            View
          </ActionButton>
          <button
            onClick={() => window.open(`mailto:${volunteer.email}?subject=Volunteer Application - ${volunteer.volunteerId}`)}
            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-200"
            title="Send Email"
          >
            📧
          </button>
          {volunteer.status === 'pending' && (
            <>
              <ActionButton
                onClick={() => updateVolunteerStatus(volunteer._id, 'approved')}
                variant="success"
                size="sm"
              >
                Approve
              </ActionButton>
              <ActionButton
                onClick={() => updateVolunteerStatus(volunteer._id, 'rejected')}
                variant="danger"
                size="sm"
              >
                Reject
              </ActionButton>
            </>
          )}
          {volunteer.status === 'approved' && (
            <ActionButton
              onClick={() => updateVolunteerStatus(volunteer._id, 'active')}
              variant="primary"
              size="sm"
            >
              Activate
            </ActionButton>
          )}
          {volunteer.status === 'active' && (
            <ActionButton
              onClick={() => updateVolunteerStatus(volunteer._id, 'inactive')}
              variant="secondary"
              size="sm"
            >
              Deactivate
            </ActionButton>
          )}
          {volunteer.status === 'inactive' && (
            <ActionButton
              onClick={() => updateVolunteerStatus(volunteer._id, 'active')}
              variant="success"
              size="sm"
            >
              Reactivate
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
        title="Volunteers Management" 
        description="Manage volunteer applications and assignments"
        icon="🤝"
      >
        <ActionButton 
          onClick={fetchVolunteers}
          variant="secondary"
          icon="🔄"
        >
          Refresh
        </ActionButton>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type</label>
            <select
              value={filters.registrationType}
              onChange={(e) => setFilters({ ...filters, registrationType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Types</option>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="Filter by city"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              placeholder="Filter by state"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <DataTable 
        columns={columns}
        data={volunteers}
        loading={loading}
        emptyMessage="No volunteers found"
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

      {/* View Volunteer Modal */}
      <Modal
        isOpen={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        title="Volunteer Details"
        size="lg"
      >
        {selectedVolunteer && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedVolunteer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedVolunteer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedVolunteer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volunteer ID:</span>
                    <span className="font-medium">{selectedVolunteer.volunteerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Type:</span>
                    <span className="font-medium capitalize">{selectedVolunteer.registrationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedVolunteer.status)}`}>
                      {selectedVolunteer.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Availability</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium">{selectedVolunteer.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium">{selectedVolunteer.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium">{selectedVolunteer.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volunteer Types:</span>
                    <span className="font-medium">{selectedVolunteer.volunteerTypes?.join(', ') || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Date:</span>
                    <span className="font-medium">{new Date(selectedVolunteer.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <ActionButton
                onClick={() => window.open(`mailto:${selectedVolunteer.email}?subject=Volunteer Application - ${selectedVolunteer.volunteerId}`)}
                variant="primary"
                icon="📧"
              >
                Send Email
              </ActionButton>
              
              {selectedVolunteer.status === 'pending' && (
                <>
                  <ActionButton
                    onClick={() => {
                      updateVolunteerStatus(selectedVolunteer._id, 'approved');
                      setShowViewDialog(false);
                    }}
                    variant="success"
                  >
                    Approve
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      updateVolunteerStatus(selectedVolunteer._id, 'rejected');
                      setShowViewDialog(false);
                    }}
                    variant="danger"
                  >
                    Reject
                  </ActionButton>
                </>
              )}
              
              {selectedVolunteer.status === 'approved' && (
                <ActionButton
                  onClick={() => {
                    updateVolunteerStatus(selectedVolunteer._id, 'active');
                    setShowViewDialog(false);
                  }}
                  variant="primary"
                >
                  Activate
                </ActionButton>
              )}
              
              {selectedVolunteer.status === 'active' && (
                <ActionButton
                  onClick={() => {
                    updateVolunteerStatus(selectedVolunteer._id, 'inactive');
                    setShowViewDialog(false);
                  }}
                  variant="secondary"
                >
                  Deactivate
                </ActionButton>
              )}
              
              {selectedVolunteer.status === 'inactive' && (
                <ActionButton
                  onClick={() => {
                    updateVolunteerStatus(selectedVolunteer._id, 'active');
                    setShowViewDialog(false);
                  }}
                  variant="success"
                >
                  Reactivate
                </ActionButton>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}