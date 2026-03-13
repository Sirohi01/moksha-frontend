'use client';

import { useState, useEffect } from 'react';
import { settingsAPI } from '@/lib/api';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    ipWhitelistEnabled: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    fromName: string;
    fromEmail: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    retentionDays: number;
    lastBackup: string;
  };
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await settingsAPI.getSettings();
      setSettings(data.data);
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
      setError(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await settingsAPI.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      await settingsAPI.backupSettings();
      alert('Backup initiated successfully!');
      fetchSettings(); // Refresh to get updated last backup time
    } catch (error: any) {
      console.error('Failed to initiate backup:', error);
      alert('Failed to initiate backup: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Settings</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchSettings}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">No settings data available</p>
          <button
            onClick={fetchSettings}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Settings
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'backup', name: 'Backup', icon: '💾' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
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
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, supportEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, maintenanceMode: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Minimum Length</label>
                <input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireTwoFactor"
                    checked={settings.security.requireTwoFactor}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, requireTwoFactor: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireTwoFactor" className="ml-2 block text-sm text-gray-900">
                    Require Two-Factor Authentication
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ipWhitelistEnabled"
                    checked={settings.security.ipWhitelistEnabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, ipWhitelistEnabled: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ipWhitelistEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable IP Whitelist
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpHost: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPort: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP User</label>
                <input
                  type="email"
                  value={settings.email.smtpUser}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, smtpUser: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, fromName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                  <input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, fromEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsNotifications: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                    SMS Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-900">
                    Push Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="adminAlerts"
                    checked={settings.notifications.adminAlerts}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, adminAlerts: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="adminAlerts" className="ml-2 block text-sm text-gray-900">
                    Admin Alerts
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={settings.backup.autoBackup}
                  onChange={(e) => setSettings({
                    ...settings,
                    backup: { ...settings.backup, autoBackup: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-900">
                  Enable Automatic Backup
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    value={settings.backup.backupFrequency}
                    onChange={(e) => setSettings({
                      ...settings,
                      backup: { ...settings.backup, backupFrequency: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retention Days</label>
                  <input
                    type="number"
                    value={settings.backup.retentionDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      backup: { ...settings.backup, retentionDays: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Last Backup</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(settings.backup.lastBackup).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={handleBackup}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Backup Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}