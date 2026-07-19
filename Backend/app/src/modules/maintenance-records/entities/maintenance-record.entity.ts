import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('maintenance_records')
export class MaintenanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carId: number;

  @ManyToOne(() => Car, (car) => car.maintenanceRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column()
  itemId: number;

  @ManyToOne(() => Item, (item) => item.maintenanceRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column({ type: 'datetime' })
  maintenanceDate: Date;

  @Column({ type: 'int' })
  kmCounter: number;

  @Column({ type: 'real' })
  itemCost: number;

  @Column({ type: 'simple-json', nullable: true })
  extraCosts: any;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
