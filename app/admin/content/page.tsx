'use client';

import { useState, useEffect } from 'react';
import { contentAPI } from '@/lib/api';

interface ContentItem {
  _id: string;
  title: string;
  type: 'page' | 'blog' | 'campaign' | 'press';
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  author: {
    name: string;
  };
  views?: number;
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      // For now, show page configurations as content since that's what we have
      const response = await fetch(`${API_BASE_URL}/api/page-config/homepage`);
      const homepageData = await response.json();
      
      const response2 = await fetch(`${API_BASE_URL}/api/page-config/about`);
      const aboutData = await response2.json();
      
      const response3 = await fetch(`${API_BASE_URL}/api/page-config/how-it-works`);
      const howItWorksData = await response3.json();
      
      const response4 = await fetch(`${API_BASE_URL}/api/page-config/why-moksha-seva`);
      const whyMokshaSevaData = await response4.json();
      
      const response5 = await fetch(`${API_BASE_URL}/api/page-config/our-reach`);
      const ourReachData = await response5.json();
      
      const response6 = await fetch(`${API_BASE_URL}/api/page-config/board`);
      const boardData = await response6.json();
      
      const response7 = await fetch(`${API_BASE_URL}/api/page-config/services`);
      const servicesData = await response7.json();
      
      const response8 = await fetch(`${API_BASE_URL}/api/page-config/report`);
      const reportData = await response8.json();
      
      const response9 = await fetch(`${API_BASE_URL}/api/page-config/impact`);
      const impactData = await response9.json();
      
      const response10 = await fetch(`${API_BASE_URL}/api/page-config/stories`);
      const storiesData = await response10.json();
      
      const response11 = await fetch(`${API_BASE_URL}/api/page-config/remembrance`);
      const remembranceData = await response11.json();
      
      const response12 = await fetch(`${API_BASE_URL}/api/page-config/testimonials`);
      const testimonialsData = await response12.json();
      
      const response13 = await fetch(`${API_BASE_URL}/api/page-config/gallery`);
      const galleryData = await response13.json();
      
      const response14 = await fetch(`${API_BASE_URL}/api/page-config/feedback`);
      const feedbackData = await response14.json();
      
      const response15 = await fetch(`${API_BASE_URL}/api/page-config/volunteer`);
      const volunteerData = await response15.json();
      
      const response16 = await fetch(`${API_BASE_URL}/api/page-config/corporate`);
      const corporateData = await response16.json();
      
      const response17 = await fetch(`${API_BASE_URL}/api/page-config/legacy-giving`);
      const legacyGivingData = await response17.json();
      
      const response18 = await fetch(`${API_BASE_URL}/api/page-config/tribute`);
      const tributeData = await response18.json();
      
      const response19 = await fetch(`${API_BASE_URL}/api/page-config/transparency`);
      const transparencyData = await response19.json();
      
      const response20 = await fetch(`${API_BASE_URL}/api/page-config/schemes`);
      const schemesData = await response20.json();
      
      const response21 = await fetch(`${API_BASE_URL}/api/page-config/contact`);
      const contactData = await response21.json();
      
      const response22 = await fetch(`${API_BASE_URL}/api/page-config/press`);
      const pressData = await response22.json();
      
      const response23 = await fetch(`${API_BASE_URL}/api/page-config/documentaries`);
      const documentariesData = await response23.json();
      
      const response24 = await fetch(`${API_BASE_URL}/api/page-config/layout`);
      const layoutData = await response24.json();
      
      const response25 = await fetch(`${API_BASE_URL}/api/page-config/blog`);
      const blogData = await response25.json();

      const response26 = await fetch(`${API_BASE_URL}/api/page-config/compliance`);
      const complianceData = await response26.json();

