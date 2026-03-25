import { Metadata } from 'next';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentActivity from '@/components/admin/RecentActivity';
import QuickActions from '@/components/admin/QuickActions';
import AnalyticsChart from '@/components/admin/AnalyticsChart';

import { PageHeader } from '@/components/admin/AdminComponents';
import { Layout } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Admin | Moksha Sewa',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-12 max-w-[1600px] mx-auto">
      <PageHeader 
        title="Command Core" 
        description="Global system telemetry and operational command center."
        icon={<Layout className="w-8 h-8" />}
      />

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart />
        <QuickActions />
      </div>

      <RecentActivity />
    </div>
  );
}