import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../address/address';
import { Playground } from '../playground/playground';
import { Report } from '../report/report';
import { Rating } from '..';
import { VerificationToken } from '../verification_token/verificationToken';
import { Role } from './Role';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 255, nullable: false, unique: true })
    email: string;

    @Column('varchar', { length: 60, nullable: false, unique: true })
    username: string;

    @Column('varchar', { length: 64, select: false, nullable: false })
    password: string;

    @Column('enum', {
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    @Column('boolean', { default: false, nullable: false })
    isRegistered: boolean;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Address, (address) => address.users, {
        onDelete: 'SET NULL',
    })
    address: Address;

    @ManyToMany(() => Playground, (playground) => playground.users, {
        onDelete: 'CASCADE',
    })
    playgrounds: Playground[];

    @OneToMany(() => Report, (report) => report.user, { onDelete: 'CASCADE' })
    reports: Report[];

    @OneToMany(() => Rating, (rating) => rating.user, { onDelete: 'CASCADE' })
    ratings: Rating[];

    @OneToOne(
        () => VerificationToken,
        (verificationToken) => verificationToken.user,
    )
    @JoinColumn()
    verificationToken: VerificationToken;
}
