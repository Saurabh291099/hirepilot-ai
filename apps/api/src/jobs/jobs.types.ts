export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  remoteType: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  posted: string;
  matchScore: number;
  skills: string[];
  source: string;
  applyUrl: string;
}
