'use client';

import { useState } from 'react';
import { PageHeader, ActionButton, Alert } from '@/components/admin/AdminComponents';
import { Mail, Layout, Type, Image, Plus, Send, Save, Eye, Trash2, Square, LayoutPanelTop } from 'lucide-react';

export default function NewsletterBuilderPage() {
  const [elements, setElements] = useState([
    { id: 1, type: 'header', content: 'MOKSHA SEWA MONTHLY DECK' },
    { id: 2, type: 'image', content: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000' },
    { id: 3, type: 'text', content: 'Your support is turning our mission into a global impact. This month, we helped over 500 nodes reach their potential.' }
  ]);
  const [draggedItem, setDraggedItem] = useState(null);

  const addElement = (type: string) => {
    const newElement = {
      id: Date.now(),
      type,
      content: type === 'image' ? 'https://via.placeholder.com/600x300' : 'Enter content here...'
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id: number) => {
    setElements(elements.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <PageHeader 
        title="Newsletter Intelligence" 
        description="Drag-and-drop orchestration of marketing communications and monthly decks."
        icon={<Mail className="w-7 h-7" />}
      >
        <div className="flex gap-4">
            <ActionButton variant="secondary" icon={<Eye className="w-4 h-4" />}>Preview</ActionButton>
            <ActionButton variant="primary" icon={<Send className="w-4 h-4" />}>Deploy Stream</ActionButton>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Toolbox */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-navy-50 shadow-sm sticky top-8">
                <h3 className="text-[10px] font-black text-navy-400 uppercase tracking-[0.3em] mb-8 px-2">Design Blocks</h3>
                <div className="flex flex-col gap-4">
                    {[
                        { label: 'Strategic Header', type: 'header', icon: <Type className="w-4 h-4" /> },
                        { label: 'Paragraph Node', type: 'text', icon: <LayoutPanelTop className="w-4 h-4" /> },
                        { label: 'Visual Uplink', type: 'image', icon: <Image className="w-4 h-4" /> },
                        { label: 'Command Button', type: 'button', icon: <Square className="w-4 h-4" /> }
                    ].map(block => (
                        <button 
                            key={block.type}
                            onClick={() => addElement(block.type)}
                            className="flex items-center gap-4 p-5 bg-navy-50/50 rounded-2xl border border-transparent hover:border-gold-500/30 hover:bg-white hover:shadow-xl transition-all group text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-navy-400 group-hover:text-gold-600 shadow-sm transition-colors">
                                {block.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy-950">{block.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Builder Canvas */}
        <div className="lg:col-span-3">
            <div className="bg-white min-h-[800px] border border-navy-50 shadow-2xl rounded-[3rem] p-12 overflow-hidden relative">
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-50/30 to-transparent pointer-events-none"></div>
                
                <div className="max-w-xl mx-auto space-y-12 relative z-10">
                    {/* Newsletter Header Preview */}
                    <div className="text-center py-12 border-b border-navy-50">
                        <div className="w-16 h-16 bg-navy-950 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/10">
                            <span className="text-gold-500 font-black text-2xl italic">M</span>
                        </div>
                        <h1 className="text-2xl font-black text-navy-950 uppercase tracking-tighter italic">Moksha Sewa Organization</h1>
                    </div>

                    <div className="space-y-8 min-h-[400px]">
                        {elements.map((element, index) => (
                            <div key={element.id} className="group relative">
                                {element.type === 'header' && (
                                    <h2 className="text-3xl font-black text-navy-950 uppercase tracking-tighter italic border-l-4 border-gold-500 pl-6 leading-tight">
                                        {element.content}
                                    </h2>
                                )}
                                {element.type === 'image' && (
                                    <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-navy-100">
                                        <img src={element.content} alt="Newsletter image" className="w-full h-auto object-cover" />
                                    </div>
                                )}
                                {element.type === 'text' && (
                                    <p className="text-navy-400 font-bold uppercase text-[11px] tracking-widest leading-relaxed opacity-80">
                                       {element.content}
                                    </p>
                                )}
                                {element.type === 'button' && (
                                    <div className="flex justify-center pt-4">
                                        <button className="px-12 py-5 bg-navy-950 text-gold-500 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-2xl hover:bg-gold-500 hover:text-navy-950 transition-all active:scale-95 border border-white/5">
                                            Execute Command
                                        </button>
                                    </div>
                                )}

                                {/* Hover Shields (Delete Button) */}
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:right-[-20px] z-20">
                                    <button 
                                        onClick={() => removeElement(element.id)}
                                        className="p-3 bg-rose-600 text-white rounded-xl shadow-xl hover:scale-110 active:rotate-12 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter Footer */}
                    <div className="pt-12 border-t border-navy-50 text-center opacity-40">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Propagated from the Moksha Intelligence Deck</p>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <span className="w-2 h-0.5 bg-navy-200"></span>
                            <span className="text-[9px] font-bold">UNSUBSCRIBE</span>
                            <span className="w-2 h-0.5 bg-navy-200"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center px-12 opacity-50">
                 <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-navy-400 uppercase tracking-widest">Protocol Active: Auto-Save Enabled</span>
                 </div>
                 <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest">Elements: {elements.length}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
