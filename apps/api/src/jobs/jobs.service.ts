import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { JobEntity } from '@jobpilot/database';
import type { DataSource } from 'typeorm';
import { DATABASE_DATA_SOURCE } from '../database/database.constants';
import type { Job } from './jobs.types';
import { AshbyAdapter } from './sources/ashby.adapter';
import { GreenhouseAdapter } from './sources/greenhouse.adapter';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly greenhouseAdapter: GreenhouseAdapter,
    private readonly ashbyAdapter: AshbyAdapter,
    @Optional()
    @Inject(DATABASE_DATA_SOURCE)
    private readonly dataSource: DataSource | null,
  ) {}

  private readonly jobs: Job[] = [
    {
      id: 'acme-frontend',
      company: 'Acme Technologies',
      title: 'Frontend Engineer',
      location: 'Noida',
      remoteType: 'Hybrid',
      salary: '₹8-14 LPA',
      posted: '12 minutes ago',
      matchScore: 94,
      skills: ['React', 'TypeScript', 'Next.js'],
      source: 'Greenhouse',
      applyUrl: 'https://example.com/jobs/acme-frontend',
    },
    {
      id: 'northstar-react',
      company: 'Northstar Labs',
      title: 'React Developer',
      location: 'Gurgaon',
      remoteType: 'Remote',
      salary: '₹10-16 LPA',
      posted: '2 hours ago',
      matchScore: 89,
      skills: ['React', 'Redux', 'Jest'],
      source: 'Ashby',
      applyUrl: 'https://example.com/jobs/northstar-react',
    },
    {
      id: 'orbit-ui',
      company: 'Orbit Cloud',
      title: 'UI Engineer',
      location: 'Bengaluru',
      remoteType: 'On-site',
      salary: '₹12-20 LPA',
      posted: 'Today',
      matchScore: 82,
      skills: ['JavaScript', 'Tailwind', 'Node.js'],
      source: 'Employer site',
      applyUrl: 'https://example.com/jobs/orbit-ui',
    },
  ];

  list() {
    return this.jobs;
  }

  async listLive() {
    const sources = [
      ...this.boards('GREENHOUSE_BOARDS').map((board) =>
        this.greenhouseAdapter.fetchJobs(board),
      ),
      ...this.boards('ASHBY_BOARDS').map((board) =>
        this.ashbyAdapter.fetchJobs(board),
      ),
    ];
    const externalJobs = (await Promise.all(sources)).flat();
    const normalizedJobs = externalJobs.map((job) => ({
      id: `${job.source.toLowerCase()}-${job.externalId}`,
      ...job,
      matchScore: this.score(job.skills),
      posted: job.posted ?? 'Recently posted',
      salary: job.salary ?? 'Salary not listed',
    }));
    await this.persist(normalizedJobs);
    return normalizedJobs;
  }

  private async persist(jobs: Job[]) {
    if (!this.dataSource?.isInitialized || jobs.length === 0) return;
    try {
      await this.dataSource.getRepository(JobEntity).upsert(
        jobs.map((job) => ({
          source: job.source,
          externalId: job.id.split('-').slice(1).join('-'),
          companyName: job.company,
          title: job.title,
          description: '',
          location: job.location,
          remoteType: job.remoteType,
          matchScore: job.matchScore,
          skills: job.skills,
          applyUrl: job.applyUrl,
          isActive: true,
        })),
        ['source', 'externalId'],
      );
    } catch (error) {
      this.logger.warn(
        'Live jobs were fetched but could not be persisted. Run the database migration first.',
      );
    }
  }

  private boards(variable: string) {
    return (process.env[variable] ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  private score(skills: string[]) {
    const profileSkills = [
      'React',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'Node.js',
    ];
    const matches = skills.filter((skill) =>
      profileSkills.includes(skill),
    ).length;
    return Math.min(98, 60 + matches * 8);
  }
}
