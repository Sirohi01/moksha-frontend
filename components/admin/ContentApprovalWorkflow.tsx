'use client';

import { useState, useEffect } from 'react';

// Helper functions
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'press_release': return '📰';
    case 'social_media_post': return '📱';
    case 'media_asset': return '🖼️';
    case 'content': return '📄';
    default: return '📋';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'pending_review': return 'bg-yellow-100 text-yellow-800';
    case 'revision_requested': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

interface ApprovalItem {
  _id: string;
  title: string;
  type: 'press_release' | 'social_media_post' | 'media_asset' | 'content';
  content?: string;
  excerpt?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'revision_requested';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  approvalHistory: Array<{
    action: string;
    by: {
      _id: string;
      name: string;
    };
    comment?: string;
    timestamp: string;
  }>;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContentApprovalWorkflow() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    assignedTo: '',
    search: ''
  });

  const tabs = [
    { id: 'pending', name: 'Pending Review', count: 0 },
    { id: 'approved', name: 'Approved', count: 0 },
    { id: 'rejected', name: 'Rejected', count: 0 },
    { id: 'revision', name: 'Needs Revision', count: 0 }
  ];

  const contentTypes = [
    { value: '', label: 'All Types' },
    { value: 'press_release', label: 'Press Releases' },
    { value: 'social_media_post', label: 'Social Media Posts' },
    { value: 'media_asset', label: 'Media Assets' },
    { value: 'content', label: 'Content' }
  ];

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  useEffect(() => {
    fetchApprovalItems();
  }, [selectedTab, filters]);

  const fetchApprovalItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        status: selectedTab === 'pending' ? 'pending_review' : 
               selectedTab === 'revision' ? 'revision_requested' : selectedTab,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/approval/items?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch approval items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (itemId: string, action: string, comment?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/approval/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, comment }),
      });

      if (response.ok) {
        fetchApprovalItems();
        setShowApprovalModal(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Failed to process approval:', error);
    }
  };

  const assignReviewer = async (itemId: string, reviewerId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/approval/items/${itemId}/assign`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedTo: reviewerId }),
      });

      if (response.ok) {
        fetchApprovalItems();
      }
    } catch (error) {
      console.error('Failed to assign reviewer:', error);
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">✅ Content Approval Workflow</h2>
          <p className="text-gray-600">Review and approve content before publication</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-
3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Reviewers</option>
              <option value="me">Assigned to Me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Approval Items */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{getTypeIcon(item.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                        {item.excerpt && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.excerpt}</p>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Created: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 capitalize">{item.type.replace('_', ' ')}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.submittedBy.name}</div>
                    <div className="text-sm text-gray-500">{item.submittedBy.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {item.assignedTo ? (
                      <div>
                        <div className="text-sm text-gray-900">{item.assignedTo.name}</div>
                        <div className="text-sm text-gray-500">{item.assignedTo.email}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.dueDate ? (
                      <div className={`text-sm ${isOverdue(item.dueDate) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {new Date(item.dueDate).toLocaleDateString()}
                        {isOverdue(item.dueDate) && (
                          <div className="text-xs text-red-500">Overdue</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No due date</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowApprovalModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Review
                      </button>
                      {item.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => handleApproval(item._id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(item._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedItem && (
        <ApprovalModal
          item={selectedItem}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedItem(null);
          }}
          onApprove={(comment: string) => handleApproval(selectedItem._id, 'approved', comment)}
          onReject={(comment: string) => handleApproval(selectedItem._id, 'rejected', comment)}
          onRequestRevision={(comment: string) => handleApproval(selectedItem._id, 'revision_requested', comment)}
        />
      )}
    </div>
  );
}

// Approval Modal Component
function ApprovalModal({ item, onClose, onApprove, onReject, onRequestRevision }: any) {
  const [comment, setComment] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'revision' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'approve') {
      onApprove(comment);
    } else if (action === 'reject') {
      onReject(comment);
    } else if (action === 'revision') {
      onRequestRevision(comment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Review Content</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {/* Content Preview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <span className="text-2xl">{getTypeIcon(item.type)}</span>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Type: {item.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                  <span>By: {item.submittedBy.name}</span>
                </div>
              </div>
            </div>

            {item.content && (
              <div className="prose max-w-none">
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{item.content}</div>
              </div>
            )}
          </div>

          {/* Approval History */}
          {item.approvalHistory.length > 0 && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Approval History</h5>
              <div className="space-y-3">
                {item.approvalHistory.map((history: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{history.by.name}</span>
                        <span className="text-gray-500">{history.action}</span>
                        <span className="text-gray-400">
                          {new Date(history.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {history.comment && (
                        <p className="text-gray-600 mt-1">{history.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add your review comments..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => setAction('revision')}
                className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
              >
                Request Revision
              </button>
              <button
                type="submit"
                onClick={() => setAction('reject')}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
              >
                Reject
              </button>
              <button
                type="submit"
                onClick={() => setAction('approve')}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}