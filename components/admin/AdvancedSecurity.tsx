'use client';

import { useState, useEffect } from 'react';

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

interface SessionInfo {
  id: string;
  userId: string;
  userName: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  lastActivity: string;
  active: boolean;
}

interface TwoFactorSettings {
  enabled: boolean;
  method: 'app' | 'sms' | 'email';
  backupCodes: string[];
}

export default function AdvancedSecurity() {
  const [activeTab, setActiveTab] = useState('audit');
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettings>({
    enabled: false,
    method: 'app',
    backupCodes: []
  });
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    maxAge: 90
  });

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const [auditResponse, sessionsResponse, twoFactorResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/security/audit-logs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/security/sessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/security/two-factor`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (auditResponse.ok) {
        const auditData = await auditResponse.json();
        setAuditLogs(auditData.data);
      }

      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData.data);
      }

      if (twoFactorResponse.ok) {
        const twoFactorData = await twoFactorResponse.json();
        setTwoFactorSettings(twoFactorData.data);
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/security/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const enableTwoFactor = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/security/two-factor/enable`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ method: twoFactorSettings.method })
      });

      if (response.ok) {
        const data = await response.json();
        if (twoFactorSettings.method === 'app') {
          setShowQRCode(true);
        }
        setTwoFactorSettings(prev => ({ ...prev, enabled: true }));
      }
    } catch (error) {
      console.error('Failed to enable two-factor authentication:', error);
    }
  };

  const verifyTwoFactor = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/security/two-factor/verify`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });

      if (response.ok) {
        const data = await response.json();
        setTwoFactorSettings(prev => ({ 
          ...prev, 
          backupCodes: data.backupCodes 
        }));
        setShowQRCode(false);
        setVerificationCode('');
        alert('Two-factor authentication enabled successfully!');
      } else {
        alert('Invalid verification code');
      }
    } catch (error) {
      console.error('Failed to verify two-factor authentication:', error);
    }
  };

  const disableTwoFactor = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/security/two-factor/disable`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setTwoFactorSettings(prev => ({ 
          ...prev, 
          enabled: false, 
          backupCodes: [] 
        }));
      }
    } catch (error) {
      console.error('Failed to disable two-factor authentication:', error);
    }
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  };

  const tabs = [
    { id: 'audit', label: 'Audit Logs', icon: '📋' },
    { id: 'sessions', label: 'Active Sessions', icon: '👥' },
    { id: 'two-factor', label: 'Two-Factor Auth', icon: '🔐' },
    { id: 'password-policy', label: 'Password Policy', icon: '🔑' }
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
        <h2 className="text-xl font-semibold text-gray-900">🔒 Advanced Security</h2>
        <p className="text-gray-600 mt-1">Monitor security events and manage authentication settings</p>
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
        {/* Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Security Audit Logs</h3>
              <button
                onClick={fetchSecurityData}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.length > 0 ? (
                auditLogs.map(log => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">{getSeverityIcon(log.severity)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{log.event}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                              {log.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>👤 {log.user}</span>
                            <span>🌐 {log.ipAddress}</span>
                            <span>🕒 {new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📋</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs</h3>
                  <p className="text-gray-600">Security events will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Sessions */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
              <span className="text-sm text-gray-600">{sessions.filter(s => s.active).length} active sessions</span>
            </div>

            <div className="space-y-3">
              {sessions.length > 0 ? (
                sessions.map(session => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${session.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.userName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>🌐 {session.ipAddress}</span>
                            <span>🕒 Login: {new Date(session.loginTime).toLocaleString()}</span>
                            <span>⏰ Last: {new Date(session.lastActivity).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{session.userAgent}</p>
                        </div>
                      </div>
                      
                      {session.active && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">👥</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active sessions</h3>
                  <p className="text-gray-600">User sessions will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Two-Factor Authentication */}
        {activeTab === 'two-factor' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                twoFactorSettings.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {twoFactorSettings.enabled ? '✅ Enabled' : '❌ Disabled'}
              </div>
            </div>

            {!twoFactorSettings.enabled ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'app', label: 'Authenticator App', icon: '📱' },
                      { value: 'sms', label: 'SMS', icon: '💬' },
                      { value: 'email', label: 'Email', icon: '📧' }
                    ].map(method => (
                      <label key={method.value} className="flex items-center">
                        <input
                          type="radio"
                          name="twoFactorMethod"
                          value={method.value}
                          checked={twoFactorSettings.method === method.value}
                          onChange={(e) => setTwoFactorSettings(prev => ({ ...prev, method: e.target.value as any }))}
                          className="sr-only"
                        />
                        <div className={`flex items-center justify-center w-full p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          twoFactorSettings.method === method.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <span className="text-xl mr-2">{method.icon}</span>
                          <span className="font-medium">{method.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={enableTwoFactor}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔐 Enable Two-Factor Authentication
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-green-800 font-medium mb-2">✅ Two-Factor Authentication Enabled</h4>
                  <p className="text-green-700 text-sm">Your account is protected with {twoFactorSettings.method} authentication.</p>
                </div>

                {twoFactorSettings.backupCodes.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-yellow-800 font-medium mb-2">🔑 Backup Codes</h4>
                    <p className="text-yellow-700 text-sm mb-3">Save these backup codes in a safe place. You can use them to access your account if you lose your device.</p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                      {twoFactorSettings.backupCodes.map((code, index) => (
                        <div key={index} className="bg-white p-2 rounded border">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={disableTwoFactor}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Disable Two-Factor Authentication
                </button>
              </div>
            )}

            {/* QR Code Modal */}
            {showQRCode && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Setup Authenticator App</h3>
                  <div className="text-center mb-4">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                    <p className="text-sm text-gray-600">Scan this QR code with your authenticator app</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={verifyTwoFactor}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Password Policy */}
        {activeTab === 'password-policy' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
                  <input
                    type="number"
                    value={passwordPolicy.minLength}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, minLength: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Reuse Prevention</label>
                  <input
                    type="number"
                    value={passwordPolicy.preventReuse}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, preventReuse: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of previous passwords to remember</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Age (days)</label>
                  <input
                    type="number"
                    value={passwordPolicy.maxAge}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, maxAge: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Force password change after this many days</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireUppercase}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, requireUppercase: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require uppercase letters (A-Z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireLowercase}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, requireLowercase: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require lowercase letters (a-z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireNumbers}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, requireNumbers: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require numbers (0-9)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireSpecialChars}
                    onChange={(e) => setPasswordPolicy(prev => ({ ...prev, requireSpecialChars: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require special characters (!@#$%^&*)</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-blue-800 font-medium mb-2">📋 Current Policy Summary</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Minimum {passwordPolicy.minLength} characters</li>
                {passwordPolicy.requireUppercase && <li>• Must contain uppercase letters</li>}
                {passwordPolicy.requireLowercase && <li>• Must contain lowercase letters</li>}
                {passwordPolicy.requireNumbers && <li>• Must contain numbers</li>}
                {passwordPolicy.requireSpecialChars && <li>• Must contain special characters</li>}
                <li>• Cannot reuse last {passwordPolicy.preventReuse} passwords</li>
                <li>• Must be changed every {passwordPolicy.maxAge} days</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                💾 Save Password Policy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}