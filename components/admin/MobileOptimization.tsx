'use client';

import { useState, useEffect } from 'react';

interface MobileMetrics {
  mobileTraffic: number;
  mobileConversion: number;
  avgLoadTime: number;
  bounceRate: number;
  screenSizes: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

interface PWAFeatures {
  serviceWorker: boolean;
  manifest: boolean;
  offlineSupport: boolean;
  pushNotifications: boolean;
  installPrompt: boolean;
}

export default function MobileOptimization() {
  const [metrics, setMetrics] = useState<MobileMetrics>({
    mobileTraffic: 0,
    mobileConversion: 0,
    avgLoadTime: 0,
    bounceRate: 0,
    screenSizes: { mobile: 0, tablet: 0, desktop: 0 }
  });
  const [pwaFeatures, setPwaFeatures] = useState<PWAFeatures>({
    serviceWorker: false,
    manifest: false,
    offlineSupport: false,
    pushNotifications: false,
    installPrompt: false
  });
  const [activeTab, setActiveTab] = useState('metrics');
  const [loading, setLoading] = useState(true);
  const [testingDevice, setTestingDevice] = useState<string | null>(null);

  useEffect(() => {
    fetchMobileMetrics();
    checkPWAFeatures();
  }, []);

  const fetchMobileMetrics = async () => {
    try {
      // Mock data for demo
      setMetrics({
        mobileTraffic: Math.random() * 30 + 45,
        mobileConversion: Math.random() * 10 + 15,
        avgLoadTime: Math.random() * 1000 + 1500,
        bounceRate: Math.random() * 20 + 30,
        screenSizes: {
          mobile: Math.random() * 20 + 45,
          tablet: Math.random() * 15 + 20,
          desktop: Math.random() * 20 + 30
        }
      });
    } catch (error) {
      console.error('Failed to fetch mobile metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPWAFeatures = () => {
    setPwaFeatures({
      serviceWorker: 'serviceWorker' in navigator,
      manifest: document.querySelector('link[rel="manifest"]') !== null,
      offlineSupport: false, // Would check actual offline capability
      pushNotifications: 'Notification' in window,
      installPrompt: false // Would check for beforeinstallprompt event
    });
  };

  const simulateDeviceTest = (device: string) => {
    setTestingDevice(device);
    setTimeout(() => {
      setTestingDevice(null);
      alert(`${device} test completed successfully!`);
    }, 3000);
  };
  const tabs = [
    { id: 'metrics', label: 'Mobile Metrics', icon: '📱' },
    { id: 'responsive', label: 'Responsive Design', icon: '📐' },
    { id: 'pwa', label: 'PWA Features', icon: '⚡' },
    { id: 'testing', label: 'Device Testing', icon: '🧪' }
  ];

  const devices = [
    { name: 'iPhone 14', width: 390, height: 844, icon: '📱' },
    { name: 'Samsung Galaxy S23', width: 360, height: 780, icon: '📱' },
    { name: 'iPad Pro', width: 1024, height: 1366, icon: '📱' },
    { name: 'iPad Mini', width: 768, height: 1024, icon: '📱' }
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
        <h2 className="text-xl font-semibold text-gray-900">📱 Mobile Optimization</h2>
        <p className="text-gray-600 mt-1">Optimize and test mobile user experience</p>
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
        {/* Mobile Metrics */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Mobile Traffic</p>
                    <p className="text-2xl font-bold text-blue-800">{metrics.mobileTraffic.toFixed(1)}%</p>
                  </div>
                  <span className="text-blue-500 text-2xl">📱</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Mobile Conversion</p>
                    <p className="text-2xl font-bold text-green-800">{metrics.mobileConversion.toFixed(1)}%</p>
                  </div>
                  <span className="text-green-500 text-2xl">💰</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Avg Load Time</p>
                    <p className="text-2xl font-bold text-purple-800">{metrics.avgLoadTime.toFixed(0)}ms</p>
                  </div>
                  <span className="text-purple-500 text-2xl">⏱️</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Bounce Rate</p>
                    <p className="text-2xl font-bold text-orange-800">{metrics.bounceRate.toFixed(1)}%</p>
                  </div>
                  <span className="text-orange-500 text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Screen Size Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>📱 Mobile ({metrics.screenSizes.mobile.toFixed(1)}%)</span>
                    <span>{metrics.screenSizes.mobile.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.screenSizes.mobile}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>📱 Tablet ({metrics.screenSizes.tablet.toFixed(1)}%)</span>
                    <span>{metrics.screenSizes.tablet.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.screenSizes.tablet}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>🖥️ Desktop ({metrics.screenSizes.desktop.toFixed(1)}%)</span>
                    <span>{metrics.screenSizes.desktop.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.screenSizes.desktop}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Responsive Design */}
        {activeTab === 'responsive' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2">📐 Responsive Design Guidelines</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Use flexible grid layouts with CSS Grid and Flexbox</li>
                <li>• Implement mobile-first design approach</li>
                <li>• Optimize touch targets (minimum 44px)</li>
                <li>• Use responsive images with srcset</li>
                <li>• Test across multiple device sizes</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">📱 Mobile Breakpoints</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Small Mobile</span>
                    <span className="text-gray-600">320px - 480px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Large Mobile</span>
                    <span className="text-gray-600">481px - 768px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tablet</span>
                    <span className="text-gray-600">769px - 1024px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desktop</span>
                    <span className="text-gray-600">1025px+</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">🎨 Design Recommendations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span>Touch-friendly navigation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span>Readable font sizes (16px+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">⚠️</span>
                    <span>Optimize image loading</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">❌</span>
                    <span>Reduce horizontal scrolling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PWA Features */}
        {activeTab === 'pwa' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(pwaFeatures).map(([feature, enabled]) => (
                <div key={feature} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {enabled ? '✅ Enabled' : '❌ Disabled'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {feature === 'serviceWorker' && 'Enables offline functionality and caching'}
                    {feature === 'manifest' && 'Allows app installation on devices'}
                    {feature === 'offlineSupport' && 'Works without internet connection'}
                    {feature === 'pushNotifications' && 'Send notifications to users'}
                    {feature === 'installPrompt' && 'Prompts users to install the app'}
                  </p>
                  {!enabled && (
                    <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm">
                      Enable
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-medium mb-2">⚡ PWA Benefits</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Faster loading times with service worker caching</li>
                <li>• App-like experience on mobile devices</li>
                <li>• Works offline or with poor connectivity</li>
                <li>• Push notifications for user engagement</li>
                <li>• Installable on home screen</li>
                <li>• Reduced data usage</li>
              </ul>
            </div>
          </div>
        )}

        {/* Device Testing */}
        {activeTab === 'testing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {devices.map(device => (
                <div key={device.name} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">{device.icon}</span>
                    <h4 className="font-medium text-gray-900">{device.name}</h4>
                    <p className="text-sm text-gray-600">{device.width} × {device.height}</p>
                    <button
                      onClick={() => simulateDeviceTest(device.name)}
                      disabled={testingDevice === device.name}
                      className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      {testingDevice === device.name ? 'Testing...' : 'Test Device'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-medium mb-2">🧪 Testing Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Navigation works on touch devices</li>
                  <li>• Forms are easy to fill on mobile</li>
                  <li>• Images load properly on all devices</li>
                  <li>• Text is readable without zooming</li>
                </ul>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Buttons are large enough to tap</li>
                  <li>• Page loads quickly on mobile networks</li>
                  <li>• No horizontal scrolling required</li>
                  <li>• App works in both orientations</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}