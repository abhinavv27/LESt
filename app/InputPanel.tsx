"use client";

import { FileText, Upload, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";

export function InputPanel({ 
  onDocA, onDocB, docA, docB, isStreaming, isComplete
}: { 
  onDocA: (val: File) => void, 
  onDocB: (val: File) => void,
  docA: File | null,
  docB: File | null,
  isStreaming?: boolean,
  isComplete?: boolean
}) {
  const fileARef = useRef<HTMLInputElement>(null);
  const fileBRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Contract A Input */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`cyber-neo-outset p-5 relative group transition-all duration-500 ${docA ? 'hv-glow-cyan' : 'hover:hv-glow-cyan'}`}
      >
        <div className="cyber-corners opacity-20" />
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
             <FileText className={`w-4 h-4 ${docA ? 'text-[var(--cyber-success)]' : 'text-[var(--cyber-cyan)]'}`} />
             <h3 className="hud-label text-[10px]">BASELINE_SRC</h3>
          </div>
          <span className="text-[8px] font-mono bg-black/40 px-2 py-0.5 text-[var(--cyber-cyan)] border border-[var(--cyber-cyan)]/20">CTRL_A</span>
        </div>
        
        <div 
           className={`cyber-neo-inset min-h-[100px] flex flex-col items-center justify-center cursor-pointer transition-all border border-transparent overflow-hidden relative ${docA ? 'border-[var(--cyber-success)]/20' : 'hover:border-[var(--cyber-cyan)]/50'}`}
           onClick={() => fileARef.current?.click()}
        >
           {!docA && <div className="scanning-line opacity-5" />}
           <input type="file" ref={fileARef} className="hidden" onChange={(e) => handleFileChange(e, onDocA)} accept=".pdf,.txt" />
           {docA ? (
             <CheckCircle className="w-6 h-6 text-[var(--cyber-success)] mb-2 animate-bounce" />
           ) : (
             <Upload className="w-6 h-6 text-white/10 mb-2 group-hover:text-[var(--cyber-cyan)] transition-colors animate-pulse" />
           )}
           <span className="font-mono text-[9px] tracking-widest text-center px-4 line-clamp-2 font-black text-white/40 uppercase">
              {docA ? docA.name : "LOAD_BASELINE.OS"}
           </span>
        </div>
      </motion.div>

      {/* Contract B Input */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`cyber-neo-outset p-5 relative group transition-all duration-500 ${docB ? 'hv-glow-cyan' : 'hover:hv-glow-cyan'}`}
      >
        <div className="cyber-corners opacity-20" />
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
             <Plus className={`w-4 h-4 ${docB ? 'text-[var(--cyber-success)]' : 'text-[var(--cyber-magenta)]'}`} />
             <h3 className="hud-label text-[10px]">CONTRAST_SRC</h3>
          </div>
          <span className="text-[8px] font-mono bg-black/40 px-2 py-0.5 text-[var(--cyber-magenta)] border border-[var(--cyber-magenta)]/20">CTRL_B</span>
        </div>
        
        <div 
           className={`cyber-neo-inset min-h-[100px] flex flex-col items-center justify-center cursor-pointer transition-all border border-transparent overflow-hidden relative ${docB ? 'border-[var(--cyber-success)]/20' : 'hover:border-[var(--cyber-magenta)]/50'}`}
           onClick={() => fileBRef.current?.click()}
         >
           {!docB && <div className="scanning-line opacity-5" />}
           <input type="file" ref={fileBRef} className="hidden" onChange={(e) => handleFileChange(e, onDocB)} accept=".pdf,.txt" />
           {docB ? (
             <CheckCircle className="w-6 h-6 text-[var(--cyber-success)] mb-2 animate-bounce" />
           ) : (
             <Plus className="w-6 h-6 text-white/10 mb-2 group-hover:text-[var(--cyber-magenta)] transition-colors animate-pulse" />
           )}
           <span className="font-mono text-[9px] tracking-widest text-center px-4 line-clamp-2 font-black text-white/40 uppercase">
              {docB ? docB.name : "LOAD_CONTRAST.OS"}
           </span>
        </div>
      </motion.div>

      {!docA && !docB && !isStreaming && !isComplete && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cyber-neo-inset p-3 flex items-start gap-3 mt-2 border border-red-900/40 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
        >
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <span className="text-[8px] font-mono text-red-400/80 leading-relaxed font-black uppercase tracking-[0.1em]">
            SYSTEM_REQ: DUAL_STREAM_LINK_OFFLINE. <br /> INGEST_SOURCE TO INITIALIZE_AUDIT.
          </span>
        </motion.div>
      )}
    </div>
  );
}
