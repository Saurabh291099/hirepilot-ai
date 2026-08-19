import "reflect-metadata";
import { DataSource } from "typeorm";
import { ApplicationEntity } from "./entities/application.entity";
import { JobEntity } from "./entities/job.entity";
import { ResumeEntity } from "./entities/resume.entity";
import { UserEntity } from "./entities/user.entity";
import { InitialJobpilot1710000000000 } from "./migrations/1710000000000-initial-jobpilot";

export function createDatabaseDataSource(
  databaseUrl = process.env.DATABASE_URL,
) {
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required to create the database data source",
    );
  }

  return new DataSource({
    type: "postgres",
    url: databaseUrl,
    entities: [UserEntity, ResumeEntity, JobEntity, ApplicationEntity],
    migrations: [InitialJobpilot1710000000000],
    synchronize: false,
    logging: false,
  });
}
