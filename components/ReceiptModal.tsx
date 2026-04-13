'use client';

import { useRef } from 'react';
import DonationReceipt from './DonationReceipt';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: any;
}

export default function ReceiptModal({ isOpen, onClose, donation }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const receiptHTML = receiptRef.current.innerHTML;
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Receipt-${donation.receiptNumber}</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: 'Inter', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background: white;
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                
                .bg-white { background-color: white !important; }
                .bg-gradient-to-r { background: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
                .from-amber-500 { --tw-gradient-from: #f59e0b; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(245, 158, 11, 0)); }
                .to-orange-500 { --tw-gradient-to: #f97316; }
                .from-orange-50 { --tw-gradient-from: #fff7ed; }
                .to-amber-50 { --tw-gradient-to: #fffbeb; }
                .text-orange-600 { color: #ea580c !important; }
                .text-blue-700 { color: #1d4ed8 !important; }
                .text-gray-900 { color: #111827 !important; }
                .text-gray-800 { color: #1f2937 !important; }
                .text-gray-700 { color: #374151 !important; }
                .text-gray-600 { color: #4b5563 !important; }
                .text-gray-500 { color: #6b7280 !important; }
                .border-orange-200 { border-color: #fed7aa !important; }
                .border-gray-200 { border-color: #e5e7eb !important; }
                .border-blue-200 { border-color: #dbeafe !important; }
                .bg-orange-50 { background-color: #fff7ed !important; }
                .bg-amber-50 { background-color: #fffbeb !important; }
                .bg-blue-50 { background-color: #eff6ff !important; }
                .bg-gray-50 { background-color: #f9fafb !important; }
                .bg-green-100 { background-color: #dcfce7 !important; }
                .bg-yellow-100 { background-color: #fef3c7 !important; }
                .text-green-800 { color: #166534 !important; }
                .text-yellow-800 { color: #92400e !important; }
                
                .p-8 { padding: 2rem; }
                .p-6 { padding: 1.5rem; }
                .p-4 { padding: 1rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-1 { margin-bottom: 0.25rem; }
                .mt-8 { margin-top: 2rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-1 { margin-top: 0.25rem; }
                .mr-4 { margin-right: 1rem; }
                .mr-3 { margin-right: 0.75rem; }
                .mr-2 { margin-right: 0.5rem; }
                
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .text-xs { font-size: 0.75rem; line-height: 1rem; }
                
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .font-medium { font-weight: 500; }
                
                .rounded-lg { border-radius: 0.5rem; }
                .rounded-xl { border-radius: 0.75rem; }
                .rounded-full { border-radius: 9999px; }
                
                .border { border-width: 1px; }
                .border-2 { border-width: 2px; }
                .border-b-2 { border-bottom-width: 2px; }
                .border-t-2 { border-top-width: 2px; }
                .border-t { border-top-width: 1px; }
                .border-b { border-bottom-width: 1px; }
                
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
                .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                
                .flex { display: flex; }
                .grid { display: grid; }
                .text-center { text-align: center; }
                .text-left { text-left: left; }
                .text-right { text-align: right; }
                .items-center { align-items: center; }
                .justify-center { justify-content: center; }
                .justify-between { justify-content: space-between; }
                .space-y-6 > * + * { margin-top: 1.5rem; }
                .space-y-4 > * + * { margin-top: 1rem; }
                .space-y-3 > * + * { margin-top: 0.75rem; }
                .space-y-2 > * + * { margin-top: 0.5rem; }
                .space-y-1 > * + * { margin-top: 0.25rem; }
                .space-x-4 > * + * { margin-left: 1rem; }
                .space-x-3 > * + * { margin-left: 0.75rem; }
                
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .gap-6 { gap: 1.5rem; }
                
                .w-16 { width: 4rem; }
                .w-12 { width: 3rem; }
                .w-10 { width: 2.5rem; }
                .w-8 { width: 2rem; }
                .w-6 { width: 1.5rem; }
                .w-4 { width: 1rem; }
                .w-3 { width: 0.75rem; }
                .w-2 { width: 0.5rem; }
                .w-32 { width: 8rem; }
                .h-16 { height: 4rem; }
                .h-12 { height: 3rem; }
                .h-10 { height: 2.5rem; }
                .h-8 { height: 2rem; }
                .h-6 { height: 1.5rem; }
                .h-4 { height: 1rem; }
                .h-3 { height: 0.75rem; }
                .h-2 { height: 0.5rem; }
                
                .max-w-2xl { max-width: 42rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                
                .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                
                .tracking-wide { letter-spacing: 0.025em; }
                
                .object-contain { object-fit: contain; }
                
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: .5; }
                }
                
                @media print {
                  body { 
                    background: white !important;
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                  }
                  
                  .bg-gradient-to-r {
                    background: linear-gradient(to right, #f59e0b, #f97316) !important;
                  }
                  
                  .shadow-2xl, .shadow-lg, .shadow-md {
                    box-shadow: none !important;
                  }
                }
              </style>
            </head>
            <body>
              ${receiptHTML}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleEmailReceipt = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('🔐 Authentication required. Please login again.');
        return;
      }

      // Show loading state
      const emailBtn = document.querySelector('[data-email-btn]') as HTMLButtonElement;
      if (emailBtn) {
        emailBtn.textContent = 'Sending...';
        emailBtn.disabled = true;
        emailBtn.style.opacity = '0.7';
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/${donation._id}/email-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: donation.email,
          receiptNumber: donation.receiptNumber,
          donationId: donation.donationId
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 10000; font-family: 'Inter', sans-serif; max-width: 400px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">✅</div>
              <div>
                <div style="font-weight: bold; margin-bottom: 4px;">📧 Receipt Email Sent!</div>
                <div style="font-size: 14px; opacity: 0.9;">PDF receipt attached to email sent to ${donation.email}</div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 5000);
        
      } else {
        // Error notification
        const errorMsg = result.message || 'Failed to send email';
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 10000; font-family: 'Inter', sans-serif; max-width: 400px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">❌</div>
              <div>
                <div style="font-weight: bold; margin-bottom: 4px;">Email Failed</div>
                <div style="font-size: 14px; opacity: 0.9;">${errorMsg}</div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 7000);
      }
    } catch (error) {
      console.error('Error sending receipt:', error);
      
      // Network error notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 10000; font-family: 'Inter', sans-serif; max-width: 400px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">⚠️</div>
            <div>
              <div style="font-weight: bold; margin-bottom: 4px;">Connection Error</div>
              <div style="font-size: 14px; opacity: 0.9;">Unable to connect to server. Please check your internet connection.</div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 7000);
    } finally {
      // Reset button state
      const emailBtn = document.querySelector('[data-email-btn]') as HTMLButtonElement;
      if (emailBtn) {
        emailBtn.textContent = 'Email Receipt';
        emailBtn.disabled = false;
        emailBtn.style.opacity = '1';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Donation Receipt</h2>
              <p className="text-sm text-gray-600">Receipt #{donation.receiptNumber}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              
              <button
                data-email-btn
                onClick={handleEmailReceipt}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Receipt
              </button>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          <DonationReceipt 
            ref={receiptRef}
            donation={donation} 
          />
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Receipt generated on: {new Date().toLocaleString('en-IN')}</p>
              <p>Status: <span className={`font-semibold ${
                donation.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {donation.paymentStatus.toUpperCase()}
              </span></p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
