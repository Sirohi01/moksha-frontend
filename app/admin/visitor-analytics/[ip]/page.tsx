import { Metadata } from 'next';
import VisitorDetails from '@/components/admin/VisitorDetails';

export const metadata: Metadata = {
  title: 'Visitor Intelligence | Admin | Moksha Seva',
  description: 'Advanced behavioral reconstruction of visitor activities',
};

export default function VisitorDetailsPage({ params }: { params: { ip: string } }) {
  const decodedIp = decodeURIComponent(params.ip);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] p-6 md:p-12 lg:p-16 max-w-[1700px] mx-auto">
      <div className="mb-14 relative group">
        <div className="flex items-center gap-4 text-gold-600 dark:text-gold-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4">
          <div className="w-12 h-[3px] bg-gradient-to-r from-gold-600 to-transparent rounded-full transition-all group-hover:w-24"></div>
          <span>Digital Forensic Terminal</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black text-navy-950 dark:text-white tracking-tighter selection:bg-gold-500 leading-tight">
              Behavioral <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold-500 to-gold-700 italic pr-2 inline-block">Replay</span>
            </h1>
            <p className="text-navy-400 dark:text-navy-300 mt-4 text-lg font-medium max-w-2xl leading-relaxed italic opacity-80">
              Analyzing historical interactions, navigation sequences, and engagement patterns for node <span className="font-mono text-gold-600 font-bold underline decoration-wavy underline-offset-4">{decodedIp}</span>.
            </p>
          </div>
          
          <div className="hidden lg:block">
            <div className="px-6 py-4 bg-navy-950 rounded-3xl border border-white/5 shadow-2xl">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Terminal Encrypted · Session Recording Active</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <VisitorDetails ip={decodedIp} />
    </div>
  );
}

