'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 font-sans">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Error Code */}
        <div className="relative inline-block mb-12">
          <h1 className="text-[180px] md:text-[240px] font-black text-white/5 leading-none select-none tracking-tighter">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-gold-500 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] transform rotate-12 transition-transform hover:rotate-0 duration-700">
                <ShieldAlert className="w-12 h-12 text-navy-950" />
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Signal Translation Error</h2>
          <p className="text-gold-500/80 font-bold uppercase tracking-[0.3em] text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            The requested data node has been moved to an offline sector or never existed within this matrix.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/"
            className="group flex items-center gap-3 px-10 py-5 bg-gold-600 text-navy-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-gold-600 hover:scale-105 active:scale-95 shadow-2xl shadow-gold-500/20"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
            Home Sector
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Restore Session
          </button>
        </div>

        {/* Search */}
        <div className="mt-16 pt-16 border-t border-white/5 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search other sectors..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition-all font-bold placeholder:text-white/20 uppercase tracking-widest placeholder:tracking-widest"
            />
          </div>
        </div>

        {/* Footer */}
        <p className="mt-20 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
          Internal Log Code: MS-0x404-SIG-LOST
        </p>
      </div>
    </div>
  );
}
