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
                    // Get the latest active popup
                    const activePopup = res.data.find((item: any) => item.type === 'popup');
                    if (activePopup) {
                        // Check session storage to avoid annoying repeated popups in one session
                        const isDismissed = sessionStorage.getItem(`popup_${activePopup._id}`);
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
                sessionStorage.setItem(`popup_${popup._id}`, 'true');
            }
        }, 500);
    };

    if (!isOpen || !popup) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-navy-950/20 backdrop-blur-sm transition-opacity duration-700",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <div 
                className={cn(
                    "max-w-lg w-full bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-2 border-gold-500 overflow-hidden relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-20 scale-90 opacity-0"
                )}
            >
                {/* Close Trigger */}
                <button 
                    onClick={handleDismiss}
                    className="absolute top-6 right-6 z-50 p-2 bg-navy-950/10 hover:bg-navy-950 text-navy-950 hover:text-gold-500 rounded-full backdrop-blur-md transition-all group shadow-xl active:scale-90"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>

                {/* Visual Content Block */}
                <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                        src={getSafeSrc(popup.imageUrl)} 
                        className="w-full h-full object-cover" 
                        alt="Campaign Visual" 
                    />
                    {/* Glass Branding Overlay */}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-gold-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Priority Alert</span>
                    </div>
                </div>

                {/* Intellectual content Block */}
                <div className="p-10 space-y-6 text-center">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-navy-950 uppercase italic tracking-tighter leading-none">
                            {popup.title}
                        </h2>
                        <div className="w-12 h-1.5 bg-gold-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <p className="text-navy-400 font-bold text-sm italic leading-relaxed px-4">
                        {popup.content}
                    </p>

                    <div className="pt-4 flex flex-col gap-4">
                        {popup.targetUrl && (
                            <Link 
                                href={popup.targetUrl} 
                                onClick={handleDismiss}
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-navy-950 text-gold-500 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-black hover:translate-y-[-4px] transition-all active:scale-95 group"
                            >
                                Initiate Protocol
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        )}
                        <button 
                            onClick={handleDismiss}
                            className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:text-rose-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-navy-950 to-gold-600"></div>
            </div>
        </div>
    );
}
