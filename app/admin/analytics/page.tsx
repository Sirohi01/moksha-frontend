import { Metadata } from 'next';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Analytics | Admin | Moksha Sewa',
  description: 'Comprehensive analytics and insights for Moksha Sewa operations',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive insights and performance metrics
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}