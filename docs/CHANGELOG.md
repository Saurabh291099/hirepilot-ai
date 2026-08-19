# Changelog

## Unreleased

### Added

- Initial product requirements for the JobPilot AI MVP.
- Target architecture and runtime boundaries.
- PostgreSQL entity and index design.
- REST API conventions and endpoint inventory.
- AI provider and hybrid matching design.
- Authorized job-source adapter and ingestion design.
- Security, privacy, deployment, and phased roadmap documentation.
- Initial `@jobpilot/database` TypeORM data-source package boundary.

### Current baseline

- Next.js dashboard shell is available at `/`.
- NestJS API scaffold exposes a placeholder root route.
- No authentication, database, resume processing, job ingestion, or matching features are complete yet.
- Database package foundation is in progress; entities and migrations are not implemented yet.

### V1 foundation started

- Added validated API environment configuration with `NODE_ENV` and `PORT`.
- Added `GET /health` with service, timestamp, uptime, and environment metadata.
- Added API unit coverage for the health contract.
