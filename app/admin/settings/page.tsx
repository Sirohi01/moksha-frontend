'use client';

import SystemConfiguration from '@/components/admin/SystemConfiguration';

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
            <div className="space-y-2">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Critical Infrastructure</span>
                <h1 className="text-4xl font-serif font-black text-navy-950">System Settings</h1>
                <p className="text-navy-700 font-medium italic opacity-70">"Master control node for environment protocols and external system bridges."</p>
            </div>
            
            <SystemConfiguration />
        </div>
    );
}