'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  GripVertical, 
  MoreVertical,
  Layers,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface VisualConfigEditorProps {
  value: any;
  onChange: (newValue: any) => void;
}

export default function VisualConfigEditor({ value, onChange }: VisualConfigEditorProps) {
  // We want to render EACH top-level key as a section in the form.
  // Except for 'pageName' and other metadata.
  
  const entries = Object.entries(value).filter(([key]) => !['pageName', '_id', '__v'].includes(key));

  const handleFieldChange = (keyPath: string[], newValue: any) => {
    const updatedValue = { ...value };
    let current = updatedValue;
    
    for (let i = 0; i < keyPath.length - 1; i++) {
      current = current[keyPath[i]];
    }
    
    current[keyPath[keyPath.length - 1]] = newValue;
    onChange(updatedValue);
  };

  const addItemToArray = (path: string[], emptyTemplate: any) => {
    const updatedValue = { ...value };
    let current = updatedValue;
    
    for (let i = 0; i < path.length; i++) {
        current = current[path[i]];
    }
    
    if (Array.isArray(current)) {
        current.push(JSON.parse(JSON.stringify(emptyTemplate)));
    }
    onChange(updatedValue);
  };

  const removeItemFromArray = (path: string[], index: number) => {
    const updatedValue = { ...value };
    let current = updatedValue;
    
    for (let i = 0; i < path.length; i++) {
        current = current[path[i]];
    }
    
    if (Array.isArray(current)) {
        current.splice(index, 1);
    }
    onChange(updatedValue);
  };

  const moveArrayItem = (path: string[], index: number, direction: 'up' | 'down') => {
    const updatedValue = { ...value };
    let current = updatedValue;
    
    for (let i = 0; i < path.length; i++) {
        current = current[path[i]];
    }
    
    if (Array.isArray(current)) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < current.length) {
            const temp = current[index];
            current[index] = current[newIndex];
            current[newIndex] = temp;
        }
    }
    onChange(updatedValue);
  };

  return (
    <div className="space-y-8 pb-20">
      {entries.map(([key, val]) => (
        <section key={key} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="bg-stone-50/50 border-b border-stone-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                {key.substring(0, 2)}
              </div>
              <h3 className="font-bold text-stone-900 capitalize tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</h3>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-stone-100 italic">
                 {typeof val === 'object' ? (Array.isArray(val) ? 'Collection' : 'Component') : 'Field'}
               </span>
            </div>
          </div>
          
          <div className="p-6">
            <RecursiveField 
              name={key} 
              value={val} 
              path={[key]} 
              onFieldChange={handleFieldChange} 
              onAdd={addItemToArray}
              onRemove={removeItemFromArray}
              onMove={moveArrayItem}
            />
          </div>
        </section>
      ))}
    </div>
  );
}

interface RecursiveFieldProps {
  name: string;
  value: any;
  path: string[];
  onFieldChange: (path: string[], newValue: any) => void;
  onAdd: (path: string[], template: any) => void;
  onRemove: (path: string[], index: number) => void;
  onMove: (path: string[], index: number, direction: 'up' | 'down') => void;
}

function RecursiveField({ name, value, path, onFieldChange, onAdd, onRemove, onMove }: RecursiveFieldProps) {
  // HANDLE ARRAY
  if (Array.isArray(value)) {
    const template = value.length > 0 ? value[0] : { title: "" };
    
    return (
      <div className="space-y-4">
        {value.map((item, index) => (
          <div key={index} className="group relative bg-stone-50/30 rounded-xl border border-stone-100 p-5 transition-all hover:bg-white hover:shadow-md hover:border-stone-200">
             {/* Header of Item */}
             <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100/50">
               <div className="flex items-center gap-3">
                 <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-[10px] font-bold">
                   #{index + 1}
                 </span>
                 <span className="text-sm font-bold text-stone-700">
                    {item.title || item.label || item.name || `Item ${index + 1}`}
                 </span>
               </div>
               
               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => onMove(path, index, 'up')} disabled={index === 0} className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-900 disabled:opacity-30">
                   <ChevronUp className="w-4 h-4" />
                 </button>
                 <button onClick={() => onMove(path, index, 'down')} disabled={index === value.length - 1} className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-900 disabled:opacity-30">
                   <ChevronDown className="w-4 h-4" />
                 </button>
                 <div className="w-px h-4 bg-stone-200 mx-1"></div>
                 <button onClick={() => onRemove(path, index)} className="p-1.5 hover:bg-red-50 rounded text-stone-400 hover:text-red-500">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>

             {/* Fields of Item */}
             <RecursiveField 
               name={name} 
               value={item} 
               path={[...path, index.toString()]} 
               onFieldChange={onFieldChange}
               onAdd={onAdd}
               onRemove={onRemove}
               onMove={onMove}
             />
          </div>
        ))}
        
        <button 
           onClick={() => onAdd(path, template)}
           className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 hover:border-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-all font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Item to {name}
        </button>
      </div>
    );
  }

  // HANDLE OBJECT
  if (typeof value === 'object' && value !== null) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {Object.entries(value).map(([childKey, childVal]) => (
                  <div key={childKey} className={cn(
                      "flex flex-col gap-1.5",
                      (Array.isArray(childVal) || (typeof childVal === 'object' && childVal !== null)) ? "md:col-span-2" : ""
                  )}>
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        {childKey.replace(/([A-Z])/g, ' $1')}
                        {typeof childVal === 'string' && childVal.includes('http') && <LinkIcon className="w-3 h-3 text-saffron-600" />}
                      </label>
                      
                      <RecursiveField 
                        name={childKey} 
                        value={childVal} 
                        path={[...path, childKey]} 
                        onFieldChange={onFieldChange}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        onMove={onMove}
                      />
                  </div>
              ))}
          </div>
      );
  }

  // HANDLE BASIC TYPES
  const inputClassName = "w-full p-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all text-sm text-stone-800 placeholder:text-stone-300 shadow-sm";

  if (typeof value === 'boolean') {
      return (
          <div className="flex items-center gap-3">
              <button 
                onClick={() => onFieldChange(path, !value)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all",
                  value ? "bg-stone-900" : "bg-stone-200"
                )}
              >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                    value ? "left-7" : "left-1"
                  )} />
              </button>
              <span className="text-xs font-bold text-stone-600 italic uppercase tracking-tighter">
                {value ? 'Active / Enabled' : 'Inactive / Disabled'}
              </span>
          </div>
      );
  }

  if (typeof value === 'number') {
      return (
          <input 
            type="number" 
            value={value} 
            onChange={(e) => onFieldChange(path, parseFloat(e.target.value))}
            className={inputClassName}
          />
      );
  }

  // Determine if it's a long string (textarea)
  if (typeof value === 'string' && (value.length > 60 || value.includes('\n'))) {
      return (
          <textarea 
            value={value} 
            onChange={(e) => onFieldChange(path, e.target.value)}
            className={cn(inputClassName, "min-h-[100px] leading-relaxed")}
            rows={4}
          />
      );
  }

  return (
      <input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onFieldChange(path, e.target.value)}
        className={inputClassName}
      />
  );
}
