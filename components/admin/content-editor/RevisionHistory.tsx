'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  History, Clock, CheckCircle2, User, 
  RotateCcw, ArrowRight, Share2, Calendar
} from 'lucide-react';

interface Revision {
  _id: string;
  admin: string;
  createdAt: string;
  changesCount?: number;
}

interface RevisionHistoryProps {
  revisions: Revision[];
  activeHistoryIndex: number;
  setActiveHistoryIndex: (index: number) => void;
  onRestore: (index: number) => void;
}

export default function RevisionHistory({ 
  revisions, 
  activeHistoryIndex, 
  setActiveHistoryIndex,
  onRestore 
}: RevisionHistoryProps) {
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
       day: 'numeric',
       month: 'short',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">Version History & Backups</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Review previous changes and restore older versions if needed.</p>
        </div>
        <div className="flex items-center gap-3 bg-navy-50 text-navy-950 px-5 py-2.5 rounded-2xl border border-navy-100 italic transition-all group">
          <History className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">{revisions.length} Backups Stored</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {revisions.length === 0 ? (
            <Card className="py-32 text-center rounded-[3rem] border-2 border-dashed border-gray-100 bg-gray-50/50">
               <Clock className="w-16 h-16 text-gray-300 mx-auto mb-6" />
               <h3 className="text-xl font-black text-navy-950 uppercase italic tracking-tight">No History Found</h3>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">First version is being generated on next save.</p>
            </Card>
          ) : (
            <div className="space-y-6">
               {revisions.map((rev, index) => {
                  const isActive = activeHistoryIndex === index;
                  return (
                     <div 
                        key={rev._id}
                        onClick={() => setActiveHistoryIndex(index)}
                        className={`p-10 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                           isActive 
                           ? 'bg-navy-950 border-navy-950 shadow-2xl translate-y-[-4px]' 
                           : 'bg-white border-gray-100 hover:border-navy-200 hover:bg-navy-50 hover:translate-y-[-2px]'
                        }`}
                     >
                        {isActive && (
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        )}
                        
                        <div className="flex items-center justify-between relative z-10">
                           <div className="flex items-center gap-8">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                 isActive ? 'bg-gold-500 text-navy-950' : 'bg-navy-50 text-navy-950'
                              }`}>
                                 <Calendar className="w-6 h-6" />
                              </div>
                              <div>
                                 <h4 className={`text-lg font-black uppercase italic tracking-tight ${isActive ? 'text-white' : 'text-navy-950'}`}>
                                    {formatDate(rev.createdAt)}
                                 </h4>
                                 <div className="flex items-center gap-4 mt-1.5 font-bold uppercase tracking-widest">
                                    <span className={`text-[9px] flex items-center gap-1.5 ${isActive ? 'text-gold-500' : 'text-gray-400'}`}>
                                       <User className="w-3 h-3" /> {rev.admin || 'System Admin'}
                                    </span>
                                    {index === 0 && (
                                       <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">Current Active</span>
                                    )}
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-4">
                              {isActive ? (
                                 <button 
                                   onClick={(e) => {
                                      e.stopPropagation();
                                      onRestore(index);
                                   }}
                                   className="bg-gold-500 text-navy-950 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 shadow-lg flex items-center gap-2"
                                 >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Restore This Point
                                 </button>
                              ) : (
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                                    isActive ? 'border-white/20 text-white' : 'border-gray-100 text-gray-300'
                                 }`}>
                                    <ArrowRight className="w-5 h-5" />
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
           <Card className="p-8 rounded-[2.5rem] bg-navy-50/50 border border-navy-100 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform">
                 <History className="w-24 h-24 text-navy-950" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-navy-950 mb-6 italic flex items-center gap-2">
                 <RotateCcw className="w-4 h-4 text-gold-600" />
                 Safety Protocol
              </h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-6">
                 We automatically store the last 50 versions of your website changes. If you make a mistake, you can always revert to a previous state instantly.
              </p>
              <div className="p-6 bg-white rounded-3xl border border-navy-100 shadow-inner">
                 <div className="flex items-center gap-3 text-emerald-500 mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Auto-Backup Enabled</span>
                 </div>
                 <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">Last backup verified 2 mins ago.</p>
              </div>
           </Card>

           <Card className="p-8 rounded-[2.5rem] bg-navy-950 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-navy-950">
                    <History className="w-5 h-5" />
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-widest italic text-gold-500">Historical Matrix</h4>
              </div>
              <div className="space-y-4">
                 {[
                    'Automatic Data Hashing',
                    'Cloud Storage Replication',
                    'Immutable Records',
                    'Instant Rollback'
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0 opacity-80">
                       <ArrowRight className="w-3 h-3 text-gold-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{item}</span>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
