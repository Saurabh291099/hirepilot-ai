# JobPilot AI Deployment

## Environments

- Development: local Next.js, NestJS, PostgreSQL, Redis, and worker.
- Staging: isolated database, Redis, storage bucket, provider keys, and test email account.
- Production: separate secrets, managed PostgreSQL/Redis, private storage, monitoring, and backups.

## Services

- Dashboard: Vercel or equivalent Next.js host.
- API: AWS, Render, or Railway NestJS service.
- Worker: separate long-running service using the same API packages.
- PostgreSQL: managed PostgreSQL with pgvector enabled.
- Redis: managed Redis for BullMQ and cache.
- Storage: S3-compatible private bucket.
- Email: Resend or SendGrid.

## Required environment variables

```text
DATABASE_URL
REDIS_URL
JWT_SECRET
JWT_REFRESH_SECRET
AI_PROVIDER
AI_API_KEY
STORAGE_ENDPOINT
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
STORAGE_BUCKET
EMAIL_API_KEY
SENTRY_DSN
WEB_APP_URL
API_URL
```

Use `.env.example` for names only; never commit values.

## Deployment sequence

1. Run lint, typecheck, unit, integration, and build checks.
2. Apply database migrations in staging.
3. Deploy API and worker with compatible migration version.
4. Deploy dashboard with the matching API URL.
5. Run smoke tests for auth, health, upload, job search, and external apply links.
6. Promote to production and verify queues, logs, alerts, and backups.

## CI/CD

Pull requests must run lint, typecheck, tests, build, dependency audit, and secret scanning. Production deploys require a green pipeline and migration review. Use rolling or blue/green deployment for API and worker services.

## Operations

Monitor API latency/errors, queue depth/retries, ingestion counts, AI failures/usage, storage errors, and application provider failures. Test restore procedures and maintain documented RPO/RTO targets before production launch.
