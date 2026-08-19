import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { validateEnvironment } from './config/env.config';
import { JobsModule } from './jobs/jobs.module';
import { ResumesModule } from './resumes/resumes.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ApplicationsModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../.env'),
      isGlobal: true,
      validate: validateEnvironment,
    }),
    JobsModule,
    ResumesModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
