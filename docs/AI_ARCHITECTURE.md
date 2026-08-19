# JobPilot AI Architecture

## Provider abstraction

```ts
interface AIProvider {
  generateText(input: TextGenerationInput): Promise<string>;
  generateStructuredOutput<T>(
    input: StructuredInput,
    schema: Schema<T>,
  ): Promise<T>;
  createEmbedding(input: string): Promise<number[]>;
}
```

Controllers call application services, not model SDKs. Provider selection, model limits, retries, and usage accounting belong to the AI package.

## Hybrid matching

1. Apply hard filters for status, location, work mode, experience, employment type, and salary.
2. Compare normalized required/preferred skills with user skills.
3. Compare resume/job embeddings using pgvector.
4. Ask the model for constrained, explainable reasoning.
5. Combine deterministic features and reasoning into a stored result.

Default configurable weights:

```text
Skills 35% | Experience 20% | Role 15% | Location 10%
Salary 10% | Domain 5% | Education 5%
```

## Output contract

```json
{
  "score": 91,
  "recommendation": "HIGHLY_RECOMMENDED",
  "strengths": ["React", "TypeScript", "3+ years experience"],
  "missingSkills": ["GraphQL"],
  "concerns": [],
  "reasoning": "Strong role and skills alignment...",
  "model": "provider-model-id",
  "promptVersion": "job-matcher-v1"
}
```

## AI tasks

- Resume extraction into a versioned schema.
- Skill and role classification.
- Job description analysis.
- Match explanation and missing-skill recommendations.
- Resume tailoring suggestions with reviewable diffs.
- Cover letter drafting.
- Career assistant with user-scoped retrieval.

## Guardrails

- Validate every structured response.
- Never fabricate experience, employers, skills, education, or achievements.
- Show generated edits before acceptance.
- Cache embeddings and stable job analyses.
- Enforce per-user quotas, token limits, rate limits, and audit metadata.
- Do not use private resumes for model training without explicit consent.
