import type { Job } from '../jobs.types';

export interface ExternalJob {
  externalId: string;
  company: string;
  title: string;
  description: string;
  location: string;
  remoteType: Job['remoteType'];
  salary?: string;
  posted?: string;
  skills: string[];
  source: string;
  applyUrl: string;
}

export interface JobSourceAdapter {
  readonly sourceName: string;
  fetchJobs(board: string): Promise<ExternalJob[]>;
}
