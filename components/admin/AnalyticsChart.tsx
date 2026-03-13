'use client';

import { TrendingUp } from 'lucide-react';

// Mock data for the chart
const chartData = [
  { month: 'Jan', donations: 45000, volunteers: 12, services: 8 },
  { month: 'Feb', donations: 52000, volunteers: 15, services: 12 },
  { month: 'Mar', donations: 48000, volunteers: 18, services: 15 },
  { month: 'Apr', donations: 61000, volunteers: 22, services: 18 },
  { month: 'May', donations: 55000, volunteers: 25, services: 20 },
  { month: 'Jun', donations: 67000, volunteers: 28, services: 25 },
];

export default function AnalyticsChart() {
  const maxDonations = Math.max(...chartData.map(d => d.donations));
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Donation Trends
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monthly donation overview
            </p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div
              key={data.month}
              className="flex items-center gap-4 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-8 text-sm text-gray-600 dark:text-gray-400">
                {data.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-900 dark:text-white">
                    ₹{(data.donations / 1000).toFixed(0)}k
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {data.services} services
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full animate-progress"
                    style={{ 
                      width: `${(data.donations / maxDonations) * 100}%`,
                      animationDelay: `${300 + index * 100}ms`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Total Raised</p>
              <p className="font-semibold text-gray-900 dark:text-white">₹3,28,000</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Avg/Month</p>
              <p className="font-semibold text-gray-900 dark:text-white">₹54,667</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Growth</p>
              <p className="font-semibold text-green-600">+12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}