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
  @Column({ type: 'datetime', nullable: true })
  installedDate: Date | null;

  @Column({ type: 'int', nullable: true })
  installedKm: number | null;

  @Column({ type: 'int', nullable: true })
  expectedMaintenanceKm: number | null;

  @Column({ type: 'int', nullable: true })
  expectedMaintenanceMonths: number | null;

  @Column({ type: 'int', nullable: true })
  lastMaintenanceId: number | null;

  @Column({ type: 'datetime', nullable: true })
  lastMaintenanceDate: Date | null;

  @Column({ type: 'int', nullable: true })
  nextMaintenanceKm: number | null;

  @Column({ type: 'datetime', nullable: true })
  nextMaintenanceDate: Date | null;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MaintenanceRecord, (record) => record.item, { cascade: true })
  maintenanceRecords: MaintenanceRecord[];
}
