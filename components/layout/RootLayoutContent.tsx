'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SocialFloating from './SocialFloating';
import EmergencyFloating from './EmergencyFloating';
import MarketingPopup from './MarketingPopup';
import ChatBot from './ChatBot';
import ChatWidget from '../ChatWidget';
import VisitorTracker from '../VisitorTracker';
import PremiumLoader from '@/components/ui/PremiumLoader';

import { ToastProvider } from '@/context/ToastContext';

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-100">
          <Suspense fallback={<PremiumLoader />}>
            <VisitorTracker />
          </Suspense>
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-cream-100">
        <Suspense fallback={<PremiumLoader />}>
          <VisitorTracker />
        </Suspense>
        <Navbar />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <SocialFloating />
        <EmergencyFloating />
        <MarketingPopup />
        <ChatBot />
        <ChatWidget />
        <Footer />
      </div>
    </ToastProvider>
  );
}
