"use client";

import { useState, useCallback, useRef } from "react";
import { fetchEventSource } from '@microsoft/fetch-event-source';

// ── Types ─────────────────────────────────────────────────────────
export type EventKind =
  | "init" | "stage" | "log" | "aligned"
  | "lens_start" | "lens_done"
  | "collision" | "report" | "error"
  | "handoff" | "synthesis_start" | "synthesis_done";

export interface AgentMetadata {
  agentId: string;
  agentName: string;
  agentRole: string;
}

export interface AgentEvent {
  kind: EventKind;
  ts: number;
  message?: string;
  agent?: AgentMetadata;
  handoffTo?: string; // ID of the agent being handed off to
  // stage
  stage?: number;
  label?: string;
  // collision
  lens?: string;
  topic?: string;
  confidence?: number;
  delta_score?: number;
  level?: string;
  src_a?: string;
  src_b?: string;
  reconciled?: string;
  // aligned / report
  count?: number;
  total_collisions?: number;
  critical?: number;
}

export interface StreamOptions {
  onFinalReport?: (report: any) => void;
}

export interface StreamState {
  events: AgentEvent[];
  isStreaming: boolean;
  isHandshaking: boolean;
  isComplete: boolean;
  orbIntensity: number;
  avgIntensity: number;
  isColliding: boolean;
  currentLens: string | null;
  currentAgent: AgentMetadata | null;
  collisions: AgentEvent[];
}

export const SPECIALISTS: Record<string, AgentMetadata> = {
  'supervisor': { agentId: 'supervisor', agentName: 'Cortex Supervisor', agentRole: 'Orchestrator' },
  'agent-1': { agentId: 'agent-1', agentName: 'Liability Steward', agentRole: 'Liability specialist' },
  'agent-2': { agentId: 'agent-2', agentName: 'IP Sentinel', agentRole: 'IP rights analyst' },
  'agent-3': { agentId: 'agent-3', agentName: 'Termination Wraith', agentRole: 'Exit strategy expert' },
  'agent-4': { agentId: 'agent-4', agentName: 'Payment Guardian', agentRole: 'Financial compliance' },
  'agent-5': { agentId: 'agent-5', agentName: 'Confidential Mask', agentRole: 'Privacy & Data' },
  'agent-sigma': { agentId: 'agent-sigma', agentName: 'Agent Sigma', agentRole: 'Clause Weaver' }
};

