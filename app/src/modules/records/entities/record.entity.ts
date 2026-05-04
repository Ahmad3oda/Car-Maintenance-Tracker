import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemId: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'integer' })
  kmCounter: number;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
