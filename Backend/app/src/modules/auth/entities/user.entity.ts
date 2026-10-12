import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
