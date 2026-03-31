'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader, LoadingSpinner, ActionButton } from '@/components/admin/AdminComponents';

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
  assignedBy: { name: string; email: string };
  location?: { address: string; city: string; state?: string; pincode?: string };
  contactPerson?: { name: string; phone: string; email?: string };
  assignedTo: Array<{
    volunteer: { _id: string; name: string; email: string; phone: string };
    status: string;
    assignedAt: string;
  }>;
}

export default function ViewTaskPage() {
  const router = useRouter();
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner size="lg" message="Decrypting Task Intel..." />;
  if (!task) return <div className="p-8 text-center text-rose-500 font-black uppercase">Mission Profile Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title={`Mission Archive: ${task.taskId}`} 
        description="Comprehensive intelligence and volunteer assignment data"
        icon="📋"
      >
        <div className="flex gap-4">
          <ActionButton onClick={() => router.push(`/admin/tasks/${taskId}/manage`)} variant="primary" icon="⚙️">Manage Mission</ActionButton>
          <ActionButton onClick={() => router.back()} variant="secondary" icon="⬅️">Back</ActionButton>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Intel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 lg:p-14 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h1 className="text-4xl font-black text-navy-950 uppercase tracking-tighter leading-none">{task.title}</h1>
              <div className="flex gap-3">
                 <span className="px-5 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{task.priority}</span>
                 <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{task.overallStatus}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4">Mission Parameters</h4>
              <p className="text-navy-700 leading-relaxed font-medium italic border-l-4 border-gold-600 pl-8 py-2">
                {task.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="p-8 bg-[#fdfdfc] rounded-[2rem] border border-stone-50">
                 <h5 className="text-[9px] font-black text-gold-600 uppercase tracking-widest mb-4">Operational Zone</h5>
                 <p className="text-navy-900 font-bold text-lg">
                    {task.location?.address}<br/>
                    {task.location?.city}, {task.location?.state} {task.location?.pincode}
                 </p>
              </div>
              <div className="p-8 bg-[#fdfdfc] rounded-[2rem] border border-stone-50">
                 <h5 className="text-[9px] font-black text-gold-600 uppercase tracking-widest mb-4">Local Liaison</h5>
                 <p className="text-navy-900 font-bold text-lg">{task.contactPerson?.name}</p>
                 <p className="text-navy-500 font-medium">{task.contactPerson?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel: Deployment */}
        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 space-y-8">
              <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter">Deployment Intel</h3>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold-50 flex items-center justify-center text-gold-600">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Assigned Deadline</p>
                       <p className="text-navy-900 font-bold">{new Date(task.dueDate).toLocaleString('en-IN')}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-600">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Estimated Duration</p>
                       <p className="text-navy-900 font-bold">{task.estimatedDuration} Operational Hours</p>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-stone-100">
                 <h4 className="text-[10px] font-black text-navy-950 uppercase tracking-[0.2em] mb-6">Assigned Assets</h4>
                 <div className="space-y-4">
                    {task.assignedTo.map((asset, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-navy-950 text-gold-500 flex items-center justify-center text-[10px] font-black">{asset.volunteer.name.charAt(0)}</div>
                             <p className="text-[11px] font-bold text-navy-900">{asset.volunteer.name}</p>
                          </div>
                          <span className="text-[8px] font-black uppercase text-gold-600">{asset.status}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
