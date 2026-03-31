'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import { X, ExternalLink, Zap } from 'lucide-react';
import { cn, getSafeSrc } from '@/lib/utils';
import Link from 'next/link';

export default function MarketingPopup() {
    const [popup, setPopup] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchActivePopup = async () => {
            try {
                const res = await marketingAPI.getActiveContent();
                if (res.success && res.data.length > 0) {
                    // Filter and Sort by Priority then Recency
                    const activePopups = res.data
                        .filter((item: any) => item.type === 'popup' && item.isActive)
                        .sort((a: any, b: any) => {
                            const pA = a.displayRules?.priority || 0;
                            const pB = b.displayRules?.priority || 0;
                            if (pA !== pB) return pB - pA;
                            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                        });

                    const activePopup = activePopups[0];
                    if (activePopup) {
                        // Check session storage with updatedAt to allow updates to show
                        const storageKey = `popup_${activePopup._id}_${activePopup.updatedAt}`;
                        const isDismissed = sessionStorage.getItem(storageKey);
                        if (!isDismissed) {
                            setPopup(activePopup);
                            // Initial delay for smooth appearance
                            setTimeout(() => {
                                setIsOpen(true);
                                setTimeout(() => setIsVisible(true), 100);
                            }, 3000); 
                        }
                    }
                }
            } catch (err) {
                console.error('Marketing intel synch failure:', err);
            }
        };

        fetchActivePopup();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
            if (popup) {
                const storageKey = `popup_${popup._id}_${popup.updatedAt}`;
                sessionStorage.setItem(storageKey, 'true');
            }
        }, 500);
    };

    // Helper to get theme styles
    const getThemeStyles = (theme: string) => {
        switch(theme) {
            case 'emergency-red': 
                return { bg: 'bg-white', title: 'text-rose-600', accent: 'bg-rose-600', button: 'bg-rose-600 text-white', border: 'border-rose-200 shadow-rose-200/50' };
            case 'dark': 
                return { bg: 'bg-navy-950', title: 'text-gold-500', accent: 'bg-gold-500', button: 'bg-gold-500 text-navy-950', border: 'border-white/10 shadow-black' };
            case 'light': 
                return { bg: 'bg-white', title: 'text-navy-950', accent: 'bg-navy-950', button: 'bg-navy-950 text-white', border: 'border-navy-50 shadow-navy-100' };
            default: 
                return { bg: 'bg-white', title: 'text-navy-950', accent: 'bg-gold-600', button: 'bg-navy-950 text-gold-500', border: 'border-gold-500 shadow-gold-200/50' };
        }
    };

    const currentTheme = popup?.appearance?.theme ? getThemeStyles(popup.appearance.theme) : getThemeStyles('default');
    const maxWidth = popup?.appearance?.maxWidth || '512px';

    if (!isOpen || !popup) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-navy-950/40 backdrop-blur-md transition-opacity duration-700",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <div 
                className={cn(
                    "w-full rounded-[2.5rem] shadow-2xl border-2 overflow-hidden relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    currentTheme.bg,
                    currentTheme.border,
                    isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-20 scale-90 opacity-0"
                )}
                style={{ maxWidth: maxWidth }}
            >
                {/* Close Trigger */}
                <button 
                    onClick={handleDismiss}
                    className="absolute top-6 right-6 z-50 p-2 bg-black/10 hover:bg-black/80 text-navy-950 hover:text-white rounded-full backdrop-blur-md transition-all group shadow-xl active:scale-90"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>

                {/* Visual Content Block */}
                <div className="relative aspect-video w-full overflow-hidden group">
                    <img 
                        src={getSafeSrc(popup.imageUrl)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" 
                        alt="Campaign Visual" 
                    />
                    {/* Glass Branding Overlay */}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", currentTheme.accent)}></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Priority Alert</span>
                    </div>
                </div>

                {/* Intellectual content Block */}
                <div className="p-10 space-y-8 text-center relative z-10">
                    <div className="space-y-3">
                        <h2 className={cn(
                            "text-3xl font-black uppercase italic tracking-tighter leading-none transition-colors",
                            currentTheme.title
                        )}>
                            {popup.title}
                        </h2>
                        <div className={cn("w-14 h-1.5 mx-auto rounded-full transition-colors", currentTheme.accent)}></div>
                    </div>
                    
                    <div className="max-h-[250px] overflow-y-auto px-4 custom-scrollbar">
                        <p className={cn(
                            "font-bold text-sm italic leading-relaxed transition-colors whitespace-pre-wrap break-words",
                            popup.appearance?.theme === 'dark' ? "text-white/60" : "text-navy-400"
                        )}>
                            {popup.content}
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col gap-4">
                        {popup.targetUrl && (
                            <Link 
                                href={popup.targetUrl} 
                                onClick={handleDismiss}
                                className={cn(
                                    "inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:translate-y-[-4px] transition-all active:scale-95 group",
                                    currentTheme.button
                                )}
                            >
                                Initiate Protocol
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        )}
                        <button 
                            onClick={handleDismiss}
                            className="text-[10px] font-black text-navy-400 uppercase tracking-widest hover:text-navy-600 transition-colors opacity-40 hover:opacity-100"
                        >
                            Decline Entry
                        </button>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className={cn("absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r", 
                    popup.appearance?.theme === 'emergency-red' ? "from-rose-600 via-rose-400 to-rose-600" : "from-gold-600 via-navy-950 to-gold-600"
                )}></div>
            </div>
        </div>
    );
}
