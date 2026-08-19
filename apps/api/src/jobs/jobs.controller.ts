import { Controller, Get } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  list() {
    return this.jobsService.list();
  }

  @Get('live')
  live() {
    return this.jobsService.listLive();
  }
}
