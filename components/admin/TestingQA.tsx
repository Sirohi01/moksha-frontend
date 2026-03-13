'use client';

import { useState, useEffect } from 'react';

interface TestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  status: 'pending' | 'running' | 'passed' | 'failed';
  tests: number;
  passed: number;
  failed: number;
  duration: number;
  lastRun?: string;
}

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

export default function TestingQA() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: '1',
      name: 'Authentication Tests',
      type: 'unit',
      status: 'passed',
      tests: 25,
      passed: 25,
      failed: 0,
      duration: 1200,
      lastRun: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      name: 'API Integration Tests',
      type: 'integration',
      status: 'failed',
      tests: 18,
      passed: 15,
      failed: 3,
      duration: 2400,
      lastRun: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '3',
      name: 'User Journey Tests',
      type: 'e2e',
      status: 'pending',
      tests: 12,
      passed: 0,
      failed: 0,
      duration: 0
    },
    {
      id: '4',
      name: 'Performance Tests',
      type: 'performance',
      status: 'passed',
      tests: 8,
      passed: 7,
      failed: 1,
      duration: 3600,
      lastRun: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: '5',
      name: 'Security Tests',
      type: 'security',
      status: 'running',
      tests: 15,
      passed: 8,
      failed: 0,
      duration: 1800
    }
  ]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runTestSuite = async (suiteId: string) => {
    const suite = testSuites.find(s => s.id === suiteId);
    if (!suite || suite.status === 'running') return;

    setTestSuites(prev => prev.map(s => 
      s.id === suiteId ? { ...s, status: 'running', passed: 0, failed: 0 } : s
    ));

    // Simulate test execution
    const totalTests = suite.tests;
    let completed = 0;

    const interval = setInterval(() => {
      completed += Math.floor(Math.random() * 3) + 1;
      if (completed >= totalTests) {
        completed = totalTests;
        clearInterval(interval);
        
        const passed = Math.floor(totalTests * (0.8 + Math.random() * 0.2));
        const failed = totalTests - passed;
        const finalStatus = failed === 0 ? 'passed' : 'failed';
        
        setTestSuites(prev => prev.map(s => 
          s.id === suiteId ? { 
            ...s, 
            status: finalStatus, 
            passed, 
            failed,
            duration: Math.floor(Math.random() * 3000) + 1000,
            lastRun: new Date().toISOString()
          } : s
        ));
      } else {
        setTestSuites(prev => prev.map(s => 
          s.id === suiteId ? { 
            ...s, 
            passed: Math.floor(completed * 0.9),
            failed: Math.floor(completed * 0.1)
          } : s
        ));
      }
    }, 500);
  };

  const runAllTests = () => {
    testSuites.forEach(suite => {
      if (suite.status !== 'running') {
        setTimeout(() => runTestSuite(suite.id), Math.random() * 2000);
      }
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'running': return '⏳';
      default: return '⏸️';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unit': return '🧪';
      case 'integration': return '🔗';
      case 'e2e': return '🎭';
      case 'performance': return '⚡';
      case 'security': return '🔒';
      default: return '📋';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Test Overview', icon: '📊' },
    { id: 'suites', label: 'Test Suites', icon: '📋' },
    { id: 'coverage', label: 'Code Coverage', icon: '📈' },
    { id: 'reports', label: 'Test Reports', icon: '📄' }
  ];

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests, 0);
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passed, 0);
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failed, 0);
  const passRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">🧪 Testing & Quality Assurance</h2>
            <p className="text-gray-600 mt-1">Comprehensive testing and quality control</p>
          </div>
          <button
            onClick={runAllTests}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🚀 Run All Tests
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
        {/* Test Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Tests</p>
                    <p className="text-2xl font-bold text-blue-800">{totalTests}</p>
                  </div>
                  <span className="text-blue-500 text-2xl">🧪</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Passed</p>
                    <p className="text-2xl font-bold text-green-800">{totalPassed}</p>
                  </div>
                  <span className="text-green-500 text-2xl">✅</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-800">{totalFailed}</p>
                  </div>
                  <span className="text-red-500 text-2xl">❌</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Pass Rate</p>
                    <p className="text-2xl font-bold text-purple-800">{passRate.toFixed(1)}%</p>
                  </div>
                  <span className="text-purple-500 text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Test Suite Status</h3>
                <div className="space-y-3">
                  {testSuites.map(suite => (
                    <div key={suite.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{getTypeIcon(suite.type)}</span>
                        <span className="text-sm text-gray-700">{suite.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(suite.status)}`}>
                        {getStatusIcon(suite.status)} {suite.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Code Coverage</span>
                    <span className="text-sm font-medium">87.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Test Reliability</span>
                    <span className="text-sm font-medium">94.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Test Duration</span>
                    <span className="text-sm font-medium">2.3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Full Run</span>
                    <span className="text-sm font-medium">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Suites */}
        {activeTab === 'suites' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {testSuites.map(suite => (
                <div key={suite.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getTypeIcon(suite.type)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{suite.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{suite.type} tests</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(suite.status)}`}>
                        {getStatusIcon(suite.status)} {suite.status}
                      </span>
                      {suite.status !== 'running' && (
                        <button
                          onClick={() => runTestSuite(suite.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                        >
                          Run
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <span className="ml-1 font-medium">{suite.tests}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Passed:</span>
                      <span className="ml-1 font-medium text-green-600">{suite.passed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failed:</span>
                      <span className="ml-1 font-medium text-red-600">{suite.failed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-1 font-medium">{(suite.duration / 1000).toFixed(1)}s</span>
                    </div>
                  </div>

                  {suite.tests > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-l-full transition-all duration-300"
                          style={{ width: `${(suite.passed / suite.tests) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {suite.lastRun && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last run: {new Date(suite.lastRun).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Coverage */}
        {activeTab === 'coverage' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2">📈 Code Coverage Report</h3>
              <p className="text-blue-700 text-sm">Overall coverage: 87.3% (Target: 90%)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Coverage by Module</h4>
                {[
                  { name: 'Authentication', coverage: 95.2 },
                  { name: 'User Management', coverage: 89.7 },
                  { name: 'API Routes', coverage: 82.1 },
                  { name: 'Database Models', coverage: 91.3 },
                  { name: 'Frontend Components', coverage: 78.9 }
                ].map(module => (
                  <div key={module.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{module.name}</span>
                      <span>{module.coverage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          module.coverage >= 90 ? 'bg-green-600' : 
                          module.coverage >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${module.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Coverage Trends</h4>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">📈</span>
                    <p className="text-gray-600">Coverage trend chart</p>
                    <p className="text-sm text-gray-500">Would show coverage over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Test Reports</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                📄 Generate Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Daily Test Report', date: '2024-03-12', status: 'completed' },
                { name: 'Weekly Summary', date: '2024-03-11', status: 'completed' },
                { name: 'Performance Report', date: '2024-03-10', status: 'completed' },
                { name: 'Security Audit', date: '2024-03-09', status: 'failed' },
                { name: 'Integration Report', date: '2024-03-08', status: 'completed' },
                { name: 'Coverage Report', date: '2024-03-07', status: 'completed' }
              ].map((report, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{report.date}</p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}