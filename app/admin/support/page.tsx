'use client';

import React from 'react';
import SupportInbox from '@/components/admin/SupportInbox';
import { PageHeader } from '@/components/admin/AdminComponents';
import { MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Admin Support Inbox" 
        description="Real-time communication with users who need assistance."
        icon={<MessageSquare className="w-6 h-6" />}
      />
      <div className="w-full h-full">
        <SupportInbox />
      </div>
    </div>
  );
}
