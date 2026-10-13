import { extname, join } from 'path';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { getDbPath } from '../common/utils/paths.util';
import { User } from '../modules/auth/entities/user.entity';
import { Car } from '../modules/cars/entities/car.entity';
import { Item } from '../modules/items/entities/item.entity';
import { MaintenanceRecord } from '../modules/maintenance-records/entities/maintenance-record.entity';

/**
 * Schema changes go through migrations (src/database/migrations), never
 * synchronize. The app runs pending migrations on startup.
 */
export const dataSourceOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  database: getDbPath(),
  entities: [User, Car, Item, MaintenanceRecord],
  // .js when built, .ts under ts-node/Jest; never the emitted .d.ts files.
  migrations: [join(__dirname, 'migrations', `*${extname(__filename)}`)],
  synchronize: false,
};

/** Used by the TypeORM CLI (npm run migration:*). */
export default new DataSource(dataSourceOptions);
