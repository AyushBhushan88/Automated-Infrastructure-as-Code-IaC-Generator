import { Node, Edge } from '@xyflow/react';
import { StackConfiguration } from 'core/client';

export function mapConfigToFlow(config: StackConfiguration): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Proxy Node (NGINX)
  if (config.proxy === 'nginx') {
    nodes.push({
      id: 'proxy',
      type: 'infra',
      data: { label: 'NGINX', role: 'Reverse Proxy', tech: 'nginx' },
      position: { x: 0, y: 0 },
    });
  }

  // 2. Frontend Node
  nodes.push({
    id: 'frontend',
    type: 'infra',
    data: { 
      label: config.frontend.framework.toUpperCase(), 
      role: 'Frontend', 
      tech: config.frontend.framework 
    },
    position: { x: 0, y: 0 },
  });

  // 3. Backend Node
  nodes.push({
    id: 'backend',
    type: 'infra',
    data: { 
      label: config.backend.language.toUpperCase(), 
      role: 'Backend API', 
      tech: config.backend.language 
    },
    position: { x: 0, y: 0 },
  });

  // 4. Database Node
  nodes.push({
    id: 'database',
    type: 'infra',
    data: { 
      label: config.database.type.toUpperCase(), 
      role: 'Database', 
      tech: config.database.type 
    },
    position: { x: 0, y: 0 },
  });

  // Edges
  if (config.proxy === 'nginx') {
    edges.push({ id: 'e-proxy-frontend', source: 'proxy', target: 'frontend' });
    edges.push({ id: 'e-proxy-backend', source: 'proxy', target: 'backend' });
  }

  edges.push({ id: 'e-backend-database', source: 'backend', target: 'database' });

  // Add Infrastructure nodes if any (e.g. Terraform, Kubernetes - though these are meta-infra)
  // For now, let's keep it to runtime architecture.

  return { nodes, edges };
}
