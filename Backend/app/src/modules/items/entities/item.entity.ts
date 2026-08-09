import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { MaintenanceRecord } from '../../maintenance-records/entities/maintenance-record.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carId: number;

  @ManyToOne(() => Car, (car) => car.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', nullable: true })
  photoPath: string | null;

  @Column({ type: 'datetime', nullable: true })
  installedDate: Date;

  @Column({ type: 'int', nullable: true })
  installedKm: number;

  @Column({ type: 'int', nullable: true })
  expectedMaintenanceKm: number;

  @Column({ type: 'int', nullable: true })
  expectedMaintenanceMonths: number;

  @Column({ type: 'int', nullable: true })
  lastMaintenanceId: number;

  @Column({ type: 'datetime', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'int', nullable: true })
  nextMaintenanceKm: number;

  @Column({ type: 'datetime', nullable: true })
  nextMaintenanceDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MaintenanceRecord, (record) => record.item, { cascade: true })
  maintenanceRecords: MaintenanceRecord[];
}
