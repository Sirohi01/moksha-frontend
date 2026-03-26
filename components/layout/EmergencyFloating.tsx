"use client";
import React from "react";
import { Megaphone, Phone } from "lucide-react";
import Link from "next/link";
import { intelligenceAPI } from "@/lib/api";

export default function EmergencyFloating() {
    const handleTrack = (platform: string) => {
        intelligenceAPI.trackInteraction(platform, window.location.pathname).catch(() => {});
    };

    return (
        <div className="fixed bottom-6 right-6 z-[1100] flex flex-col items-end gap-3">
            {/* 24/7 Helpline Button */}
            <a
                href="tel:+911800123456"
                onClick={() => handleTrack('call')}
                className="group relative flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-blue-600/40 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="24/7 Helpline"
            >
                <div className="absolute -inset-2 bg-blue-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Phone className="w-5 h-5 relative z-10" strokeWidth={2} />

                {/* Tooltip */}
                <div className="absolute right-full mr-3 px-3 py-1.5 bg-stone-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-widest shadow-xl">
                    24/7 Helpline
                </div>
            </a>

            {/* Report Button */}
            <Link
                href="/report"
                onClick={() => handleTrack('report')}
                className="group relative flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:shadow-red-600/40 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Report Unclaimed Body"
            >
                <div className="absolute -inset-2 bg-red-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                <Megaphone className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" strokeWidth={2} />

                {/* Tooltip */}
                <div className="absolute right-full mr-3 px-3 py-1.5 bg-stone-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-widest shadow-xl">
                    Report Now
                </div>
            </Link>
        </div>
    );
}
