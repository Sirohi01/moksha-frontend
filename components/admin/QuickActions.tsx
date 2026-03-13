'use client';

import { Plus, Users, Heart, Calendar, FileText, Mail, Settings, Download } from 'lucide-react';

const quickActions = [
  {
    title: 'Add New User',
    description: 'Create a new user account',
    icon: Plus,
    color: 'bg-blue-600 hover:bg-blue-700',
    action: () => alert('Add user functionality coming soon'),
  },
  {
    title: 'Manage Volunteers',
    description: 'Review volunteer applications',
    icon: Users,
    color: 'bg-green-600 hover:bg-green-700',
    action: () => alert('Manage volunteers functionality coming soon'),
  },
  {
    title: 'Process Donations',
    description: 'Review pending donations',
    icon: Heart,
    color: 'bg-red-600 hover:bg-red-700',
    action: () => alert('Process donations functionality coming soon'),
  },
  {
    title: 'Schedule Service',
    description: 'Schedule a new service',
    icon: Calendar,
    color: 'bg-purple-600 hover:bg-purple-700',
    action: () => alert('Schedule service functionality coming soon'),
  },
  {
    title: 'Generate Report',
    description: 'Create monthly report',
    icon: FileText,
    color: 'bg-orange-600 hover:bg-orange-700',
    action: () => alert('Generate report functionality coming soon'),
  },
  {
    title: 'Send Newsletter',
    description: 'Send newsletter to subscribers',
    icon: Mail,
    color: 'bg-teal-600 hover:bg-teal-700',
    action: () => alert('Send newsletter functionality coming soon'),
  },
  {
    title: 'System Settings',
    description: 'Configure system settings',
    icon: Settings,
    color: 'bg-gray-600 hover:bg-gray-700',
    action: () => alert('System settings functionality coming soon'),
  },
  {
    title: 'Export Data',
    description: 'Export data to CSV',
    icon: Download,
    color: 'bg-indigo-600 hover:bg-indigo-700',
    action: () => alert('Export data functionality coming soon'),
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Frequently used actions
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-4 rounded-lg transition-colors text-left group`}
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90 mt-1">{action.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}