      const allDataConfigs = [
        { id: 'homepage-config', title: 'Homepage Configuration', data: homepageData },
        { id: 'about-config', title: 'About Page Configuration', data: aboutData },
        { id: 'how-it-works-config', title: 'How It Works Page Configuration', data: howItWorksData },
        { id: 'why-moksha-seva-config', title: 'Why Moksha Seva Page Configuration', data: whyMokshaSevaData },
        { id: 'our-reach-config', title: 'Our Reach Page Configuration', data: ourReachData },
        { id: 'board-config', title: 'Board & Advisors Page Configuration', data: boardData },
        { id: 'services-config', title: 'Services Page Configuration', data: servicesData },
        { id: 'report-config', title: 'Report Page Configuration', data: reportData },
        { id: 'impact-config', title: 'Impact Page Configuration', data: impactData },
        { id: 'stories-config', title: 'Stories Page Configuration', data: storiesData },
        { id: 'remembrance-config', title: 'Remembrance Page Configuration', data: remembranceData },
        { id: 'testimonials-config', title: 'Testimonials Page Configuration', data: testimonialsData },
        { id: 'gallery-config', title: 'Gallery Page Configuration', data: galleryData },
        { id: 'feedback-config', title: 'Feedback Page Configuration', data: feedbackData },
        { id: 'volunteer-config', title: 'Volunteer Page Configuration', data: volunteerData },
        { id: 'corporate-config', title: 'Corporate Page Configuration', data: corporateData },
        { id: 'legacy-giving-config', title: 'Legacy Giving Page Configuration', data: legacyGivingData },
        { id: 'tribute-config', title: 'Tribute Page Configuration', data: tributeData },
        { id: 'transparency-config', title: 'Transparency Page Configuration', data: transparencyData },
        { id: 'schemes-config', title: 'Schemes Page Configuration', data: schemesData },
        { id: 'contact-config', title: 'Contact Page Configuration', data: contactData },
        { id: 'press-config', title: 'Press Page Configuration', data: pressData },
        { id: 'documentaries-config', title: 'Documentaries Page Configuration', data: documentariesData },
        { id: 'layout-config', title: 'Layout Components Configuration', data: layoutData },
        { id: 'blog-config', title: 'Blog Page Configuration', data: blogData },
        { id: 'compliance-config', title: 'Compliance Page Configuration', data: complianceData }
      ];

      const validContent = allDataConfigs
        .filter(item => item.data && item.data.success)
        .map(item => ({
          _id: item.id,
          title: item.title,
          type: 'page' as const,
          status: 'published' as const,
          updatedAt: item.data.data.lastModified,
          author: { name: 'Admin' },
          views: Math.floor(Math.random() * 1000) + 100
        }));

