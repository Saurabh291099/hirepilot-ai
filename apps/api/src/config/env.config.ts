import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32).default('jobpilot-local-development-secret-change-me'),
  REDIS_URL: z.string().url().optional(),
  GREENHOUSE_BOARDS: z.string().optional(),
  ASHBY_BOARDS: z.string().optional(),
});

export function validateEnvironment(environment: Record<string, unknown>) {
  const result = environmentSchema.safeParse(environment);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.message}`,
    );
  }

  return result.data;
}
