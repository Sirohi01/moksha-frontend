'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, FileText, Image, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'page' | 'gallery' | 'story' | 'campaign' | 'volunteer';
  category?: string;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Donate Now',
    description: 'Support our mission by making a donation to help provide dignified cremation services.',
    url: '/donate',
    type: 'page',
  },
  {
    id: '2',
    title: 'Volunteer with Us',
    description: 'Join our team of dedicated volunteers and make a difference in your community.',
    url: '/volunteer',
    type: 'page',
  },
  {
    id: '3',
    title: 'Gallery - Community Support',
    description: 'View images of our community outreach programs and volunteer activities.',
    url: '/gallery',
    type: 'gallery',
    category: 'community',
  },
  {
    id: '4',
    title: 'Adopt a City Campaign',
    description: 'Our initiative to provide comprehensive cremation services in underserved cities.',
    url: '/campaigns/adopt-a-city',
    type: 'campaign',
  },
  {
    id: '5',
    title: 'About Moksha Seva',
    description: 'Learn about our mission, vision, and the work we do to serve humanity.',
    url: '/about',
    type: 'page',
  },
  {
    id: '6',
    title: 'Emergency Services',
    description: '24/7 emergency cremation services available across India.',
    url: '/services',
    type: 'page',
  },
];

const recentSearches = [
  'donation',
  'volunteer',
  'emergency services',
  'gallery',
];

const trendingSearches = [
  'adopt a city',
  'volunteer application',
  'emergency contact',
  'donation receipt',
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
        setSelectedIndex(-1);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      window.location.href = results[selectedIndex].url;
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'page':
        return FileText;
      case 'gallery':
        return Image;
      case 'story':
        return FileText;
      case 'campaign':
        return Heart;
      case 'volunteer':
        return Users;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page':
        return 'text-blue-600 bg-blue-100';
      case 'gallery':
        return 'text-green-600 bg-green-100';
      case 'story':
        return 'text-purple-600 bg-purple-100';
      case 'campaign':
        return 'text-red-600 bg-red-100';
      case 'volunteer':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, gallery, campaigns..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : query.trim() && results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => {
                const Icon = getIcon(result.type);
                const isSelected = index === selectedIndex;
                
                return (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={onClose}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                      isSelected && 'bg-gray-50 dark:bg-gray-700'
                    )}
                  >
                    <div className={cn('p-2 rounded-lg', getTypeColor(result.type))}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                          {result.type}
                        </span>
                        {result.category && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                              {result.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">No results found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Try searching for something else
              </p>
            </div>
          ) : (
            <div className="py-4">
              {recentSearches.length > 0 && (
                <div className="px-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recent Searches
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trending Searches
                  </span>
                </div>
                <div className="space-y-1">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <span>Powered by Moksha Seva Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}