// ── Hook ──────────────────────────────────────────────────────────
export function useAgentStream(options?: StreamOptions) {
  const [state, setState] = useState<StreamState>({
    events: [],
    collisions: [],
    isStreaming: false,
    isHandshaking: false,
    isComplete: false,
    orbIntensity: 0,
    avgIntensity: 0,
    isColliding: false,
    currentLens: null,
    currentAgent: null,
  });

  const abortCtrlRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (docA: File | null, docB: File | null) => {
    if (!docA || !docB) {
      console.warn("Both documents must be selected.");
      return;
    }

    abortCtrlRef.current?.abort();
    abortCtrlRef.current = new AbortController();

    setState({
      events: [],
      collisions: [],
      isStreaming: false,
      isHandshaking: true,
      isComplete: false,
      orbIntensity: 0,
      avgIntensity: 0,
      isColliding: false,
      currentLens: null,
      currentAgent: SPECIALISTS['supervisor'],
    });

    // Simulated Handshake delay
    await new Promise(r => setTimeout(r, 1200));

    setState(prev => ({ ...prev, isStreaming: true, isHandshaking: false }));

    try {
      const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData
        });
        if (!res.ok) throw new Error("Upload failed");
        return await res.json();
      };

      const [resA, resB] = await Promise.all([uploadFile(docA), uploadFile(docB)]);

      const url = `http://127.0.0.1:8000/stream?t=${Date.now()}`;
      await fetchEventSource(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_a: resA.filepath, doc_b: resB.filepath }),
        signal: abortCtrlRef.current.signal,
        onmessage(e) {
          try {
            const event: AgentEvent = JSON.parse(e.data);

            setState((prev) => {
              const next = { ...prev };
              next.events = [...prev.events.slice(-100), event];

              if (event.agent) next.currentAgent = event.agent;
              
              if (event.kind === "handoff" && event.handoffTo) {
                next.currentAgent = SPECIALISTS[event.handoffTo] || next.currentAgent;
              }

              if (event.kind === "collision") {
                const score = event.delta_score ?? 0;
                next.orbIntensity = score;
                next.avgIntensity = (prev.avgIntensity * 0.9) + (score * 0.1);
                next.isColliding = score > 0.6;
                next.collisions = [...prev.collisions, event];
              }

              if (event.kind === "lens_start") next.currentLens = event.lens ?? null;
              if (event.kind === "lens_done") next.isColliding = false;

              if (event.kind === "report") {
                next.isStreaming = false;
                next.isComplete = true;
                next.isColliding = false;
                next.orbIntensity = 0;
                abortCtrlRef.current?.abort();
              }

              if (event.kind === "error") {
                next.isStreaming = false;
                abortCtrlRef.current?.abort();
              }

              return next;
            });
          } catch (err) {
            console.error("Malformated SSE event:", err);
          }
        },
        onerror(err) {
          console.error("SSE Connection Error:", err);
          setState((prev) => ({ ...prev, isStreaming: false }));
          throw err;
        }
      });
    } catch (err) {
      console.error("Agent Stream Error:", err);
      setState((prev) => ({ ...prev, isStreaming: false }));
    }
  }, []);

  const simulateStream = useCallback(async () => {
    setState({
      events: [],
      collisions: [],
      isStreaming: false,
      isHandshaking: true,
      isComplete: false,
      orbIntensity: 0,
      avgIntensity: 0,
      isColliding: false,
      currentLens: null,
      currentAgent: SPECIALISTS['supervisor'],
    });

    // Simulated Handshake delay
    await new Promise(r => setTimeout(r, 1200));

    setState(prev => ({ ...prev, isStreaming: true, isHandshaking: false }));

    const mockEvents: AgentEvent[] = [
      { 
        kind: "init", ts: Date.now(), message: "Supervisor Cortex Online. Initializing specialized swarm.",
        agent: SPECIALISTS['supervisor']
      },
      { 
        kind: "stage", ts: Date.now(), stage: 1, label: "INGESTION_ENGINE" 
      },
      { 
        kind: "handoff", ts: Date.now(), message: "Handing off to Liability Steward for indemnity review.",
        agent: SPECIALISTS['supervisor'], handoffTo: 'agent-1'
      },
      { 
        kind: "lens_start", ts: Date.now(), lens: "Liability & Indemnity",
        agent: SPECIALISTS['agent-1']
      },
      { 
        kind: "collision", ts: Date.now(), lens: "Liability & Indemnity", 
        topic: "Excessive Limitation of Liability", confidence: 0.92, delta_score: 0.85, level: "CRITICAL",
        agent: SPECIALISTS['agent-1'],
        src_a: "Section 12.4: The total liability of Provider under this Agreement shall not exceed the fees paid by Customer during the 12-month period preceding the claim.",
        src_b: "Limitation of Liability: Contractor's maximum cumulative liability for any breach, negligence, or indemnity shall be capped at $5,000,000.",
        reconciled: "Reconciled Clause: The total liability of Provider under this Agreement shall be limited to the greater of (i) the fees paid by Customer in the 12 months preceding the claim or (ii) $1,000,000, except for gross negligence or willful misconduct."
      },
      { kind: "lens_done", ts: Date.now(), agent: SPECIALISTS['agent-1'] },
      { 
        kind: "handoff", ts: Date.now(), message: "Returning control to Supervisor. Initiating IP clearance.",
        agent: SPECIALISTS['agent-1'], handoffTo: 'supervisor'
      },
      { 
        kind: "handoff", ts: Date.now(), message: "IP Sentinel deployed for rights analysis.",
        agent: SPECIALISTS['supervisor'], handoffTo: 'agent-2'
      },
      { 
        kind: "lens_start", ts: Date.now(), lens: "Intellectual Property",
        agent: SPECIALISTS['agent-2']
      },
      { 
        kind: "log", ts: Date.now(), message: "Scanning for IP ownership ambiguity...",
        agent: SPECIALISTS['agent-2']
      },
      { kind: "lens_done", ts: Date.now(), agent: SPECIALISTS['agent-2'] },
      { 
        kind: "handoff", ts: Date.now(), message: "Deploying Agent Sigma (the Weaver) for final synthesis.",
        agent: SPECIALISTS['supervisor'], handoffTo: 'agent-sigma'
      },
      { 
        kind: "synthesis_start", ts: Date.now(), message: "Weaving conflicting clauses into balanced legal bridge.",
        agent: SPECIALISTS['agent-sigma']
      },
      { kind: "synthesis_done", ts: Date.now(), agent: SPECIALISTS['agent-sigma'] },
      { 
        kind: "report", ts: Date.now(), message: "Swarm Audit Finalized. All agents report clear.",
        total_collisions: 1, critical: 1, agent: SPECIALISTS['supervisor']
      }
    ];

    for (const event of mockEvents) {
      await new Promise(r => setTimeout(r, 800));
      setState((prev) => {
        const next = { ...prev };
        next.events = [...prev.events.slice(-100), event];

        if (event.agent) next.currentAgent = event.agent;
        
        if (event.kind === "handoff" && event.handoffTo) {
          next.currentAgent = SPECIALISTS[event.handoffTo] || next.currentAgent;
        }

        if (event.kind === "collision") {
          const score = event.delta_score ?? 0;
          next.orbIntensity = score;
          next.avgIntensity = (prev.avgIntensity * 0.9) + (score * 0.1);
          next.isColliding = score > 0.6;
          next.collisions = [...prev.collisions, event];
        }

        if (event.kind === "lens_start") next.currentLens = event.lens ?? null;
        if (event.kind === "lens_done") next.isColliding = false;

        if (event.kind === "report") {
          next.isStreaming = false;
          next.isComplete = true;
          next.isColliding = false;
          next.orbIntensity = 0;

          // Call the final report callback if provided
          options?.onFinalReport?.({
            summary: "Neural audit synthesis complete. High risk detected in Sect 4.2 Liability caps being disproportionate to service fees. Recommended mutualization to 2x Annual Recurring Revenue (ARR) for operational equilibrium.",
            riskScore: 78,
            agentFindings: [
              { agent: "Liability Sentinel", level: "CRITICAL", note: "Section 4.2: Direct/Indirect liability gap exceeds corridor v2.4" },
              { agent: "IP Sentinel", level: "MODERATE", note: "Open Source license scan: MIT compatibility verified via swarm-lens." },
              { agent: "Termination Wraith", level: "LOW", note: "Exit strategy: Data portable via S3/GCS compliant buckets." }
            ],
            conflicts: next.collisions
          });
        }

        return next;
      });
    }
  }, []);

  const stopStream = useCallback(() => {
    abortCtrlRef.current?.abort();
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  return { state, startStream, stopStream, simulateStream };
}
