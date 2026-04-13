'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoadingSpinner, ActionButton, PageHeader } from '@/components/admin/AdminComponents';
import DonationReceipt from '@/components/DonationReceipt';
import { ArrowLeft, Printer, Mail, Share2, Download } from 'lucide-react';

export default function DonationReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDonation();
  }, [id]);

  const fetchDonation = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonation(data.data);
      } else {
        console.error('Failed to fetch donation details');
      }
    } catch (error) {
      console.error('Error fetching donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const receiptHTML = receiptRef.current.innerHTML;
        
        // Grab all styles from the current document to ensure Tailwind works
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
          .map(style => style.outerHTML)
          .join('');

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base href="${window.location.origin}">
              <title>Moksha_Sewa_Receipt_${donation?.receiptNumber}</title>
              <meta charset="utf-8">
              ${styles}
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                  font-family: 'Inter', sans-serif;
                  background: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                @page {
                  size: A4;
                  margin: 0;
                }
                .print-container {
                  width: 210mm;
                  min-height: 297mm;
                  margin: 0 auto;
                  background: white !important;
                }
                /* Hide everything in print that isn't the container if needed */
                @media print {
                  body { margin: 0; }
                  .print-container { width: 210mm; height: 100%; border: none; shadow: none; }
                }
              </style>
            </head>
            <body>
              <div class="print-container">
                ${receiptHTML}
              </div>
              <script>
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    window.print();
                    // window.close();
                  }, 800);
                });
              </script>
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();
      }
    }
  };

  const handleEmailReceipt = async () => {
    try {
      const token = localStorage.getItem('adminToken');
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

      if (response.ok) {
        alert('Receipt email sent successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to send email: ${error.message}`);
      }
    } catch (error) {
      console.error('Error sending receipt:', error);
      alert('Failed to send email. Please check your connection.');
    }
  };

  if (loading) return <LoadingSpinner size="lg" message="Generating digital receipt..." />;
  if (!donation) return <div className="text-center py-20 text-navy-700 font-bold uppercase tracking-widest bg-white/50 rounded-[3rem] border border-navy-50">Transaction Record Not Found.</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between print:hidden">
        <ActionButton
          variant="secondary"
          onClick={() => router.back()}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="bg-white border-navy-50 text-navy-700 hover:bg-navy-950 hover:text-white transition-all duration-500 rounded-2xl px-6 py-3"
        >
          Return to Ledger
        </ActionButton>

        <div className="flex gap-4">
          <ActionButton 
            onClick={handlePrint} 
            icon={<Printer className="w-4 h-4" />}
            className="bg-navy-950 text-gold-500 hover:bg-navy-900 transition-all duration-500 rounded-2xl px-8 py-3 shadow-2xl shadow-navy-200"
          >
            Generate Print Layout
          </ActionButton>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title="Donation Authentication"
          description={`Validating and displaying authorized digital receipt for Record: ${donation.donationId}`}
        />
      </div>

      <div className="relative group">
        {/* Glow effect behind receipt */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-orange-50 to-amber-50 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000 print:hidden"></div>
        
        <div className="relative bg-white/60 backdrop-blur-2xl rounded-[3rem] p-4 md:p-12 border border-white shadow-[0_64px_128px_-32px_rgba(0,26,51,0.08)] transition-all duration-1000 hover:shadow-[0_64px_128px_-32px_rgba(0,26,51,0.12)]">
          <div className="max-w-[210mm] mx-auto overflow-hidden">
            <DonationReceipt ref={receiptRef} donation={donation} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:hidden">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-navy-50/50 text-center space-y-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <p className="text-[10px] font-black text-navy-500 uppercase tracking-[0.3em]">Transaction Integrity</p>
          <div className="flex items-center justify-center gap-2">
             <div className={`w-2 h-2 rounded-full ${donation.paymentStatus === 'completed' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
             <p className={`text-xs font-black uppercase tracking-widest ${donation.paymentStatus === 'completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
               {donation.paymentStatus}
             </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-navy-50/50 text-center space-y-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <p className="text-[10px] font-black text-navy-500 uppercase tracking-[0.3em]">System Record ID</p>
          <p className="text-xs font-black text-navy-950 uppercase tracking-tighter">
            {donation.receiptNumber}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-navy-50/50 text-center space-y-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <p className="text-[10px] font-black text-navy-500 uppercase tracking-[0.3em]">Verification Hash</p>
          <p className="text-[9px] font-mono text-navy-700 truncate px-6">
            {donation._id}
          </p>
        </div>
      </div>
    </div>
  );
}
