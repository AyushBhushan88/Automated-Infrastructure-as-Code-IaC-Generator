import { StackConfiguration } from '../schema';
import { generateDocker } from './docker';
import { generateNginx } from './nginx';
import { generateTerraform } from './terraform';
import { generateKubernetes } from './kubernetes';

export * from './docker';
export * from './nginx';
export * from './terraform';
export * from './kubernetes';

export function generateFiles(config: StackConfiguration): Record<string, string> {
  const files: Record<string, string> = {};

  // Always generate docker and nginx for now (Phase 1 logic)
  files['docker-compose.yml'] = generateDocker(config);
  files['nginx.conf'] = generateNginx(config);

  if (config.infrastructure.includes('terraform')) {
    files['main.tf'] = generateTerraform(config);
  }

  if (config.infrastructure.includes('kubernetes')) {
    files['k8s.yaml'] = generateKubernetes(config);
  }

  return files;
}
