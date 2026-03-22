import { YAMLMap, Document } from 'yaml';
import { StackConfiguration } from '../schema';

export function generateDocker(config: StackConfiguration): string {
  const doc = new Document();
  const services = new YAMLMap();

  // Backend Service
  const backend = new YAMLMap();
  backend.set('image', `${config.backend.language}:${config.backend.version}`);
  backend.set('ports', ['3000:3000']);
  backend.set('environment', {
    DATABASE_URL: `postgresql://user:password@db:5432/${config.projectName}_db`
  });
  services.set('backend', backend);

  // Frontend Service
  const frontend = new YAMLMap();
  frontend.set('image', `${config.frontend.framework}:${config.frontend.version}`);
  frontend.set('ports', ['80:80']);
  services.set('frontend', frontend);

  // Database Service
  const db = new YAMLMap();
  db.set('image', `${config.database.type}:${config.database.version}`);
  db.set('environment', {
    POSTGRES_DB: `${config.projectName}_db`,
    POSTGRES_USER: 'user',
    POSTGRES_PASSWORD: 'password'
  });
  db.set('volumes', [`${config.projectName}_db_data:/var/lib/postgresql/data`]);
  services.set('db', db);

  doc.set('version', '3.8');
  doc.set('services', services);
  doc.set('volumes', {
    [`${config.projectName}_db_data`]: null
  });

  return doc.toString();
}
