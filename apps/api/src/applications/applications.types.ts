export const applicationStatuses = [
  'Saved',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Rejected',
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  date: string;
}

export interface CreateApplicationInput {
  company: string;
  role: string;
  status?: ApplicationStatus;
}
