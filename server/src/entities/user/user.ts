import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../address/address';
import { Playground } from '../plaground/playground';
import { Report } from '../report/report';
import { Role } from './Role';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 60, nullable: false, unique: true })
  username: string;

  @Column('varchar', { length: 64, select: false, nullable: false })
  password: string;

  @Column('enum', {
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @ManyToOne(() => Address, address => address.users, {
    onDelete: 'SET NULL',
  })
  address: Address;

  @ManyToMany(() => Playground, playground => playground.users)
  playgrounds: Playground[];

  @OneToMany(() => Report, report => report.user, { onDelete: 'SET NULL' })
  reports: Report[];
}
