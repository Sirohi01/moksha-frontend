'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  gradient: string;
}

interface MobileMenuProps {
  navigationItems: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    role: string;
  };
  onLogout: () => void;
}

export default function MobileMenu({ navigationItems, isOpen, onClose, user, onLogout }: MobileMenuProps) {
  const pathname = usePathname();

  // Close menu when route changes
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
        onClose();
        prevPathname.current = pathname;
    }
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  return (
    <>
      {/* Premium Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-950/30 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-500"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Slide-out */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[70] w-[320px] max-w-[85vw] bg-white shadow-[20px_0_60px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col border-r border-navy-50",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>

        {/* Tactical Header */}
        <div className="relative h-24 bg-navy-950 flex items-center justify-between px-6 border-b border-gold-600/20 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl p-2 shrink-0 border border-gold-600/30">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-gold-500 uppercase tracking-widest leading-tight">Moksha</h1>
              <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] italic">Command Deck</p>
            </div>
          </div>
          <button onClick={onClose} className="relative p-2 text-white/60 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tactical Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar bg-[#fcfcfc]">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${isActive
                    ? 'bg-navy-950 text-gold-500 shadow-xl shadow-navy-950/20 translate-x-1'
                    : 'text-navy-900 hover:bg-navy-50 hover:translate-x-1'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-navy-900 shadow-inner' : 'bg-navy-50 group-hover:bg-navy-100'
                  }`}>
                  <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{item.name}</span>

                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-gold-600 shadow-[0_0_10px_rgba(184,135,33,0.8)]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Command Footprint */}
        <div className="p-6 bg-white border-t border-navy-50 space-y-4">
          <div className="flex items-center gap-4 bg-navy-50/50 p-3 rounded-2xl border border-navy-50">
            <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center shadow-lg shrink-0">
              <p className="text-gold-500 font-black text-xs">{user.name[0]}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-navy-950 uppercase leading-none truncate">{user.name}</p>
              <p className="text-[8px] font-black text-gold-600 uppercase mt-1 tracking-tighter italic">{user.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition-all">
              <span className="text-lg">⚡</span>
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}