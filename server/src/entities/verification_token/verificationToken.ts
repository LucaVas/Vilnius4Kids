import {
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '..';

@Entity('verification_tokens')
export class VerificationToken {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 255, nullable: false, unique: true })
    token: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToOne(() => User, (user) => user.verificationToken, {
        onDelete: 'CASCADE',
    })
    user: User;
}
