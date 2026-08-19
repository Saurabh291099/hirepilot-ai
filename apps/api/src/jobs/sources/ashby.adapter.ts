import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { JobSourceAdapter, ExternalJob } from './job-source.types';

type AshbyJob = {
  id: string;
  title: string;
  descriptionPlain?: string;
  location?: string;
  jobUrl?: string;
  applyUrl?: string;
  publishedAt?: string;
};

@Injectable()
export class AshbyAdapter implements JobSourceAdapter {
  readonly sourceName = 'Ashby';

  async fetchJobs(board: string): Promise<ExternalJob[]> {
    try {
      const response = await fetch(
        `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}`,
      );
      if (!response.ok) throw new Error(`Ashby returned ${response.status}`);
      const data = (await response.json()) as { jobs?: AshbyJob[] };
      return (data.jobs ?? []).map((job) => ({
        externalId: job.id,
        company: board,
        title: job.title,
        description: job.descriptionPlain ?? '',
        location: job.location ?? 'Location not specified',
        remoteType: /remote/i.test(job.location ?? '')
          ? 'Remote'
          : /hybrid/i.test(job.location ?? '')
            ? 'Hybrid'
            : 'On-site',
        posted: job.publishedAt,
        skills: this.extractSkills(
          `${job.title} ${job.descriptionPlain ?? ''}`,
        ),
        source: this.sourceName,
        applyUrl: job.applyUrl ?? job.jobUrl ?? '',
      }));
    } catch (error) {
      throw new ServiceUnavailableException(
        `Unable to fetch ${this.sourceName} jobs for ${board}.`,
      );
    }
  }

  private extractSkills(text: string) {
    const knownSkills = [
      'React',
      'TypeScript',
      'JavaScript',
      'Next.js',
      'Node.js',
      'Python',
      'Java',
      'AWS',
      'PostgreSQL',
      'GraphQL',
      'Tailwind',
    ];
    return knownSkills.filter((skill) =>
      new RegExp(skill.replace('.', '\\.'), 'i').test(text),
    );
  }
}
