import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Playground } from '../playground/playground';
import { User } from '..';

@Entity('ratings')
export class Rating {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('decimal', { nullable: false, default: 0, precision: 3, scale: 2 })
    rating: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Playground, (playground) => playground.ratings, {
        onDelete: 'CASCADE',
    })
    playground: Playground;

    @ManyToOne(() => User, (user) => user.ratings, {
        onDelete: 'CASCADE',
    })
    user: Playground;
}
