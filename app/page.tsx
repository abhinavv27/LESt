"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Database, 
  Activity, 
  Network, 
  Layers, 
  Cpu, 
  Terminal,
  Fingerprint,
  FileText,
  ShieldAlert,
  ArrowRight,
  Info,
  Box,
  FileCheck,
  Binary
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStream, AgentMetadata, AgentEvent } from './useAgentStream';
import ConflictScene from './ConflictScene';
import RiskHeatmap from './RiskHeatmap';
import SummaryAI from './SummaryAI';
import { InputPanel } from './InputPanel';
import FinalReportModal from './FinalReportModal';

// Memoize Three.js scene to prevent unnecessary re-renders
const MemoizedConflictScene = React.memo(ConflictScene);

// Cyber HUD Overlay
const CyberOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    <div className="absolute top-0 left-0 w-full h-px bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
    <div className="absolute bottom-0 left-0 w-full h-px bg-white/5" />
    <div className="absolute top-0 left-0 h-full w-px bg-white/5" />
    <div className="absolute top-0 right-0 h-full w-px bg-white/5" />
  </div>
);

const HandshakeOverlay = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center overflow-hidden"
  >
    <div className="relative flex flex-col items-center">
      <div className="w-64 h-64 relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-[var(--cyber-cyan)]/20 rounded-full" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border border-dashed border-[var(--cyber-purple)]/30 rounded-full" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Fingerprint className="w-16 h-16 text-[var(--cyber-cyan)] animate-pulse" />
        </div>
      </div>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <div className="text-[10px] font-heading font-black text-white tracking-[0.6em] uppercase italic">Initializing_Neural_Core</div>
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                height: [4, 12, 4],
                backgroundColor: ['#00f2ff33', '#00f2ff', '#00f2ff33']
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.1 
              }}
              className="w-1 bg-[var(--cyber-cyan)]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const HUD_Metric = ({ label, value, color, icon: Icon, trend }: any) => (
  <div className="cyber-neo-outset p-4 bg-black/40 border border-white/5 flex flex-col gap-2 group transition-all hover:bg-white/[0.03]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`w-3 h-3 text-${color} opacity-40 group-hover:opacity-100 transition-opacity`} />
        <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] font-black group-hover:text-white/60">{label}</span>
      </div>
      {trend && <span className="text-[8px] font-mono text-emerald-400/60">+{trend}%</span>}
    </div>
    <div className="text-xl font-heading font-black text-white italic tracking-tighter group-active:scale-95 transition-transform">{value}</div>
  </div>
);

