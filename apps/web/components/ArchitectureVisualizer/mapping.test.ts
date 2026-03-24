import { describe, it, expect } from 'vitest';
import { mapConfigToFlow } from './mapping';
import { StackConfiguration } from 'core/client';

describe('mapConfigToFlow', () => {
  const defaultConfig: StackConfiguration = {
    projectName: 'test-project',
    backend: { language: 'nodejs', version: '22' },
    frontend: { framework: 'nextjs', version: '15' },
    database: { type: 'postgres', version: '16' },
    proxy: 'nginx',
    infrastructure: [],
  };

  it('should generate nodes for all core components', () => {
    const { nodes } = mapConfigToFlow(defaultConfig);
    
    expect(nodes.find(n => n.id === 'proxy')).toBeDefined();
    expect(nodes.find(n => n.id === 'frontend')).toBeDefined();
    expect(nodes.find(n => n.id === 'backend')).toBeDefined();
    expect(nodes.find(n => n.id === 'database')).toBeDefined();
  });

  it('should correctly label frontend and backend based on config', () => {
    const config: StackConfiguration = {
      ...defaultConfig,
      backend: { language: 'python', version: '3.12' },
      frontend: { framework: 'vue', version: '3' },
    };
    
    const { nodes } = mapConfigToFlow(config);
    
    const frontendNode = nodes.find(n => n.id === 'frontend');
    const backendNode = nodes.find(n => n.id === 'backend');
    
    expect(frontendNode?.data.label).toBe('VUE');
    expect(backendNode?.data.label).toBe('PYTHON');
  });

  it('should generate edges connecting proxy to app and app to database', () => {
    const { edges } = mapConfigToFlow(defaultConfig);
    
    expect(edges).toContainEqual(expect.objectContaining({ source: 'proxy', target: 'frontend' }));
    expect(edges).toContainEqual(expect.objectContaining({ source: 'proxy', target: 'backend' }));
    expect(edges).toContainEqual(expect.objectContaining({ source: 'backend', target: 'database' }));
  });

  it('should not include proxy node or edges if proxy is not nginx', () => {
    const config: StackConfiguration = {
      ...defaultConfig,
      proxy: 'none' as any, // Testing fallback or "none"
    };
    
    const { nodes, edges } = mapConfigToFlow(config);
    
    expect(nodes.find(n => n.id === 'proxy')).toBeUndefined();
    expect(edges.find(e => e.source === 'proxy')).toBeUndefined();
  });
});
