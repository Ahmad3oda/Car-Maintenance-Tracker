import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from '../../cars/entities/car.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /** As typed at registration; shown in the UI. */
  @Column()
  username: string;

  /** Lower-cased username; makes uniqueness and login case-insensitive. */
  @Column({ unique: true })
  usernameKey: string;

  /** bcrypt hash; never serialized. */
  @Column({ select: false })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];
}
