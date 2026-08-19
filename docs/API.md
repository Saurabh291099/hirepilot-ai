# JobPilot AI API

The API is REST over JSON and will be documented with NestJS Swagger/OpenAPI. All authenticated endpoints require a bearer access token. Errors use one shape:

```json
{
  "success": false,
  "error": {
    "code": "RESUME_PARSE_FAILED",
    "message": "Unable to process the resume."
  },
  "requestId": "uuid"
}
```

## Identity

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/logout-all
GET  /users/me
PATCH /users/me
```

## Profile and resumes

```text
GET   /profile
PATCH /profile
GET   /preferences
PATCH /preferences
POST  /resumes
GET   /resumes
GET   /resumes/:id
DELETE /resumes/:id
GET   /resumes/:id/status
```

Resume upload creates a pending record and returns a processing ID. Parsing is asynchronous.

## Jobs and recommendations

```text
GET  /jobs
GET  /jobs/:id
GET  /recommendations
GET  /recommendations/:id
POST /jobs/:id/save
DELETE /jobs/:id/save
GET  /saved-jobs
```

Supported filters include query, location, remote type, experience, salary, employment type, posted date, source, and minimum match score. Use cursor pagination for feeds.

## Applications

```text
POST  /applications
GET   /applications
GET   /applications/:id
PATCH /applications/:id
POST  /applications/:id/events
```

Application creation records whether the flow is `EXTERNAL_APPLY` or `SUPPORTED_PROVIDER`. Provider submission always requires a final confirmation request.

## AI

```text
POST /ai/resume-analysis
POST /ai/job-analysis
POST /ai/cover-letter
POST /ai/resume-tailor
POST /ai/chat
```

All structured AI responses are validated with Zod schemas before persistence or response.

## API conventions

- DTO validation with whitelist and forbid-unknown-fields behavior.
- Request IDs in logs and responses.
- Consistent pagination metadata.
- Authorization checks in guards and services.
- No provider credentials or internal stack traces in responses.
