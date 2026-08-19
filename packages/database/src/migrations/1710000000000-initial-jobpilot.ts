import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitialJobpilot1710000000000 implements MigrationInterface {
  name = "InitialJobpilot1710000000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "firstName" character varying(60) NOT NULL, "lastName" character varying(60) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(), "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "UQ_users_email" UNIQUE ("email"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resumes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "filename" character varying(255) NOT NULL, "status" character varying(80) NOT NULL, "extractedProfile" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(), "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_resumes_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "source" character varying(80) NOT NULL, "externalId" character varying(255) NOT NULL, "companyName" character varying(160) NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "location" character varying(160) NOT NULL, "remoteType" character varying(40) NOT NULL, "matchScore" integer NOT NULL DEFAULT 0, "skills" text[] NOT NULL DEFAULT '{}', "applyUrl" character varying(500) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(), "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_jobs_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_jobs_source_external" ON "jobs" ("source", "externalId")`,
    );
    await queryRunner.query(
      `CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "jobId" uuid, "company" character varying(160) NOT NULL, "role" character varying(255) NOT NULL, "status" character varying(40) NOT NULL, "appliedAt" date NOT NULL, "applyUrl" character varying(500), "notes" text, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(), "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_applications_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_applications_user_updated" ON "applications" ("userId", "updatedAt")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_applications_user_updated"`);
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP INDEX "IDX_jobs_source_external"`);
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TABLE "resumes"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
