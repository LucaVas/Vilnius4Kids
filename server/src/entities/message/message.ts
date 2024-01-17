import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '..';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text')
    role: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User, (user) => user.rooms, { onDelete: 'CASCADE' })
    user: User;
}
