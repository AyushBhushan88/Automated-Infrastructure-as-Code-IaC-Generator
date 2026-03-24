'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { InfrastructureNode } from './InfrastructureNode';
import { getLayoutedElements } from './layout';

const nodeTypes = {
  infra: InfrastructureNode,
};

interface FlowProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

function FlowInner({ initialNodes, initialEdges }: FlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  const onLayout = useCallback(
    async (nodes: Node[], edges: Edge[]) => {
      const layoutedNodes = await getLayoutedElements(nodes, edges);
      setNodes([...layoutedNodes]);
      setEdges([...edges]);
      
      // Use requestAnimationFrame to ensure the fitView happens after the layout is applied
      window.requestAnimationFrame(() => {
        fitView({ duration: 800 });
      });
    },
    [setNodes, setEdges, fitView]
  );

  useEffect(() => {
    onLayout(initialNodes, initialEdges);
  }, [initialNodes, initialEdges, onLayout]);

  return (
    <div className="w-full h-full min-h-[400px] border rounded-lg bg-gray-50 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function Flow(props: FlowProps) {
  return (
    <ReactFlowProvider>
      <FlowInner {...props} />
    </ReactFlowProvider>
  );
}
