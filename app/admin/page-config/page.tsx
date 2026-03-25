'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Search,
  Edit,
  Save,
  X,
  Clock,
  FileText,
  Settings,
  Globe,
  Smartphone,
  Users,
  Heart,
  AlertTriangle,
  TrendingUp,
  Briefcase,
  Shield
} from 'lucide-react';

interface PageConfig {
  pageName: string;
  config: any;
  lastModified: string;
  version: number;
}

export default function PageConfigManagement() {
  const [configs, setConfigs] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError('');

      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      // Fetch all page configurations
      const pages = ['homepage', 'about', 'how-it-works', 'why-moksha-seva', 'our-reach', 'board', 'services', 'report', 'impact', 'stories', 'remembrance', 'testimonials', 'gallery', 'feedback', 'volunteer', 'corporate', 'legacy-giving', 'tribute', 'transparency', 'schemes', 'contact', 'press', 'documentaries', 'layout', 'blog', 'compliance'];
      const configPromises = pages.map(async (pageName) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/page-config/${pageName}`);
          if (response.ok) {
            const data = await response.json();
            return {
              pageName,
              config: data.data.config,
              lastModified: data.data.lastModified,
              version: data.data.version
            };
          }
          return null;
        } catch (error) {
          console.error(`Failed to fetch ${pageName} config:`, error);
          return null;
        }
      });

      const results = await Promise.all(configPromises);
      setConfigs(results.filter(Boolean) as PageConfig[]);
    } catch (error: any) {
      console.error('Failed to fetch configs:', error);
      setError(error.message || 'Failed to load page configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pageName: string, config: any) => {
    setEditingConfig(pageName);
    setEditContent(JSON.stringify(config, null, 2));
  };

  const handleSave = async (pageName: string) => {
    try {
      const parsedConfig = JSON.parse(editContent);
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/page-config/${pageName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          config: parsedConfig,
          changeLog: 'Updated via admin panel'
        })
      });

      if (response.ok) {
        setSuccessMessage(`${pageName} configuration updated successfully!`);
        setEditingConfig(null);
        setEditContent('');
        fetchConfigs(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update configuration');
      }
    } catch (error: any) {
      console.error('Failed to save config:', error);
      setError(error.message || 'Failed to save configuration');
    }
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setEditContent('');
  };

  const filteredConfigs = configs.filter(config =>
    config.pageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPageIcon = (pageName: string) => {
    switch (pageName) {
      case 'homepage': return <Globe className="w-5 h-5" />;
      case 'about': return <FileText className="w-5 h-5" />;
      case 'how-it-works': return <Settings className="w-5 h-5" />;
      case 'why-moksha-seva': return <Smartphone className="w-5 h-5" />;
      case 'our-reach': return <Globe className="w-5 h-5" />;
      case 'board': return <Users className="w-5 h-5" />;
      case 'services': return <Heart className="w-5 h-5" />;
      case 'report': return <AlertTriangle className="w-5 h-5" />;
      case 'impact': return <TrendingUp className="w-5 h-5" />;
      case 'stories': return <FileText className="w-5 h-5" />;
      case 'remembrance': return <Heart className="w-5 h-5" />;
      case 'testimonials': return <Users className="w-5 h-5" />;
      case 'gallery': return <Globe className="w-5 h-5" />;
      case 'feedback': return <FileText className="w-5 h-5" />;
      case 'volunteer': return <Users className="w-5 h-5" />;
      case 'corporate': return <Briefcase className="w-5 h-5" />;
      case 'legacy-giving': return <Heart className="w-5 h-5" />;
      case 'tribute': return <Heart className="w-5 h-5" />;
      case 'transparency': return <Shield className="w-5 h-5" />;
      case 'schemes': return <FileText className="w-5 h-5" />;
      case 'contact': return <Users className="w-5 h-5" />;
      case 'press': return <FileText className="w-5 h-5" />;
      case 'documentaries': return <Globe className="w-5 h-5" />;
      case 'layout': return <Settings className="w-5 h-5" />;
      case 'blog': return <FileText className="w-5 h-5" />;
      case 'compliance': return <Shield className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getPageTitle = (pageName: string) => {
    switch (pageName) {
      case 'homepage': return 'Homepage';
      case 'about': return 'About Us';
      case 'how-it-works': return 'How It Works';
      case 'why-moksha-seva': return 'Why Moksha Sewa';
      case 'our-reach': return 'Our Reach';
      case 'board': return 'Board & Advisors';
      case 'services': return 'Services';
      case 'report': return 'Report';
      case 'impact': return 'Impact';
      case 'stories': return 'Stories';
      case 'remembrance': return 'Remembrance';
      case 'testimonials': return 'Testimonials';
      case 'gallery': return 'Gallery';
      case 'feedback': return 'Feedback';
      case 'volunteer': return 'Volunteer';
      case 'corporate': return 'Corporate';
      case 'legacy-giving': return 'Legacy Giving';
      case 'tribute': return 'Tribute';
      case 'transparency': return 'Transparency';
      case 'schemes': return 'Schemes';
      case 'contact': return 'Contact';
      case 'press': return 'Press';
      case 'documentaries': return 'Documentaries';
      case 'layout': return 'Layout Components';
      case 'blog': return 'Blog Page';
      case 'compliance': return 'Compliance Page';
      default: return pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Configuration Management</h1>
          <p className="text-gray-600 mt-1">Manage content for all website pages</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Page Configurations */}
      <div className="grid gap-6">
        {filteredConfigs.map((pageConfig) => (
          <Card key={pageConfig.pageName} className="overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getPageIcon(pageConfig.pageName)}
                  <div>
                    <h3 className="text-lg font-semibold">{getPageTitle(pageConfig.pageName)}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(pageConfig.lastModified).toLocaleDateString()}
                      </div>
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs">v{pageConfig.version}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingConfig === pageConfig.pageName ? (
                    <>
                      <Button
                        onClick={() => handleSave(pageConfig.pageName)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleEdit(pageConfig.pageName, pageConfig.config)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {editingConfig === pageConfig.pageName ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Configuration JSON
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter JSON configuration..."
                    />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      <strong>Warning:</strong> Please ensure valid JSON format. Invalid JSON will cause errors on the website.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Sections</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {Object.keys(pageConfig.config).length}
                      </p>
                      <p className="text-sm text-blue-700">Available sections</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Status</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Published</span>
                      <p className="text-sm text-green-700 mt-1">Live on website</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-2">Version</h4>
                      <p className="text-2xl font-bold text-purple-600">v{pageConfig.version}</p>
                      <p className="text-sm text-purple-700">Current version</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Available Sections:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(pageConfig.config).map((section) => (
                        <span key={section} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredConfigs.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No configurations found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'No pages match your search criteria.' : 'No page configurations available.'}
          </p>
        </div>
      )}
    </div>
  );
}