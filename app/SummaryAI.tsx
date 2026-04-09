"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Cpu, Zap, Activity, Info } from "lucide-react";

interface SummaryAIProps {
  isStreaming: boolean;
  collisions: any[];
}

export default function SummaryAI({ isStreaming, collisions }: SummaryAIProps) {
  const criticalCount = collisions.filter(c => c.level === 'CRITICAL').length;
  const warningCount = collisions.filter(c => c.level === 'WARNING').length;

  const getDynamicInsight = () => {
    if (!isStreaming && collisions.length === 0) return "AWAITING_INGESTION_FOR_NEURAL_SYNTHESIS";
    if (criticalCount > 2) return "DETECTED_HIGH_RISK_INDEMNITY_CONFLICTS: RECOM_BRIDGE_RECONCILIATION_REQUIRED";
    if (warningCount > 3) return "MODERATE_DETERRENCE_IN_TERMINATION_CLAUSES: REVIEW_MARKET_COMPLIANCE_DELTA";
    return "NEURAL_ANALYSIS_STABLE: LOW_COLLISION_DENSITY_DETECTED_IN_SOURCE_ARRAY";
  };

  return (
    <div className="cyber-neo-outset p-6 bg-[#060608]/90 overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
         <BrainCircuit className="w-16 h-16 text-[var(--cyber-cyan)]" />
      </div>

      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 shrink-0">
         <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-[var(--cyber-cyan)] animate-flicker" />
            <h3 className="hud-label tracking-[0.4em]">NEURAL_SYNTH_ENGINE</h3>
         </div>
         <div className="flex items-center gap-2">
            <Zap className={`w-3 h-3 text-[var(--cyber-cyan)] ${isStreaming ? 'animate-bounce' : 'opacity-20'}`} />
            <span className="text-[7px] font-mono text-white/40 uppercase tracking-[0.2em] font-black">AI_MODEL: PROXIMA_V4</span>
         </div>
      </div>

      <div className="space-y-4">
         <p className="text-[11px] font-heading font-black text-white/90 italic tracking-[0.05em] leading-relaxed relative z-10 min-h-[40px]">
            {getDynamicInsight()}
         </p>

         <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col gap-1 p-2 rounded-sm bg-black/40 border border-white/5">
                <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">CRITICAL_CONFLICTS</span>
                <div className="flex items-center justify-between">
                   <span className={`text-[12px] font-mono font-black ${criticalCount > 0 ? 'text-[var(--cyber-error)] cyber-glow-red' : 'text-white/20'}`}>{criticalCount}</span>
                   <Activity className="w-3 h-3 text-[var(--cyber-error)]/40" />
                </div>
            </div>
            <div className="flex flex-col gap-1 p-2 rounded-sm bg-black/40 border border-white/5">
                <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">MODERATE_WARNINGS</span>
                <div className="flex items-center justify-between">
                   <span className={`text-[12px] font-mono font-black ${warningCount > 0 ? 'text-[var(--cyber-warning)] cyber-glow-yellow' : 'text-white/20'}`}>{warningCount}</span>
                   <Info className="w-3 h-3 text-[var(--cyber-warning)]/40" />
                </div>
            </div>
         </div>

         {isStreaming && (
            <div className="flex items-center gap-4 mt-4">
               <div className="flex-1 h-px bg-white/5 relative overflow-hidden">
                  <motion.div 
                    initial={{ x: -100 }}
                    animate={{ x: 100 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-[var(--cyber-cyan)] to-transparent"
                  />
               </div>
               <span className="text-[8px] font-mono text-[var(--cyber-cyan)] animate-pulse tracking-widest">STREAMING_REALTIME_REASONING...</span>
            </div>
         )}
      </div>
    </div>
  );
}
