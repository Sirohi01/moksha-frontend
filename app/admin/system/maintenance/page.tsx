'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ShieldAlert,
  Database,
  RefreshCw,
  Trash2,
  Cpu,
  ChevronRight,
  Activity,
  Zap,
  Globe,
  Command,
  Monitor,
  ArrowRight,
  Search,
  Filter,
  Code2,
  BookOpen,
  TerminalSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MaintenanceScript {
  id: string;
  label: string;
  path: string;
  type: 'data' | 'security' | 'diagnostics' | 'intelligence';
  description: string;
}

interface LogEntry {
    id: string;
    text: string;
    type: 'info' | 'success' | 'error' | 'warning';
    timestamp: string;
}

export default function MaintenanceTerminal() {
  const [scripts, setScripts] = useState<MaintenanceScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Custom command states
  const [customCommand, setCustomCommand] = useState('');
  const [executingCustom, setExecutingCustom] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchScripts();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchScripts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/maintenance/scripts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setScripts(data.scripts);
        addLog('Infrastructure synchronized. Filters initialized.', 'success');
      }
    } catch (error) {
      addLog('Failed to fetch script registry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [...prev.slice(-199), { id: Date.now().toString() + Math.random(), text, type, timestamp }]);
  };

  const runScript = async (scriptKey: string) => {
    if (!window.confirm(`Invoke authorized protocol: '${scriptKey}'?`)) return;

    try {
      setRunningScript(scriptKey);
      addLog(`Initiating protocol: ${scriptKey.toUpperCase()}...`, 'warning');

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/maintenance/run-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ scriptKey })
      });

      const data = await res.json();
      if (data.success) {
        addLog(`Protocol finalized successfully.`, 'success');
        if (data.output) {
          data.output.split('\n').filter(Boolean).forEach((line: string) => {
            addLog(`❯ ${line}`, 'info');
          });
        }
      } else {
        addLog(`Protocol rejected by backend core: ${data.message}`, 'error');
      }
    } catch (error: any) {
      addLog(`Secure connection lost: ${error.message}`, 'error');
    } finally {
      setRunningScript(null);
    }
  };

  const handleCustomCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;
    if (!window.confirm(`AUTHORIZED PERSONNEL ONLY: Execute manual override command? [${customCommand}]`)) return;

    try {
      setExecutingCustom(true);
      addLog(`📡 MANUAL_OVERRIDE INITIATED: ${customCommand}`, 'warning');

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/maintenance/run-custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ command: customCommand })
      });

      const data = await res.json();
      if (data.success) {
        addLog(`Manual protocol finalized.`, 'success');
        if (data.output) {
          data.output.split('\n').filter(Boolean).forEach((line: string) => {
            addLog(`❯ ${line}`, 'info');
          });
        }
        setCustomCommand('');
      } else {
        addLog(`Manual protocol failed: ${data.message}`, 'error');
        if (data.error) addLog(`SYSTEM_ERROR: ${data.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Uplink lost during manual override: ${error.message}`, 'error');
    } finally {
      setExecutingCustom(false);
    }
  };

  const filteredScripts = useMemo(() => {
    return scripts.filter(s => {
      const matchesSearch = s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || s.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [scripts, searchQuery, activeTab]);

  const getScriptIcon = (type: string) => {
    const size = 18;
    if (type === 'data') return <Database size={size} />;
    if (type === 'security') return <ShieldAlert size={size} />;
    if (type === 'diagnostics') return <Monitor size={size} />;
    if (type === 'intelligence') return <BookOpen size={size} />;
    return <Cpu size={size} />;
  };

  const tabs = [
    { id: 'all', label: 'All Operations', icon: Layout },
    { id: 'data', label: 'Data & Seeds', icon: Database },
    { id: 'diagnostics', label: 'Health & Tests', icon: Activity },
    { id: 'security', label: 'Security & Logs', icon: Trash2 },
    { id: 'intelligence', label: 'Docs & Intelligence', icon: Code2 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-[#f8f9fa]">
        <div className="w-12 h-12 border-2 border-stone-100 border-t-gold-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest leading-none">Syncing Infrastructure...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-navy-950 font-sans pb-32">
      <main className="max-w-[1440px] mx-auto px-6 md:px-8 space-y-8 pt-10">
        
        {/* Header Section */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-navy-950 rounded-2xl flex items-center justify-center text-gold-500 shadow-xl">
                  <TerminalIcon size={24} />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-navy-950 uppercase tracking-tighter italic leading-none">System Cockpit</h1>
                  <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1 italic">Infrastructure Command & Diagnostics</p>
               </div>
            </div>
            <p className="text-stone-500 text-sm font-medium leading-relaxed max-w-xl italic opacity-60">
               Live interface for backend protocols, database seeding, and system-wide diagnostic tests.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
             <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-gold-600 transition-colors" />
                <input 
                   type="text" 
                   placeholder="SEARCH PROTOCOLS..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full h-14 pl-14 pr-6 bg-stone-50 rounded-2xl border border-stone-100 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-600/30 transition-all"
                />
             </div>
             <Link href="/admin/dashboard" className="px-10 py-5 bg-navy-50 text-navy-950 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-navy-950 hover:text-white transition-all flex items-center gap-3">
                Exit Terminal
                <ArrowRight size={16} />
             </Link>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-white border border-stone-100 rounded-3xl shadow-sm">
           {tabs.map((tab) => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id 
                       ? "bg-navy-950 text-gold-500 shadow-xl" 
                       : "text-stone-400 hover:bg-stone-50 hover:text-navy-950"
                 )}
              >
                 <tab.icon size={14} />
                 {tab.label}
              </button>
           ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Script Grid */}
          <div className="xl:col-span-8 flex flex-col gap-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredScripts.length === 0 ? (
                    <div className="md:col-span-2 py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-stone-100 opacity-50">
                       <Filter size={48} className="text-stone-200 mb-4" />
                       <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest">No matching protocols found</p>
                    </div>
                ) : (
                    filteredScripts.map((script) => (
                        <div key={script.id} className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:border-gold-600/30 transition-all group relative overflow-hidden">
                            {/* Type Badge */}
                            <div className="absolute top-0 right-10 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500">
                               <div className="bg-stone-50 px-4 py-2 rounded-b-xl border-x border-b border-stone-200">
                                  <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">{script.type}</span>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <div className="flex justify-between items-start">
                                  <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                                    runningScript === script.id ? "bg-gold-600 text-white" : "bg-stone-50 text-navy-400 group-hover:bg-gold-50 group-hover:text-gold-600"
                                  )}>
                                     {getScriptIcon(script.type)}
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest mb-1 italic">Authorized protocol</p>
                                     <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter italic leading-none">{script.label}</h3>
                                  </div>
                               </div>
                               
                               <p className="text-[11px] font-medium text-stone-500 leading-relaxed italic opacity-80 min-h-[44px]">
                                 {script.description}
                               </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-stone-50">
                                <button
                                  onClick={() => runScript(script.id)}
                                  disabled={runningScript !== null || executingCustom}
                                  className={cn(
                                      "w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95",
                                      runningScript === script.id 
                                        ? "bg-navy-950 text-gold-500 animate-pulse" 
                                        : "bg-stone-50 text-navy-950 border border-stone-100 hover:bg-gold-600 hover:text-white"
                                  )}
                                >
                                    {runningScript === script.id ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} className="fill-current" />}
                                    {runningScript === script.id ? 'EXECUTING...' : 'INVOKE PROTOCOL'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
             </div>

             {/* Manual Override Console */}
             <div className="bg-white border-2 border-dashed border-stone-200 rounded-[3rem] p-10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-gold-100">
                        <TerminalSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-navy-950 uppercase tracking-tighter italic leading-none">Manual Protocol Override</h3>
                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">Direct Backend Execution Shell</p>
                    </div>
                </div>

                <form onSubmit={handleCustomCommand} className="space-y-6">
                    <div className="relative group">
                        <TerminalIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-gold-600 transition-colors" />
                        <input 
                           type="text" 
                           placeholder="PASTE MANUAL COMMAND SEQUENCE (e.g. node scripts/test.js)"
                           value={customCommand}
                           onChange={(e) => setCustomCommand(e.target.value)}
                           className="w-full h-20 pl-16 pr-8 bg-stone-50 rounded-3xl border border-stone-100 text-sm font-mono tracking-tight focus:outline-none focus:ring-8 focus:ring-gold-500/10 focus:border-gold-600/30 transition-all shadow-inner"
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest max-w-lg italic">
                           All manual overrides are logged under the <span className="text-navy-950 font-black">System_Audit</span> cluster. Use with operational caution.
                        </p>
                        <button
                          type="submit"
                          disabled={executingCustom || runningScript !== null || !customCommand.trim()}
                          className={cn(
                            "px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap shadow-xl",
                            executingCustom 
                              ? "bg-navy-950 text-gold-500 animate-pulse" 
                              : "bg-gold-600 text-white hover:bg-gold-500 shadow-gold-500/20"
                          )}
                        >
                           {executingCustom ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-current" />}
                           Execute Manual Protocol
                        </button>
                    </div>
                </form>
             </div>
          </div>

          {/* Logistics Output */}
          <div className="xl:col-span-4">
             <div className="bg-white border border-stone-200 rounded-[3rem] shadow-sm overflow-hidden flex flex-col h-[900px] sticky top-8">
                {/* Header */}
                <div className="px-10 py-8 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity className="text-gold-600 animate-pulse" size={18} />
                        <span className="text-[10px] font-black text-navy-950 uppercase tracking-[0.4em] italic">Real-Time Payload</span>
                    </div>
                    <button 
                      onClick={() => setLogs([])}
                      className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all font-black text-[10px] tracking-widest"
                    >
                       <Trash2 size={14} />
                    </button>
                </div>

                {/* Log Feed */}
                <div 
                  ref={terminalRef}
                  className="flex-1 overflow-y-auto p-10 space-y-6 font-mono text-[11px] leading-relaxed select-text bg-white scrollbar-thin scrollbar-thumb-stone-100"
                >
                    {logs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-10 filter grayscale">
                            <Monitor size={48} className="text-navy-950" />
                            <p className="text-navy-950 italic uppercase font-black text-[10px] tracking-[0.6em]">Awaiting Uplink...</p>
                        </div>
                    )}
                    
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 animate-in fade-in duration-700">
                            <span className="text-stone-300 shrink-0 font-black">[{log.timestamp}]</span>
                            <div className={cn(
                                "flex-1 break-words",
                                log.type === 'error' ? "text-red-500 font-bold bg-red-50 px-4 py-2 rounded-xl border border-red-100" : 
                                log.type === 'success' ? "text-emerald-700 font-bold" : 
                                log.type === 'warning' ? "text-gold-600 font-bold italic" : "text-stone-600"
                            )}>
                                {log.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Bar */}
                <div className="px-10 py-6 bg-stone-50 border-t border-stone-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Protocol Integrity</span>
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 size={12} /> ENCRYPTED_UPLINK
                       </span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Minimal Interface definitions for icons
const Layout = ({ size, className }: any) => <Globe size={size} className={className} />;