      setContent(validContent);
    } catch (error: any) {
      console.error('Failed to fetch content:', error);
      setError(error.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;

    try {
      await contentAPI.deleteContent(id);
      setContent(prev => prev.filter(item => item._id !== id));
      alert('Content deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content: ' + error.message);
    }
  };

  const filteredContent = content.filter(item => {
    return (
      (filters.type === '' || item.type === filters.type) &&
      (filters.status === '' || item.status === filters.status) &&
      (filters.search === '' || item.title.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return '📄';
      case 'blog': return '📝';
      case 'campaign': return '📢';
      case 'press': return '📰';
      default: return '📄';
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
            <h3 className="text-red-800 font-medium">Error Loading Content</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchContent}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">Manage website content, blogs, and campaigns</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            + New Content
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="page">Pages</option>
              <option value="blog">Blog Posts</option>
              <option value="campaign">Campaigns</option>
              <option value="press">Press Releases</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{getTypeIcon(item.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.author?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.views?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          if (item._id === 'homepage-config') {
                            window.location.href = '/admin/content-editor?page=homepage';
                          } else if (item._id === 'about-config') {
                            window.location.href = '/admin/content-editor?page=about';
                          } else if (item._id === 'how-it-works-config') {
                            window.location.href = '/admin/content-editor?page=how-it-works';
                          } else if (item._id === 'why-moksha-seva-config') {
                            window.location.href = '/admin/content-editor?page=why-moksha-seva';
                          } else if (item._id === 'our-reach-config') {
                            window.location.href = '/admin/content-editor?page=our-reach';
                          } else if (item._id === 'board-config') {
                            window.location.href = '/admin/content-editor?page=board';
                          } else if (item._id === 'services-config') {
                            window.location.href = '/admin/content-editor?page=services';
                          } else if (item._id === 'report-config') {
                            window.location.href = '/admin/content-editor?page=report';
                          } else if (item._id === 'impact-config') {
                            window.location.href = '/admin/content-editor?page=impact';
                          } else if (item._id === 'stories-config') {
                            window.location.href = '/admin/content-editor?page=stories';
                          } else if (item._id === 'remembrance-config') {
                            window.location.href = '/admin/content-editor?page=remembrance';
                          } else if (item._id === 'testimonials-config') {
                            window.location.href = '/admin/content-editor?page=testimonials';
                          } else if (item._id === 'gallery-config') {
                            window.location.href = '/admin/content-editor?page=gallery';
                          } else if (item._id === 'feedback-config') {
                            window.location.href = '/admin/content-editor?page=feedback';
                          } else if (item._id === 'volunteer-config') {
                            window.location.href = '/admin/content-editor?page=volunteer';
                          } else if (item._id === 'corporate-config') {
                            window.location.href = '/admin/content-editor?page=corporate';
                          } else if (item._id === 'legacy-giving-config') {
                            window.location.href = '/admin/content-editor?page=legacy-giving';
                          } else if (item._id === 'tribute-config') {
                            window.location.href = '/admin/content-editor?page=tribute';
                          } else if (item._id === 'transparency-config') {
                            window.location.href = '/admin/content-editor?page=transparency';
                          } else if (item._id === 'schemes-config') {
                            window.location.href = '/admin/content-editor?page=schemes';
                          } else if (item._id === 'contact-config') {
                            window.location.href = '/admin/content-editor?page=contact';
                          } else if (item._id === 'press-config') {
                            window.location.href = '/admin/content-editor?page=press';
                          } else if (item._id === 'documentaries-config') {
                            window.location.href = '/admin/content-editor?page=documentaries';
                          } else if (item._id === 'layout-config') {
                            window.location.href = '/admin/content-editor?page=layout';
                          } else if (item._id === 'blog-config') {
                            window.location.href = '/admin/content-editor?page=blog';
                          } else if (item._id === 'compliance-config') {
                            window.location.href = '/admin/content-editor?page=compliance';
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      {/* <button 
                        onClick={() => {
                          if (item._id === 'homepage-config') {
                            window.open('/', '_blank');
                          } else if (item._id === 'about-config') {
                            window.open('/about', '_blank');
                          } else if (item._id === 'how-it-works-config') {
                            window.open('/how-it-works', '_blank');
                          } else if (item._id === 'why-moksha-seva-config') {
                            window.open('/why-moksha-seva', '_blank');
                          } else if (item._id === 'our-reach-config') {
                            window.open('/our-reach', '_blank');
                          } else if (item._id === 'board-config') {
                            window.open('/board', '_blank');
                          } else if (item._id === 'services-config') {
                            window.open('/services', '_blank');
                          } else if (item._id === 'report-config') {
                            window.open('/report', '_blank');
                          } else if (item._id === 'impact-config') {
                            window.open('/impact', '_blank');
                          } else if (item._id === 'stories-config') {
                            window.open('/stories', '_blank');
                          } else if (item._id === 'remembrance-config') {
                            window.open('/remembrance', '_blank');
                          } else if (item._id === 'testimonials-config') {
                            window.open('/testimonials', '_blank');
                          } else if (item._id === 'gallery-config') {
                            window.open('/gallery', '_blank');
                          } else if (item._id === 'feedback-config') {
                            window.open('/feedback', '_blank');
                          } else if (item._id === 'volunteer-config') {
                            window.open('/volunteer', '_blank');
                          } else if (item._id === 'corporate-config') {
                            window.open('/corporate', '_blank');
                          } else if (item._id === 'legacy-giving-config') {
                            window.open('/legacy-giving', '_blank');
                          } else if (item._id === 'tribute-config') {
                            window.open('/tribute', '_blank');
                          } else if (item._id === 'transparency-config') {
                            window.open('/transparency', '_blank');
                          } else if (item._id === 'schemes-config') {
                            window.open('/schemes', '_blank');
                          } else if (item._id === 'contact-config') {
                            window.open('/contact', '_blank');
                          } else if (item._id === 'press-config') {
                            window.open('/press', '_blank');
                          } else if (item._id === 'documentaries-config') {
                            window.open('/documentaries', '_blank');
                          } else if (item._id === 'layout-config') {
                            window.open('/', '_blank');
                          }
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </button> */}
                      {/* <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled
                        title="Cannot delete page configurations"
                      >
                        Delete
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.type || filters.status 
              ? 'No content matches your current filters.' 
              : 'Get started by creating your first content item.'}
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Create New Content
          </button>
        </div>
      )}

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pages</h3>
          <p className="text-sm text-gray-600 mb-4">Manage static pages</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Manage Pages
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog</h3>
          <p className="text-sm text-gray-600 mb-4">Create blog posts</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            New Post
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">📢</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaigns</h3>
          <p className="text-sm text-gray-600 mb-4">Manage campaigns</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            New Campaign
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">⚙️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Config</h3>
          <p className="text-sm text-gray-600 mb-4">Manage page settings</p>
          <button 
            onClick={() => window.location.href = '/admin/page-config'}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Page Config
          </button>
        </div>
      </div> */}
    </div>
  );
}