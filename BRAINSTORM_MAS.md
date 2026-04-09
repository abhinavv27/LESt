# Lex-Contrast Multi-Agent Architecture (MAS)

## 1. Overview
Lex-Contrast is evolving from a single stream analysis into a **Hierarchical Swarm** architecture. This ensures deeper context isolation and more robust legal reasoning.

## 2. Agent Roles

### A. Cortex Supervisor (Agent-0)
- **Pattern**: Supervisor / Orchestrator.
- **Core Loop**:
  1. Receive Source A & B.
  2. Index documents and identify relevant sections.
  3. Dispatch sections to the specialized Swarm.
  4. Perform global risk synthesis.
- **UI State**: `system_load`, `global_confidence`.

### B. Specialist Swarm (The Lenses)
Specialized agents with domain-specific system prompts.
1. **`Liability_Steward`**: Focuses on indemnity, caps, and consequential damages.
2. **`IP_Sentinel`**: Focuses on ownership, licensing, and infringement.
3. **`Termination_Wraith`**: Focuses on exit strategies, notice periods, and survival clauses.
4. **`Payment_Guardian`**: Focuses on net terms, late fees, and audit rights.
- **Pattern**: Swarm. Agents can hand off clauses to each other if they overlap (e.g., Termination involving IP).

### C. The Bridge Weaver (Agent-Sigma)
- **Role**: Takes conflicting segments from specialists and "weaves" the reconciled clause.
- **Output**: The side-by-side reconciliation viewed in the `ClauseInspector`.

## 3. Communication Protocol (Swarm Handoff)
```typescript
interface AgentHandoff {
  from: string;
  to: string;
  payload: Segment;
  priority: 'CRITICAL' | 'STANDARD';
  reason: string;
}
```

## 4. UX & Performance Fixes
### Glitch Mitigation:
- **GSAP Refresh**: Ensure `ScrollTrigger.refresh()` is called after state updates.
- **Batch State Updates**: Reduce the frequency of `useAgentStream` events to avoid UI thrashing.
- **3D Optimization**: Use `RequestAnimationFrame` logic for the neural nodes to ensure the UI thread stays light.
- **Handshake Transition**: Implement a dedicated "Neural Handshake" animation state between `IDLE` and `STREAMING`.

## 5. Implementation Steps
1. Update `useAgentStream.ts` to include agent metadata in events.
2. Create a `SwarmHUD` component to visualize agent activity.
3. Fix the "glitchy" transitions in `page.tsx`.
4. Refactor `ConflictScene` for better sync with the "Swarm" state.
