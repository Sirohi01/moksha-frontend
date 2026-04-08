'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Save, 
    X, 
    Mail, 
    Info, 
    CheckCircle2,
    ArrowLeft,
    Terminal,
    Settings,
    Layers,
    Eye,
    Code,
    Layout,
    RefreshCw,
    Type,
    MousePointer2
} from 'lucide-react';
import { emailTemplatesAPI } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

const CATEGORIES = [
    'Authentication',
    'Donations',
    'Reporting',
    'Volunteers',
    'Support',
    'Tasks',
    'Applications',
    'Requests',
    'Schemes',
    'Expansion',
    'Feedback',
    'Admin Notifications'
];

export default function EditEmailTemplatePage() {
    const { id } = useParams();
    const router = useRouter();
    const [template, setTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [isSplitView, setIsSplitView] = useState(true);
    const [isVisualEditing, setIsVisualEditing] = useState(true);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) fetchTemplate();
    }, [id]);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            const response = await emailTemplatesAPI.getOne(id as string);
            if (response.success) {
                setTemplate(response.data);
            } else {
                toast.error('Template not found');
                router.push('/admin/email-templates');
            }
        } catch (error) {
            toast.error('Failed to load template');
        } finally {
            setLoading(false);
        }
    };

    const handleVisualBlur = () => {
        if (previewRef.current) {
            const newHtml = previewRef.current.innerHTML;
            setTemplate((prev: any) => ({ ...prev, body: newHtml }));
        }
    };

    const handleUpdate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            const response = await emailTemplatesAPI.update(id as string, template);
            if (response.success) {
                toast.success('Engine synced successfully');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to sync engine');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[100vh] bg-[#FAF9F6]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Igniting Engine...</span>
                </div>
            </div>
        );
    }

    if (!template) return null;

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans">
            {/* Unified Command Bar */}
            <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-5">
                    <Link 
                        href="/admin/email-templates"
                        className="p-2.5 bg-stone-50 border border-stone-100 rounded-xl text-stone-400 hover:text-stone-900 transition-all hover:bg-gold-50 hover:border-gold-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-8 w-px bg-stone-100" />
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em]">{template.category}</span>
                            <span className="text-stone-300">/</span>
                            <h1 className="text-sm font-black text-stone-900 tracking-tight">{template.name.replace(/([A-Z])/g, ' $1').trim()}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Subject Protocol:</span>
                            <input 
                                type="text"
                                value={template.subject}
                                onChange={(e) => setTemplate({...template, subject: e.target.value})}
                                className="text-[11px] font-bold text-stone-500 bg-transparent border-none outline-none p-0 focus:text-stone-900 transition-all w-[350px] italic placeholder:opacity-30"
                                placeholder="Configure Subject Meta..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-stone-100/50 p-1 rounded-xl border border-stone-100">
                        <button 
                            onClick={() => setIsVisualEditing(false)}
                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${!isVisualEditing ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <Code className="w-3.5 h-3.5" />
                            Source Code
                        </button>
                        <button 
                            onClick={() => setIsVisualEditing(true)}
                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${isVisualEditing ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <Layout className="w-3.5 h-3.5" />
                            Visual Canvas
                        </button>
                    </div>

                    <div className="h-8 w-px bg-stone-100" />

                    <button
                        onClick={() => handleUpdate()}
                        disabled={saving}
                        className={`px-8 py-2.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 ${saving ? 'bg-stone-100 text-stone-400' : 'bg-stone-950 text-white hover:bg-gold-600'}`}
                    >
                        {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? 'Syncing...' : 'Initiate Sync'}
                    </button>
                </div>
            </div>

            {/* Split-View Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Source Intelligence (HTML Editor) */}
                <div className={`flex-1 flex flex-col bg-stone-50 border-r border-stone-200 transition-all duration-300 ${!isVisualEditing ? 'flex' : 'hidden lg:flex'}`}>
                     <div className="bg-white px-6 py-3 border-b border-stone-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <Terminal className="w-4 h-4 text-gold-500" />
                             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Logic Blueprint Interface</span>
                         </div>
                         <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50%] no-scrollbar px-2">
                             {template.placeholders.map((p: string) => (
                                 <span key={p} className="text-[9px] font-black text-stone-500 bg-white px-2 py-1 rounded-md border border-stone-100 shadow-sm whitespace-nowrap">
                                     {p}
                                 </span>
                             ))}
                         </div>
                     </div>
                     <div className="flex-1 overflow-hidden relative">
                        <textarea
                            value={template.body}
                            onChange={(e) => setTemplate({...template, body: e.target.value})}
                            className="w-full h-full p-10 bg-white/50 text-stone-800 font-mono text-[13px] leading-relaxed outline-none resize-none custom-scrollbar selection:bg-gold-500/20"
                            spellCheck={false}
                        />
                     </div>
                </div>

                {/* Visual Canvas (Live Interactive Preview) */}
                <div className={`flex-1 flex flex-col bg-[#F5F5F3] overflow-hidden transition-all duration-300 ${isVisualEditing ? 'flex' : 'hidden lg:flex'}`}>
                    <div className="bg-white px-6 py-3 border-b border-stone-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="p-1 bg-gold-600 rounded-lg">
                                <Eye className="w-3.5 h-3.5 text-white" />
                             </div>
                             <span className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em]">Operational Preview Canvas</span>
                         </div>
                         <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite]" />
                                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.1em]">Direct Interaction Enabled</span>
                             </div>
                         </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-12 custom-scrollbar flex justify-center items-start">
                        <div className="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-[2rem] overflow-hidden w-full max-w-[800px] border border-stone-200">
                            {/* Visual Deck Frame */}
                            <div className="bg-stone-50/80 px-6 py-4 border-b border-stone-100 flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                                </div>
                                <div className="flex-1 h-7 bg-white/50 border border-stone-100 rounded-lg flex items-center px-4">
                                    <span className="text-[9px] text-stone-300 font-mono italic truncate overflow-hidden">
                                        moksha-engine://live-preview/{template.name.toLowerCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Content Deck - Direct Interaction Layer */}
                            <div className="p-1">
                                <div 
                                    ref={previewRef}
                                    contentEditable={isVisualEditing}
                                    onBlur={handleVisualBlur}
                                    suppressContentEditableWarning={true}
                                    className={`outline-none p-1 min-h-[500px] transition-all duration-300 ${isVisualEditing ? 'cursor-text focus:shadow-[inset_0_0_0_2px_#d4af37]' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: template.body }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interaction Log Footer */}
            <div className="bg-white border-t border-stone-200 px-8 py-3 flex items-center justify-between border-stone-100">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2.5 text-gold-600">
                        <Settings className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{template._id}</span>
                    </div>
                    <div className="h-4 w-px bg-stone-100" />
                    <div className="flex items-center gap-2.5 text-stone-400">
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Status: Synced</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <span className="text-[10px] font-bold text-stone-300 italic">Press Blur or Sync to persist Visual updates to Source Intelligence.</span>
                </div>
            </div>
        </div>
    );
}
