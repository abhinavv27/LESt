"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useAgentStream } from "./useAgentStream";
import LiveTerminal from "./LiveTerminal";
import {
  ChevronDown, Shield, Zap, TrendingUp,
  Play, Square, AlertTriangle
} from "lucide-react";

// Dynamically import Three.js scene (SSR-off)
const ConflictScene = dynamic(() => import("./ConflictScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

// ── FAQ data ─────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "How does the Semantic Aligner handle disparate document structures?",
    a: "We use a custom vector-space mapping with a shared embedding bottleneck (FAISS + BAAI/bge-large-en-v1.5). This aligns 'Indemnity' in a 100-page MSA with 'Liability' in a 50-page lease based on thematic intent, not section labels."
  },
  {
    q: "What is the F1-score for Legal Entity Recognition?",
    a: "Our fine-tuned LLaMA-7B (LoRA, 4-bit quantized) achieves 87% F1 on legal benchmarks — +23 points over the base model on complex jurisdictional overlaps."
  },
  {
    q: "How does the live streaming work?",
    a: "Each stage of the agent pipeline yields structured JSON events. FastAPI forwards them via Server-Sent Events (SSE). The browser consumes the stream and drives both the terminal UI and the Three.js orb in real-time — zero polling, pure push."
  },
  {
    q: "Can this integrate with CLM platforms?",
    a: "Yes. The FastAPI bridge is API-first. We support Ironclad, PandaDoc, and DocuSign webhooks. The SSE stream can also be consumed by any dashboard or Slack alert system."
  }
];

// ── Metrics ────────────────────────────────────────────────────────
const METRICS = [
  { icon: Zap,         value: "100+",  unit: "pages/sec", label: "Parse Throughput" },
  { icon: Shield,      value: "87%",   unit: "F1",        label: "Legal NER Score"  },
  { icon: TrendingUp,  value: "40%",   unit: "faster",    label: "Time Efficiency"  },
];

