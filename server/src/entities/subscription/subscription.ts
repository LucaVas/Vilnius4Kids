import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '..';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 255, nullable: false, unique: true })
    email: string;

    @Column('boolean', { nullable: false })
    isUser: boolean;

    @Column('boolean', { nullable: false })
    isContacted: boolean;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    subscribedAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.subscription, {
        onDelete: 'CASCADE', // When a user is deleted, delete the subscription
    })
    user: User;
}
