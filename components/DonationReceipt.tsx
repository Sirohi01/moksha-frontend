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
}

const DonationReceipt = forwardRef<HTMLDivElement, DonationReceiptProps>(
  ({ donation }, ref) => {
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
      <div ref={ref} className="bg-white p-8 max-w-2xl mx-auto shadow-2xl rounded-lg border border-gray-200">
        {/* Header with Logo */}
        <div className="text-center mb-8 border-b-2 border-orange-200 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg mr-4">
              <Image
                src="/logo.png"
                alt="Moksha Sewa Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-800 tracking-wide">Moksha Sewa</h1>
              <p className="text-sm text-gray-600 font-medium">Dignity in Departure</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-2">DONATION RECEIPT</h2>
            <p className="text-gray-600">Tax Exemption under Section 80G of Income Tax Act, 1961</p>
            <p className="text-sm text-gray-500 mt-1">Registration No: [Your 80G Registration Number]</p>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
              Receipt Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Receipt No:</span>
                <span className="font-semibold text-orange-600">{donation.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Donation ID:</span>
                <span className="font-mono text-sm">{donation.donationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="font-semibold">{formatDate(donation.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${donation.paymentStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {donation.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
              Donor Information
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 font-medium">Name:</span>
                <p className="font-semibold">{donation.name}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Email:</span>
                <p className="text-sm">{donation.email}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Phone:</span>
                <p className="text-sm">{donation.phone}</p>
              </div>
              {donation.panNumber && (
                <div>
                  <span className="text-gray-600 font-medium">PAN:</span>
                  <p className="font-mono text-sm">{donation.panNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Donation Details */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 mb-8 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Donation Details
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Purpose:</span>
                <span className="font-semibold text-orange-700">{formatPurpose(donation.purpose)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Type:</span>
                <span className="font-semibold">{formatDonationType(donation.donationType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Payment Method:</span>
                <span className="font-semibold">{donation.paymentMethod.toUpperCase()}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-md border-2 border-orange-300">
                <p className="text-gray-600 font-medium mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-orange-600">
                  ₹{donation.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ({donation.currency.toUpperCase()})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <span className="text-gray-600 font-medium">Amount in Words: </span>
            <span className="font-semibold text-gray-800">
              {amountToWords(donation.amount)}
            </span>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Tax Exemption Information
          </h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>• This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.</p>
            <p>• Moksha Sewa is registered under Section 12A and has valid 80G certification.</p>
            <p>• Please retain this receipt for your tax filing purposes.</p>
            <p>• For any queries regarding tax exemption, please contact our accounts department.</p>
          </div>
        </div>

        {/* Organization Details */}
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Organization Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Moksha Sewa Foundation</strong></p>
                <p>Registered Address: [Mohan Nagar, Ghazibabad]</p>
                {/* <p>Phone: [Your Phone Number]</p>
                <p>Email: info@moksha-seva.org</p>
                <p>Website: www.moksha-seva.org</p> */}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Registration Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>PAN: [Organization PAN]</p>
                <p>80G Registration: [80G Number]</p>
                <p>12A Registration: [12A Number]</p>
                <p>FCRA Registration: [FCRA Number if applicable]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Signature */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Authorized Signatory</p>
            <div className="w-32 h-16 mx-auto border-b border-gray-400 mb-2"></div>
            <p className="text-sm font-semibold text-gray-800">[Vijay Sharma]</p>
            <p className="text-xs text-gray-600">[Founder]</p>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>This is a computer-generated receipt and does not require a physical signature.</p>
            <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    );
  }
);

DonationReceipt.displayName = 'DonationReceipt';

export default DonationReceipt;