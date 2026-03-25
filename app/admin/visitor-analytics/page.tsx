import { Metadata } from 'next';
import VisitorAnalytics from '@/components/admin/VisitorAnalytics';

export const metadata: Metadata = {
  title: 'Global Surveillance | Admin | Moksha Seva',
  description: 'Real-time behavior reconstruction and engagement analysis',
};

export default function VisitorAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] p-6 md:p-12 lg:p-16 max-w-[1700px] mx-auto">
      {/* Premium Surveillance Header */}
      <div className="mb-14 relative group">
        <div className="flex items-center gap-4 text-gold-600 dark:text-gold-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4">
          <div className="w-12 h-[3px] bg-gradient-to-r from-gold-600 to-transparent rounded-full transition-all group-hover:w-24"></div>
          <span>Digital Intelligence Core</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black text-navy-950 dark:text-white tracking-tighter selection:bg-gold-500 leading-tight">
              Visitor <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold-500 to-gold-700 italic pr-2 inline-block">Analysis</span>
            </h1>
            <p className="text-navy-400 dark:text-navy-300 mt-4 text-lg font-medium max-w-2xl leading-relaxed italic opacity-80">
              Aggregated behavioral data, session flows, and multi-node engagement tracking for the <span className="text-gold-600 font-bold border-b-2 border-gold-500/20 px-1">Moksha Seva</span> ecosystem.
            </p>
          </div>
          
          <div className="hidden lg:block">
            <div className="px-6 py-4 bg-navy-950 rounded-3xl border border-white/5 shadow-2xl">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Surveillance Online · Tracking Multi-Node Assets</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <VisitorAnalytics />
      </div>
    </div>
  );
}

