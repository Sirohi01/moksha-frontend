'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  }>;
  assignedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function TasksManagement() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  useEffect(() => {
    fetchTasks();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest';
      case 'in_progress': return 'bg-blue-100 text-blue-800 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest';
      case 'assigned': return 'bg-yellow-100 text-yellow-800 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest';
      case 'overdue': return 'bg-red-100 text-red-800 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest';
      default: return 'bg-gray-100 text-gray-800 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 font-black px-4 py-1.5 rounded-lg border border-red-100 text-[10px] uppercase tracking-widest bg-red-50';
      case 'high': return 'text-orange-500 font-black px-4 py-1.5 rounded-lg border border-orange-100 text-[10px] uppercase tracking-widest bg-orange-50';
      case 'medium': return 'text-gold-600 font-black px-4 py-1.5 rounded-lg border border-gold-100 text-[10px] uppercase tracking-widest bg-gold-50';
      case 'low': return 'text-emerald-500 font-black px-4 py-1.5 rounded-lg border border-emerald-100 text-[10px] uppercase tracking-widest bg-emerald-50';
      default: return 'text-gray-500 font-black px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-widest';
    }
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toUpperCase();
  };

  if (loading && tasks.length === 0) {
    return <LoadingSpinner size="lg" message="Synchronizing Mission Intel..." />;
  }

  const columns = [
    {
      key: 'task',
      label: 'Mission Detail',
      render: (_value: any, task: Task) => (
        <div className="py-4 space-y-2">
          <div className="text-lg font-black text-navy-950 uppercase tracking-tighter italic">{task.title}</div>
          <div className="flex gap-4 items-center">
             <div className="text-[9px] font-black p-1 px-3 bg-stone-50 rounded-lg text-stone-400 tracking-widest border border-stone-100">{task.taskId}</div>
             <p className="text-[9px] font-black text-gold-600 uppercase tracking-widest italic">{formatCategory(task.category)}</p>
          </div>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Operational Status',
      render: (_value: any, task: Task) => (
        <div className="flex flex-col gap-3 py-4">
          <span className={getPriorityColor(task.priority)}>{task.priority} Priority</span>
          <span className={getStatusColor(task.overallStatus)}>{task.overallStatus.replace('_', ' ')}</span>
        </div>
      )
    },
    {
      key: 'assignment',
      label: 'Deployed Assets',
      render: (_value: any, task: Task) => (
        <div className="py-4">
          {task.assignedTo.length > 0 ? (
            <div className="flex -space-x-4">
              {task.assignedTo.slice(0, 3).map((assignment, index) => (
                <div key={index} className="w-10 h-10 rounded-full border-4 border-white bg-navy-950 text-gold-500 flex items-center justify-center font-black text-[10px] shadow-xl" title={assignment.volunteer.name}>
                  {assignment.volunteer.name.charAt(0)}
                </div>
              ))}
              {task.assignedTo.length > 3 && (
                <div className="w-10 h-10 rounded-full border-4 border-white bg-gold-400 text-gold-950 flex items-center justify-center font-black text-[10px] shadow-xl">
                  +{task.assignedTo.length - 3}
                </div>
              )}
            </div>
          ) : (
            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">No Active Assets</span>
          )}
        </div>
      )
    },
    {
      key: 'timeline',
      label: 'Operational Window',
      render: (_value: any, task: Task) => (
        <div className="py-4">
          <div className="text-[10px] font-black text-navy-950 uppercase tracking-widest">Window Deadline:</div>
          <p className="text-sm font-bold text-navy-500 mb-2">{new Date(task.dueDate).toLocaleDateString('en-IN')}</p>
          <div className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">{task.estimatedDuration} hrs Duration</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Intelligence Actions',
      render: (_value: any, task: Task) => (
        <div className="flex gap-2">
          <ActionButton onClick={() => router.push(`/admin/tasks/${task._id}/view`)} variant="secondary" size="sm">Archive</ActionButton>
          <ActionButton onClick={() => router.push(`/admin/tasks/${task._id}/assign`)} variant="primary" size="sm">Deploy</ActionButton>
          <ActionButton onClick={() => router.push(`/admin/tasks/${task._id}/manage`)} variant="secondary" size="sm">Command</ActionButton>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* Page Header */}
      <PageHeader
        title="Mission Command"
        description="Oversee active volunteer initiatives and strategic deployments"
        icon="🎯"
      >
        <ActionButton
          onClick={() => router.push('/admin/tasks/create')}
          variant="primary"
          icon="➕"
        >
          Initialize Mission
        </ActionButton>

      </PageHeader>

      {/* Stats Cards Dashboard Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatsCard
          title="Active Deployment"
          value={stats.assigned || 0}
          icon="📋"
          gradient="from-navy-950 to-navy-900 text-gold-500"
          change="+5%"
          changeType="positive"
        />
        <StatsCard
          title="Operational Missions"
          value={stats.in_progress || 0}
          icon="⚡"
          gradient="from-gold-600 to-gold-500 text-navy-950"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Mission Archive"
          value={stats.completed || 0}
          icon="✅"
          gradient="from-stone-50 to-white text-navy-950"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Sync Warnings"
          value={stats.overdue || 0}
          icon="⚠️"
          gradient="from-rose-50 to-rose-100 text-rose-600"
          change="-2%"
          changeType="negative"
        />
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl border border-stone-100 p-8 space-y-12">
          {/* Filters Engine */}
          <div className="flex flex-wrap items-end gap-6 pb-6 border-b border-stone-50">
             <div className="flex-1 min-w-[200px] space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Status Protocol</label>
                <select
                   value={filters.status}
                   onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                   className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-navy-950/5 focus:border-navy-900 transition-all font-bold uppercase text-[10px] tracking-widest appearance-none"
                >
                   <option value="">All Statuses</option>
                   <option value="assigned">Assigned</option>
                   <option value="in_progress">In Progress</option>
                   <option value="completed">Completed</option>
                </select>
             </div>
             <div className="flex-1 min-w-[200px] space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Priority Level</label>
                <select
                   value={filters.priority}
                   onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                   className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-navy-950/5 focus:border-navy-900 transition-all font-bold uppercase text-[10px] tracking-widest appearance-none"
                >
                   <option value="">All Priorities</option>
                   <option value="urgent">Urgent</option>
                   <option value="high">High</option>
                </select>
             </div>
             <ActionButton onClick={() => fetchTasks()} variant="primary" size="lg">Refresh Intel</ActionButton>
          </div>

          {/* Intelligence Table */}
          <DataTable
            columns={columns}
            data={tasks}
            loading={loading}
            emptyMessage="No available missions found."
            pagination={{
              currentPage: currentPage,
              totalPages: totalPages
            }}
            onPageChange={setCurrentPage}
          />
      </div>
    </div>
  );
}