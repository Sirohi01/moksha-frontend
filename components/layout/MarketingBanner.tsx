'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import { X, ExternalLink, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function MarketingBanner() {
    const [banner, setBanner] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchActiveBanner = async () => {
            try {
                const res = await marketingAPI.getActiveContent();
                if (res.success && res.data.length > 0) {
                    // Filter and Sort by Priority then Recency specifically for 'banner' type
                    const activeBanners = res.data
                        .filter((item: any) => item.type === 'banner' && item.isActive)
                        .sort((a: any, b: any) => {
                            const pA = a.displayRules?.priority || 0;
                            const pB = b.displayRules?.priority || 0;
                            if (pA !== pB) return pB - pA;
                            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                        });

                    const activeBanner = activeBanners[0];
                    if (activeBanner) {
                        const isDismissed = sessionStorage.getItem(`banner_${activeBanner._id}_${activeBanner.updatedAt}`);
                        if (!isDismissed) {
                            setBanner(activeBanner);
                            setTimeout(() => setIsVisible(true), 2000); // Appear after popup or load
                        }
                    }
                }
            } catch (err) {
                console.error('Marketing banner synch failure:', err);
            }
        };

        fetchActiveBanner();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        if (banner) {
            sessionStorage.setItem(`banner_${banner._id}_${banner.updatedAt}`, 'true');
        }
    };

    if (!isVisible || !banner) return null;

    // Theme mapping for banner
    const getBannerTheme = (theme: string) => {
        switch(theme) {
            case 'emergency-red': 
                return "bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 text-white border-b border-white/10";
            case 'navy-gold': 
                return "bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-gold-500 border-b border-gold-500/20";
            case 'dark': 
                return "bg-black text-gold-400 border-b border-white/5";
            case 'light': 
                return "bg-white text-navy-950 border-b border-navy-100 shadow-sm";
            default: 
                return "bg-navy-950 text-gold-500 border-b border-gold-500/20";
        }
    };

    const themeClass = getBannerTheme(banner.appearance?.theme || 'navy-gold');

    return (
        <div className={cn(
            "fixed top-0 left-0 right-0 z-[4000] w-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}>
            <div className={cn(
                "px-4 py-3 sm:px-10 flex items-center justify-between gap-6 shadow-2xl relative overflow-hidden group",
                themeClass
            )}>
                {/* Visual pulse */}
                <div className="flex items-center gap-3">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                        {banner.title}
                    </span>
                </div>

                {/* Content area - Marquee on small, flex on large */}
                <div className="flex-1 overflow-hidden flex items-center justify-center">
                    <p className="text-[11px] sm:text-xs font-bold italic tracking-tight truncate max-w-[60vw]">
                        {banner.content}
                    </p>
                </div>

                {/* Interaction */}
                <div className="flex items-center gap-6">
                    {banner.targetUrl && (
                        <Link 
                            href={banner.targetUrl}
                            className="flex items-center gap-2 group/btn"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest border-b border-current pb-0.5 group-hover:px-2 transition-all">Explore Protocol</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    )}
                    
                    <button 
                        onClick={handleDismiss}
                        className="hover:scale-125 transition-transform opacity-40 hover:opacity-100 p-1 bg-white/10 rounded-full"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Animated highlight */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-current opacity-20"></div>
            </div>
        </div>
    );
}
