import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '..';

@Entity('password_change_requests')
export class PasswordChangeRequest {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 255, nullable: false, unique: true })
    passwordResetToken: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToOne(() => User, (user) => user.passwordChangeRequest, {
        onDelete: 'CASCADE', // When a user is deleted, delete the verification token as well
    })
    user: User;
}
