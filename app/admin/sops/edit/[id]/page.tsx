'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { sopAPI } from '@/lib/api';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, 
  BookOpen, Terminal, Sparkles, 
  Settings, ShieldAlert, FileText, 
  Save, X, Info, RotateCcw
} from 'lucide-react';
import { PageHeader, LoadingSpinner } from '@/components/admin/AdminComponents';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function EditSOP() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    description: '',
    content: '',
    status: 'draft',
    isCritical: false
  });

  const categories = ['MCD', 'Ambulance', 'Logistics', 'Administration', 'Personnel', 'Medical', 'Legal', 'General'];

  useEffect(() => {
    if (id) fetchSOP();
  }, [id]);

  const fetchSOP = async () => {
    try {
      setLoading(true);
      const res = await sopAPI.getOne(id as string);
      if (res.success) {
        setFormData({
          title: res.data.title,
          category: res.data.category,
          description: res.data.description || '',
          content: res.data.content,
          status: res.data.status,
          isCritical: res.data.isCritical || false
        });
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      setSaving(true);
      const res = await sopAPI.update(id as string, formData);
      if (res.success) {
        router.push('/admin/sops');
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" message="Resynchronizing protocol data..." />;

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto pb-32 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/sops">
            <button className="flex items-center gap-3 px-6 py-3 bg-white border border-navy-50 text-navy-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-navy-950 hover:bg-navy-50 transition-all font-sans group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Retreat
            </button>
          </Link>
          <div className="hidden md:block">
             <p className="text-[10px] font-black uppercase text-navy-300 tracking-[0.4em] mb-1 italic">Protocol ID</p>
             <p className="text-[11px] font-black text-navy-950 tracking-widest uppercase italic">{id}</p>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={saving || !formData.title || !formData.content}
          className="flex items-center gap-4 px-10 py-5 bg-navy-950 text-gold-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl disabled:opacity-50 active:scale-95 group"
        >
          {saving ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Commit Patch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Editorial Sector */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white p-14 rounded-[3.5rem] border border-navy-50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-navy-50/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-6 flex items-center gap-2">
                  <Terminal size={12} /> Protocol Identifier (Title)
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-24 px-10 bg-navy-50 rounded-[2rem] border-none text-2xl font-black uppercase tracking-tighter italic focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none text-navy-950 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-6">Operational Sector</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-16 px-8 bg-navy-50 rounded-2xl border-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none text-navy-950 shadow-inner appearance-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-6">Mission Criticality</label>
                  <div 
                    onClick={() => setFormData({ ...formData, isCritical: !formData.isCritical })}
                    className={cn(
                      "w-full h-16 px-8 rounded-2xl border-none text-[10px] font-black uppercase tracking-widest flex items-center justify-between cursor-pointer transition-all",
                      formData.isCritical ? "bg-rose-500 text-white shadow-lg" : "bg-navy-50 text-navy-400"
                    )}
                  >
                    <span>{formData.isCritical ? 'Critical Asset' : 'Standard Asset'}</span>
                    <ShieldAlert size={18} className={cn(formData.isCritical ? "text-white" : "text-navy-200")} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-6">Executive Summary</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32 p-8 bg-navy-50 rounded-[2rem] border-none text-[11px] font-bold uppercase tracking-widest leading-relaxed focus:ring-4 focus:ring-gold-500/10 focus:bg-white transition-all outline-none text-navy-950 shadow-inner resize-none"
                />
              </div>

              <div className="space-y-4 pt-10 border-t border-navy-50">
                <label className="text-[10px] font-black text-navy-400 uppercase tracking-widest pl-6 flex items-center gap-2">
                  <BookOpen size={12} /> Documentation Content (Rich Text Terminal)
                </label>
                <div className="relative group">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="DEFINE THE SURGICAL OPERATING STEPS HERE..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Sector */}
        <div className="lg:col-span-4 space-y-12">
          {/* Status Control */}
          <div className="p-10 bg-navy-950 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-600/5 group-hover:bg-gold-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 transition-all duration-1000" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gold-500">
                  <Settings size={18} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Launch Protocol</p>
              </div>
              <div className="space-y-3">
                {['draft', 'published', 'archived'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s as any })}
                    className={cn(
                      "w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between px-8 border",
                      formData.status === s
                        ? "bg-gold-600 border-gold-500 text-navy-950 scale-[1.02] shadow-2xl"
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                  >
                    {s}
                    {formData.status === s && <CheckCircle2 size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guidance Node */}
          <div className="p-10 bg-white border border-navy-50 rounded-[3rem] shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-gold-600">
                <Info size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-400">Documentation Guide</p>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'Rich Formatting', text: 'Use <strong>, <ul>, and <ol> tags for structured lists and emphasis.' },
                { title: 'Critical Markers', text: 'Mark dangerous protocols as "Critical Assets" to highlight them in the dashboard.' },
                { title: 'Clearance Levels', text: 'Drafts are only visible to authorized administrative personnel.' }
              ].map((tip, i) => (
                <div key={i} className="space-y-2 border-l-2 border-navy-50 pl-6 py-2">
                  <p className="text-[10px] font-black text-navy-950 uppercase tracking-widest">{tip.title}</p>
                  <p className="text-[10px] text-navy-400 font-bold uppercase tracking-tight italic leading-relaxed opacity-70">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
