"use client";

import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RiskHeatmapProps {
  collisions: any[];
}

export default function RiskHeatmap({ collisions }: RiskHeatmapProps) {
  const categories = [
    { name: 'Liability', color: 'var(--cyber-error)' },
    { name: 'IP Rights', color: 'var(--cyber-purple)' },
    { name: 'Payment', color: 'var(--cyber-cyan)' },
    { name: 'Termination', color: 'var(--cyber-warning)' },
    { name: 'Regulatory', color: 'var(--cyber-success)' },
  ];

  // Distribute collisions into categories (mock distribution for UI)
  const getIntensity = (cat: string) => {
    const count = collisions.filter(c => c.topic?.toLowerCase().includes(cat.toLowerCase())).length;
    return Math.min(count * 20 + 10, 100);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-heading font-black text-white/40 tracking-[0.3em] uppercase">RISK_TOPOGRAPHY</span>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[var(--cyber-error)] animate-pulse shadow-[0_0_8px_var(--cyber-error)]" />
           <span className="text-[8px] font-mono text-[var(--cyber-error)] font-bold">LIVE_DENSITY</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-1.5 h-24">
        {categories.map((cat, i) => {
          const intensity = getIntensity(cat.name);
          return (
            <div key={i} className="flex flex-col gap-2 group/heat">
              <div className="flex-1 cyber-neo-inset relative overflow-hidden bg-black/40">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${intensity}%` }}
                  style={{ backgroundColor: cat.color }}
                  className="absolute bottom-0 left-0 w-full opacity-60 group-hover/heat:opacity-100 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                   <span className="text-[7px] font-mono text-white/40 font-bold">{intensity}%</span>
                </div>
              </div>
              <span className="text-[7px] font-mono text-white/30 uppercase tracking-tighter text-center truncate">{cat.name}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 space-y-2">
         <div className="flex items-center justify-between p-2 rounded-sm bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
               <ShieldAlert className="w-3 h-3 text-[var(--cyber-error)]" />
               <span className="text-[8px] font-mono text-white/60">HIGHEST_RISK:</span>
            </div>
            <span className="text-[8px] font-mono text-white font-black uppercase tracking-widest">LIABILITY_CAP</span>
         </div>
         <div className="flex items-center justify-between p-2 rounded-sm bg-white/5 border border-white/5 opacity-50">
            <div className="flex items-center gap-2">
               <CheckCircle2 className="w-3 h-3 text-[var(--cyber-success)]" />
               <span className="text-[8px] font-mono text-white/60">MITIGATED_FIELDS:</span>
            </div>
            <span className="text-[8px] font-mono text-white font-black uppercase tracking-widest">CONFIDENTIALITY</span>
         </div>
      </div>
    </div>
  );
}
