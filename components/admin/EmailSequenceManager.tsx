"use client";
import { useState, useEffect } from 'react';
import { Play, Pause, BarChart3, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  emailCount: number;
  status: 'active' | 'paused' | 'draft';
  totalStarted: number;
  completionRate: number;
}

interface SequenceInstance {
  sequenceInstanceId: string;
  total: number;
  sent: number;
  scheduled: number;
  failed: number;
  progress: number;
}

export default function EmailSequenceManager() {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [activeInstances, setActiveInstances] = useState<SequenceInstance[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchSequences();
    fetchActiveInstances();
  }, []);

  const fetchSequences = async () => {
    try {
      const response = await fetch('/api/admin/email-sequences');
      if (response.ok) {
        const data = await response.json();
        setSequences(data.sequences || []);
      }
    } catch (error) {
      console.error('Failed to fetch sequences:', error);
    }
  };

  const fetchActiveInstances = async () => {
    try {
      const response = await fetch('/api/admin/email-sequences/active');
      if (response.ok) {
        const data = await response.json();
        setActiveInstances(data.instances || []);
      }
    } catch (error) {
      console.error('Failed to fetch active instances:', error);
    }
  };

  const fetchAnalytics = async (sequenceId: string) => {
    try {
      const response = await fetch(`/api/admin/email-sequences/${sequenceId}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const toggleSequence = async (sequenceId: string, action: 'start' | 'pause') => {
    try {
      const response = await fetch(`/api/admin/email-sequences/${sequenceId}/${action}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchSequences();
      }
    } catch (error) {
      console.error(`Failed to ${action} sequence:`, error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Email Sequence Manager</h2>
          <p className="text-gray-600">Automated email sequences and campaigns</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sequences</p>
              <p className="text-2xl font-bold text-gray-900">
                {sequences.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Running Instances</p>
              <p className="text-2xl font-bold text-gray-900">{activeInstances.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeInstances.reduce((sum, instance) => sum + instance.scheduled, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {sequences.length > 0 
                  ? Math.round(sequences.reduce((sum, s) => sum + s.completionRate, 0) / sequences.length)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Email Sequences */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Email Sequences</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {sequences.map((sequence) => (
              <div key={sequence.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900">{sequence.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sequence.status === 'active' ? 'bg-green-100 text-green-800' :
                      sequence.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sequence.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{sequence.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{sequence.emailCount} emails</span>
                    <span>{sequence.totalStarted} started</span>
                    <span>{sequence.completionRate}% completion rate</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedSequence(sequence.id);
                      fetchAnalytics(sequence.id);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    View Analytics
                  </button>
                  
                  {sequence.status === 'active' ? (
                    <button
                      onClick={() => toggleSequence(sequence.id, 'pause')}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleSequence(sequence.id, 'start')}
                      className="p-2 text-green-600 hover:bg-green-100 rounded"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Instances */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Running Instances</h3>
        </div>
        
        <div className="p-6">
          {activeInstances.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No active email sequences running</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeInstances.map((instance) => (
                <div key={instance.sequenceInstanceId} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Instance {instance.sequenceInstanceId.slice(-8)}</h4>
                    <span className="text-sm text-gray-600">{instance.progress}% complete</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${instance.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">{instance.sent}</span>
                      </div>
                      <p className="text-gray-600">Sent</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{instance.scheduled}</span>
                      </div>
                      <p className="text-gray-600">Scheduled</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">{instance.failed}</span>
                      </div>
                      <p className="text-gray-600">Failed</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">{instance.total}</span>
                      </div>
                      <p className="text-gray-600">Total</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Modal */}
      {analytics && selectedSequence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Sequence Analytics</h3>
                <button
                  onClick={() => {
                    setAnalytics(null);
                    setSelectedSequence('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalStarted}</p>
                  <p className="text-sm text-gray-600">Total Started</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analytics.completionRate}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analytics.averageOpenRate}%</p>
                  <p className="text-sm text-gray-600">Avg Open Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{analytics.averageClickRate}%</p>
                  <p className="text-sm text-gray-600">Avg Click Rate</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Email</th>
                      <th className="text-center py-2">Sent</th>
                      <th className="text-center py-2">Opened</th>
                      <th className="text-center py-2">Clicked</th>
                      <th className="text-center py-2">Bounced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.emailBreakdown?.map((email: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">Email {index + 1}</td>
                        <td className="text-center py-2">{email.sent}</td>
                        <td className="text-center py-2">{email.opened}</td>
                        <td className="text-center py-2">{email.clicked}</td>
                        <td className="text-center py-2">{email.bounced}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}