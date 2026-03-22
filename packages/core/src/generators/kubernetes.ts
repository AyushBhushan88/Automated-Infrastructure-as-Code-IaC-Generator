import { Document } from 'yaml';
import { StackConfiguration } from '../schema';

export function generateKubernetes(config: StackConfiguration): string {
  const deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: `${config.projectName}-backend`,
      labels: { app: 'backend' }
    },
    spec: {
      replicas: 2,
      selector: { matchLabels: { app: 'backend' } },
      template: {
        metadata: { labels: { app: 'backend' } },
        spec: {
          containers: [{
            name: 'backend',
            image: `${config.backend.language}:${config.backend.version}`,
            ports: [{ containerPort: 3000 }]
          }]
        }
      }
    }
  };

  const service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: { name: `${config.projectName}-backend-svc` },
    spec: {
      selector: { app: 'backend' },
      ports: [{ port: 80, targetPort: 3000 }],
      type: 'LoadBalancer'
    }
  };

  const doc1 = new Document(deployment);
  const doc2 = new Document(service);

  return `${doc1.toString()}---\n${doc2.toString()}`;
}
