'use client';

import { useState, useEffect } from 'react';

interface IPOption {
  interface: string;
  address: string;
  family: string;
  type: string;
}

interface IPSelectorProps {
  selectedIPs: string[];
  onIPsChange: (ips: string[]) => void;
}

export default function IPSelector({ selectedIPs, onIPsChange }: IPSelectorProps) {
  const [availableIPs, setAvailableIPs] = useState<IPOption[]>([]);
  const [currentIP, setCurrentIP] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customIP, setCustomIP] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableIPs();
  }, []);

  const fetchAvailableIPs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/available-ips`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableIPs(data.data.availableIPs);
        setCurrentIP(data.data.currentIP);
        setSuggestions(data.data.suggestions);
      } else {
        console.warn('Failed to fetch available IPs, using fallback');
        // Fallback suggestions if API fails
        setSuggestions(['127.0.0.1', '0.0.0.0', '192.168.1.1', '10.0.0.1']);
      }
    } catch (error) {
      console.error('Failed to fetch available IPs:', error);
      // Fallback suggestions if API fails
      setSuggestions(['127.0.0.1', '0.0.0.0', '192.168.1.1', '10.0.0.1']);
    } finally {
      setLoading(false);
    }
  };

  const addIP = (ip: string) => {
    if (ip && !selectedIPs.includes(ip)) {
      onIPsChange([...selectedIPs, ip]);
    }
  };

  const removeIP = (ip: string) => {
    onIPsChange(selectedIPs.filter(selectedIP => selectedIP !== ip));
  };

  const addCustomIP = () => {
    if (customIP.trim()) {
      addIP(customIP.trim());
      setCustomIP('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allowed IP Addresses
          </label>
          <div className="text-xs text-gray-500 mb-3">
            Select which IP addresses can access this admin account
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Fetching available IPs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allowed IP Addresses
        </label>
        <div className="text-xs text-gray-500 mb-3">
          Select which IP addresses can access this admin account
        </div>
        
        {/* Current IP */}
        {currentIP && (
          <div className="mb-3 p-2 bg-blue-50 rounded-md">
            <div className="text-xs text-blue-600 font-medium">Your Current IP:</div>
            <div className="text-sm text-blue-800">{currentIP}</div>
            <button
              type="button"
              onClick={() => addIP(currentIP)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              Add Current IP
            </button>
          </div>
        )}

        {/* Quick suggestions */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-2">Quick Options:</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((ip) => (
              <button
                key={ip}
                type="button"
                onClick={() => addIP(ip)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                disabled={selectedIPs.includes(ip)}
              >
                {ip === '0.0.0.0' ? 'Any IP (0.0.0.0)' : 
                 ip === '127.0.0.1' ? 'Localhost' : ip}
              </button>
            ))}
          </div>
        </div>

        {/* Manual IP input */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-2">Add Custom IP:</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customIP}
              onChange={(e) => setCustomIP(e.target.value)}
              placeholder="Enter IP address (e.g., 192.168.1.100)"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addCustomIP}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Common formats: 192.168.1.100, 10.0.0.1, 127.0.0.1, 0.0.0.0
          </div>
        </div>

        {/* Selected IPs */}
        {selectedIPs.length > 0 && (
          <div>
            <div className="text-xs text-gray-600 mb-2">Selected IPs:</div>
            <div className="space-y-1">
              {selectedIPs.map((ip) => (
                <div key={ip} className="flex items-center justify-between bg-green-50 px-2 py-1 rounded">
                  <span className="text-sm text-green-800">{ip}</span>
                  <button
                    type="button"
                    onClick={() => removeIP(ip)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available network interfaces */}
        {availableIPs.length > 0 && (
          <details className="mt-3">
            <summary className="text-xs text-gray-600 cursor-pointer">
              Show Available Network Interfaces
            </summary>
            <div className="mt-2 space-y-1">
              {availableIPs.map((ip, index) => (
                <div key={index} className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <div><strong>{ip.interface}</strong> ({ip.type})</div>
                  <div className="font-mono">{ip.address}</div>
                  <button
                    type="button"
                    onClick={() => addIP(ip.address)}
                    className="text-blue-600 hover:text-blue-800 mt-1"
                    disabled={selectedIPs.includes(ip.address)}
                  >
                    Add this IP
                  </button>
                </div>
              ))}
            </div>
          </details>
        )}

        <div className="text-xs text-gray-500 mt-2">
          💡 Tip: Use "0.0.0.0" to allow access from any IP address, or add specific IPs for security.
        </div>
      </div>
    </div>
  );
}