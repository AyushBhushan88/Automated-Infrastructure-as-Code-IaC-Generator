import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from '@xyflow/react';

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.spacing.nodeNodeLayered': '100',
  'elk.spacing.nodeNode': '80',
};

export const getLayoutedElements = async (nodes: Node[], edges: Edge[]) => {
  const elkNodes: any[] = nodes.map((node) => ({
    id: node.id,
    width: 200, // Approximate width
    height: 100, // Approximate height
  }));

  const elkEdges: any[] = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const layout = await elk.layout({
    id: 'root',
    layoutOptions: elkOptions,
    children: elkNodes,
    edges: elkEdges,
  }) as any;

  return nodes.map((node) => {
    const elkNode = layout.children?.find((n: any) => n.id === node.id);
    if (elkNode) {
      return {
        ...node,
        position: { x: elkNode.x || 0, y: elkNode.y || 0 },
      };
    }
    return node;
  });
};
