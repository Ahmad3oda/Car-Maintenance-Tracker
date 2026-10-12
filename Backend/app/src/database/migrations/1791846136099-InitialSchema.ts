import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Baseline schema: users, cars (one owner each; plate unique per owner),
 * items and maintenance records. Databases created before migrations (by
 * the old synchronize setting) held test data only and must be deleted.
 */
export class InitialSchema1791846136099 implements MigrationInterface {
  name = 'InitialSchema1791846136099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('cars')) {
      throw new Error(
        'This database was created before schema migrations were introduced. ' +
          'It only holds test data: delete the database file (DB_PATH) and ' +
          'restart to create a fresh one.',
      );
    }

    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "usernameKey" varchar NOT NULL, "passwordHash" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fddaf46b524fa6c88ac581ce8c4" UNIQUE ("usernameKey"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cars" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "plateNumber" varchar NOT NULL, "brand" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "currentKm" integer NOT NULL DEFAULT (0), "photoPath" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_cars_user_plate" UNIQUE ("userId", "plateNumber"), CONSTRAINT "FK_6431b6fec12c4090bb357fba2c2" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6431b6fec12c4090bb357fba2c" ON "cars" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "carId" integer NOT NULL, "name" varchar NOT NULL, "description" text, "manufacturer" varchar, "photoPath" varchar, "installedDate" datetime, "installedKm" integer, "expectedMaintenanceKm" integer, "expectedMaintenanceMonths" integer, "lastMaintenanceId" integer, "lastMaintenanceDate" datetime, "nextMaintenanceKm" integer, "nextMaintenanceDate" datetime, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_67564043fc7e95b08ea7381bb91" FOREIGN KEY ("carId") REFERENCES "cars" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `CREATE TABLE "maintenance_records" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "carId" integer NOT NULL, "itemId" integer NOT NULL, "maintenanceDate" datetime NOT NULL, "kmCounter" integer NOT NULL, "itemCost" real NOT NULL, "extraCosts" text, "notes" text, "photoPath" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_183560b5c65b5855a4aae676767" FOREIGN KEY ("carId") REFERENCES "cars" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_964684fbf233aa4fafcf9f5396c" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "maintenance_records"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP INDEX "IDX_6431b6fec12c4090bb357fba2c"`);
    await queryRunner.query(`DROP TABLE "cars"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
