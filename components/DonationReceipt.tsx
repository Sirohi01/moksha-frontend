'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { amountToWords } from '@/utils/numberToWords';

interface DonationReceiptProps {
  donation: {
    _id: string;
    donationId: string;
    name: string;
    email: string;
    phone: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentStatus: string;
    donationType: string;
    purpose: string;
    receiptNumber: string;
    createdAt: string;
    address?: string;
    panNumber?: string;
  };
  settings?: {
    general?: {
      siteName?: string;
      siteUrl?: string;
    };
    institutional?: {
      organizationName?: string;
      address?: string;
      pan?: string;
      gstin?: string;
      registrationNo?: string;
      eightyGNo?: string;
      twelveANo?: string;
      fcraNo?: string;
      authorizedSignatory?: string;
      designation?: string;
      contactPhone?: string;
      contactEmail?: string;
    };
  };
}

const DonationReceipt = forwardRef<HTMLDivElement, DonationReceiptProps>(
  ({ donation, settings }, ref) => {
    const inst = settings?.institutional || {};
    const general = settings?.general || {};

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const formatPurpose = (purpose: string) => {
      return purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDonationType = (type: string) => {
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
      <div
        ref={ref}
        className="bg-white p-12 max-w-4xl mx-auto shadow-2xl rounded-none relative overflow-hidden print:shadow-none print:p-8"
        style={{ minHeight: '297mm', width: '210mm' }}
      >
        {/* Decorative Watermark / Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center -rotate-12 select-none">
          <p className="text-[12rem] font-black tracking-tighter uppercase">{general.siteName || 'MOKSHA SEWA'}</p>
        </div>

        {/* Outer Decorative Border */}
        <div className="absolute inset-4 border-[12px] border-orange-50/50 pointer-events-none"></div>
        <div className="absolute inset-8 border border-orange-200 pointer-events-none"></div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Logo */}
          <div className="text-center mb-10 border-b-2 border-orange-100 pb-8 mt-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl mb-4 transform -rotate-3">
                <Image
                  src="/logo.png"
                  alt="Moksha Sewa Logo"
                  width={56}
                  height={56}
                  className="object-contain filter brightness-0 invert"
                />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-black text-navy-950 tracking-tighter uppercase mb-1">{inst.organizationName || 'Moksha Sewa Foundation'}</h1>
                <p className="text-xs text-orange-600 font-black uppercase tracking-[0.3em]">Compassion in every departure</p>
              </div>
            </div>

            <div className="inline-block px-8 py-2 bg-navy-950 text-gold-500 text-sm font-black uppercase tracking-widest rounded-full mb-4">
              Official Donation Certificate
            </div>

            <div className="text-center space-y-1">
              <p className="text-gray-600 text-sm italic">"Thank you for your generous contribution toward a dignified final journey."</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Registration No: {inst.registrationNo || 'MSF-2024-001'} | 80G Tax Exempted</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-8 mb-10">
            {/* Left Column: Transaction & Donor Info */}
            <div className="col-span-12 space-y-8">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black text-navy-950 uppercase tracking-widest mb-3 border-b border-navy-50 pb-2">
                      Authentication Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end border-b border-dotted border-gray-200 pb-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Receipt Number</span>
                        <span className="text-sm font-black text-orange-600">{donation.receiptNumber}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-dotted border-gray-200 pb-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Transaction ID</span>
                        <span className="text-[11px] font-mono font-medium text-navy-900">{donation.donationId}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-dotted border-gray-200 pb-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Issued Date</span>
                        <span className="text-sm font-bold text-navy-900">{formatDate(donation.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-navy-950 uppercase tracking-widest mb-3 border-b border-navy-50 pb-2">
                      Donor Credentials
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Legal Name</span>
                        <p className="text-lg font-black text-navy-950 leading-none mt-1">{donation.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Identity (PAN)</span>
                          <p className="font-mono text-sm font-bold text-navy-800">{donation.panNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Contact</span>
                          <p className="text-sm font-bold text-navy-800">{donation.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Amount & Status Highlight */}
                <div className="flex flex-col justify-between">
                  <div className="bg-navy-950 rounded-[2rem] p-8 text-center shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    <p className="text-gold-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Amount Contributed</p>
                    <p className="text-5xl font-black text-white tracking-widest mb-2">
                      <span className="text-2xl text-gold-500 font-light mr-1">₹</span>
                      {donation.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest border-t border-white/10 pt-4 mt-2">
                      Currency: {donation.currency.toUpperCase()} | Status: {donation.paymentStatus.toUpperCase()}
                    </p>
                  </div>

                  <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-2">Contribution Purpose</p>
                    <p className="text-sm font-bold text-navy-900 leading-tight">
                      {formatPurpose(donation.purpose)}
                    </p>
                    <div className="mt-4 px-4 py-1.2 bg-white rounded-full border border-orange-200 text-[9px] font-black text-orange-700 uppercase">
                      {formatDonationType(donation.donationType)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words Segment */}
          <div className="mb-10 bg-[#f9fafb] border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex-1 pr-8">
              <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Formal Amount Declaration</span>
              <p className="text-sm font-bold text-navy-900 italic">
                "Rupees {amountToWords(donation.amount)} only"
              </p>
            </div>
            <div className="w-24 h-24 bg-white border border-gray-200 p-2 rounded-xl flex items-center justify-center opacity-40">
              {/* QR Placeholder */}
              <div className="text-[8px] text-center font-bold text-gray-400 leading-tight">VALIDATION<br />QR CODE</div>
            </div>
          </div>

          {/* Compliance & Footnote */}
          <div className="mt-auto pt-8 border-t-4 border-double border-gray-100">
            <div className="grid grid-cols-2 gap-12 mb-10">
              <div>
                <h4 className="text-[10px] font-black text-navy-950 uppercase tracking-widest mb-4">Tax & Legal Compliance</h4>
                <div className="space-y-2">
                  <p className="text-[9px] text-gray-600 leading-relaxed">• This contribution is eligible for tax deduction under Section 80G of the Income Tax Act.</p>
                  <p className="text-[9px] text-gray-600 leading-relaxed">• {inst.organizationName || 'Moksha Sewa Foundation'} is a registered charitable trust (Reg No: {inst.registrationNo || 'N/A'}).</p>
                  <p className="text-[9px] text-gray-600 leading-relaxed">• PAN: {inst.pan || 'N/A'} | 80G Registration: {inst.eightyGNo || 'N/A'}</p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="mb-4">
                  <div className="w-48 h-16 border-b-2 border-navy-900 mb-2 relative">
                    {/* Placeholder for Signature Image if exists */}
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-300 font-black uppercase opacity-50 italic">Electronic Signature</div>
                  </div>
                  <p className="text-xs font-black text-navy-950 uppercase mb-0.5">{inst.authorizedSignatory || 'Authorized Person'}</p>
                  <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">{inst.designation || 'Signatory'}</p>
                </div>
              </div>
            </div>

            <div className="text-center py-6 bg-navy-950 -mx-12 -mb-12 mt-4 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">{general.siteUrl?.replace('https://', '') || 'www.mokshasewa.org'} | {inst.contactEmail || 'info@mokshasewa.org'}</p>
              <p className="text-[8px] opacity-40 mt-1">Computer Generated | Verifiable Receipt | Generated at: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DonationReceipt.displayName = 'DonationReceipt';

export default DonationReceipt;