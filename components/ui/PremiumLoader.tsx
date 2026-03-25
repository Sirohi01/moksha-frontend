'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl">
      <div className="relative group">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 -m-8 border-4 border-gold-500/20 rounded-full animate-pulse blur-xl group-hover:bg-gold-500/5 transition-all duration-700"></div>
        
        {/* Spinning Outer Orbit */}
        <div className="w-24 h-24 border-t-4 border-r-4 border-gold-500 rounded-full animate-spin"></div>
        
        {/* Inner Counter-Spinning Ring */}
        <div className="absolute inset-0 m-3 border-b-4 border-l-4 border-navy-950 dark:border-white rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-8 h-8 text-gold-600 animate-pulse" />
        </div>

        {/* Branding Label */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
           <p className="text-[10px] font-black tracking-[0.4em] uppercase text-navy-950 dark:text-gold-500 animate-pulse">
              Reconstructing Digital Identity
           </p>
        </div>
      </div>
    </div>
  );
}
