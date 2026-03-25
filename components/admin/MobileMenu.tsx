'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
  useEffect(() => {
    onClose();
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden">
        {/* Header */}
        <div className="relative h-16 sm:h-20 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg p-1.5 sm:p-2">
              <Image
                src="/logo.png"
                alt="Moksha Sewa Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-lg sm:text-xl font-bold tracking-wide">Moksha Sewa</h1>
              <p className="text-xs text-white/90 font-medium">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto custom-scrollbar h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)]">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                  <span className="text-xs sm:text-sm">{item.icon}</span>
                </div>
                <span className="flex-1 text-sm">{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 sm:p-4 border-t border-gray-100 space-y-2 sm:space-y-3">
          {/* Quick Stats */}
          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">System Online</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-all duration-200">
              <span className="text-xs sm:text-sm">🚪</span>
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}