'use client';

import { useState, useEffect } from 'react';

interface SystemConfig {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    ipWhitelisting: boolean;
    allowedIPs: string[];
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  features: {
    enableReports: boolean;
    enableDonations: boolean;
    enableVolunteers: boolean;
    enableGallery: boolean;
    enablePress: boolean;
    enableAnalytics: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    cdnUrl: string;
  };
}

export default function SystemConfiguration() {
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: 'Moksha Seva',
      siteUrl: 'https://mokshaseva.org',
      adminEmail: 'admin@mokshaseva.org',
      timezone: 'Asia/Kolkata',
      language: 'en',
      maintenanceMode: false
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      ipWhitelisting: false,
      allowedIPs: []
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@mokshaseva.org',
      fromName: 'Moksha Seva'
    },
    features: {
      enableReports: true,
      enableDonations: true,
      enableVolunteers: true,
      enableGallery: true,
      enablePress: true,
      enableAnalytics: true
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      cdnEnabled: false,
      cdnUrl: ''
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/config`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('Configuration saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };
  const testEmailConfiguration = async () => {
    try {
      setTestingEmail(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/test-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.email),
      });

      if (response.ok) {
        alert('Test email sent successfully!');
      } else {
        alert('Failed to send test email');
      }
    } catch (error) {
      console.error('Failed to test email:', error);
      alert('Failed to test email configuration');
    } finally {
      setTestingEmail(false);
    }
  };

  const createBackup = async () => {
    try {
      setBackupInProgress(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/backup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `moksha-seva-backup-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup');
    } finally {
      setBackupInProgress(false);
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addAllowedIP = () => {
    const ip = prompt('Enter IP address:');
    if (ip && ip.trim()) {
      setConfig(prev => ({
        ...prev,
        security: {
          ...prev.security,
          allowedIPs: [...prev.security.allowedIPs, ip.trim()]
        }
      }));
    }
  };

  const removeAllowedIP = (index: number) => {
    setConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        allowedIPs: prev.security.allowedIPs.filter((_, i) => i !== index)
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'features', label: 'Features', icon: '🎛️' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'backup', label: 'Backup', icon: '💾' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">🔧 System Configuration</h2>
            <p className="text-gray-600 mt-1">Manage system settings and preferences</p>
          </div>
          <button
            onClick={saveConfiguration}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
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
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={config.general.siteName}
                  onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                <input
                  type="url"
                  value={config.general.siteUrl}
                  onChange={(e) => updateConfig('general', 'siteUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={config.general.adminEmail}
                  onChange={(e) => updateConfig('general', 'adminEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={config.general.timezone}
                  onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={config.general.language}
                  onChange={(e) => updateConfig('general', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={config.general.maintenanceMode}
                onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        )}
        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={config.security.sessionTimeout}
                  onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  value={config.security.maxLoginAttempts}
                  onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                <input
                  type="number"
                  value={config.security.passwordMinLength}
                  onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.security.requireTwoFactor}
                  onChange={(e) => updateConfig('security', 'requireTwoFactor', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require Two-Factor Authentication</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.security.ipWhitelisting}
                  onChange={(e) => updateConfig('security', 'ipWhitelisting', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable IP Whitelisting</span>
              </label>
            </div>

            {config.security.ipWhitelisting && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Allowed IP Addresses</label>
                  <button
                    onClick={addAllowedIP}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    + Add IP
                  </button>
                </div>
                <div className="space-y-2">
                  {config.security.allowedIPs.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-700">{ip}</span>
                      <button
                        onClick={() => removeAllowedIP(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {config.security.allowedIPs.length === 0 && (
                    <p className="text-sm text-gray-500">No IP addresses configured</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                <input
                  type="text"
                  value={config.email.smtpHost}
                  onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                <input
                  type="number"
                  value={config.email.smtpPort}
                  onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                <input
                  type="text"
                  value={config.email.smtpUser}
                  onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                <input
                  type="password"
                  value={config.email.smtpPassword}
                  onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                <input
                  type="email"
                  value={config.email.fromEmail}
                  onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                <input
                  type="text"
                  value={config.email.fromName}
                  onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={testEmailConfiguration}
                disabled={testingEmail}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {testingEmail ? 'Testing...' : '📧 Test Email'}
              </button>
            </div>
          </div>
        )}

        {/* Feature Flags */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Feature Toggles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config.features).map(([key, value]) => (
                <label key={key} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateConfig('features', key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Performance Settings */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cache Duration (seconds)</label>
                <input
                  type="number"
                  value={config.performance.cacheDuration}
                  onChange={(e) => updateConfig('performance', 'cacheDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CDN URL</label>
                <input
                  type="url"
                  value={config.performance.cdnUrl}
                  onChange={(e) => updateConfig('performance', 'cdnUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!config.performance.cdnEnabled}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.performance.cacheEnabled}
                  onChange={(e) => updateConfig('performance', 'cacheEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Caching</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.performance.compressionEnabled}
                  onChange={(e) => updateConfig('performance', 'compressionEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Compression</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.performance.cdnEnabled}
                  onChange={(e) => updateConfig('performance', 'cdnEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable CDN</span>
              </label>
            </div>
          </div>
        )}

        {/* Backup & Maintenance */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">💾 System Backup</h3>
              <p className="text-blue-700 mb-4">Create a complete backup of your system data and configuration.</p>
              <button
                onClick={createBackup}
                disabled={backupInProgress}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {backupInProgress ? 'Creating Backup...' : '📦 Create Backup'}
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">🔧 Database Optimization</h3>
              <p className="text-yellow-700 mb-4">Optimize database performance and clean up unused data.</p>
              <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                🚀 Optimize Database
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-800 mb-2">⚠️ System Reset</h3>
              <p className="text-red-700 mb-4">Reset system to default settings. This action cannot be undone.</p>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                🔄 Reset System
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}