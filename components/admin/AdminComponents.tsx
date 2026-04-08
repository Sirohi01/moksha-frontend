'use client';

import { ReactNode } from 'react';
import { BarChart3, ArrowLeft, ArrowRight, Shield, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Page Header Component
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}
export function PageHeader({ title, description, icon, children }: PageHeaderProps) {
  return (
    <div className="bg-transparent mb-6 sm:mb-10 animate-in fade-in duration-700 slide-in-from-top-4 px-1 sm:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
        <div className="flex items-center space-x-4 sm:space-x-8">
          {icon && (
            <div className="w-14 h-14 sm:w-20 lg:w-24 lg:h-24 bg-stone-950 rounded-2xl lg:rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gold-800/20 text-gold-400 group relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent opacity-50 rounded-2xl lg:rounded-[2rem]"></div>
              {typeof icon === 'string' ? <span className="text-xl sm:text-2xl lg:text-4xl relative z-10">{icon}</span> : <div className="relative z-10 scale-90 sm:scale-110 lg:scale-125">{icon}</div>}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-6 lg:h-6 rounded-full bg-emerald-500 border-2 lg:border-4 border-[#FAF9F6] shadow-lg animate-pulse"></div>
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="h-0.5 w-6 sm:w-10 bg-gold-400/50 rounded-full" />
              <p className="text-[9px] sm:text-[11px] font-black text-gold-600 uppercase tracking-[0.3em] sm:tracking-[0.4em] whitespace-nowrap">Tactical Node Active</p>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 uppercase tracking-tighter leading-[0.9] py-1 flex-wrap break-words">{title}</h1>
            {description && (
              <p className="text-stone-500 text-[10px] sm:text-[13px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] mt-2 sm:mt-4 max-w-xl leading-relaxed italic opacity-80">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center animate-in slide-in-from-right-4 duration-1000">
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
    <div className="bg-white rounded-3xl xl:rounded-[2.5rem] p-5 sm:p-6 lg:p-7 xl:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-stone-200/40 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 group relative overflow-hidden h-full flex flex-col justify-between">
      {/* Glossy Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-stone-50 rounded-full -mr-16 -mt-16 sm:-mr-24 sm:-mt-24 group-hover:scale-150 transition-transform duration-1000 ease-out opacity-40"></div>
      
      <div className="flex items-start justify-between mb-4 sm:mb-6 lg:mb-8 relative z-10">
        <div className="w-10 h-10 sm:w-12 lg:w-14 lg:h-14 bg-stone-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-white/5 text-gold-400 group-hover:bg-stone-950 group-hover:scale-110 transition-all duration-500">
          <div className="scale-75 sm:scale-90 lg:scale-110">{icon}</div>
        </div>
        {change && (
          <div className={cn(
            "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm border animate-in fade-in slide-in-from-top-2 duration-700",
            changeType === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            changeType === 'negative' ? 'bg-rose-50 text-rose-600 border-rose-100' :
            'bg-stone-50 text-stone-600 border-stone-100'
          )}>
            {change}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-stone-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tighter leading-none group-hover:text-gold-600 transition-colors">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gold-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
        </div>
      </div>
      
      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
  type?: 'button' | 'submit' | 'reset';
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
  className = "",
  type = 'button'
}: ActionButtonProps) {

  const baseClasses = "inline-flex items-center justify-center font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 active:scale-95 shadow-xl overflow-hidden relative group border";

  const variants = {
    primary: "bg-stone-900 text-gold-400 border-stone-800 hover:bg-stone-950 hover:border-gold-500/50 hover:shadow-gold-500/10",
    secondary: "bg-[#FAF9F6] text-stone-900 border-stone-200/60 hover:border-gold-500/40 hover:bg-white hover:text-gold-600 shadow-stone-900/5",
    success: "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow-emerald-500/20",
    danger: "bg-rose-600 text-white border-rose-500 hover:bg-rose-700 shadow-rose-500/20",
    warning: "bg-gold-500 text-stone-900 border-gold-400 hover:bg-gold-600 shadow-gold-500/20"
  };

  const sizes = {
    // fluid sizes
    sm: "px-4 sm:px-5 py-2.5 sm:py-3 text-[10px]",
    md: "px-6 sm:px-8 py-3.5 sm:py-4.5 text-[11px] sm:text-[12px]",
    lg: "px-8 sm:px-10 py-5 sm:py-6 text-[13px] sm:text-[14px]"
  };

  const classes = cn(baseClasses, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className);

  const content = (
    <>
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-3"></div>
      )}
      {icon && !loading && (
        <span className="mr-3 transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      type={type}
    >
      {content}
    </button>
  );
}

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-6 bg-[#FAF9F6]/50 backdrop-blur-sm border border-stone-200/40 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-gold-400 shadow-lg border border-white/5">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <p className="text-[11px] font-black text-stone-900 uppercase tracking-[0.2em]">
            Deployment Sector <span className="text-gold-600 ml-1">{currentPage}</span> / {totalPages}
          </p>
          {total && <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.1em] mt-1">Operational Inventory: {total} Units</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-12 h-12 flex items-center justify-center rounded-2xl border border-stone-200 bg-white hover:bg-stone-900 hover:text-gold-400 hover:border-stone-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-stone-300 transition-all duration-500 active:scale-90 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 p-1.5 bg-stone-100/50 rounded-2xl border border-stone-200/40 overflow-x-auto max-w-[200px] sm:max-w-none scrollbar-none">
          {(() => {
            const range = [];
            const delta = 2;

            for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
              range.push(i);
            }

            return (
              <>
                {range[0] > 1 && (
                  <>
                    <button onClick={() => onPageChange(1)} className="w-10 h-10 rounded-xl text-[11px] font-black transition-all hover:bg-stone-200 text-stone-500">1</button>
                    {range[0] > 2 && <span className="text-stone-300 px-1 text-[11px] font-black">...</span>}
                  </>
                )}

                {range.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      "w-10 h-10 flex-shrink-0 rounded-xl text-[11px] font-black uppercase transition-all duration-500",
                      currentPage === pageNum
                        ? 'bg-stone-900 text-gold-400 shadow-xl scale-110 relative z-10 border border-white/10'
                        : 'hover:bg-white text-stone-500 hover:text-stone-950 hover:shadow-sm'
                    )}
                  >
                    {pageNum}
                  </button>
                ))}

                {range[range.length - 1] < totalPages && (
                  <>
                    {range[range.length - 1] < totalPages - 1 && <span className="text-stone-300 px-1 text-[11px] font-black">...</span>}
                    <button onClick={() => onPageChange(totalPages)} className="w-10 h-10 rounded-xl text-[11px] font-black transition-all hover:bg-stone-200 text-stone-500">{totalPages}</button>
                  </>
                )}
              </>
            );
          })()}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-12 h-12 flex items-center justify-center rounded-2xl border border-stone-200 bg-white hover:bg-stone-900 hover:text-gold-400 hover:border-stone-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-stone-300 transition-all duration-500 active:scale-90 shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
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
  pagination?: {
    currentPage: number;
    totalPages: number;
    total?: number;
  };
  onPageChange?: (page: number) => void;
}

export function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No Data Identified",
  pagination,
  onPageChange
}: DataTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-[3rem] border border-stone-200/40 p-20 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-gold-600/10 border-t-gold-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-8 h-8 text-stone-900 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[12px] font-black text-stone-900 uppercase tracking-[0.4em] animate-pulse">Decrypting Feed...</p>
            <p className="text-[9px] font-black text-gold-600 uppercase tracking-widest opacity-60">Status: Terminal Active</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.03)] border border-stone-200/40 overflow-hidden group">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-stone-100 hover:scrollbar-thumb-gold-400/20">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-stone-950 relative">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-10 py-7 text-left text-[11px] font-black text-gold-400 uppercase tracking-[0.25em] border-b border-white/5 whitespace-nowrap"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-10 py-32 text-center bg-stone-50/30">
                    <div className="flex flex-col items-center gap-8 group/empty">
                      <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl border border-stone-100 flex items-center justify-center transform group-hover/empty:scale-110 group-hover/empty:rotate-3 transition-all duration-700">
                        <AlertTriangle className="w-10 h-10 text-stone-200" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[14px] font-black text-stone-900 uppercase tracking-[0.5em]">{emptyMessage}</p>
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">Inventory empty or access restricted</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={index} className="hover:bg-[#FAF9F6] transition-all duration-500 group/row">
                    {columns.map((column) => (
                      <td key={column.key} className="px-10 py-7 whitespace-nowrap text-[13px] font-bold text-stone-600 uppercase tracking-tight group-hover/row:text-stone-950 transition-colors">
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

      {pagination && onPageChange && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

// Loading Spinner Component
export function LoadingSpinner({ message }: { size?: 'sm' | 'md' | 'lg', message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-32 gap-10">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-gold-600/5 border-t-gold-500 rounded-full animate-spin shadow-[0_0_40px_rgba(212,175,55,0.05)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-stone-900 rounded-full animate-ping"></div>
        </div>
      </div>
      {message && (
        <div className="text-center space-y-2">
          <p className="text-[13px] font-black text-stone-900 uppercase tracking-[0.5em] animate-pulse">{message}</p>
          <p className="text-[9px] font-black text-gold-600/60 uppercase tracking-widest italic">Synchronizing Tactical Feed</p>
        </div>
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
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertTriangle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'border-emerald-500/20 bg-emerald-50/50 text-emerald-800',
    error: 'border-rose-500/20 bg-rose-50/50 text-rose-800',
    warning: 'border-gold-500/20 bg-gold-50/50 text-gold-800',
    info: 'border-stone-500/20 bg-stone-50/50 text-stone-800'
  };

  return (
    <div className={cn(
      "rounded-[2rem] border-2 p-8 transition-all duration-700 animate-in fade-in slide-in-from-left-4 mb-10 relative group overflow-hidden shadow-sm",
      styles[type]
    )}>
      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-all duration-500">
        {onClose && (
          <button onClick={onClose} className="text-current hover:rotate-90 transition-transform p-2 bg-white/50 rounded-xl hover:bg-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-14 h-14 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
          {icons[type]}
        </div>
        <div className="flex-1">
          {title && <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-1.5 opacity-80">{title}</h3>}
          <p className="text-[15px] font-bold tracking-tight leading-relaxed">{message}</p>
        </div>
      </div>
      {/* Decorative Accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-current opacity-20" />
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
    <div className="mb-8 group">
      <div className="flex items-center justify-between mb-3 px-1">
        <label className="text-[11px] font-black text-stone-500 uppercase tracking-[0.2em] group-focus-within:text-gold-600 transition-colors">
          {label}
          {required && <span className="text-gold-500 ml-1 opacity-50">*</span>}
        </label>
        {error && <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{error}</span>}
      </div>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-6 py-5 bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-gold-500/5 transition-all duration-500 text-stone-900 font-bold placeholder:text-stone-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest shadow-sm",
            error ? 'border-rose-200 bg-rose-50/50' : 'border-stone-200/80 hover:border-gold-400 group-focus-within:border-gold-500 group-focus-within:shadow-xl group-focus-within:shadow-gold-500/5',
            disabled && 'bg-stone-50 opacity-60 cursor-not-allowed'
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-100 group-focus-within:bg-gold-500 transition-colors"></div>
      </div>
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
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-stone-950/40 backdrop-blur-md" onClick={onClose}></div>

        <div className={cn(
          "inline-block w-full align-middle transition-all transform bg-[#FAF9F6] shadow-3xl rounded-[3rem] p-10 sm:p-14 text-left border border-white/50 relative overflow-hidden animate-in zoom-in-95 fade-in duration-500",
          sizes[size]
        )}>
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 text-gold-400">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">Secure Access Node</p>
                <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic">{title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-white rounded-2xl transition-all duration-300 shadow-sm border border-transparent hover:border-stone-100 active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Link helper if needed (not in Lucide)
import Link from 'next/link';