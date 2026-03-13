'use client';

import { useState, useEffect } from 'react';

interface Report {
  _id: string;
  caseNumber: string;
  reportType?: string;
  // Flat structure to match API response
  reporterName?: string;
  reporterPhone: string;
  reporterEmail?: string;
  reporterAddress?: string;
  reporterRelation?: string;
  exactLocation: string;
  landmark?: string;
  area: string;
  city: string;
  state: string;
  pincode?: string;
  locationType: string;
  gpsCoordinates?: string;
  dateFound: string;
  timeFound: string;
  approximateDeathTime?: string;
  gender: string;
  approximateAge?: string;
  bodyCondition: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  notes?: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [currentPage, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/reports?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        throw new Error('Failed to fetch reports');
      }
    } catch (error: any) {
      console.error('Failed to fetch reports:', error);
      setError(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setReports(reports.map(report => 
          report._id === reportId 
            ? { ...report, status: newStatus as Report['status'] }
            : report
        ));
        
        // Close modal if open
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport({ ...selectedReport, status: newStatus as Report['status'] });
        }
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error: any) {
      console.error('Failed to update report status:', error);
      alert('Failed to update status: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600">Manage and track all incident reports</p>
        </div>
        <button
          onClick={fetchReports}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <span className="mr-2">🔄</span>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Reports</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchReports}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Case #{report.caseNumber}</p>
                      <p className="text-sm text-gray-500">Unclaimed Body Report</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{report.description || 'No description'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <p>{report.city}, {report.state}</p>
                      <p className="text-gray-500">{report.area}</p>
                      <p className="text-gray-500">{report.pincode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <p className="font-medium">{report.reporterName || 'Anonymous'}</p>
                      <p className="text-gray-500">{report.reporterPhone}</p>
                      {report.reporterEmail && (
                        <p className="text-gray-500 text-xs">{report.reporterEmail}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reports.length === 0 && !loading && (
          <div className="text-center py-12">
            <span className="text-gray-400 text-4xl">📋</span>
            <p className="text-gray-500 mt-2">No reports found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Case Number</h4>
                  <p className="text-gray-600">{selectedReport.caseNumber}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-gray-600">{selectedReport.description || 'No description provided'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <p className="text-gray-600">
                    {selectedReport.exactLocation}, {selectedReport.area}, {selectedReport.city}, 
                    {selectedReport.state} - {selectedReport.pincode}
                  </p>
                  {selectedReport.landmark && (
                    <p className="text-gray-500 text-sm">Landmark: {selectedReport.landmark}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Reporter Information</h4>
                  <p className="text-gray-600">
                    <strong>Name:</strong> {selectedReport.reporterName || 'Anonymous'}<br/>
                    <strong>Phone:</strong> {selectedReport.reporterPhone}<br/>
                    {selectedReport.reporterEmail && (
                      <><strong>Email:</strong> {selectedReport.reporterEmail}<br/></>
                    )}
                    {selectedReport.reporterRelation && (
                      <><strong>Relationship:</strong> {selectedReport.reporterRelation}<br/></>
                    )}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Body Details</h4>
                  <p className="text-gray-600">
                    <strong>Gender:</strong> {selectedReport.gender}<br/>
                    {selectedReport.approximateAge && (
                      <><strong>Age:</strong> {selectedReport.approximateAge}<br/></>
                    )}
                    <strong>Condition:</strong> {selectedReport.bodyCondition}<br/>
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Time Details</h4>
                  <p className="text-gray-600">
                    <strong>Date Found:</strong> {new Date(selectedReport.dateFound).toLocaleDateString()}<br/>
                    <strong>Time Found:</strong> {selectedReport.timeFound}<br/>
                    {selectedReport.approximateDeathTime && (
                      <><strong>Approximate Death Time:</strong> {selectedReport.approximateDeathTime}<br/></>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status: </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Priority: </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedReport.priority)}`}>
                      {selectedReport.priority}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p><strong>Created:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedReport.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}