import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Record } from '../../records/entities/record.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  photoPath: string;

  @OneToMany(() => Record, (record) => record.item, { cascade: true })
  records: Record[];
}
