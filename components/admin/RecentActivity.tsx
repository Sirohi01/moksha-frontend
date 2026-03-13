'use client';

import { Heart, Users, Calendar, Mail, AlertCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'donation',
    title: 'New donation received',
    description: 'Rajesh Kumar donated ₹5,000 for emergency services',
    time: '2 minutes ago',
    icon: Heart,
    color: 'text-green-600 bg-green-100',
  },
  {
    id: 2,
    type: 'volunteer',
    title: 'Volunteer application',
    description: 'Priya Sharma applied to become a volunteer',
    time: '15 minutes ago',
    icon: Users,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 3,
    type: 'service',
    title: 'Service completed',
    description: 'Cremation service completed for case #CR-2024-156',
    time: '1 hour ago',
    icon: Calendar,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    id: 4,
    type: 'contact',
    title: 'New contact inquiry',
    description: 'Someone submitted a contact form inquiry',
    time: '2 hours ago',
    icon: Mail,
    color: 'text-orange-600 bg-orange-100',
  },
  {
    id: 5,
    type: 'alert',
    title: 'System alert',
    description: 'Monthly report generation completed',
    time: '3 hours ago',
    icon: AlertCircle,
    color: 'text-red-600 bg-red-100',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Latest updates and activities
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {activity.time}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all activities
          </button>
        </div>
      </div>
    </div>
  );
}