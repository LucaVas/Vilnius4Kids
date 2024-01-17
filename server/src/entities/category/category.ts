import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../item/item';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text')
    name: string;

    @ManyToMany(() => Item, (item) => item.categories)
    items: Item[];
}
