'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Globe, Twitter, Facebook, Eye, AlertCircle } from 'lucide-react';
import { getSafeSrc } from '@/lib/utils';

interface MetaTagsData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

interface MetaTagsManagerProps {
  data: Partial<MetaTagsData>;
  onChange: (data: Partial<MetaTagsData>) => void;
  onSave?: () => void;
}

export default function MetaTagsManager({ data, onChange, onSave }: MetaTagsManagerProps) {
  const [formData, setFormData] = useState<Partial<MetaTagsData>>(data);
  const [activeTab, setActiveTab] = useState('basic');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof MetaTagsData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const getCharacterCount = (text: string, max: number) => {
    const count = text?.length || 0;
    const isOver = count > max;
    const isUnder = count < max * 0.7; // Less than 70% of max
    
    return {
      count,
      max,
      isOver,
      isUnder,
      className: isOver ? 'text-red-500' : isUnder ? 'text-yellow-500' : 'text-green-500'
    };
  };

  const tabs = [
    { id: 'basic', name: 'Basic SEO', icon: <Search className="w-4 h-4" /> },
    { id: 'opengraph', name: 'Open Graph', icon: <Facebook className="w-4 h-4" /> },
    { id: 'twitter', name: 'Twitter Cards', icon: <Twitter className="w-4 h-4" /> },
    { id: 'advanced', name: 'Advanced', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Meta Tags Manager</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreview(!preview)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                preview 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            {onSave && (
              <button
                onClick={onSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4">
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
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Basic SEO Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meta title..."
              />
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Recommended: 30-60 characters
                </div>
                <div className={`text-xs ${getCharacterCount(formData.metaTitle || '', 60).className}`}>
                  {getCharacterCount(formData.metaTitle || '', 60).count}/60
                </div>
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meta description..."
              />
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Recommended: 120-160 characters
                </div>
                <div className={`text-xs ${getCharacterCount(formData.metaDescription || '', 160).className}`}>
                  {getCharacterCount(formData.metaDescription || '', 160).count}/160
                </div>
              </div>
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={formData.metaKeywords || ''}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="keyword1, keyword2, keyword3..."
              />
              <div className="mt-1 text-xs text-gray-500">
                Separate keywords with commas
              </div>
            </div>
          </div>
        )}

        {/* Open Graph Tab */}
        {activeTab === 'opengraph' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Open Graph Tags</h4>
                  <p className="text-sm text-blue-700">Control how your content appears when shared on social media</p>
                </div>
              </div>
            </div>

            {/* OG Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Title
              </label>
              <input
                type="text"
                value={formData.ogTitle || ''}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Open Graph title..."
              />
            </div>

            {/* OG Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Description
              </label>
              <textarea
                value={formData.ogDescription || ''}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Open Graph description..."
              />
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Image URL
              </label>
              <input
                type="url"
                value={formData.ogImage || ''}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <div className="mt-1 text-xs text-gray-500">
                Recommended size: 1200x630 pixels
              </div>
            </div>

            {/* OG Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Type
              </label>
              <select
                value={formData.ogType || 'website'}
                onChange={(e) => handleChange('ogType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="product">Product</option>
                <option value="profile">Profile</option>
              </select>
            </div>
          </div>
        )}

        {/* Twitter Cards Tab */}
        {activeTab === 'twitter' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Twitter className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Twitter Cards</h4>
                  <p className="text-sm text-blue-700">Optimize how your content appears on Twitter</p>
                </div>
              </div>
            </div>

            {/* Twitter Card Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Card Type
              </label>
              <select
                value={formData.twitterCard || 'summary_large_image'}
                onChange={(e) => handleChange('twitterCard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>

            {/* Twitter Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Title
              </label>
              <input
                type="text"
                value={formData.twitterTitle || ''}
                onChange={(e) => handleChange('twitterTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Twitter title..."
              />
            </div>

            {/* Twitter Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Description
              </label>
              <textarea
                value={formData.twitterDescription || ''}
                onChange={(e) => handleChange('twitterDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Twitter description..."
              />
            </div>

            {/* Twitter Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Image URL
              </label>
              <input
                type="url"
                value={formData.twitterImage || ''}
                onChange={(e) => handleChange('twitterImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={formData.canonicalUrl || ''}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/page"
              />
              <div className="mt-1 text-xs text-gray-500">
                Helps prevent duplicate content issues
              </div>
            </div>

            {/* SEO Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">SEO Tips</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Keep meta titles between 30-60 characters</li>
                    <li>• Write meta descriptions between 120-160 characters</li>
                    <li>• Use relevant keywords naturally</li>
                    <li>• Make each page's meta tags unique</li>
                    <li>• Include your brand name in titles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {preview && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Search Result Preview</h4>
            
            {/* Google Search Preview */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
              <div className="text-sm text-green-600 mb-1">
                {formData.canonicalUrl || 'https://example.com/page'}
              </div>
              <div className="text-lg text-blue-600 hover:underline cursor-pointer mb-1">
                {formData.metaTitle || 'Page Title'}
              </div>
              <div className="text-sm text-gray-600">
                {formData.metaDescription || 'Meta description will appear here...'}
              </div>
            </div>

            {/* Social Media Preview */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Social Media Preview</h5>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-md">
                {formData.ogImage && (
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <Image 
                      src={getSafeSrc(formData.ogImage)} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-cover"
                      width={200}
                      height={128}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {formData.ogTitle || formData.metaTitle || 'Page Title'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formData.ogDescription || formData.metaDescription || 'Description will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}