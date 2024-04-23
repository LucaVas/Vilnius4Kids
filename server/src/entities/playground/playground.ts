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

    @Column('decimal', { nullable: false, precision: 9, scale: 6 })
    latitude: number;

    @Column('decimal', { nullable: false, precision: 9, scale: 6 })
    longitude: number;

    @Column('varchar', { length: 500, nullable: true })
    description: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Address, (address) => address.playground, {
        cascade: ['insert'],
    })
    @JoinColumn()
    address: Address;

    @ManyToMany(() => User, (user) => user.playgrounds, {
        onDelete: 'SET NULL', // When a user is deleted, set null
    })
    @JoinTable()
    users: User[];

    @OneToMany(() => Report, (report) => report.playground)
    reports: Report[];

    @OneToMany(() => Rating, (rating) => rating.playground)
    ratings: Rating[];
}
