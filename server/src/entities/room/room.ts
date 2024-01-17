import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Item, User } from '..';

@Entity()
export class Room {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text')
    name: string;

    @Column('float')
    width: number;

    @Column('float')
    length: number;

    @Column('float', { default: 0.0 })
    area: number;

    @ManyToOne(() => User, (user) => user.rooms, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Item, (item) => item.room, {
        nullable: true,
    })
    items: Item[];
}
