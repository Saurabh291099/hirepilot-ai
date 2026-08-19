import { createDatabaseDataSource } from './data-source';

async function migrate() {
  const dataSource = createDatabaseDataSource();
  await dataSource.initialize();
  const migrations = await dataSource.runMigrations();
  console.log(`Applied ${migrations.length} migration(s).`);
  await dataSource.destroy();
}

migrate().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
