'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import SocialFloating from './SocialFloating';
import EmergencyFloating from './EmergencyFloating';
import ChatBot from './ChatBot';
import VisitorTracker from '../VisitorTracker';

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin layout - clean, no public website components
    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <VisitorTracker />
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