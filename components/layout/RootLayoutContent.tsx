'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SocialFloating from './SocialFloating';
import EmergencyFloating from './EmergencyFloating';
import ChatBot from './ChatBot';
import VisitorTracker from '../VisitorTracker';
import PremiumLoader from '@/components/ui/PremiumLoader';

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<PremiumLoader />}>
          <VisitorTracker />
        </Suspense>
        {children}
      </div>
    );
  }

  return (
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
      <ChatBot />
      <Footer />
    </div>
  );
}
