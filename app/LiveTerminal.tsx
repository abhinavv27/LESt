"use client";

import { useEffect, useRef } from "react";
import { AgentEvent } from "./useAgentStream";
import { AlertTriangle, CheckCircle, Cpu, Layers, Zap } from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  CRITICAL: "text-red-400",
  HIGH:     "text-orange-400",
  MEDIUM:   "text-yellow-400",
};

function EventRow({ event }: { event: AgentEvent }) {
  if (event.kind === "stage") {
    return (
      <div className="flex items-center gap-3 py-2 border-t border-lex-gold/10 mt-2">
        <Layers size={14} className="text-lex-gold flex-shrink-0" />
        <span className="text-lex-gold font-display tracking-widest text-xs uppercase">
          Stage {event.stage} · {event.label}
        </span>
      </div>
    );
  }

  if (event.kind === "collision") {
    const lvlClass = LEVEL_COLORS[event.level ?? "MEDIUM"];
    return (
      <div className="flex items-start gap-3 py-1">
        <AlertTriangle size={12} className={`${lvlClass} flex-shrink-0 mt-0.5`} />
        <span className="font-mono text-xs leading-relaxed">
          <span className={`${lvlClass} font-bold`}>[Δ {event.delta_score?.toFixed(2)}]</span>
          {" "}
          <span className="text-white/70">{event.lens}</span>
          {" · "}
          <span className="text-lex-cyan">{event.topic}</span>
          {" · "}
          <span className={lvlClass}>{event.level}</span>
        </span>
      </div>
    );
  }

  if (event.kind === "report") {
    return (
      <div className="flex items-center gap-3 py-3 border-t border-lex-gold/20 mt-2">
        <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
        <span className="font-mono text-xs text-green-300">
          {event.message}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 py-0.5">
      <Cpu size={10} className="text-white/30 flex-shrink-0 mt-1" />
      <span className="font-mono text-xs text-white/50 leading-relaxed">
        {event.message ?? JSON.stringify(event)}
      </span>
    </div>
  );
}

interface LiveTerminalProps {
  events: AgentEvent[];
  isStreaming: boolean;
  isComplete: boolean;
  collisions: AgentEvent[];
}

export default function LiveTerminal({
  events,
  isStreaming,
  isComplete,
  collisions,
}: LiveTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll as events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const critical = collisions.filter((c) => c.level === "CRITICAL").length;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border-lex-gold/20 flex flex-col h-[500px]">
      {/* Terminal title bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
          lex-contrast · agent stream
        </span>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-lex-cyan text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-lex-cyan animate-pulse" />
              LIVE
            </span>
          )}
          {isComplete && (
            <span className="text-green-400 text-xs font-mono">COMPLETE</span>
          )}
        </div>
      </div>

      {/* Streaming event log */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-lex-gold/20"
      >
        {events.length === 0 ? (
          <p className="text-white/20 font-mono text-xs mt-4">
            ▶ Press &quot;Run Analysis&quot; to start the live demo…
          </p>
        ) : (
          events.map((ev, i) => <EventRow key={i} event={ev} />)
        )}
        {isStreaming && (
          <div className="flex items-center gap-2 py-1">
            <span className="font-mono text-xs text-lex-gold animate-pulse">▋</span>
          </div>
        )}
      </div>

      {/* Summary bar */}
      {isComplete && (
        <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-lex-gold" />
            <span className="font-mono text-xs text-white/60">
              <span className="text-white">{collisions.length}</span> deltas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="font-mono text-xs text-white/60">
              <span className="text-red-400">{critical}</span> critical
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
