import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { JobSourceAdapter, ExternalJob } from './job-source.types';

type GreenhouseJob = {
  id: number;
  title: string;
  content?: string;
  location?: { name?: string };
  absolute_url: string;
  updated_at?: string;
};

@Injectable()
export class GreenhouseAdapter implements JobSourceAdapter {
  readonly sourceName = 'Greenhouse';

  async fetchJobs(board: string): Promise<ExternalJob[]> {
    try {
      const response = await fetch(
        `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(board)}/jobs?content=true`,
      );
      if (!response.ok)
        throw new Error(`Greenhouse returned ${response.status}`);
      const data = (await response.json()) as { jobs?: GreenhouseJob[] };
      return (data.jobs ?? []).map((job) => ({
        externalId: String(job.id),
        company: board,
        title: job.title,
        description: job.content ?? '',
        location: job.location?.name ?? 'Location not specified',
        remoteType: this.remoteType(job.location?.name),
        posted: job.updated_at,
        skills: this.extractSkills(`${job.title} ${job.content ?? ''}`),
        source: this.sourceName,
        applyUrl: job.absolute_url,
      }));
    } catch (error) {
      throw new ServiceUnavailableException(
        `Unable to fetch ${this.sourceName} jobs for ${board}.`,
      );
    }
  }

  private remoteType(location = ''): ExternalJob['remoteType'] {
    return /remote/i.test(location)
      ? 'Remote'
      : /hybrid/i.test(location)
        ? 'Hybrid'
        : 'On-site';
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
