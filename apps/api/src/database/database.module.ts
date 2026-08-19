import { Module } from '@nestjs/common';
import { createDatabaseDataSource } from '@jobpilot/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import type { DataSource } from 'typeorm';
import { DATABASE_DATA_SOURCE } from './database.constants';

config({ path: resolve(__dirname, '../.env') });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../.env'),
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: DATABASE_DATA_SOURCE,
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<DataSource | null> => {
        const databaseUrl =
          configService.get<string>('DATABASE_URL') ?? process.env.DATABASE_URL;
        if (!databaseUrl) return null;
        const dataSource = createDatabaseDataSource(databaseUrl);
        return dataSource.isInitialized ? dataSource : dataSource.initialize();
      },
    },
  ],
  exports: [DATABASE_DATA_SOURCE],
})
export class DatabaseModule {}
