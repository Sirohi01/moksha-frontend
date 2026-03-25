'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Entrance animation
    setIsVisible(true);
    
    // Auto-close if needed
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#f4c430]" />, // Gold
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgStyles = {
    success: 'bg-[#000080]/90 border-[#f4c430]', // Navy with Gold border
    error: 'bg-red-950/90 border-red-500',
    warning: 'bg-orange-950/90 border-orange-500',
    info: 'bg-[#000080]/90 border-blue-400',
  };

  return (
    <div
      className={cn(
        "pointer-events-auto transform transition-all duration-300 ease-out border shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[320px] max-w-[450px] overflow-hidden",
        bgStyles[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
      )}
      role="alert"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f4c430]/10 to-transparent pointer-events-none" />
      
      <div className="flex-shrink-0 z-10">
        {icons[type]}
      </div>
      
      <div className="flex-1 z-10">
        <p className="text-stone-100 font-medium text-sm leading-tight">
          {message}
        </p>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            if (onClose) onClose();
          }, 300);
        }}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors z-10 text-stone-300 hover:text-white"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all linear",
            type === 'success' ? "bg-[#f4c430]" : "bg-white/40"
          )}
          style={{ 
            width: isVisible ? '0%' : '100%',
            transitionDuration: `${duration}ms`
          }}
        />
      </div>
    </div>
  );
};

export default Toast;
