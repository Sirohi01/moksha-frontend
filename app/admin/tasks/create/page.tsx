'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, LoadingSpinner, ActionButton } from '@/components/admin/AdminComponents';

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  volunteerTypes: string[];
  status: string;
}

export default function CreateTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [fetchingVolunteers, setFetchingVolunteers] = useState(true);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

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

  useEffect(() => {
    fetchVolunteers();
  }, []);

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
    } finally {
      setFetchingVolunteers(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        router.push('/admin/tasks');
      } else {
        const error = await response.json();
        alert(`Failed to create task: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingVolunteers) {
    return <LoadingSpinner size="lg" message="Preparing task creation..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Create New Task" 
        description="Detailed information for assigning a new volunteer mission"
        icon="🎯"
      >
        <ActionButton 
          onClick={() => router.back()}
          variant="secondary"
          icon="⬅️"
        >
          Back to Tasks
        </ActionButton>
      </PageHeader>

      <form onSubmit={handleCreateTask} className="space-y-8 pb-12">
        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 md:p-12 space-y-10">
            
            {/* Section: Basic Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Basic Mission Info</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                    placeholder="e.g. Cremation Coordination at Haridwar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Category *</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Mission Description *</label>
                <textarea
                  required
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={5}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 resize-none"
                  placeholder="Provide comprehensive details about the mission goals, expectations, and any important context..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">🚀 Urgent Requirement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Mission Due Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Est. Duration (hrs)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newTask.estimatedDuration}
                      onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseFloat(e.target.value) })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Hours</div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Location and Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Location</h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Address"
                    value={newTask.location.address}
                    onChange={(e) => setNewTask({ ...newTask, location: { ...newTask.location, address: e.target.value }})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={newTask.location.city}
                      onChange={(e) => setNewTask({ ...newTask, location: { ...newTask.location, city: e.target.value }})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newTask.location.state}
                      onChange={(e) => setNewTask({ ...newTask, location: { ...newTask.location, state: e.target.value }})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newTask.location.pincode}
                    onChange={(e) => setNewTask({ ...newTask, location: { ...newTask.location, pincode: e.target.value }})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Contact Person</h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newTask.contactPerson.name}
                    onChange={(e) => setNewTask({ ...newTask, contactPerson: { ...newTask.contactPerson, name: e.target.value }})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300"
                  />
                  <input
                    type="tel"
                    placeholder="Primary Phone Number"
                    value={newTask.contactPerson.phone}
                    onChange={(e) => setNewTask({ ...newTask, contactPerson: { ...newTask.contactPerson, phone: e.target.value }})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300"
                  />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={newTask.contactPerson.email}
                    onChange={(e) => setNewTask({ ...newTask, contactPerson: { ...newTask.contactPerson, email: e.target.value }})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Special Requirements */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Special Requirements & Skills</h3>
              </div>
              <div className="space-y-2">
                <textarea
                  placeholder="Enter any special instructions, necessary equipment, or specific volunteer skills required for this task (Enter each point on a new line)"
                  value={newTask.requirements.join('\n')}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    requirements: e.target.value.split('\n').filter(req => req.trim())
                  })}
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all duration-300 resize-none"
                />
                <p className="text-xs text-gray-400 ml-1">Use new lines for multiple requirements</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Volunteer Selection */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Assign to Active Volunteers</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2 scrollbar-hide">
                {volunteers.map((volunteer) => (
                  <div 
                    key={volunteer._id}
                    onClick={() => {
                      if (selectedVolunteers.includes(volunteer._id)) {
                        setSelectedVolunteers(selectedVolunteers.filter(id => id !== volunteer._id));
                      } else {
                        setSelectedVolunteers([...selectedVolunteers, volunteer._id]);
                      }
                    }}
                    className={`p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col space-y-2 ${
                      selectedVolunteers.includes(volunteer._id) 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        selectedVolunteers.includes(volunteer._id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {volunteer.name.charAt(0).toUpperCase()}
                      </div>
                      {selectedVolunteers.includes(volunteer._id) && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 truncate">{volunteer.name}</div>
                      <div className="text-xs text-gray-500 truncate">{volunteer.email}</div>
                      <div className="text-xs text-gray-400 mt-1">{volunteer.phone}</div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                       {volunteer.volunteerTypes.slice(0, 2).map((type, i) => (
                         <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-600">
                           {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                         </span>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
              {volunteers.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No active volunteers found to assign</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-bold text-blue-600">{selectedVolunteers.length}</span> volunteers selected
            </div>
            <div className="flex space-x-4">
              <ActionButton
                onClick={() => router.back()}
                variant="secondary"
                disabled={loading}
              >
                Cancel
              </ActionButton>
              <ActionButton
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!newTask.title || !newTask.description || !newTask.dueDate}
              >
                Create & Assign Mission 🎯
              </ActionButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
