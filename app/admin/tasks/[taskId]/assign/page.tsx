'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader, LoadingSpinner, ActionButton } from '@/components/admin/AdminComponents';
import { cn } from "@/lib/utils";

interface Task {
  _id: string;
  taskId: string;
  title: string;
  category: string;
  assignedTo: Array<{
    volunteer: { _id: string; name: string; email: string; phone: string };
    status: string;
    assignedAt: string;
  }>;
}

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function AssignTaskPage() {
  const router = useRouter();
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTaskAndVolunteers();
  }, [taskId]);

  const fetchTaskAndVolunteers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [tRes, vRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers?status=active`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (tRes.ok && vRes.ok) {
        const tData = await tRes.json();
        const vData = await vRes.json();
        setTask(tData.data);
        setVolunteers(vData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (selectedVolunteers.length === 0) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ volunteerIds: selectedVolunteers })
      });
      if (response.ok) router.push('/admin/tasks');
    } catch (error) {
       console.error('Assignment error:', error);
    } finally {
       setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" message="Synchronizing Personnel Intel..." />;
  if (!task) return <div className="p-8 text-center text-rose-500 font-black uppercase">Mission Node Not Found</div>;

  const currentVolunteerIds = task.assignedTo.map(a => a.volunteer._id);
  const availableVolunteers = volunteers.filter(v => !currentVolunteerIds.includes(v._id));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title={`Personnel Deployment: ${task.taskId}`} 
        description="Select and authorize additional assets for the mission"
        icon="👮"
      >
        <ActionButton onClick={() => router.back()} variant="secondary" icon="⬅️">Back</ActionButton>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 space-y-8">
            <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter">Mission Intel</h3>
            <div className="space-y-4">
               <h4 className="text-2xl font-black text-gold-600 uppercase tracking-tighter italic">{task.title}</h4>
               <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Sector: {task.category.toUpperCase().replace('_', ' ')}</p>
            </div>
            
            <div className="pt-8 border-t border-stone-100">
               <h4 className="text-[10px] font-black text-navy-950 uppercase tracking-widest mb-6 uppercase">Active Deployment ({task.assignedTo.length})</h4>
               <div className="space-y-4">
                  {task.assignedTo.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-[#fdfdfc] rounded-2xl border border-stone-50">
                       <div className="w-10 h-10 rounded-full bg-navy-950 text-gold-500 flex items-center justify-center font-black">{a.volunteer.name.charAt(0)}</div>
                       <div>
                          <p className="text-[11px] font-bold text-navy-900">{a.volunteer.name}</p>
                          <p className="text-[9px] text-stone-400 uppercase tracking-widest">{a.volunteer.email}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Selection Area */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 space-y-10 flex flex-col h-full min-h-[60vh]">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter">Available Assets</h3>
                <span className="text-[10px] font-black text-gold-600 uppercase tracking-widest bg-gold-50 px-4 py-2 rounded-xl">{availableVolunteers.length} Ready</span>
             </div>

             <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar max-h-[40vh]">
                {availableVolunteers.map((volunteer) => (
                   <div 
                     key={volunteer._id}
                     onClick={() => {
                        if (selectedVolunteers.includes(volunteer._id)) setSelectedVolunteers(selectedVolunteers.filter(id => id !== volunteer._id));
                        else setSelectedVolunteers([...selectedVolunteers, volunteer._id]);
                     }}
                     className={cn(
                       "p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                       selectedVolunteers.includes(volunteer._id) ? "border-gold-500 bg-gold-50" : "border-stone-100 hover:border-navy-950"
                     )}
                   >
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all",
                           selectedVolunteers.includes(volunteer._id) ? "bg-navy-950 text-gold-500" : "bg-stone-50 text-stone-400"
                         )}>
                            {volunteer.name.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-navy-950 uppercase tracking-tighter">{volunteer.name}</p>
                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{volunteer.email}</p>
                         </div>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-4 transition-all",
                        selectedVolunteers.includes(volunteer._id) ? "bg-gold-500 border-navy-950 scale-110 shadow-lg" : "border-stone-100"
                      )} />
                   </div>
                ))}
                {availableVolunteers.length === 0 && <p className="text-center text-stone-400 font-black uppercase text-[10px] py-12">No Ready Assets Found</p>}
             </div>

             <div className="pt-10 border-t border-stone-100 space-y-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-navy-950/40">
                   <span>Selected Assets:</span>
                   <span className="text-gold-600">{selectedVolunteers.length} Units</span>
                </div>
                <button 
                  onClick={handleAssign}
                  disabled={submitting || selectedVolunteers.length === 0}
                  className="w-full bg-navy-950 text-gold-500 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl shadow-navy-100 disabled:opacity-30 disabled:scale-95 active:scale-95"
                >
                   {submitting ? 'Authorization in Progress...' : 'Authorize Personnel Deployment'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
