'use client';

import { useState } from 'react';
import SystemConfiguration from '@/components/admin/SystemConfiguration';
import AdvancedSecurity from '@/components/admin/AdvancedSecurity';
import DataExportImport from '@/components/admin/DataExportImport';
import AdvancedSearch from '@/components/admin/AdvancedSearch';
import PerformanceOptimization from '@/components/admin/PerformanceOptimization';
import MobileOptimization from '@/components/admin/MobileOptimization';
import TestingQA from '@/components/admin/TestingQA';

export default function SystemManagement() {
  const [activeTab, setActiveTab] = useState('configuration');

  const tabs = [
    { id: 'configuration', label: 'System Config', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'mobile', label: 'Mobile', icon: '📱' },
    { id: 'testing', label: 'Testing', icon: '🧪' },
    { id: 'data', label: 'Data Management', icon: '📊' },
    { id: 'search', label: 'Search Tools', icon: '🔍' }
  ];

  const searchableFields = [
    { key: 'name', label: 'Name', type: 'text' as const },
    { key: 'email', label: 'Email', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' }
    ]},
    { key: 'createdAt', label: 'Created Date', type: 'date' as const },
    { key: 'amount', label: 'Amount', type: 'number' as const }
  ];

  const availableFields = [
    { key: 'id', label: 'ID', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'phone', label: 'Phone', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
    { key: 'updatedAt', label: 'Updated Date', type: 'date' }
  ];

  const handleSearch = (filters: any[]) => {
    console.log('Search filters:', filters);
    // Implement search logic
  };

  const handleClearSearch = () => {
    console.log('Clear search');
    // Implement clear logic
  };

  const handleExport = async (options: any) => {
    console.log('Export options:', options);
    // Implement export logic
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export
  };

  const handleImport = async (file: File, options: any) => {
    console.log('Import file:', file.name, 'Options:', options);
    // Implement import logic
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate import
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔧 System Management</h1>
          <p className="text-gray-600">Advanced system configuration and management tools</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'configuration' && <SystemConfiguration />}
          {activeTab === 'security' && <AdvancedSecurity />}
          {activeTab === 'performance' && <PerformanceOptimization />}
          {activeTab === 'mobile' && <MobileOptimization />}
          {activeTab === 'testing' && <TestingQA />}
          {activeTab === 'data' && (
            <DataExportImport
              entityType="System Data"
              availableFields={availableFields}
              onExport={handleExport}
              onImport={handleImport}
            />
          )}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">🔍 Advanced Search Tools</h3>
                <p className="text-gray-600 mb-6">Test and configure advanced search functionality</p>
              </div>
              <AdvancedSearch
                searchableFields={searchableFields}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                placeholder="Search across all system data..."
              />
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-800 font-medium mb-2">📋 Search Features</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Global search across all data types</li>
                  <li>• Advanced filtering with multiple conditions</li>
                  <li>• Saved search queries for quick access</li>
                  <li>• Auto-complete suggestions</li>
                  <li>• Search result highlighting</li>
                  <li>• Export search results</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}