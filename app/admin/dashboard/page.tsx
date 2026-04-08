'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { PageHeader, StatsCard, LoadingSpinner, Alert, ActionButton } from '@/components/admin/AdminComponents';
import {
  FileText,
  Users,
  Heart,
  PhoneCall,
  MessageSquare,
  UserPlus,
  Star,
  RefreshCw,
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Database,
  Mail,
  CreditCard,
  HardDrive,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Stats {
  totalReports: number;
  totalVolunteers: number;
  totalDonations: number;
  totalContacts: number;
  totalFeedback: number;
  totalBoardApplications: number;
  totalLegacyGiving: number;
  totalSchemes: number;
  totalExpansionRequests: number;
}

// Gold & Ivory Palette for Charts
const COLORS = ['#D4AF37', '#9D7F2A', '#1C1917', '#44403C', '#78716C'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getStats();
      if (response && response.success && response.data) {
        const { overview } = response.data;
        setStats({
          totalReports: overview.totalReports || 0,
          totalVolunteers: overview.totalVolunteers || 0,
          totalDonations: overview.totalDonations || 0,
          totalContacts: overview.totalContacts || 0,
          totalFeedback: overview.totalFeedback || 0,
          totalBoardApplications: overview.totalBoardApplications || 0,
          totalLegacyGiving: overview.totalLegacyRequests || 0,
          totalSchemes: overview.totalSchemeApplications || 0,
          totalExpansionRequests: overview.totalExpansionRequests || 0,
        });
      }
    } catch (err: any) {
      console.error('Dashboard synchronization failure:', err);
      setError(err.message || 'Failed to initialize mission intelligence deck');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" message="Synchronizing Tactical Deck..." />;
  if (error) return <Alert type="error" title="Critical Interface Failure" message={error} onClose={() => setError('')} />;
  if (!stats) return null;

  const principalNodes = [
    { title: 'Operational Reports', count: stats.totalReports, icon: <FileText className="w-5 h-5" />, href: '/admin/reports', change: '+12.4%', changeType: 'positive' as const },
    { title: 'Personnel Clusters', count: stats.totalVolunteers, icon: <Users className="w-5 h-5" />, href: '/admin/volunteers', change: '+5.2%', changeType: 'positive' as const },
    { title: 'Capital Infusion', count: stats.totalDonations, icon: <Heart className="w-5 h-5" />, href: '/admin/donations', change: '+24.1%', changeType: 'positive' as const },
    { title: 'Inbound Signals', count: stats.totalContacts, icon: <PhoneCall className="w-5 h-5" />, href: '/admin/contacts', change: '-2.1%', changeType: 'negative' as const },
  ];

  const auxiliaryNodes = [
    { title: 'Feedback Loop', count: stats.totalFeedback, icon: <MessageSquare className="w-4 h-4" />, href: '/admin/feedback' },
    { title: 'Board Applications', count: stats.totalBoardApplications, icon: <UserPlus className="w-4 h-4" />, href: '/admin/board' },
    { title: 'Legacy Streams', count: stats.totalLegacyGiving, icon: <Star className="w-4 h-4" />, href: '/admin/legacy' },
    { title: 'Growth Node', count: stats.totalExpansionRequests, icon: <TrendingUp className="w-4 h-4" />, href: '/admin/expansion' },
  ];

  const chartData = [
    { name: 'Reports', value: stats.totalReports, fill: '#D4AF37' },
    { name: 'Personnel', value: stats.totalVolunteers, fill: '#1C1917' },
    { name: 'Capital', value: stats.totalDonations, fill: '#9D7F2A' },
    { name: 'Signals', value: stats.totalContacts, fill: '#78716C' },
  ];

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-1000 slide-in-from-bottom-2">
      <PageHeader
        title="Mission Intelligence"
        description="Global operation status and high-fidelity project trajectory monitoring."
        icon={<LayoutDashboard className="w-8 h-8" />}
      >
        <div className="flex gap-4">
          <ActionButton onClick={fetchDashboardData} variant="secondary" icon={<RefreshCw className="w-3.5 h-3.5" />}>
            SYNC DECK
          </ActionButton>
        </div>
      </PageHeader>

      {/* Primary Intelligence Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
        {principalNodes.map((node) => (
          <Link key={node.title} href={node.href} className="group block h-full">
            <StatsCard
              title={node.title}
              value={node.count}
              icon={node.icon}
              change={node.change}
              changeType={node.changeType}
            />
          </Link>
        ))}
      </div>

      {/* Auxiliary Tactical Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {auxiliaryNodes.map((node) => (
          <Link key={node.title} href={node.href} className="group flex flex-col bg-white/50 backdrop-blur-sm p-6 sm:p-8 rounded-[2.5rem] border border-stone-200/40 hover:border-gold-500/20 shadow-sm hover:shadow-2xl transition-all duration-700">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center text-stone-900 group-hover:bg-stone-950 group-hover:text-gold-400 shadow-sm transition-all mb-4 sm:mb-6 relative">
              {node.icon}
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gold-400 group-hover:animate-ping opacity-0 group-hover:opacity-100"></div>
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1.5 sm:mb-2">{node.title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-black text-stone-950 uppercase tracking-tighter leading-none group-hover:text-gold-600 transition-colors">{node.count}</p>
              <Zap className="w-2.5 h-2.5 sm:w-3 h-3 text-gold-400 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* Visualization Core */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl border border-stone-200/40 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gold-400/5 rounded-full blur-[80px] sm:blur-[100px] -mr-32 -mt-32"></div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 sm:mb-10 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <p className="text-[10px] sm:text-[11px] font-black text-gold-600 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Propulsion Matrix</p>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 uppercase italic tracking-tighter leading-none p-1">Operational Flux</h3>
            </div>
            <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-stone-50 border border-stone-100 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-500 w-fit">Current Phase</div>
          </div>

          <div className="h-[250px] sm:h-[280px] lg:h-[320px] relative z-10 -ml-2 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 900, fill: '#78716C' }} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94A3B8' }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '24px', backgroundColor: '#fff', border: '1px solid rgba(212,175,55,0.2)', color: '#1C1917', padding: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#D4AF37', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={window?.innerWidth < 640 ? 24 : 40} fill="#D4AF37">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl border border-stone-200/40 group overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-30"></div>

          <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <Activity className="w-3.5 h-3.5 text-gold-600" />
                <p className="text-[10px] sm:text-[11px] font-black text-gold-600 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Engagement Hub</p>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-950 uppercase italic tracking-tighter leading-none p-1">Mission Spread</h3>
            </div>
          </div>

          <div className="h-[250px] sm:h-[280px] lg:h-[320px] relative z-10 flex flex-col items-center justify-center">
            <div className="w-full h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={window?.innerWidth < 640 ? 40 : 60} outerRadius={window?.innerWidth < 640 ? 70 : 100} paddingAngle={8} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:scale-105 transition-transform origin-center duration-500" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <p className="text-[8px] sm:text-[10px] font-black text-stone-400 uppercase tracking-widest">Aggregate</p>
                <p className="text-xl sm:text-3xl font-black text-stone-900 tracking-tighter">100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Infrastructure Node Terminal */}
      <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 lg:p-14 shadow-2xl border border-stone-200/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gold-400/5 rounded-full blur-[100px] sm:blur-[150px] -mr-48 -mt-48"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-6 sm:space-y-8 self-center">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-3 text-gold-600 font-black text-[10px] uppercase tracking-[0.4em] animate-in slide-in-from-left duration-1000">
                <ShieldCheck className="w-4 h-4 animate-pulse" />
                Mission Perimeter Secured
              </div>
              <h3 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tighter italic uppercase leading-none py-1">
                Infrastructure <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-700">Terminal Nodes</span>
              </h3>
            </div>
            <p className="text-stone-500 font-bold leading-relaxed max-w-lg text-[11px] sm:text-[12px] uppercase tracking-[0.1em] border-l-2 border-gold-500/30 pl-6 italic">
              High-fidelity heartbeat detection across core sectors and tactical database clusters.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Optimal</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400"></div>
                <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">v1.2.4 Static</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Tactical DB Node', icon: <Database className="w-4 h-4" />, status: 'Calibrated' },
              { name: 'Secure SMTP Gear', icon: <Mail className="w-4 h-4" />, status: 'Calibrated' },
              { name: 'Ledger Vault', icon: <CreditCard className="w-4 h-4" />, status: 'Calibrated' },
              { name: 'Visual Cluster', icon: <HardDrive className="w-4 h-4" />, status: 'Calibrated' },
            ].map((node) => (
              <div key={node.name} className="flex flex-col justify-between p-6 sm:p-7 bg-[#FAF9F6] border border-stone-100 rounded-[2rem] hover:border-gold-500/20 hover:shadow-xl transition-all duration-700 group/node cursor-crosshair transform hover:-translate-y-1">
                <div className="text-gold-600 group-hover/node:scale-110 transition-transform duration-500 mb-6 p-2.5 bg-white border border-stone-100 w-fit rounded-xl shadow-sm">{node.icon}</div>
                <div className="space-y-3">
                  <span className="text-[11px] font-black tracking-[0.15em] text-stone-800 uppercase block">{node.name}</span>
                  <div className="flex items-center justify-between border-t border-stone-200/50 pt-3">
                    <span className="text-[9px] font-black text-stone-400 tracking-widest uppercase italic">{node.status}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover/node:animate-ping"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}