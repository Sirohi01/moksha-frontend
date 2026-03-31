'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader, LoadingSpinner, ActionButton } from '@/components/admin/AdminComponents';
import { cn } from "@/lib/utils";

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
    volunteer: { _id: string; name: string; email: string; phone: string };
    status: string;
    assignedAt: string;
    adminApprovalStatus?: string;
    adminRejectionReason?: string;
  }>;
}

export default function ManageTaskPage() {
  const router = useRouter();
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTask(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminApproval = async (volunteerId: string, status: 'approved' | 'rejected', reason?: string) => {
    setProcessing(volunteerId);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}/approve-volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ volunteerId, status, reason })
      });
      if (response.ok) fetchTask();
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setProcessing(null);
    }
  };

  const updateTaskStatus = async (status: string) => {
    setProcessing('task');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchTask();
    } catch (error) {
       console.error('Status update error:', error);
    } finally {
       setProcessing(null);
    }
  };

  if (loading) return <LoadingSpinner size="lg" message="Decrypting Command Intel..." />;
  if (!task) return <div className="p-8 text-center text-rose-500 font-black uppercase">Mission Node Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title={`Mission Command: ${task.taskId}`} 
        description="Oversee active assets and mission status protocols"
        icon="🕹️"
      >
        <ActionButton onClick={() => router.back()} variant="secondary" icon="⬅️">Back</ActionButton>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 space-y-10">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter">Active Assets ({task.assignedTo.length})</h3>
               <span className="text-[10px] font-black text-gold-600 uppercase tracking-widest bg-gold-50 px-4 py-2 rounded-xl">In Sector</span>
            </div>

            <div className="space-y-6">
               {task.assignedTo.map((assignment, i) => (
                  <div key={i} className="p-8 bg-[#fdfdfc] rounded-[2.5rem] border border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-navy-950 text-gold-500 flex items-center justify-center text-xl font-black shadow-lg">
                           {assignment.volunteer.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-xl font-black text-navy-950 uppercase tracking-tighter">{assignment.volunteer.name}</h4>
                           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{assignment.volunteer.email}</p>
                           <div className="flex gap-2 pt-2">
                              <span className={cn("px-4 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest", 
                                 assignment.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'
                              )}>Volunteer: {assignment.status}</span>
                              <span className={cn("px-4 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest", 
                                 assignment.adminApprovalStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                                 assignment.adminApprovalStatus === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-gold-50 text-gold-600'
                              )}>Admin: {assignment.adminApprovalStatus || 'pending'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        {assignment.adminApprovalStatus !== 'approved' && (
                           <button 
                             onClick={() => handleAdminApproval(assignment.volunteer._id, 'approved')}
                             disabled={processing === assignment.volunteer._id}
                             className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-30 active:scale-95"
                           >
                             Approve
                           </button>
                        )}
                        {assignment.adminApprovalStatus !== 'rejected' && (
                           <button 
                             onClick={() => handleAdminApproval(assignment.volunteer._id, 'rejected', 'Does not meet requirements')}
                             disabled={processing === assignment.volunteer._id}
                             className="px-6 py-3 bg-white border border-stone-100 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 disabled:opacity-30 active:scale-95"
                           >
                             Reject
                           </button>
                        )}
                     </div>
                  </div>
               ))}
               {task.assignedTo.length === 0 && <p className="text-center text-stone-400 font-black uppercase text-[10px] py-20">Secure Mission Area: No Assets Deployed</p>}
            </div>
          </div>
        </div>

        {/* Status Control Panel */}
        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 space-y-10">
              <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter">Mission Status</h3>
              
              <div className="space-y-3">
                 {['assigned', 'in_progress', 'completed', 'overdue', 'cancelled'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => updateTaskStatus(status)}
                      disabled={processing === 'task'}
                      className={cn(
                        "w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group",
                        task.overallStatus === status ? "border-gold-500 bg-gold-50" : "border-stone-50 hover:border-navy-950 bg-white"
                      )}
                    >
                       <span className="text-[10px] font-black text-navy-950 uppercase tracking-widest">{status.replace('_', ' ')}</span>
                       <div className={cn(
                         "w-4 h-4 rounded-full border-4 transition-all",
                         task.overallStatus === status ? "bg-gold-500 border-navy-950 scale-110" : "bg-stone-50 border-stone-100"
                       )} />
                    </button>
                 ))}
              </div>

              <div className="pt-8 border-t border-stone-100">
                 <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-relaxed">
                    * Modifying mission status will synchronize all metadata across assets and intelligence logs.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
