'use client';

import { useState } from 'react';

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  fields: string[];
  filters: any[];
}

interface ImportOptions {
  format: 'csv' | 'excel' | 'json';
  validateData: boolean;
  skipDuplicates: boolean;
  updateExisting: boolean;
}

interface DataExportImportProps {
  entityType: string;
  availableFields: Array<{
    key: string;
    label: string;
    type: string;
  }>;
  onExport: (options: ExportOptions) => Promise<void>;
  onImport: (file: File, options: ImportOptions) => Promise<void>;
}

export default function DataExportImport({ 
  entityType, 
  availableFields, 
  onExport, 
  onImport 
}: DataExportImportProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      start: '',
      end: ''
    },
    fields: availableFields.map(f => f.key),
    filters: []
  });
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    format: 'csv',
    validateData: true,
    skipDuplicates: true,
    updateExisting: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [scheduledExports, setScheduledExports] = useState<any[]>([]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      await onExport(exportOptions);
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      setTimeout(() => {
        setExportProgress(0);
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    try {
      setIsImporting(true);
      setImportProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      await onImport(selectedFile, importOptions);
      
      clearInterval(progressInterval);
      setImportProgress(100);
      
      setTimeout(() => {
        setImportProgress(0);
        setIsImporting(false);
        setSelectedFile(null);
      }, 1000);
    } catch (error) {
      console.error('Import failed:', error);
      setIsImporting(false);
      setImportProgress(0);
    }
  };
  const toggleField = (fieldKey: string) => {
    setExportOptions(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter(f => f !== fieldKey)
        : [...prev.fields, fieldKey]
    }));
  };

  const selectAllFields = () => {
    setExportOptions(prev => ({
      ...prev,
      fields: availableFields.map(f => f.key)
    }));
  };

  const deselectAllFields = () => {
    setExportOptions(prev => ({
      ...prev,
      fields: []
    }));
  };

  const scheduleExport = () => {
    // In a real app, this would save to backend
    const newSchedule = {
      id: Date.now().toString(),
      name: `${entityType} Export`,
      frequency: 'weekly',
      options: exportOptions,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      active: true
    };
    setScheduledExports([...scheduledExports, newSchedule]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">📊 Data Export & Import</h2>
        <p className="text-gray-600 mt-1">Export data or import new records for {entityType}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📤 Export Data
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📥 Import Data
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'export' ? (
          <div className="space-y-6">
            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'csv', label: 'CSV', icon: '📄' },
                  { value: 'excel', label: 'Excel', icon: '📊' },
                  { value: 'pdf', label: 'PDF', icon: '📋' },
                  { value: 'json', label: 'JSON', icon: '🔧' }
                ].map(format => (
                  <label key={format.value} className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.value}
                      checked={exportOptions.format === format.value}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className={`flex items-center justify-center w-full p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      exportOptions.format === format.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <span className="text-xl mr-2">{format.icon}</span>
                      <span className="font-medium">{format.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={exportOptions.dateRange.start}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={exportOptions.dateRange.end}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Fields to Export</label>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllFields}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllFields}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                {availableFields.map(field => (
                  <label key={field.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.fields.includes(field.key)}
                      onChange={() => toggleField(field.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  disabled={isExporting || exportOptions.fields.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting ? 'Exporting...' : '📤 Export Now'}
                </button>
                <button
                  onClick={scheduleExport}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ⏰ Schedule Export
                </button>
              </div>
              
              {isExporting && (
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{exportProgress}%</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Import Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Import Format</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'csv', label: 'CSV', icon: '📄' },
                  { value: 'excel', label: 'Excel', icon: '📊' },
                  { value: 'json', label: 'JSON', icon: '🔧' }
                ].map(format => (
                  <label key={format.value} className="flex items-center">
                    <input
                      type="radio"
                      name="importFormat"
                      value={format.value}
                      checked={importOptions.format === format.value}
                      onChange={(e) => setImportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className={`flex items-center justify-center w-full p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      importOptions.format === format.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <span className="text-xl mr-2">{format.icon}</span>
                      <span className="font-medium">{format.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept={importOptions.format === 'csv' ? '.csv' : importOptions.format === 'excel' ? '.xlsx,.xls' : '.json'}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <div className="text-sm text-gray-600">
                    {selectedFile ? (
                      <span className="text-blue-600 font-medium">{selectedFile.name}</span>
                    ) : (
                      <>
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {importOptions.format.toUpperCase()} files only
                  </div>
                </label>
              </div>
            </div>

            {/* Import Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Import Options</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importOptions.validateData}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, validateData: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Validate data before import</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importOptions.skipDuplicates}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, skipDuplicates: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Skip duplicate records</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importOptions.updateExisting}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, updateExisting: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Update existing records</span>
                </label>
              </div>
            </div>

            {/* Import Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handleImport}
                disabled={isImporting || !selectedFile}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isImporting ? 'Importing...' : '📥 Import Data'}
              </button>
              
              {isImporting && (
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{importProgress}%</span>
                </div>
              )}
            </div>

            {/* Import Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Import Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure your file has the correct column headers</li>
                <li>• Required fields must not be empty</li>
                <li>• Date fields should be in YYYY-MM-DD format</li>
                <li>• Email addresses must be valid</li>
                <li>• Phone numbers should include country code</li>
              </ul>
            </div>
          </div>
        )}

        {/* Scheduled Exports */}
        {scheduledExports.length > 0 && activeTab === 'export' && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">⏰ Scheduled Exports</h3>
            <div className="space-y-3">
              {scheduledExports.map(schedule => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{schedule.name}</div>
                    <div className="text-sm text-gray-600">
                      {schedule.frequency} • Next run: {new Date(schedule.nextRun).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.active ? 'Active' : 'Inactive'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
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