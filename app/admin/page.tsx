import { Metadata } from 'next';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentActivity from '@/components/admin/RecentActivity';
import QuickActions from '@/components/admin/QuickActions';
import AnalyticsChart from '@/components/admin/AnalyticsChart';

export const metadata: Metadata = {
  title: 'Dashboard | Admin | Moksha Seva',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to the Moksha Seva admin dashboard
        </p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart />
        <QuickActions />
      </div>

      <RecentActivity />
    </div>
  );
}