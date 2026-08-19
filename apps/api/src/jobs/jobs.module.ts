import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { AshbyAdapter } from './sources/ashby.adapter';
import { GreenhouseAdapter } from './sources/greenhouse.adapter';

@Module({
  imports: [DatabaseModule],
  controllers: [JobsController],
  providers: [JobsService, GreenhouseAdapter, AshbyAdapter],
})
export class JobsModule {}
