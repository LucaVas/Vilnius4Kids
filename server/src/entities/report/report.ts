import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
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

    @OneToOne(() => ReportCategory, (category) => category.report, {
        cascade: true,
    })
    @JoinColumn()
    category: ReportCategory;

    @ManyToOne(() => User, (user) => user.reports, {
        onDelete: 'SET NULL',
    })
    user: User;

    @OneToMany(() => ReportStatusChangeLog, (log) => log.report, {
        onDelete: 'SET NULL',
    })
    changeLogs: ReportStatusChangeLog[];

    @ManyToOne(() => Playground, (playground) => playground.reports)
    playground: Playground;
}
