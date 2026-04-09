"use client";

import { useEffect, useRef, useMemo } from "react";
import { AgentEvent } from "./useAgentStream";
import { Terminal, Activity, Zap, ShieldAlert, AlertTriangle, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveTerminalProps {
  events: AgentEvent[];
}

export default function LiveTerminal({ events }: LiveTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null!);

  // Performance optimization: only show last 100 events to prevent DOM bloat
  const displayEvents = useMemo(() => events.slice(-100), [events]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [displayEvents]);

  return (
    <div className="w-full h-full font-mono text-[11px] leading-relaxed flex flex-col bg-black/60 cyber-panel p-0 overflow-hidden low-lag-blur">
      {/* Header HUD - High Density */}
      <div className="px-5 py-4 border-b border-[var(--cyber-cyan)]/20 bg-black/40 flex items-center justify-between shrink-0 relative overflow-hidden">
        <div className="scanning-line opacity-5" />
        <div className="flex items-center gap-4 relative z-10">
           <div className="p-1.5 rounded-sm bg-[var(--cyber-cyan)]/10 border border-[var(--cyber-cyan)]/20">
             <Cpu className="w-4 h-4 text-[var(--cyber-cyan)] animate-pulse" />
           </div>
           <div className="flex flex-col">
             <h3 className="hud-label tracking-[0.4em] mb-0.5">KERNEL_SYNC_ACTIVE</h3>
             <span className="text-[8px] text-[var(--cyber-cyan)]/40 uppercase font-black tracking-widest">v4.2.0_STABLE_BUILD</span>
           </div>
        </div>
        <div className="flex items-center gap-6 text-[9px] text-[var(--cyber-cyan)]/60 uppercase tracking-widest font-black relative z-10 transition-all">
           <div className="flex flex-col items-end">
             <span className="text-white/20 text-[7px] mb-0.5">OPS_CTR</span>
             <div className="flex items-center gap-2 px-2 py-0.5 bg-black/40 border border-[var(--cyber-cyan)]/20 shadow-[0_0_10px_rgba(0,240,255,0.05)]">
               <Activity className="w-3 h-3 text-[var(--cyber-cyan)]" />
               <span className="text-white tabular-nums">{events.length.toString().padStart(4, '0')}</span>
             </div>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-white/20 text-[7px] mb-0.5">LINK_LAT</span>
             <div className="flex items-center gap-2 px-2 py-0.5 bg-black/40 border border-[var(--cyber-warning)]/20">
               <Zap className="w-3 h-3 text-[var(--cyber-warning)]" />
               <span className="text-white animate-flicker">0.02MS</span>
             </div>
           </div>
        </div>
      </div>

      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-2 relative bg-[#040406]/80"
      >
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,var(--cyber-cyan)_0%,transparent_70%)]" />
        <AnimatePresence initial={false}>
          {displayEvents.map((e, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`flex gap-4 group py-1 items-start relative ${
                e.kind === 'error' ? 'text-[var(--cyber-error)]' : 
                e.kind === 'collision' ? 'text-[var(--cyber-warning)]' : 
                e.kind === 'lens_start' ? 'text-[var(--cyber-success)] bg-[var(--cyber-success)]/5 px-2 py-2 border-l border-[var(--cyber-success)]/40 mb-3 mt-3 shadow-[inset_10px_0_20px_-10px_rgba(5,255,161,0.1)]' : 
                'text-white/40'
              }`}
            >
              <span className="opacity-40 shrink-0 tabular-nums select-none mt-1 w-[75px] text-[8px] font-black border-r border-white/5 pr-3">
                {new Date(e.ts).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 })}
              </span>
              
              <div className="flex flex-col flex-1 gap-1">
                <span className={`shrink-0 font-black opacity-100 text-[8px] uppercase tracking-[0.2em] flex items-center gap-2 ${
                   e.kind === 'collision' ? 'text-[var(--cyber-cyan)]' : 
                   e.kind === 'error' ? 'text-[var(--cyber-error)]' : 
                   e.kind === 'lens_start' ? 'text-[var(--cyber-success)]' : 
                   'text-white/20'
                 }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                  {e.kind === 'collision' ? "NEURAL_COLLISION_DETECTED" : 
                   e.kind === 'error' ? "SYSTEM_KRNL_EXCP" : 
                   e.kind === 'lens_start' ? "CONTEXT_PIVOT_INIT" : 
                   "PACKET_STREAM_RX"}
                </span>

                <span className={`flex-1 break-words transition-all duration-200 text-[10px] ${e.kind === 'collision' ? 'text-white/90 font-bold tracking-tight' : 'font-mono'}`}>
                   {e.message || (e.kind === 'lens_start' ? `REASONING_ENGINE_TARGET :: ${e.lens}` : "")}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Active Cursor Indicator */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-6 opacity-80">
           <div className="w-1.5 h-3 bg-[var(--cyber-cyan)] shadow-[0_0_15px_var(--cyber-cyan)] animate-pulse" />
           <div className="flex flex-col">
             <span className="text-[10px] text-[var(--cyber-cyan)] font-black uppercase tracking-[0.5em] animate-flicker">Awaiting_Neural_Load_0x2AF...</span>
             <div className="flex gap-1 mt-1 opacity-20">
                {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-1 bg-white" />)}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

