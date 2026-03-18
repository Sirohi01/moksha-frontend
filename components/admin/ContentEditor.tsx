'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  BarChart3,
  Users,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface EditorProps {
  section: any;
  onUpdate: (data: any) => void;
}

export const HeroEditor = ({ section, onUpdate }: EditorProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          Hero Section
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Main Title</label>
            <input
              type="text"
              value={section.title || ''}
              onChange={(e) => onUpdate({ ...section, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter compelling hero title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle/Description</label>
            <textarea
              value={section.description || ''}
              onChange={(e) => onUpdate({ ...section, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
              placeholder="Brief description that captures attention"
            />
            <p className="text-xs text-gray-500 mt-1">Keep it concise and impactful</p>
          </div>
          
          {section.badge && (
            <div>
              <label className="block text-sm font-medium mb-2">Badge Text</label>
              <input
                type="text"
                value={section.badge || ''}
                onChange={(e) => onUpdate({ ...section, badge: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional badge text"
              />
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Image/Background</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {section.image ? (
                <div className="space-y-2">
                  <div className="relative w-full h-32">
                    <Image 
                      src={section.image} 
                      alt="Hero preview" 
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <input
                    type="text"
                    value={section.image}
                    onChange={(e) => onUpdate({ ...section, image: e.target.value })}
                    className="w-full p-2 text-sm border rounded"
                    placeholder="Image URL"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Upload image or enter URL</p>
                  <input
                    type="text"
                    onChange={(e) => onUpdate({ ...section, image: e.target.value })}
                    className="w-full p-2 text-sm border rounded"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-3">Call-to-Action Buttons</label>
        <div className="space-y-3">
          {(section.buttons || []).map((button: any, index: number) => (
            <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={button.text || ''}
                onChange={(e) => {
                  const newButtons = [...(section.buttons || [])];
                  newButtons[index] = { ...button, text: e.target.value };
                  onUpdate({ ...section, buttons: newButtons });
                }}
                className="flex-1 p-2 border rounded"
                placeholder="Button text"
              />
              <input
                type="text"
                value={button.href || ''}
                onChange={(e) => {
                  const newButtons = [...(section.buttons || [])];
                  newButtons[index] = { ...button, href: e.target.value };
                  onUpdate({ ...section, buttons: newButtons });
                }}
                className="flex-1 p-2 border rounded"
                placeholder="Button link"
              />
              <select
                value={button.variant || 'primary'}
                onChange={(e) => {
                  const newButtons = [...(section.buttons || [])];
                  newButtons[index] = { ...button, variant: e.target.value };
                  onUpdate({ ...section, buttons: newButtons });
                }}
                className="p-2 border rounded"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newButtons = (section.buttons || []).filter((_: any, i: number) => i !== index);
                  onUpdate({ ...section, buttons: newButtons });
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => {
              const newButtons = [...(section.buttons || []), { text: '', href: '', variant: 'primary' }];
              onUpdate({ ...section, buttons: newButtons });
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Button
          </Button>
        </div>
      </div>
      
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Advanced Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Animation Type</label>
              <select className="w-full p-2 border rounded">
                <option value="fade">Fade In</option>
                <option value="slide">Slide Up</option>
                <option value="zoom">Zoom In</option>
                <option value="none">No Animation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Overlay</label>
              <select className="w-full p-2 border rounded">
                <option value="none">None</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export const TextEditor = ({ section, onUpdate }: EditorProps) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Type className="w-5 h-5 text-green-500" />
      {section.title || 'Text Section'}
    </h3>
    
    <div className="space-y-4">
      {section.badge !== undefined && (
        <div>
          <label className="block text-sm font-medium mb-2">Badge/Tag</label>
          <input
            type="text"
            value={section.badge || ''}
            onChange={(e) => onUpdate({ ...section, badge: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Optional badge text"
          />
        </div>
      )}
      
      {section.title !== undefined && (
        <div>
          <label className="block text-sm font-medium mb-2">Section Title</label>
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Section title"
          />
        </div>
      )}
      
      {section.titleHighlight !== undefined && (
        <div>
          <label className="block text-sm font-medium mb-2">Highlighted Title Part</label>
          <input
            type="text"
            value={section.titleHighlight || ''}
            onChange={(e) => onUpdate({ ...section, titleHighlight: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Part of title to highlight"
          />
        </div>
      )}
      
      {section.description !== undefined && (
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={section.description || ''}
            onChange={(e) => onUpdate({ ...section, description: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            placeholder="Detailed description"
          />
        </div>
      )}
    </div>
  </Card>
);

export const StatsEditor = ({ section, onUpdate }: EditorProps) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-purple-500" />
      Statistics Section
    </h3>
    
    <div className="space-y-4">
      {section.stats && (
        <div>
          <label className="block text-sm font-medium mb-3">Statistics</label>
          <div className="space-y-3">
            {section.stats.map((stat: any, index: number) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={stat.number || ''}
                  onChange={(e) => {
                    const newStats = [...section.stats];
                    newStats[index] = { ...stat, number: e.target.value };
                    onUpdate({ ...section, stats: newStats });
                  }}
                  className="w-32 p-2 border rounded font-mono"
                  placeholder="5000+"
                />
                <input
                  type="text"
                  value={stat.label || ''}
                  onChange={(e) => {
                    const newStats = [...section.stats];
                    newStats[index] = { ...stat, label: e.target.value };
                    onUpdate({ ...section, stats: newStats });
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Stat description"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newStats = section.stats.filter((_: any, i: number) => i !== index);
                    onUpdate({ ...section, stats: newStats });
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={() => {
                const newStats = [...(section.stats || []), { number: '', label: '' }];
                onUpdate({ ...section, stats: newStats });
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Statistic
            </Button>
          </div>
        </div>
      )}
    </div>
  </Card>
);

export const LinksEditor = ({ section, onUpdate }: EditorProps) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <LinkIcon className="w-5 h-5 text-blue-500" />
      Links Section
    </h3>
    
    <div className="space-y-4">
      {Array.isArray(section) ? (
        <div>
          <label className="block text-sm font-medium mb-3">Navigation Links</label>
          <div className="space-y-3">
            {section.map((link: any, index: number) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => {
                    const newLinks = [...section];
                    newLinks[index] = { ...link, label: e.target.value };
                    onUpdate(newLinks);
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Link text"
                />
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => {
                    const newLinks = [...section];
                    newLinks[index] = { ...link, href: e.target.value };
                    onUpdate(newLinks);
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Link URL"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newLinks = section.filter((_: any, i: number) => i !== index);
                    onUpdate(newLinks);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={() => {
                const newLinks = [...section, { label: '', href: '' }];
                onUpdate(newLinks);
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <LinkIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>This section contains complex link data</p>
          <p className="text-sm">Use the JSON editor for advanced editing</p>
        </div>
      )}
    </div>
  </Card>
);

export const SocialEditor = ({ section, onUpdate }: EditorProps) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Users className="w-5 h-5 text-pink-500" />
      Social Media Section
    </h3>
    
    <div className="space-y-4">
      {section.socialLinks && (
        <div>
          <label className="block text-sm font-medium mb-3">Social Media Links</label>
          <div className="space-y-3">
            {section.socialLinks.map((social: any, index: number) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={social.name || ''}
                  onChange={(e) => {
                    const newSocials = [...section.socialLinks];
                    newSocials[index] = { ...social, name: e.target.value };
                    onUpdate({ ...section, socialLinks: newSocials });
                  }}
                  className="w-32 p-2 border rounded"
                  placeholder="Platform"
                />
                <input
                  type="text"
                  value={social.url || ''}
                  onChange={(e) => {
                    const newSocials = [...section.socialLinks];
                    newSocials[index] = { ...social, url: e.target.value };
                    onUpdate({ ...section, socialLinks: newSocials });
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Social media URL"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newSocials = section.socialLinks.filter((_: any, i: number) => i !== index);
                    onUpdate({ ...section, socialLinks: newSocials });
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={() => {
                const newSocials = [...(section.socialLinks || []), { name: '', url: '', icon: '', color: '' }];
                onUpdate({ ...section, socialLinks: newSocials });
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
        </div>
      )}
    </div>
  </Card>
);