# JobPilot AI Roadmap

Status values: `PLANNED`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`, `DEPRECATED`.

## Current implementation status

| Area                     | Status      | Notes                                                                      |
| ------------------------ | ----------- | -------------------------------------------------------------------------- |
| Monorepo scaffold        | COMPLETED   | Turborepo with `apps/api` and `apps/dashboard`.                            |
| Dashboard shell          | COMPLETED   | Static HirePilot overview screen; actions are not wired yet.               |
| API scaffold             | IN_PROGRESS | Validated config and `/health` are implemented; domain modules remain.     |
| Documentation foundation | COMPLETED   | Product, architecture, API, data, AI, source, security, and release docs.  |
| Authentication           | IN_PROGRESS | Persistent register/login works; JWT refresh, guards, and OAuth remain.    |
| Database and migrations  | IN_PROGRESS | TypeORM data-source package exists; entities and migrations remain.        |
| Resume upload/parsing    | IN_PROGRESS | PDF/DOCX intake endpoint exists; extraction worker remains.                |
| Job ingestion            | IN_PROGRESS | Job feed contract and recommendation fixtures exist; adapters remain.      |
| Matching engine          | PLANNED     | Hard filters, deterministic skills, embeddings, explanations.              |
| Applications             | IN_PROGRESS | Applications persist in PostgreSQL; user-scoped auth and job links remain. |
| Notifications            | PLANNED     | In-app first, email after alert rules stabilize.                           |
| Admin and billing        | PLANNED     | Post-MVP.                                                                  |

## Release sections

### V1 - Trusted job-finding MVP

Priority P0. A user can register, upload and review a resume-derived profile, set preferences, discover jobs from authorized sources, understand match scores, save jobs, open employer application pages, and track applications. V1 includes PostgreSQL persistence, Redis-backed workers, API documentation, security controls, and production smoke tests.

### V2 - AI application assistant

Priority P1. Add tailored resume suggestions, editable cover letters, interview preparation, the scoped AI career assistant, saved searches, job alerts, email delivery, richer analytics, and supported ATS application APIs where authorization exists.

### V3 - Platform scale and intelligence

Priority P2. Add admin operations, source controls, billing/subscriptions, company intelligence, advanced semantic search, multi-provider model routing, browser/mobile clients, enterprise controls, and deeper observability and optimization.

## V1 implementation phases

### Phase 1: Foundation

Priority P0. Add config validation, PostgreSQL/TypeORM, Redis/BullMQ, auth, users, profiles, preferences, Swagger, and shared types.

### Phase 2: Resume intelligence

Priority P0. Add private PDF/DOCX upload, file scanning, extraction worker, versioned structured profile, editable review UI, and tests.

### Phase 3: Job engine

Priority P0. Add source adapter contract, Greenhouse/Ashby adapters, normalization, deduplication, expiry checks, search, and pagination.

### Phase 4: Matching

Priority P0. Add hard filters, skill scoring, pgvector embeddings, explainable score schema, caching, and match review UI.

### Phase 5: Applications

Priority P0. Add saved jobs, application tracker, external apply links, documents, events, reminders, and confirmation safety.

### Phase 6: Career tools

Priority P1. Add tailored resumes, cover letters, AI assistant, and interview preparation with reviewable output.

### Phase 7: Notifications and operations

Priority P1. Add saved searches, alerts, admin source management, observability, analytics, and production hardening.

## Next action

Implement Phase 1 in small slices, starting with validated environment configuration and the database package. Do not add AI or provider integrations until identity and persistence boundaries are in place.
