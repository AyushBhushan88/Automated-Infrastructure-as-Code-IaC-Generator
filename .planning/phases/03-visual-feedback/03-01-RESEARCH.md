# Phase 3: Visual Architecture Feedback - Research

**Researched:** 2026-03-27
**Domain:** Architecture Visualization (UI/UX)
**Confidence:** HIGH

## Summary

This phase focuses on providing real-time visual feedback to users as they configure their infrastructure in the wizard. We will use **XyFlow** (formerly React Flow) to render an interactive diagram of the architecture. The diagram will update as the user changes options in the wizard (e.g., switching from Postgres to MongoDB, or adding Kubernetes).

**Primary recommendation:** Use `@xyflow/react` with `elkjs` for automatic layout to ensure the diagram remains clean and organized as complexity increases.

## User Constraints (from CONTEXT.md)

*No CONTEXT.md found for this phase. Following general project instructions.*

### Locked Decisions
- **Stack**: Next.js 15+ (App Router), React 19.
- **Visualization Library**: XyFlow (`@xyflow/react`).

### the agent's Discretion
- **Layout Algorithm**: Recommending `elkjs` over `dagre` for better support of hierarchical structures and active maintenance.
- **Icon Library**: Using `lucide-react` (already in project) for infrastructure icons.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UI-01 | Real-time architecture visualization | Verified XyFlow integration with Next.js App Router and real-time state mapping from `react-hook-form`. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @xyflow/react | 12.10.1 | Flow-based diagramming | Industry standard for interactive node-based UIs in React. |
| elkjs | 0.11.1 | Auto-layout engine | Actively maintained, handles complex hierarchical layouts much better than Dagre. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| lucide-react | ^0.577.0 | Infrastructure icons | Consistent, high-quality icon set already used in the project. |

**Installation:**
```bash
npm install @xyflow/react elkjs
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── components/
│   ├── ArchitectureVisualizer/      # Main container
│   │   ├── Flow.tsx                 # Client-side XyFlow component
│   │   ├── InfrastructureNode.tsx   # Custom node component
│   │   └── layout.ts                # ELK layout logic
│   └── Wizard.tsx                   # Updated to support onChange
```

### Pattern 1: No-SSR Integration
Since XyFlow depends on browser APIs (DOMRect, window), it must be imported dynamically to prevent hydration errors in Next.js 15.

```typescript
// Source: https://reactflow.dev/learn/frameworks/nextjs
import dynamic from 'next/dynamic';

const ArchitectureVisualizer = dynamic(
  () => import('./components/ArchitectureVisualizer/Flow'),
  { ssr: false }
);
```

### Pattern 2: Auto-Layout Hook
ELK is asynchronous. The layout should be recalculated whenever the set of nodes or edges changes.

```typescript
// Source: https://reactflow.dev/examples/layout/elkjs
const useAutoLayout = (nodes: Node[], edges: Edge[]) => {
  const [layoutedNodes, setLayoutedNodes] = useState(nodes);
  
  useEffect(() => {
    elk.layout({ ... }).then(({ children }) => {
      setLayoutedNodes(children.map(n => ({ ...n, position: { x: n.x, y: n.y } })));
    });
  }, [nodes, edges]);

  return layoutedNodes;
};
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Node Positioning | Manual `x, y` coords | `elkjs` | Manual positioning is brittle; users expect the diagram to "snap" into a clean layout. |
| Diagram Pan/Zoom | Custom SVG logic | `@xyflow/react` | Handles all interaction primitives (drag, zoom, select, fitView). |

## Common Pitfalls

### Pitfall 1: Hydration Mismatch
**What goes wrong:** React Flow calculates layout on the client, causing "Hydration failed" because server-rendered HTML doesn't match client state.
**How to avoid:** Use `dynamic(() => ..., { ssr: false })` or a "mounted" state check before rendering the flow.

### Pitfall 2: Infinite Layout Loops
**What goes wrong:** Updating node positions in a `useEffect` triggers another update, causing a loop.
**How to avoid:** Ensure the layout calculation only runs when the *structure* (IDs, types, connections) changes, not just any property.

## Code Examples

### Mapping Logic (Mock)
```typescript
function mapConfigToFlow(config: StackConfiguration) {
  const nodes = [
    { id: 'proxy', type: 'infra', data: { label: 'NGINX', tech: 'Proxy' } },
    { id: 'frontend', type: 'infra', data: { label: config.frontend.framework, tech: 'Frontend' } },
    { id: 'backend', type: 'infra', data: { label: config.backend.language, tech: 'Backend' } },
    { id: 'database', type: 'infra', data: { label: config.database.type, tech: 'Database' } },
  ];

  const edges = [
    { id: 'e-p-f', source: 'proxy', target: 'frontend' },
    { id: 'e-p-b', source: 'proxy', target: 'backend' },
    { id: 'e-b-d', source: 'backend', target: 'database' },
  ];

  return { nodes, edges };
}
```

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All | ✓ | 22.x | — |
| npm | Installation | ✓ | 10.x | — |
| browser | XyFlow Runtime | ✓ | — | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest / Testing Library |
| Quick run command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | Diagram updates when Wizard changes | Integration | `npm test apps/web/components/Wizard.test.tsx` | ❌ Wave 0 |

## Sources

### Primary (HIGH confidence)
- [Official XyFlow Docs](https://reactflow.dev/learn/frameworks/nextjs) - Next.js 15 Integration.
- [ELKJS Documentation](https://github.com/kieler/elkjs) - Layout options.

### Secondary (MEDIUM confidence)
- [Community examples for infrastructure diagrams](https://reactflow.dev/examples/nodes/custom-node) - Styling patterns.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Libraries are mature and well-documented.
- Architecture: HIGH - Integration patterns for Next.js are established.
- Pitfalls: MEDIUM - Real-time performance with ELK needs careful monitoring.

**Research date:** 2026-03-27
**Valid until:** 2026-04-26
