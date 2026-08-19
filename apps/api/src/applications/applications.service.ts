import {
  BadRequestException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { ApplicationEntity } from '@jobpilot/database';
import type { DataSource } from 'typeorm';
import { z } from 'zod';
import {
  applicationStatuses,
  Application,
  CreateApplicationInput,
} from './applications.types';
import { DATABASE_DATA_SOURCE } from '../database/database.constants';

const createApplicationSchema = z.object({
  company: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(120),
  status: z.enum(applicationStatuses).optional().default('Applied'),
});

@Injectable()
export class ApplicationsService {
  constructor(
    @Optional()
    @Inject(DATABASE_DATA_SOURCE)
    private readonly dataSource: DataSource | null,
  ) {}

  private readonly applications: Application[] = [
    {
      id: 'linear-product-designer',
      company: 'Linear',
      role: 'Product Designer',
      status: 'Interview',
      date: 'Today',
    },
    {
      id: 'vercel-senior-designer',
      company: 'Vercel',
      role: 'Senior Designer',
      status: 'Screening',
      date: 'Yesterday',
    },
    {
      id: 'notion-ux-researcher',
      company: 'Notion',
      role: 'UX Researcher',
      status: 'Applied',
      date: 'Aug 16',
    },
  ];

  async list(userId: string): Promise<Application[]> {
    if (!this.dataSource?.isInitialized) return this.applications;

    const records = await this.dataSource
      .getRepository(ApplicationEntity)
      .find({
        where: { userId },
        order: { updatedAt: 'DESC' },
      });
    return records.map((record) => this.toApplication(record));
  }

  async create(
    input: CreateApplicationInput,
    userId: string,
  ): Promise<Application> {
    const result = createApplicationSchema.safeParse(input);

    if (!result.success) {
      throw new BadRequestException(
        'Company, role, and a valid status are required.',
      );
    }

    if (this.dataSource?.isInitialized) {
      const record = await this.dataSource
        .getRepository(ApplicationEntity)
        .save({
          userId,
          company: result.data.company,
          role: result.data.role,
          status: result.data.status,
          appliedAt: new Date().toISOString().slice(0, 10),
          jobId: null,
          applyUrl: null,
          notes: null,
        });
      return this.toApplication(record);
    }

    const application: Application = {
      id: crypto.randomUUID(),
      company: result.data.company,
      role: result.data.role,
      status: result.data.status,
      date: 'Just now',
    };

    this.applications.unshift(application);
    return application;
  }

  private toApplication(record: ApplicationEntity): Application {
    return {
      id: record.id,
      company: record.company,
      role: record.role,
      status: record.status as Application['status'],
      date:
        record.appliedAt === new Date().toISOString().slice(0, 10)
          ? 'Today'
          : record.appliedAt,
    };
  }
}
