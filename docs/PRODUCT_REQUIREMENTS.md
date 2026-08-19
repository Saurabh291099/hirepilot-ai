# JobPilot AI Product Requirements

## Product

JobPilot AI helps a candidate answer: **Which jobs should I apply to today, and why?** It combines authorized job discovery, resume intelligence, explainable matching, application assistance, and tracking.

## MVP

The first production MVP includes:

- Email/password registration and login
- Resume upload for PDF and DOCX
- Asynchronous resume parsing and editable profile extraction
- Career preferences
- Authorized job ingestion from a small number of ATS adapters
- Normalized job search, filters, deduplication, and expiry status
- Hybrid match score with strengths, missing skills, and concerns
- Job detail pages with explicit external-apply labeling
- Saved jobs and application tracking
- Basic dashboard and in-app notifications

## Non-goals for MVP

- Unauthorized LinkedIn, Indeed, or account-login scraping
- Silent application submission
- Full social login, billing, admin tooling, and mobile apps
- Automated browser form filling where an official application API is unavailable

## User journey

```mermaid
flowchart LR
  A[Register] --> B[Upload resume]
  B --> C[Review profile]
  C --> D[Set preferences]
  D --> E[Browse recommendations]
  E --> F[Review match explanation]
  F --> G[Save or apply]
  G --> H[Track application]
```

## Product principles

1. User data is private and user-editable.
2. Job sources are replaceable adapters, never business-logic dependencies.
3. LLM output is validated and combined with deterministic rules.
4. Every application action requires explicit user confirmation.
5. Current implementation status is maintained in `docs/ROADMAP.md`.
