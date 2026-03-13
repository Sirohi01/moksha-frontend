'use client';

import AdminRegistrationForm from '@/components/admin/AdminRegistrationForm';

export default function RegisterUserPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin User Registration</h1>
          <p className="text-gray-600 mt-2">Register a new admin user with IP restrictions</p>
        </div>
        
        <AdminRegistrationForm />
        
        <div className="max-w-md mx-auto mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">IP Address Guide:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>0.0.0.0</strong> - Allow access from any IP (least secure)</li>
            <li>• <strong>127.0.0.1</strong> - Only localhost access</li>
            <li>• <strong>Your Current IP</strong> - Only your current network</li>
            <li>• <strong>Specific IPs</strong> - Add multiple IPs for different locations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}