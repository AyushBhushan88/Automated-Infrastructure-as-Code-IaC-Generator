import { z } from 'zod';

export const StackConfigurationSchema = z.object({
  projectName: z.string().min(3),
  backend: z.object({
    language: z.enum(['nodejs', 'python', 'go']),
    framework: z.string().optional(),
    version: z.string()
  }),
  frontend: z.object({
    framework: z.enum(['nextjs', 'react', 'vue']),
    version: z.string()
  }),
  database: z.object({
    type: z.enum(['postgres', 'mysql', 'mongodb']),
    version: z.string()
  }),
  proxy: z.literal('nginx'),
  infrastructure: z.array(z.enum(['terraform', 'kubernetes'])),
  git: z.object({
    repository: z.string().optional(),
    branch: z.string().optional(),
    organization: z.string().optional(),
  }).optional()
});

export type StackConfiguration = z.infer<typeof StackConfigurationSchema>;
