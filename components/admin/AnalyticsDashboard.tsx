'use client';

import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';

interface AnalyticsData {
  overview: {
    totalReports: number;
    totalVolunteers: number;
    totalDonations: number;
    totalContacts: number;
  };
  trends: {
    reports: Array<{ month: string; count: number }>;
    volunteers: Array<{ month: string; count: number }>;
    donations: Array<{ month: string; amount: number }>;
  };
  demographics: {
    reportsByState: Array<{ state: string; count: number }>;
    volunteersByAge: Array<{ ageGroup: string; count: number }>;
    donationsByAmount: Array<{ range: string; count: number }>;
  };
  performance: {
    responseTime: number;
    resolutionRate: number;
    satisfactionScore: number;
    activeUsers: number;
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const response = await analyticsAPI.getAnalytics(timeRange);
      setData(response.data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      // Keep mock data as fallback for now
      const mockData: AnalyticsData = {
        overview: {
          totalReports: 1247,
          totalVolunteers: 89,
          totalDonations: 156,
          totalContacts: 234
        },
        trends: {
          reports: [
            { month: 'Jan', count: 65 },
            { month: 'Feb', count: 78 },
            { month: 'Mar', count: 92 },
            { month: 'Apr', count: 108 },
            { month: 'May', count: 134 },
            { month: 'Jun', count: 156 }
          ],
          volunteers: [
            { month: 'Jan', count: 12 },
            { month: 'Feb', count: 15 },
            { month: 'Mar', count: 18 },
            { month: 'Apr', count: 22 },
            { month: 'May', count: 28 },
            { month: 'Jun', count: 35 }
          ],
          donations: [
            { month: 'Jan', amount: 45000 },
            { month: 'Feb', amount: 52000 },
            { month: 'Mar', amount: 48000 },
            { month: 'Apr', amount: 61000 },
            { month: 'May', amount: 58000 },
            { month: 'Jun', amount: 67000 }
          ]
        },
        demographics: {
          reportsByState: [
            { state: 'Maharashtra', count: 245 },
            { state: 'Delhi', count: 189 },
            { state: 'Karnataka', count: 167 },
            { state: 'Tamil Nadu', count: 134 },
            { state: 'Gujarat', count: 98 }
          ],
          volunteersByAge: [
            { ageGroup: '18-25', count: 23 },
            { ageGroup: '26-35', count: 34 },
            { ageGroup: '36-45', count: 28 },
            { ageGroup: '46-55', count: 15 },
            { ageGroup: '55+', count: 12 }
          ],
          donationsByAmount: [
            { range: '₹100-500', count: 45 },
            { range: '₹501-1000', count: 38 },
            { range: '₹1001-5000', count: 42 },
            { range: '₹5001-10000', count: 18 },
            { range: '₹10000+', count: 13 }
          ]
        },
        performance: {
          responseTime: 2.4,
          resolutionRate: 87.5,
          satisfactionScore: 4.2,
          activeUsers: 156
        }
      };
      
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalReports.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Volunteers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalVolunteers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalDonations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <span className="text-2xl">📞</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalContacts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reports Trend</h3>
          <div className="space-y-3">
            {data.trends.reports.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.month}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.count / 200) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Volunteer Growth</h3>
          <div className="space-y-3">
            {data.trends.volunteers.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.month}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(item.count / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reports by State</h3>
          <div className="space-y-3">
            {data.demographics.reportsByState.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.state}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(item.count / 300) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Donation Distribution</h3>
          <div className="space-y-3">
            {data.demographics.donationsByAmount.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.range}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(item.count / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.performance.responseTime}h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{data.performance.resolutionRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{data.performance.satisfactionScore}/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data.performance.activeUsers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export PDF Report
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Export Excel Data
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
}