// ── Main Page ─────────────────────────────────────────────────────
export default function LexContrastLanding() {
  const container = useRef<HTMLDivElement>(null!);
  const { state, startStream, stopStream } = useAgentStream();

  useGSAP(() => {
    // Stripe-style scroll progress bar
    gsap.to("#scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { scrub: 0.3 },
    });

    // Hero word-blur assembly
    gsap.from(".hero-word", {
      opacity: 0,
      filter: "blur(16px)",
      yPercent: 12,
      stagger: 0.12,
      duration: 1.6,
      ease: "power4.out",
    });

    // Section reveals (AOS-style)
    gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Metric counters stagger
    gsap.from(".metric-card", {
      opacity: 0,
      scale: 0.88,
      stagger: 0.12,
      duration: 0.9,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: ".metrics-row",
        start: "top 80%",
      },
    });
  }, { scope: container });

  return (
    <main
      ref={container}
      className="relative bg-lex-dark text-foreground min-h-screen"
    >
      {/* ── 3D Orb (reactive to SSE delta events) ─────────────── */}
      <ConflictScene
        intensity={state.orbIntensity}
        isColliding={state.isColliding}
      />

      {/* ═══════════════════ HERO ═════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <p className="font-mono text-xs tracking-[0.5em] text-lex-gold/60 mb-8 uppercase">
          Multi-Agent Legal Intelligence
        </p>

        <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-display font-medium text-center tracking-tighter leading-[0.9] mb-10">
          <span className="hero-word block title-shine">LEX</span>
          <span className="hero-word block">CONTRAST</span>
        </h1>

        <p className="hero-word font-editorial text-xl md:text-2xl text-white/60 text-center max-w-xl leading-relaxed">
          Agentic contract analysis that finds what you missed.
        </p>

        {/* CTA — triggers the live stream */}
        <div className="hero-word flex flex-col sm:flex-row items-center gap-4 mt-12">
          <button
            id="btn-run"
            onClick={startStream}
            disabled={state.isStreaming}
            className="flex items-center gap-3 px-8 py-4 bg-lex-gold text-lex-dark font-display font-bold rounded-full hover:bg-lex-cyan hover:text-lex-dark transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play size={18} />
            {state.isStreaming ? "Analyzing…" : "Run Live Demo"}
          </button>

          {state.isStreaming && (
            <button
              onClick={stopStream}
              className="flex items-center gap-2 px-6 py-4 border border-red-500/40 text-red-400 font-display rounded-full hover:bg-red-500/10 transition-all"
            >
              <Square size={14} />
              Stop
            </button>
          )}
        </div>

        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown className="text-lex-gold/50" size={28} />
        </div>
      </section>

      {/* ═══════════════════ LIVE DEMO SECTION ═══════════════════ */}
      <section className="reveal-section py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-display">
            Live Agent Stream
          </h2>
          {state.isColliding && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 animate-pulse">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-red-400 font-mono text-xs">COLLISION DETECTED</span>
            </div>
          )}
        </div>

        <LiveTerminal
          events={state.events}
          isStreaming={state.isStreaming}
          isComplete={state.isComplete}
          collisions={state.collisions}
        />

        {/* Collision summary cards */}
        {state.collisions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.collisions.slice(-6).map((c, i) => {
              const borderColor =
                c.level === "CRITICAL" ? "border-red-500/40" :
                c.level === "HIGH"     ? "border-orange-500/30" :
                                         "border-yellow-500/20";
              const textColor =
                c.level === "CRITICAL" ? "text-red-400" :
                c.level === "HIGH"     ? "text-orange-400" :
                                         "text-yellow-400";
              return (
                <div key={i} className={`glass-card rounded-xl p-4 border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-white/40">{c.lens}</span>
                    <span className={`font-mono text-xs ${textColor} font-bold`}>{c.level}</span>
                  </div>
                  <p className="font-editorial text-sm text-white/70">{c.topic}</p>
                  <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500`}
                      style={{
                        width: `${(c.delta_score ?? 0) * 100}%`,
                        background: c.level === "CRITICAL" ? "#FF4D4D" : "#C6A059",
                      }}
                    />
                  </div>
                  <p className="font-mono text-xs text-white/30 mt-1">
                    Δ {c.delta_score?.toFixed(2)} · {((c.confidence ?? 0) * 100).toFixed(0)}% conf
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════ METRICS ══════════════════════════════ */}
      <section className="reveal-section py-24 px-6 max-w-7xl mx-auto metrics-row">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {METRICS.map(({ icon: Icon, value, unit, label }, i) => (
            <div key={i} className="metric-card glass-card p-10 rounded-2xl flex flex-col items-center text-center">
              <Icon className="text-lex-cyan mb-4" size={36} />
              <h3 className="font-display text-5xl leading-none mb-1">
                {value}
                <span className="text-lex-gold text-2xl ml-1">{unit}</span>
              </h3>
              <p className="font-editorial text-lex-gold/80 text-lg mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ════════════════════════ */}
      <section className="reveal-section py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-16">
          <div className="flex-1">
            <h2 className="text-5xl font-display mb-6 leading-tight">
              Thematic<br />
              <span className="text-lex-gold font-editorial italic">Stratification.</span>
            </h2>
            <p className="font-editorial text-lg text-white/60 leading-relaxed mb-8">
              Legal documents are decomposed into a hierarchical metadata tree.
              Every section, clause, and sub-clause is mapped into a shared vector
              space that captures <em>thematic intent</em> over literal labels.
            </p>
            <div className="space-y-4">
              {["Hierarchical PDF Parse", "FAISS Vector Alignment", "LoRA LLaMA-7B Reasoning"].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full border border-lex-gold/40 flex items-center justify-center font-mono text-xs text-lex-gold">
                    {i + 1}
                  </span>
                  <span className="font-display text-sm tracking-wide">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 glass-card p-6 rounded-2xl border-lex-cyan/20 font-mono text-xs text-lex-cyan/80 leading-loose overflow-hidden">
            <pre>{`[INIT]    Model: llama-7b-legal-lora
[STAGE 1] Hierarchical PDF Parse
[LOG]     Parsed DocA · 2,847 clauses · 4.82s

[STAGE 2] Semantic Vector Alignment
[LOG]     FAISS index built · 2,847 vectors
[ALIGNED] 312 topic pairs aligned

[STAGE 3] Multi-Perspective Agent Reasoning
[LENS]    RISK
[Δ 0.91]  Indemnity CAP   → CRITICAL
[Δ 0.74]  Force Majeure   → HIGH

[REPORT]  Analysis complete
          312 deltas · 8 CRITICAL`}</pre>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═════════════════════════════════ */}
      <section className="reveal-section py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-display mb-2 text-center">Intelligence</h2>
        <p className="font-editorial text-lex-gold text-xl italic text-center mb-14">Deep-Dive</p>

        <div className="space-y-5">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={idx}
              className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-lex-gold/30 transition-colors group"
            >
              <summary className="flex items-center justify-between px-7 py-5 cursor-pointer list-none">
                <span className="font-display text-base tracking-wide pr-8">{item.q}</span>
                <ChevronDown
                  size={18}
                  className="text-lex-gold/60 flex-shrink-0 group-open:rotate-180 transition-transform duration-300"
                />
              </summary>
              <div className="px-7 pb-6 pt-0">
                <p className="font-editorial text-lg text-white/60 leading-relaxed border-t border-white/5 pt-5">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FOOTER ══════════════════════════════ */}
      <footer className="py-16 border-t border-lex-gold/10 px-6 text-center">
        <p className="font-mono text-xs text-white/20 tracking-[0.6em] uppercase">
          Lex-Contrast · AI Legal Intelligence · Stage 4 Demo
        </p>
      </footer>
    </main>
  );
}
