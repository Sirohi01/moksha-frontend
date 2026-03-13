'use client';

import { TrendingUp, TrendingDown, Users, Heart, Calendar, DollarSign } from 'lucide-react';

const stats = [
  {
    title: 'Total Donations',
    value: '₹12,45,678',
    change: '+12.5%',
    trend: 'up',
    icon: Heart,
    period: 'vs last month',
  },
  {
    title: 'Active Volunteers',
    value: '234',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    period: 'vs last month',
  },
  {
    title: 'Services Completed',
    value: '1,456',
    change: '+15.3%',
    trend: 'up',
    icon: Calendar,
    period: 'vs last month',
  },
  {
    title: 'Monthly Revenue',
    value: '₹3,45,890',
    change: '-2.1%',
    trend: 'down',
    icon: DollarSign,
    period: 'vs last month',
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {stat.change}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.period}</div>
          </div>
        </div>
      ))}
    </div>
  );
}