import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Server, Database, Globe, Box, ShieldCheck } from 'lucide-react';

const getIcon = (tech: string) => {
  const t = tech.toLowerCase();
  if (t === 'nginx') return <ShieldCheck className="w-5 h-5 text-blue-500" />;
  if (t === 'postgres' || t === 'mysql' || t === 'mongodb') return <Database className="w-5 h-5 text-emerald-500" />;
  if (t === 'nextjs' || t === 'react' || t === 'vue') return <Globe className="w-5 h-5 text-indigo-500" />;
  if (t === 'nodejs' || t === 'python' || t === 'go') return <Server className="w-5 h-5 text-orange-500" />;
  return <Box className="w-5 h-5 text-gray-500" />;
};

export const InfrastructureNode = memo(({ data }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md bg-white border-2 border-gray-200 min-w-[150px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400" />
      
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-50 rounded-full">
          {getIcon(data.tech as string)}
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {data.role as string}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {data.label as string}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400" />
    </div>
  );
});

InfrastructureNode.displayName = 'InfrastructureNode';
