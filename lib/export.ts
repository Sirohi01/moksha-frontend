// Export utilities for CSV and PDF generation
export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = async (data: any[], filename: string, title: string) => {
  try {
    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
      body: JSON.stringify({ data, title }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

export const formatDataForExport = (data: any[], type: 'csv' | 'pdf') => {
  return data.map(item => {
    const formatted: any = {};
    
    Object.keys(item).forEach(key => {
      let value = item[key];
      
      // Format dates
      if (value instanceof Date) {
        value = value.toLocaleDateString();
      } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        value = new Date(value).toLocaleDateString();
      }
      
      // Format objects and arrays
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      
      // Clean up field names
      const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      formatted[cleanKey] = value;
    });
    
    return formatted;
  });
};