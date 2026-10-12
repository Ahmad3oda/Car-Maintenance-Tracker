import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';

describe('Database migrations', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({ ...dataSourceOptions, database: ':memory:' });
    await dataSource.initialize();
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('build exactly the schema the entities describe', async () => {
    await dataSource.runMigrations();
    // Fails when an entity changes without a matching migration
    // (fix: npm run migration:generate -- src/database/migrations/<Name>).
    const pending = await dataSource.driver.createSchemaBuilder().log();
    expect(pending.upQueries.map((q) => q.query)).toEqual([]);
  });

  it('refuses a database created before migrations, with a clear message', async () => {
    await dataSource.query(
      `CREATE TABLE "cars" ("id" integer PRIMARY KEY, "plateNumber" varchar UNIQUE)`,
    );
    await expect(dataSource.runMigrations()).rejects.toThrow(
      /created before schema migrations.*delete the database file/,
    );
  });

  it('can be reverted', async () => {
    await dataSource.runMigrations();
    await dataSource.undoLastMigration();
    const tables = await dataSource.query<{ name: string }[]>(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('users', 'cars', 'items', 'maintenance_records')`,
    );
    expect(tables).toEqual([]);
  });
});
