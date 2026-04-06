'use client';

import React from 'react';
import { 
  ChevronDown, ChevronRight, Layout, Search, 
  Terminal, PlusCircle, AlignLeft, Info
} from 'lucide-react';
import FieldRenderer from './FieldRenderer';

interface SectionSchema {
  id: string;
  title: string;
  description?: string;
  fields: Record<string, any>;
}

interface ContentSectionsProps {
  pageSchema: SectionSchema[];
  pageData: any;
  updateFieldValue: (sectionId: string, fieldPath: string, newValue: any) => void;
  expandedSections: Set<string>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Set<string>>>;
  sidebarSearch: string;
  uploadingImage: string | null;
  handleImageUpload: (file: File, sectionId: string, fieldPath: string) => Promise<void>;
  setSuccessMessage: (msg: string) => void;
  seoData: any;
  setSeoData: React.Dispatch<React.SetStateAction<any>>;
  getSafeSrc: (src: any) => string;
}

export default function ContentSections({
  pageSchema,
  pageData,
  updateFieldValue,
  expandedSections,
  setExpandedSections,
  sidebarSearch,
  uploadingImage,
  handleImageUpload,
  setSuccessMessage,
  seoData,
  setSeoData,
  getSafeSrc
}: ContentSectionsProps) {
  
  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatTitle = (title: string) => {
    return title.split(/(?=[A-Z])|_/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-navy-950 uppercase italic tracking-tight">Website Content Sections</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Edit the text and photos across the different parts of your page.</p>
        </div>
        <div className="flex items-center gap-3 bg-navy-50 text-navy-950 px-5 py-2.5 rounded-2xl border border-navy-100">
          <Layout className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{pageSchema.length} Parts Found</span>
        </div>
      </div>

      <div className="space-y-6">
        {pageSchema.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const fields = Object.entries(section.fields).filter(([key]) => 
            !sidebarSearch || key.toLowerCase().includes(sidebarSearch.toLowerCase())
          );

          if (fields.length === 0 && sidebarSearch) return null;

          return (
            <div 
              key={section.id} 
              className={`rounded-[3rem] transition-all duration-500 overflow-hidden ${
                isExpanded 
                ? 'bg-white shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-gold-400/20 translate-y-[-4px]' 
                : 'bg-white/60 border border-gray-100 hover:border-gold-400/20 hover:bg-white hover:translate-y-[-2px]'
              }`}
            >
              <div 
                className={`p-10 cursor-pointer flex items-center justify-between transition-colors ${
                  isExpanded ? 'bg-navy-950 text-white' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isExpanded ? 'bg-gold-500 text-navy-950 shadow-lg' : 'bg-navy-50 text-navy-400'
                  }`}>
                    <AlignLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-black uppercase italic tracking-tight ${isExpanded ? 'text-white' : 'text-navy-950'}`}>
                      {formatTitle(section.id)}
                    </h3>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${isExpanded ? 'text-gold-500/80' : 'text-gray-400'}`}>
                      {Object.keys(section.fields).length} properties available
                    </p>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isExpanded ? 'bg-white/10 text-white rotate-180' : 'bg-gray-100 text-gray-400'
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              {isExpanded && (
                <div className="p-12 space-y-12 animate-in fade-in duration-500">
                  <div className="grid gap-12">
                    {fields.map(([fieldKey, fieldSchema]) => (
                      <div key={fieldKey} className="space-y-4 group">
                        <div className="flex items-center justify-between ml-1">
                          <label className="text-[11px] font-black uppercase tracking-widest text-navy-700 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-gold-500 group-hover:scale-150 transition-transform" />
                             {fieldSchema.label || formatTitle(fieldKey)}
                          </label>
                          {fieldSchema.required && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">Mandatory</span>
                          )}
                        </div>
                        <FieldRenderer
                          sectionId={section.id}
                          fieldPath={fieldKey}
                          fieldSchema={fieldSchema}
                          value={pageData[section.id]?.[fieldKey]}
                          updateFieldValue={updateFieldValue}
                          uploadingImage={uploadingImage}
                          handleImageUpload={handleImageUpload}
                          setSuccessMessage={setSuccessMessage}
                          seoData={seoData}
                          setSeoData={setSeoData}
                          getSafeSrc={getSafeSrc}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-8 border-t border-gray-100 flex items-center gap-3">
                     <Info className="w-4 h-4 text-gold-600" />
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                        Changes to this section are saved globally when you hit the Update button at the bottom.
                     </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {pageSchema.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-navy-50/10 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent" />
            <div className="relative z-10">
               <div className="w-32 h-32 bg-navy-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3 group-hover:rotate-6 transition-all group-hover:scale-110">
                <Terminal className="w-16 h-16 text-navy-200" />
              </div>
              <h3 className="text-3xl font-black text-navy-950 uppercase italic tracking-tight mb-4">No Page Content Parts Found</h3>
              <p className="text-gray-400 text-sm font-medium max-w-sm mx-auto mb-12 leading-relaxed">
                Connect a configuration part to start editing the content of this page.
              </p>
              <button 
                className="bg-navy-950 text-gold-500 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gold-500 hover:text-navy-950 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
              >
                INITIALIZE PAGE PART
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
