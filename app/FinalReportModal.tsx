"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Download, 
  Share2,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface FinalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    summary: string;
    riskScore: number;
    agentFindings: Array<{
      agent: string;
      level: string;
      note: string;
    }>;
    conflicts: any[];
  } | null;
}

export default function FinalReportModal({ isOpen, onClose, report }: FinalReportModalProps) {
  if (!report) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl max-h-[85vh] bg-[#050508] border border-[var(--cyber-cyan)]/20 shadow-[0_0_50px_rgba(0,242,255,0.1)] relative z-10 flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <header className="h-20 shrink-0 border-b border-white/5 bg-black/40 flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 cyber-neo-outset flex items-center justify-center border-[var(--cyber-cyan)]/20">
                   <ShieldCheck className="w-5 h-5 text-[var(--cyber-cyan)]" />
                </div>
                <div>
                   <h2 className="text-lg font-heading font-black text-white tracking-widest uppercase italic">NEURAL_AUDIT_RESUL_v4</h2>
                   <div className="flex items-center gap-2">
                     <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Hash: 0x9f2e...4a7d</span>
                     <div className="w-2 h-px bg-white/10" />
                     <span className="text-[8px] font-mono text-[var(--cyber-cyan)] uppercase tracking-[0.2em] animate-flicker">Final_Synthesis_Complete</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors border border-white/5"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </header>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
              
              {/* Executive Summary Section */}
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-4">
                  <h3 className="text-[10px] font-heading font-black text-white/40 tracking-[0.4em] uppercase">Executive_Summary</h3>
                  <div className="cyber-neo-inset p-6 bg-white/[0.02] border border-white/5">
                    <p className="text-sm text-white/80 leading-relaxed font-body">
                      {report.summary}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-heading font-black text-white/40 tracking-[0.4em] uppercase">Neural_Risk_Index</h3>
                  <div className="cyber-neo-inset p-6 bg-black/40 flex flex-col items-center justify-center gap-2 aspect-square">
                    <div className="text-4xl font-heading font-black italic tracking-tighter text-[var(--cyber-error)] glitch-hover">
                      {report.riskScore}<span className="text-sm opacity-30">/100</span>
                    </div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest text-center">Audit_Confidence: 94.2%</div>
                  </div>
                </div>
              </div>

              {/* Agent Swarm Logs */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-heading font-black text-white/40 tracking-[0.4em] uppercase">Swarm_Audit_Findings</h3>
                <div className="grid grid-cols-2 gap-4">
                  {report.agentFindings.map((finding, i) => (
                    <div key={i} className="cyber-neo-outset p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 border ${finding.level === 'CRITICAL' ? 'border-[var(--cyber-error)]/40 bg-[var(--cyber-error)]/10' : 'border-[var(--cyber-warning)]/40 bg-[var(--cyber-warning)]/10'}`}>
                         <Cpu className={`w-4 h-4 ${finding.level === 'CRITICAL' ? 'text-[var(--cyber-error)]' : 'text-[var(--cyber-warning)]'}`} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-white uppercase">{finding.agent}</span>
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <span className={`text-[8px] font-mono font-black ${finding.level==='CRITICAL' ? 'text-[var(--cyber-error)]' : 'text-[var(--cyber-warning)]'}`}>{finding.level}</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-snug">{finding.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Strategy */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-heading font-black text-white/40 tracking-[0.4em] uppercase">Rerouting_Strategy</h3>
                 <div className="cyber-neo-inset p-5 border-l-2 border-l-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/5">
                    <div className="flex items-start gap-4">
                       <TrendingUp className="w-5 h-5 text-[var(--cyber-cyan)] shrink-0 mt-1" />
                       <div className="space-y-4">
                          <p className="text-sm font-bold text-white italic">The neural network recommends a 12% shift in Indemnity liability to reach equilibrium.</p>
                          <ul className="space-y-2">
                             {[
                               'Mitigate Section 4.2: Mutualize limitation of liability to 2x Annual Fees.',
                               'Enforce Section 7.1: Align IP assignment with Master Services Framework.',
                               'Inject Arbitration Clause: Reroute legal conflicts to JAMS expedited protocol.'
                             ].map((step, i) => (
                               <li key={i} className="flex items-center gap-3 text-xs text-white/50">
                                  <ChevronRight className="w-3 h-3 text-[var(--cyber-cyan)]" />
                                  {step}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <footer className="h-20 shrink-0 border-t border-white/5 bg-black/60 flex items-center justify-between px-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <Download className="w-4 h-4 text-white/30" />
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Export_Audit_Doc</span>
                </div>
                <div className="flex items-center gap-2">
                   <Share2 className="w-4 h-4 text-white/30" />
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Relay_to_Counsel</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="cyber-button text-[var(--cyber-cyan)] px-8"
              >
                CLOSE_PROTOCOL
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
