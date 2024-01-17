import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Room } from '..';
import { Message } from '../message/message';

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Unique(['email'])
    @Column('text')
    email: string;

    @Column('text', { select: false })
    password: string;

    @OneToMany(() => Room, (room) => room.user, { cascade: true })
    rooms: Room[];

    @OneToMany(() => Message, (message) => message.user, { cascade: true })
    messages: Message[];
}