// New SwarmHUD Component
const SwarmHUD = ({ currentAgent, isStreaming, isHandshaking }: { currentAgent: any | null, isStreaming: boolean, isHandshaking: boolean }) => (
  <div className="cyber-neo-outset p-6 bg-[#000a0f44] border border-[#00f2ff22] relative overflow-hidden">
    {(isStreaming || isHandshaking) && (
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent animate-scan" />
    )}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#00f2ff] animate-pulse shadow-[0_0_10px_#00f2ff]' : isHandshaking ? 'bg-amber-400 animate-pulse' : 'bg-white/10'}`} />
        <h3 className="text-[10px] font-heading font-black text-[#00f2ff88] tracking-[0.3em] uppercase">{isHandshaking ? 'NEURAL_HANDSHAKE' : 'Active_Swarm_Node'}</h3>
      </div>
      <div className="text-[9px] font-mono text-white/20">AGENT_ID: {currentAgent?.agentId || "N/A"}</div>
    </div>

    <AnimatePresence mode="wait">
      {currentAgent ? (
        <motion.div 
          key={currentAgent.agentId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 cyber-neo-inset flex items-center justify-center bg-black border border-[#00f2ff44]">
              <Cpu className="w-6 h-6 text-[#00f2ff] animate-flicker" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white italic tracking-tighter hover:cyber-glow-cyan transition-all">
                {currentAgent.agentName?.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono text-[#00f2ff] mt-1 tracking-widest opacity-70 uppercase">
                {currentAgent.agentRole}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="cyber-neo-inset p-2 bg-black/40">
              <div className="text-[7px] text-white/30 uppercase tracking-widest mb-1">Status</div>
              <div className="text-[9px] text-[#00f2ff] font-bold">ENGAGED</div>
            </div>
            <div className="cyber-neo-inset p-2 bg-black/40">
              <div className="text-[7px] text-white/30 uppercase tracking-widest mb-1">Load</div>
              <div className="text-[9px] text-[#00f2ff] font-bold">88.4%</div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-sm">
          <Database className="w-6 h-6 text-white/5 mb-3" />
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] italic">Waiting for Neural Ingestion...</span>
        </div>
      )}
    </AnimatePresence>
  </div>
);

const LiveTerminal = ({ logs }: { logs: any[] }) => (
  <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1 custom-scrollbar scroll-smooth">
    {logs?.map((log, i) => (
      <div key={i} className="flex gap-4 opacity-80 hover:opacity-100 transition-opacity">
        <span className="text-white/20">[{new Date(log.ts).toLocaleTimeString()}]</span>
        <span className="text-[var(--cyber-cyan)]">{log.message || log.kind.toUpperCase()}</span>
      </div>
    ))}
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('INGEST');
  const [selectedLens, setSelectedLens] = useState('LIABILITY');
  const [selectedLenses, setSelectedLenses] = useState(['LIABILITY', 'IP', 'PAYMENT']);
  const [docA, setDocA] = useState<File | null>(null);
  const [docB, setDocB] = useState<File | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [selectedCollision, setSelectedCollision] = useState<any>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const { state, startStream, simulateStream } = useAgentStream({
    onFinalReport: (report) => {
      setFinalReport(report);
      setShowFinalReport(true);
    }
  });

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReport(true);
    }, 2500);
  };

  const toggleLens = (name: string) => {
    setSelectedLenses(prev => 
      prev.includes(name) ? prev.filter(l => l !== name) : [...prev, name]
    );
  };

  return (
    <main ref={containerRef} className="h-screen bg-[var(--background)] text-[var(--foreground)] font-body overflow-hidden selection:bg-[var(--cyber-cyan)]/30 relative flex flex-col hud-scanline">
      <AnimatePresence>
        {state.isHandshaking && <HandshakeOverlay />}
      </AnimatePresence>
      <CyberOverlay />
      {/* Texture & Grid HUD Layers */}
      <div className="cyber-grid" />
      <div className="noise-overlay" />
      <div className="scanning-line" />
      
      {/* Floating HUD Background Elements */}
      <div className="absolute top-[15%] left-[5%] text-[8px] font-mono text-white/5 uppercase tracking-[1em] vertical-rl select-none pointer-events-none">NEURAL_LEX_INFRASTRUCTURE</div>
      <div className="absolute bottom-[10%] right-[3%] text-[8px] font-mono text-white/5 uppercase tracking-[0.5em] select-none pointer-events-none">CODE_AUTH_SIG: 0x9F2E4A7D</div>

      {/* Top HUD Nav */}
      <header className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-8 relative z-50 bg-[#020204]/60 backdrop-blur-3xl">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 group cursor-pointer relative">
            <div className="w-11 h-11 cyber-neo-outset flex items-center justify-center border-[var(--cyber-cyan)]/20 active:scale-95 transition-all">
               <Fingerprint className="w-6 h-6 text-[var(--cyber-cyan)] animate-flicker" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-heading font-black tracking-tighter leading-none text-white italic glitch-hover">
                LEX<span className="text-[var(--cyber-cyan)]">.</span>CONTRAST
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1 h-3 bg-[var(--cyber-cyan)]" />
                <span className="text-[8px] font-mono text-[var(--cyber-cyan)]/60 uppercase tracking-[0.5em] font-bold">ALPHA_BUILD.v4.2</span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: 'INGEST', icon: Database },
              { label: 'MAP', icon: Network },
              { label: 'COLLISION', icon: ShieldAlert },
              { label: 'REPORT', icon: FileText }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group/nav cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                <item.icon className="w-3.5 h-3.5 text-white group-hover/nav:text-[var(--cyber-cyan)] transition-colors" />
                <span className="text-[10px] font-heading text-white group-hover/nav:cyber-glow-cyan transition-all tracking-[0.25em]">
                  {item.label}
                </span>
                <div className="w-1 h-1 rounded-full bg-white/10 group-hover/nav:bg-[var(--cyber-cyan)]" />
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-10">
           <div className="hidden xl:flex items-center gap-6 px-6 border-x border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] font-black">CURRENT_SUPERVISOR</span>
                <span className="text-[10px] font-heading font-black text-white italic tracking-widest">CORE_CORTEX.v8</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-[var(--cyber-cyan)]/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--cyber-cyan)]/5 animate-pulse" />
                <Fingerprint className="w-5 h-5 text-[var(--cyber-cyan)]/40" />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => simulateStream()}
                className="text-[10px] font-mono text-white/40 hover:text-[var(--cyber-cyan)] transition-colors tracking-widest uppercase py-2 px-4 cyber-neo-outset border-none"
              >
                [ SIM_DEMO ]
              </button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startStream(docA, docB)}
                disabled={state.isStreaming || state.isHandshaking || !docA || !docB}
                className={`cyber-button ${
                  state.isStreaming || state.isHandshaking || (!docA || !docB)
                  ? 'opacity-20 grayscale cursor-not-allowed' 
                  : 'text-[var(--cyber-cyan)]'
                }`}
              >
                {(state.isStreaming || state.isHandshaking) && <div className="absolute inset-0 bg-[var(--cyber-cyan)]/10 animate-pulse" />}
                <div className="flex items-center gap-3 relative z-10">
                  <Zap className={`w-4 h-4 ${(state.isStreaming || state.isHandshaking) ? 'animate-bounce' : ''}`} />
                  <span>{state.isHandshaking ? "AUTHENTICATING..." : state.isStreaming ? "PROCESSING_STREAM" : "RUN_NEURAL_AUDIT"}</span>
                </div>
              </motion.button>
           </div>
        </div>
      </header>
  
      {/* Main Workspace - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6 relative">
        
        {/* Left Aside: Unified Control Hub */}
        <aside className="w-[340px] shrink-0 flex flex-col gap-6 relative z-10">
          <div className="cyber-neo-outset p-2 flex gap-1 shrink-0 bg-black/40 border border-white/5">
             <button 
               onClick={() => setActiveTab('INGEST')}
               className={`flex-1 py-3 text-[9px] font-heading font-black tracking-widest transition-all ${activeTab === 'INGEST' ? 'bg-[var(--cyber-cyan)] text-black slant' : 'text-white/40 border border-transparent'}`}
             >
                INGESTION_X
             </button>
             <button 
               onClick={() => setActiveTab('STRATEGY')}
               className={`flex-1 py-3 text-[9px] font-heading font-black tracking-widest transition-all ${activeTab === 'STRATEGY' ? 'bg-[var(--cyber-purple)] text-black slant' : 'text-white/40 border border-transparent'}`}
             >
                STRATEGY_MAP
             </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-8 pr-1">
            <AnimatePresence mode="wait">
              {activeTab === 'INGEST' ? (
                <motion.div 
                  key="ingest"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="cyber-neo-outset p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <Binary className="w-4 h-4 text-[var(--cyber-cyan)]" />
                        <h2 className="text-[10px] font-heading font-black text-white/80 tracking-[0.4em]">SOURCE_CONTROL</h2>
                      </div>
                      <Database className="w-4 h-4 text-white/20" />
                    </div>
                    <InputPanel 
                      onDocA={setDocA} 
                      onDocB={setDocB} 
                      docA={docA} 
                      docB={docB} 
                      isStreaming={state.isStreaming || state.isHandshaking}
                      isComplete={state.isComplete}
                    />
                  </div>

                  <SwarmHUD currentAgent={state.currentAgent} isStreaming={state.isStreaming} isHandshaking={state.isHandshaking} />

                  <div className="cyber-neo-outset p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-4 h-4 text-white/40" />
                      <h2 className="text-[10px] font-heading font-black text-white/60 tracking-[0.4em]">RECENT_AUDITS</h2>
                    </div>
                    {['#ID_883-921', '#ID_741-002'].map((id, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-white/40 group-hover:text-[var(--cyber-cyan)]">{id}</span>
                          <span className="text-[8px] font-mono text-white/10 italic">2026-04-0{5-i}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`text-[8px] font-mono font-bold ${i===0 ? 'text-[var(--cyber-error)]' : 'text-[var(--cyber-success)]'}`}>
                              HEALTH: {100-i*8}/100
                           </span>
                           <ArrowRight className="w-3 h-3 text-white/10 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="strategy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="cyber-neo-outset p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                      <Network className="w-4 h-4 text-[var(--cyber-purple)]" />
                      <h2 className="text-[10px] font-heading font-black text-white/80 tracking-[0.4em]">RESISTANCE_LENSES</h2>
                    </div>

                    <div className="space-y-3">
                      {[
                        { n: 'LIABILITY', color: 'cyber-error', g: '01' },
                        { n: 'IP', color: 'cyber-cyan', g: '02' },
                        { n: 'TERMINATION', color: 'cyber-warning', g: '03' },
                        { n: 'PAYMENT', color: 'cyber-purple', g: '04' },
                        { n: 'DATA', color: 'cyber-blue', g: '05' }
                      ].map((lens) => (
                        <motion.div 
                          key={lens.n}
                          whileHover={{ x: 4 }}
                          className={`group flex items-center gap-4 p-3 border border-white/5 cursor-pointer transition-all ${
                            selectedLenses.includes(lens.n) 
                            ? 'bg-white/[0.03] border-white/10' 
                            : 'bg-transparent border-transparent'
                          }`}
                          onClick={() => toggleLens(lens.n)}
                        >
                          <span className="text-[8px] font-mono text-white/20 font-bold">{lens.g}</span>
                          <div className={`w-3.5 h-3.5 rounded-sm border-2 border-[var(--${lens.color})]/30 flex items-center justify-center transition-all group-hover:border-[var(--${lens.color})]`}>
                             <div className={`w-1.5 h-1.5 bg-[var(--${lens.color})] shadow-[0_0_10px_var(--${lens.color})] transition-all duration-300 ${selectedLenses.includes(lens.n) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                          </div>
                          <span className={`text-[9px] font-heading tracking-[0.2em] ${selectedLenses.includes(lens.n) ? 'text-white' : 'text-white/30'} transition-colors`}>{lens.n}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <RiskHeatmap collisions={state.collisions} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 bg-black/20 -mx-6 -mb-6 p-6">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em] font-bold">SYSTEM_REASONING_LOAD</span>
                          <span className="text-[9px] font-mono text-[var(--cyber-cyan)] font-black">{(state.avgIntensity * 88 + 12).toFixed(0)}%</span>
                        </div>
                        <div className="cyber-neo-inset h-1.5 p-[1px] overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(state.avgIntensity * 88 + 12)}%` }}
                            className="h-full bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-blue)] shadow-[0_0_15px_rgba(0,240,255,0.4)]" 
                           />
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Center: Intelligence Viewport */}
        <section className="flex-1 flex flex-col gap-6 min-w-0 relative">
          <div className={`h-[45%] cyber-neo-outset relative overflow-hidden group ${state.isStreaming ? 'box-glow-pulse' : ''}`}>
            <div className="cyber-corners opacity-30 group-hover:opacity-100 transition-opacity" />
            <div className="scanning-line opacity-10" />
            
            {/* Viewport HUD UI */}
            <div className="absolute top-4 left-6 z-20 flex flex-col gap-1.5">
              <span className="text-[10px] font-heading font-black text-white italic tracking-[0.4em] cyber-glow-cyan animate-flicker">NEURAL_MAP</span>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                   {[...Array(4)].map((_, i) => <div key={i} className="w-0.5 h-2 bg-[var(--cyber-cyan)]/40" />)}
                </div>
                <span className="text-[7px] font-mono text-[var(--cyber-cyan)]/60 uppercase tracking-[0.3em] font-bold italic animate-pulse">
                  {state.isStreaming ? "PROCESSING_NEURAL_STREAM" : "AWAITING_INPUT"}
                </span>
              </div>
            </div>

            <div className="absolute top-16 right-8 z-20 flex gap-4">
               <div className="cyber-neo-inset px-3 py-1 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${state.isColliding ? 'bg-[var(--cyber-error)]' : 'bg-white/10'} animate-pulse`} />
                  <span className="text-[8px] font-mono text-white/60 font-bold">DETECTION_LEVEL: {state.isColliding ? "CRIT" : "NOMINAL"}</span>
               </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <MemoizedConflictScene 
                intensity={state.isColliding ? 1.2 : 0.2} 
                avgIntensity={state.avgIntensity} 
                isColliding={state.isColliding} 
                currentAgentId={state.currentAgent?.agentId}
                isStreaming={state.isStreaming || state.isHandshaking}
              />
            </div>

            {/* Crosshair Viewport Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/[0.03] m-10">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-[var(--cyber-cyan)]/20" />
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-px bg-[var(--cyber-cyan)]/20" />
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-20 bg-[var(--cyber-cyan)]/20" />
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-20 bg-[var(--cyber-cyan)]/20" />
               
               {/* Fixed Scale Ticks */}
               <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--cyber-cyan)]/40" />
               <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--cyber-cyan)]/40" />
               <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--cyber-cyan)]/40" />
               <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--cyber-cyan)]/40" />
            </div>

            <div className="absolute bottom-6 left-8 flex gap-8 z-20">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest font-black">COORD.X</span>
                <span className="text-[11px] font-mono text-[var(--cyber-cyan)] tabular-nums font-black">34.921.002</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest font-black">COORD.Y</span>
                <span className="text-[11px] font-mono text-[var(--cyber-cyan)] tabular-nums font-black">99.124.871</span>
              </div>
            </div>

             <div className="absolute bottom-6 right-8 z-20">
               <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">ACTIVE_NODE:</span>
                  <span className="text-[10px] font-mono text-[var(--cyber-cyan)] font-black italic uppercase">
                    {state.currentAgent?.agentName || "READY"}
                  </span>
                  <div className="w-px h-3 bg-white/10 mx-1" />
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">RES_COEFF:</span>
                  <span className="text-[10px] font-mono text-white font-black">λ_{(state.avgIntensity * 0.9 + 0.1).toFixed(4)}</span>
               </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative min-h-0 cyber-neo-outset overflow-hidden bg-black/40">
            <div className="h-8 border-b border-white/5 flex items-center px-4 justify-between bg-black/20">
               <div className="flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-[var(--cyber-cyan)]" />
                  <span className="text-[9px] font-heading text-white/40 tracking-widest uppercase">LIVE_KERNEL_LOGS</span>
               </div>
               <div className="flex gap-1.5 opacity-20">
                  <div className="w-2 h-2 rounded-full border border-white/30" />
                  <div className="w-2 h-2 rounded-full border border-white/30" />
               </div>
            </div>
            <LiveTerminal logs={state.events.slice(-60)} />
          </div>
        </section>

        {/* Right Aside: Triage HUD */}
        <aside className="w-[400px] shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar relative z-10">
           
           <div className="grid grid-cols-2 gap-4 shrink-0">
              <HUD_Metric label="NEURAL_STRENGTH" value={`${(state.avgIntensity * 100).toFixed(1)}%`} color="cyber-cyan" icon={Cpu} trend="4.2" />
              <HUD_Metric label="COLLISION_PROB" value={state.orbIntensity.toFixed(3)} color="cyber-error" icon={Activity} />
              <HUD_Metric label="MARKET_COMPLIANCE" value={`${(88 - state.avgIntensity * 20).toFixed(1)}%`} color="cyber-success" icon={ShieldAlert} />
              <HUD_Metric label="AGENT_CONFIDENCE" value={`${(92.4 + state.avgIntensity * 5).toFixed(1)}%`} color="cyber-purple" icon={Activity} />
           </div>

           <SummaryAI isStreaming={state.isStreaming} collisions={state.collisions} />

           <section className="flex-1 cyber-neo-outset p-8 flex flex-col gap-6 relative min-h-0 bg-[#040406]/80 overflow-hidden">
              <div className="cyber-corners opacity-20" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-6 shrink-0 h-10">
                 <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${state.isColliding ? 'bg-[var(--cyber-error)] shadow-[0_0_15px_var(--cyber-error)] animate-ping' : 'bg-white/10'}`} />
                    <h3 className="hud-label tracking-[0.3em]">TRIAGE_QUEUE</h3>
                 </div>
                <AnimatePresence>
                  {state.collisions?.length > 0 && (
                    <motion.div 
                      key="alerts"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[9px] font-mono font-black text-[var(--cyber-error)] flex items-center gap-2"
                    >
                      <span className="animate-flicker">ALERTS: {state.collisions.length}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout" initial={false}>
                  {state.collisions.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 0.3 }} 
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center py-20 grayscale opacity-20"
                    >
                       <Info className="w-12 h-12 mb-6 text-[var(--cyber-cyan)] animate-pulse" />
                       <div className="text-[10px] font-heading tracking-[0.8em] font-black opacity-50 uppercase">AWAITING_INGESTION</div>
                    </motion.div>
                  ) : (
                    [...state.collisions].reverse().map((c, i) => (
                      <motion.div 
                        key={(c?.topic || 'collision') + i} 
                        initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }} 
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        className="group"
                      >
                         <div className={`cyber-neo-inset p-5 hover:bg-white/[0.02] transition-all cursor-pointer border-l-2 ${
                            c.level === 'CRITICAL' ? 'border-l-[var(--cyber-error)]' : 'border-l-[var(--cyber-warning)]'
                         }`}>
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className={`text-[8px] font-heading font-black px-2 py-0.5 rounded-sm ${
                                  c.level === 'CRITICAL' ? 'bg-[var(--cyber-error)]/20 text-[var(--cyber-error)]' : 'bg-[var(--cyber-warning)]/20 text-[var(--cyber-warning)]'
                                }`}>
                                  {c.level}
                                </span>
                                <span className="text-[8px] font-mono text-white/30 font-bold uppercase tracking-widest">{c.lens}</span>
                              </div>
                              <span className="text-[11px] font-mono font-black text-white tabular-nums tracking-tighter">Δ_{c.delta_score}</span>
                           </div>
                           <h4 className="text-[11px] font-heading font-black text-white tracking-[0.15em] mb-4 leading-relaxed group-hover:text-[var(--cyber-cyan)] transition-colors">{c.topic}</h4>
                           <div onClick={() => setSelectedCollision(c)} className="cursor-pointer">
                             <div className="flex items-center gap-3 bg-black/40 p-2 border border-white/5">
                                <div className="flex-1 h-1.5 cyber-neo-inset overflow-hidden p-[1px]">
                                   <div className="h-full bg-white/10 w-full" />
                                </div>
                                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">DETAILS_RX</span>
                             </div>
                           </div>
                         </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
           </section>
        </aside>
      </div>

      {/* Persistence Data Bar */}
      <footer className="h-8 shrink-0 border-t border-white/5 bg-[#020204]/80 backdrop-blur-md px-8 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <Box className="w-3 h-3 text-[var(--cyber-cyan)]" />
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">Neural_Persistence: <span className="text-white/60">ACTIVE</span></span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">Sync_Status: <span className="text-white/60">ENCRYPTED</span></span>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">© 2026 LEX.CONTRAST LABORATORIES // SWARM_LOGIC_V4</span>
           <div className="flex gap-1">
              {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-1 bg-[var(--cyber-cyan)]/20" />)}
           </div>
        </div>
      </footer>

      {finalReport && (
        <FinalReportModal 
          isOpen={showFinalReport} 
          onClose={() => setShowFinalReport(false)} 
          report={finalReport} 
        />
      )}
    </main>
  );
}
