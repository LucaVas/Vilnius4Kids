import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category, Room } from '..';

@Entity()
export class Item {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    imageUrl: string;

    @Column('integer')
    price: number;

    @Column('integer')
    width: number;

    @Column('integer')
    length: number;

    @Column('float', { default: 0.0 })
    x: number;

    @Column('float', { default: 0.0 })
    y: number;

    @ManyToMany(() => Category, (category) => category.items)
    @JoinTable()
    categories: Category[];

    @ManyToOne(() => Room, (room) => room.items, { nullable: true, onDelete: 'CASCADE' })
    room: Room | null;
}
