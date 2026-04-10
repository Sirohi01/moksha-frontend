'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Filter,
    Edit,
    Save,
    X,
    Plus,
    Mail,
    ChevronDown,
    Info,
    AlertCircle,
    CheckCircle2,
    Terminal,
    RefreshCw
} from 'lucide-react';
import { emailTemplatesAPI } from '@/lib/api';
import { toast } from 'sonner';

interface EmailTemplate {
    _id: string;
    name: string;
    subject: string;
    body: string;
    category: string;
    description: string;
    placeholders: string[];
}

const CATEGORIES = [
    'All',
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
    'Admin Notifications',
    'Other'
];

export default function EmailTemplateManager() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await emailTemplatesAPI.getAll();
            if (response.success) {
                setTemplates(response.data);
            }
        } catch (error: any) {
            toast.error('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/email-templates/${id}`);
    };

    const getTemplateCount = (category: string) => {
        if (category === 'All') return templates.length;
        return templates.filter(t => t.category === category).length;
    };

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Compact Admin Header */}
            <div className="bg-white border-b border-stone-200 px-8 py-6 flex items-center justify-between rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold-50 text-gold-600 rounded-2xl border border-gold-200/50">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-stone-900 tracking-tight">Email Engine Hub</h1>
                        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">System Component • {templates.length} Templates</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Compact Search */}
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-gold-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find blueprint..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold-500/10 focus:border-gold-500 outline-none transition-all text-xs font-bold text-stone-900 w-64"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-widest ${showFilterDropdown ? 'bg-gold-600 border-gold-500 text-white' : 'bg-white border-stone-200 text-stone-600'
                                }`}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            {selectedCategory}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showFilterDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-stone-100 py-3 z-[100] animate-in zoom-in-95 fade-in duration-200">
                                <div className="max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
                                    {CATEGORIES.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setShowFilterDropdown(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all ${selectedCategory === category
                                                ? 'bg-gold-50 text-gold-700 font-black'
                                                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900 font-bold'
                                                }`}
                                        >
                                            <span className="text-[10px] uppercase tracking-wider">{category}</span>
                                            <span className="text-[9px] bg-stone-100 px-2 py-0.5 rounded-md text-stone-400">
                                                {getTemplateCount(category)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => router.push('/admin/system/maintenance')}
                        className="flex items-center gap-3 px-6 py-2.5 bg-white-950 text-gold-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white-900 transition-all shadow-lg active:scale-95"
                    >
                        <Terminal className="w-4 h-4" />
                        Sync Protocols
                    </button>
                </div>
            </div>

            {/* Compact Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {filteredTemplates.map(template => (
                    <div
                        key={template._id}
                        className="group bg-white rounded-2xl border border-stone-200 p-5 hover:border-gold-400 hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden h-[240px]"
                    >
                        {/* Compact Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest truncate">
                                        {template.category}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black text-stone-900 group-hover:text-gold-600 transition-colors truncate">
                                    {template.name.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                            </div>
                            <button
                                onClick={() => handleEdit(template._id)}
                                className="p-2.5 bg-stone-50 text-stone-400 hover:bg-gold-600 hover:text-white rounded-xl transition-all shadow-sm"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Preview/Info */}
                        <div className="space-y-4 flex-1">
                            <div>
                                <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest block mb-1">Subject Metadata</span>
                                <p className="text-[11px] font-bold text-stone-700 truncate opacity-90 italic">
                                    {template.subject.replace(/{{|}}/g, '')}
                                </p>
                            </div>

                            <p className="text-stone-500 text-[10px] leading-relaxed line-clamp-2 font-medium">
                                {template.description}
                            </p>
                        </div>

                        {/* Logic Data - Nodes */}
                        <div className="mt-4 pt-4 border-t border-stone-50 flex items-center justify-between">
                            <div className="flex flex-wrap gap-1 max-w-[60%] overflow-hidden max-h-[30px]">
                                {template.placeholders.slice(0, 2).map((p, idx) => (
                                    <div key={p} className="px-2 py-1 bg-stone-50 border border-stone-100 rounded-md flex items-center gap-1.5 transition-colors group-hover:border-gold-300">
                                        <div className="w-1 h-1 rounded-full bg-gold-400" />
                                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-tight">{p}</span>
                                    </div>
                                ))}
                                {template.placeholders.length > 2 && (
                                    <div className="px-2 py-1 bg-stone-900 rounded-md text-[8px] font-black text-white px-1.5 shadow-sm">
                                        +{template.placeholders.length - 2}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => handleEdit(template._id)}
                                className="flex items-center gap-1.5 group/btn shrink-0"
                            >
                                <span className="text-[9px] font-black text-stone-300 group-hover/btn:text-gold-600 uppercase tracking-widest transition-colors">Configure</span>
                                <RefreshCw className="w-3 h-3 text-stone-300 group-hover/btn:text-gold-600 transition-all duration-500 group-hover/btn:rotate-180" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
