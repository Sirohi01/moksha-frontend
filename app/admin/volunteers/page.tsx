'use client';

import { useState, useEffect } from 'react';

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">🤝 Volunteers Management</h1>
            <p className="text-gray-600">Manage volunteer applications and assignments</p>
          </div>
          <div className="text-sm text-gray-500">
            Total Volunteers: {volunteers.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              placeholder="Filter by state"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteer Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {volunteer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {volunteer.volunteerId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {volunteer.registrationType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {volunteer.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {volunteer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {volunteer.city}
                    </div>
                    <div className="text-sm text-gray-500">
                      {volunteer.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {volunteer.volunteerTypes?.join(', ') || 'Not specified'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {volunteer.availability}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(volunteer.status)}`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => viewVolunteer(volunteer._id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="View Details"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => window.open(`mailto:${volunteer.email}?subject=Volunteer Application - ${volunteer.volunteerId}`)}
                      className="text-purple-600 hover:text-purple-900 mr-4"
                      title="Send Email"
                    >
                      📧
                    </button>
                    {volunteer.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateVolunteerStatus(volunteer._id, 'approved')}
                          className="text-green-600 hover:text-green-900 mr-4"
                          title="Approve Volunteer"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateVolunteerStatus(volunteer._id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Reject Volunteer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {volunteer.status === 'approved' && (
                      <button 
                        onClick={() => updateVolunteerStatus(volunteer._id, 'active')}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Activate Volunteer"
                      >
                        Activate
                      </button>
                    )}
                    {volunteer.status === 'active' && (
                      <button 
                        onClick={() => updateVolunteerStatus(volunteer._id, 'inactive')}
                        className="text-gray-600 hover:text-gray-900"
                        title="Deactivate Volunteer"
                      >
                        Deactivate
                      </button>
                    )}
                    {volunteer.status === 'inactive' && (
                      <button 
                        onClick={() => updateVolunteerStatus(volunteer._id, 'active')}
                        className="text-green-600 hover:text-green-900"
                        title="Reactivate Volunteer"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Volunteer Dialog */}
      {showViewDialog && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Volunteer Details</h2>
                <button
                  onClick={() => setShowViewDialog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedVolunteer.name}</p>
                    <p><strong>Email:</strong> {selectedVolunteer.email}</p>
                    <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
                    <p><strong>Volunteer ID:</strong> {selectedVolunteer.volunteerId}</p>
                    <p><strong>Registration Type:</strong> {selectedVolunteer.registrationType}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedVolunteer.status)}`}>
                        {selectedVolunteer.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Availability</h3>
                  <div className="space-y-2">
                    <p><strong>City:</strong> {selectedVolunteer.city}</p>
                    <p><strong>State:</strong> {selectedVolunteer.state}</p>
                    <p><strong>Availability:</strong> {selectedVolunteer.availability}</p>
                    <p><strong>Volunteer Types:</strong> {selectedVolunteer.volunteerTypes?.join(', ') || 'Not specified'}</p>
                    <p><strong>Registration Date:</strong> {new Date(selectedVolunteer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => window.open(`mailto:${selectedVolunteer.email}?subject=Volunteer Application - ${selectedVolunteer.volunteerId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Email
                </button>
                
                {selectedVolunteer.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateVolunteerStatus(selectedVolunteer._id, 'approved');
                        setShowViewDialog(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        updateVolunteerStatus(selectedVolunteer._id, 'rejected');
                        setShowViewDialog(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {selectedVolunteer.status === 'approved' && (
                  <button
                    onClick={() => {
                      updateVolunteerStatus(selectedVolunteer._id, 'active');
                      setShowViewDialog(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Activate
                  </button>
                )}
                
                {selectedVolunteer.status === 'active' && (
                  <button
                    onClick={() => {
                      updateVolunteerStatus(selectedVolunteer._id, 'inactive');
                      setShowViewDialog(false);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Deactivate
                  </button>
                )}
                
                {selectedVolunteer.status === 'inactive' && (
                  <button
                    onClick={() => {
                      updateVolunteerStatus(selectedVolunteer._id, 'active');
                      setShowViewDialog(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}