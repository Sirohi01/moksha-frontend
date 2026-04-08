'use client';

import React from 'react';
import EmailTemplateManager from '@/components/admin/EmailTemplates/EmailTemplateManager';
import { Mail, ShieldCheck, Zap } from 'lucide-react';

export default function EmailTemplatesPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F6] p-4 sm:p-6 lg:p-10">
            <div className="max-w-[1600px] mx-auto space-y-10">
                {/* Systems Intelligence Context Bar */}
                <div className="flex flex-wrap items-center gap-6 px-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        System: Dynamic Communications
                    </div>
                    <div className="w-px h-4 bg-stone-200 hidden sm:block" />
                    <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
                        <Zap className="w-4 h-4 text-gold-500" />
                        Status: Active Rendering
                    </div>
                    <div className="w-px h-4 bg-stone-200 hidden sm:block" />
                    <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
                        <Mail className="w-4 h-4 text-blue-500" />
                        Infrastructure: SES / Nodemailer
                    </div>
                </div>

                <EmailTemplateManager />
            </div>
        </div>
    );
}
