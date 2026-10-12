import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Item } from '../../items/entities/item.entity';
import { MaintenanceRecord } from '../../maintenance-records/entities/maintenance-record.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Owner. Nullable only so existing rows survive the schema update; cars
   * without an owner are visible to nobody until assigned
   * (npm run assign-cars).
   */
  @Index()
  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @ManyToOne(() => User, (user) => user.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Globally unique, as before: SQLite schema sync cannot drop the existing
  // constraint to make it per-user without a hand-written migration.
  @Column({ unique: true })
  plateNumber: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int', default: 0 })
  currentKm: number;

  @Column({ type: 'varchar', nullable: true })
  photoPath: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Item, (item) => item.car, { cascade: true })
  items: Item[];

  @OneToMany(() => MaintenanceRecord, (record) => record.car, { cascade: true })
  maintenanceRecords: MaintenanceRecord[];
}
