"use client";

import { useState, useCallback, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────
export type EventKind =
  | "init" | "stage" | "log" | "aligned"
  | "lens_start" | "lens_done"
  | "collision" | "report" | "error";

export interface AgentEvent {
  kind: EventKind;
  ts: number;
  message?: string;
  // stage
  stage?: number;
  label?: string;
  // collision
  lens?: string;
  topic?: string;
  confidence?: number;
  delta_score?: number;
  level?: string;
  // aligned / report
  count?: number;
  total_collisions?: number;
  critical?: number;
}

export interface StreamState {
  events: AgentEvent[];
  isStreaming: boolean;
  isComplete: boolean;
  currentLens: string | null;
  /** 0–1 driven by the latest delta_score */
  orbIntensity: number;
  isColliding: boolean;
  /** Aggregated collision list for the report panel */
  collisions: AgentEvent[];
}

// ── Hook ──────────────────────────────────────────────────────────
export function useAgentStream() {
  const [state, setState] = useState<StreamState>({
    events:       [],
    isStreaming:  false,
    isComplete:   false,
    currentLens:  null,
    orbIntensity: 0,
    isColliding:  false,
    collisions:   [],
  });

  const esRef = useRef<EventSource | null>(null);

  const startStream = useCallback(() => {
    // Close any prior stream
    esRef.current?.close();

    setState({
      events:       [],
      isStreaming:  true,
      isComplete:   false,
      currentLens:  null,
      orbIntensity: 0,
      isColliding:  false,
      collisions:   [],
    });

    const es = new EventSource("http://localhost:8000/stream");
    esRef.current = es;

    es.onmessage = (e: MessageEvent) => {
      const event: AgentEvent = JSON.parse(e.data);

      setState((prev) => {
        const next = { ...prev, events: [...prev.events, event] };

        if (event.kind === "collision") {
          const score = event.delta_score ?? 0;
          next.orbIntensity = score;
          next.isColliding  = score > 0.6;
          next.collisions   = [...prev.collisions, event];
        }

        if (event.kind === "lens_start") next.currentLens = event.lens ?? null;
        if (event.kind === "lens_done")  next.isColliding = false;

        if (event.kind === "report") {
          next.isStreaming  = false;
          next.isComplete   = true;
          next.isColliding  = false;
          next.orbIntensity = 0;
          es.close();
        }

        if (event.kind === "error") {
          next.isStreaming = false;
          es.close();
        }

        return next;
      });
    };

    es.onerror = () => {
      setState((prev) => ({ ...prev, isStreaming: false }));
      es.close();
    };
  }, []);

  const stopStream = useCallback(() => {
    esRef.current?.close();
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  return { state, startStream, stopStream };
}
