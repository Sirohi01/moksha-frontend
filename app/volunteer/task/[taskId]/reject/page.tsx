'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

interface Task {
  _id: string;
  taskId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: string;
}

export default function RejectTaskPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const taskId = params.taskId as string;
  const token = searchParams.get('token');
  const volunteerId = searchParams.get('volunteerId');

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const rejectionReasons = [
    'Schedule conflict',
    'Not available on the required date',
    'Lack of required skills/experience',
    'Personal emergency',
    'Already committed to another task',
    'Transportation issues',
    'Health reasons',
    'Other (please specify)'
  ];

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}`);

      if (response.ok) {
        const data = await response.json();
        setTask(data.data);
      } else {
        setError('Task not found or invalid link');
      }
    } catch (error) {
      console.error('Failed to fetch task:', error);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const rejectTask = async () => {
    if (!token || !volunteerId) {
      setError('Invalid or expired link');
      return;
    }

    if (!reason.trim()) {
      setError('Please select or provide a reason for declining');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          volunteerId,
          reason: reason.trim()
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to decline task');
      }
    } catch (error) {
      console.error('Failed to reject task:', error);
      setError('Failed to decline task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Response Recorded</h1>
          <p className="text-gray-600 mb-6">Thank you for your prompt response. We understand that you cannot take on this task at this time.</p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              <strong>No worries!</strong><br />
              There will be other opportunities to serve. We appreciate your honesty and look forward to working with you in the future.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">❌</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Decline Task Assignment</h1>
              <p className="text-sm text-gray-600">Moksha Sewa Volunteer Portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Task Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-700 px-6 py-6 text-white">
              <h2 className="text-xl font-bold mb-2">{task.title}</h2>
              <p className="text-orange-100">Task ID: {task.taskId}</p>
              <p className="text-orange-100">Category: {formatCategory(task.category)}</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  We understand you cannot take on this task. Please let us know why:
                </h3>

                <div className="space-y-3">
                  {rejectionReasons.map((reasonOption, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value={reasonOption}
                        checked={reason === reasonOption}
                        onChange={(e) => setReason(e.target.value)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{reasonOption}</span>
                    </label>
                  ))}
                </div>

                {reason === 'Other (please specify)' && (
                  <div className="mt-4">
                    <textarea
                      value={reason === 'Other (please specify)' ? '' : reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Please specify your reason..."
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => window.location.href = `/volunteer/task/${taskId}/accept?token=${token}&volunteerId=${volunteerId}`}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ✅ Actually, I'll Accept
                </button>

                <button
                  onClick={rejectTask}
                  disabled={submitting || !reason.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    '❌ Confirm Decline'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}