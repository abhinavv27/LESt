"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck, Zap, Copy } from "lucide-react";
import { AgentEvent } from "./useAgentStream";

interface ClauseInspectorProps {
  collision: AgentEvent | null;
  onClose: () => void;
}

export default function ClauseInspector({ collision, onClose }: ClauseInspectorProps) {
  if (!collision) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute inset-y-0 right-0 w-[500px] z-[100] bg-[#020205] border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <div className="noise-overlay opacity-20" />
        <div className="cyber-grid opacity-5" />
        
        {/* Header */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--cyber-cyan)] tracking-[0.3em] font-black uppercase">
              DEEP_CLAUSE_INSPECTION
            </span>
            <span className="text-[12px] font-heading font-black text-white uppercase tracking-widest mt-1">
              {collision.topic}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 cyber-neo-outset flex items-center justify-center hover:text-[var(--cyber-error)] transition-colors group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar relative z-10">
          
          {/* Source Analysis */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[var(--cyber-cyan)]" />
                <h4 className="text-[10px] font-mono font-black text-white/60 tracking-widest uppercase">BASELINE_01 (SRC_A)</h4>
              </div>
              <div className="cyber-neo-inset p-5 bg-white/[0.02] border-l-2 border-l-[var(--cyber-cyan)]">
                <p className="text-[13px] leading-relaxed font-body text-white/80 italic font-medium">
                  "{collision.src_a || "No source text available for this segment."}"
                </p>
              </div>
            </div>

            <div className="flex justify-center py-2">
              <div className="w-10 h-10 rounded-full cyber-neo-outset flex items-center justify-center">
                 <Zap className="w-4 h-4 text-[var(--cyber-magenta)] animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[var(--cyber-magenta)]" />
                <h4 className="text-[10px] font-mono font-black text-white/60 tracking-widest uppercase">CONTRAST_01 (SRC_B)</h4>
              </div>
              <div className="cyber-neo-inset p-5 bg-white/[0.02] border-l-2 border-l-[var(--cyber-magenta)]">
                <p className="text-[13px] leading-relaxed font-body text-white/80 italic font-medium">
                   "{collision.src_b || "No source text available for this segment."}"
                </p>
              </div>
            </div>
          </div>

          {/* Neural Bridge Recommendation */}
          <div className="space-y-6 pt-10 border-t border-white/5">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-[var(--cyber-success)]" />
                   <h4 className="text-[11px] font-heading font-black text-[var(--cyber-success)] tracking-[0.4em] uppercase">NEURAL_BRIDGE_RECO</h4>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-mono text-white/40 hover:text-white transition-colors">
                   <Copy className="w-3 h-3" />
                   <span>COPY_TO_CLIPBOARD</span>
                </button>
             </div>

             <div className="cyber-neo-outset p-6 bg-[var(--cyber-success)]/10 border-[var(--cyber-success)]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                   <ShieldCheck className="w-16 h-16" />
                </div>
                <p className="text-[14px] leading-relaxed font-heading font-bold text-white tracking-wide">
                   {collision.reconciled || "Generative engine analyzing feasible reconciliation..."}
                </p>
                
                <div className="mt-8 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Confidence</span>
                         <span className="text-[11px] font-mono text-[var(--cyber-success)] font-black">94.8%</span>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="flex flex-col">
                         <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Risk Level</span>
                         <span className="text-[11px] font-mono text-[var(--cyber-success)] font-black">MINIMAL</span>
                      </div>
                   </div>
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="px-6 py-2 bg-[var(--cyber-success)] text-black font-heading font-black text-[10px] tracking-widest uppercase hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all"
                   >
                     ADOPT_BRIDGE
                   </motion.button>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="h-16 border-t border-white/5 bg-black/40 flex items-center px-8 justify-between">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                 <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">Delta Score</span>
                 <span className="text-[11px] font-mono text-[var(--cyber-magenta)] font-black">Δ_{collision.delta_score}</span>
              </div>
           </div>
           <div className="text-[9px] font-mono text-white/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-success)] shadow-[0_0_8px_var(--cyber-success)]" />
              <span>ENCRYPTED_LINK_ACTIVE</span>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
