'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactsAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function WhatsAppComposer() {
  const router = useRouter();
  
  const [recipients, setRecipients] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [customNumber, setCustomNumber] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('wa_broadcast_recipients');
    if (saved) setRecipients(JSON.parse(saved));
  }, []);

  const addCustomNumber = () => {
    if (!customNumber.match(/^[0-9]{10,12}$/)) return toast.error('Invalid phone');
    const newRecipient = { id: Date.now().toString(), name: 'Custom Contact', phone: customNumber, source: 'Manual Entry' };
    setRecipients(prev => [...prev, newRecipient]);
    setCustomNumber('');
  };

  const removeRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  const handleSend = async () => {
    if (!message.trim()) return toast.error('Message is required');
    if (recipients.length === 0) return toast.error('No recipients selected');

    setSending(true);
    setResults([]);

    try {
      const response = await contactsAPI.sendWhatsApp({
        recipients: recipients.map(r => ({ phone: r.phone, name: r.name })),
        message,
        options: {
          type: recipients.length === 1 ? 'whatsapp' : 'broadcast'
        }
      });

      setResults(response.results || []);
      toast.success(response.message);
      localStorage.removeItem('wa_broadcast_recipients');
    } catch (err: any) {
      toast.error('Mission Failed: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-black mb-4 flex items-center text-xs font-bold uppercase tracking-widest gap-2"
          >
            <span>←</span> Back to Command Center
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-black flex items-center gap-3">
            Broadcast <span className="bg-emerald-600 text-white px-3 py-1 rounded-xl italic font-black text-xl">Transmission</span>
          </h1>
        </div>
        <div className="text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Ready for Uplink</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Col: Recipients */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Recipient Queue ({recipients.length})</h3>
            
            {/* Manual Add */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="W/O 91..."
                value={customNumber}
                onChange={(e) => setCustomNumber(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              />
              <button onClick={addCustomNumber} className="bg-black text-white p-2 rounded-xl hover:bg-gray-800 transition-all">+</button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-none">
              {recipients.map(r => (
                <div key={r.id} className="group bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-transparent hover:border-gray-200 transition-all">
                  <div>
                    <p className="text-sm font-bold text-black">{r.name}</p>
                    <p className="text-[10px] font-mono text-gray-400">+{r.phone}</p>
                  </div>
                  <button onClick={() => removeRecipient(r.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                </div>
              ))}
              {recipients.length === 0 && <p className="text-center py-10 text-gray-400 text-xs italic">Queue is empty</p>}
            </div>
          </div>
        </div>

        {/* Right Col: Composer */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-10">
            
            {/* Message */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Payload Message</label>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded cursor-pointer" onClick={() => setMessage(m => m + '{name}')}>+ Insert Name Variable</span>
              </div>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message content..."
                rows={12}
                className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-8 text-[15px] focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 font-medium transition-all"
              />
            </div>

            {/* Action */}
            <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] text-gray-400 italic max-w-xs uppercase font-bold tracking-wide leading-relaxed">
                Personalization active. {recipients.length} individual transmissions will be queued with 500ms security delay.
              </p>
              <button 
                onClick={handleSend}
                disabled={sending}
                  className="w-full md:w-auto bg-black hover:bg-zinc-800 text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl disabled:opacity-30 active:scale-95"
              >
                {sending ? 'Transmitting Data...' : 'Initiate Broadcast'}
              </button>
            </div>
          </div>
          
          {/* Results Display */}
          {results.length > 0 && (
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm animate-fadeIn">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Transmission Results</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((res, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${res.success ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                      <p className="text-[11px] font-bold text-black">{res.name}</p>
                      <p className="text-[9px] font-mono text-gray-400">+{res.phone}</p>
                      <p className={`text-[9px] font-black uppercase mt-1 ${res.success ? 'text-emerald-600' : 'text-red-600'}`}>
                        {res.success ? 'SUCCESS' : 'FAILED: ' + res.error}
                      </p>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
