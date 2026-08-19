# JobPilot AI Security and Privacy

## Security baseline

- Hash passwords with Argon2id or bcrypt using a strong work factor.
- Use short-lived JWT access tokens and rotating refresh tokens.
- Support logout from one device and all devices.
- Validate all DTOs and uploaded files; reject unexpected fields.
- Apply rate limiting, CORS allowlists, secure headers, and request IDs.
- Use parameterized TypeORM queries and least-privilege database credentials.
- Keep AI, ATS, storage, email, and OAuth secrets server-side.
- Encrypt data in transit and use provider encryption at rest.
- Store resumes privately with opaque IDs and short-lived signed URLs.
- Scan files before parsing and enforce configurable size/type limits.

## Authorization

Every user-owned record is scoped to the authenticated user. Admin routes use explicit RBAC. Service methods repeat ownership checks so authorization does not depend only on controllers.

## Application safety

Never silently apply. Before submission show company, role, destination, resume, cover letter, answers, and flow type. Require explicit confirmation. External applications must be labeled `Apply on Employer Site`.

## Privacy controls

Users can view, correct, export, and permanently delete their profile, resumes, applications, and conversations. Publish privacy policy, terms, consent records, and retention rules. Do not train models on private user data without explicit consent.

## Audit and incident response

Audit authentication, profile changes, document access, AI generation, provider application attempts, admin actions, and deletion requests. Redact tokens, resume text, and secrets from logs. Send exceptions and queue failures to Sentry after secret scrubbing.

## Threats to test

- Broken object-level authorization.
- Malicious PDF/DOCX uploads.
- Prompt injection from job descriptions or resumes.
- SSRF through user-provided URLs.
- Token replay and refresh-token theft.
- Rate-limit bypass and AI quota abuse.
- XSS in generated content and notes.
