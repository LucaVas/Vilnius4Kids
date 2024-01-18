import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user';
import { Playground } from '../plaground/playground';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  street: string;

  @Column('int', { nullable: false })
  number: number;

  @Column('int', { nullable: false })
  zipCode: number;

  @Column('varchar', { length: 255, nullable: false })
  city: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => User, user => user.address, { onDelete: 'SET NULL' })
  users: User[];

  @OneToMany(() => Playground, playground => playground.address, {
    onDelete: 'SET NULL',
  })
  playground: Playground;
}
