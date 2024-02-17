import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user';
import { Playground } from '../playground/playground';
import { ReportStatusChangeLog } from '../report_status_change_log/reportStatusChangeLog';
import { ReportCategory } from '../report_category/reportCategory';
import { ReportStatus } from './ReportStatus';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 500, nullable: false })
    description: string;

    @Column('enum', {
        enum: ReportStatus,
        default: ReportStatus.OPEN,
    })
    status: ReportStatus;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => ReportCategory, (category) => category.reports, {
        cascade: true,
    })
    category: ReportCategory;

    @ManyToOne(() => User, (user) => user.reports, {
        onDelete: 'CASCADE', // When a user is deleted, delete the report as well
    })
    user: User;

    @OneToMany(() => ReportStatusChangeLog, (log) => log.report)
    changeLogs: ReportStatusChangeLog[];

    @ManyToOne(() => Playground, (playground) => playground.reports)
    playground: Playground;
}
