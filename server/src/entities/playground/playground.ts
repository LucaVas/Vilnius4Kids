import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../address/address';
import { User } from '../user/user';
import { Rating } from '../rating/rating';
import { Report } from '../report/report';

@Entity('playgrounds')
export class Playground {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('boolean', { nullable: false, default: false })
  isPrivate: boolean;

  @Column('boolean', { nullable: false, default: true })
  isOpen: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Address, address => address.playground, {
    onDelete: 'SET NULL',
  })
  address: Address;

  @ManyToMany(() => User, user => user.playgrounds)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Report, report => report.playgrounds)
  @JoinTable()
  reports: Report[];

  @OneToOne(() => Rating, rating => rating.playground, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  rating: Rating;
}