'use client';

import { ReactNode } from 'react';

// Page Header Component
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}
export function PageHeader({ title, description, icon, children }: PageHeaderProps) {
  return (
    <div className="bg-transparent mb-12 animate-fadeIn px-4 sm:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="flex items-center space-x-6">
          {icon && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-navy-950 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/10 text-gold-500 transform -rotate-3 hover:rotate-0 transition-all duration-500 flex-shrink-0">
              {typeof icon === 'string' ? <span className="text-2xl sm:text-3xl">{icon}</span> : icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-0.5 bg-gold-600 rounded-full"></span>
              <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">Protocol Active</p>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 uppercase italic tracking-tight leading-[0.9] py-1 px-4 !overflow-visible whitespace-nowrap">{title}</h1>
            {description && (
              <p className="text-navy-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mt-3 max-w-xl opacity-60 leading-relaxed italic">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex flex-wrap gap-4 items-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatsCard({ title, value, icon, gradient, change, changeType = 'positive' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-navy-50 hover:border-gold-500/40 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-navy-50/50 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>

      <div className="flex items-start justify-between mb-10 relative z-10">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-navy-950 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl border border-white/10 text-gold-500 group-hover:bg-gold-600 group-hover:text-navy-950 transition-colors duration-500`}>
          {typeof icon === 'string' ? <span className="text-xl sm:text-2xl">{icon}</span> : icon}
        </div>
        {change && (
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${changeType === 'positive' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
              changeType === 'negative' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                'bg-navy-50 text-navy-600'
            }`}>
            {change}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-navy-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-60 italic">{title}</p>
        <p className="text-4xl sm:text-5xl font-black text-navy-950 uppercase italic tracking-tighter leading-none group-hover:text-gold-600 transition-colors py-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

// Action Button Component
interface ActionButtonProps {
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function ActionButton({
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  icon,
  className = ""
}: ActionButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-black uppercase tracking-widest rounded-2xl transition-all duration-300 active:scale-95 shadow-lg overflow-hidden relative group";

  const variants = {
    primary: "bg-navy-950 text-gold-500 hover:bg-gold-600 hover:text-navy-950 shadow-navy-200",
    secondary: "bg-white text-navy-950 border-2 border-navy-50 hover:border-gold-600 hover:text-gold-600",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100",
    warning: "bg-gold-600 text-navy-950 hover:bg-navy-950 hover:text-gold-500 shadow-gold-100"
  };

  const sizes = {
    sm: "px-5 py-2.5 text-[9px]",
    md: "px-8 py-4 text-[10px]",
    lg: "px-10 py-5 text-[11px]"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const content = (
    <>
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {content}
    </button>
  );
}

// Data Table Component
interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

// Data Table Component
export function DataTable({ columns, data, loading = false, emptyMessage = "No data available" }: DataTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] border border-navy-50 p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-6 animate-pulse">
          <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gold-600/20 border-t-gold-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-[10px] font-black text-navy-400 uppercase tracking-[0.3em]">Decrypting Data Streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-navy-50 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-navy-950">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-8 py-6 text-left text-[10px] font-black text-gold-500 uppercase tracking-[0.2em] border-b border-white/5"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-30">
                    <div className="w-20 h-20 bg-navy-50 rounded-[2rem] flex items-center justify-center">
                      <span className="text-4xl text-navy-950 font-black italic">!</span>
                    </div>
                    <p className="text-xs font-black text-navy-950 uppercase tracking-[0.4em] italic">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-navy-50/50 transition-all duration-300 group">
                  {columns.map((column) => (
                    <td key={column.key} className="px-8 py-6 whitespace-nowrap text-[11px] font-bold text-navy-950 uppercase tracking-tight group-hover:text-navy-950 transition-colors">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Loading Spinner Component
export function LoadingSpinner({ message }: { size?: 'sm' | 'md' | 'lg', message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 gap-8">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gold-600/10 border-t-gold-600 rounded-full animate-spin shadow-[0_0_20px_rgba(184,135,33,0.1)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-navy-950 rounded-full animate-ping"></div>
        </div>
      </div>
      {message && (
        <p className="text-[10px] font-black text-navy-400 uppercase tracking-[0.4em] animate-pulse italic">{message}</p>
      )}
    </div>
  );
}

// Alert Component
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const styles = {
    success: 'border-emerald-500/20 bg-emerald-50/50 text-emerald-700',
    error: 'border-rose-500/20 bg-rose-50/50 text-rose-700',
    warning: 'border-gold-500/20 bg-gold-50/50 text-gold-700',
    info: 'border-navy-500/20 bg-navy-50/50 text-navy-700'
  };

  return (
    <div className={`rounded-2xl border-2 p-6 transition-all duration-500 animate-fadeIn ${styles[type]} shadow-sm mb-8 relative group overflow-hidden`}>
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
        {onClose && (
          <button onClick={onClose} className="text-current hover:rotate-90 transition-transform">✕</button>
        )}
      </div>
      <div className="flex items-center gap-5">
        <div className="w-10 h-10 bg-current/10 rounded-xl flex items-center justify-center font-black">
          {type[0].toUpperCase()}
        </div>
        <div>
          {title && <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>}
          <p className="text-xs font-bold tracking-tight">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Form Input Component
interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>

        <div className={`inline-block w-full ${sizes[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}