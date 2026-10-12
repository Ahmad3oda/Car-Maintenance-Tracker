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
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Item } from '../../items/entities/item.entity';
import { MaintenanceRecord } from '../../maintenance-records/entities/maintenance-record.entity';

@Entity('cars')
// Unique within one user's cars; different users may share a plate.
@Unique('UQ_cars_user_plate', ['userId', 'plateNumber'])
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
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
