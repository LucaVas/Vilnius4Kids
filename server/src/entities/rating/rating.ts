import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playground } from '../plaground/playground';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('decimal', { nullable: false, default: 0, precision: 2 })
  rating: number;

  @Column('integer', { nullable: false, default: 0 })
  votes: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => Playground, playground => playground.rating, {
    onDelete: 'SET NULL',
  })
  playground: Playground;
}
