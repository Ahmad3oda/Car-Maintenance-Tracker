/**
 * Gives cars that have no owner (created before user accounts existed) to
 * one user. Usage, after `npm run build` and starting the new app once:
 *
 *   npm run assign-cars -- <username> [--dry-run]
 *
 * Copies the database file to <db>.backup-<timestamp> before writing.
 */
import { copyFileSync, existsSync } from 'fs';
import { DataSource } from 'typeorm';
import { getDbPath } from '../common/utils/paths.util';

export interface AssignResult {
  username: string;
  carIds: number[];
}

/** Assigns every owner-less car to `username`; returns the affected cars. */
export async function assignOrphanCars(
  dataSource: DataSource,
  username: string,
  options: { dryRun?: boolean } = {},
): Promise<AssignResult> {
  const columns: { name: string }[] = await dataSource.query(
    `PRAGMA table_info("cars")`,
  );
  if (!columns.some((c) => c.name === 'userId')) {
    throw new Error(
      'cars.userId does not exist yet: start the new version of the app once so it can update the schema, then run this again',
    );
  }

  const users: { id: number; username: string }[] = await dataSource.query(
    `SELECT id, username FROM users WHERE usernameKey = ?`,
    [username.toLowerCase()],
  );
  if (users.length === 0) {
    throw new Error(`No user named "${username}"; register it first`);
  }
  const user = users[0];

  const orphans: { id: number }[] = await dataSource.query(
    `SELECT id FROM cars WHERE userId IS NULL ORDER BY id`,
  );
  const carIds = orphans.map((c) => c.id);
  if (carIds.length > 0 && !options.dryRun) {
    await dataSource.query(`UPDATE cars SET userId = ? WHERE userId IS NULL`, [
      user.id,
    ]);
  }
  return { username: user.username, carIds };
}

async function main(argv: string[]): Promise<void> {
  const dryRun = argv.includes('--dry-run');
  const username = argv.find((a) => !a.startsWith('--'));
  if (!username) {
    throw new Error('Usage: npm run assign-cars -- <username> [--dry-run]');
  }

  if (existsSync('.env')) process.loadEnvFile('.env');
  const dbPath = getDbPath();
  if (!existsSync(dbPath)) {
    throw new Error(`Database not found: ${dbPath} (set DB_PATH)`);
  }

  const dataSource = new DataSource({ type: 'sqlite', database: dbPath });
  await dataSource.initialize();
  try {
    // Validates the schema and user, and finds the cars, without writing.
    const preview = await assignOrphanCars(dataSource, username, {
      dryRun: true,
    });
    if (preview.carIds.length === 0) {
      console.log('No cars without an owner; nothing to do.');
      return;
    }
    if (dryRun) {
      console.log(
        `Would assign ${preview.carIds.length} car(s) to "${preview.username}": ids ${preview.carIds.join(', ')}`,
      );
      return;
    }

    const backup = `${dbPath}.backup-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    copyFileSync(dbPath, backup);
    console.log(`Backup written to ${backup}`);
    const { username: owner, carIds } = await assignOrphanCars(
      dataSource,
      username,
    );
    console.log(
      `Assigned ${carIds.length} car(s) to "${owner}": ids ${carIds.join(', ')}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
}
