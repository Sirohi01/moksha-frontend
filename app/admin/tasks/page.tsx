'use client';

import { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingSpinner, ActionButton, StatsCard } from '@/components/admin/AdminComponents';

interface Task {
  _id: string;
  taskId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  overallStatus: string;
  dueDate: string;
  estimatedDuration: number;
  assignedTo: Array<{
    volunteer: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    status: string;
    assignedAt: string;
    adminApprovalStatus?: string;
    adminApprovedBy?: string;
    adminApprovedAt?: string;
    adminRejectionReason?: string;
    certificateGenerated?: boolean;
    certificateUrl?: string;
  }>;
  assignedBy: {
    name: string;
    email: string;
  };
  location?: {
    address: string;
    city: string;
    state?: string;
    pincode?: string;
  };
  contactPerson?: {
    name: string;
    phone: string;
    email?: string;
  };
  createdAt: string;
}

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  volunteerTypes: string[];
  status: string;
}

export default function TasksManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'success' | 'danger' | 'warning';
  } | null>(null);
  const [stats, setStats] = useState({
    assigned: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'cremation_assistance',
    priority: 'medium',
    dueDate: '',
    estimatedDuration: 1,
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    contactPerson: {
      name: '',
      phone: '',
      email: ''
    },
    requirements: [] as string[]
  });

  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

  // Helper function to show confirmation modal
  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'success' | 'danger' | 'warning' = 'warning') => {
    setConfirmAction({ title, message, onConfirm, type });
    setShowConfirmModal(true);
  };

  useEffect(() => {
    fetchTasks();
    fetchVolunteers();
  }, [currentPage, filters]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.data);
        setTotalPages(data.pagination.pages);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers?status=active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    }
  };

  const createTask = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTask,
          volunteerIds: selectedVolunteers
        })
      });

      if (response.ok) {
        showConfirm('Success', 'Task created and assigned successfully!', () => {}, 'success');
        setShowCreateModal(false);
        setNewTask({
          title: '',
          description: '',
          category: 'cremation_assistance',
          priority: 'medium',
          dueDate: '',
          estimatedDuration: 1,
          location: { address: '', city: '', state: '', pincode: '' },
          contactPerson: { name: '', phone: '', email: '' },
          requirements: []
        });
        setSelectedVolunteers([]);
        fetchTasks();
      } else {
        const error = await response.json();
        showConfirm('Error', `Failed to create task: ${error.message}`, () => {}, 'danger');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      showConfirm('Error', 'Failed to create task. Please try again.', () => {}, 'danger');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading tasks..." />;
  }

  const columns = [
    {
      key: 'task',
      label: 'Task Details',
      render: (_value: any, task: Task) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{task.title}</div>
          <div className="text-sm text-gray-500">ID: {task.taskId}</div>
          <div className="text-sm text-gray-500">{formatCategory(task.category)}</div>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority & Status',
      render: (_value: any, task: Task) => (
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
          <br />
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.overallStatus)}`}>
            {task.overallStatus.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      )
    },
    {
      key: 'assignment',
      label: 'Assigned Volunteers',
      render: (_value: any, task: Task) => (
        <div>
          {task.assignedTo.length > 0 ? (
            <div className="space-y-2">
              {task.assignedTo.slice(0, 2).map((assignment, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium">{assignment.volunteer.name}</div>
                  <div className="flex space-x-1 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      assignment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      assignment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      V: {assignment.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      assignment.adminApprovalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      assignment.adminApprovalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      A: {assignment.adminApprovalStatus || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
              {task.assignedTo.length > 2 && (
                <div className="text-xs text-gray-500">+{task.assignedTo.length - 2} more</div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">Not assigned</span>
          )}
        </div>
      )
    },
    {
      key: 'timeline',
      label: 'Timeline',
      render: (_value: any, task: Task) => (
        <div>
          <div className="text-sm text-gray-900">
            Due: {new Date(task.dueDate).toLocaleDateString('en-IN')}
          </div>
          <div className="text-sm text-gray-500">
            Duration: {task.estimatedDuration}h
          </div>
          <div className="text-sm text-gray-500">
            Created: {new Date(task.createdAt).toLocaleDateString('en-IN')}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, task: Task) => (
        <div className="flex space-x-2">
          <ActionButton
            onClick={() => {
              setSelectedTask(task);
              setShowAssignModal(true);
            }}
            variant="primary"
            size="sm"
          >
            Assign
          </ActionButton>
          <ActionButton
            onClick={() => {
              setSelectedTask(task);
              setShowViewModal(true);
            }}
            variant="secondary"
            size="sm"
          >
            View
          </ActionButton>
          <ActionButton
            onClick={() => {
              setSelectedTask(task);
              setShowVolunteerModal(true);
            }}
            variant="secondary"
            size="sm"
          >
            Manage
          </ActionButton>
          <ActionButton
            onClick={() => {
              setSelectedTask(task);
              setShowStatusModal(true);
            }}
            variant="secondary"
            size="sm"
          >
            Status
          </ActionButton>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="Task Management" 
        description="Create and manage volunteer tasks"
        icon="🎯"
      >
        <ActionButton 
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          icon="➕"
        >
          Create Task
        </ActionButton>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Assigned Tasks"
          value={stats.assigned || 0}
          icon="📋"
          gradient="from-blue-500 to-blue-600"
          change="+5%"
          changeType="positive"
        />
        <StatsCard
          title="In Progress"
          value={stats.in_progress || 0}
          icon="⚡"
          gradient="from-yellow-500 to-yellow-600"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Completed"
          value={stats.completed || 0}
          icon="✅"
          gradient="from-green-500 to-green-600"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue || 0}
          icon="⚠️"
          gradient="from-red-500 to-red-600"
          change="-2%"
          changeType="negative"
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
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Categories</option>
              <option value="cremation_assistance">Cremation Assistance</option>
              <option value="family_support">Family Support</option>
              <option value="documentation">Documentation</option>
              <option value="transportation">Transportation</option>
              <option value="coordination">Coordination</option>
              <option value="emergency_response">Emergency Response</option>
              <option value="administrative">Administrative</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <DataTable 
        columns={columns}
        data={tasks}
        loading={loading}
        emptyMessage="No tasks found"
        pagination={{
            currentPage: currentPage,
            totalPages: totalPages
        }}
        onPageChange={setCurrentPage}
      />

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cremation_assistance">Cremation Assistance</option>
                    <option value="family_support">Family Support</option>
                    <option value="documentation">Documentation</option>
                    <option value="transportation">Transportation</option>
                    <option value="coordination">Coordination</option>
                    <option value="emergency_response">Emergency Response</option>
                    <option value="administrative">Administrative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the task in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newTask.estimatedDuration}
                    onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Address"
                      value={newTask.location.address}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        location: { ...newTask.location, address: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      value={newTask.location.city}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        location: { ...newTask.location, city: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State"
                      value={newTask.location.state}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        location: { ...newTask.location, state: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newTask.location.pincode}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        location: { ...newTask.location, pincode: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={newTask.contactPerson.name}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        contactPerson: { ...newTask.contactPerson, name: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newTask.contactPerson.phone}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        contactPerson: { ...newTask.contactPerson, phone: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={newTask.contactPerson.email}
                      onChange={(e) => setNewTask({ 
                        ...newTask, 
                        contactPerson: { ...newTask.contactPerson, email: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea
                  placeholder="Enter any special requirements, skills needed, or materials to bring (one per line)"
                  value={newTask.requirements.join('\n')}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    requirements: e.target.value.split('\n').filter(req => req.trim())
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter each requirement on a new line</p>
              </div>

              {/* Volunteer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Volunteers</label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-4">
                  {volunteers.map((volunteer) => (
                    <label key={volunteer._id} className="flex items-center space-x-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedVolunteers.includes(volunteer._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVolunteers([...selectedVolunteers, volunteer._id]);
                          } else {
                            setSelectedVolunteers(selectedVolunteers.filter(id => id !== volunteer._id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                        <div className="text-xs text-gray-500">{volunteer.email} • {volunteer.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end space-x-3">
                <ActionButton
                  onClick={() => setShowCreateModal(false)}
                  variant="secondary"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={createTask}
                  variant="primary"
                  disabled={!newTask.title || !newTask.description || !newTask.dueDate}
                >
                  Create & Assign Task
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignModal && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Assign Additional Volunteers</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTask.title}</h3>
                <p className="text-gray-600">Task ID: {selectedTask.taskId}</p>
                <p className="text-gray-600">Category: {formatCategory(selectedTask.category)}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Currently Assigned Volunteers:</h4>
                {selectedTask.assignedTo.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTask.assignedTo.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{assignment.volunteer.name}</p>
                          <p className="text-sm text-gray-600">{assignment.volunteer.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assignment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No volunteers assigned yet</p>
                )}
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Assign Additional Volunteers:</h4>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-4">
                  {volunteers.filter(v => !selectedTask.assignedTo.some(a => a.volunteer._id === v._id)).map((volunteer) => (
                    <label key={volunteer._id} className="flex items-center space-x-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedVolunteers.includes(volunteer._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVolunteers([...selectedVolunteers, volunteer._id]);
                          } else {
                            setSelectedVolunteers(selectedVolunteers.filter(id => id !== volunteer._id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                        <div className="text-xs text-gray-500">{volunteer.email} • {volunteer.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end space-x-3">
                <ActionButton
                  onClick={() => setShowAssignModal(false)}
                  variant="secondary"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    if (selectedVolunteers.length > 0 && selectedTask) {
                      showConfirm(
                        'Assign Volunteers',
                        `Are you sure you want to assign ${selectedVolunteers.length} volunteer(s) to this task?`,
                        async () => {
                          try {
                            const token = localStorage.getItem('adminToken');
                            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${selectedTask._id}/assign`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                volunteerIds: selectedVolunteers
                              })
                            });

                            if (response.ok) {
                              setShowAssignModal(false);
                              setSelectedVolunteers([]);
                              fetchTasks();
                            } else {
                              const error = await response.json();
                              showConfirm('Error', `Failed to assign volunteers: ${error.message}`, () => {}, 'danger');
                            }
                          } catch (error) {
                            console.error('Failed to assign volunteers:', error);
                            showConfirm('Error', 'Failed to assign volunteers. Please try again.', () => {}, 'danger');
                          }
                        },
                        'success'
                      );
                    }
                  }}
                  variant="primary"
                  disabled={selectedVolunteers.length === 0}
                >
                  Assign Selected Volunteers
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Task Modal */}
      {showViewModal && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Task Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Task ID:</span>
                      <p className="text-gray-900 font-mono">{selectedTask.taskId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Title:</span>
                      <p className="text-gray-900 font-semibold">{selectedTask.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Category:</span>
                      <p className="text-gray-900">{formatCategory(selectedTask.category)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Priority:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.overallStatus)}`}>
                        {selectedTask.overallStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Timeline & Duration</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Due Date:</span>
                      <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Estimated Duration:</span>
                      <p className="text-gray-900">{selectedTask.estimatedDuration} hour(s)</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Created:</span>
                      <p className="text-gray-900">{new Date(selectedTask.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Assigned By:</span>
                      <p className="text-gray-900">{selectedTask.assignedBy.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedTask.description}</p>
              </div>

              {/* Location & Contact */}
              {(selectedTask.location || selectedTask.contactPerson) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedTask.location && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">📍 Location</h3>
                      <p className="text-gray-700">
                        {selectedTask.location.address && `${selectedTask.location.address}, `}
                        {selectedTask.location.city && `${selectedTask.location.city}, `}
                        {selectedTask.location.state && `${selectedTask.location.state} `}
                        {selectedTask.location.pincode && `- ${selectedTask.location.pincode}`}
                      </p>
                    </div>
                  )}
                  
                  {selectedTask.contactPerson && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">📞 Contact Person</h3>
                      <div className="space-y-1">
                        {selectedTask.contactPerson.name && <p className="text-gray-700 font-medium">{selectedTask.contactPerson.name}</p>}
                        {selectedTask.contactPerson.phone && <p className="text-gray-700">{selectedTask.contactPerson.phone}</p>}
                        {selectedTask.contactPerson.email && <p className="text-gray-700">{selectedTask.contactPerson.email}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Assigned Volunteers */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Assigned Volunteers</h3>
                {selectedTask.assignedTo.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {selectedTask.assignedTo.map((assignment, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{assignment.volunteer.name}</h4>
                            <p className="text-sm text-gray-600">{assignment.volunteer.email}</p>
                            <p className="text-sm text-gray-600">{assignment.volunteer.phone}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            assignment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            assignment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Assigned: {new Date(assignment.assignedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No volunteers assigned yet</p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end">
                <ActionButton
                  onClick={() => setShowViewModal(false)}
                  variant="secondary"
                >
                  Close
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Management Modal */}
      {showVolunteerModal && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Manage Volunteers - {selectedTask.title}</h2>
                <button
                  onClick={() => setShowVolunteerModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600">Task ID: {selectedTask.taskId}</p>
                <p className="text-gray-600">Category: {formatCategory(selectedTask.category)}</p>
              </div>

              {selectedTask.assignedTo.length > 0 ? (
                <div className="space-y-4">
                  {selectedTask.assignedTo.map((assignment, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-xl border">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{assignment.volunteer.name}</h4>
                          <p className="text-gray-600">{assignment.volunteer.email}</p>
                          <p className="text-gray-600">{assignment.volunteer.phone}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Assigned: {new Date(assignment.assignedAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            assignment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            assignment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            Volunteer: {assignment.status}
                          </span>
                          
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            assignment.adminApprovalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            assignment.adminApprovalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            Admin: {assignment.adminApprovalStatus || 'pending'}
                          </span>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="border-t pt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Admin Actions:</h5>
                        
                        {/* Volunteer Status Management */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Change Volunteer Status:</label>
                          <div className="flex space-x-2">
                            {['pending', 'accepted', 'rejected', 'in_progress', 'completed'].map((status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  showConfirm(
                                    'Update Volunteer Status',
                                    `Change volunteer status to "${status}"?`,
                                    async () => {
                                      try {
                                        const token = localStorage.getItem('adminToken');
                                        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${selectedTask._id}/volunteer-status`, {
                                          method: 'PUT',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`,
                                          },
                                          body: JSON.stringify({
                                            volunteerId: assignment.volunteer._id,
                                            status: status
                                          })
                                        });

                                        if (response.ok) {
                                          fetchTasks();
                                          showConfirm('Success', `Volunteer status updated to ${status}!`, () => {}, 'success');
                                        } else {
                                          showConfirm('Error', 'Failed to update volunteer status', () => {}, 'danger');
                                        }
                                      } catch (error) {
                                        console.error('Failed to update volunteer status:', error);
                                        showConfirm('Error', 'Failed to update volunteer status', () => {}, 'danger');
                                      }
                                    },
                                    'warning'
                                  );
                                }}
                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                                  assignment.status === status
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Admin Approval Management */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Admin Approval Status:</label>
                          <div className="flex space-x-2">
                            {['pending', 'approved', 'rejected'].map((approvalStatus) => (
                              <button
                                key={approvalStatus}
                                onClick={() => {
                                  showConfirm(
                                    'Update Admin Approval',
                                    `Change admin approval to "${approvalStatus}"?`,
                                    async () => {
                                      try {
                                        const token = localStorage.getItem('adminToken');
                                        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${selectedTask._id}/approve-assignment`, {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`,
                                          },
                                          body: JSON.stringify({
                                            volunteerId: assignment.volunteer._id,
                                            approved: approvalStatus === 'approved',
                                            rejectionReason: approvalStatus === 'rejected' ? 'Admin decision' : undefined
                                          })
                                        });

                                        if (response.ok) {
                                          fetchTasks();
                                          showConfirm('Success', `Admin approval updated to ${approvalStatus}!`, () => {}, 'success');
                                        } else {
                                          showConfirm('Error', 'Failed to update admin approval', () => {}, 'danger');
                                        }
                                      } catch (error) {
                                        console.error('Failed to update admin approval:', error);
                                        showConfirm('Error', 'Failed to update admin approval', () => {}, 'danger');
                                      }
                                    },
                                    'warning'
                                  );
                                }}
                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                                  (assignment.adminApprovalStatus || 'pending') === approvalStatus
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {approvalStatus}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No volunteers assigned to this task yet.</p>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end">
                <ActionButton
                  onClick={() => setShowVolunteerModal(false)}
                  variant="secondary"
                >
                  Close
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Task Status</h3>
              <p className="text-gray-600 mb-4">Task: {selectedTask.title}</p>
              
              <div className="space-y-3">
                {['draft', 'assigned', 'in_progress', 'completed', 'cancelled', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      showConfirm(
                        'Update Status',
                        `Are you sure you want to change the task status to "${status.replace('_', ' ')}"?`,
                        async () => {
                          try {
                            const token = localStorage.getItem('adminToken');
                            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${selectedTask._id}/status`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                              body: JSON.stringify({ status })
                            });

                            if (response.ok) {
                              setShowStatusModal(false);
                              fetchTasks();
                              showConfirm('Success', `Task status updated to ${status.replace('_', ' ')}!`, () => {}, 'success');
                            } else {
                              showConfirm('Error', 'Failed to update task status', () => {}, 'danger');
                            }
                          } catch (error) {
                            console.error('Failed to update task status:', error);
                            showConfirm('Error', 'Failed to update task status', () => {}, 'danger');
                          }
                        },
                        'warning'
                      );
                      setShowStatusModal(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedTask.overallStatus === status 
                        ? 'bg-blue-50 border-blue-200 text-blue-900' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                    {selectedTask.overallStatus === status && (
                      <span className="ml-2 text-xs text-blue-600">(Current)</span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <ActionButton
                  onClick={() => setShowStatusModal(false)}
                  variant="secondary"
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  confirmAction.type === 'success' ? 'bg-green-100' :
                  confirmAction.type === 'danger' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <span className="text-2xl">
                    {confirmAction.type === 'success' ? '✅' :
                     confirmAction.type === 'danger' ? '❌' :
                     '⚠️'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{confirmAction.title}</h3>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{confirmAction.message}</p>
              
              <div className="flex justify-end space-x-3">
                <ActionButton
                  onClick={() => setShowConfirmModal(false)}
                  variant="secondary"
                >
                  {confirmAction.type === 'success' || confirmAction.type === 'danger' ? 'OK' : 'Cancel'}
                </ActionButton>
                {(confirmAction.type === 'warning') && (
                  <ActionButton
                    onClick={() => {
                      confirmAction.onConfirm();
                      setShowConfirmModal(false);
                    }}
                    variant="primary"
                  >
                    Confirm
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}