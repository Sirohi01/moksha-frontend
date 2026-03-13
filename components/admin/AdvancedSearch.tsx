'use client';

import { useState, useEffect } from 'react';

interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: string | number | [string | number, string | number];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilter[];
  createdAt: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter[]) => void;
  onClear: () => void;
  searchableFields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
  placeholder?: string;
}

export default function AdvancedSearch({ 
  onSearch, 
  onClear, 
  searchableFields, 
  placeholder = "Search..." 
}: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  useEffect(() => {
    if (quickSearch.length > 2) {
      generateSuggestions(quickSearch);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [quickSearch]);

  const loadSavedSearches = () => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  };

  const generateSuggestions = async (query: string) => {
    // In a real app, this would call an API
    const mockSuggestions = [
      `${query} reports`,
      `${query} volunteers`,
      `${query} donations`,
      `recent ${query}`,
      `${query} status:pending`
    ];
    setSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };
  const addFilter = () => {
    setFilters([...filters, {
      field: searchableFields[0]?.key || '',
      operator: 'contains',
      value: ''
    }]);
  };

  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const allFilters = [...filters];
    
    // Add quick search as a filter if present
    if (quickSearch.trim()) {
      allFilters.push({
        field: 'global',
        operator: 'contains',
        value: quickSearch.trim()
      });
    }
    
    onSearch(allFilters);
  };

  const handleClear = () => {
    setQuickSearch('');
    setFilters([]);
    setShowSuggestions(false);
    onClear();
  };

  const saveSearch = () => {
    if (!searchName.trim()) return;
    
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      filters: [...filters],
      createdAt: new Date().toISOString()
    };
    
    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    
    setSearchName('');
    setShowSaveModal(false);
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    setIsExpanded(true);
    onSearch(search.filters);
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const getOperatorOptions = (fieldType: string) => {
    switch (fieldType) {
      case 'number':
      case 'date':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'greaterThan', label: 'Greater than' },
          { value: 'lessThan', label: 'Less than' },
          { value: 'between', label: 'Between' }
        ];
      case 'select':
        return [
          { value: 'equals', label: 'Equals' }
        ];
      default:
        return [
          { value: 'contains', label: 'Contains' },
          { value: 'equals', label: 'Equals' },
          { value: 'startsWith', label: 'Starts with' },
          { value: 'endsWith', label: 'Ends with' }
        ];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      {/* Quick Search */}
      <div className="relative">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuickSearch(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? '🔼' : '🔽'} Advanced
          </button>
          
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            <div className="flex space-x-2">
              <button
                onClick={addFilter}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                + Add Filter
              </button>
              {filters.length > 0 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                >
                  💾 Save Search
                </button>
              )}
            </div>
          </div>

          {/* Filter Rows */}
          {filters.map((filter, index) => {
            const field = searchableFields.find(f => f.key === filter.field);
            const operatorOptions = getOperatorOptions(field?.type || 'text');
            
            return (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                {/* Field Selection */}
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(index, { field: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {searchableFields.map(field => (
                    <option key={field.key} value={field.key}>
                      {field.label}
                    </option>
                  ))}
                </select>

                {/* Operator Selection */}
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {operatorOptions.map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>

                {/* Value Input */}
                {filter.operator === 'between' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                      value={Array.isArray(filter.value) ? filter.value[0] : ''}
                      onChange={(e) => updateFilter(index, { 
                        value: [e.target.value, Array.isArray(filter.value) ? filter.value[1] : ''] 
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="From"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                      value={Array.isArray(filter.value) ? filter.value[1] : ''}
                      onChange={(e) => updateFilter(index, { 
                        value: [Array.isArray(filter.value) ? filter.value[0] : '', e.target.value] 
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="To"
                    />
                  </div>
                ) : field?.type === 'select' ? (
                  <select
                    value={filter.value as string}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                    value={filter.value as string}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter value..."
                  />
                )}

                {/* Remove Filter */}
                <button
                  onClick={() => removeFilter(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  🗑️
                </button>
              </div>
            );
          })}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Saved Searches</h4>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map(search => (
                  <div key={search.id} className="flex items-center bg-blue-50 rounded-lg">
                    <button
                      onClick={() => loadSavedSearch(search)}
                      className="px-3 py-1 text-blue-700 hover:bg-blue-100 rounded-l-lg transition-colors text-sm"
                    >
                      {search.name}
                    </button>
                    <button
                      onClick={() => deleteSavedSearch(search.id)}
                      className="px-2 py-1 text-red-600 hover:bg-red-100 rounded-r-lg transition-colors text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Search</h3>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter search name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}